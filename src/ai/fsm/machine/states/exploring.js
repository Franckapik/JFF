/**
 * ============================================================================
 * État EXPLORING - Exploration et découverte
 * ============================================================================
 * 
 * État d'exploration pour découvrir de nouvelles ressources.
 * Déploie des drones et explore la carte.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';
import { contextReducers } from '../reducers/context.js';
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents.js';
import { safetyGuards } from '../guards/index.js';
import { discoveryGuards } from '../guards/index.js';

/**
 * État EXPLORING - Exploration et découverte de ressources
 */
export const exploringState = state(
  // === ÉVÉNEMENTS DE PROGRESSION ===
  
  // Drone déployé avec succès
  transition(MOVEMENT_EVENT_TYPES.DRONE_DEPLOYED,
    BOT_STATES.EXPLORING, // Reste en exploration
    () => true,
    reduce((context, event) => {
      // Ce reducer spécifique n'a pas d'équivalent direct dans contextReducers
      // alors nous créons une mise à jour personnalisée
      return {
        ...context,
        isDroneAtShip: false,
        droneTarget: event.targetArea,
        deploymentTime: Date.now(),
        currentAction: 'drone_exploring'
      };
    })
  ),

  // Ressources découvertes pendant l'exploration
  transition(RESOURCE_EVENT_TYPES.RESOURCES_DISCOVERED,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => {
      // Enregistrer les ressources découvertes
      let updatedContext = { ...context };
      
      // Ajouter chaque ressource découverte à la mémoire
      if (event.resources && Array.isArray(event.resources)) {
        event.resources.forEach(resource => {
          updatedContext = contextReducers.resource.recordDiscoveredResource(updatedContext, { resource });
        });
      }
      
      // Préparer l'évaluation avec découverte de ressources
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'resources_found',
        discoveryTime: Date.now()
      });
    })
  ),

  // Zone explorée avec succès
  transition(RESOURCE_EVENT_TYPES.AREA_EXPLORED,
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isExplorationComplete(context, event),
    reduce((context, event) => {
      // Utiliser le reducer d'exploration
      const updatedContext = contextReducers.exploration.markAreaExplored(context, event);
      
      // Préparer l'évaluation après exploration
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'exploration_complete'
      });
    })
  ),

  // === TIMEOUTS ET ÉCHECS ===
  
  // Timeout d'exploration (30s)
  transition(SYSTEM_EVENT_TYPES.EXPLORATION_TIMEOUT,
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isExplorationExpired(context, event),
    reduce((context, event) => {
      // Marquer comme exploré même si incomplet
      const updatedContext = {
        ...context,
        hasExplored: true,
        explorationStatus: 'timeout'
      };
      
      // Utiliser le reducer pour préparer l'évaluation
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'exploration_timeout'
      });
    })
  ),

  // Échec de déploiement du drone
  transition(EMERGENCY_EVENT_TYPES.DRONE_DEPLOYMENT_FAILED,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      hasExplored: true, // Skip exploration si le drone ne peut pas être déployé
      explorationStatus: 'drone_failed',
      errorReason: event.reason,
      currentAction: 'exploration_failed',
      lastStateChange: Date.now()
    }))
  ),

  // Carburant faible détecté pendant l'exploration
  transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED,
    BOT_STATES.RETURNING,
    (context, event) => safetyGuards.isLowFuel(context, event),
    reduce((context, event) => {
      // Utiliser le reducer d'urgence
      const emergencyContext = contextReducers.emergency.triggerEmergency(context, {
        reason: 'low_fuel_during_exploration'
      });
      
      // Puis préparer le retour
      return contextReducers.state.prepareReturning(emergencyContext, {
        reason: 'emergency_return',
        emergencyReason: 'low_fuel_during_exploration'
      });
    })
  ),

  // Override manuel
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer de contrôle manuel
      const manualContext = contextReducers.manual.recordManualCommand(context, event);
      
      // Puis préparer l'évaluation
      return contextReducers.state.prepareEvaluating(manualContext, {
        reason: 'manual_override'
      });
    })
  ),

  // Urgence générale
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED,
    BOT_STATES.RETURNING,
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer d'urgence
      const emergencyContext = contextReducers.emergency.triggerEmergency(context, event);
      
      // Puis préparer le retour
      return contextReducers.state.prepareReturning(emergencyContext, {
        reason: 'emergency_return',
        emergencyReason: event.reason || 'unknown'
      });
    })
  )
);
