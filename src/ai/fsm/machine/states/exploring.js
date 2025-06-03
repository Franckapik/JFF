/**
 * ============================================================================
 * État EXPLORING - Exploration et découverte
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
import { discoveryGuards } from '../guards/index.js';
import { droneDeploymentActions, droneDeploymentGuards } from '../actions/core/droneActions.js';
import { selectExplorationTarget } from '../../utils/explorationTargetSelector.js';
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État EXPLORING - Exploration et découverte de ressources
 */
export const exploringState = state(
  // === ÉVÉNEMENTS DE PROGRESSION ===
  
  // NOUVEAU: Entrée dans l'état exploring → déployer drone automatiquement (FSM pur)
  // Utilisation d'immediate pour déclencher une action à l'entrée de l'état
  immediate(BOT_STATES.EXPLORING,
    guard((context) => !context.droneFleet?.drones?.explorer?.isActive),
    reduce((context, event) => {
      // Sélectionner automatiquement une zone d'exploration
      const explorationTarget = selectExplorationTarget(context);
      
      if (!explorationTarget) {
        console.warn('[Exploring] No suitable exploration target found');
        return {
          ...context,
          hasExplored: true,
          explorationStatus: 'no_target_found',
          currentAction: 'exploration_skipped'
        };
      }

      // Utiliser le reducer de flotte FSM (sans Player Store)
      const deploymentResult = contextReducers.droneFleet.deployDrone(context, {
        targetArea: explorationTarget,
        droneType: 'explorer'
      });
      
      fsmLogger.info(`[Exploring] FSM drone deployed to target: ${explorationTarget}`, {
        droneState: deploymentResult.droneFleet?.drones?.explorer
      });
      
      return deploymentResult;
    })
  ),

  // Drone déployé avec succès (événement existant, maintenant connecté)
  transition(MOVEMENT_EVENT_TYPES.DRONE_DEPLOYED, BOT_STATES.EXPLORING, 
    guard(() => true),
    reduce((context, event) => {
      // Maintenir la compatibilité existante
      return {
        ...context,
        isDroneAtShip: false,
        droneTarget: event.targetArea,
        deploymentTime: Date.now(),
        currentAction: 'drone_exploring'
      };
    })
  ),

  // Mise à jour position drone en temps réel
  transition(MOVEMENT_EVENT_TYPES.DRONE_POSITION_UPDATE, BOT_STATES.EXPLORING,
    guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),
    
    // REDUCE: Mettre à jour la position dans le contexte (pur)
    reduce((context, event) => {
      return contextReducers.droneFleet.updatePosition(context, {
        droneType: event.droneType || 'explorer',
        position: event.position,
        state: event.state || 'exploring'
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
