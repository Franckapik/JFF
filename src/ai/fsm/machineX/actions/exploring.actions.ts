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

import { assign } from 'xstate';

import fsmLogger from '../../../../logger/fsmLogger.ts';
import type { DroneVisualState } from '../../../../types/drone.d.ts';
import type { FSMContext, FSMEvent } from '../../../../types/fsm.d.ts';

import { droneDeployForExploration } from './core/droneExploringActions.ts';

// Types pour les actions XState v5
interface XStateAction {
  context: FSMContext;
  event?: FSMEvent;
}

/**
 * Action d'entrée de l'état exploring : log + initialisation éventuelle
 */
export const action_exploring_entry = ({ context }: XStateAction) => {
  fsmLogger.state(`🚀 [${context.entityId}] Entering exploring state`);
  // TODO: Initialisation du cycle d'exploration si besoin
};

/**
 * Action de sortie de l'état exploring : simple log
 */
export const action_exploring_exit = ({ context }: XStateAction) => {
  fsmLogger.state(`🏁 [${context.entityId}] Exiting exploring state`);
};

// ============================================================================
// ACTION DE TRANSITION EXPLORING
// ============================================================================

/**
 * Action de mise à jour du contexte avec déploiement de drone pour l'exploration
 * 🆕 CORRECTION: Utiliser assign avec la bonne signature XState v5
 */
export const updateContext = assign(({ context, event }: XStateAction) => {
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
      type: 'droneDeployForExploration',
      range: 3,
      droneType: 'explorer'
    });
    
    fsmLogger.info(`✅ [${context.entityId}] Drone deployment result:`, {
      hasDroneFleet: !!deploymentResult.droneFleet,
      explorer: deploymentResult.droneFleet?.drones?.explorer,
      targetPosition: deploymentResult.droneFleet?.drones?.explorer?.targetPosition
    });
    
    const droneState: DroneVisualState = 'deploying';
    const newContext: FSMContext = {
      ...deploymentResult,
      droneFleet: {
        ...deploymentResult.droneFleet,
        drones: {
          ...deploymentResult.droneFleet.drones,
          explorer: {
            ...deploymentResult.droneFleet.drones.explorer,
            state: droneState,
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
export const action_drone_deploying_entry = ({ context }: XStateAction) => {
  fsmLogger.state(`🛸 [${context.entityId}] Drone deploying - moving to target`);
  // Le déploiement est géré par les actions de l'état evaluating
};

/**
 * Action de sortie drone_deploying : log de fin de déploiement
 */
export const action_drone_deploying_exit = ({ context }: XStateAction) => {
  fsmLogger.state(`✅ [${context.entityId}] Drone deployment complete - reached target`);
};

// ============================================================================
// ACTIONS SOUS-ÉTATS : DRONE SCANNING
// ============================================================================

/**
 * Action d'entrée drone_scanning : démarrage du scan + mise à jour de l'état du drone
 */
export const action_drone_scanning_entry = assign(({ context }: XStateAction) => {
  fsmLogger.state(`🔍 [${context.entityId}] Drone scanning - analyzing tile`);
  
  // Mettre à jour l'état du drone dans le contexte pour synchroniser avec la FSM
  if (context.droneFleet?.drones?.explorer) {
    const droneState: DroneVisualState = 'scanning';
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          explorer: {
            ...context.droneFleet.drones.explorer,
            state: droneState,
            lastUpdate: Date.now()
          }
        }
      }
    };
  }
  
  return context;
});

/**
 * Action de sortie drone_scanning : log de fin de scan + potentielle mise à jour d'état
 */
export const action_drone_scanning_exit = assign(({ context }: XStateAction) => {
  fsmLogger.state(`📊 [${context.entityId}] Drone scan complete - data collected`);
  
  // Optionnel: mettre à jour l'état du drone pour le retour
  if (context.droneFleet?.drones?.explorer) {
    const droneState: DroneVisualState = 'returning';
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          explorer: {
            ...context.droneFleet.drones.explorer,
            state: droneState,
            lastUpdate: Date.now()
          }
        }
      }
    };
  }
  
  return context;
});

// ============================================================================
// ACTIONS SOUS-ÉTATS : DRONE RETURNING
// ============================================================================

/**
 * Action d'entrée drone_returning : démarrage du retour + mise à jour de l'état du drone
 */
export const action_drone_returning_entry = assign(({ context }: XStateAction) => {
  fsmLogger.state(`🏠 [${context.entityId}] Drone returning - heading to base`);
  
  // Mettre à jour l'état du drone dans le contexte pour synchroniser avec la FSM
  if (context.droneFleet?.drones?.explorer) {
    const droneState: DroneVisualState = 'returning';
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          explorer: {
            ...context.droneFleet.drones.explorer,
            state: droneState,
            lastUpdate: Date.now()
          }
        }
      }
    };
  }
  
  return context;
});

/**
 * Action de sortie drone_returning : log de fin de retour + mise à jour de l'état du drone
 */
export const action_drone_returning_exit = assign(({ context }: XStateAction) => {
  fsmLogger.state(`🔌 [${context.entityId}] Drone return complete - docked to ship`);
  
  // Remettre le drone en état docked quand il revient à la base
  if (context.droneFleet?.drones?.explorer) {
    const droneState: DroneVisualState = 'docked';
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          explorer: {
            ...context.droneFleet.drones.explorer,
            state: droneState,
            isActive: false,
            lastUpdate: Date.now()
          }
        }
      }
    };
  }
  
  return context;
});

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
