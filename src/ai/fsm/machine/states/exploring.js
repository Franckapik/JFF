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
import { createUpdatePositionTransition } from '../utils/stateHelpers.js';
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État EXPLORING - Exploration et découverte de ressources
 */
export const exploringState = state(
  // === ÉVÉNEMENTS DE PROGRESSION ===

  // DEPLOYING → PROSPECTING : Drone a atteint sa cible, commencer la prospection
  transition(MOVEMENT_EVENT_TYPES.DRONE_REACHED_TARGET, BOT_STATES.EXPLORING_PROSPECTING,
    guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),
    reduce((context, event) => {
      fsmLogger.info("🎯 [Exploring] Drone reached target, starting prospecting phase", { 
        tileCoord: event.tileCoord, 
        botId: context.botId 
      });
      
      // Marquer la tuile comme explorée
      const markedContext = explorationActions.markTileExplored(context, event);
      
      // Mettre à jour l'état du drone pour la prospection
      return {
        ...markedContext,
        currentAction: 'drone_prospecting',
        droneFleet: {
          ...markedContext.droneFleet,
          drones: {
            ...markedContext.droneFleet.drones,
            explorer: {
              ...markedContext.droneFleet.drones.explorer,
              state: 'prospecting',
              lastUpdate: Date.now(),
              lastExploredTile: event.tileCoord,
              prospectingStartTime: Date.now() // Pour le timeout
            }
          }
        },
        lastExploredTile: event.tileCoord
      };
    })
  ),

  // PROSPECTING → RETURNING : Prospection terminée, retour à la base avec les données
  transition(MOVEMENT_EVENT_TYPES.PROSPECTING_COMPLETE, BOT_STATES.EXPLORING_RETURNING,
    guard((context, event) => {
      // Diagnostic approfondi de la structure de l'événement
      const isActive = context.droneFleet?.drones?.explorer?.isActive;
            
      // Test différentes façons d'accéder aux données
      const hasTileCoord = !!event.tileCoord;
      const hasResourcesFound = event.resourcesFound !== undefined;
      const droneState = context.droneFleet?.drones?.explorer?.state;
    
      
      const guardResult = isActive && hasTileCoord && hasResourcesFound;
      
      fsmLogger.info(`🔍 [Exploring] Guard result: ${guardResult}`, {
        botId: context.botId,
        guardConditions: { isActive, hasTileCoord, hasResourcesFound }
      });
      
      // Vérifier que le drone est actif et que l'événement contient des données valides
      return guardResult;
    }),
    reduce((context, event) => {
      fsmLogger.info("💎 [Exploring] Prospecting completed, returning to base with data", { 
        tileCoord: event.tileCoord,
        resourcesFound: event.resourcesFound,
        botId: context.botId 
      });

      // Enregistrer les ressources découvertes dans le contexte
      let updatedContext = { ...context };

      // Si des ressources ont été trouvées, les enregistrer
      if (event.resourcesFound && 
          (event.resourcesFound.food > 0 || 
           event.resourcesFound.debris > 0 || 
           event.resourcesFound.special > 0)) {
        
        // Créer un objet ressource standardisé
        const discoveredResource = {
          coord: event.tileCoord,
          type: 'mixed', // Type mixte car on peut avoir plusieurs types
          quantity: {
            food: event.resourcesFound.food || 0,
            debris: event.resourcesFound.debris || 0,
            special: event.resourcesFound.special || 0
          },
          discoveredAt: Date.now(),
          prospected: true // Marquer comme déjà prospecté
        };

        // Utiliser le reducer pour enregistrer la ressource (si disponible)
        if (contextReducers.resource?.recordDiscoveredResource) {
          updatedContext = contextReducers.resource.recordDiscoveredResource(updatedContext, {
            resource: discoveredResource
          });
        } else {
          // Fallback : ajouter directement aux ressources découvertes
          updatedContext.discoveredResources = [
            ...(updatedContext.discoveredResources || []),
            discoveredResource
          ];
        }

        fsmLogger.info("📦 [Exploring] Resources discovered and recorded", {
          resource: discoveredResource,
          botId: context.botId
        });
      }

      // Marquer la tuile comme prospectée
      const prospectedContext = {
        ...updatedContext,
        prospectedTiles: [
          ...(updatedContext.prospectedTiles || []),
          {
            coord: event.tileCoord,
            timestamp: Date.now(),
            resources: event.resourcesFound
          }
        ],
        lastProspectedTile: event.tileCoord,
        hasNewDiscovery: true // Marquer qu'il y a une nouvelle découverte
      };

      // ✅ CORRECTION: Utiliser le reducer corrigé
      return contextReducers.state.prepareReturning(prospectedContext, {
        reason: 'prospection_completed',
        prospectionData: {
          tileCoord: event.tileCoord,
          resourcesFound: event.resourcesFound,
          timestamp: Date.now()
        }
      });
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
