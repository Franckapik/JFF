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
import { BOT_STATES, EXPLORATION_CYCLE_CONFIG, DEFAULT_CAPACITIES, VEHICLE_TYPES } from '../constants/constants.js';
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

  // === PRIORITÉ 1.5 : RETOUR DE BASE AVEC OPTION IDLE ===
  
  // Retour de base réussi avec option idle selon les conditions
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.IDLE_AT_BASE,
    guard((context, event) => {
      // Vérifier si on revient de la base avec des ressources déposées
      const justReturnedFromBase = context.reason === 'arrived_at_base_with_resources';
      const shouldConsiderIdle = context.shouldConsiderIdleTime;
      
      if (!justReturnedFromBase || !shouldConsiderIdle) {
        return false;
      }
      
      // Conditions pour prendre du repos :
      const isLowEnergy = context.vehicle?.fuel < 50;
      const needsRepair = context.vehicle?.damage > 30;
      const hasWorkedEnough = (context.memory?.stats?.tilesExplored || 0) >= 2;
      const resourcesDeposited = context.depositedResources && 
        Object.values(context.depositedResources).reduce((sum, amount) => sum + amount, 0) > 500;
      
      return isLowEnergy || needsRepair || (hasWorkedEnough && resourcesDeposited);
    }),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Evaluating] Taking earned rest after successful collection cycle", { 
        fuel: context.vehicle?.fuel,
        damage: context.vehicle?.damage,
        tilesExplored: context.memory?.stats?.tilesExplored,
        depositedAmount: context.depositedResources ? Object.values(context.depositedResources).reduce((sum, amount) => sum + amount, 0) : 0,
        botId: context.entityId 
      });
      
      return contextReducers.state.prepareIdleAtBase(context, {
        reason: 'earned_rest_after_collection'
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
  
  // Carburant critique ou capacité pleine → COLLECTING_RETURNING_TO_BASE (vaisseau retourne à la base)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING_RETURNING_TO_BASE, 
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
      
      fsmLogger.info("🚢 [Evaluating] Ship returning to base for safety", { 
        reason: emergencyReason,
        botId: context.entityId 
      });
      
      return contextReducers.state.prepareReturningToBase(context, enrichedEvent);
    })
  ),

  // === PRIORITÉ 3 : CYCLE MULTI-TUILES (COLLECTE) ===
  
  // NOUVELLE LOGIQUE INTELLIGENTE : Collecte prioritaire SEULEMENT après exploration intensive
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING_MOVING_TO_TARGET, 
    guard((context, event) => {
      const hasBestTile = discoveryGuards.hasBestTileForCollection(context, event);
      
      if (!hasBestTile) return false;
      
      // Vérifier qu'on a exploré assez de tuiles avant d'autoriser la collecte
      const knownTiles = context.memory?.knownTiles || new Map();
      const totalExploredCount = Array.from(knownTiles.values()).filter(tile => tile.explored).length;
      
      // Constante pour le nombre minimum de tuiles à explorer avant collecte
      const minTilesForCollection = EXPLORATION_CYCLE_CONFIG?.MIN_TILES_BEFORE_COLLECTION || 3;
      const hasEnoughExplored = totalExploredCount >= minTilesForCollection;
      
      // Vérifier si le vaisseau n'est pas plein
      const vehicle = context.vehicle;
      const currentResources = vehicle?.resources || { food: 0, debris: 0, special: 0 };
      const maxCapacity = vehicle?.maxCapacity || DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP];
      
      const isShipNotFull = (
        (currentResources.food || 0) < (maxCapacity.food || 200) * 0.9 ||
        (currentResources.debris || 0) < (maxCapacity.debris || 1800) * 0.9 ||
        (currentResources.special || 0) < (maxCapacity.special || 3) * 0.9
      );
      
      fsmLogger.info("🧠 [Evaluating] Smart collection evaluation", {
        hasBestTile,
        hasEnoughExplored,
        totalExploredCount,
        minTilesForCollection,
        isShipNotFull,
        currentResources,
        maxCapacity,
        foodPercentage: Math.round((currentResources.food / (maxCapacity.food || 200)) * 100),
        debrisPercentage: Math.round((currentResources.debris / (maxCapacity.debris || 1800)) * 100),
        specialPercentage: Math.round((currentResources.special / (maxCapacity.special || 3)) * 100),
        result: hasBestTile && hasEnoughExplored && isShipNotFull,
        botId: context.entityId
      });
      
      return hasBestTile && hasEnoughExplored && isShipNotFull;
    }),
    reduce((context, event) => {
      fsmLogger.info("🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase", { 
        shipResources: context.vehicle?.resources,
        shipCapacity: context.vehicle?.maxCapacity,
        botId: context.entityId 
      });
      
      const contextWithSelection = shipCollectingActions.selectBestTileForCollection(context, event);
      
      return contextReducers.state.prepareCollectingMovingToTarget(contextWithSelection, {
        ...event,
        tileCoord: contextWithSelection.selectedTileForCollection?.coord,
        reason: 'smart_collection_ship_not_full'
      });
    })
  ),
  
  // 3+ tuiles explorées ET tuiles collectibles → COLLECTING_MOVING_TO_TARGET (logique existante)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING_MOVING_TO_TARGET, 
    guard((context, event) => {
      const hasEnoughExplored = discoveryGuards.hasExploredEnoughTiles(context, event);
      const hasBestTile = discoveryGuards.hasBestTileForCollection(context, event);
      const shouldTransition = discoveryGuards.shouldTransitionToCollection(context, event);
      
      fsmLogger.info("🔍 [Evaluating] Collection transition evaluation", {
        hasEnoughExplored,
        hasBestTile, 
        shouldTransition,
        result: hasEnoughExplored && hasBestTile && shouldTransition,
        botId: context.entityId
      });
      
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
