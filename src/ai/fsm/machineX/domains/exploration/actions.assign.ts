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

import { calculateDistanceGrid, findTilesInRadius, gridToWorld, selectRandomTile } from '../../../../../core/spatial/index.ts';
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
 * ✅ Fix Bug #6: Exclut les tuiles déjà explorées de la sélection
 */
export const assignDroneDeployingContext = createAssignAction(({ context }) => {
  // ✅ Phase 4: Use context.gridInfo instead of useTileStore.getState()
  const tiles = context.gridInfo?.tiles || {};
  const shipCoord = context.vehicle?.coord || context.vehicle?.baseCoord;
  
  if (!shipCoord) {
    return {};
  }
  
  const range = context.config?.exploringRadius ?? 2;
  
  // ⚠️ GUARD: Vérifier que gridInfo contient des tiles
  if (Object.keys(tiles).length === 0) {
    return {};
  }
  
  // ✅ Get fresh tile state from TileStore for accurate explored status
  const tileStoreState = typeof useTileStore !== 'undefined' && useTileStore.getState ? useTileStore.getState() : null;
  const freshTiles = tileStoreState?.tiles || tiles;
  
  // ✅ Get explored tiles from memory.knownTiles for additional safety
  const exploredCoords = new Set(
    (context.memory?.knownTiles ?? [])
      .filter(t => t?.explored)
      .map(t => t?.position?.coord)
  );
  
  const candidateTiles = findTilesInRadius(shipCoord, range, tiles);
  
  // ✅ Fix Bug #6: Filter out already explored tiles
  const unexploredTiles = candidateTiles.filter(tile => {
    const coord = tile.position?.coord;
    if (!coord) return false;
    
    // Exclure si marqué explored dans TileStore OU dans memory.knownTiles
    const freshTile = freshTiles[coord];
    if (freshTile?.explored) return false;
    if (exploredCoords.has(coord)) return false;
    
    // Exclure la tuile de départ
    if (tile.type === 'depart') return false;
    
    return true;
  });
  
  // ✅ Log pour debug si aucune tuile inexploré
  console.log(`🔍 [DEBUG assignDroneDeployingContext] ship=${shipCoord}, radius=${range}`, {
    candidatesCount: candidateTiles.length,
    unexploredCount: unexploredTiles.length,
    exploredCoordsSize: exploredCoords.size,
    exploredCoordsSample: Array.from(exploredCoords).slice(0, 10),
    candidatesSample: candidateTiles.slice(0, 5).map(t => `${t.position.coord}:explored=${freshTiles[t.position.coord]?.explored}`)
  });
  
  if (unexploredTiles.length === 0) {
    fsmLogger.info(`⚠️ [${context.entityId}] No unexplored tiles in radius ${range}. Candidates: ${candidateTiles.length}, Explored: ${exploredCoords.size}`);
    console.log(`❌ [DEBUG assignDroneDeployingContext] RETURNING EMPTY - no unexplored tiles`);
    return {};
  }
  
  let targetDroneTile = selectRandomTile(unexploredTiles);
  console.log(`🎯 [DEBUG assignDroneDeployingContext] Selected target: ${targetDroneTile?.position?.coord}`);
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
  const droneCoord = context.droneFleet?.drones?.explorer?.coord || shipCoord;
  const distance = calculateDistanceGrid(droneCoord, targetDroneTile.position.coord);
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
        target: context.vehicle?.baseCoord || '0,0' as import('../../../../../types/coordinates').GridCoordinate,
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
  const scannedCoord = targetDroneTile.position.coord;
  // Incrémentation des compteurs d'exploration (global et par cycle)
  const currentCount = typeof context.explorationCount === 'number' ? context.explorationCount : 0;
  const currentCycleCount = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const updatedExplorer = {
    ...context.droneFleet.drones.explorer,
    coord: scannedCoord,
    isMoving: false
  };

  // ⚠️ MUTATION: Mark tile as explored in the tile store
  if (targetDroneTile?.position?.coord) {
    const tileStoreState = typeof useTileStore !== 'undefined' && useTileStore.getState ? useTileStore.getState() : null;
    if (tileStoreState?.markTileAsExplored) {
      tileStoreState.markTileAsExplored(targetDroneTile.position.coord, context.entityId);
    }
  }

  // ✅ Mark tile as explored with proper flags for collection guard
  const exploredTile = {
    ...targetDroneTile,
    explored: true,
    collected: false,
    exploredAt: Date.now(),
    exploredBy: context.entityId
  };

  // ✅ Fix: Éviter les doublons dans knownTiles - vérifier si la tuile existe déjà
  const existingKnownTiles = context.memory?.knownTiles ?? [];
  const isAlreadyKnown = existingKnownTiles.some(
    t => t?.position?.coord === scannedCoord
  );
  
  // ✅ Si la tuile est déjà connue, ne pas l'ajouter encore une fois
  const updatedKnownTiles = isAlreadyKnown
    ? existingKnownTiles.map(t => 
        t?.position?.coord === scannedCoord ? exploredTile : t
      )
    : [...existingKnownTiles, exploredTile];

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
      knownTiles: updatedKnownTiles,
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
  const baseCoord = context.vehicle?.baseCoord || '0,0' as import('../../../../../types/coordinates').GridCoordinate;
  
  console.log(`🏠 [DRONE RETURNING] Looking for base tile at baseCoord: ${baseCoord}`);
  console.log(`🏠 [DRONE RETURNING] Current ship coord: ${context.vehicle?.coord}`);
  console.log(`🏠 [DRONE RETURNING] baseCoord from vehicle context: ${context.vehicle?.baseCoord}`);
  console.log(`🏠 [DRONE RETURNING] ⚠️  The drone should return to the FIXED starting tile, not the current ship position!`);
  
  // Conversion en WorldPosition pour targetDroneTile (avec hauteur Y fixée)
  const baseWorldPos = gridToWorld(baseCoord, { defaultY: 0.2 });
  const baseTile = {
    position: {
      ...baseWorldPos,
      coord: baseCoord
    },
    coord: baseCoord,
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
 * Transition: drone_returning → drone_docked (mais on garde l'action assignDroneDockedContext compatible)
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
  
  // Coordonnée du drone docked = coordonnée du vaisseau (strictement)
  const shipCoord = context.vehicle?.coord;
  if (!shipCoord) {
    fsmLogger.warn(`⚠️ [${context.entityId}] Ship coord undefined when docking drone`, {
      vehicleState: context.vehicle
    });
    return {};
  }

  const droneState: DroneVisualState = 'docked';
  
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: {
          ...context.droneFleet.drones.explorer,
          visualState: droneState,
          coord: shipCoord,
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
      phase: 'idle' // Drone docked = waiting for next exploration cycle
    }
  };
});

/**
 * Action assign pour remettre le contexte en évaluation après le drone docked
 * Transition: drone_docked → evaluating (nouvelle action pour la transition)
 */
export const assignDroneReadyContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignDroneReadyContext called - transition to evaluating with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type
  });
  
  return {
    explorationCycle: {
      ...context.explorationCycle,
      isActive: false,
      phase: 'idle' as const
    },
    fsmState: 'evaluating' // 🟢 Retour à l'état global evaluating
  };
});

