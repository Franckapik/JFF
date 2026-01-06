/**
 * ============================================================================
 * PATHFINDING MODULE - Pure pathfinding algorithms
 * ============================================================================
 * 
 * Pure functions for pathfinding, path analysis, and tile selection.
 * All functions are testable in Node.js without browser/store dependencies.
 * 
 * Functions:
 * - findPath: BFS pathfinding between two hex coordinates
 * - calculatePathDistance: Total distance along a path
 * - findTileAtPosition: Find tile at given world position
 * - findTilesInRadius: BFS search for tiles within radius
 * - calculateDroneDistance: Specialized distance for drone states
 * 
 * @module core/spatial/pathfinding
 */

import type {
    GridCoordinate,
    Path,
    Tile,
    TileMap,
    WorldPosition,
} from '../../types/index';

// ============================================================================
// CONSTANTS
// ============================================================================

const POSITION_MATCH_THRESHOLD = 0.3;

// ============================================================================
// PATHFINDING ALGORITHMS
// ============================================================================

/**
 * Find path between two coordinates using breadth-first search
 * Returns array of coordinates from start to target
 * 
 * @param startCoord - Starting coordinate (e.g., "0,0")
 * @param targetCoord - Target coordinate (e.g., "2,1")
 * @param tiles - Map of all tiles with neighbors
 * @returns Array of coordinates representing path, empty if no path found
 * 
 * @example
 * const path = findPath("0,0", "2,1", tiles);
 * // ["0,0", "1,0", "2,1"]
 */
export function findPath(
  startCoord: GridCoordinate,
  targetCoord: GridCoordinate,
  tiles: TileMap
): Path {
  // Validate inputs
  if (!startCoord || !targetCoord || !tiles) {
    return [];
  }

  // Same start and target returns single-element path
  if (startCoord === targetCoord) {
    return [startCoord];
  }

  // BFS initialization
  const queue: Path[] = [[startCoord]];
  const visited = new Set<GridCoordinate>();

  // BFS loop
  while (queue.length > 0) {
    const path = queue.shift()!;
    const currentCoord = path[path.length - 1];

    // Target reached
    if (currentCoord === targetCoord) {
      return path;
    }

    // Skip visited nodes
    if (visited.has(currentCoord)) {
      continue;
    }

    visited.add(currentCoord);
    const currentTile = tiles[currentCoord];

    // Explore neighbors
    if (currentTile?.neighbors) {
      for (const neighborCoord of currentTile.neighbors) {
        const neighborTile = tiles[neighborCoord];
        if (neighborTile?.walkable && !visited.has(neighborCoord)) {
          queue.push([...path, neighborCoord]);
        }
      }
    }
  }

  // No path found
  return [];
}

/**
 * Calculate total 3D distance along a path
 * Sums euclidean distances between consecutive tiles
 * 
 * @param path - Array of coordinates
 * @param tiles - Map of all tiles
 * @returns Total distance, 0 if path too short
 * 
 * @example
 * const distance = calculatePathDistance(["0,0", "1,0", "2,1"], tiles);
 * // 1.8 (approximate)
 */
export function calculatePathDistance(path: Path, tiles: TileMap): number {
  if (!path || path.length < 2 || !tiles) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const tileA = tiles[path[i]];
    const tileB = tiles[path[i + 1]];

    if (tileA?.position && tileB?.position) {
      const dx = tileB.position.x - tileA.position.x;
      const dy = (tileB.position.y || 0) - (tileA.position.y || 0);
      const dz = tileB.position.z - tileA.position.z;
      totalDistance += Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
  }

  return totalDistance;
}

/**
 * Find tile at given world position using threshold matching
 * Returns first tile within POSITION_MATCH_THRESHOLD (0.3 units)
 * 
 * @param position - World position to search
 * @param tiles - Map of all tiles
 * @returns Matching tile or null if none found
 * 
 * @example
 * const tile = findTileAtPosition({ x: 1.0, y: 0.5, z: 0.0 }, tiles);
 * // Returns tile at coord "1,0" if within threshold
 */
export function findTileAtPosition(
  position: WorldPosition,
  tiles: TileMap
): Tile | null {
  if (!position || typeof position.x !== 'number' || typeof position.z !== 'number' || !tiles) {
    return null;
  }

  // Find closest tile within threshold (2D distance XZ only)
  const foundTile = Object.values(tiles).find((tile: Tile) => {
    if (!tile?.position) return false;

    const distance2D = Math.sqrt(
      Math.pow(position.x - tile.position.x, 2) +
      Math.pow(position.z - tile.position.z, 2)
    );

    return distance2D < POSITION_MATCH_THRESHOLD;
  });

  return foundTile || null;
}

