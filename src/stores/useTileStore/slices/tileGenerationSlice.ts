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
 * - placeGameStations, placeDangerTiles : placement des éléments de jeu
 * - syncStartingTilesWithFSMBots : synchronisation avec les bots FSM
 * 
 * Note : Les fonctions de pathfinding ont été déplacées vers tilePathSlice
 * pour une meilleure organisation du code.
 */

import type {
  GridCoordinate,
  Tile,
  TileMap
} from '../../../types/index.js';
import type { ResourceStats } from '../../../types/resources.js';

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
  
  // Génération de ressources (basé sur RESOURCE_CONSTANTS)
  foodMax: 100,                    // Quantité maximale de nourriture
  debrisMax: 1000,                 // Quantité maximale de débris
  specialMax: 2,                   // Quantité maximale de ressources spéciales
  
  // Ressources des bases de départ
  startResources: {
    food: 100,
    debris: 100,
    special: 50
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
  syncStartingTilesWithFSMBots: (activeBotIds: string[]) => void;
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
          type: "food",
          biome: "grassland",
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
    
    // 4. Convertir en TileMap
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
      if (tile.type === "food") {
        tile.type = "fuel";
        tile.color = "orange";
        tile.hasResources = false;
        tile.resources = { food: 0, debris: 0, special: 0, total: 0 };
      }
    }
    
    // Placer les stations de réparation
    for (let i = 0; i < repairCount; i++) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const tile = tiles[randomIndex];
      if (tile.type === "food") {
        tile.type = "repair";
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
      if (tile.type === "food") {
        tile.type = "danger";
        tile.color = "red";
        tile.walkable = false;
        tile.hasResources = false;
        tile.resources = { food: 0, debris: 0, special: 0, total: 0 };
      }
    }
  },

  /**
   * Synchronise les tuiles de départ avec les bots FSM actifs
   * @param activeBotIds - IDs des bots actifs
   */
  syncStartingTilesWithFSMBots: (activeBotIds: string[]): void => {
    const tiles = get().tiles;
    
    // Convertir les tuiles en tableau pour manipulation
    const tileArray = Object.values(tiles);
    
    // Réinitialiser toutes les tuiles de départ existantes
    tileArray.forEach((tile: any) => {
      if (tile.type === "depart") {
        tile.type = "food";
        tile.assignedToBot = undefined;
        tile.resources = tile.originalResources || { food: 50, debris: 50, special: 25, total: 125 };
        tile.hasResources = true;
      }
    });
    
    // Assigner de nouvelles tuiles de départ pour les bots actifs
    activeBotIds.forEach((botId, index) => {
      if (index < tileArray.length) {
        const tile = tileArray[index] as any;
        tile.type = "depart";
        tile.assignedToBot = botId;
        tile.resources = { ...tileConstants.startResources, total: 250 };
        tile.originalResources = { ...tile.resources };
        tile.hasResources = true;
        tile.resourcePercentage = 100;
        
        fsmLogger.info(`[TileGeneration] Tuile de départ assignée à ${botId}:`, tile.coord);
      }
    });
    
    // Mettre à jour l'état
    set({ tiles });
  },

});

export default createTileGenerationSlice;
