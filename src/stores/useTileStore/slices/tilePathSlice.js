/**
 * =========================================================================
 * TILE PATH SLICE - Gestion des chemins et calculs de distance
 * =========================================================================
 * 
 * Ce slice unifie toutes les fonctionnalités liées aux chemins et distances :
 * - Algorithmes de pathfinding (BFS)
 * - Calculs de distance (euclidienne et pathfinding)
 * - Recherche de tuiles par position
 * - Analyses spatiales et géométriques
 * 
 * Fonctionnalités consolidées depuis :
 * - tileCalculationSlice : calculateDistance
 * - tileGenerationSlice : findPath, calculatePathDistance, findTileAtPosition, calculatePath
 * 
 * Types de calculs disponibles :
 * - Distance euclidienne : distance en ligne droite entre deux points
 * - Distance pathfinding : nombre de tuiles dans le chemin le plus court
 * - Recherche de chemins optimaux avec BFS
 * - Analyses de proximité et voisinage
 */

import fsmLogger from "../../../logger/fsmLogger";

// =========================================================================
// CONSTANTES DE PATHFINDING
// =========================================================================

/**
 * Seuils et précisions pour les calculs de pathfinding
 */
const pathConstants = {
  // Seuils de distance et précision
  thresholds: {
    positionMatch: 0.3,    // Seuil pour considérer qu'une position correspond à une tuile
    movementReach: 0.15,   // Seuil pour considérer qu'un véhicule a atteint sa cible
    floatingPrecision: 0.1 // Précision pour les calculs de position flottante
  }
};

// =========================================================================
// SLICE FACTORY - TILE PATH UTILITIES
// =========================================================================

