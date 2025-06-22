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
import { shipCollectsFromTile, shipDepositResources, shipShouldReturnToBase, shipDepositResourcesAtBase } from '../actions/core/shipCollectingActions.js'; // ACTION UNIFIÉE
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État COLLECTING - Collecte simplifiée avec mémoire unifiée
 * Supporte maintenant les sous-états COLLECTING_MOVING_TO_TARGET et COLLECTING_RETURNING_TO_BASE
 */
export const collectingState = state(
  // === NOUVELLES TRANSITIONS POUR CYCLE D'EXPLORATION MULTI-TUILES ===
  
  // SHIP_ARRIVED_AT_TILE - Vaisseau arrivé à la tuile cible pour collecte
  transition(MOVEMENT_EVENT_TYPES.SHIP_ARRIVED_AT_TILE, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
    guard((context) => {
      const isMovingToTarget = context.currentAction === 'moving_to_target';
      const shouldReturn = shipShouldReturnToBase(context);
      return isMovingToTarget && shouldReturn;
    }),
    reduce((context, event) => {
      fsmLogger.info("🚢 [Collecting] Ship arrived at target tile, collecting and returning to base", { 
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
  
  // SHIP_ARRIVED_AT_TILE - Vaisseau collecte mais continue l'exploration (capacité disponible)
  transition(MOVEMENT_EVENT_TYPES.SHIP_ARRIVED_AT_TILE, BOT_STATES.EVALUATING,
    guard((context) => {
      const isMovingToTarget = context.currentAction === 'moving_to_target';
      const shouldReturn = shipShouldReturnToBase(context);
      return isMovingToTarget && !shouldReturn;
    }),
    reduce((context, event) => {
      fsmLogger.info("🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration", { 
        coord: context.selectedTileForCollection?.coord,
        botId: context.entityId 
      });
      
      // Collecter automatiquement la tuile cible
      const collectedContext = shipCollectsFromTile(context, {
        coord: context.selectedTileForCollection?.coord,
        resourceType: 'all'
      });
      
      // Retourner à l'évaluation pour décider de la suite (plus d'exploration ou autre)
      return contextReducers.state.prepareEvaluating(collectedContext, {
        reason: 'tile_collected_continue_exploration'
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
      fsmLogger.info("🏠 [Collecting] Ship reached base after collection", { 
        botId: context.entityId 
      });
      
      // Déposer automatiquement toutes les ressources transportées
      const depositedContext = shipDepositResourcesAtBase(context);
      
      fsmLogger.resources(`💰 [Collecting] Resources deposited at base - Total Score: ${JSON.stringify(depositedContext.score?.resources)}`, {
        botId: context.entityId,
        deposited: depositedContext.depositedResources
      });
      
      // Retour à EVALUATING qui décidera de la suite (IDLE_AT_BASE ou nouveau cycle)
      return contextReducers.state.prepareEvaluating(depositedContext, {
        reason: 'returned_to_base_after_collection',
        lastStateChange: 'returned_to_base_after_collection'
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

  // SHIP_COLLECTION_COMPLETED - Collecte terminée, décision automatique selon capacité
  transition(MOVEMENT_EVENT_TYPES.SHIP_COLLECTION_COMPLETED, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
    guard((context) => shipShouldReturnToBase(context)),
    reduce((context, event) => {
      fsmLogger.info("📦 [Collecting] Collection completed, ship full - returning to base", { 
        botId: context.entityId,
        capacity: context.vehicle?.resources
      });
      
      // Préparer le retour automatique à la base
      return contextReducers.state.prepareReturningToBase(context, {
        reason: 'collection_completed_ship_full'
      });
    })
  ),
  
  // SHIP_COLLECTION_COMPLETED - Collecte terminée, capacité disponible - continuer
  transition(MOVEMENT_EVENT_TYPES.SHIP_COLLECTION_COMPLETED, BOT_STATES.EVALUATING,
    guard((context) => !shipShouldReturnToBase(context)),
    reduce((context, event) => {
      fsmLogger.info("📦 [Collecting] Collection completed, capacity available - continuing exploration", { 
        botId: context.entityId,
        capacity: context.vehicle?.resources
      });
      
      // Retourner à l'évaluation pour décider de la suite
      return contextReducers.state.prepareEvaluating(context, {
        reason: 'collection_completed_continue'
      });
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

  // INVENTORY_FULL - Inventaire plein pendant la collecte → Retour à la base automatique
  transition(RESOURCE_EVENT_TYPES.INVENTORY_FULL, BOT_STATES.COLLECTING_RETURNING_TO_BASE,
    guard((context, event) => {
      const vehicle = context.vehicle;
      if (!vehicle || !vehicle.resources) return false;
      
      const totalResources = Object.values(vehicle.resources).reduce((sum, val) => sum + val, 0);
      const maxCapacity = vehicle.maxCapacity || 10;
      
      return totalResources >= maxCapacity * 0.8; // 80% plein (ajusté pour être cohérent avec shipShouldReturnToBase)
    }),
    reduce((context, event) => {
      fsmLogger.info("📦 [Collecting] Inventory full, automatically returning to base", { 
        totalResources: Object.values(context.vehicle?.resources || {}).reduce((sum, val) => sum + val, 0),
        maxCapacity: context.vehicle?.maxCapacity || 10,
        botId: context.entityId 
      });
      
      // Retour automatique à la base quand l'inventaire est plein
      return contextReducers.state.prepareReturningToBase(context, {
        reason: 'inventory_full_auto_return'
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