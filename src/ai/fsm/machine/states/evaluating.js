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
// Log pour debug uniquement
console.log('🏗️ EVALUATING STATE: Construction de l\'état avec transitions');

export const evaluatingState = state(
  // === TRANSITIONS DE SÉCURITÉ (PRIORITÉ MAX) ===
  
  // Si carburant critique ou capacité pleine → RETURNING
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE, BOT_STATES.RETURNING, {
    guard: (context, event) => {
      // 🔍 DEBUG: Logs pour comprendre le problème
      console.log('\n🎯 [GUARD 1] ASSESSMENT_COMPLETE → RETURNING');
      console.log('Event type:', event?.type || 'no event type');
      console.log('Context:', { 
        entityId: context.entityId,
        vehicle: !!context.vehicle,
        vehicleFuel: context.vehicle?.fuel,
        vehicleResources: context.vehicle?.resources
      });
      
      const needsEmergency = safetyGuards.needsEmergencyReturn(context, event);
      const shouldReturnEff = efficiencyGuards.shouldReturnForEfficiency(context, event);
      
      console.log('Safety guards:');
      console.log('  - needsEmergencyReturn:', needsEmergency);
      console.log('  - shouldReturnForEfficiency:', shouldReturnEff);
      
      const result = needsEmergency || shouldReturnEff;
      console.log('Final result (FIRST TRANSITION - goes to RETURNING):', result);
      
      return result;
    },
    reduce: (context, event) => {
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
    }
  }),

  // === TRANSITIONS NORMALES ===
  
  // Si pas encore exploré → EXPLORING
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE, BOT_STATES.EXPLORING, {
    guard: (context, event) => {
      console.log('\n🔍 [GUARD 2] ASSESSMENT_COMPLETE → EXPLORING');
      const hasUnexplored = discoveryGuards.hasUnexploredAreas(context, event);
      console.log('  - hasUnexploredAreas result:', hasUnexplored);
      console.log('  - SECOND TRANSITION - would go to EXPLORING:', hasUnexplored);
      return hasUnexplored;
    },
    reduce: (context, event) => {
      console.log('🎯 EXPLORING REDUCER called - transitioning to EXPLORING');
      // Utiliser le reducer centralisé pour préparer l'exploration
      return contextReducers.state.prepareExploring(context, event);
    }
  }),

  // Si nouvelles ressources découvertes → COLLECTING
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE, BOT_STATES.COLLECTING, {
    guard: (context, event) => {
      console.log('\n🎯 EVALUATING GUARD: ASSESSMENT_COMPLETE → COLLECTING');
      const isEfficient = efficiencyGuards.isCollectionEfficient(context, event);
      const hasNewResources = context.hasNewResourceDiscovery;
      const hasKnownResources = context.knownResources?.length > 0;
      
      console.log('Collection guard evaluation:');
      console.log('  - isCollectionEfficient:', isEfficient);
      console.log('  - hasNewResourceDiscovery:', hasNewResources);
      console.log('  - hasKnownResources:', hasKnownResources);
      
      return isEfficient && 
             hasNewResources && 
             hasKnownResources;
    },
    reduce: (context, event) => {
      // Utiliser le reducer centralisé pour préparer la collecte
      // avec la première ressource connue comme cible
      const resourceEvent = {
        ...event,
        resource: context.knownResources[0] // Prendre la première ressource
      };
      return contextReducers.state.prepareCollecting(context, resourceEvent);
    }
  }),

  // Si drone pas à la base → RETURNING (pour récupérer le drone)
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE, BOT_STATES.RETURNING, {
    guard: (context, event) => {
      console.log('\n🏠 [GUARD 4] ASSESSMENT_COMPLETE → RETURNING (not at base)');
      const notAtBase = !baseGuards.isAtBase(context, event);
      console.log('  - !isAtBase result:', notAtBase);
      console.log('  - FOURTH TRANSITION - would go to RETURNING:', notAtBase);
      return notAtBase;
    },
    reduce: (context) => ({
      ...context,
      currentAction: 'returning_for_drone',
      lastDecision: 'retrieve_drone',
      lastStateChange: Date.now()
    })
  }),

  // Sinon → IDLE_AT_BASE (rien à faire)
  transition(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE, BOT_STATES.IDLE_AT_BASE, {
    guard: () => {
      console.log('\n💤 [GUARD 5] ASSESSMENT_COMPLETE → IDLE_AT_BASE (default)');
      console.log('  - DEFAULT TRANSITION - goes to IDLE_AT_BASE: true');
      return true;
    }, // Transition par défaut
    reduce: (context) => ({
      ...context,
      currentAction: 'idling',
      lastDecision: 'nothing_to_do',
      lastStateChange: Date.now()
    })
  }),

  // === ÉVÉNEMENT AUTONOME ===
  
  // Déclenchement automatique vers l'exploration
  transition(SYSTEM_EVENT_TYPES.AUTO, BOT_STATES.EXPLORING, {
    guard: () => true,
    reduce: (context) => {
      // Préparer l'état d'exploration
      return contextReducers.state.prepareExploring(context, {
        reason: 'auto_exploration',
        timestamp: Date.now()
      });
    }
  }),

  // === TRANSITIONS D'URGENCE (DEPUIS N'IMPORTE QUEL ÉTAT) ===
  
  // Override manuel
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE, BOT_STATES.EVALUATING, {
    guard: () => true,
    reduce: (context, event) => ({
      ...context,
      manualCommand: event.command,
      manualParams: event.params,
      lastDecision: 'manual_override',
      lastStateChange: Date.now()
    })
  }),

  // Urgence détectée
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.RETURNING, {
    guard: () => true,
    reduce: (context, event) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: event.reason || 'unknown',
      currentAction: 'emergency_return',
      lastDecision: 'emergency',
      lastStateChange: Date.now()
    })
  })
);
