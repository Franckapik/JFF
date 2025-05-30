/**
 * ============================================================================
 * État IDLE_AT_BASE - Attente et maintenance à la base
 * ============================================================================
 * 
 * État d'attente à la base pour les opérations de maintenance :
 * - Ravitaillement en carburant
 * - Déchargement des ressources
 * - Réparations
 * - Attente de nouvelles instructions
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';

/**
 * État IDLE_AT_BASE - Maintenance et attente à la base
 */
export const idleAtBaseState = state(
  // === OPÉRATIONS DE MAINTENANCE ===
  
  // Ravitaillement terminé
  transition('REFUEL_COMPLETE',
    BOT_STATES.EVALUATING,
    (context, event) => efficiencyGuards.isFullTank(context, event),
    reduce((context, event) => ({
      ...context,
      vehicle: {
        ...context.vehicle,
        fuel: event.fuel || 100
      },
      fuelStatus: 'full',
      lastRefuelTime: Date.now(),
      currentAction: 'refueled',
      lastStateChange: Date.now()
    }))
  ),

  // Déchargement des ressources terminé
  transition('UNLOAD_COMPLETE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      vehicle: {
        ...context.vehicle,
        inventory: {
          ...context.vehicle.inventory,
          capacity: 0, // Inventaire vidé
          items: []
        }
      },
      unloadedResources: event.unloadedResources || [],
      lastUnloadTime: Date.now(),
      currentAction: 'unloaded',
      lastStateChange: Date.now()
    }))
  ),

  // Réparations terminées
  transition('REPAIR_COMPLETE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      vehicle: {
        ...context.vehicle,
        health: event.health || 100,
        shields: event.shields || 100
      },
      repairStatus: 'complete',
      lastRepairTime: Date.now(),
      currentAction: 'repaired',
      lastStateChange: Date.now()
    }))
  ),

  // === DÉCLENCHEMENT AUTOMATIQUE ===
  
  // Auto-déclencher le ravitaillement si nécessaire
  transition('AUTO_REFUEL_CHECK',
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    (context) => {
      const fuel = context.vehicle?.fuel || 0;
      return fuel < 100; // Déclencher le ravitaillement si pas plein
    },
    reduce((context) => ({
      ...context,
      currentAction: 'refueling',
      refuelStartTime: Date.now()
    }))
  ),

  // Auto-déclencher le déchargement si inventaire non vide
  transition('AUTO_UNLOAD_CHECK',
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    (context) => {
      const capacity = context.vehicle?.inventory?.capacity || 0;
      return capacity > 0; // Déclencher le déchargement si des ressources
    },
    reduce((context) => ({
      ...context,
      currentAction: 'unloading',
      unloadStartTime: Date.now()
    }))
  ),

  // === TIMEOUTS ===
  
  // Timeout d'inactivité (5s) - déclencher une réévaluation
  transition('IDLE_TIMEOUT',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => ({
      ...context,
      idleStatus: 'timeout',
      currentAction: 'idle_timeout',
      lastStateChange: Date.now()
    }))
  ),

  // Timeout de ravitaillement
  transition('REFUEL_TIMEOUT',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => ({
      ...context,
      fuelStatus: 'timeout',
      currentAction: 'refuel_timeout',
      // Assumer que le ravitaillement est fait en cas de timeout
      vehicle: {
        ...context.vehicle,
        fuel: 100
      },
      lastStateChange: Date.now()
    }))
  ),

  // === ÉVÉNEMENTS EXTERNES ===
  
  // Nouvelles ressources détectées
  transition('NEW_RESOURCES_DETECTED',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      knownResources: [...(context.knownResources || []), ...event.resources],
      hasNewResourceDiscovery: true,
      discoveryTime: Date.now(),
      currentAction: 'new_resources_available',
      lastStateChange: Date.now()
    }))
  ),

  // Demande d'exploration manuelle
  transition('EXPLORATION_REQUESTED',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => ({
      ...context,
      hasExplored: false, // Reset le flag d'exploration
      explorationRequested: true,
      currentAction: 'exploration_requested',
      lastStateChange: Date.now()
    }))
  ),

  // === TRANSITIONS D'URGENCE ===
  
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
      lastStateChange: Date.now()
    }))
  ),

  // === MAINTENANCE AVANCÉE ===
  
  // Début de réparations
  transition('REPAIR_STARTED',
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    () => true,
    reduce((context) => ({
      ...context,
      currentAction: 'repairing',
      repairStartTime: Date.now()
    }))
  ),

  // Maintenance complète terminée
  transition('MAINTENANCE_COMPLETE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => ({
      ...context,
      maintenanceStatus: 'complete',
      lastMaintenanceTime: Date.now(),
      currentAction: 'maintenance_complete',
      // Reset tous les statuts
      emergencyFlag: false,
      emergencyReason: null,
      capacityWarning: false,
      lastStateChange: Date.now()
    }))
  )
);
