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
import { BOT_STATES } from './index.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';

/**
 * État EVALUATING - Point de décision central
 * Évalue la situation et détermine la prochaine action
 */
export const evaluatingState = state(
  // === TRANSITIONS DE SÉCURITÉ (PRIORITÉ MAX) ===
  
  // Si carburant critique ou capacité pleine → RETURNING
  transition('ASSESSMENT_COMPLETE',
    BOT_STATES.RETURNING,
    // Guards de sécurité - utilise les guards modulaires
    (context, event) => {
      return safetyGuards.needsEmergencyReturn(context, event) ||
             efficiencyGuards.shouldReturnForEfficiency(context, event);
    },
    // Action : préparer le retour d'urgence
    reduce((context, event) => ({
      ...context,
      currentAction: 'returning_emergency',
      lastDecision: 'safety_return',
      emergencyReason: safetyGuards.isCriticalFuel(context, event) 
        ? 'low_fuel' : 'full_capacity',
      lastStateChange: Date.now()
    }))
  ),

  // === TRANSITIONS NORMALES ===
  
  // Si pas encore exploré → EXPLORING
  transition('ASSESSMENT_COMPLETE',
    BOT_STATES.EXPLORING,
    (context, event) => discoveryGuards.hasUnexploredAreas(context, event),
    reduce((context) => ({
      ...context,
      currentAction: 'exploring',
      lastDecision: 'start_exploration',
      lastStateChange: Date.now()
    }))
  ),

  // Si nouvelles ressources découvertes → COLLECTING
  transition('ASSESSMENT_COMPLETE',
    BOT_STATES.COLLECTING,
    (context, event) => {
      return efficiencyGuards.isCollectionEfficient(context, event) && 
             context.hasNewResourceDiscovery && 
             context.knownResources?.length > 0;
    },
    reduce((context) => ({
      ...context,
      currentAction: 'collecting',
      lastDecision: 'collect_resources',
      targetResource: context.knownResources[0], // Prendre la première ressource
      lastStateChange: Date.now()
    }))
  ),

  // Si drone pas à la base → RETURNING (pour récupérer le drone)
  transition('ASSESSMENT_COMPLETE',
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
  transition('ASSESSMENT_COMPLETE',
    BOT_STATES.IDLE_AT_BASE,
    () => true, // Transition par défaut
    reduce((context) => ({
      ...context,
      currentAction: 'idling',
      lastDecision: 'nothing_to_do',
      lastStateChange: Date.now()
    }))
  ),

  // === TRANSITIONS D'URGENCE (DEPUIS N'IMPORTE QUEL ÉTAT) ===
  
  // Override manuel
  transition('MANUAL_OVERRIDE',
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
  transition('EMERGENCY_DETECTED',
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
