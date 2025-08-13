/**
 * =========================================================================
 * TILE PATH SLICE - Gestion des chemins et calculs de distance (TypeScript)
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

import type {
  DroneVisualState,
  GridCoordinate,
  Tile,
  TileMap,
  WorldPosition
} from '../../../types/index.ts';
import type { PathResult, TilePathSliceActions } from '../../../types/stores.d.ts';


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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTilePathSlice = (_set: unknown, get: () => any): TilePathSliceActions => ({
  
  // =========================================================================
  // PATHFINDING FUNCTIONS - Algorithmes de recherche de chemin
  // =========================================================================

  /**
   * Find a path between two hex coordinates using breadth-first search
   * Utilise les fonctions du coordinateSlice pour la validation des coordonnées
   * @param startCoord - Starting coordinate (e.g., "A1")
   * @param targetCoord - Target coordinate (e.g., "B2")
   * @param tiles - Map of all tiles (optionnel, utilise get().tiles par défaut)
   * @returns Array of coordinates representing the path
   */
  findPath: (startCoord: GridCoordinate, targetCoord: GridCoordinate, tiles?: TileMap): GridCoordinate[] => {
    const tilesMap = tiles || get().tiles;
    
    if (!startCoord || !targetCoord || startCoord === targetCoord) {
      return startCoord === targetCoord ? [startCoord] : [];
    }
    
    const queue: GridCoordinate[][] = [[startCoord]];
    const visited = new Set<GridCoordinate>();

    while (queue.length > 0) {
      const path = queue.shift()!;
      const currentCoord = path[path.length - 1];

      if (currentCoord === targetCoord) {
        return path;
      }

      if (visited.has(currentCoord)) {
        continue;
      }

      visited.add(currentCoord);
      const currentTile = tilesMap[currentCoord];

      if (currentTile && 'neighbors' in currentTile && Array.isArray(currentTile.neighbors)) {
        for (const neighborCoord of currentTile.neighbors) {
          const neighborTile = tilesMap[neighborCoord];
          
          if (neighborTile && neighborTile.walkable && !visited.has(neighborCoord)) {
            queue.push([...path, neighborCoord]);
          }
        }
      }
    }

    return []; // Aucun chemin trouvé
  },

  /**
   * Calcule la distance entre deux positions ou coordonnées
   * Supporte plusieurs formats d'entrée et types de calcul
   * 
   * @param from - Position/coordonnée de départ
   * @param to - Position/coordonnée d'arrivée
   * @param usePathfinding - Si true, utilise le pathfinding, sinon distance euclidienne
   * @param detailed - Si true, retourne des informations détaillées
   * @returns Distance calculée
   */
  calculateDistance: (
    from: GridCoordinate | WorldPosition, 
    to: GridCoordinate | WorldPosition, 
    usePathfinding: boolean = false, 
  ): number => {
    const tiles = get().tiles;
    
    // Conversion des entrées vers GridCoordinate
    const fromCoord = typeof from === 'string' 
      ? from 
      : typeof from === 'object' && 'x' in from && 'z' in from 
        ? `${from.x},${from.z}` 
        : null;
        
    const toCoord = typeof to === 'string' 
      ? to 
      : typeof to === 'object' && 'x' in to && 'z' in to 
        ? `${to.x},${to.z}` 
        : null;
    
    if (!fromCoord || !toCoord) {
      return Infinity;
    }
    
    if (usePathfinding) {
      // Calcul via pathfinding
      const path = get().findPath(fromCoord, toCoord, tiles);
      return path.length > 0 ? path.length - 1 : Infinity;
    } else {
      // Calcul euclidien
      const [fromX, fromZ] = fromCoord.split(',').map(Number);
      const [toX, toZ] = toCoord.split(',').map(Number);
      
      return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toZ - fromZ, 2));
    }
  },

  /**
   * Calculate 3D Euclidean distance between two world positions
   * @param from - Starting world position
   * @param to - Target world position
   * @returns 3D distance between the two positions
   */
  calculate3DDistance: (from: WorldPosition, to: WorldPosition): number => {
    if (!from || !to) return Infinity;
    
    const dx = to.x - from.x;
    const dy = (to.y || 0) - (from.y || 0);
    const dz = to.z - from.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },

  /**
   * Calculate the total distance of a path
   * @param path - Array of coordinates representing the path
   * @param tiles - Map of all tiles (optionnel)
   * @returns Total distance of the path
   */
  calculatePathDistance: (path: GridCoordinate[], tiles?: TileMap): number => {
    if (!path || path.length < 2) return 0;
    
    const tilesMap = tiles || get().tiles;
    
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = tilesMap[path[i]];
      const tileB = tilesMap[path[i + 1]];
      if (tileA && tileB) {
        const distance = Math.sqrt(
          Math.pow(tileB.position.x - tileA.position.x, 2) + 
          Math.pow(tileB.position.z - tileA.position.z, 2)
        );
        totalDistance += distance;
      }
    }
    
    return totalDistance;
  },

  /**
   * Find the current tile based on a 3D position
   * @param position - Position {x, y, z} to check
   * @param tiles - Map of all tiles (optionnel)
   * @returns The tile at this position or null if not found
   */
  findTileAtPosition: (position: WorldPosition, tiles?: TileMap): Tile | null => {
    const tilesMap = tiles || get().tiles;
    
    if (!position || typeof position.x !== 'number' || typeof position.z !== 'number') {
      return null;
    }
    
    // Recherche de la tuile la plus proche dans le seuil
    const foundTile = Object.values(tilesMap).find((tile: Tile) => {
      if (!tile || !tile.position) return false;
      
      const distance = Math.sqrt(
        Math.pow(tile.position.x - position.x, 2) + 
        Math.pow(tile.position.z - position.z, 2)
      );
      
      return distance < pathConstants.thresholds.positionMatch;
    });
    
    return foundTile as Tile || null;
  },

  /**
   * Calculate path from current position to target
   * @param currentPosition - Current position {x, y, z}
   * @param targetCoord - Target coordinate
   * @param tiles - Map of all tiles (optionnel)
   * @param fallbackCoord - Fallback coordinate if current position doesn't match a tile
   * @returns Path data {path, totalDistance, isReachable}
   */
  calculatePath: (
    currentPosition: WorldPosition, 
    targetCoord: GridCoordinate, 
    tiles?: TileMap, 
    fallbackCoord?: GridCoordinate
  ): PathResult => {
    const tilesMap = tiles || get().tiles;
    
    // Find the tile at current position
    const currentTile = get().findTileAtPosition(currentPosition, tilesMap);
    
    let path: GridCoordinate[] = [];
    if (currentTile) {
      path = get().findPath(currentTile.coord, targetCoord, tilesMap);
    } else if (fallbackCoord) {
      // Use fallback coordinate if we can't find a tile at current position
      path = get().findPath(fallbackCoord, targetCoord, tilesMap);
    }
    
    const totalDistance = get().calculatePathDistance(path, tilesMap);
    const isReachable = path.length > 0;
    
    return {
      path,
      totalDistance,
      isReachable
    };
  },

  /**
   * Vérifie si une destination est atteignable depuis une position
   * @param from - Coordonnée de départ
   * @param to - Coordonnée d'arrivée
   * @param tiles - Map des tuiles (optionnel)
   * @returns true si la destination est atteignable
   */
  isReachable: (from: GridCoordinate, to: GridCoordinate, tiles?: TileMap): boolean => {
    const path = get().findPath(from, to, tiles);
    return path.length > 0;
  },

  // =========================================================================
  // DRONE DISTANCE CALCULATION - Calcul spécialisé pour les drones
  // =========================================================================

  /**
   * Calcule la distance appropriée pour un drone selon son état
   * Unifie la logique qui était dispersée dans droneTrackerEngine
   * @param dronePosition - Position actuelle du drone
   * @param droneState - État visuel du drone (deploying, scanning, returning)
   * @param targetPosition - Position cible (pour deploying/scanning)
   * @param shipPosition - Position du vaisseau (pour returning)
   * @returns Distance appropriée selon l'état, Infinity si impossible
   */
  calculateDroneDistance: (
    dronePosition: WorldPosition,
    droneState: DroneVisualState,
    targetPosition?: WorldPosition,
    shipPosition?: WorldPosition
  ): number => {
    if (!dronePosition) return Infinity;

    switch (droneState) {
      case 'deploying':
      case 'scanning': {
        if (!targetPosition) return Infinity;
        
        // Distance 2D (XZ) pour l'exploration - ignore la hauteur Y
        const dx = dronePosition.x - targetPosition.x;
        const dz = dronePosition.z - targetPosition.z;
        return Math.sqrt(dx * dx + dz * dz);
      }
      
      case 'returning': {
        if (!shipPosition) return Infinity;
        
        // Distance 3D complète pour le retour au vaisseau
        return get().calculate3DDistance(dronePosition, shipPosition);
      }
      
      default:
        return Infinity;
    }
  },

  // =========================================================================
  // TILE SELECTION FUNCTIONS - Sélection de tuiles pour drones
  // =========================================================================

  /**
   * Sélectionne une tuile cible dans un rayon donné pour le drone
   * Utilise un algorithme BFS basé sur les GridCoordinate et le système de voisins
   * pour garantir que seules les tuiles existantes du plateau sont sélectionnées
   * @param shipPosition - Position du vaisseau (base de calcul)
   * @param range - Rayon de recherche en nombre de tuiles (distance hexagonale)
   * @param tiles - Map des tuiles (optionnel, utilise get().tiles par défaut)
   * @returns Position cible ou null si aucune cible valide
   */
  selectTargetTileInRadiusForDrone: (
    shipPosition: WorldPosition,
    range: number,
    tiles?: TileMap
  ): WorldPosition | null => {
    try {
      if (!shipPosition || range <= 0) {
        return null;
      }
      
      // Utiliser les tuiles fournies ou récupérer du store
      const tilesMap = tiles || get().tiles;
      
      if (!tilesMap || Object.keys(tilesMap).length === 0) {
        return null; // Pas de fallback aléatoire - retourner null si pas de tuiles
      }
      
      // 1. Trouver la tuile actuelle du vaisseau
      const currentTile = get().findTileAtPosition(shipPosition, tilesMap);
      if (!currentTile) {
        return null; // Impossible de localiser le vaisseau sur le plateau
      }
      
      // 2. Recherche BFS pour collecter toutes les tuiles dans le rayon
      const candidateTiles: Tile[] = [];
      const visited = new Set<GridCoordinate>();
      const queue: { coord: GridCoordinate; distance: number }[] = [
        { coord: currentTile.coord, distance: 0 }
      ];
      
      while (queue.length > 0) {
        const { coord, distance } = queue.shift()!;
        
        // Si on a dépassé le rayon, on arrête cette branche
        if (distance > range) {
          continue;
        }
        
        // Si déjà visité, on passe
        if (visited.has(coord)) {
          continue;
        }
        
        visited.add(coord);
        const tile = tilesMap[coord];
        
        if (!tile) {
          continue; // Tuile inexistante (ne devrait pas arriver)
        }
        
        // Ajouter à la liste des candidats si c'est une tuile valide et pas la tuile de départ
        if (distance > 0 && tile.walkable && !tile.collected) {
          candidateTiles.push(tile);
        }
        
        // Ajouter les voisins à la queue pour la prochaine itération
        if (distance < range && tile.neighbors) {
          for (const neighborCoord of tile.neighbors) {
            if (!visited.has(neighborCoord)) {
              queue.push({ coord: neighborCoord, distance: distance + 1 });
            }
          }
        }
      }
      
      // 3. Sélectionner une tuile candidate au hasard
      if (candidateTiles.length === 0) {
        return null; // Aucune tuile valide trouvée dans le rayon
      }
      
      const randomTile = candidateTiles[Math.floor(Math.random() * candidateTiles.length)];

      // 4. Convertir la position de la tuile en WorldPosition
      let targetPosition: WorldPosition;
      if (Array.isArray(randomTile.position)) {
        targetPosition = { 
          x: randomTile.position[0], 
          y: randomTile.position[1] + 0.5, // Légèrement au-dessus de la tuile
          z: randomTile.position[2] 
        };
      } else {
        targetPosition = { 
          x: randomTile.position.x, 
          y: (randomTile.position.y || 0) + 0.5,
          z: randomTile.position.z 
        };
      }
      
      return targetPosition;
      
    } catch (_error) {
      // En cas d'erreur, retourner null plutôt qu'une position aléatoire
      return null;
    }
  },
});

export default createTilePathSlice;
