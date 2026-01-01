/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * ✅ Phase 4: Pure actions - uses context.gridInfo instead of useTileStore
 * 
 * NOTE: useTileStore is kept for mutation operations (markTileAsExplored)
 * which require modifying the tile store directly.
 */

import { assign } from 'xstate';

import { calculateDistance, findTilesInRadius, selectRandomTile } from '../../../../../core/spatial/index.ts';
import fsmLogger from '../../../../../logger/fsmLogger.ts';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { DroneVisualState } from '../../../../../types/drone.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour le déploiement de drone en exploration
 * ✅ Phase 4: Uses context.gridInfo.tiles instead of useTileStore.getState()
 */
export const assignDroneDeployingContext = createAssignAction(({ context }) => {
  // ✅ Phase 4: Use context.gridInfo instead of useTileStore.getState()
  const tiles = context.gridInfo?.tiles || {};
  const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
  
  if (!shipPosition) {
    return {};
  }
  
  const range = context.config?.exploringRadius ?? 2;
  
  // ⚠️ GUARD: Vérifier que gridInfo contient des tiles
  if (Object.keys(tiles).length === 0) {
    return {};
  }
  
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
    return {};
  }
  
  // ✅ Calculer la consommation de fuel du drone basée sur la distance
  const dronePos = context.droneFleet?.drones?.explorer?.position || shipPosition;
  const distance = calculateDistance(dronePos, targetDroneTile.position);
  const fuelConsumption = Math.max(1, Math.floor(distance * 0.3)); // 0.3 fuel par unité (drone plus efficace)
  const currentFuel = context.vehicle?.fuel || 100;
  const newFuel = Math.max(0, currentFuel - fuelConsumption);
  
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
    vehicle: {
      ...context.vehicle,
      fuel: newFuel // ✅ Déduire le fuel consommé par le drone
    },
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
  
  fsmLogger.info(`✅ [${context.entityId}] Drone deploying with fuel consumption:`, {
    distance: distance.toFixed(2),
    fuelConsumed: fuelConsumption,
    fuelRemaining: newFuel
  });
  
  return updatedContext;
});

/**
 * Action assign pour mettre à jour l'état du drone lors du passage en scanning
 */
export const assignDroneScanningContext = createAssignAction(({ context }) => {
  const targetDroneTile = context.droneFleet?.drones?.explorer?.targetDroneTile;
  if (!targetDroneTile) {
    return {};
  }
  const scannedPosition = {
    ...targetDroneTile.position,
    y: targetDroneTile.position.y ?? 0.5
  };
  // Incrémentation des compteurs d'exploration (global et par cycle)
  const currentCount = typeof context.explorationCount === 'number' ? context.explorationCount : 0;
  const currentCycleCount = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const updatedExplorer = {
    ...context.droneFleet.drones.explorer,
    position: scannedPosition,
    isMoving: false
  };

  // ⚠️ MUTATION: Mark tile as explored in the tile store
  if (targetDroneTile?.position?.coord) {
    const tileStoreState = typeof useTileStore !== 'undefined' && useTileStore.getState ? useTileStore.getState() : null;
    if (tileStoreState?.markTileAsExplored) {
      tileStoreState.markTileAsExplored(targetDroneTile.position.coord, context.entityId);
    }
  }

  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...updatedExplorer,
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
    return {};
  }
  
  const basePosition = context.vehicle?.basePosition || { x: 0, y: 0.5, z: 0, coord: '0,0' };
  const dockedPosition = {
    ...basePosition,
    y: basePosition.y ?? 0.5
  };
  
  const droneState: DroneVisualState = 'docked';
  
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...context.droneFleet.drones.explorer,
          visualState: droneState,
          position: dockedPosition,
          targetDroneTile: null,
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
