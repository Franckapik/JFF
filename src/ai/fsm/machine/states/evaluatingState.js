/**
 * ============================================================================
 * État EVALUATING - Évaluation et prise de décision
 * ============================================================================
 * 
 * État central d'évaluation qui détermine la prochaine action à entreprendre.
 * Toutes les transitions d'urgence mènent à cet état.
 * 
 * 📋 TRANSITIONS DISPONIBLES DANS CET ÉTAT:
 * ==========================================
 * 
 * 🚨 PRIORITÉ SÉCURITÉ:
 * - EVALUATION_COMPLETE → EXPLORING_RETURNING (si carburant critique ou capacité pleine)
 * 
 * 🎯 TRANSITIONS NORMALES:
 * - EVALUATION_COMPLETE → EXPLORING_DEPLOYING (si zones non explorées + drone inactif)
 * - EVALUATION_COMPLETE → COLLECTING (si nouvelles ressources découvertes)
 * - EVALUATION_COMPLETE → EXPLORING_RETURNING (si drone pas à la base)
 * - EVALUATION_COMPLETE → IDLE_AT_BASE (par défaut, rien à faire)
 * 
 * 📍 MISES À JOUR POSITION:
 * - SHIP_UPDATE_POSITION → EVALUATING (reste dans l'état)
 * - DRONE_POSITION_UPDATE → EVALUATING (reste dans l'état)
 * 
 * 🤖 ÉVÉNEMENT AUTONOME: [COMMENTÉ]
 * 🆘 TRANSITIONS D'URGENCE: [COMMENTÉES]
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce, guard } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';
import { contextReducers } from '../reducers/context.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';
import { MOVEMENT_EVENT_TYPES } from '../events/movementEvents.js';
import { movementActions } from '../actions/core/movementActions.js';
import { fsmDroneFleetActions } from '../actions/core/droneActions.js';
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * État EVALUATING - Point de décision central
 * Évalue la situation et détermine la prochaine action
 */

