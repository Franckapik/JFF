/**
 * ============================================================================
 * HEX GRID GENERATION - Pure Functions
 * ============================================================================
 * 
 * Fonctions pures pour la génération de grilles hexagonales.
 * Extraites depuis tileGenerationSlice pour être testables sans Zustand.
 * 
 * @module core/spatial/hexGrid
 * @pure All functions are pure (no side effects)
 * @author Spatial Migration Team
 * @version 1.0.0
 */


import type { GridCoordinate, WorldGridPosition } from '../../types/coordinates.ts';
import type { ResourceStats } from '../../types/resources.ts';
import type { HexGridConfig, StationPlacementConfig } from '../../types/spatial.ts';
import type { Tile, TileBiome, TileMap, TileType } from '../../types/tile.ts';

import { encodeHexCoord } from './coordinates.ts';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Directions hexagonales pour calculer les voisins
 * Représente les 6 directions possibles dans une grille hexagonale
 */
const HEX_DIRECTIONS = [
  { q: 1, r: 0 },   // Est
  { q: -1, r: 0 },  // Ouest
  { q: 0, r: 1 },   // Sud-Est
  { q: 0, r: -1 },  // Nord-Ouest
  { q: 1, r: -1 },  // Nord-Est
  { q: -1, r: 1 },  // Sud-Ouest
] as const;

