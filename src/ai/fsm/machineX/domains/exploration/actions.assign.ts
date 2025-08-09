/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { DroneType, DroneVisualState } from '../../../../../types/drone';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { TileStoreType } from '../../../../../types/stores';
import type { MachineEvents } from '../../events.pure.v5';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour le déploiement de drone en exploration
 * Logique fusionnée : sélection de tuile + mise à jour contexte en une seule fois
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
    const droneType: DroneType = 'explorer';
    const range = 3;
    
    // Vérifier si le drone existe dans la flotte
    if (!context.droneFleet?.drones[droneType]) {
      fsmLogger.error(`❌ [${context.entityId}] Drone ${droneType} not found in fleet`);
      return {
        error: `Drone ${droneType} not found in fleet`,
        lastAction: 'droneDeployForExploration_failed'
      };
    }

    // Obtenir la position du vaisseau
    const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
    if (!shipPosition) {
      fsmLogger.error(`❌ [${context.entityId}] No ship position available for drone deployment`);
      return {
        error: 'No ship position available',
        lastAction: 'droneDeployForExploration_failed'
      };
    }

    // Utiliser la fonction du tileStore pour sélectionner une tuile cible
    const tileStore = useTileStore.getState() as TileStoreType;
    const targetPosition = tileStore.selectTargetTileInRadiusForDrone(shipPosition, range);

    // Si aucune cible valide dans le rayon autorisé, déclencher un retour en évaluation
    if (!targetPosition) {
      fsmLogger.debug(`[${context.entityId}] No valid exploration targets within radius ${range}, area exploration complete`);
      return {
        explorationCycle: {
          ...context.explorationCycle,
          isActive: false,
          phase: 'idle'
        },
        lastAction: 'droneDeployForExploration_noTargets'
      };
    }

    fsmLogger.info(`🚁 [${context.entityId}] Deploying drone for exploration to target:`, {
      targetPosition,
      shipPosition,
      range
    });
    
    const droneState: DroneVisualState = 'deploying';
    const updatedDrone = {
      ...context.droneFleet.drones[droneType],
      state: droneState,
      targetPosition,
      isActive: true,
      isMoving: true, // ✅ IMPORTANT: Le drone est en mouvement vers sa cible
      lastUpdate: Date.now()
    };

    // Mise à jour complète du contexte en une seule fois
    const updatedContext = {
      droneFleet: {
        ...context.droneFleet,
        currentMission: {
          type: 'explore' as const,
          target: context.vehicle.coord,
          drones: [droneType] as DroneType[]
        },
        missionStartTime: Date.now(),
        drones: {
          ...context.droneFleet.drones,
          [droneType]: updatedDrone
        }
      },
      explorationCycle: {
        ...context.explorationCycle,
        isActive: true,
        phase: 'exploring' as const
      },
      lastAction: 'droneDeployForExploration_success'
    };
    
    fsmLogger.info(`✅ [${context.entityId}] Drone deployment result:`, {
      hasDroneFleet: !!updatedContext.droneFleet,
      explorer: updatedContext.droneFleet?.drones?.explorer,
      targetPosition: updatedContext.droneFleet?.drones?.explorer?.targetPosition
    });
    
    return updatedContext;
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
 * Mise à jour de la cible vers la position du vaisseau pour corriger le mouvement
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
  
  // Obtenir la position du vaisseau comme cible de retour
  const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
  if (!shipPosition) {
    fsmLogger.error(`❌ [${context.entityId}] No ship position available for drone return`);
    return {};
  }
  
  fsmLogger.info(`🔙 [${context.entityId}] Updating drone state to returning with target:`, {
    shipPosition,
    currentDronePosition: context.droneFleet.drones.explorer.position
  });
  
  const droneState: DroneVisualState = 'returning';
  
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...context.droneFleet.drones.explorer,
          state: droneState,
          targetPosition: shipPosition, // ✅ IMPORTANT: Cible mise à jour vers la base
          isMoving: true, // ✅ IMPORTANT: Le drone doit bouger vers la base
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
