/**
 * ============================================================================
 * État COLLECTING - Collecte de ressources
 * ============================================================================
 * 
 * État de collecte pour récolter les ressources connues.
 * Gère l'inventaire et la capacité de stockage.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';

/**
 * État COLLECTING - Collecte de ressources connues
 */
export const collectingState = state(
  // === ÉVÉNEMENTS DE PROGRESSION ===
  
  // Ressource collectée avec succès
  transition('RESOURCE_COLLECTED',
    BOT_STATES.EVALUATING,
    (context, event) => efficiencyGuards.shouldCollectMore(context, event),
    reduce((context, event) => ({
      ...context,
      vehicle: {
        ...context.vehicle,
        inventory: event.newInventory
      },
      lastCollectedResource: event.resource,
      collectionTime: Date.now(),
      hasNewResourceDiscovery: false, // Reset le flag
      currentAction: 'resource_collected'
    }))
  ),

  // Inventaire plein pendant la collecte
  transition('INVENTORY_FULL',
    BOT_STATES.RETURNING,
    (context, event) => efficiencyGuards.isAtMaxCapacity(context, event),
    reduce((context) => ({
      ...context,
      inventoryStatus: 'full',
      currentAction: 'returning_full_inventory',
      lastStateChange: Date.now()
    }))
  ),

  // Ressource épuisée ou non accessible
  transition('RESOURCE_UNAVAILABLE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      // Retirer la ressource de la liste des ressources connues
      knownResources: (context.knownResources || []).filter(
        r => r.id !== event.resourceId
      ),
      unavailableResources: [
        ...(context.unavailableResources || []),
        {
          resourceId: event.resourceId,
          reason: event.reason,
          timestamp: Date.now()
        }
      ],
      currentAction: 'resource_unavailable',
      lastStateChange: Date.now()
    }))
  ),

  // === TIMEOUTS ET ÉCHECS ===
  
  // Timeout de collecte (10s)
  transition('COLLECTION_TIMEOUT',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => ({
      ...context,
      collectionStatus: 'timeout',
      currentAction: 'collection_timeout',
      lastStateChange: Date.now()
    }))
  ),

  // Échec de récolte
  transition('HARVEST_FAILED',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => ({
      ...context,
      collectionStatus: 'failed',
      errorReason: event.reason,
      currentAction: 'collection_failed',
      lastStateChange: Date.now()
    }))
  ),

  // === VÉRIFICATIONS PÉRIODIQUES ===
  
  // Vérification de la capacité pendant la collecte
  transition('CAPACITY_CHECK',
    BOT_STATES.RETURNING,
    (context) => {
      const capacity = context.vehicle?.inventory?.capacity || 0;
      const maxCapacity = context.vehicle?.inventory?.maxCapacity || 100;
      return capacity >= maxCapacity * 0.9; // 90% plein
    },
    reduce((context) => ({
      ...context,
      currentAction: 'returning_near_full',
      capacityWarning: true,
      lastStateChange: Date.now()
    }))
  ),

  // === TRANSITIONS D'URGENCE ===
  
  // Carburant faible pendant la collecte
  transition('LOW_FUEL_DETECTED',
    BOT_STATES.RETURNING,
    () => true,
    reduce((context) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: 'low_fuel_during_collection',
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
