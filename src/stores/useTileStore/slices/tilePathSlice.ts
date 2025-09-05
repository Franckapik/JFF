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
 * - tileGenerationSlice : findPath, calculatePathDistance, findTileAtPosition
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
  Path,
  Tile,
  TileMap,
  WorldGridPosition,
  WorldPosition
} from '../../../types/index.ts';
import type { TilePathSliceActions } from '../../../types/stores.d.ts';

import fsmLogger from '../../../logger/fsmLogger.ts';


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
   * @returns Path representing the route from start to target
   */
  findPath: (startCoord: GridCoordinate, targetCoord: GridCoordinate, tiles?: TileMap): Path => {
    // Récupère la map des tuiles à utiliser (paramètre ou store)
    const tilesMap = tiles || get().tiles;
    
    // Vérifie la validité des coordonnées de départ et d'arrivée
    // Si elles sont identiques, retourne le point de départ comme chemin
    if (!startCoord || !targetCoord) {
      fsmLogger.error('findPath: Invalid coordinates provided', { startCoord, targetCoord });
      return [];
    }
    
    if (startCoord === targetCoord) {
      fsmLogger.info('findPath: Start and target coordinates are identical', { startCoord, targetCoord });
      return [startCoord];
    }
    
    // Initialisation de la file pour BFS : chaque élément est un chemin (array de coordonnées)
    const queue: Path[] = [[startCoord]];
    // Set pour garder les coordonnées déjà visitées et éviter les boucles
    const visited = new Set<GridCoordinate>();

    // Boucle principale BFS : explore les chemins possibles
    while (queue.length > 0) {
      // Récupère le chemin courant à explorer
      const path = queue.shift()!;
      // Dernière coordonnée du chemin (noeud courant)
      const currentCoord = path[path.length - 1];

      // Si on a atteint la cible, retourne le chemin trouvé
      if (currentCoord === targetCoord) {
        fsmLogger.info('findPath: Path found successfully', { 
          startCoord, 
          targetCoord, 
          pathLength: path.length,
          path: path.slice(0, 5) // Log seulement les 5 premiers éléments pour éviter le spam
        });
        return path;
      }

      // Ignore les coordonnées déjà visitées
      if (visited.has(currentCoord)) {
        continue;
      }

      // Marque la coordonnée comme visitée
      visited.add(currentCoord);
      // Récupère la tuile courante
      const currentTile = tilesMap[currentCoord];

      // Si la tuile a des voisins, explore chaque voisin
      if (currentTile && 'neighbors' in currentTile && Array.isArray(currentTile.neighbors)) {
        for (const neighborCoord of currentTile.neighbors) {
          const neighborTile = tilesMap[neighborCoord];
          // Ajoute le voisin à la file si il est walkable et non visité
          if (neighborTile && neighborTile.walkable && !visited.has(neighborCoord)) {
            queue.push([...path, neighborCoord]);
          }
        }
      }
    }

    // Aucun chemin trouvé : retourne un tableau vide et log l'échec
    fsmLogger.warn('findPath: No path found between coordinates', { 
      startCoord, 
      targetCoord, 
      visitedNodes: visited.size,
      availableTiles: Object.keys(tilesMap).length
    });
    return [];
  },

  /**
   * Calculate 3D Euclidean distance between two world positions
   * @param from - Starting world position
   * @param to - Target world position
   * @returns 3D distance between the two positions
   */
  calculateDistance: (from: WorldPosition, to: WorldPosition): number => {
    if (!from || !to) return Infinity;
    
    const dx = to.x - from.x;
    const dy = (to.y || 0) - (from.y || 0);
    const dz = to.z - from.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },

  /**
   * Calculate the total distance of a path
   * @param path - Path representing the route
   * @param tiles - Map of all tiles (optionnel)
   * @returns Total distance of the path
   */
  calculatePathDistance: (path: Path, tiles?: TileMap): number => {
    if (!path || path.length < 2) return 0;
    
    const tilesMap = tiles || get().tiles;
    
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = tilesMap[path[i]];
      const tileB = tilesMap[path[i + 1]];
      if (tileA && tileB) {
        // Adapter à la nouvelle structure WorldGridPosition
        const positionA: WorldPosition = {
          x: tileA.position.x,
          y: tileA.position.y,
          z: tileA.position.z
        };
        const positionB: WorldPosition = {
          x: tileB.position.x,
          y: tileB.position.y,
          z: tileB.position.z
        };
        
        const distance = get().calculateDistance(positionA, positionB);
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
      
      // Adapter à la nouvelle structure WorldGridPosition
      const tileWorldPosition: WorldPosition = {
        x: tile.position.x,
        y: tile.position.y,
        z: tile.position.z
      };
      
      // Calculer distance 2D (XZ seulement) pour l'assignation de tuiles
      const distance2D = Math.sqrt(
        Math.pow(position.x - tileWorldPosition.x, 2) + 
        Math.pow(position.z - tileWorldPosition.z, 2)
      );
      
      return distance2D < pathConstants.thresholds.positionMatch;
    });
    
    return foundTile as Tile || null;
  },

  // =========================================================================
  // DRONE DISTANCE CALCULATION - Calcul spécialisé pour les drones
  // =========================================================================

  /**
   * Calcule la distance appropriée pour un drone selon son état
   * Unifie la logique qui était dispersée dans droneTrackerEngine
   * @param dronePosition - Position actuelle du drone
   * @param droneState - État visuel du drone (deploying, scanning, returning)
   * @param targetDroneTile - Tuile cible (pour deploying/scanning)
   * @param shipPosition - Position du vaisseau (pour returning)
   * @returns Distance appropriée selon l'état, Infinity si impossible
   */
  calculateDroneDistance: (
    dronePosition: WorldPosition,
    droneState: DroneVisualState,
    targetDroneTile?: Tile | null,
    shipPosition?: WorldGridPosition
  ): number => {
    if (!dronePosition) return Infinity;

    switch (droneState) {
      case 'deploying':
      case 'scanning': {
        if (!targetDroneTile || !targetDroneTile.position) return Infinity;
        const targetPosition = targetDroneTile.position;
        // Distance 2D (XZ) pour l'exploration - ignore la hauteur Y
        const target2D = { x: targetPosition.x, y: 0, z: targetPosition.z };
        const drone2D = { x: dronePosition.x, y: 0, z: dronePosition.z };
        return get().calculateDistance(drone2D, target2D);
      }
      case 'returning': {
        if (!shipPosition) return Infinity;
        // Distance 3D complète pour le retour au vaisseau
        return get().calculateDistance(dronePosition, shipPosition);
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
   * Retourne directement la tuile (Tile) au lieu de la position
   */
  tileInRadius: (
    shipPosition: WorldGridPosition,
    range: number,
    tiles?: TileMap
  ): Tile | null => {
    try {
      // Vérifie la validité des paramètres
      if (!shipPosition || range <= 0) {
        return null;
      }
      // Récupère la map des tuiles
      const tilesMap = tiles || get().tiles;
      if (!tilesMap || Object.keys(tilesMap).length === 0) {
        return null;
      }
      // Si shipPosition.coord existe et correspond à une tuile, on l'utilise directement
      let currentTile: Tile | null = null;
      if (shipPosition.coord && tilesMap[shipPosition.coord]) {
        currentTile = tilesMap[shipPosition.coord];
      } else {
        // Sinon, fallback sur la recherche par position
        currentTile = get().findTileAtPosition(shipPosition, tilesMap);
      }
      if (!currentTile) {
        return null;
      }
      // Liste des tuiles candidates à retourner
      const candidateTiles: Tile[] = [];
      // visited : Set des coordonnées déjà explorées par l'algorithme BFS (pour éviter les boucles)
      const visited = new Set<GridCoordinate>();
      // queue : file FIFO pour le parcours BFS, chaque entrée contient la coordonnée et la distance depuis la tuile de départ
      const queue: { coord: GridCoordinate; distance: number }[] = [
        { coord: currentTile.position.coord, distance: 0 }
      ];
      // Parcours BFS : explore toutes les tuiles accessibles dans le rayon
      while (queue.length > 0) {
        // Récupère la prochaine tuile à explorer et sa distance depuis le départ
        const { coord, distance } = queue.shift()!;
        // Si la distance dépasse le rayon demandé, on ignore cette tuile
        if (distance > range) continue;
        // Si la tuile a déjà été visitée, on l'ignore
        if (visited.has(coord)) continue;
        // Marque la tuile comme visitée
        visited.add(coord);
        // Récupère la tuile courante
        const tile = tilesMap[coord];
        if (!tile) continue;
        // Si la tuile est walkable, non collectée, et différente de la tuile de départ, on l'ajoute aux candidates
        if (distance > 0 && tile.walkable && !tile.collected) {
          candidateTiles.push(tile);
        }
        // Si la distance est encore dans le rayon, on ajoute les voisins à la file pour exploration
        if (distance < range && tile.neighbors) {
          for (const neighborCoord of tile.neighbors) {
            // On n'ajoute que les voisins non visités
            if (!visited.has(neighborCoord)) {
              queue.push({ coord: neighborCoord, distance: distance + 1 });
            }
          }
        }
      }
      // Si aucune tuile candidate trouvée, retourne null
      if (candidateTiles.length === 0) {
        return null;
      }
      // Sélectionne une tuile aléatoire parmi les candidates
      const randomTile = candidateTiles[Math.floor(Math.random() * candidateTiles.length)];
      return randomTile;
    } catch (_error) {
      return null;
    }
  },
});

export default createTilePathSlice;
