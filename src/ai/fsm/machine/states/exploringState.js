/**
 * ============================================================================
 * STATE EXPLORING - Exploration et découverte (SIMPLIFIÉ)
 * ============================================================================
 * 
 * État d'exploration simplifié utilisant les actions unifiées.
 * Utilise `droneExploresTile` pour mettre à jour la mémoire unifiée.
 * 
 * 📋 TRANSITIONS PRINCIPALES:
 * ===========================
 * 
 * 🎯 EXPLORATION SIMPLIFIÉE:
 * - TILE_EXPLORED → EXPLORING_DEPLOYING (drone explore tuile puis retour automatique)
 * - DRONE_REACHED_SHIP → EVALUATING (drone de retour au vaisseau)
 * 
 * 🚨 GESTION URGENCES:
 * - EMERGENCY_RESOLVED → EVALUATING
 * - CRITICAL_FUEL → IDLE_AT_BASE
 * 
 * @author Migration FSM - Simplification Mémoire
 * @version 4.0.0
 */

import { state, transition, reduce, guard } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { contextReducers } from '../reducers/context.js';
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';
import { droneExploresTile, droneDockToShip, droneRecallToShip } from '../actions/core/droneExploringActions.js'; // ACTIONS UNIFIÉES
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État EXPLORING - Exploration simplifiée avec mémoire unifiée
 */
export const exploringState = state(
  // === EXPLORATION SIMPLIFIÉE ===

  // TILE_EXPLORED - Drone a exploré une tuile et découvert des ressources
  transition('TILE_EXPLORED', BOT_STATES.EXPLORING_DEPLOYING, // Rester dans exploring jusqu'au retour
    guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),
    reduce((context, event) => {
      fsmLogger.info("🎯 [Exploring] Tile explored, updating unified memory", { 
        coord: event.coord,
        hasResources: event.hasResources,
        botId: context.entityId 
      });
      
      // Utiliser l'action unifiée pour mettre à jour la mémoire
      const exploredContext = droneExploresTile(context, {
        coord: event.coord,
        resources: event.resources
      });
      
      // ✅ CYCLE COMPLET: Rappeler le drone après exploration
      const contextWithDroneRecalled = droneRecallToShip(exploredContext, {
        droneType: event.droneType || 'explorer'
      });
      
      fsmLogger.info("🔄 [Exploring] Drone recalled to ship after exploration", { 
        coord: event.coord,
        droneType: event.droneType || 'explorer',
        botId: context.entityId 
      });
      
      // Retourner le contexte avec drone en retour (pas d'évaluation immédiate)
      return {
        ...contextWithDroneRecalled,
        lastStateChange: Date.now(),
        lastAction: 'tile_explored_drone_recalled'
      };
    })
  ),

  // DRONE_REACHED_SHIP - Drone de retour au vaisseau
  transition(MOVEMENT_EVENT_TYPES.DRONE_REACHED_SHIP, BOT_STATES.EVALUATING,
    guard((context, event) => {
      const drone = context.droneFleet?.drones?.explorer;
      const shouldDock = drone?.isActive && drone?.state === 'returning';
      
      fsmLogger.info("🏠 [Exploring] DRONE_REACHED_SHIP guard check", { 
        botId: context.entityId,
        droneState: drone?.state,
        isActive: drone?.isActive,
        shouldTransition: shouldDock
      });
      
      return shouldDock;
    }),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Exploring] Drone reached ship, docking complete", { 
        botId: context.entityId,
        droneType: event.droneType || 'explorer'
      });
      
      // Utiliser l'action unifiée pour ancrer le drone
      const dockedContext = droneDockToShip(context, {
        droneType: event.droneType || 'explorer'
      });
      
      // Préparer l'évaluation suivante
      return contextReducers.state.prepareEvaluating(dockedContext, {
        reason: 'drone_reached_ship_successfully'
      });
    })
  ),

  // === GESTION DES URGENCES ===
  
  // Urgence résolue
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_RESOLVED, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("✅ [Exploring] Emergency resolved", { 
        botId: context.entityId,
        condition: event.condition 
      });
      
      return contextReducers.state.prepareEvaluating(context, {
        reason: 'emergency_resolved',
        resolvedCondition: event.condition
      });
    })
  ),

  // Carburant critique - atterrissage d'urgence
  transition(EMERGENCY_EVENT_TYPES.CRITICAL_FUEL, BOT_STATES.IDLE_AT_BASE,
    guard(() => true),
    reduce((context) => {
      fsmLogger.info("🔥 [Exploring] Critical fuel - emergency landing", { 
        botId: context.entityId 
      });
      
      return {
        ...context,
        fuelStatus: 'critical',
        emergencyLanding: true,
        currentAction: 'emergency_landing',
        lastStateChange: Date.now()
      };
    })
  )
);