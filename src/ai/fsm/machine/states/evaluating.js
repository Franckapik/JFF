/**
 * ============================================================================
 * État EVALUATING - Évaluation et prise de décision
 * ============================================================================
 * 
 * État central d'évaluation qui détermine la prochaine action à entreprendre.
 * Toutes les transitions d'urgence mènent à cet état.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce, guard } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';
import { contextReducers } from '../reducers/context.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';
import { movementActions } from '../actions/core/movementActions.js';

/**
 * État EVALUATING - Point de décision central
 * Évalue la situation et détermine la prochaine action
 */

export const evaluatingState = state(
  // === TRANSITIONS DE SÉCURITÉ (PRIORITÉ MAX) ===
  
  // Si carburant critique ou capacité pleine → RETURNING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.RETURNING, 
    // Guard d'urgence
    guard((context, event) => {
      const needsEmergency = safetyGuards.needsEmergencyReturn(context, event);
      const shouldReturnEff = efficiencyGuards.shouldReturnForEfficiency(context, event);
      
      return needsEmergency || shouldReturnEff;
    }),
    // Reducer d'urgence
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour préparer le retour
      const emergencyReason = safetyGuards.isCriticalFuel(context, event) 
        ? 'low_fuel' : 'full_capacity';
      
      // Créer un événement enrichi avec la raison d'urgence
      const enrichedEvent = {
        ...event,
        reason: 'safety_return',
        emergencyReason
      };
      
      // Utiliser le reducer pour préparer le retour
      return contextReducers.state.prepareReturning(context, enrichedEvent);
    })
  ),

  // === TRANSITIONS NORMALES ===
  
  // Si pas encore exploré → EXPLORING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_INIT, 
    // Guard d'exploration
    guard((context, event) => {
      const hasUnexplored = discoveryGuards.hasUnexploredAreas(context, event);
      return hasUnexplored;
    }),
    // Reducer d'exploration
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour préparer l'exploration
      return contextReducers.state.prepareExploring(context, event);
    })
  ),

  // Si nouvelles ressources découvertes → COLLECTING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING, 
    // Guard pour collection
    guard((context, event) => {
      const isEfficient = efficiencyGuards.isCollectionEfficient(context, event);
      const hasNewResources = context.hasNewResourceDiscovery;
      const hasKnownResources = context.knownResources?.length > 0;
      
      return isEfficient && 
             hasNewResources && 
             hasKnownResources;
    }),
    // Reducer pour collection
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour préparer la collecte
      // avec la première ressource connue comme cible
      const resourceEvent = {
        ...event,
        resource: context.knownResources[0] // Prendre la première ressource
      };
      return contextReducers.state.prepareCollecting(context, resourceEvent);
    })
  ),

  // Si drone pas à la base → RETURNING (pour récupérer le drone)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.RETURNING, 
    // Guard pour drone pas à la base
    guard((context, event) => {
      const notAtBase = !baseGuards.isAtBase(context, event);
      return notAtBase;
    }),
    // Reducer pour récupération du drone
    reduce((context) => ({
      ...context,
      currentAction: 'returning_for_drone',
      lastDecision: 'retrieve_drone',
      lastStateChange: Date.now()
    }))
  ),

  // Sinon → IDLE_AT_BASE (rien à faire)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.IDLE_AT_BASE, 
    // Guard par défaut
    guard(() => {
      return true;
    }),
    // Reducer par défaut
    reduce((context) => ({
      ...context,
      currentAction: 'idling',
      lastDecision: 'nothing_to_do',
      lastStateChange: Date.now()
    }))
  ),

  // === ÉVÉNEMENT AUTONOME ===
  
  // Déclenchement automatique vers l'exploration
  transition(SYSTEM_EVENT_TYPES.AUTO, BOT_STATES.EXPLORING_INIT, 
    guard(() => true),
    reduce((context) => {
      // Préparer l'état d'exploration
      return contextReducers.state.prepareExploring(context, {
        reason: 'auto_exploration',
        timestamp: Date.now()
      });
    })
  ),

  // === TRANSITIONS D'URGENCE (DEPUIS N'IMPORTE QUEL ÉTAT) ===
  
  // Override manuel
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE, BOT_STATES.EVALUATING, 
    guard(() => true),
    reduce((context, event) => ({
      ...context,
      manualCommand: event.command,
      manualParams: event.params,
      lastDecision: 'manual_override',
      lastStateChange: Date.now()
    }))
  ),

  // Urgence détectée
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.RETURNING, 
    guard(() => true),
    reduce((context, event) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: event.reason || 'unknown',
      currentAction: 'emergency_return',
      lastDecision: 'emergency',
      lastStateChange: Date.now()
    }))
  ),

  // Mise à jour de position (reste dans le même état)
  transition('UPDATE_POSITION', BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      // Utiliser l'action updatePosition existante
      return movementActions.updatePosition(context, event);
    })
  )
);