const createTilePathSlice = (set, get) => ({
  
  // =========================================================================
  // PATHFINDING FUNCTIONS - Algorithmes de recherche de chemin
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
    const { isValidGridCoord, normalizeCoordinate } = get();
    
    // Validation et normalisation des coordonnées d'entrée
    const normalizedStart = normalizeCoordinate(startCoord);
    const normalizedTarget = normalizeCoordinate(targetCoord);
    
    if (!normalizedStart || !normalizedTarget) {
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
              isValidGridCoord(neighbor)) {
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
    
    const { calculateDistance, toVector3 } = get();
    
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = tiles[path[i]];
      const tileB = tiles[path[i + 1]];
      if (tileA && tileB) {
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
    const { isValidWorldPosition, calculateDistance } = get();
    
    if (!isValidWorldPosition(position)) {
      return null;
    }
    
    // Utilisation de calculateDistance pour une recherche plus précise avec constante
    return Object.values(tiles).find(tile => {
      if (!tile || !isValidWorldPosition(tile.position)) return false;
      return calculateDistance(position, tile.position) < pathConstants.thresholds.positionMatch;
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
  },

  // =========================================================================
  // DISTANCE CALCULATIONS - Calculs de distance unifié
  // =========================================================================

  /**
   * Calcule la distance entre deux coordonnées sur la grille
   * 
   * Cette fonction offre deux modes de calcul :
   * 1. Pathfinding : utilise l'algorithme de recherche de chemin pour calculer
   *    la distance réelle en nombre de tuiles traversées
   * 2. Euclidienne : calcule la distance en ligne droite entre les deux points
   * 
   * Le mode pathfinding est plus précis pour la logique de jeu car il tient compte
   * des obstacles et de la topologie de la grille, tandis que le mode euclidien
   * est plus rapide pour les calculs de proximité approximatifs.
   * 
   * @param {string} coord1 - Première coordonnée au format "x,y"
   * @param {string} coord2 - Seconde coordonnée au format "x,y"
   * @param {boolean} formatted - Si true, retourne un nombre formaté avec 1 décimale, sinon retourne le nombre brut
   * @param {boolean} usePathfinding - Si true, calcule la distance en nombre de tuiles via pathfinding (chemin le plus court)
   * @returns {number|string} - Distance entre les deux coordonnées (nombre ou chaîne formatée)
   */
  calculateDistance: (coord1, coord2, formatted = true, usePathfinding = true) => {
    // Validation des paramètres d'entrée
    if (!coord1 || !coord2 || typeof coord1 !== 'string' || typeof coord2 !== 'string') {
      return formatted ? "N/A" : 0;
    }
    
    try {
      // Mode pathfinding : calcul de la distance réelle via algorithme de recherche
      if (usePathfinding) {
        const tiles = get().tiles;
        const { findPath } = get();
        
        // Utilise la fonction findPath pour trouver le chemin le plus court
        const path = findPath(coord1, coord2, tiles);
        
        // La longueur du chemin - 1 donne le nombre de tuiles à traverser
        // Retourne 0 si les coordonnées sont identiques
        const distance = path.length > 0 ? path.length - 1 : 0;
        return formatted ? distance.toString() : distance;
      } 
      // Mode euclidien : calcul de la distance en ligne droite
      else {
        // Formatter les coordonnées en nombres en utilisant la fonction du coordinateSlice
        const { hexToGridCoord } = get();
        const [x1, y1] = hexToGridCoord(coord1).split(',').map(Number);
        const [x2, y2] = hexToGridCoord(coord2).split(',').map(Number);      
        
        // Vérification de la validité des coordonnées numériques
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
          return formatted ? "N/A" : 0;
        }
        
        // Calcul de la distance euclidienne classique
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return formatted ? distance.toFixed(1) : distance;
      }
    } catch (error) {
      return formatted ? "N/A" : 0;
    }
  },

  // =========================================================================
  // SPATIAL ANALYSIS - Analyses spatiales avancées
  // =========================================================================

  /**
   * Trouve les tuiles voisines à une distance donnée
   * @param {string} centerCoord - Coordonnée centrale
   * @param {number} maxDistance - Distance maximale à rechercher
   * @param {Object} tiles - Map de toutes les tuiles
   * @param {boolean} includeBlocked - Inclure les tuiles non-walkable
   * @returns {Array} Liste des coordonnées voisines
   */
  findNeighborsInRange: (centerCoord, maxDistance, tiles, includeBlocked = false) => {
    const { findPath } = get();
    const neighbors = [];
    
    Object.keys(tiles).forEach(coord => {
      if (coord === centerCoord) return;
      
      const tile = tiles[coord];
      if (!includeBlocked && tile?.walkable === false) return;
      
      const path = findPath(centerCoord, coord, tiles);
      const distance = path.length > 0 ? path.length - 1 : Infinity;
      
      if (distance <= maxDistance && distance > 0) {
        neighbors.push({
          coord,
          distance,
          tile
        });
      }
    });
    
    return neighbors.sort((a, b) => a.distance - b.distance);
  },

  /**
   * Calcule la distance euclidienne 3D entre deux positions dans l'espace
   * @param {Object} pos1 - Première position (x, y, z)
   * @param {Object} pos2 - Deuxième position (x, y, z)
   * @returns {number} - Distance euclidienne entre les deux points
   */
  calculate3DDistance: (pos1, pos2) => {
    if (!pos1 || !pos2) return Infinity;
    
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) +
      Math.pow(pos2.y - pos1.y, 2) +
      Math.pow(pos2.z - pos1.z, 2)
    );
  },

  /**
   * Trouve la tuile la plus proche d'une position donnée
   * @param {Object} position - Position {x, y, z}
   * @param {Object} tiles - Map de toutes les tuiles
   * @param {Function} filter - Fonction de filtrage optionnelle
   * @returns {Object|null} La tuile la plus proche ou null
   */
  findNearestTile: (position, tiles, filter = null) => {
    const { isValidWorldPosition, calculate3DDistance } = get();
    
    if (!isValidWorldPosition(position)) {
      return null;
    }
    
    let nearestTile = null;
    let minDistance = Infinity;
    
    Object.values(tiles).forEach(tile => {
      if (!tile || !isValidWorldPosition(tile.position)) return;
      if (filter && !filter(tile)) return;
      
      const distance = calculate3DDistance(position, tile.position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestTile = tile;
      }
    });
    
    return nearestTile;
  }
});

export default createTilePathSlice;
