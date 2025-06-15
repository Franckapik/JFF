/**
 * ============================================================================
 * STATE EXPLORING - Exploration et découverte
 * ============================================================================
 * 
 * État d'exploration pour découvrir de nouvelles ressources.
 * Déploie des drones et explore la carte.
 * 
 * 📋 TRANSITIONS DISPONIBLES DANS CET ÉTAT:
 * ==========================================
 * 
 * 🎯 PROGRESSION EXPLORATION:
 * - DRONE_REACHED_TARGET → EXPLORING_PROSPECTING (drone atteint cible)
 * - PROSPECTING_COMPLETE → EXPLORING_RETURNING (prospection terminée)
 * 
 * 🏠 RETOUR À LA BASE (EXPLORING_RETURNING):
 * - MOVEMENT_STARTED → EXPLORING_RETURNING (mouvement vers base)
 * - MOVEMENT_PROGRESS → EXPLORING_RETURNING (progression mouvement)
 * - DRONE_APPROACHING_SHIP → EVALUATING (drone s'approche du vaisseau)
 * - DRONE_REACHED_SHIP → EVALUATING (drone arrivé au vaisseau)
 * 
 * 🚨 GESTION URGENCES:
 * - EMERGENCY_RESOLVED → EVALUATING
 * - EMERGENCY_DETECTED → EXPLORING_RETURNING (nouvelle urgence)
 * - CRITICAL_FUEL → IDLE_AT_BASE (atterrissage d'urgence)
 * 
 * ⏰ TIMEOUTS ET ÉCHECS: [COMMENTÉS]
 * 🛑 CONTRÔLES UTILISATEUR: [COMMENTÉS]
 * 📦 DÉCOUVERTES: [COMMENTÉS]
 * ❌ ÉCHECS: [COMMENTÉS]
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
import { safetyGuards, baseGuards } from '../guards/indexGuard.js';
import { droneExploringActions } from '../actions/core/droneExploringActions.js'; // NOUVEAU - Remplace explorationActions
import { discoveryGuards } from '../guards/indexGuard.js';
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
      const markedContext = droneExploringActions.droneMarkTileExplored(context, event);
      
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

  // === EXPLORING_RETURNING TRANSITIONS (depuis returning.js) ===
  
  // Mouvement en cours vers la base depuis EXPLORING_RETURNING
  transition(MOVEMENT_EVENT_TYPES.MOVEMENT_STARTED, BOT_STATES.EXPLORING_RETURNING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("🚀 [Exploring] Starting movement to base", { 
        botId: context.botId,
        targetCoord: event.targetCoord 
      });
      
      // Utiliser le reducer de mouvement
      const movementContext = contextReducers.movement.startMovement(context, {
        targetTile: {
          coord: event.targetCoord
        }
      });
      
      // Mettre à jour le statut du contexte
      return {
        ...movementContext,
        movementStatus: 'en_route',
        currentAction: 'moving_to_base'
      };
    })
  ),

  // Progression du mouvement vers la base depuis EXPLORING_RETURNING
  transition(MOVEMENT_EVENT_TYPES.MOVEMENT_PROGRESS, BOT_STATES.EXPLORING_RETURNING,
    guard(() => true),
    reduce((context, event) => ({
      ...context,
      position: event.currentPosition,
      movementProgress: event.progress,
      estimatedArrival: event.estimatedArrival
    }))
  ),

  // DRONE_REACHED_SHIP ou DRONE_APPROACHING_SHIP - Drone de retour au vaisseau depuis EXPLORING_RETURNING
  transition(MOVEMENT_EVENT_TYPES.DRONE_REACHED_SHIP, BOT_STATES.EVALUATING,
    guard((context, event) => {
      // Vérifier si le drone est actif et en état "returning" - c'est lui qui doit être docké
      const drone = context.droneFleet?.drones?.explorer;
      const shouldDock = drone?.isActive && drone?.state === 'returning';
      
      fsmLogger.info("🏠 [Exploring] DRONE_REACHED_SHIP guard check", { 
        botId: context.botId,
        currentState: context.currentState,
        droneState: drone?.state,
        isActive: drone?.isActive,
        shouldTransition: shouldDock
      });
      
      return shouldDock;
    }),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Exploring] Drone reached ship, docking complete", { 
        botId: context.botId,
        droneType: event.droneType || 'explorer'
      });
      
      // Ancrer le drone au vaisseau
      const dockedContext = contextReducers.droneDeployment.dockDrone(context, {
        droneType: event.droneType || 'explorer'
      });
      
      // Préparer l'évaluation suivante
      return contextReducers.state.prepareEvaluating(dockedContext, {
        reason: 'drone_reached_ship_successfully'
      });
    })
  ),
  
  // DRONE_APPROACHING_SHIP - Drone qui s'approche du vaisseau pendant le retour
  transition(MOVEMENT_EVENT_TYPES.DRONE_APPROACHING_SHIP, BOT_STATES.EVALUATING,
    guard((context, event) => {
      // Vérifier si le drone est actif et en état "returning"
      const drone = context.droneFleet?.drones?.explorer;
      const isApproaching = drone?.isActive && drone?.state === 'returning';
      
      fsmLogger.info("🏠 [Exploring] DRONE_APPROACHING_SHIP guard check", { 
        botId: context.botId,
        currentState: context.currentState,
        droneState: drone?.state,
        isActive: drone?.isActive,
        distance: event.distance,
        shouldTransition: isApproaching
      });
      
      return isApproaching;
    }),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Exploring] Drone approaching ship, preparing evaluation", { 
        botId: context.botId,
        droneType: event.droneType || 'explorer',
        distance: event.distance
      });
      
      // Préparer l'évaluation anticipée
      return contextReducers.state.prepareEvaluating(context, {
        reason: 'drone_approaching_ship'
      });
    })
  ),
  
  // Maintenir la compatibilité avec l'ancien nom d'événement DRONE_RETURNED
  transition(MOVEMENT_EVENT_TYPES.DRONE_RETURNED, BOT_STATES.EVALUATING,
    guard((context, event) => {
      // Vérifier la compatibilité avec l'ancien format
      const drone = context.droneFleet?.drones?.explorer;
      const isReturnable = !drone?.isActive || drone?.state === 'docked' || (event.isApproaching === true && drone?.state === 'returning');
      
      fsmLogger.info("🏠 [Exploring] DRONE_RETURNED (legacy) guard check", { 
        botId: context.botId,
        currentState: context.currentState,
        droneState: drone?.state,
        isActive: drone?.isActive,
        isApproaching: event.isApproaching,
        shouldTransition: isReturnable
      });
      
      return isReturnable;
    }),
    reduce((context, event) => {
      fsmLogger.info("🏠 [Exploring] Drone returned to ship (legacy event), handling completion", { 
        botId: context.botId,
        droneType: event.droneType || 'explorer'
      });
      
      // Si c'est une approche, traiter comme DRONE_APPROACHING_SHIP
      if (event.isApproaching === true) {
        return contextReducers.state.prepareEvaluating(context, {
          reason: 'drone_approaching_ship_legacy'
        });
      }
      
      // Sinon, traiter comme un DRONE_REACHED_SHIP
      const dockedContext = contextReducers.droneDeployment.dockDrone(context, {
        droneType: event.droneType || 'explorer'
      });
      
      // Préparer l'évaluation suivante
      return contextReducers.state.prepareEvaluating(dockedContext, {
        reason: 'drone_returned_successfully_legacy'
      });
    })
  ),

  // === GESTION DES URGENCES depuis EXPLORING_RETURNING ===
  
  // Urgence résolue pendant le retour
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_RESOLVED, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("✅ [Exploring] Emergency resolved during return", { 
        botId: context.botId,
        condition: event.condition 
      });
      
      return {
        ...context,
        emergencyFlag: false,
        emergencyReason: null,
        resolvedCondition: event.condition,
        resolutionTime: Date.now(),
        currentAction: 'emergency_resolved',
        lastStateChange: Date.now()
      };
    })
  ),

  // Carburant critique pendant le retour
  transition(EMERGENCY_EVENT_TYPES.CRITICAL_FUEL, BOT_STATES.IDLE_AT_BASE,
    guard(() => true),
    reduce((context) => {
      fsmLogger.info("🔥 [Exploring] Critical fuel during return - emergency landing", { 
        botId: context.botId 
      });
      
      return {
        ...context,
        fuelStatus: 'critical',
        emergencyLanding: true,
        currentAction: 'emergency_landing',
        // Forcer l'arrivée à la base
        isDroneAtShip: true,
        lastStateChange: Date.now()
      };
    })
  ),

  // Nouvelle urgence détectée pendant EXPLORING_RETURNING
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.EXPLORING_RETURNING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("🚨 [Exploring] New emergency detected during return", { 
        botId: context.botId,
        emergencyReason: event.reason 
      });
      
      return {
        ...context,
        emergencyFlag: true,
        emergencyReason: event.reason || 'unknown',
        emergencyStack: [
          ...(context.emergencyStack || []),
          {
            reason: event.reason,
            timestamp: Date.now()
          }
        ],
        currentAction: 'multiple_emergencies'
      };
    })
  )

  // ============================================================================
  // ❌ TRANSITIONS COMMENTÉES - Non essentielles pour le flux principal
  // ============================================================================

  // === TIMEOUTS ET ÉCHECS ===
  /*
  // Timeout de navigation (45s)
  transition(SYSTEM_EVENT_TYPES.NAVIGATION_TIMEOUT, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context) => {
      fsmLogger.info("⏰ [Exploring] Navigation timeout during return", { 
        botId: context.botId 
      });
      
      return {
        ...context,
        navigationStatus: 'timeout',
        currentAction: 'navigation_timeout',
        // En cas de timeout, considérer qu'on est arrivé à la base
        isDroneAtShip: true,
        emergencyFlag: false,
        lastStateChange: Date.now()
      };
    })
  ),

  // Échec de navigation
  transition(EMERGENCY_EVENT_TYPES.NAVIGATION_FAILED, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      fsmLogger.info("❌ [Exploring] Navigation failed during return", { 
        botId: context.botId,
        reason: event.reason 
      });
      
      return {
        ...context,
        navigationStatus: 'failed',
        errorReason: event.reason,
        currentAction: 'navigation_failed',
        // En cas d'échec, reset l'état d'urgence
        emergencyFlag: false,
        lastStateChange: Date.now()
      };
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
  */

  // === CONTRÔLES UTILISATEUR ===
  /*
  // Stop demandé pendant EXPLORING_RETURNING
  transition(USER_EVENT_TYPES.STOP, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context) => {
      fsmLogger.info("🛑 [Exploring] Stop requested during return", { 
        botId: context.botId 
      });
      
      return {
        ...context,
        stopFlag: true,
        currentAction: 'stop_requested',
        lastStateChange: Date.now()
      };
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
  */

  // === DÉCOUVERTES ===
  /*
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
  */

  // === ÉCHECS ===
  /*
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
  */
);