/**
 * Action assign pour la destruction d'un drone lors de la rencontre d'une tuile danger
 * Met à jour le contexte drone et les statistiques
 */
export const assignDroneDestroyedContext = createAssignAction(({ context, event }) => {
  const eventWithDrone = event as Record<string, unknown>;
  const droneType = (eventWithDrone?.droneType as string) || 'explorer';
  const reason = (eventWithDrone?.reason as string) || 'danger';
  
  const currentDrone = context.droneFleet.drones[droneType as keyof typeof context.droneFleet.drones];
  
  if (!currentDrone) {
    return {};
  }
  
  // Mettre à jour le drone avec l'état détruit
  const updatedDrone = {
    ...currentDrone,
    isActive: false,
    isDestroyed: true,
    visualState: 'failed' as const,
    health: 0,
    isMoving: false
  };
  
  // Incrémenter les compteurs de destruction
  const statsKey = `${droneType}Destroyed` as keyof typeof context.droneFleet.stats;
  
  fsmLogger.info(`[assignDroneDestroyedContext] Drone ${droneType} détruit par ${reason}`);
  
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        [droneType]: updatedDrone
      },
      stats: {
        ...context.droneFleet.stats,
        [statsKey]: (context.droneFleet.stats[statsKey] || 0) + 1
      }
    },
    memory: {
      ...context.memory,
      stats: {
        ...context.memory?.stats,
        dronesDestroyed: (context.memory?.stats?.dronesDestroyed ?? 0) + 1
      }
    }
  };
});

/**
 * Action assign pour incrémenter les compteurs de déploiement de drone
 */
export const assignDroneDeployedContext = createAssignAction(({ context, event }) => {
  const eventWithDrone = event as Record<string, unknown>;
  const droneType = (eventWithDrone?.droneType as string) || 'explorer';
  
  const statsKey = `${droneType}Deployed` as keyof typeof context.droneFleet.stats;
  
  fsmLogger.info(`[assignDroneDeployedContext] Drone ${droneType} déployé`);
  
  return {
    droneFleet: {
      ...context.droneFleet,
      stats: {
        ...context.droneFleet.stats,
        [statsKey]: (context.droneFleet.stats[statsKey] || 0) + 1
      }
    }
  };
});
