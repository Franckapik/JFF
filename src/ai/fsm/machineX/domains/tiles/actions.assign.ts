/**
 * ==========================================================================
 * TILES DOMAIN - Actions assign pour gestion des tiles dans le contexte FSM
 * ==========================================================================
 * 
 * Ces actions XState v5 permettent de modifier les tiles directement dans
 * le contexte FSM, sans passer par useTileStore.
 * 
 * ✅ Compatible SharedWorker (pas de dépendance React/Zustand)
 * ✅ Traçabilité via XState Inspector
 * ✅ Source unique de vérité (contexte FSM)
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { Tile, TileMap, GridCoordinate } from '../../../../../types/index.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

import {
  markTileExplored,
  markTileCollected,
  updateTileInContext,
} from './helpers.pure.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

// =========================================================================
// GÉNÉRATION DE TILES
// =========================================================================

/**
 * Action pour initialiser les tiles dans le contexte FSM
 * Appelée lors de TILES_UPDATED ou à l'initialisation
 */
export const assignTilesGenerated = createAssignAction(({ context, event }) => {
  if (event.type !== 'TILES_UPDATED') return {};
  
  const { tiles, spacing, radius } = event;
  
  fsmLogger.info(`🗺️ [${context.entityId}] Tiles generated/updated:`, {
    tileCount: Object.keys(tiles).length,
    spacing,
    radius,
  });
  
  // Mettre à jour gridInfo
  const gridInfo = {
    ...context.gridInfo,
    tiles: tiles as TileMap,
    spacing,
    radius,
    syncedAt: Date.now(),
  };
  
  // Populer memory.knownTiles avec les tiles de la grille
  const knownTiles = Object.values(tiles) as Tile[];
  
  return {
    gridInfo,
    memory: {
      ...context.memory,
      knownTiles,
    },
  };
});

// =========================================================================
// EXPLORATION DE TILES
// =========================================================================

/**
 * Action pour marquer une tile comme explorée
 * Utilisée après le scan du drone
 */
export const assignTileExplored = createAssignAction(({ context, event }) => {
  // Déterminer la coordonnée cible
  let targetCoord: GridCoordinate | undefined;
  
  // Essayer de récupérer depuis l'événement ou le contexte du drone
  if ('coord' in event && typeof event.coord === 'string') {
    targetCoord = event.coord as GridCoordinate;
  } else if (context.droneFleet?.drones?.explorer?.targetDroneTile?.position?.coord) {
    targetCoord = context.droneFleet.drones.explorer.targetDroneTile.position.coord;
  }
  
  if (!targetCoord) {
    fsmLogger.warn(`⚠️ [${context.entityId}] assignTileExplored: No target coord found`);
    return {};
  }
  
  fsmLogger.info(`🔍 [${context.entityId}] Marking tile as explored: ${targetCoord}`);
  
  const updates = markTileExplored(context, targetCoord, context.entityId);
  
  // Mettre à jour les stats d'exploration
  const stats = context.memory?.stats || {
    tilesExplored: 0,
    tilesCollected: 0,
    totalResourcesFound: 0,
    lastExploration: null,
    lastCollection: null,
    explorationCycles: 0,
    currentCycleStartTime: null,
    tilesExploredInCycle: 0,
    bestTileInCycle: null,
  };
  
  return {
    gridInfo: updates.gridInfo,
    memory: {
      ...updates.memory,
      stats: {
        ...stats,
        tilesExplored: (stats.tilesExplored || 0) + 1,
        lastExploration: {
          coord: targetCoord,
          timestamp: Date.now(),
          hasResources: false, // Sera mis à jour par le scan
        },
      },
    },
  };
});

// =========================================================================
// COLLECTE DE TILES
// =========================================================================

/**
 * Action pour marquer une tile comme complètement collectée
 * Utilisée quand la tile est vidée de ses ressources
 */
