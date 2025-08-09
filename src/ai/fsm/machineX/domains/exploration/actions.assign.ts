/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import type { DroneVisualState } from '../../../../../types/drone';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

// Import de la logique de déploiement de drone depuis l'ancien système
import { droneDeployForExploration } from '../../actionsold/core/exploring.core';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour le déploiement de drone en exploration
 * Migré depuis actions.pure.v5.ts
 */
export const assignDroneDeployingContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignDroneDeployingContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    contextKeys: Object.keys(context || {})
  });
  
  // Vérification de sécurité pour l'événement
  if (!event || !event.type) {
    fsmLogger.info(`⚠️ [${context?.entityId || 'unknown'}] assignDroneDeployingContext called with invalid event`);
    return {}; // Préserver le contexte
  }
  
  fsmLogger.info(`🔄 [${context.entityId}] Updating context for drone deployment: ${event.type}`);
  
  if (event.type === 'NEED_EXPLORING') {
    // Déployer le drone pour l'exploration en utilisant la logique existante
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
    
    return {
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
  }
  
  // Pour les autres événements, ne pas modifier le contexte
  fsmLogger.info(`⚠️ [${context.entityId}] No drone deployment needed for event: ${event.type}`);
  return {};
});

/**
 * Action assign pour mettre à jour l'état du drone lors du passage en scanning
 */
export const assignDroneScanningContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignDroneScanningContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentDroneState: context.droneFleet?.drones?.explorer?.state
  });
  
  if (!context.droneFleet?.drones?.explorer) {
    fsmLogger.info(`⚠️ [${context.entityId}] No explorer drone found in context`);
    return {};
  }
  
  fsmLogger.info(`📡 [${context.entityId}] Updating drone state to scanning`);
  
  const droneState: DroneVisualState = 'scanning';
  
  return {
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
});

/**
 * Action assign pour mettre à jour l'état du drone lors du passage en returning
 */
export const assignDroneReturningContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignDroneReturningContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentDroneState: context.droneFleet?.drones?.explorer?.state
  });
  
  if (!context.droneFleet?.drones?.explorer) {
    fsmLogger.info(`⚠️ [${context.entityId}] No explorer drone found in context`);
    return {};
  }
  
  fsmLogger.info(`🔙 [${context.entityId}] Updating drone state to returning`);
  
  const droneState: DroneVisualState = 'returning';
  
  return {
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
});

// Placeholder pour éviter les erreurs d'import
export const __explorationAssignPlaceholder = createAssignAction(({ context }) => {
  fsmLogger.info(`🔄 [${context.entityId}] Exploration assign actions placeholder`);
  return {};
});
