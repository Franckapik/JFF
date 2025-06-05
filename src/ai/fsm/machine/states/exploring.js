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

  // ENTRÉE DANS L'ÉTAT PRINCIPAL → INIT (seulement si on vient de l'extérieur)
  immediate(BOT_STATES.EXPLORING_INIT,
    guard((context, event) => {
      // Seulement si on vient de l'extérieur (pas déjà dans une sous-état exploring)
      const isFromExternalState = !context.currentAction?.startsWith('exploring_') && 
                                  !context.currentAction?.startsWith('drone_');
      const isDroneInactive = !context.droneFleet?.drones?.explorer?.isActive;
      const noDeploymentAttempted = !context.droneFleet?.deploymentAttempted;
      
      return isFromExternalState && isDroneInactive && noDeploymentAttempted;
    }),
    reduce((context, event) => {
      fsmLogger.info("🚁 [Exploring] Initializing exploration phase");
      
      return {
        ...context,
        currentAction: 'exploring_init',
        lastStateChange: Date.now()
      };
    })
  ),

  // INIT → DEPLOYING : Déployer le drone automatiquement (seulement si on est en init)
  immediate(BOT_STATES.EXPLORING_DEPLOYING,
    guard((context) => {
      const isInInitState = context.currentAction === 'exploring_init';
      const isDroneInactive = !context.droneFleet?.drones?.explorer?.isActive;
      const noDeploymentAttempted = !context.droneFleet?.deploymentAttempted;
      
      return isInInitState && isDroneInactive && noDeploymentAttempted;
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
        currentAction: 'drone_deploying',
        droneFleet: {
          ...deploymentResult.droneFleet,
          deploymentAttempted: true
        }
      };
    })
  ),

  // DEPLOYING → ACTIVE : Drone déployé avec succès
  transition(MOVEMENT_EVENT_TYPES.DRONE_DEPLOYED, BOT_STATES.EXPLORING_ACTIVE,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("🚁 [Exploring] Drone successfully deployed, now exploring...");
      
      const newContext = {
        ...context,
        isDroneAtShip: false,
        droneTarget: event.targetArea,
        deploymentTime: Date.now(),
        currentAction: 'drone_exploring',
        // Force new reference by creating completely new droneFleet object
        droneFleet: {
          ...context.droneFleet,
          deploymentCompleted: true,
          deploymentAttempted: true,
          explorationStarted: true,
          explorationStartTime: Date.now(),
          // Force new reference by creating completely new drones object
          drones: {
            ...context.droneFleet.drones,
            // Force new reference by creating completely new explorer object
            explorer: {
              ...context.droneFleet.drones.explorer,
              state: 'exploring', // ✅ CHANGEMENT D'ÉTAT CRUCIAL !
              lastUpdate: Date.now(),
              deployedPosition: event.position,
              // Add a unique timestamp to force context update detection
              stateChangeId: `exploring_${Date.now()}_${Math.random()}`
            }
          }
        },
        // Add a global context update tracker
        lastContextUpdate: Date.now(),
        contextUpdateId: `drone_deployed_${Date.now()}_${Math.random()}`
      };

      // DEBUG: Vérifier que le changement d'état a eu lieu
      console.log(`[Exploring] DRONE_DEPLOYED context update:`, {
        oldState: context.droneFleet?.drones?.explorer?.state,
        newState: newContext.droneFleet?.drones?.explorer?.state,
        botId: context.botId
      });

      return newContext;
    })
  ),

  // ACTIVE → RECALLING : Drone a atteint sa cible
  transition(MOVEMENT_EVENT_TYPES.DRONE_REACHED_TARGET, BOT_STATES.EXPLORING_RECALLING,
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
        currentAction: 'drone_recalling',
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

  // RECALLING → EVALUATING : Drone de retour, exploration terminée
  transition(MOVEMENT_EVENT_TYPES.DRONE_RETURNED, BOT_STATES.EVALUATING,
    guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Exploring] Drone returned to ship, exploration completed", { 
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
        currentAction: 'exploration_completed',
        droneFleet: {
          ...dockedContext.droneFleet,
          // Keep deploymentAttempted: true to prevent infinite loop
          explorationStarted: false,
          explorationStartTime: null
        }
      }, {
        reason: 'exploration_completed'
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
  )
);
