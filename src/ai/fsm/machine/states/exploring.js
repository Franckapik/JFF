/**
 * ============================================================================
 * STATE EXPLORING - Exploration et découverte
 * ============================================================================
 * 
 * État d'exploration pour découvrir de nouvelles ressources.
 * Déploie des drones et explore la carte.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce, guard, immediate } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { contextReducers } from '../reducers/context.js';
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents.js';
import { safetyGuards } from '../guards/index.js';
import { movementActions } from '../actions/core/movementActions.js';
import { explorationActions } from '../actions/core/explorationActions.js';
import { discoveryGuards } from '../guards/index.js';
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État EXPLORING - Exploration et découverte de ressources
 */
export const exploringState = state(
  // === ÉVÉNEMENTS DE PROGRESSION ===

  // NOUVEAU: Entrée dans l'état exploring → déployer drone automatiquement (FSM pur)
  // Utilisation d'immediate avec garde pour éviter la boucle infinie
  immediate(BOT_STATES.EXPLORING,
    guard((context) => {
      // Ne déployer QUE si le drone n'est pas actif ET qu'aucun déploiement n'a été tenté
      const isDroneInactive = !context.droneFleet?.drones?.explorer?.isActive;
      const noDeploymentAttempted = !context.droneFleet?.deploymentAttempted;
      
      return isDroneInactive && noDeploymentAttempted;
    }),
    reduce((context, event) => {
      fsmLogger.info("🚁 [Exploring] Deploying drone for first time");
      
      const deploymentResult = contextReducers.droneDeployment.deployDrone(context, {
        range: 3,
        droneType: 'explorer'
      });

      // Marquer qu'une tentative de déploiement a été faite
      return {
        ...deploymentResult,
        droneFleet: {
          ...deploymentResult.droneFleet,
          deploymentAttempted: true
        }
      };
    })
  ),

  // Drone déployé avec succès (événement existant, maintenant connecté)
  transition(MOVEMENT_EVENT_TYPES.DRONE_DEPLOYED, BOT_STATES.EXPLORING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("🚁 [Exploring] Drone successfully deployed, switching to exploring state");
      
      // Note: Le marquage de tuile se fait dans useFSMPositionTracker.js 
      // lors de l'événement DRONE_REACHED_TARGET (plus précis avec position R3F)
      
      // Marquer la tuile comme explorée dans le contexte FSM seulement
      const markedContext = explorationActions.markTileExplored(context, {
        position: event.position,
        tileCoord: event.position ? {
          x: Math.round(event.position.x),
          z: Math.round(event.position.z)
        } : null
      });
      
      // Rappeler immédiatement le drone (pas besoin de rester en exploring)
      const recallResult = contextReducers.droneDeployment.recallDrone(markedContext, {
        droneType: 'explorer'
      });
      
      return {
        ...recallResult,
        isDroneAtShip: false,
        droneTarget: event.targetArea,
        deploymentTime: Date.now(),
        currentAction: 'drone_returning_after_exploration',
        droneFleet: {
          ...recallResult.droneFleet,
          deploymentCompleted: true,
          deploymentAttempted: true,
          drones: {
            ...recallResult.droneFleet.drones,
            explorer: {
              ...recallResult.droneFleet.drones.explorer,
              lastUpdate: Date.now(),
              lastExploredPosition: event.position,
              lastExploredTile: markedContext.tileCoord
            }
          }
        }
      };
    })
  ),

  // 🎯 DRONE REACHED TARGET - Marquer la tuile et rappeler le drone
  transition(MOVEMENT_EVENT_TYPES.DRONE_REACHED_TARGET, BOT_STATES.EXPLORING,
    guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),
    reduce((context, event) => {
      fsmLogger.info("🎯 [Exploring] Drone reached target, marking tile and recalling drone", { 
        tileCoord: event.tileCoord, 
        botId: context.botId 
      });
      
      // Utiliser seulement l'action FSM pure (le marquage du store se fait dans useFSMPositionTracker)
      const markedContext = explorationActions.markTileExplored(context, event);
      
      // NOUVEAU: Rappeler automatiquement le drone après exploration
      const recallResult = contextReducers.droneDeployment.recallDrone(markedContext, {
        droneType: 'explorer'
      });
      
      // Debug: Vérifier l'état du drone après rappel
      fsmLogger.info("🎯 [Exploring] Drone state after recall", {
        droneState: recallResult.droneFleet?.drones?.explorer?.state,
        targetPosition: recallResult.droneFleet?.drones?.explorer?.targetPosition,
        isActive: recallResult.droneFleet?.drones?.explorer?.isActive
      });
      
      // Ajouter les informations spécifiques au drone
      return {
        ...recallResult,
        droneFleet: {
          ...recallResult.droneFleet,
          drones: {
            ...recallResult.droneFleet.drones,
            explorer: {
              ...recallResult.droneFleet.drones.explorer,
              lastUpdate: Date.now(),
              lastExploredTile: event.tileCoord
            }
          }
        },
        lastExploredTile: event.tileCoord
      };
    })
  ),

  // 🏠 DRONE RETURNED - Finaliser le retour et ancrer le drone
  transition(MOVEMENT_EVENT_TYPES.DRONE_RETURNED, BOT_STATES.EXPLORING,
    guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Exploring] Drone returned to ship, docking", { 
        botId: context.botId 
      });
      
      // Ancrer le drone au vaisseau
      const dockedContext = contextReducers.droneDeployment.dockDrone(context, {
        droneType: 'explorer'
      });
      
      // Marquer l'exploration comme terminée et préparer l'évaluation
      return contextReducers.state.prepareEvaluating({
        ...dockedContext,
        hasExplored: true,
        explorationStatus: 'completed_with_return',
        droneFleet: {
          ...dockedContext.droneFleet,
          // Keep deploymentAttempted: true to prevent infinite loop
          // deploymentAttempted: false, <- This was causing the infinite loop!
          explorationStarted: false,
          explorationStartTime: null
        }
      }, {
        reason: 'exploration_completed'
      });
    })
  ),

  // TRANSITION AUTOMATIQUE après déploiement réussi 
  // Si le drone est actif et que le déploiement est marqué comme tenté, commencer l'exploration
  immediate(BOT_STATES.EXPLORING,
    guard((context) => {
      const droneIsActive = context.droneFleet?.drones?.explorer?.isActive;
      const deploymentAttempted = context.droneFleet?.deploymentAttempted;
      const notStartedExploring = !context.droneFleet?.explorationStarted;
      
      return droneIsActive && deploymentAttempted && notStartedExploring;
    }),
    reduce((context, event) => {
      fsmLogger.info("🔍 [Exploring] Starting exploration phase");
      
      // Marquer que l'exploration a commencé et programmer un timeout
      return {
        ...context,
        droneFleet: {
          ...context.droneFleet,
          explorationStarted: true,
          explorationStartTime: Date.now()
        },
        currentAction: 'exploring_active'
      };
    })
  ),

  // Mise à jour position drone en temps réel
  transition(MOVEMENT_EVENT_TYPES.DRONE_POSITION_UPDATE, BOT_STATES.EXPLORING,
    guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),

    // REDUCE: Mettre à jour la position dans le contexte (pur)
    reduce((context, event) => {
      return contextReducers.droneDeployment.updateDronePosition(context, {
        droneType: event.droneType || 'explorer',
        position: event.position,
        state: event.state || 'exploring'
      });
    })
  ),

  // TIMEOUT AUTOMATIQUE - Sortir de l'exploration après 10 secondes
  immediate(BOT_STATES.EVALUATING,
    guard((context) => {
      const explorationStarted = context.droneFleet?.explorationStarted;
      const explorationStartTime = context.droneFleet?.explorationStartTime;
      
      if (!explorationStarted || !explorationStartTime) {
        return false;
      }
      
      // Timeout après 10 secondes (10000ms)
      const elapsed = Date.now() - explorationStartTime;
      return elapsed > 10000;
    }),
    reduce((context, event) => {
      fsmLogger.info("⏰ [Exploring] Exploration timeout - returning to evaluating");
      
      // Marquer l'exploration comme terminée et nettoyer les flags
      return contextReducers.state.prepareEvaluating({
        ...context,
        hasExplored: true,
        explorationStatus: 'timeout_completed',
        droneFleet: {
          ...context.droneFleet,
          deploymentAttempted: false,
          explorationStarted: false,
          explorationStartTime: null
        }
      }, {
        reason: 'exploration_timeout'
      });
    })
  ),

  // Ressources découvertes pendant l'exploration
  transition(RESOURCE_EVENT_TYPES.RESOURCES_DISCOVERED, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      // Enregistrer les ressources découvertes
      let updatedContext = { ...context };

      // Ajouter chaque ressource découverte à la mémoire
      if (event.resources && Array.isArray(event.resources)) {
        event.resources.forEach(resource => {
          updatedContext = contextReducers.resource.recordDiscoveredResource(updatedContext, { resource });
        });
      }

      // Préparer l'évaluation avec découverte de ressources
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'resources_found',
        discoveryTime: Date.now()
      });
    })
  ),

  // Zone explorée avec succès
  transition(RESOURCE_EVENT_TYPES.AREA_EXPLORED, BOT_STATES.EVALUATING,
    guard((context, event) => discoveryGuards.isExplorationComplete(context, event)),
    reduce((context, event) => {
      // Utiliser le reducer d'exploration
      const updatedContext = contextReducers.exploration.markAreaExplored(context, event);

      // Préparer l'évaluation après exploration
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'exploration_complete'
      });
    })
  ),

  // === TIMEOUTS ET ÉCHECS ===

  // Timeout d'exploration (30s)
  transition(SYSTEM_EVENT_TYPES.EXPLORATION_TIMEOUT, BOT_STATES.EVALUATING,
    guard((context, event) => discoveryGuards.isExplorationExpired(context, event)),
    reduce((context, event) => {
      // Marquer comme exploré même si incomplet
      const updatedContext = {
        ...context,
        hasExplored: true,
        explorationStatus: 'timeout'
      };

      // Utiliser le reducer pour préparer l'évaluation
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'exploration_timeout'
      });
    })
  ),

  // Échec de déploiement du drone
  transition(EMERGENCY_EVENT_TYPES.DRONE_DEPLOYMENT_FAILED, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => ({
      ...context,
      hasExplored: true, // Skip exploration si le drone ne peut pas être déployé
      explorationStatus: 'drone_failed',
      errorReason: event.reason,
      currentAction: 'exploration_failed',
      lastStateChange: Date.now()
    }))
  ),

  // Carburant faible détecté pendant l'exploration
  transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED, BOT_STATES.RETURNING,
    guard((context, event) => safetyGuards.isLowFuel(context, event)),
    reduce((context, event) => {
      // Utiliser le reducer d'urgence
      const emergencyContext = contextReducers.emergency.triggerEmergency(context, {
        reason: 'low_fuel_during_exploration'
      });

      // Puis préparer le retour
      return contextReducers.state.prepareReturning(emergencyContext, {
        reason: 'emergency_return',
        emergencyReason: 'low_fuel_during_exploration'
      });
    })
  ),

  // Override manuel
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      // Utiliser le reducer de contrôle manuel
      const manualContext = contextReducers.manual.recordManualCommand(context, event);

      // Puis préparer l'évaluation
      return contextReducers.state.prepareEvaluating(manualContext, {
        reason: 'manual_override'
      });
    })
  ),

  // Urgence générale
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.RETURNING,
    guard(() => true),
    reduce((context, event) => {
      // Utiliser le reducer d'urgence
      const emergencyContext = contextReducers.emergency.triggerEmergency(context, event);

      // Puis préparer le retour
      return contextReducers.state.prepareReturning(emergencyContext, {
        reason: 'emergency_return',
        emergencyReason: event.reason || 'unknown'
      });
    })
  ),

  // Mise à jour de position (reste dans le même état)
  transition('UPDATE_POSITION', BOT_STATES.EXPLORING,
    guard(() => true),
    reduce((context, event) => {
      // Utiliser l'action updatePosition existante
      return movementActions.updatePosition(context, event);
    })
  )
);
