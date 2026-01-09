/**
 * ==========================================================================
 * TILES DOMAIN - Helpers purs pour manipulation des tiles dans le contexte FSM
 * ==========================================================================
 * 
 * Ces fonctions sont des helpers purs qui ne mutent pas l'état directement.
 * Elles sont utilisées par les actions assign pour calculer les nouveaux états.
 * 
 * ✅ Compatible SharedWorker (pas de dépendance React/Zustand)
 * ✅ Testable (fonctions pures)
 * ✅ Performant (immutabilité contrôlée)
 */

import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { GridCoordinate, Tile, TileMap } from '../../../../../types/index.ts';
import type { ResourceStats } from '../../../../../types/resources.ts';

// =========================================================================
// LECTURE DE TILES
// =========================================================================

/**
 * Récupère une tile depuis le contexte FSM
 * Priorité: gridInfo.tiles > memory.knownTiles
 */
export function getTileFromContext(
  context: FSMContext,
  coord: GridCoordinate
): Tile | undefined {
  // Priorité 1: gridInfo.tiles (source de vérité principale)
  if (context.gridInfo?.tiles?.[coord]) {
    return context.gridInfo.tiles[coord];
  }
  
  // Priorité 2: memory.knownTiles (cache du bot)
  const knownTile = context.memory?.knownTiles?.find(
    t => t.position?.coord === coord
  );
  
  return knownTile || undefined;
}

/**
 * Trouve une tile avec des ressources disponibles
 * Retourne la tile avec le plus de ressources parmi les candidates
 */
export function findTileWithResources(
  context: FSMContext,
  excludeCoord?: GridCoordinate
): Tile | null {
  const knownTiles = context.memory?.knownTiles || [];
  
  const candidates = knownTiles.filter(tile =>
    tile?.collectable &&
    tile?.resources &&
    tile.resources.total > 0 &&
    !tile.collected &&
    tile.hasResources &&
    tile.position?.coord !== excludeCoord
  );
  
  if (candidates.length === 0) return null;
  
  // Retourner la tile avec le plus de ressources
  return candidates.reduce((best, current) =>
    (current.resources?.total || 0) > (best.resources?.total || 0) ? current : best
  );
}

// =========================================================================
// MISE À JOUR DE TILES (retourne nouveau état, pas de mutation)
// =========================================================================

/**
 * Met à jour une tile dans le contexte FSM
 * Retourne les nouveaux objets gridInfo et memory à merger
 */
export function updateTileInContext(
  context: FSMContext,
  coord: GridCoordinate,
  updates: Partial<Tile>
): {
  gridInfo: FSMContext['gridInfo'];
  memory: FSMContext['memory'];
} {
  // Mettre à jour gridInfo.tiles
  const updatedGridTiles: TileMap = context.gridInfo?.tiles
    ? {
        ...context.gridInfo.tiles,
        [coord]: {
          ...context.gridInfo.tiles[coord],
          ...updates,
          lastUpdate: Date.now(),
        },
      }
    : {};

  // Mettre à jour memory.knownTiles
  const updatedKnownTiles = (context.memory?.knownTiles || []).map(tile => {
    if (tile.position?.coord === coord) {
      return { ...tile, ...updates, lastUpdate: Date.now() };
    }
    return tile;
  });

  return {
    gridInfo: {
      ...context.gridInfo,
      tiles: updatedGridTiles,
      syncedAt: Date.now(),
    },
    memory: {
      ...context.memory,
      knownTiles: updatedKnownTiles,
    },
  };
}

// =========================================================================
// MARQUAGE D'EXPLORATION
// =========================================================================

/**
 * Marque une tile comme explorée
 * Retourne les updates pour gridInfo et memory
 */
export function markTileExplored(
  context: FSMContext,
  coord: GridCoordinate,
  explorerId: string
): {
  gridInfo: FSMContext['gridInfo'];
  memory: FSMContext['memory'];
} {
  return updateTileInContext(context, coord, {
    explored: true,
    exploredAt: Date.now(),
    exploredBy: explorerId,
  });
}

// =========================================================================
// MARQUAGE DE COLLECTE
// =========================================================================

