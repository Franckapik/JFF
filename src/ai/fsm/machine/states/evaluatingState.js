/**
 * ============================================================================
 * État EVALUATING - Évaluation et prise de décision (RÉORGANISÉ)
 * ============================================================================
 * 
 * État central d'évaluation qui détermine la prochaine action à entreprendre.
 * ORDRE DES TRANSITIONS CRITIQUE pour le cycle multi-tuiles !
 * 
 * @author FSM Migration - Multi-Tuiles Fix
 * @version 2.0.0
 */

import { state, transition, reduce, guard } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/indexGuard.js';
import { contextReducers } from '../reducers/context.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents.js';
import { shipCollectingActions } from '../actions/core/shipCollectingActions.js';
import { droneExploringActions } from '../actions/core/droneExploringActions.js';
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État EVALUATING - TRANSITIONS RÉORGANISÉES POUR CYCLE MULTI-TUILES
 */
export const evaluatingState = state(
  // === PRIORITÉ 1 : TRANSITIONS POST-COLLECTE ===
  
  // Maintenance requise après retour de collecte → IDLE_AT_BASE
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.IDLE_AT_BASE,
    guard((context, event) => {
      const needsMaintenance = context.vehicle?.fuel < 30 || 
                              context.vehicle?.damage > 50 ||
                              context.vehicle?.needsRepair;
      const justReturnedFromCollection = context.lastStateChange === 'returned_to_base_after_collection';
      
      return needsMaintenance && justReturnedFromCollection;
    }),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Evaluating] Maintenance required after collection, going idle", { 
        fuel: context.vehicle?.fuel,
        damage: context.vehicle?.damage,
        botId: context.entityId 
      });
      
      return contextReducers.state.prepareIdleAtBase(context, {
        reason: 'maintenance_required_after_collection'
      });
    })
  ),

  // Nouveau cycle d'exploration après collecte → EXPLORING_DEPLOYING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING,
    guard((context, event) => {
      const justReturnedFromCollection = context.lastStateChange === 'returned_to_base_after_collection';
      const canContinue = context.vehicle?.fuel >= 30 && context.vehicle?.damage <= 50;
      const hasUnexplored = discoveryGuards.hasUnexploredAreas(context, event);
      const isDroneInactive = !context.droneFleet?.drones?.explorer?.isActive;
      const canDeploy = !context.droneFleet?.deploymentAttempted;
      
      return justReturnedFromCollection && canContinue && hasUnexplored && isDroneInactive && canDeploy;
    }),
    reduce((context, event) => {
      fsmLogger.info("🔄 [Evaluating] Starting new exploration cycle after collection", { 
        botId: context.entityId 
      });
      
      const resetContext = shipCollectingActions.resetExplorationCycleStats(context, event);
      const preparedContext = contextReducers.state.prepareExploring(resetContext, event);
      const deploymentResult = contextReducers.droneDeployment.deployDrone(preparedContext, {
        range: 3,
        droneType: 'explorer'
      });

      return {
        ...deploymentResult,
        currentAction: 'drone_exploring',
        droneFleet: {
          ...deploymentResult.droneFleet,
          deploymentAttempted: true,
          deploymentCompleted: true,
          explorationStarted: true,
          explorationStartTime: Date.now(),
          drones: {
            ...deploymentResult.droneFleet.drones,
            explorer: {
              ...deploymentResult.droneFleet.drones.explorer,
              state: 'deploying',
              lastUpdate: Date.now(),
              isActive: true
            }
          }
        }
      };
    })
  ),

  // === PRIORITÉ 2 : TRANSITIONS DE SÉCURITÉ ===
  
  // Carburant critique ou capacité pleine → EXPLORING_RETURNING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_RETURNING, 
    guard((context, event) => {
      const needsEmergency = safetyGuards.needsEmergencyReturn(context, event);
      const shouldReturnEff = efficiencyGuards.shouldReturnForEfficiency(context, event);
      
      return needsEmergency || shouldReturnEff;
    }),
    reduce((context, event) => {
      const emergencyReason = safetyGuards.isCriticalFuel(context, event) 
        ? 'low_fuel' : 'full_capacity';
      
      const enrichedEvent = {
        ...event,
        reason: 'safety_return',
        emergencyReason
      };
      
      return contextReducers.state.prepareReturning(context, enrichedEvent);
    })
  ),

  // === PRIORITÉ 3 : CYCLE MULTI-TUILES (COLLECTE) ===
  
  // 3+ tuiles explorées ET tuiles collectibles → COLLECTING_MOVING_TO_TARGET
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING_MOVING_TO_TARGET, 
    guard((context, event) => {
      const hasEnoughExplored = discoveryGuards.hasExploredEnoughTiles(context, event);
      const hasBestTile = discoveryGuards.hasBestTileForCollection(context, event);
      const shouldTransition = discoveryGuards.shouldTransitionToCollection(context, event);
      
      return hasEnoughExplored && hasBestTile && shouldTransition;
    }),
    reduce((context, event) => {
      fsmLogger.info("🎯 [Evaluating] Starting collection phase - selecting best tile", { 
        botId: context.entityId 
      });
      
      const contextWithSelection = shipCollectingActions.selectBestTileForCollection(context, event);
      
      return contextReducers.state.prepareCollectingMovingToTarget(contextWithSelection, {
        ...event,
        tileCoord: contextWithSelection.selectedTileForCollection?.coord,
        reason: 'best_tile_after_exploration_cycle'
      });
    })
  ),

  // === PRIORITÉ 4 : EXPLORATION NORMALE ===
  
  // Pas encore exploré OU besoin d'exploration → EXPLORING_DEPLOYING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING, 
    guard((context, event) => {
      const hasUnexplored = discoveryGuards.hasUnexploredAreas(context, event);
      const needsMoreExploration = discoveryGuards.needsExploration(context, event);
      const isDroneInactive = !context.droneFleet?.drones?.explorer?.isActive;
      const canDeploy = !context.droneFleet?.deploymentAttempted;
      
      return (hasUnexplored || needsMoreExploration) && isDroneInactive && canDeploy;
    }),
    reduce((context, event) => {
      fsmLogger.info("🚁 [Evaluating] Starting exploration - deploying drone", { 
        botId: context.entityId 
      });
      
      const preparedContext = contextReducers.state.prepareExploring(context, event);
      const deploymentResult = contextReducers.droneDeployment.deployDrone(preparedContext, {
        range: 3,
        droneType: 'explorer'
      });

      return {
        ...deploymentResult,
        currentAction: 'drone_exploring',
        droneFleet: {
          ...deploymentResult.droneFleet,
          deploymentAttempted: true,
          deploymentCompleted: true,
          explorationStarted: true,
          explorationStartTime: Date.now(),
          drones: {
            ...deploymentResult.droneFleet.drones,
            explorer: {
              ...deploymentResult.droneFleet.drones.explorer,
              state: 'deploying',
              lastUpdate: Date.now(),
              isActive: true
            }
          }
        }
      };
    })
  ),

  // === PRIORITÉ 5 : AUTRES TRANSITIONS ===
  

  // Drone pas à la base → EXPLORING_RETURNING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_RETURNING, 
    guard((context, event) => {
      const notAtBase = !baseGuards.isAtBase(context, event);
      return notAtBase;
    }),
    reduce((context) => ({
      ...context,
      currentAction: 'returning_for_drone',
      lastDecision: 'retrieve_drone',
      lastStateChange: Date.now()
    }))
  ),

  // === PRIORITÉ 6 : TRANSITION PAR DÉFAUT (LA PLUS BASSE) ===
  
  // Rien à faire → IDLE_AT_BASE (PAR DÉFAUT)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.IDLE_AT_BASE, 
    guard(() => true), // Par défaut - toujours vrai
    reduce((context) => {
      fsmLogger.info("😴 [Evaluating] No action needed, going idle", { 
        tilesExplored: context.memory?.stats?.tilesExplored || 0,
        deploymentAttempted: context.droneFleet?.deploymentAttempted,
        droneActive: context.droneFleet?.drones?.explorer?.isActive,
        droneState: context.droneFleet?.drones?.explorer?.state,
        hasUnexplored: context.memory?.knownTiles ? Array.from(context.memory.knownTiles.values()).some(tile => !tile.explored) : false,
        botId: context.entityId 
      });
      
      return {
        ...context,
        currentAction: 'idling',
        lastDecision: 'nothing_to_do',
        lastStateChange: Date.now()
      };
    })
  ),

  // === MISES À JOUR POSITION ===
  
  transition(MOVEMENT_EVENT_TYPES.SHIP_UPDATE_POSITION, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      return shipCollectingActions.shipUpdatePosition(context, event);
    })
  ),

  transition(MOVEMENT_EVENT_TYPES.DRONE_POSITION_UPDATE, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      return droneExploringActions.droneUpdatePosition(context, event);
    })
  )
);
