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
} from '../../../types/index.ts';
import type { ResourceStats } from '../../../types/resources.ts';
import type { TileGenerationSliceActions, TileStoreType } from '../../../types/stores.d.ts';

import fsmLogger from "../../../logger/fsmLogger.ts";

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
  
  // Ressources des bases de départ (utilise les types ResourceType)
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
      default: 1  // 1 station pour rayon >= 2
    },
    repair: {
      0: 0,    // Pas de stations pour rayon 0
      1: 1,    // 1 station pour rayon 1
      default: 1  // 1 station pour rayon >= 2
    }
  }
};

// =========================================================================
// TYPES LOCAUX
// =========================================================================

/** Actions du slice de génération */

// =========================================================================
// UTILITAIRES HEXAGONAUX
// =========================================================================

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

const createTileGenerationSlice = (_set: unknown, get: () => TileStoreType): TileGenerationSliceActions => ({

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
          .map((neighbor) => get().encodeHexCoord(neighbor.q, neighbor.r, radius));

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
          position: { 
            x, 
            y: tileConstants.defaultY, 
            z, 
            coord: get().encodeHexCoord(q, r, radius) 
          },
          type: 'resource' as TileType,
          biome: 'grassland' as TileBiome,
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
    
    // Convertir en TileMap initial
    const tileMap: TileMap = tiles.reduce((acc, tile) => {
      return { ...acc, [tile.position.coord]: tile };
    }, {});
    
    // 2. Placer les stations
    let updatedTileMap = get().placeGameStations(tileMap, radius);
    
    // 3. Placer les tuiles vides (15% des tuiles)
    updatedTileMap = get().placeEmptyTiles(updatedTileMap, 0.15);
    
    // 4. Placer les obstacles (20% des tuiles)
    updatedTileMap = get().placeObstacleTiles(updatedTileMap);
    
    // 5. Placer les tuiles de danger
    updatedTileMap = get().placeDangerTiles(updatedTileMap);
    
    // 6. Retourner le TileMap final (les tuiles de départ seront créées dans assignStartingTiles)
    return updatedTileMap;
  },

  /**
   * Place les stations de jeu (carburant et réparation)
   * @param tileMap - TileMap à modifier
   * @param radius - Rayon de la grille
   * @returns Nouveau TileMap avec les stations placées
   */
  placeGameStations: (tileMap: TileMap, radius: number): TileMap => {
    const tiles = Object.values(tileMap) as Tile[];
    const fuelCount = tileConstants.stationsConfig.fuel[radius] || tileConstants.stationsConfig.fuel.default;
    const repairCount = tileConstants.stationsConfig.repair[radius] || tileConstants.stationsConfig.repair.default;
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    // Placer les stations de carburant
    for (let i = 0; i < fuelCount; i++) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const tile = tiles[randomIndex];
      if (tile && tile.type === 'resource') {
        const updatedTile: Tile = {
          ...tile,
          type: 'fuel' as TileType,
          color: "orange",
          hasResources: false,
          resources: { food: 0, debris: 0, special: 0, total: 0 }
        };
        newTileMap[tile.position.coord] = updatedTile;
      }
    }
    
    // Placer les stations de réparation
    for (let i = 0; i < repairCount; i++) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const tile = tiles[randomIndex];
      if (tile && tile.type === 'resource') {
        const updatedTile: Tile = {
          ...tile,
          type: 'repair' as TileType,
          color: "green",
          hasResources: false,
          resources: { food: 0, debris: 0, special: 0, total: 0 }
        };
        newTileMap[tile.position.coord] = updatedTile;
      }
    }
    
    return newTileMap;
  },

  /**
   * Place les tuiles de danger
   * @param tileMap - TileMap à modifier
   * @param radius - Rayon de la grille
   * @returns Nouveau TileMap avec les tuiles de danger placées
   */
  placeDangerTiles: (tileMap: TileMap): TileMap => {
    const tiles = Object.values(tileMap) as Tile[];
    const dangerCount = Math.max(1, Math.floor(tiles.length * 0.1));
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    for (let i = 0; i < dangerCount; i++) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      const tile = tiles[randomIndex];
      if (tile && tile.type === 'resource') {
        const updatedTile: Tile = {
          ...tile,
          type: 'danger' as TileType,
          color: "red",
          walkable: false,
          hasResources: false,
          resources: { food: 0, debris: 0, special: 0, total: 0 }
        };
        newTileMap[tile.position.coord] = updatedTile;
      }
    }
    
    return newTileMap;
  },

  /**
   * Place les tuiles vides (une proportion des tuiles)
   * @param tileMap - TileMap à modifier
   * @param emptyRatio - Proportion de tuiles à convertir en empty (défaut 15%)
   * @returns Nouveau TileMap avec les tuiles vides placées
   */
  placeEmptyTiles: (tileMap: TileMap, emptyRatio: number = 0.15): TileMap => {
    const resourceTiles = (Object.values(tileMap) as Tile[]).filter((tile) => tile.type === 'resource');
    const emptyCount = Math.max(0, Math.floor(resourceTiles.length * emptyRatio));
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    // Garder une liste des tuiles disponibles pour éviter les doublons
    let availableResourceTiles = [...resourceTiles];
    
    for (let i = 0; i < emptyCount && availableResourceTiles.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableResourceTiles.length);
      const tile = availableResourceTiles[randomIndex];
      const updatedTile: Tile = {
        ...tile,
        type: 'empty' as TileType,
        color: '#9ca3af',
        walkable: true,
        hasResources: false,
        resources: { food: 0, debris: 0, special: 0, total: 0 }
      };
      newTileMap[tile.position.coord] = updatedTile;
      // Retirer la tuile des disponibles pour éviter les doublons
      availableResourceTiles = availableResourceTiles.filter((_, idx) => idx !== randomIndex);
    }
    
    return newTileMap;
  },

  /**
   * Place les tuiles d'obstacles (20% des tuiles)
   * @param tileMap - TileMap à modifier
   * @returns Nouveau TileMap avec les tuiles d'obstacles placées
   */
  placeObstacleTiles: (tileMap: TileMap): TileMap => {
    const resourceTiles = (Object.values(tileMap) as Tile[]).filter((tile) => tile.type === 'resource');
    const obstacleCount = Math.max(1, Math.floor(resourceTiles.length * 0.2));
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    // Garder une liste des tuiles disponibles pour éviter les doublons
    let availableResourceTiles = [...resourceTiles];
    
    for (let i = 0; i < obstacleCount && availableResourceTiles.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableResourceTiles.length);
      const tile = availableResourceTiles[randomIndex];
      const updatedTile: Tile = {
        ...tile,
        type: 'obstacle' as TileType,
        color: '#000000',
        walkable: false,
        hasResources: false,
        resources: { food: 0, debris: 0, special: 0, total: 0 }
      };
      newTileMap[tile.position.coord] = updatedTile;
      // Retirer la tuile des disponibles pour éviter les doublons
      availableResourceTiles = availableResourceTiles.filter((_, idx) => idx !== randomIndex);
    }
    
    return newTileMap;
  },

  /**
   * Place les tuiles de départ dans la grille
   * @param tileMap - TileMap à modifier
   * @param botCount - Nombre de bots pour lesquels créer des tuiles de départ
   * @returns Nouveau TileMap avec les tuiles de départ placées
   */
  placeStartingTiles: (tileMap: TileMap, botCount: number): TileMap => {
    const tiles = Object.values(tileMap).filter(
      (tile: unknown): tile is Tile => 
        tile !== null && typeof tile === 'object' && 
        'type' in tile && (tile as Tile).type === 'resource'
    );

    // Mélanger les tuiles candidates pour un placement aléatoire
    const shuffledTiles = tiles
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };

    for (let i = 0; i < Math.min(botCount, shuffledTiles.length); i++) {
      const tile = shuffledTiles[i];
      const startRes = tileConstants.startResources;
      const updatedTile = {
        ...tile,
        type: 'depart' as TileType,
        resources: { 
          food: startRes.food,
          debris: startRes.debris,
          special: startRes.special,
          total: startRes.food + 
                 startRes.debris + 
                 startRes.special
        },
        hasResources: true,
        color: "#4CAF50" // Vert pour les tuiles de départ
      };
      newTileMap[tile.position.coord] = updatedTile;
    }

    return newTileMap;
  },

  /**
   * Assigne les tuiles de départ aux bots actifs
   * Crée d'abord les tuiles de départ nécessaires, puis les assigne
   * @param activeBotIds - IDs des bots actifs
   */
  assignStartingTiles: (activeBotIds: string[]): void => {
    const currentTiles = get().tiles;
    
    // 1. D'abord, créer les tuiles de départ nécessaires
    const updatedTileMap = get().placeStartingTiles(currentTiles, activeBotIds.length);
    
    // 2. Récupérer les tuiles de départ depuis le nouveau TileMap
    const startingTiles = Object.values(updatedTileMap).filter(
      (tile: Tile) => tile.type === 'depart'
    ) as Tile[];
    
    // 3. Créer un nouveau TileMap avec les assignations
    const finalTileMap = { ...updatedTileMap };
    
    // 4. Assigner les tuiles aux bots actifs
    activeBotIds.forEach((botId, index) => {
      if (index < startingTiles.length) {
        const tile = startingTiles[index];
        const updatedTile: Tile = {
          ...tile,
          assignedToBot: botId
        };
        finalTileMap[tile.position.coord] = updatedTile;
        
        fsmLogger.game(`[TileGeneration] Tuile de départ assignée à ${botId}:${tile.position.coord + "|" + [tile.position.x, tile.position.z]}`);
      }
    });
    
    // 5. Mettre à jour l'état avec les nouvelles tuiles
    Object.keys(finalTileMap).forEach(coord => {
      get().updateTile(coord as GridCoordinate, finalTileMap[coord as GridCoordinate]);
    });
  },

});

export default createTileGenerationSlice;