/**
 * Marque une tile comme collectée (vide de ressources)
 * Retourne les updates pour gridInfo et memory
 */
export function markTileCollected(
  context: FSMContext,
  coord: GridCoordinate,
  collectorId: string
): {
  gridInfo: FSMContext['gridInfo'];
  memory: FSMContext['memory'];
} {
  const emptyResources: ResourceStats = { food: 0, debris: 0, special: 0, total: 0 };
  
  return updateTileInContext(context, coord, {
    collected: true,
    collectedAt: Date.now(),
    collectedBy: collectorId,
    resources: emptyResources,
    hasResources: false,
  });
}

// =========================================================================
// DÉDUCTION DE RESSOURCES
// =========================================================================

/**
 * Déduit des ressources d'une tile
 * Retourne les nouvelles ressources de la tile et le flag collected
 */
export function deductResourcesFromTile(
  tile: Tile,
  amount: ResourceStats
): {
  newResources: ResourceStats;
  isCollected: boolean;
} {
  const currentResources = tile.resources || { food: 0, debris: 0, special: 0, total: 0 };
  
  const newResources: ResourceStats = {
    food: Math.max(0, (currentResources.food || 0) - (amount.food || 0)),
    debris: Math.max(0, (currentResources.debris || 0) - (amount.debris || 0)),
    special: Math.max(0, (currentResources.special || 0) - (amount.special || 0)),
    total: 0,
  };
  newResources.total = newResources.food + newResources.debris + newResources.special;
  
  return {
    newResources,
    isCollected: newResources.total <= 0,
  };
}

// =========================================================================
// COLLECTE DE RESSOURCES
// =========================================================================

export interface CollectResourcesResult {
  /** Ressources effectivement collectées */
  collected: ResourceStats;
  /** Ressources restantes sur la tile après collecte */
  remaining: ResourceStats;
  /** La tile est-elle complètement vidée? */
  isCollected: boolean;
  /** Mises à jour pour gridInfo et memory */
  contextUpdates: {
    gridInfo: FSMContext['gridInfo'];
    memory: FSMContext['memory'];
  };
}

/**
 * Collecte des ressources d'une tile en respectant la capacité du véhicule
 * 
 * @param context - Contexte FSM actuel
 * @param coord - Coordonnée de la tile à collecter
 * @param availableCapacity - Capacité restante du véhicule
 * @param collectorId - ID de l'entité collectrice
 * 
 * @returns Résultat de la collecte avec les updates de contexte
 */
export function collectResourcesFromTile(
  context: FSMContext,
  coord: GridCoordinate,
  availableCapacity: number,
  collectorId: string
): CollectResourcesResult | null {
  const tile = getTileFromContext(context, coord);
  
  if (!tile || !tile.resources || tile.resources.total <= 0) {
    return null;
  }
  
  const tileResources = tile.resources;
  const totalAvailable = tileResources.total || 0;
  const actualCollected = Math.min(totalAvailable, availableCapacity);
  
  // Calculer les ressources collectées proportionnellement si nécessaire
  let collected: ResourceStats;
  
  if (actualCollected >= totalAvailable) {
    // Tout prendre
    collected = { ...tileResources };
  } else {
    // Prendre proportionnellement
    const ratio = actualCollected / totalAvailable;
    collected = {
      food: Math.floor((tileResources.food || 0) * ratio),
      debris: Math.floor((tileResources.debris || 0) * ratio),
      special: Math.floor((tileResources.special || 0) * ratio),
      total: 0,
    };
    collected.total = collected.food + collected.debris + collected.special;
  }
  
  // Calculer ce qui reste sur la tile
  const { newResources, isCollected } = deductResourcesFromTile(tile, collected);
  
  // Préparer les updates de contexte
  const tileUpdates: Partial<Tile> = {
    resources: newResources,
    hasResources: !isCollected,
    collected: isCollected,
  };
  
  if (isCollected) {
    tileUpdates.collectedAt = Date.now();
    tileUpdates.collectedBy = collectorId;
  }
  
  const contextUpdates = updateTileInContext(context, coord, tileUpdates);
  
  return {
    collected,
    remaining: newResources,
    isCollected,
    contextUpdates,
  };
}
