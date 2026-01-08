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
 * Génère une couleur aléatoire (supporté par seed)
 * @param seededRandom - Fonction optionnelle de random seedé
 * @returns Couleur hexadécimale
 */
const generateRandomColor = (seededRandom?: () => number): string => {
  const random = seededRandom ? seededRandom() : Math.random();
  return `#${Math.floor(random * 16777215).toString(16).padStart(6, '0')}`;
};

// =========================================================================
// SLICE FACTORY - TILE GENERATION UTILITIES
// =========================================================================

const createTileGenerationSlice = (_set: unknown, get: () => TileStoreType): TileGenerationSliceActions => ({

  /**
   * Initialise une grille hexagonale complète de tuiles
   * @param radius - Rayon de la grille hexagonale
   * @param spacing - Espacement entre les tuiles
   * @param seed - Seed optionnel pour génération déterministe
   * @returns TileMap indexé par coordonnées
   */
  initializeGameGrid: (radius: number, spacing: number, seed?: number): TileMap => {
    const tiles: Tile[] = [];
    const effectiveSize = tileConstants.hexSize + spacing;
    
    // Créer un générateur seedé si seed fourni
    const createSeededRandom = (s: number): (() => number) => {
      let currentSeed = s;
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    };
    
    const seededRandom = seed !== undefined ? createSeededRandom(seed) : undefined;
    
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

        // Génération des ressources (support seed)
        const getRandom = (max: number) => {
          const rand = seededRandom ? seededRandom() : Math.random();
          return Math.floor(rand * (max + 1));
        };
        
        const resources: ResourceStats = {
          food: getRandom(tileConstants.foodMax),
          debris: getRandom(tileConstants.debrisMax),
          special: getRandom(tileConstants.specialMax),
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
          explorable: true,    // resource tiles peuvent être explorées
          collectable: true,   // resource tiles peuvent être collectées
          explored: false,
          collected: false,
          neighbors,
          resources,
          hasResources: resources.total > 0,
          color: generateRandomColor(seededRandom)
        };
        
        tiles.push(tile);
      }
    }
    
    // Convertir en TileMap initial
    const tileMap: TileMap = tiles.reduce((acc, tile) => {
      return { ...acc, [tile.position.coord]: tile };
    }, {});
    
    // Note: Les étapes suivantes seront appelées par assignStartingTiles
    // dans l'ordre correct pour garantir l'équité :
    // 1. Starting tiles (avec validation fairness)
    // 2. Empty/Obstacles/Danger (en évitant les zones de spawn)
    // 3. Stations (équidistantes des spawns)
    
    return tileMap;
  },

  /**
   * Place les stations de jeu (carburant et réparation)
   * Si spawns fournis, place les stations à distance équitable de chaque spawn
   * @param tileMap - TileMap à modifier
   * @param radius - Rayon de la grille
   * @param seed - Seed optionnel pour génération déterministe
   * @param spawns - Coordonnées des spawns pour placement équidistant
   * @returns Nouveau TileMap avec les stations placées
   */
  placeGameStations: (tileMap: TileMap, radius: number, seed?: number, spawns?: GridCoordinate[]): TileMap => {
    const fuelCount = tileConstants.stationsConfig.fuel[radius] || tileConstants.stationsConfig.fuel.default;
    const repairCount = tileConstants.stationsConfig.repair[radius] || tileConstants.stationsConfig.repair.default;
    
    // Créer un générateur seedé si seed fourni
    const createSeededRandom = (s: number): (() => number) => {
      let currentSeed = s;
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    };
    const seededRandom = seed !== undefined ? createSeededRandom(seed + 1000) : undefined;
    const getRandom = () => seededRandom ? seededRandom() : Math.random();
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    // Filtrer les tuiles disponibles (resource, pas de spawn, pas déjà pris)
    const getAvailableTiles = () => {
      return (Object.values(newTileMap) as Tile[]).filter((tile): tile is Tile => {
        if (!tile || tile.type !== 'resource') return false;
        // Éviter les tuiles trop proches des spawns (min distance = 2)
        if (spawns && spawns.length > 0) {
          for (const spawnCoord of spawns) {
            const distance = get().calculateHexDistance(tile.position.coord, spawnCoord);
            if (distance < 2) return false;
          }
        }
        return true;
      });
    };
    
    // Placer les stations de carburant
    for (let i = 0; i < fuelCount; i++) {
      const availableTiles = getAvailableTiles();
      if (availableTiles.length === 0) break;
      
      const randomIndex = Math.floor(getRandom() * availableTiles.length);
      const tile = availableTiles[randomIndex];
      if (tile) {
        const updatedTile: Tile = {
          ...tile,
          type: 'fuel' as TileType,
          color: "orange",
          explorable: false,
          collectable: false,
          hasResources: false,
          resources: { food: 0, debris: 0, special: 0, total: 0 }
        };
        newTileMap[tile.position.coord] = updatedTile;
      }
    }
    
    // Placer les stations de réparation
    for (let i = 0; i < repairCount; i++) {
      const availableTiles = getAvailableTiles();
      if (availableTiles.length === 0) break;
      
      const randomIndex = Math.floor(getRandom() * availableTiles.length);
      const tile = availableTiles[randomIndex];
      if (tile) {
        const updatedTile: Tile = {
          ...tile,
          type: 'repair' as TileType,
          color: "green",
          explorable: false,
          collectable: false,
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
   * @param seed - Seed optionnel pour génération déterministe
   * @param spawns - Coordonnées des spawns à éviter (rayon 1)
   * @returns Nouveau TileMap avec les tuiles de danger placées
   */
  placeDangerTiles: (tileMap: TileMap, seed?: number, spawns?: GridCoordinate[]): TileMap => {
    // Créer un générateur seedé si seed fourni
    const createSeededRandom = (s: number): (() => number) => {
      let currentSeed = s;
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    };
    const seededRandom = seed !== undefined ? createSeededRandom(seed + 2000) : undefined;
    const getRandom = () => seededRandom ? seededRandom() : Math.random();
    
    // Filtrer les tuiles disponibles (resource, pas trop proche des spawns)
    const availableTiles = (Object.values(tileMap) as Tile[]).filter((tile): tile is Tile => {
      if (!tile || tile.type !== 'resource') return false;
      // Éviter les tuiles trop proches des spawns (rayon 1)
      if (spawns && spawns.length > 0) {
        for (const spawnCoord of spawns) {
          const distance = get().calculateHexDistance(tile.position.coord, spawnCoord);
          if (distance <= 1) return false;
        }
      }
      return true;
    });
    
    // ✅ 10% danger tiles
    const dangerCount = Math.max(1, Math.floor(availableTiles.length * 0.1));
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    // Mélanger les tuiles de manière déterministe
    const shuffledTiles = [...availableTiles]
      .map(tile => ({ tile, sort: getRandom() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ tile }) => tile);
    
    for (let i = 0; i < dangerCount && i < shuffledTiles.length; i++) {
      const tile = shuffledTiles[i];
      const updatedTile: Tile = {
        ...tile,
        type: 'danger' as TileType,
        color: "red",
        walkable: true,      // ✅ Ship can pass (takes damage)
        explorable: true,    // ✅ Drone can explore (gets destroyed)
        collectable: false,  // ❌ No resources to collect
        hasResources: false,
        resources: { food: 0, debris: 0, special: 0, total: 0 }
      };
      newTileMap[tile.position.coord] = updatedTile;
    }
    
    return newTileMap;
  },

  /**
   * Place les tuiles vides (une proportion des tuiles)
   * @param tileMap - TileMap à modifier
   * @param emptyRatio - Proportion de tuiles à convertir en empty (défaut 15%)
   * @param seed - Seed optionnel pour génération déterministe
   * @param spawns - Coordonnées des spawns à éviter (rayon 1)
   * @returns Nouveau TileMap avec les tuiles vides placées
   */
  placeEmptyTiles: (tileMap: TileMap, emptyRatio: number = 0.15, seed?: number, spawns?: GridCoordinate[]): TileMap => {
    // Créer un générateur seedé si seed fourni
    const createSeededRandom = (s: number): (() => number) => {
      let currentSeed = s;
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    };
    const seededRandom = seed !== undefined ? createSeededRandom(seed + 3000) : undefined;
    const getRandom = () => seededRandom ? seededRandom() : Math.random();
    
    // Filtrer les tuiles disponibles (resource, pas trop proche des spawns)
    const availableTiles = (Object.values(tileMap) as Tile[]).filter((tile): tile is Tile => {
      if (!tile || tile.type !== 'resource') return false;
      // Éviter les tuiles trop proches des spawns (rayon 1)
      if (spawns && spawns.length > 0) {
        for (const spawnCoord of spawns) {
          const distance = get().calculateHexDistance(tile.position.coord, spawnCoord);
          if (distance <= 1) return false;
        }
      }
      return true;
    });
    
    const emptyCount = Math.max(0, Math.floor(availableTiles.length * emptyRatio));
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    // Mélanger les tuiles de manière déterministe
    const shuffledTiles = [...availableTiles]
      .map(tile => ({ tile, sort: getRandom() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ tile }) => tile);
    
    for (let i = 0; i < emptyCount && i < shuffledTiles.length; i++) {
      const tile = shuffledTiles[i];
      const updatedTile: Tile = {
        ...tile,
        type: 'empty' as TileType,
        color: '#9ca3af',
        walkable: true,
        explorable: true,
        collectable: false,
        hasResources: false,
        resources: { food: 0, debris: 0, special: 0, total: 0 }
      };
      newTileMap[tile.position.coord] = updatedTile;
    }
    
    return newTileMap;
  },

  /**
   * Place les tuiles d'obstacles (20% des tuiles)
   * @param tileMap - TileMap à modifier
   * @param seed - Seed optionnel pour génération déterministe
   * @param spawns - Coordonnées des spawns à éviter (rayon 1)
   * @returns Nouveau TileMap avec les tuiles d'obstacles placées
   */
  placeObstacleTiles: (tileMap: TileMap, seed?: number, spawns?: GridCoordinate[]): TileMap => {
    // Créer un générateur seedé si seed fourni
    const createSeededRandom = (s: number): (() => number) => {
      let currentSeed = s;
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    };
    const seededRandom = seed !== undefined ? createSeededRandom(seed + 4000) : undefined;
    const getRandom = () => seededRandom ? seededRandom() : Math.random();
    
    // Filtrer les tuiles disponibles (resource, pas trop proche des spawns)
    const availableTiles = (Object.values(tileMap) as Tile[]).filter((tile): tile is Tile => {
      if (!tile || tile.type !== 'resource') return false;
      // Éviter les tuiles trop proches des spawns (rayon 1)
      if (spawns && spawns.length > 0) {
        for (const spawnCoord of spawns) {
          const distance = get().calculateHexDistance(tile.position.coord, spawnCoord);
          if (distance <= 1) return false;
        }
      }
      return true;
    });
    
    const obstacleCount = Math.max(1, Math.floor(availableTiles.length * 0.2));
    
    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    
    // Mélanger les tuiles de manière déterministe
    const shuffledTiles = [...availableTiles]
      .map(tile => ({ tile, sort: getRandom() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ tile }) => tile);
    
    for (let i = 0; i < obstacleCount && i < shuffledTiles.length; i++) {
      const tile = shuffledTiles[i];
      const updatedTile: Tile = {
        ...tile,
        type: 'obstacle' as TileType,
        color: '#000000',
        walkable: false,
        explorable: false,
        collectable: false,
        hasResources: false,
        resources: { food: 0, debris: 0, special: 0, total: 0 }
      };
      newTileMap[tile.position.coord] = updatedTile;
    }
    
    return newTileMap;
  },

  /**
   * Place les tuiles de départ dans la grille (legacy - sans validation fairness)
   * @param tileMap - TileMap à modifier
   * @param botCount - Nombre de bots pour lesquels créer des tuiles de départ
   * @param seed - Seed optionnel pour génération déterministe
   * @returns Nouveau TileMap avec les tuiles de départ placées
   */
  placeStartingTiles: (tileMap: TileMap, botCount: number, seed?: number): TileMap => {
    // Créer un générateur seedé si seed fourni
    const createSeededRandom = (s: number): (() => number) => {
      let currentSeed = s;
      return () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };
    };
    const seededRandom = seed !== undefined ? createSeededRandom(seed + 5000) : undefined;
    const getRandom = () => seededRandom ? seededRandom() : Math.random();
    
    const tiles = Object.values(tileMap).filter(
      (tile: unknown): tile is Tile => 
        tile !== null && typeof tile === 'object' && 
        'type' in tile && (tile as Tile).type === 'resource'
    );

    // Mélanger les tuiles candidates de manière déterministe
    fsmLogger.game(`🎲 [TileGeneration] placeStartingTiles - available resource tiles: ${tiles.length}, seed: ${seed ?? 'random'}`);
    
    const shuffledTiles = tiles
      .map(value => ({ value, sort: getRandom() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    
    fsmLogger.game(`🎲 [TileGeneration] Selected tiles for starting positions: ${shuffledTiles.slice(0, botCount).map(t => t.position.coord).join(', ')}`);

    // Créer une copie du TileMap pour éviter la mutation
    const newTileMap = { ...tileMap };
    const startRes = tileConstants.startResources;

    for (let i = 0; i < Math.min(botCount, shuffledTiles.length); i++) {
      const tile = shuffledTiles[i];
      const updatedTile = {
        ...tile,
        type: 'depart' as TileType,
        explorable: false,
        collectable: false,
        resources: { 
          food: startRes.food,
          debris: startRes.debris,
          special: startRes.special,
          total: startRes.food + startRes.debris + startRes.special
        },
        hasResources: true,
        color: "#4CAF50"
      };
      newTileMap[tile.position.coord] = updatedTile;
    }

    return newTileMap;
  },

  /**
   * Assigne les tuiles de départ aux bots actifs avec validation d'équité
   * Pipeline complet: starting tiles → validation fairness → autres tuiles → stations
   * @param activeBotIds - IDs des bots actifs
   * @param seed - Seed optionnel pour génération déterministe
   */
  assignStartingTiles: (activeBotIds: string[], seed?: number): void => {
    const currentTiles = get().tiles;
    const radius = get().radius;
    const effectiveSeed = seed ?? Date.now();
    
    fsmLogger.game(`🎯 [TileGeneration] Starting fairness-aware generation with seed=${effectiveSeed}`);
    
    // 1. Placer les tuiles de départ avec validation d'équité
    const { tileMap: tilesWithSpawns, spawns, validation } = get().placeStartingTilesWithFairness(
      currentTiles,
      activeBotIds.length,
      radius,
      effectiveSeed
    );
    
    // Log validation result
    fsmLogger.game(`🎯 [Fairness] Validation: ${validation.valid ? '✅ PASS' : '⚠️ BEST EFFORT'}`);
    fsmLogger.game(`🎯 [Fairness] Metrics: distance=${validation.metrics.spawnDistance.toFixed(1)}, resources=${validation.metrics.resourceDifference.toFixed(1)}%, terrain=${validation.metrics.terrainDifference.toFixed(1)}%`);
    
    // 2. Placer les autres types de tuiles (en évitant les zones de spawn)
    let updatedTileMap = get().placeEmptyTiles(tilesWithSpawns, 0.15, effectiveSeed, spawns);
    updatedTileMap = get().placeObstacleTiles(updatedTileMap, effectiveSeed, spawns);
    updatedTileMap = get().placeDangerTiles(updatedTileMap, effectiveSeed, spawns);
    
    // 3. Placer les stations (équidistantes des spawns)
    updatedTileMap = get().placeGameStations(updatedTileMap, radius, effectiveSeed, spawns);
    
    // 4. Récupérer les tuiles de départ depuis le TileMap
    const startingTiles = Object.values(updatedTileMap).filter(
      (tile: Tile) => tile.type === 'depart'
    ) as Tile[];
    
    // 5. Créer un nouveau TileMap avec les assignations
    const finalTileMap = { ...updatedTileMap };
    
    // 6. Assigner les tuiles aux bots actifs
    activeBotIds.forEach((botId, index) => {
      if (index < startingTiles.length) {
        const tile = startingTiles[index];
        const updatedTile: Tile = {
          ...tile,
          assignedToBot: botId
        };
        finalTileMap[tile.position.coord] = updatedTile;
        
        fsmLogger.game(`[TileGeneration] Tuile de départ assignée à ${botId}:${tile.position.coord} (${tile.position.x.toFixed(1)}, ${tile.position.z.toFixed(1)})`);
      }
    });
    
    // 7. Mettre à jour l'état avec les nouvelles tuiles
    Object.keys(finalTileMap).forEach(coord => {
      get().updateTile(coord as GridCoordinate, finalTileMap[coord as GridCoordinate]);
    });
    
    fsmLogger.game(`🎯 [TileGeneration] Generation complete. Seed=${effectiveSeed}, Spawns=${spawns.join(', ')}`);
  },

});

export default createTileGenerationSlice;
