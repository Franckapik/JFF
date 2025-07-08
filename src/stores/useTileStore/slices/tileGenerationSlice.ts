/**
 * =========================================================================
 * TILE GENERATION SLICE - Gestion de la génération des tuiles (TypeScript)
 * =========================================================================
 * 
 * Ce slice gère la génération et la configuration des tuiles :
 * - Génération des positions hexagonales
 * - Placement des stations de jeu
 * - Configuration des tuiles de danger
 * - Synchronisation avec les bots FSM
 * - Gestion des tuiles de départ
 * 
 * Fonctionnalités principales :
 * - initializeGameGrid : génération complète de la grille hexagonale
 * - placeGameStations, placeDangerTiles, placeStartingTiles : placement des éléments de jeu
 * - assignStartingTiles : assignation des tuiles de départ aux bots actifs
 * 
 * Note : Les fonctions de pathfinding ont été déplacées vers tilePathSlice
 * pour une meilleure organisation du code.
 */

import type {
  GridCoordinate,
  Tile,
  TileBiome,
  TileMap,
  TileType
} from '../../../types/index.js';
import type { ResourceStats } from '../../../types/resources.js';

import { RESOURCE_CONSTANTS, TILE_BIOMES, TILE_TYPES } from '../../../ai/fsm/machineX/config/constants.js';
import fsmLogger from "../../../logger/fsmLogger.js";

// =========================================================================
// CONSTANTES HEXAGONALES
// =========================================================================

/**
 * Directions hexagonales pour calculer les voisins
 * Représente les 6 directions possibles dans une grille hexagonale
 */
const hexDirections = [
  { q: 1, r: 0 },   // Est
  { q: -1, r: 0 },  // Ouest
  { q: 0, r: 1 },   // Sud-Est
  { q: 0, r: -1 },  // Nord-Ouest
  { q: 1, r: -1 },  // Nord-Est
  { q: -1, r: 1 },  // Sud-Ouest
];

/**
 * Constantes de génération des tuiles
 */
const tileConstants = {
  // Taille et espacement
  hexSize: 1.2,                    // Taille de base d'une tuile hexagonale
  sqrt3: Math.sqrt(3),             // Racine de 3 pour les calculs hexagonaux
  
  // Propriétés par défaut des tuiles
  defaultY: 0,                     // Position Y par défaut (plan de jeu)
  maxNeighbors: 6,                 // Nombre maximum de voisins pour une tuile
  
  // Génération de ressources (utilise RESOURCE_CONSTANTS)
  foodMax: 100,                    // Quantité maximale de nourriture
  debrisMax: 1000,                 // Quantité maximale de débris
  specialMax: 2,                   // Quantité maximale de ressources spéciales
  
  // Ressources des bases de départ (utilise les types de RESOURCE_CONSTANTS)
  startResources: {
    [RESOURCE_CONSTANTS.FOOD]: 100,
    [RESOURCE_CONSTANTS.DEBRIS]: 100,
    [RESOURCE_CONSTANTS.SPECIAL]: 50
  },
  
  // Configuration des stations par rayon
  stationsConfig: {
    fuel: {
      0: 0,    // Pas de stations pour rayon 0
      1: 1,    // 1 station pour rayon 1
      default: 2  // 2 stations pour rayon >= 2
    },
    repair: {
      0: 0,    // Pas de stations pour rayon 0
      1: 1,    // 1 station pour rayon 1
      default: 2  // 2 stations pour rayon >= 2
    }
  }
};

// =========================================================================
// TYPES LOCAUX
// =========================================================================

/** Coordonnée hexagonale */
interface HexCoordinate {
  q: number;
  r: number;
}

/** Actions du slice de génération */
interface TileGenerationSliceActions {
  initializeGameGrid: (radius: number, spacing: number) => TileMap;
  placeGameStations: (tiles: Tile[], radius: number) => void;
  placeDangerTiles: (tiles: Tile[], radius: number) => void;
  placeStartingTiles: (tiles: Tile[], botCount: number) => void;
  assignStartingTiles: (activeBotIds: string[]) => void;
}