export const evaluatingState = state(
  // === TRANSITIONS DE SÉCURITÉ (PRIORITÉ MAX) ===
  
  // Si carburant critique ou capacité pleine → EXPLORING_RETURNING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_RETURNING, 
    // Guard d'urgence
    guard((context, event) => {
      const needsEmergency = safetyGuards.needsEmergencyReturn(context, event);
      const shouldReturnEff = efficiencyGuards.shouldReturnForEfficiency(context, event);
      
      return needsEmergency || shouldReturnEff;
    }),
    // Reducer d'urgence
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour préparer le retour
      const emergencyReason = safetyGuards.isCriticalFuel(context, event) 
        ? 'low_fuel' : 'full_capacity';
      
      // Créer un événement enrichi avec la raison d'urgence
      const enrichedEvent = {
        ...event,
        reason: 'safety_return',
        emergencyReason
      };
      
      // Utiliser le reducer pour préparer le retour
      return contextReducers.state.prepareReturning(context, enrichedEvent);
    })
  ),

  // === TRANSITIONS NORMALES ===
  
  // Si pas encore exploré → EXPLORING_DEPLOYING (directement)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING, 
    // Guard d'exploration
    guard((context, event) => {
      const hasUnexplored = discoveryGuards.hasUnexploredAreas(context, event);
      const isDroneInactive = !context.droneFleet?.drones?.explorer?.isActive;
      const canDeploy = !context.droneFleet?.deploymentAttempted;
      
      return hasUnexplored && isDroneInactive && canDeploy;
    }),
    // Reducer d'exploration - déployer directement
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour préparer l'exploration ET déployer
      const preparedContext = contextReducers.state.prepareExploring(context, event);
      
      // Déployer immédiatement le drone
      const deploymentResult = contextReducers.droneDeployment.deployDrone(preparedContext, {
        range: 3,
        droneType: 'explorer'
      });

      return {
        ...deploymentResult,
        currentAction: 'drone_exploring', // ✅ DIRECTEMENT EN EXPLORATION
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
              state: 'deploying', // ✅ COMMENCER PAR DEPLOYING POUR ANIMATION
              lastUpdate: Date.now(),
              isActive: true
            }
          }
        }
      };
    })
  ),

  // Si nouvelles ressources découvertes → COLLECTING
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.COLLECTING, 
    // Guard pour collection
    guard((context, event) => {
      const isEfficient = efficiencyGuards.isCollectionEfficient(context, event);
      const hasNewResources = context.hasNewResourceDiscovery;
      const hasKnownResources = context.knownResources?.length > 0;
      
      return isEfficient && 
             hasNewResources && 
             hasKnownResources;
    }),
    // Reducer pour collection
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour préparer la collecte
      // avec la première ressource connue comme cible
      const resourceEvent = {
        ...event,
        resource: context.knownResources[0] // Prendre la première ressource
      };
      return contextReducers.state.prepareCollecting(context, resourceEvent);
    })
  ),

  // Si drone pas à la base → EXPLORING_RETURNING (pour récupérer le drone)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_RETURNING, 
    // Guard pour drone pas à la base
    guard((context, event) => {
      const notAtBase = !baseGuards.isAtBase(context, event);
      return notAtBase;
    }),
    // Reducer pour récupération du drone
    reduce((context) => ({
      ...context,
      currentAction: 'returning_for_drone',
      lastDecision: 'retrieve_drone',
      lastStateChange: Date.now()
    }))
  ),

  // Sinon → IDLE_AT_BASE (rien à faire)
  transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.IDLE_AT_BASE, 
    // Guard par défaut
    guard(() => {
      return true;
    }),
    // Reducer par défaut
    reduce((context) => ({
      ...context,
      currentAction: 'idling',
      lastDecision: 'nothing_to_do',
      lastStateChange: Date.now()
    }))
  ),

  // === MISES À JOUR POSITION ===
  
  // Mise à jour de position du vaisseau (reste dans le même état)
  transition(MOVEMENT_EVENT_TYPES.SHIP_UPDATE_POSITION, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      // Utiliser l'action updatePosition existante
      return movementActions.updatePosition(context, event);
    })
  ),

  // Mise à jour de position de drone (reste dans le même état)
  transition(MOVEMENT_EVENT_TYPES.DRONE_POSITION_UPDATE, BOT_STATES.EVALUATING,
    guard(() => true),
    reduce((context, event) => {
      // Utiliser l'action updateDronePosition pour les drones
      return fsmDroneFleetActions.updateDronePosition(context, event);
    })
  )

  // ============================================================================
  // ❌ TRANSITIONS COMMENTÉES - Non essentielles pour le flux principal
  // ============================================================================

  // === ÉVÉNEMENT AUTONOME ===
  /*
  // Déclenchement automatique vers l'exploration
  transition(SYSTEM_EVENT_TYPES.AUTO, BOT_STATES.EXPLORING_DEPLOYING, 
    guard(() => true),
    reduce((context) => {
      // Préparer l'état d'exploration ET déployer directement
      const preparedContext = contextReducers.state.prepareExploring(context, {
        reason: 'auto_exploration',
        timestamp: Date.now()
      });
      
      // Déployer immédiatement le drone
      const deploymentResult = contextReducers.droneDeployment.deployDrone(preparedContext, {
        range: 3,
        droneType: 'explorer'
      });

      return {
        ...deploymentResult,
        currentAction: 'drone_exploring', // ✅ DIRECTEMENT EN EXPLORATION
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
              state: 'deploying', // ✅ COMMENCER PAR DEPLOYING POUR ANIMATION
              lastUpdate: Date.now(),
              isActive: true
            }
          }
        }
      };
    })
  ),
  */

  // === TRANSITIONS D'URGENCE (DEPUIS N'IMPORTE QUEL ÉTAT) ===
  /*
  // Override manuel
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE, BOT_STATES.EVALUATING, 
    guard(() => true),
    reduce((context, event) => ({
      ...context,
      manualCommand: event.command,
      manualParams: event.params,
      lastDecision: 'manual_override',
      lastStateChange: Date.now()
    }))
  ),

  // Urgence détectée
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED, BOT_STATES.EXPLORING_RETURNING, 
    guard(() => true),
    reduce((context, event) => ({
      ...context,
      emergencyFlag: true,
      emergencyReason: event.reason || 'unknown',
      currentAction: 'emergency_return',
      lastDecision: 'emergency',
      lastStateChange: Date.now()
    }))
  ),
  */
);