/**
 * Find all walkable, uncollected tiles within radius using BFS
 * Returns array of candidate tiles for drone exploration
 * 
 * @param startCoord - Starting coordinate
 * @param radius - Maximum distance (in tile steps)
 * @param tiles - Map of all tiles
 * @returns Array of tiles within radius, empty if none found
 * 
 * @example
 * const candidates = findTilesInRadius("2,2", 3, tiles);
 * // [tile1, tile2, ...] all within 3 steps
 */
export function findTilesInRadius(
  startCoord: GridCoordinate,
  radius: number,
  tiles: TileMap
): Tile[] {
  if (!startCoord || radius <= 0 || !tiles || Object.keys(tiles).length === 0) {
    return [];
  }

  const startTile = tiles[startCoord];
  if (!startTile) {
    return [];
  }

  const candidates: Tile[] = [];
  const visited = new Set<GridCoordinate>();
  const queue: { coord: GridCoordinate; distance: number }[] = [
    { coord: startCoord, distance: 0 },
  ];

  while (queue.length > 0) {
    const { coord, distance } = queue.shift()!;

    if (distance > radius) continue;
    if (visited.has(coord)) continue;

    visited.add(coord);
    const tile = tiles[coord];
    if (!tile) continue;

    // Add tiles that are: (walkable OR explorable) AND uncollected (exclude start tile)
    // This allows exploration of danger tiles (explorable but not walkable)
    if (distance > 0 && (tile.walkable || tile.explorable) && !tile.collected) {
      candidates.push(tile);
    }

    // Explore neighbors if within radius
    if (distance < radius && tile.neighbors) {
      for (const neighborCoord of tile.neighbors) {
        if (!visited.has(neighborCoord)) {
          queue.push({ coord: neighborCoord, distance: distance + 1 });
        }
      }
    }
  }

  return candidates;
}

/**
 * Select random tile from candidates array
 * Helper for drone target selection
 * 
 * @param tiles - Array of candidate tiles
 * @param seed - Optional seed for deterministic selection
 * @returns Random tile or null if array empty
 * 
 * @example
 * const target = selectRandomTile([tile1, tile2, tile3]);
 * const deterministicTarget = selectRandomTile([tile1, tile2], 42);
 */
export function selectRandomTile(tiles: Tile[], seed?: number): Tile | null {
  if (!tiles || tiles.length === 0) {
    return null;
  }

  if (seed !== undefined) {
    // Deterministic selection for tests
    const index = Math.floor(((seed * 9301 + 49297) % 233280 / 233280) * tiles.length);
    return tiles[index];
  }

  return tiles[Math.floor(Math.random() * tiles.length)];
}

/**
 * Calculate appropriate distance for drone based on state
 * - deploying/scanning: 2D distance to target tile (XZ only)
 * - returning: 3D distance to ship position
 * 
 * @param dronePosition - Current drone position
 * @param droneState - Drone visual state
 * @param targetTile - Target tile for deploying/scanning
 * @param shipPosition - Ship position for returning
 * @returns Distance in world units, Infinity if invalid
 * 
 * @example
 * const dist = calculateDroneDistance(
 *   { x: 1, y: 2, z: 3 },
 *   'deploying',
 *   targetTile
 * );
 */
export function calculateDroneDistance(
  dronePosition: WorldPosition,
  droneState: 'deploying' | 'scanning' | 'returning',
  targetTile?: Tile | null,
  shipPosition?: WorldPosition
): number {
  if (!dronePosition) return Infinity;

  switch (droneState) {
    case 'deploying':
    case 'scanning': {
      if (!targetTile?.position) return Infinity;
      // 2D distance (XZ plane only)
      const dx = targetTile.position.x - dronePosition.x;
      const dz = targetTile.position.z - dronePosition.z;
      return Math.sqrt(dx * dx + dz * dz);
    }
    case 'returning': {
      if (!shipPosition) return Infinity;
      // 3D distance
      const dx = shipPosition.x - dronePosition.x;
      const dy = (shipPosition.y || 0) - (dronePosition.y || 0);
      const dz = shipPosition.z - dronePosition.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    default:
      return Infinity;
  }
}