export const assignTileCollected = createAssignAction(({ context, event }) => {
  // Déterminer la coordonnée cible
  let targetCoord: GridCoordinate | undefined;
  
  if ('coord' in event && typeof event.coord === 'string') {
    targetCoord = event.coord as GridCoordinate;
  } else if (context.vehicle?.targetVehicleTile?.position?.coord) {
    targetCoord = context.vehicle.targetVehicleTile.position.coord;
  }
  
  if (!targetCoord) {
    fsmLogger.warn(`⚠️ [${context.entityId}] assignTileCollected: No target coord found`);
    return {};
  }
  
  fsmLogger.info(`📦 [${context.entityId}] Marking tile as collected: ${targetCoord}`);
  
  const updates = markTileCollected(context, targetCoord, context.entityId);
  
  // Mettre à jour les stats de collecte
  const stats = context.memory?.stats || {
    tilesExplored: 0,
    tilesCollected: 0,
    totalResourcesFound: 0,
    lastExploration: null,
    lastCollection: null,
    explorationCycles: 0,
    currentCycleStartTime: null,
    tilesExploredInCycle: 0,
    bestTileInCycle: null,
  };
  
  return {
    gridInfo: updates.gridInfo,
    memory: {
      ...updates.memory,
      stats: {
        ...stats,
        tilesCollected: (stats.tilesCollected || 0) + 1,
        lastCollection: {
          coord: targetCoord,
          timestamp: Date.now(),
          shipId: context.entityId,
        },
      },
    },
  };
});

// =========================================================================
// DÉDUCTION DE RESSOURCES
// =========================================================================

/**
 * Action pour déduire des ressources d'une tile après collecte partielle
 */
export const assignTileResourcesDeducted = createAssignAction(({ context, event }) => {
  // Déterminer la coordonnée et les ressources à déduire
  let targetCoord: GridCoordinate | undefined;
  let resources: { food: number; debris: number; special: number; total: number } | undefined;
  
  if ('coord' in event && typeof event.coord === 'string') {
    targetCoord = event.coord as GridCoordinate;
  }
  if ('resources' in event && typeof event.resources === 'object') {
    resources = event.resources as typeof resources;
  }
  
  if (!targetCoord || !resources) {
    return {};
  }
  
  const currentTile = context.gridInfo?.tiles?.[targetCoord];
  if (!currentTile?.resources) {
    return {};
  }
  
  // Calculer les nouvelles ressources
  const currentResources = currentTile.resources;
  const newResources = {
    food: Math.max(0, (currentResources.food || 0) - (resources.food || 0)),
    debris: Math.max(0, (currentResources.debris || 0) - (resources.debris || 0)),
    special: Math.max(0, (currentResources.special || 0) - (resources.special || 0)),
    total: 0,
  };
  newResources.total = newResources.food + newResources.debris + newResources.special;
  
  const isCollected = newResources.total <= 0;
  
  fsmLogger.info(`💰 [${context.entityId}] Resources deducted from ${targetCoord}:`, {
    before: currentResources,
    after: newResources,
    deducted: resources,
    isCollected,
  });
  
  const tileUpdates: Partial<Tile> = {
    resources: newResources,
    hasResources: !isCollected,
  };
  
  if (isCollected) {
    tileUpdates.collected = true;
    tileUpdates.collectedAt = Date.now();
    tileUpdates.collectedBy = context.entityId;
  }
  
  const updates = updateTileInContext(context, targetCoord, tileUpdates);
  
  return {
    gridInfo: updates.gridInfo,
    memory: updates.memory,
  };
});

// =========================================================================
// MISE À JOUR GÉNÉRIQUE
// =========================================================================

/**
 * Action pour mettre à jour une tile avec des propriétés arbitraires
 */
export const assignTileUpdated = createAssignAction(({ context, event }) => {
  if (!('coord' in event) || !('updates' in event)) {
    return {};
  }
  
  const coord = event.coord as GridCoordinate;
  const updates = event.updates as Partial<Tile>;
  
  const contextUpdates = updateTileInContext(context, coord, updates);
  
  return {
    gridInfo: contextUpdates.gridInfo,
    memory: contextUpdates.memory,
  };
});
