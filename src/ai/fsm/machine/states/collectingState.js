/**
 * ============================================================================
 * État COLLECTING - Collecte de ressources (SIMPLIFIÉ)
 * ============================================================================
 * 
 * État de collecte simplifié utilisant l'action unifiée.
 * Utilise `shipCollectsFromTile` pour collecter depuis la mémoire unifiée.
 * 
 * 📋 TRANSITIONS PRINCIPALES:
 * ===========================
 * 
 * 📦 COLLECTE UNIFIÉE:
 * - TILE_COLLECTED → EVALUATING (ressource collectée avec succès)
 * - INVENTORY_FULL → RETURNING (inventaire plein)
 * - RESOURCE_UNAVAILABLE → EVALUATING (ressource épuisée/inaccessible)
 * 
 *  TRANSITIONS D'URGENCE:
 * - LOW_FUEL_DETECTED → RETURNING (carburant faible)
 * - EMERGENCY_DETECTED → RETURNING (urgence générale)
 * 
 * @author Migration FSM - Simplification Mémoire
 * @version 4.0.0
 */

import { state, transition, reduce, guard } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { contextReducers } from '../reducers/context.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';
import { shipCollectsFromTile } from '../actions/core/shipCollectingActions.js'; // ACTION UNIFIÉE
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État COLLECTING - Collecte simplifiée avec mémoire unifiée
 */
export const collectingState = state(
  // === COLLECTE UNIFIÉE ===
  
  // TILE_COLLECTED - Ship a collecté les ressources d'une tuile explorée
  transition('TILE_COLLECTED', BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("📦 [Collecting] Collecting from tile using unified memory", { 
        coord: event.coord,
        botId: context.entityId 
      });
      
      // Utiliser l'action unifiée pour collecter depuis la mémoire
      const collectedContext = shipCollectsFromTile(context, {
        coord: event.coord,
        resourceType: event.resourceType
      });
      
      // Vérifier si la collecte a réussi
      if (collectedContext.error) {
        fsmLogger.warn("⚠️ [Collecting] Collection failed", { 
          error: collectedContext.error,
          coord: event.coord,
          botId: context.entityId 
        });
        
        return contextReducers.state.prepareEvaluating(collectedContext, {
          reason: 'collection_failed'
        });
      }
      
      // Préparer l'évaluation suivante après collecte réussie
      return contextReducers.state.prepareEvaluating(collectedContext, {
        reason: 'tile_collected_successfully'
      });
    })
  ),

  // INVENTORY_FULL - Inventaire plein pendant la collecte
  transition('INVENTORY_FULL', BOT_STATES.RETURNING,
    guard((context, event) => {
      const vehicle = context.vehicle;
      if (!vehicle || !vehicle.resources) return false;
      
      const totalResources = Object.values(vehicle.resources).reduce((sum, val) => sum + val, 0);
      const maxCapacity = vehicle.maxCapacity || 10;
      
      return totalResources >= maxCapacity * 0.9; // 90% plein
    }),
    reduce((context, event) => {
      fsmLogger.info("📦 [Collecting] Inventory full, returning to base", { 
        botId: context.entityId 
      });
      
      return contextReducers.state.prepareReturning(context, {
        reason: 'inventory_full'
      });
    })
  ),

  // RESOURCE_UNAVAILABLE - Ressource épuisée ou non accessible
  transition('RESOURCE_UNAVAILABLE', BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("⚠️ [Collecting] Resource unavailable", { 
        coord: event.coord,
        reason: event.reason,
        botId: context.entityId 
      });
      
      return contextReducers.state.prepareEvaluating(context, {
        reason: 'resource_unavailable'
      });
    })
  ),

  // === TRANSITIONS D'URGENCE ===
  
  // Carburant faible pendant la collecte
  transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED, BOT_STATES.RETURNING,
    guard(() => true),
    reduce((context) => {
      fsmLogger.info("🔥 [Collecting] Low fuel detected, emergency return", { 
        botId: context.entityId 
      });
      
      return contextReducers.state.prepareReturning(context, {
        reason: 'emergency_low_fuel'
      });
    })
  ),

  // Urgence générale
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.RETURNING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("🚨 [Collecting] Emergency detected, returning to base", { 
        reason: event.reason,
        botId: context.entityId 
      });
      
      return contextReducers.state.prepareReturning(context, {
        reason: 'emergency_return',
        emergencyReason: event.reason || 'unknown'
      });
    })
  )
);