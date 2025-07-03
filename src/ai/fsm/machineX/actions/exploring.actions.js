/**
 * ==========================================================================
 * XSTATE EXPLORING ACTIONS - Actions spécifiques à l'état exploring
 * ==========================================================================
 * 
 * Actions migrées depuis la logique Robot3/XState, version modulaire.
 * Inclut les actions pour tous les sous-états du cycle d'exploration.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

import fsmLogger from '../../../../logger/fsmLogger.js';
import { assign } from 'xstate';
import { droneDeployForExploration } from './core/droneExploringActions.js';

/**
 * Action d'entrée de l'état exploring : log + initialisation éventuelle
 */
export const action_exploring_entry = ({ context, self }) => {
  fsmLogger.state(`🚀 [${context.entityId}] Entering exploring state`);
  // TODO: Initialisation du cycle d'exploration si besoin
};

/**
 * Action de sortie de l'état exploring : simple log
 */
export const action_exploring_exit = ({ context }) => {
  fsmLogger.state(`🏁 [${context.entityId}] Exiting exploring state`);
};

// ============================================================================
// ACTION DE TRANSITION EXPLORING
// ============================================================================

/**
 * Action de mise à jour du contexte avec déploiement de drone pour l'exploration
 * 🆕 CORRECTION: Utiliser assign avec la bonne signature XState v5
 */
export const updateContext = assign(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] updateContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    event: event,
    contextKeys: Object.keys(context || {})
  });
  
  // Vérification de sécurité pour l'événement
  if (!event || !event.type) {
    fsmLogger.info(`⚠️ [${context?.entityId || 'unknown'}] updateContext called with invalid event`);
    return context || {}; // ✅ CORRECTION: Ne pas retourner un objet vide, préserver le contexte
  }
  
  fsmLogger.info(`🔄 [${context.entityId}] Updating context for transition: ${event.type}`);
  
  if (event.type === 'needExploring') {
    // Déployer le drone pour l'exploration
    fsmLogger.info(`🚁 [${context.entityId}] Deploying drone for exploration`);
    
    const deploymentResult = droneDeployForExploration(context, {
      range: 3,
      droneType: 'explorer'
    });
    
    fsmLogger.info(`✅ [${context.entityId}] Drone deployment result:`, {
      hasDroneFleet: !!deploymentResult.droneFleet,
      explorer: deploymentResult.droneFleet?.drones?.explorer,
      targetPosition: deploymentResult.droneFleet?.drones?.explorer?.targetPosition
    });
    
    const newContext = {
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
            state: 'drone_deploying', // 🆕 CORRECTION: Utiliser le nouveau nom d'état
            lastUpdate: Date.now(),
            isActive: true
          }
        }
      }
    };
    
    return newContext;
  }
  
  // Pour les autres événements, retourner le contexte tel quel
  return context;
});

// ============================================================================
// ACTIONS SOUS-ÉTATS : DRONE DEPLOYING
// ============================================================================

/**
 * Action d'entrée drone_deploying : démarrage du déploiement
 */
export const action_drone_deploying_entry = ({ context }) => {
  fsmLogger.state(`🛸 [${context.entityId}] Drone deploying - moving to target`);
  // Le déploiement est géré par les actions de l'état evaluating
};

/**
 * Action de sortie drone_deploying : log de fin de déploiement
 */
export const action_drone_deploying_exit = ({ context }) => {
  fsmLogger.state(`✅ [${context.entityId}] Drone deployment complete - reached target`);
};

// ============================================================================
// ACTIONS SOUS-ÉTATS : DRONE SCANNING
// ============================================================================

/**
 * Action d'entrée drone_scanning : démarrage du scan
 */
export const action_drone_scanning_entry = ({ context }) => {
  fsmLogger.state(`🔍 [${context.entityId}] Drone scanning - analyzing tile`);
  // Le scan est géré par le tracker via setTimeout
};

/**
 * Action de sortie drone_scanning : log de fin de scan
 */
export const action_drone_scanning_exit = ({ context }) => {
  fsmLogger.state(`📊 [${context.entityId}] Drone scan complete - data collected`);
};

// ============================================================================
// ACTIONS SOUS-ÉTATS : DRONE RETURNING
// ============================================================================

/**
 * Action d'entrée drone_returning : démarrage du retour
 */
export const action_drone_returning_entry = ({ context }) => {
  fsmLogger.state(`🏠 [${context.entityId}] Drone returning - heading to base`);
  // Le retour est géré par les actions existantes (droneRecallToShip)
};

/**
 * Action de sortie drone_returning : log de fin de retour
 */
export const action_drone_returning_exit = ({ context }) => {
  fsmLogger.state(`🔌 [${context.entityId}] Drone return complete - docked to ship`);
};

export default {
  action_exploring_entry,
  action_exploring_exit,
  action_drone_deploying_entry,
  action_drone_deploying_exit,
  action_drone_scanning_entry,
  action_drone_scanning_exit,
  action_drone_returning_entry,
  action_drone_returning_exit,
  updateContext  // ✅ Action de déploiement pour les transitions
};
