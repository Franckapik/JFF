/**
 * =========================================================================
 * TILE GENERATION SLICE - Gestion de la génération et pathfinding des tuiles
 * =========================================================================
 * 
 * Ce slice gère tous les aspects liés à la génération des tuiles et au pathfinding :
 * - Génération des positions hexagonales
 * - Calculs de pathfinding (BFS)
 * - Mise à jour des véhicules
 * - Recherche de tuiles par position
 * - Calculs de distance et de chemins
 * 
 * Fonctionnalités migrées depuis utils/utils.js :
 * - generateHexPositions
 * - updateVehicle
 * - findPath, calculatePathDistance
 * - findTileAtPosition, calculatePath
 */

import { Vector3 } from "three";
import useGameStore from "../../useGameStore/";

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
  hexSize: 1.7,                    // Taille de base d'une tuile hexagonale
  sqrt3: Math.sqrt(3),              // Racine de 3 pour les calculs hexagonaux
  
  // Propriétés par défaut des tuiles
  defaultY: 0,                     // Position Y par défaut (plan de jeu)
  maxNeighbors: 6,                 // Nombre maximum de voisins pour une tuile
  
  // Génération de ressources
  foodMax: 100,                    // Quantité maximale de nourriture
  debrisMax: 1000,                 // Quantité maximale de débris
  specialMax: 2,                   // Quantité maximale de ressources spéciales
  immunityChance: 0.1,             // 10% de chance d'immunité
  
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
  },
  
  // Configuration des tuiles de danger
  dangerConfig: {
    0: 0,      // Pas de danger pour rayon 0
    1: 0.05,   // 5% de tuiles danger pour rayon 1
    default: 0.1  // 10% de tuiles danger pour rayon >= 2
  },
  
  // Seuils de distance et précision
  thresholds: {
    positionMatch: 0.3,    // Seuil pour considérer qu'une position correspond à une tuile
    movementReach: 0.15,   // Seuil pour considérer qu'un véhicule a atteint sa cible
    floatingPrecision: 0.1 // Précision pour les calculs de position flottante
  }
};

// =========================================================================
// UTILITAIRES HEXAGONALES
// =========================================================================

/**
 * Génère une couleur hexadécimale aléatoire
 * @returns {string} Couleur au format "#RRGGBB"
 */
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * Encode les coordonnées hexagonales q,r en format lettre-nombre
 * @param {number} q - Coordonnée q
 * @param {number} r - Coordonnée r  
 * @param {number} radius - Rayon de la grille
 * @returns {string} Coordonnée encodée (ex: "A5")
 */
const encodeHexCoord = (q, r, radius) => {
  const letter = String.fromCharCode(65 + q + radius);
  return `${letter}${r + radius}`;
};

// =========================================================================
// SLICE FACTORY - TILE GENERATION UTILITIES
// =========================================================================

