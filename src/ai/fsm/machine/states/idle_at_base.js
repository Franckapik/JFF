/**
 * ============================================================================
 * État IDLE_AT_BASE - Inactivité à la base
 * ============================================================================
 * 
 * État d'inactivité à la base où le drone attend des instructions ou des événements.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';
import { contextReducers } from '../reducers/context.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents.js';

/**
 * État IDLE_AT_BASE - Attente à la base
 * Le drone est inactif et attend des instructions ou des événements
 */
export const idleAtBaseState = state(
  // Timeout d'inactivité
  transition(SYSTEM_EVENT_TYPES.IDLE_TIMEOUT,
    BOT_STATES.EVALUATING,
    () => true, // Toujours transitionner vers EVALUATING si timeout
    reduce((context) => ({
      ...context,
      currentAction: 'evaluating',
      lastDecision: 'timeout_evaluation',
      lastStateChange: Date.now()
    }))
  ),

  // Nouvelles ressources détectées
  transition(RESOURCE_EVENT_TYPES.NEW_RESOURCES_DETECTED,
    BOT_STATES.EVALUATING,
    (context, event) => {
      // Vérifier si les nouvelles ressources sont pertinentes
      return context.knownResources?.some(resource => 
        resource.id === event.resourceId && 
        resource.status === 'new');
    },
    reduce((context, event) => {
      // Mettre à jour le statut des ressources connues
      const updatedResources = context.knownResources.map(resource => {
        if (resource.id === event.resourceId) {
          return { ...resource, status: 'discovered' };
        }
        return resource;
      });
      
      return {
        ...context,
        knownResources: updatedResources,
        currentAction: 'evaluating',
        lastDecision: 'new_resources_evaluation',
        lastStateChange: Date.now()
      };
    })
  ),

  // Demande d'exploration
  transition(USER_EVENT_TYPES.EXPLORATION_REQUESTED,
    BOT_STATES.EVALUATING,
    (context, event) => {
      // Vérifier si la demande d'exploration est valide
      return event.areaId && 
             !context.exploredAreas?.includes(event.areaId);
    },
    reduce((context, event) => {
      // Ajouter la nouvelle zone à explorer
      const newExploredAreas = context.exploredAreas 
        ? [...context.exploredAreas, event.areaId]
        : [event.areaId];
      
      return {
        ...context,
        exploredAreas: newExploredAreas,
        currentAction: 'evaluating',
        lastDecision: 'exploration_requested',
        lastStateChange: Date.now()
      };
    })
  ),

  // Override manuel
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      manualCommand: event.command,
      manualParams: event.params,
      lastDecision: 'manual_override',
      lastStateChange: Date.now()
    }))
  )
);