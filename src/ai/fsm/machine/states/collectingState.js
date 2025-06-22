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
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents.js';
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents.js';
import { shipCollectsFromTile } from '../actions/core/shipCollectingActions.js'; // ACTION UNIFIÉE
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État COLLECTING - Collecte simplifiée avec mémoire unifiée
 * Supporte maintenant les sous-états COLLECTING_MOVING_TO_TARGET et COLLECTING_RETURNING_TO_BASE
 */
export const collectingState = state(
  // === NOUVELLES TRANSITIONS POUR CYCLE D'EXPLORATION MULTI-TUILES ===
  
  // SHIP_ARRIVED_AT_TILE - Vaisseau arrivé à la tuile cible pour collecte
  transition(MOVEMENT_EVENT_TYPES.SHIP_ARRIVED_AT_TILE, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
    guard((context) => context.currentAction === 'moving_to_target'),
    reduce((context, event) => {
      fsmLogger.info("🚢 [Collecting] Ship arrived at target tile, starting collection", { 
        coord: context.selectedTileForCollection?.coord,
        botId: context.entityId 
      });
      
      // Collecter automatiquement la tuile cible
      const collectedContext = shipCollectsFromTile(context, {
        coord: context.selectedTileForCollection?.coord,
        resourceType: 'all'
      });
      
      // Préparer le retour automatique à la base après collecte
      return contextReducers.state.prepareReturningToBase(collectedContext, {
        reason: 'tile_collected_returning_to_base'
      });
    })
  ),

  // SHIP_MOVEMENT_STARTED - Suivi du mouvement vers la tuile cible
  transition(MOVEMENT_EVENT_TYPES.SHIP_MOVEMENT_STARTED, BOT_STATES.COLLECTING_MOVING_TO_TARGET,
    guard((context) => context.currentAction === 'moving_to_target'),
    reduce((context, event) => {
      fsmLogger.info("🚢 [Collecting] Ship movement started toward target tile", { 
        botId: context.entityId 
      });
      return contextReducers.movement.updateMovementProgress(context, event);
    })
  ),

  // SHIP_REACHED_BASE - Vaisseau arrivé à la base après collecte
  transition(MOVEMENT_EVENT_TYPES.SHIP_REACHED_BASE, BOT_STATES.EVALUATING,
    guard((context) => context.currentAction === 'returning_to_base'),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Collecting] Ship reached base after collection, starting evaluation", { 
        botId: context.entityId 
      });
      
      // Retour à EVALUATING qui décidera de la suite (IDLE_AT_BASE ou nouveau cycle)
      return contextReducers.state.prepareEvaluating(context, {
        reason: 'returned_to_base_after_collection'
      });
    })
  ),

  // SHIP_MOVEMENT_STARTED - Suivi du retour à la base
  transition(MOVEMENT_EVENT_TYPES.SHIP_MOVEMENT_STARTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
    guard((context) => context.currentAction === 'returning_to_base'),
    reduce((context, event) => {
      fsmLogger.info("🚢 [Collecting] Ship movement started toward base", { 
        botId: context.entityId 
      });
      return contextReducers.movement.updateMovementProgress(context, event);
    })
  ),

  // === COLLECTE UNIFIÉE (TRANSITIONS EXISTANTES) ===
  
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

  // INVENTORY_FULL - Inventaire plein pendant la collecte (CORRIGÉ)
  transition(RESOURCE_EVENT_TYPES.INVENTORY_FULL, BOT_STATES.EVALUATING,
    guard((context, event) => {
      const vehicle = context.vehicle;
      if (!vehicle || !vehicle.resources) return false;
      
      const totalResources = Object.values(vehicle.resources).reduce((sum, val) => sum + val, 0);
      const maxCapacity = vehicle.maxCapacity || 10;
      
      return totalResources >= maxCapacity * 0.9; // 90% plein
    }),
    reduce((context, event) => {
      fsmLogger.info("📦 [Collecting] Inventory full, returning to evaluation", { 
        botId: context.entityId 
      });
      
      // Laisse EVALUATING décider (continuer collecte vs retour base)
      return contextReducers.state.prepareEvaluating(context, {
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

  // === TRANSITIONS D'URGENCE (CORRIGÉES) ===
  
  // Carburant faible pendant la collecte (CORRIGÉ)
  transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
    guard(() => true),
    reduce((context) => {
      fsmLogger.info("🔥 [Collecting] Low fuel detected, emergency return to base", { 
        botId: context.entityId 
      });
      
      // Retour direct du vaisseau à la base dans le contexte de collecte
      return contextReducers.state.prepareReturningToBase(context, {
        reason: 'emergency_low_fuel'
      });
    })
  ),

  // Urgence générale (CORRIGÉ)
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("🚨 [Collecting] Emergency detected, returning to base", { 
        reason: event.reason,
        botId: context.entityId 
      });
      
      // Retour direct du vaisseau à la base dans le contexte de collecte
      return contextReducers.state.prepareReturningToBase(context, {
        reason: 'emergency_return',
        emergencyReason: event.reason || 'unknown'
      });
    })
  )
);