const createTileGenerationSlice = (set, get) => ({
  // =========================================================================
  // HEX GRID GENERATION - MÉTHODES PRINCIPALES
  // =========================================================================

  /**
   * Génère la grille hexagonale de base
   * Utilise les constantes définies et les fonctions du coordinateSlice
   */
  generateBaseHexGrid: (radius, spacing) => {
    const hexPositions = [];

    // Génération de la grille hexagonale
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const s = -q - r;
        if (Math.abs(s) <= radius) {
          // Calcul des positions en utilisant les constantes
          const x = (q + r / 2) * (tileConstants.hexSize + spacing);
          const z = r * (tileConstants.sqrt3 / 2) * (tileConstants.hexSize + spacing);

          // Calcul des voisins en utilisant les directions constantes
          const neighbors = hexDirections
            .map((dir) => ({ q: q + dir.q, r: r + dir.r }))
            .filter((neighbor) =>
              Math.abs(neighbor.q) <= radius &&
              Math.abs(neighbor.r) <= radius &&
              Math.abs(-neighbor.q - neighbor.r) <= radius
            )
            .map((neighbor) => encodeHexCoord(neighbor.q, neighbor.r, radius));

          // Création de la tuile avec les constantes et utilitaires
          hexPositions.push({
            coord: encodeHexCoord(q, r, radius),
            position: { x, y: tileConstants.defaultY, z },
            walkable: true,
            explored: false,
            collected: false,
            partiallyCollected: false,
            type: "resource",
            neighbors,
            color: generateRandomColor(),
            outer: neighbors.length < tileConstants.maxNeighbors,
            resources: {
              food: Math.floor(Math.random() * (tileConstants.foodMax + 1)),
              debris: Math.floor(Math.random() * (tileConstants.debrisMax + 1)),
              special: Math.floor(Math.random() * (tileConstants.specialMax + 1)),
            },
            immunity: Math.random() < tileConstants.immunityChance,
          });
        }
      }
    }
    
    return hexPositions;
  },

  /**
   * Ajoute une position de départ pour un nouveau joueur
   * Utilise les constantes pour les ressources de départ
   */
  addPlayerStartingPosition: (playerId, playerType = 'human') => {
    const state = get();
    const { isValidGridCoord } = get(); // Utilisation du coordinateSlice
    
    const availableTiles = Object.values(state.tiles).filter(
      tile => tile.walkable && !tile.outer && 
      tile.type === 'resource' && !tile.playerId &&
      isValidGridCoord(tile.coord) // Validation avec coordinateSlice
    );
    
    if (availableTiles.length === 0) {
      console.warn('No available tiles for new player starting position');
      return false;
    }

    const startTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
    
    set(state => ({
      tiles: {
        ...state.tiles,
        [startTile.coord]: {
          ...startTile,
          type: "depart",
          playerId,
          walkable: true,
          resources: { ...tileConstants.startResources } // Utilisation des constantes
        }
      }
    }));
    
    return startTile.coord;
  },

  /**
   * Place les stations (fuel/repair) sur la grille
   * Utilise les constantes de configuration pour déterminer le nombre de stations
   */
  placeGameStations: (hexPositions, radius) => {
    const stationCandidates = hexPositions.filter(
      tile => tile.walkable && tile.type === "resource"
    );
    
    // Utilisation des constantes pour déterminer le nombre de stations
    const numFuelStations = tileConstants.stationsConfig.fuel[radius] ?? 
                           tileConstants.stationsConfig.fuel.default;
    const numRepairStations = tileConstants.stationsConfig.repair[radius] ?? 
                             tileConstants.stationsConfig.repair.default;
    
    // Place fuel stations
    for (let i = 0; i < numFuelStations && stationCandidates.length > 0; i++) {
      const index = Math.floor(Math.random() * stationCandidates.length);
      stationCandidates[index].type = "fuel";
      stationCandidates.splice(index, 1);
    }
    
    // Place repair stations
    for (let i = 0; i < numRepairStations && stationCandidates.length > 0; i++) {
      const index = Math.floor(Math.random() * stationCandidates.length);
      stationCandidates[index].type = "repair";
      stationCandidates.splice(index, 1);
    }
  },

  /**
   * Place les tuiles de danger sur la grille
   * Utilise les constantes de configuration pour déterminer le pourcentage de danger
   */
  placeDangerTiles: (hexPositions, radius) => {
    const dangerTiles = hexPositions.filter(
      tile => tile.walkable && tile.type === "resource"
    );
    
    // Utilisation des constantes pour déterminer le pourcentage de danger
    const dangerPercentage = tileConstants.dangerConfig[radius] ?? 
                            tileConstants.dangerConfig.default;
    const numDangerTiles = Math.floor(dangerTiles.length * dangerPercentage);
    
    if (dangerTiles.length > numDangerTiles + 1) {
      dangerTiles.slice(0, numDangerTiles).forEach(tile => {
        tile.type = "danger";
        tile.resources = null;
      });
    }
  },

  /**
   * Version simplifiée de generateHexPositions - génération minimale
   * Utilise les constantes et les fonctions du coordinateSlice
   */
  initializeGameGrid: (radius, spacing, initialPlayerCount = 1) => {
    const { isValidWorldPosition } = get(); // Utilisation du coordinateSlice
    
    // 1. Générer la grille de base
    const hexPositions = get().generateBaseHexGrid(radius, spacing);
    
    // 2. Placer les stations
    get().placeGameStations(hexPositions, radius);
    
    // 3. Placer les tuiles de danger
    get().placeDangerTiles(hexPositions, radius);
    
    // 4. Ajouter une seule position de départ initiale
    const availableTiles = hexPositions.filter(
      tile => tile.walkable && !tile.outer && 
      tile.type === "resource" &&
      isValidWorldPosition(tile.position) // Validation avec coordinateSlice
    );
    
    if (availableTiles.length > 0 && initialPlayerCount > 0) {
      const startTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
      startTile.type = "depart";
      startTile.playerId = "player-1";
      startTile.resources = { ...tileConstants.startResources }; // Utilisation des constantes
    }
    
    return hexPositions;
  },


  // =========================================================================
  // PATHFINDING FUNCTIONS
  // =========================================================================

  /**
   * Find a path between two hex coordinates using breadth-first search
   * Utilise les fonctions du coordinateSlice pour la validation des coordonnées
   * @param {string} startCoord - Starting coordinate (e.g., "A1")
   * @param {string} targetCoord - Target coordinate (e.g., "B2")
   * @param {Object} tiles - Map of all tiles
   * @returns {Array} Array of coordinates representing the path
   */
  findPath: (startCoord, targetCoord, tiles) => {
    const { isValidGridCoord, normalizeCoordinate } = get(); // Utilisation du coordinateSlice
    
    // Validation et normalisation des coordonnées d'entrée
    const normalizedStart = normalizeCoordinate(startCoord);
    const normalizedTarget = normalizeCoordinate(targetCoord);
    
    if (!normalizedStart || !normalizedTarget) {
      console.warn('Invalid coordinates provided to findPath:', { startCoord, targetCoord });
      return [];
    }
    
    const queue = [[normalizedStart]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const currentCoord = path[path.length - 1];

      if (currentCoord === normalizedTarget) {
        return path;
      }

      if (!visited.has(currentCoord)) {
        visited.add(currentCoord);
        const neighbors = tiles[currentCoord]?.neighbors || [];
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor) && 
              tiles[neighbor]?.walkable !== false &&
              isValidGridCoord(neighbor)) { // Validation avec coordinateSlice
            queue.push([...path, neighbor]);
          }
        });
      }
    }

    return [];
  },

  /**
   * Calculate the total distance of a path
   * Utilise les fonctions du coordinateSlice pour les calculs de distance
   * @param {Array} path - Array of coordinates representing the path
   * @param {Object} tiles - Map of all tiles
   * @returns {number} Total distance of the path
   */
  calculatePathDistance: (path, tiles) => {
    if (!path || path.length < 2) return 0;
    
    const { calculateDistance, toVector3 } = get(); // Utilisation du coordinateSlice
    
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = tiles[path[i]];
      const tileB = tiles[path[i + 1]];
      if (tileA && tileB) {
        // Utilisation de calculateDistance du coordinateSlice
        totalDistance += calculateDistance(tileA.position, tileB.position);
      }
    }
    
    return totalDistance;
  },

  /**
   * Find the current tile based on a 3D position
   * Utilise les fonctions du coordinateSlice pour la validation et les constantes pour les seuils
   * @param {Object} position - Position {x, y, z} to check
   * @param {Object} tiles - Map of all tiles
   * @returns {Object|null} The tile at this position or null if not found
   */
  findTileAtPosition: (position, tiles) => {
    const { isValidWorldPosition, calculateDistance } = get(); // Utilisation du coordinateSlice
    
    if (!isValidWorldPosition(position)) {
      return null;
    }
    
    // Utilisation de calculateDistance pour une recherche plus précise avec constante
    return Object.values(tiles).find(tile => {
      if (!tile || !isValidWorldPosition(tile.position)) return false;
      return calculateDistance(position, tile.position) < tileConstants.thresholds.positionMatch;
    });
  },

  /**
   * Calculate path from current position to target
   * @param {Object} currentPosition - Current position {x, y, z}
   * @param {string} targetCoord - Target coordinate
   * @param {Object} tiles - Map of all tiles
   * @param {string} fallbackCoord - Fallback coordinate if current position doesn't match a tile
   * @returns {Object} Path data {path, totalDistance}
   */
  calculatePath: (currentPosition, targetCoord, tiles, fallbackCoord) => {
    const { findTileAtPosition, findPath, calculatePathDistance } = get();
    
    // Find the tile at current position
    const currentTile = findTileAtPosition(currentPosition, tiles);
    
    let path = [];
    if (currentTile) {
      path = findPath(currentTile.coord, targetCoord, tiles);
    } else if (fallbackCoord) {
      // Use fallback coordinate if we can't find a tile at current position
      path = findPath(fallbackCoord, targetCoord, tiles);
    }
    
    if (!path || path.length === 0) {
      return { path: [], totalDistance: 0 };
    }
    
    const totalDistance = calculatePathDistance(path, tiles);
    
    return { path, totalDistance };
  }
});

export default createTileGenerationSlice;
