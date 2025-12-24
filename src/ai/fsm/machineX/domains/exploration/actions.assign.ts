/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 */

import { assign } from 'xstate';

import { findTilesInRadius, selectRandomTile } from '../../../../../core/spatial';
import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { DroneVisualState } from '../../../../../types/drone';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
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
export const assignDroneDeployingContext = createAssignAction(({ context }) => {
  const tileStore = useTileStore.getState();
  const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
  if (!shipPosition) {
    fsmLogger.error(`[${context.entityId}] assignDroneDeployingContext: No ship position available`);
    return {};
  }
  const range = context.config?.exploringRadius ?? 2;
  const tiles = tileStore.tiles;
  const startCoord = shipPosition.coord;
  const candidateTiles = findTilesInRadius(startCoord, range, tiles);
  let targetDroneTile = selectRandomTile(candidateTiles);
  if (targetDroneTile) {
    // Fixe la hauteur Y à 0.5 pour la position cible
    targetDroneTile = {
      ...targetDroneTile,
      position: {
        ...targetDroneTile.position,
        y: 0.5,
      }
    };
  }

  if (!targetDroneTile) {
    fsmLogger.info(`[${context.entityId}] assignDroneDeployingContext: No valid target tile found`);
    return {};
  }
  const droneType = 'explorer';
  const droneState: DroneVisualState = 'deploying';
  const updatedDrone = {
    ...context.droneFleet.drones[droneType],
    visualState: droneState,
    targetDroneTile: targetDroneTile,
    isActive: true,
    isMoving: true,
    lastUpdate: Date.now()
  };
  const updatedContext = {
    droneFleet: {
      ...context.droneFleet,
      currentMission: {
        type: 'explore' as const,
        target: context.vehicle?.basePosition?.coord || '0,0',
        drones: [droneType]
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
    lastAction: 'droneDeployForExploration_success',
    fsmState: 'exploring_deploying',
  };
  fsmLogger.info(`[${context.entityId}] assignDroneDeployingContext: Assigned new targetDroneTile and updated drone context`, { targetDroneTile });
  return updatedContext;
});

/**
 * Action assign pour mettre à jour l'état du drone lors du passage en scanning
 */
export const assignDroneScanningContext = createAssignAction(({ context }) => {
  const targetDroneTile = context.droneFleet?.drones?.explorer?.targetDroneTile;
  if (!targetDroneTile) {
    fsmLogger.warn(`[${context.entityId}] assignDroneScanningContext: No targetDroneTile to push to memory.knownTiles`);
    return {};
  }
  fsmLogger.info(`[${context.entityId}] assignDroneScanningContext: Pushed targetDroneTile to memory.knownTiles`, { targetDroneTile });
  // Incrémentation des compteurs d'exploration (global et par cycle)
  const currentCount = typeof context.explorationCount === 'number' ? context.explorationCount : 0;
  const currentCycleCount = context.memory?.stats?.tilesExploredInCycle ?? 0;
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...context.droneFleet.drones.explorer,
          targetDroneTile: null
        }
      }
    },
    memory: {
      ...context.memory,
      knownTiles: [...(context.memory?.knownTiles ?? []), targetDroneTile],
      stats: {
        ...context.memory?.stats,
        tilesExplored: (context.memory?.stats?.tilesExplored ?? 0) + 1,
        tilesExploredInCycle: currentCycleCount + 1,
        lastExploration: {
          coord: targetDroneTile.position.coord,
          timestamp: Date.now(),
          hasResources: targetDroneTile.hasResources
        }
      }
    },
    explorationCount: currentCount + 1
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
    currentDroneState: context.droneFleet?.drones?.explorer?.visualState
  });
  if (!context.droneFleet?.drones?.explorer) {
    fsmLogger.info(`⚠️ [${context.entityId}] No explorer drone found in context`);
    return {};
  }
  // Obtenir la tuile de base comme cible de retour
  const basePosition = context.vehicle?.basePosition || { x: 0, y: 0.5, z: 0, coord: '0,0' };
  // Fixe la hauteur Y à 0.5 pour la position cible de retour
  const baseTile = {
    position: {
      ...basePosition,
      y: 0.2,
    },
    coord: basePosition.coord ?? '0,0',
    type: 'depart',
    biome: 'station',
    resources: { food: 0, debris: 0, special: 0, total: 0 },
    hasResources: false
  };
  fsmLogger.info(`🔙 [${context.entityId}] Updating drone state to returning with targetDroneTile (base)`, { baseTile });
  const droneState: DroneVisualState = 'returning';
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...context.droneFleet.drones.explorer,
          visualState: droneState,
          targetDroneTile: baseTile,
          isMoving: true,
          lastUpdate: Date.now()
        }
      }
    },
    fsmState: 'exploring_returning',
  };
});

/**
 * Action assign pour remettre le contexte en évaluation après le retour du drone
 */
export const assignDroneDockedContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignDroneDockedContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentDroneState: context.droneFleet?.drones?.explorer?.visualState
  });
  
  if (!context.droneFleet?.drones?.explorer) {
    fsmLogger.info(`⚠️ [${context.entityId}] No explorer drone found in context`);
    return {};
  }
  
  fsmLogger.info(`🏠 [${context.entityId}] Updating drone state to docked and context to evaluating`);
  
  const droneState: DroneVisualState = 'docked';
  
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...context.droneFleet.drones.explorer,
          visualState: droneState,
          isActive: false,
          isMoving: false,
          lastUpdate: Date.now()
        }
      }
    },
    explorationCycle: {
      ...context.explorationCycle,
      isActive: false,
      phase: 'idle' as const
    },
    fsmState: 'evaluating', // 🟢 Retour à l'état global evaluating
  };
});
