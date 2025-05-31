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

import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from '../constants.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';
import { contextReducers } from '../reducers/context.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';

/**
 * État EVALUATING - Point de décision central
 * Évalue la situation et détermine la prochaine action
 */
export const evaluatingState = state(
  // === TRANSITIONS DE SÉCURITÉ (PRIORITÉ MAX) ===
  
  // Si carburant critique ou capacité pleine → RETURNING
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE,
    BOT_STATES.RETURNING,
    // Guards de sécurité - utilise les guards modulaires
    (context, event) => {
      return safetyGuards.needsEmergencyReturn(context, event) ||
             efficiencyGuards.shouldReturnForEfficiency(context, event);
    },
    // Action : préparer le retour d'urgence
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
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE,
    BOT_STATES.EXPLORING,
    (context, event) => discoveryGuards.hasUnexploredAreas(context, event),
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour préparer l'exploration
      return contextReducers.state.prepareExploring(context, event);
    })
  ),

  // Si nouvelles ressources découvertes → COLLECTING
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE,
    BOT_STATES.COLLECTING,
    (context, event) => {
      return efficiencyGuards.isCollectionEfficient(context, event) && 
             context.hasNewResourceDiscovery && 
             context.knownResources?.length > 0;
    },
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
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE,
    BOT_STATES.RETURNING,
    (context, event) => !baseGuards.isAtBase(context, event),
    reduce((context) => ({
      ...context,
      currentAction: 'returning_for_drone',
      lastDecision: 'retrieve_drone',
      lastStateChange: Date.now()
    }))
  ),

  // Sinon → IDLE_AT_BASE (rien à faire)
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE,
    BOT_STATES.IDLE_AT_BASE,
    () => true, // Transition par défaut
    reduce((context) => ({
      ...context,
      currentAction: 'idling',
      lastDecision: 'nothing_to_do',
      lastStateChange: Date.now()
    }))
  ),

  // === ÉVÉNEMENT AUTONOME ===
  
  // Déclenchement automatique vers l'exploration
  transition(SYSTEM_EVENT_TYPES.AUTO,
    BOT_STATES.EXPLORING, // Passer directement à l'exploration
    () => true,
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
  ),

  // Urgence détectée
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED,
    BOT_STATES.RETURNING,
    () => true,
    reduce((context, event) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: event.reason || 'unknown',
      currentAction: 'emergency_return',
      lastDecision: 'emergency',
      lastStateChange: Date.now()
    }))
  )
);