// =========================================================================
// UTILITAIRES HEXAGONAUX
// =========================================================================

/**
 * Encode une coordonnée hexagonale en string
 * @param q - Coordonnée q
 * @param r - Coordonnée r
 * @param radius - Rayon de la grille
 * @returns Coordonnée encodée
 */
const encodeHexCoord = (q: number, r: number, radius: number): GridCoordinate => {
  return `${q + radius},${r + radius}` as GridCoordinate;
};

/**
 * Génère une couleur aléatoire
 * @returns Couleur hexadécimale
 */
const generateRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

// =========================================================================
// SLICE FACTORY - TILE GENERATION UTILITIES
// =========================================================================

const createTileGenerationSlice = (set: any, get: any): TileGenerationSliceActions => ({

  /**
   * Initialise une grille hexagonale complète de tuiles
   * @param radius - Rayon de la grille hexagonale
   * @param spacing - Espacement entre les tuiles
   * @returns TileMap indexé par coordonnées
   */
  initializeGameGrid: (radius: number, spacing: number): TileMap => {
    const tiles: Tile[] = [];
    const effectiveSize = tileConstants.hexSize + spacing;
    
    for (let q = -radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        // Calcul de la position 3D hexagonale
        const x = effectiveSize * (tileConstants.sqrt3 * q + tileConstants.sqrt3 / 2 * r);
        const z = effectiveSize * (3 / 2 * r);
        
        // Calcul des voisins
        const neighbors = hexDirections
          .map((dir) => ({ q: q + dir.q, r: r + dir.r }))
          .filter((neighbor) =>
            Math.abs(neighbor.q) <= radius &&
            Math.abs(neighbor.r) <= radius &&
            Math.abs(-neighbor.q - neighbor.r) <= radius
          )
          .map((neighbor) => encodeHexCoord(neighbor.q, neighbor.r, radius));

        // Génération des ressources
        const resources: ResourceStats = {
          food: Math.floor(Math.random() * (tileConstants.foodMax + 1)),
          debris: Math.floor(Math.random() * (tileConstants.debrisMax + 1)),
          special: Math.floor(Math.random() * (tileConstants.specialMax + 1)),
          total: 0
        };
        resources.total = resources.food + resources.debris + resources.special;

        // Création de la tuile typée
        const tile: Tile = {
          coord: encodeHexCoord(q, r, radius),
          tileCoord: { x: q + radius, z: r + radius },
          position: { x, y: tileConstants.defaultY, z },
          type: TILE_TYPES.FOOD as TileType,
          biome: TILE_BIOMES.GRASSLAND as TileBiome,
          walkable: true,
          explored: false,
          collected: false,
          neighbors,
          resources,
          hasResources: resources.total > 0,
          color: generateRandomColor()
        };
        
        tiles.push(tile);
      }
    }
    
    // 2. Placer les stations
    get().placeGameStations(tiles, radius);
    
    // 3. Placer les tuiles de danger
    get().placeDangerTiles(tiles, radius);
    
    // 4. Placer les tuiles de départ (par défaut pour 1 bot)
    get().placeStartingTiles(tiles, 1);
    
    // 5. Convertir en TileMap
    const tileMap: TileMap = tiles.reduce((acc, tile) => {
      return { ...acc, [tile.coord]: tile };
    }, {});
    
    return tileMap;
  },

  /**
   * Place les stations de jeu (carburant et réparation)
   * @param tiles - Tuiles de la grille
   * @param radius - Rayon de la grille
   */
  placeGameStations: (tiles: Tile[], radius: number): void => {
    const fuelCount = tileConstants.stationsConfig.fuel[radius] || tileConstants.stationsConfig.fuel.default;
    const repairCount = tileConstants.stationsConfig.repair[radius] || tileConstants.stationsConfig.repair.default;
    
    // Placer les stations de carburant
    for (let i = 0; i < fuelCount; i++) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const tile = tiles[randomIndex];
      if (tile.type === (TILE_TYPES.FOOD as TileType)) {
        tile.type = TILE_TYPES.FUEL as TileType;
        tile.color = "orange";
        tile.hasResources = false;
        tile.resources = { food: 0, debris: 0, special: 0, total: 0 };
      }
    }
    
    // Placer les stations de réparation
    for (let i = 0; i < repairCount; i++) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const tile = tiles[randomIndex];
      if (tile.type === (TILE_TYPES.FOOD as TileType)) {
        tile.type = TILE_TYPES.REPAIR as TileType;
        tile.color = "green";
        tile.hasResources = false;
        tile.resources = { food: 0, debris: 0, special: 0, total: 0 };
      }
    }
  },

  /**
   * Place les tuiles de danger
   * @param tiles - Tuiles de la grille
   * @param radius - Rayon de la grille
   */
  placeDangerTiles: (tiles: Tile[], radius: number): void => {
    const dangerCount = Math.max(1, Math.floor(tiles.length * 0.1));
    
    for (let i = 0; i < dangerCount; i++) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const tile = tiles[randomIndex];
      if (tile.type === (TILE_TYPES.FOOD as TileType)) {
        tile.type = TILE_TYPES.DANGER as TileType;
        tile.color = "red";
        tile.walkable = false;
        tile.hasResources = false;
        tile.resources = { food: 0, debris: 0, special: 0, total: 0 };
      }
    }
  },

  /**
   * Place les tuiles de départ dans la grille
   * @param tiles - Tuiles de la grille
   * @param botCount - Nombre de bots pour lesquels créer des tuiles de départ
   */
  placeStartingTiles: (tiles: Tile[], botCount: number): void => {
    for (let i = 0; i < Math.min(botCount, tiles.length); i++) {
      const tile = tiles[i];
      if (tile.type === (TILE_TYPES.FOOD as TileType)) {
        tile.type = TILE_TYPES.DEPART as TileType;
        const startRes = tileConstants.startResources;
        tile.resources = { 
          food: startRes[RESOURCE_CONSTANTS.FOOD],
          debris: startRes[RESOURCE_CONSTANTS.DEBRIS],
          special: startRes[RESOURCE_CONSTANTS.SPECIAL],
          total: startRes[RESOURCE_CONSTANTS.FOOD] + 
                 startRes[RESOURCE_CONSTANTS.DEBRIS] + 
                 startRes[RESOURCE_CONSTANTS.SPECIAL]
        };
        tile.hasResources = true;
        tile.color = "#4CAF50"; // Vert pour les tuiles de départ
      }
    }
  },

  /**
   * Assigne les tuiles de départ aux bots actifs
   * @param activeBotIds - IDs des bots actifs
   */
  /**
   * Assigne les tuiles de départ aux bots actifs
   * @param activeBotIds - IDs des bots actifs
   */
  assignStartingTiles: (activeBotIds: string[]): void => {
    const tiles = get().tiles;
    
    // Récupérer les tuiles de départ via getTilesByType
    const startingTiles = get().getTilesByType(TILE_TYPES.DEPART as TileType);
    
    // Réinitialiser les assignations existantes
    startingTiles.forEach((tile: any) => {
      tile.assignedToBot = undefined;
    });
    
    // Assigner les tuiles aux bots actifs
    activeBotIds.forEach((botId, index) => {
      if (index < startingTiles.length) {
        const tile = startingTiles[index] as any;
        tile.assignedToBot = botId;
        tile.originalResources = { ...tile.resources };
        tile.resourcePercentage = 100;
        
        fsmLogger.game(`[TileGeneration] Tuile de départ assignée à ${botId}:`, tile.coord);
      }
    });
    
    // Mettre à jour l'état
    set({ tiles });
  },

});

export default createTileGenerationSlice;
