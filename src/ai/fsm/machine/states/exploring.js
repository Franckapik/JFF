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
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';

/**
 * État EXPLORING - Exploration et découverte de ressources
 */
export const exploringState = state(
  // === ÉVÉNEMENTS DE PROGRESSION ===
  
  // Drone déployé avec succès
  transition('DRONE_DEPLOYED',
    BOT_STATES.EXPLORING, // Reste en exploration
    () => true,
    reduce((context, event) => ({
      ...context,
      isDroneAtShip: false,
      droneTarget: event.targetArea,
      deploymentTime: Date.now(),
      currentAction: 'drone_exploring'
    }))
  ),

  // Zone explorée avec succès
  transition('AREA_EXPLORED',
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isExplorationComplete(context, event),
    reduce((context, event) => ({
      ...context,
      hasExplored: true,
      completedSections: [...(context.completedSections || []), ...event.completedSections],
      currentAction: 'exploration_complete',
      lastExplorationTime: Date.now()
    }))
  ),

  // Ressources découvertes pendant l'exploration
  transition('RESOURCES_DISCOVERED',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      knownResources: [...(context.knownResources || []), ...event.resources],
      hasNewResourceDiscovery: true,
      discoveryTime: Date.now(),
      currentAction: 'resources_found'
    }))
  ),

  // === TIMEOUTS ET ÉCHECS ===
  
  // Timeout d'exploration (30s)
  transition('EXPLORATION_TIMEOUT',
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isExplorationExpired(context, event),
    reduce((context) => ({
      ...context,
      hasExplored: true, // Marquer comme exploré même si incomplet
      explorationStatus: 'timeout',
      currentAction: 'exploration_timeout',
      lastStateChange: Date.now()
    }))
  ),

  // Échec de déploiement du drone
  transition('DRONE_DEPLOYMENT_FAILED',
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

  // === TRANSITIONS D'URGENCE ===
  
  // Carburant faible détecté pendant l'exploration
  transition('LOW_FUEL_DETECTED',
    BOT_STATES.RETURNING,
    (context, event) => safetyGuards.isLowFuel(context, event),
    reduce((context) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: 'low_fuel_during_exploration',
      currentAction: 'emergency_return',
      lastStateChange: Date.now()
    }))
  ),

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

  // Urgence générale
  transition('EMERGENCY_DETECTED',
    BOT_STATES.RETURNING,
    () => true,
    reduce((context, event) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: event.reason || 'unknown',
      currentAction: 'emergency_return',
      lastStateChange: Date.now()
    }))
  )
);