const TILE_CONSTANTS = {
  hexSize: 1.2,
  sqrt3: Math.sqrt(3),
  defaultY: 0,
  foodMax: 100,
  debrisMax: 1000,
  specialMax: 2,
  startResources: {
    food: 100,
    debris: 100,
    special: 50,
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Génère une couleur aléatoire
 * 
 * @pure
 * @param seed - Seed optionnel pour génération déterministe
 * @returns Couleur hexadécimale
 */
export function generateRandomColor(seed?: number): string {
  const random = seed !== undefined ? (seed * 9301 + 49297) % 233280 / 233280 : Math.random();
  return `#${Math.floor(random * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Calcule les voisins hexagonaux d'une position q,r
 * 
 * @pure
 * @param q - Coordonnée q hexagonale
 * @param r - Coordonnée r hexagonale
 * @param radius - Rayon maximum de la grille
 * @returns Liste des coordonnées des voisins valides
 */
export function calculateHexNeighbors(
  q: number,
  r: number,
  radius: number
): GridCoordinate[] {
  return HEX_DIRECTIONS
    .map((dir) => ({ q: q + dir.q, r: r + dir.r }))
    .filter((neighbor) =>
      Math.abs(neighbor.q) <= radius &&
      Math.abs(neighbor.r) <= radius &&
      Math.abs(-neighbor.q - neighbor.r) <= radius
    )
    .map((neighbor) => encodeHexCoord(neighbor.q, neighbor.r, { radius }));
}

/**
 * Calcule la position 3D d'une tuile hexagonale
 * 
 * @pure
 * @param q - Coordonnée q hexagonale
 * @param r - Coordonnée r hexagonale
 * @param config - Configuration (spacing)
 * @returns Position mondiale 3D
 */
export function calculateHexPosition(
  q: number,
  r: number,
  config: HexGridConfig
): WorldGridPosition {
  const { spacing = -0.2, radius } = config;
  const effectiveSize = TILE_CONSTANTS.hexSize + spacing;
  
  const x = effectiveSize * (TILE_CONSTANTS.sqrt3 * q + TILE_CONSTANTS.sqrt3 / 2 * r);
  const z = effectiveSize * (3 / 2 * r);
  
  return {
    x,
    y: TILE_CONSTANTS.defaultY,
    z,
    coord: encodeHexCoord(q, r, { radius }),
  };
}

/**
 * Génère des ressources aléatoires pour une tuile
 * 
 * @pure
 * @param seed - Seed optionnel pour génération déterministe
 * @returns ResourceStats avec ressources générées
 */
export function generateTileResources(seed?: number): ResourceStats {
  const getRandom = (max: number, index: number) => {
    if (seed !== undefined) {
      const seededRandom = ((seed + index) * 9301 + 49297) % 233280 / 233280;
      return Math.floor(seededRandom * (max + 1));
    }
    return Math.floor(Math.random() * (max + 1));
  };

  const resources: ResourceStats = {
    food: getRandom(TILE_CONSTANTS.foodMax, 0),
    debris: getRandom(TILE_CONSTANTS.debrisMax, 1),
    special: getRandom(TILE_CONSTANTS.specialMax, 2),
    total: 0,
  };
  
  resources.total = resources.food + resources.debris + resources.special;
  return resources;
}

// ============================================================================
// GRID GENERATION
// ============================================================================

/**
 * Initialise une grille hexagonale complète de tuiles
 * Génère toutes les tuiles avec positions, voisins et ressources
 * 
 * @pure
 * @param config - Configuration de la grille (radius, spacing, seed)
 * @returns TileMap indexé par coordonnées
 * 
 * @example
 * const tiles = initializeGameGrid({ radius: 5, spacing: -0.2 });
 * // tiles = { "5,5": Tile, "6,5": Tile, ... }
 */
export function initializeGameGrid(config: HexGridConfig): TileMap {
  const { radius, spacing = -0.2, seed } = config;
  const tiles: Tile[] = [];
  
  for (let q = -radius; q <= radius; q++) {
    for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
      const position = calculateHexPosition(q, r, { radius, spacing });
      const neighbors = calculateHexNeighbors(q, r, radius);
      const resources = generateTileResources(seed ? seed + q * 100 + r : undefined);
      
      const tile: Tile = {
        position,
        type: 'food' as TileType,
        biome: 'grassland' as TileBiome,
        walkable: true,
        explored: false,
        collected: false,
        neighbors,
        resources,
        hasResources: resources.total > 0,
        color: generateRandomColor(seed ? seed + q * 1000 + r : undefined),
      };
      
      tiles.push(tile);
    }
  }
  
  // Convertir en TileMap
  return tiles.reduce((acc, tile) => {
    return { ...acc, [tile.position.coord]: tile };
  }, {} as TileMap);
}

// ============================================================================
// STATION PLACEMENT
// ============================================================================

/**
 * Détermine le nombre de stations selon le rayon
 * 
 * @pure
 * @param radius - Rayon de la grille
 * @param stationType - Type de station ('fuel' | 'repair')
 * @returns Nombre de stations à placer
 */
export function getStationCount(radius: number, _stationType: 'fuel' | 'repair'): number {
  if (radius === 0) return 0;
  if (radius === 1) return 1;
  return 2;
}

/**
 * Place les stations de jeu (carburant et réparation) dans le TileMap
 * 
 * @pure
 * @param tileMap - TileMap initial
 * @param config - Configuration du placement (radius, count, seed)
 * @returns Nouveau TileMap avec les stations placées
 * 
 * @example
 * const withStations = placeGameStations(tiles, { radius: 5 });
 */
export function placeGameStations(
  tileMap: TileMap,
  config: StationPlacementConfig & { radius: number; seed?: number }
): TileMap {
  const { radius, seed } = config;
  const foodTiles = Object.values(tileMap).filter(t => t.type === 'food');
  const fuelCount = getStationCount(radius, 'fuel');
  const repairCount = getStationCount(radius, 'repair');
  
  const newTileMap = { ...tileMap };
  
  // Helper pour sélection déterministe
  const getRandomIndex = (tiles: Tile[], offset: number) => {
    if (seed !== undefined) {
      return Math.floor(((seed + offset) * 9301 + 49297) % 233280 / 233280 * tiles.length);
    }
    return Math.floor(Math.random() * tiles.length);
  };
  
  // Filtrer les tuiles disponibles pour éviter les doublons
  let availableFoodTiles = [...foodTiles];
  
  // Placer les stations de carburant
  for (let i = 0; i < fuelCount && availableFoodTiles.length > 0; i++) {
    const randomIndex = getRandomIndex(availableFoodTiles, i);
    const tile = availableFoodTiles[randomIndex];
    newTileMap[tile.position.coord] = {
      ...tile,
      type: 'fuel' as TileType,
      color: 'orange',
      hasResources: false,
      resources: { food: 0, debris: 0, special: 0, total: 0 },
    };
    // Retirer la tuile des disponibles
    availableFoodTiles = availableFoodTiles.filter((_, idx) => idx !== randomIndex);
  }
  
  // Placer les stations de réparation
  for (let i = 0; i < repairCount && availableFoodTiles.length > 0; i++) {
    const randomIndex = getRandomIndex(availableFoodTiles, i + 100);
    const tile = availableFoodTiles[randomIndex];
    newTileMap[tile.position.coord] = {
      ...tile,
      type: 'repair' as TileType,
      color: 'green',
      hasResources: false,
      resources: { food: 0, debris: 0, special: 0, total: 0 },
    };
    // Retirer la tuile des disponibles
    availableFoodTiles = availableFoodTiles.filter((_, idx) => idx !== randomIndex);
  }
  
  return newTileMap;
}

// ============================================================================
// DANGER TILE PLACEMENT
// ============================================================================

/**
 * Place les tuiles de danger dans le TileMap (10% des tuiles)
 * 
 * @pure
 * @param tileMap - TileMap initial
 * @param seed - Seed optionnel pour génération déterministe
 * @returns Nouveau TileMap avec les tuiles de danger placées
 * 
 * @example
 * const withDanger = placeDangerTiles(tiles);
 */
export function placeDangerTiles(tileMap: TileMap, seed?: number): TileMap {
  const foodTiles = Object.values(tileMap).filter(t => t.type === 'food');
  const dangerCount = Math.max(1, Math.floor(foodTiles.length * 0.1));
  
  const newTileMap = { ...tileMap };
  
  const getRandomIndex = (tiles: Tile[], offset: number) => {
    if (seed !== undefined) {
      return Math.floor(((seed + offset) * 9301 + 49297) % 233280 / 233280 * tiles.length);
    }
    return Math.floor(Math.random() * tiles.length);
  };
  
  let availableFoodTiles = [...foodTiles];
  
  for (let i = 0; i < dangerCount && availableFoodTiles.length > 0; i++) {
    const randomIndex = getRandomIndex(availableFoodTiles, i + 200);
    const tile = availableFoodTiles[randomIndex];
    newTileMap[tile.position.coord] = {
      ...tile,
      type: 'danger' as TileType,
      color: 'red',
      walkable: false,
      hasResources: false,
      resources: { food: 0, debris: 0, special: 0, total: 0 },
    };
    // Retirer la tuile des disponibles
    availableFoodTiles = availableFoodTiles.filter((_, idx) => idx !== randomIndex);
  }
  
  return newTileMap;
}

// ============================================================================
// OBSTACLE TILE PLACEMENT
// ============================================================================

/**
 * Place les tuiles d'obstacles dans le TileMap (20% des tuiles)
 * 
 * @pure
 * @param tileMap - TileMap initial
 * @param seed - Seed optionnel pour génération déterministe
 * @returns Nouveau TileMap avec les tuiles d'obstacles placées
 * 
 * @example
 * const withObstacles = placeObstacleTiles(tiles);
 */
export function placeObstacleTiles(tileMap: TileMap, seed?: number): TileMap {
  const foodTiles = Object.values(tileMap).filter(t => t.type === 'food');
  const obstacleCount = Math.max(1, Math.floor(foodTiles.length * 0.2));
  
  const newTileMap = { ...tileMap };
  
  const getRandomIndex = (tiles: Tile[], offset: number) => {
    if (seed !== undefined) {
      return Math.floor(((seed + offset) * 9301 + 49297) % 233280 / 233280 * tiles.length);
    }
    return Math.floor(Math.random() * tiles.length);
  };
  
  let availableFoodTiles = [...foodTiles];
  
  for (let i = 0; i < obstacleCount && availableFoodTiles.length > 0; i++) {
    const randomIndex = getRandomIndex(availableFoodTiles, i + 100);
    const tile = availableFoodTiles[randomIndex];
    newTileMap[tile.position.coord] = {
      ...tile,
      type: 'obstacle' as TileType,
      color: '#000000',
      walkable: false,
      hasResources: false,
      resources: { food: 0, debris: 0, special: 0, total: 0 },
    };
    // Retirer la tuile des disponibles
    availableFoodTiles = availableFoodTiles.filter((_, idx) => idx !== randomIndex);
  }
  
  return newTileMap;
}

// ============================================================================
// EMPTY TILE PLACEMENT
// ============================================================================

/**
 * Place les tuiles vides dans le TileMap (les tuiles non modifiées restent 'food')
 * Convertit une proportion de tuiles 'food' en 'empty'
 * 
 * @pure
 * @param tileMap - TileMap initial
 * @param emptyRatio - Proportion de tuiles à convertir en empty (0.0 à 1.0)
 * @param seed - Seed optionnel pour génération déterministe
 * @returns Nouveau TileMap avec les tuiles vides placées
 * 
 * @example
 * const withEmpty = placeEmptyTiles(tiles, 0.15);
 */
export function placeEmptyTiles(
  tileMap: TileMap,
  emptyRatio: number = 0.15,
  seed?: number
): TileMap {
  const foodTiles = Object.values(tileMap).filter(t => t.type === 'food');
  const emptyCount = Math.max(0, Math.floor(foodTiles.length * emptyRatio));
  
  const newTileMap = { ...tileMap };
  
  const getRandomIndex = (tiles: Tile[], offset: number) => {
    if (seed !== undefined) {
      return Math.floor(((seed + offset) * 9301 + 49297) % 233280 / 233280 * tiles.length);
    }
    return Math.floor(Math.random() * tiles.length);
  };
  
  let availableFoodTiles = [...foodTiles];
  
  for (let i = 0; i < emptyCount && availableFoodTiles.length > 0; i++) {
    const randomIndex = getRandomIndex(availableFoodTiles, i + 300);
    const tile = availableFoodTiles[randomIndex];
    newTileMap[tile.position.coord] = {
      ...tile,
      type: 'empty' as TileType,
      color: '#9ca3af',
      walkable: true,
      hasResources: false,
      resources: { food: 0, debris: 0, special: 0, total: 0 },
    };
    // Retirer la tuile des disponibles
    availableFoodTiles = availableFoodTiles.filter((_, idx) => idx !== randomIndex);
  }
  
  
  return newTileMap;
}

// ============================================================================
// STARTING TILE PLACEMENT
// ============================================================================

/**
 * Place les tuiles de départ dans le TileMap
 * 
 * @pure
 * @param tileMap - TileMap initial
 * @param botCount - Nombre de bots (tuiles de départ à créer)
 * @param seed - Seed optionnel pour génération déterministe
 * @returns Nouveau TileMap avec les tuiles de départ placées
 * 
 * @example
 * const withStarts = placeStartingTiles(tiles, 4);
 */
export function placeStartingTiles(
  tileMap: TileMap,
  botCount: number,
  seed?: number
): TileMap {
  const tiles = Object.values(tileMap).filter(
    (tile): tile is Tile => tile.type === 'food'
  );
  
  // Mélanger les tuiles candidates
  const shuffledTiles = seed !== undefined
    ? tiles
        .map((value, index) => ({ 
          value, 
          sort: ((seed + index) * 9301 + 49297) % 233280 / 233280 
        }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    : tiles
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
  
  const newTileMap = { ...tileMap };
  const startRes = TILE_CONSTANTS.startResources;
  
  for (let i = 0; i < Math.min(botCount, shuffledTiles.length); i++) {
    const tile = shuffledTiles[i];
    newTileMap[tile.position.coord] = {
      ...tile,
      type: 'depart' as TileType,
      resources: {
        food: startRes.food,
        debris: startRes.debris,
        special: startRes.special,
        total: startRes.food + startRes.debris + startRes.special,
      },
      hasResources: true,
      color: '#4CAF50',
    };
  }
  
  return newTileMap;
}

/**
 * Assigne les tuiles de départ aux bots spécifiques
 * 
 * @pure
 * @param tileMap - TileMap avec tuiles de départ déjà placées
 * @param botIds - IDs des bots à assigner
 * @returns Nouveau TileMap avec assignations
 * 
 * @example
 * const assigned = assignStartingTilesToBots(tiles, ['bot-0', 'bot-1']);
 */
export function assignStartingTilesToBots(
  tileMap: TileMap,
  botIds: string[]
): TileMap {
  const startingTiles = Object.values(tileMap).filter(
    (tile): tile is Tile => tile.type === 'depart'
  );
  
  const newTileMap = { ...tileMap };
  
  botIds.forEach((botId, index) => {
    if (index < startingTiles.length) {
      const tile = startingTiles[index];
      newTileMap[tile.position.coord] = {
        ...tile,
        assignedToBot: botId,
      };
    }
  });
  
  return newTileMap;
}
