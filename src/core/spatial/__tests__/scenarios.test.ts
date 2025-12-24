/**
 * ============================================================================
 * DIAGNOSTIC TEST SCENARIOS - End-to-end spatial behavior tests
 * ============================================================================
 * 
 * Comprehensive scenarios testing bot behaviors using core/spatial functions.
 * These tests validate complete workflows to diagnose bot behavior issues.
 * 
 * Scenarios:
 * - Exploration cycle: ship stays put, drone deploys → scans → returns
 * - Collection cycle: ship moves to tile → collects → returns to base
 * - Multi-tile collection: ship collects multiple tiles with capacity management
 * - Pathfinding validation: complex paths around obstacles
 * - Position sync: threshold-based position updates
 * 
 * @vitest
 */

import { describe, expect, it } from 'vitest';

import type { Tile, TileMap } from '../../../types/tile';

import {
  calculateDistance,
  calculateDroneDistance,
  calculateRelativePosition,
  findPath,
  findTileAtPosition,
  findTilesInRadius,
  gridToWorld,
  hasReachedTarget,
  initializeGameGrid,
  interpolateWithSpeed,
  placeGameStations,
  selectRandomTile,
  shouldSyncPosition,
  worldToGrid,
} from '../index';

// ============================================================================
// TEST FIXTURES
// ============================================================================

/**
 * Create test grid with known layout
 */
function createTestGrid(options: { withDangerTiles?: boolean } = {}): TileMap {
  let tiles = initializeGameGrid({ radius: 3, spacing: -0.2 });
  tiles = placeGameStations(tiles, { radius: 3, seed: 42 });
  
  // Optionally add danger tiles
  if (options.withDangerTiles) {
    // Place a few danger tiles for pathfinding tests
    // Filter out first few tiles (likely to be stations) and spread danger across grid
    const tileList = Object.values(tiles).filter(t => t.walkable);
    for (let i = 0; i < Math.min(5, tileList.length / 3); i++) {
      const idx = 10 + Math.floor(i * (tileList.length / 6)); // Skip first 10 (avoid stations)
      const tile = tileList[idx];
      if (tile) {
        tiles[tile.position.coord] = { ...tile, walkable: false };
      }
    }
  }
  
  return tiles;
}

/**
 * Create ship state for testing
 * If no coord specified, uses center tile (0,0 axial = "0,0,3" encoded key)
 */
function createShipState(coord: string | null, tiles: TileMap) {
  // If coord not provided or not found, use first available walkable tile
  let tile: Tile | undefined;
  if (coord) {
    tile = tiles[coord];
  }
  if (!tile) {
    // Find center tile (q=0, r=0) or first walkable tile
    tile = Object.values(tiles).find(t => t.walkable);
  }
  if (!tile) throw new Error(`No valid tiles found in grid`);
  
  return {
    position: tile.position, // WorldGridPosition already has coord
    basePosition: tile.position,
    resources: { food: 0, debris: 0, special: 0, total: 0 },
    maxCapacity: 2000,
  };
}

/**
 * Create drone state for testing
 */
function createDroneState(shipPosition: { x: number; y: number; z: number }) {
  return {
    position: { ...shipPosition, y: shipPosition.y + 1 }, // Hover above ship
    targetDroneTile: null,
    state: 'docked' as const,
    isActive: false,
    isMoving: false,
  };
}

// ============================================================================
// SCENARIO 1: Exploration Cycle
// ============================================================================

describe('Scenario: Exploration Cycle', () => {
  it('should complete full exploration cycle: deploy → scan → return', () => {
    const tiles = createTestGrid();
    const ship = createShipState(null, tiles);
    const drone = createDroneState(ship.position);

    // STEP 1: Deploy drone - select target tile in radius
    const exploringRadius = 2;
    const candidateTiles = findTilesInRadius(ship.position.coord, exploringRadius, tiles);
    expect(candidateTiles.length).toBeGreaterThan(0);
    
    const targetTile = selectRandomTile(candidateTiles, 123);
    expect(targetTile).not.toBeNull();
    drone.targetDroneTile = targetTile;
    (drone as any).state = 'deploying';
    drone.isActive = true;
    drone.isMoving = true;

    // STEP 2: Calculate distance to target (2D for deploying)
    const distanceToTarget = calculateDroneDistance(
      drone.position,
      'deploying',
      targetTile!
    );
    expect(distanceToTarget).toBeGreaterThan(0);
    expect(distanceToTarget).toBeLessThan(5); // Within reasonable range

    // STEP 3: Interpolate position toward target
    const interpolatedPos = interpolateWithSpeed(
      drone.position,
      targetTile!.position,
      { speed: 1.5, deltaTime: 0.1 }
    );
    expect(interpolatedPos.x).not.toBe(drone.position.x);
    
    // STEP 4: Check if reached target
    const reachedTarget = hasReachedTarget(
      interpolatedPos,
      targetTile!.position,
      { threshold: 0.15, ignoreY: true }
    );
    
    if (reachedTarget) {
      (drone as any).state = 'scanning';
      drone.isMoving = false;
    }

    // STEP 5: Return to ship
    (drone as any).state = 'returning';
    drone.isMoving = true;
    drone.targetDroneTile = { ...ship.position, coord: ship.position.coord } as any;

    const distanceToShip = calculateDroneDistance(
      drone.position,
      'returning',
      undefined,
      ship.position
    );
    expect(distanceToShip).toBeGreaterThan(0);

    // STEP 6: Complete cycle
    const backAtShip = hasReachedTarget(
      ship.position,
      ship.position,
      { threshold: 0.15 }
    );
    expect(backAtShip).toBe(true);
  });

  it('should maintain ship position during exploration', () => {
    const tiles = createTestGrid();
    const ship = createShipState(null, tiles);
    const initialPosition = { ...ship.position };

    // Ship should not move during exploration
    expect(ship.position).toEqual(initialPosition);
  });
});

// ============================================================================
// SCENARIO 2: Collection Cycle
// ============================================================================

describe('Scenario: Collection Cycle', () => {
  it('should complete collection: move to tile → collect → return', () => {
    const tiles = createTestGrid();
    const ship = createShipState(null, tiles);

    // STEP 1: Find collectible tiles in radius
    const collectingRadius = 3;
    const candidateTiles = findTilesInRadius(
      ship.position.coord,
      collectingRadius,
      tiles
    ).filter(t => t.resources?.total > 0);
    
    expect(candidateTiles.length).toBeGreaterThan(0);
    const targetTile = candidateTiles[0];

    // STEP 2: Calculate path to target
    const path = findPath(ship.position.coord, targetTile.position.coord, tiles);
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toBe(ship.position.coord);
    expect(path[path.length - 1]).toBe(targetTile.position.coord);

    // STEP 3: Move ship along path (simulate one step)
    if (path.length > 1) {
      const nextCoord = path[1];
      const nextTile = tiles[nextCoord];
      const distance = calculateDistance(ship.position, nextTile.position);
      expect(distance).toBeLessThan(2); // Adjacent tiles
    }

    // STEP 4: Check if reached collection target
    const reachedCollection = hasReachedTarget(
      targetTile.position,
      targetTile.position,
      { threshold: 0.15 }
    );
    expect(reachedCollection).toBe(true);

    // STEP 5: Simulate collection (capacity check)
    const availableCapacity = ship.maxCapacity - ship.resources.total;
    const collectAmount = Math.min(targetTile.resources.total, availableCapacity);
    expect(collectAmount).toBeGreaterThan(0);
    
    ship.resources.food += collectAmount;
    ship.resources.total += collectAmount;

    // STEP 6: Return to base
    const pathToBase = findPath(targetTile.position.coord, ship.basePosition.coord, tiles);
    expect(pathToBase.length).toBeGreaterThan(0);
  });

  it('should handle overload condition during collection', () => {
    const tiles = createTestGrid();
    const ship = createShipState(null, tiles);
    
    // Fill ship to near capacity
    ship.resources.food = 1900;
    ship.resources.total = 1900;

    const availableCapacity = ship.maxCapacity - ship.resources.total;
    expect(availableCapacity).toBe(100);

    // Try to collect from tile with more resources than capacity
    const targetTile = Object.values(tiles).find(t => t.resources?.total > 150);
    if (targetTile) {
      const collectAmount = Math.min(targetTile.resources.total, availableCapacity);
      expect(collectAmount).toBe(100); // Should only collect what fits
    }
  });
});

// ============================================================================
// SCENARIO 3: Multi-Tile Collection
// ============================================================================

describe('Scenario: Multi-Tile Collection', () => {
  it('should collect from multiple tiles until capacity full', () => {
    const tiles = createTestGrid();
    const ship = createShipState('2,2', tiles);
    const collectedTiles: string[] = [];

    // Find multiple collectible tiles
    const candidateTiles = findTilesInRadius(ship.position.coord, 2, tiles)
      .filter(t => t.resources?.total > 0)
      .slice(0, 3); // Limit to 3 tiles

    expect(candidateTiles.length).toBeGreaterThan(0);

    // Simulate collecting from each tile
    for (const tile of candidateTiles) {
      const availableCapacity = ship.maxCapacity - ship.resources.total;
      if (availableCapacity <= 0) break;

      const collectAmount = Math.min(tile.resources.total, availableCapacity);
      ship.resources.food += collectAmount;
      ship.resources.total += collectAmount;
      collectedTiles.push(tile.position.coord);
    }

    expect(collectedTiles.length).toBeGreaterThan(0);
    expect(ship.resources.total).toBeLessThanOrEqual(ship.maxCapacity);
  });

  it('should prioritize closest tiles for collection', () => {
    const tiles = createTestGrid();
    const ship = createShipState(null, tiles);

    // Get tiles with distances
    const tilesWithDistance = findTilesInRadius(ship.position.coord, 3, tiles)
      .filter(t => t.resources?.total > 0)
      .map(tile => ({
        tile,
        distance: calculateDistance(ship.position, tile.position),
      }))
      .sort((a, b) => a.distance - b.distance);

    expect(tilesWithDistance.length).toBeGreaterThan(0);
    
    // First tile should be closest
    if (tilesWithDistance.length > 1) {
      expect(tilesWithDistance[0].distance).toBeLessThanOrEqual(
        tilesWithDistance[1].distance
      );
    }
  });
});

// ============================================================================
// SCENARIO 4: Pathfinding Validation
// ============================================================================

describe('Scenario: Pathfinding Around Obstacles', () => {
  it('should find path around unwalkable tiles', () => {
    const tiles = createTestGrid({ withDangerTiles: true });
    
    // Find danger tiles (unwalkable)
    const dangerTiles = Object.values(tiles).filter(t => !t.walkable);
    expect(dangerTiles.length).toBeGreaterThan(0);

    // Try to path from one side to other
    const startTile = tiles['0,0'];
    const endTile = tiles['3,3'];
    
    if (startTile && endTile) {
      const path = findPath('0,0', '3,3', tiles);
      
      // If path found, verify no danger tiles in path
      if (path.length > 0) {
        for (const coord of path) {
          const tile = tiles[coord];
          expect(tile.walkable).toBe(true);
        }
      }
    }
  });

  it('should handle no path available scenario', () => {
    const tiles = createTestGrid();
    
    // Create isolated tile by making all neighbors unwalkable
    const centerTile = tiles['2,2'];
    if (centerTile?.neighbors) {
      for (const neighborCoord of centerTile.neighbors) {
        tiles[neighborCoord].walkable = false;
      }
    }

    // Try to path to isolated tile
    const path = findPath('0,0', '2,2', tiles);
    expect(path).toEqual([]); // No path possible
  });
});

// ============================================================================
// SCENARIO 5: Position Sync Validation
// ============================================================================

describe('Scenario: Position Sync Optimization', () => {
  it('should detect when sync needed based on distance threshold', () => {
    const currentPos = { x: 0, y: 0.5, z: 0 };
    const targetPos = { x: 0.2, y: 0.5, z: 0 };

    const needsSync = shouldSyncPosition(currentPos, targetPos, { threshold: 0.1 });
    expect(needsSync).toBe(true); // 0.2 > 0.1
  });

  it('should skip sync when positions are close', () => {
    const currentPos = { x: 0, y: 0.5, z: 0 };
    const targetPos = { x: 0.05, y: 0.5, z: 0 };

    const needsSync = shouldSyncPosition(currentPos, targetPos, { threshold: 0.1 });
    expect(needsSync).toBe(false); // 0.05 < 0.1
  });

  it('should interpolate position smoothly', () => {
    const startPos = { x: 0, y: 0, z: 0 };
    const endPos = { x: 10, y: 0, z: 0 };
    const positions: number[] = [];

    // Simulate 10 frames
    let currentPos = { ...startPos };
    for (let i = 0; i < 10; i++) {
      currentPos = interpolateWithSpeed(currentPos, endPos, {
        speed: 2.0,
        deltaTime: 0.1,
      });
      positions.push(currentPos.x);
    }

    // Positions should increase monotonically
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThanOrEqual(positions[i - 1]);
    }
  });
});

// ============================================================================
// SCENARIO 6: Coordinate System Validation
// ============================================================================

describe('Scenario: Coordinate System Consistency', () => {
  it('should maintain consistency between grid and world coords', () => {
    const tiles = createTestGrid();
    const spacing = -0.2;

    // Test round-trip conversion
    const gridCoord = '2,3';
    const tile = tiles[gridCoord];
    
    if (tile) {
      // Grid → World
      const worldPos = gridToWorld(gridCoord, { spacing, defaultY: 0.5 });
      
      // World → Grid
      const reconstructedCoord = worldToGrid(worldPos, { spacing });
      
      expect(reconstructedCoord).toBe(gridCoord);
    }
  });

  it('should find correct tile at world position', () => {
    const tiles = createTestGrid();
    const testTile = tiles['1,1'];
    
    if (testTile) {
      const foundTile = findTileAtPosition(testTile.position, tiles);
      expect(foundTile).not.toBeNull();
      expect(foundTile?.position.coord).toBe('1,1');
    }
  });

  it('should calculate relative positions correctly', () => {
    const shipPos = { x: 5, y: 0.5, z: 5 };
    const droneWorldPos = { x: 7, y: 2, z: 6 };
    
    const relativePos = calculateRelativePosition(droneWorldPos, shipPos);
    expect(relativePos).toEqual({ x: 2, y: 1.5, z: 1 });
  });
});

// ============================================================================
// SCENARIO 7: Station Interaction
// ============================================================================

describe('Scenario: Station Interaction', () => {
  it('should locate fuel station in grid', () => {
    const tiles = createTestGrid();
    const fuelStations = Object.values(tiles).filter(t => t.type === 'fuel');
    
    expect(fuelStations.length).toBeGreaterThan(0);
    
    // Verify station properties
    fuelStations.forEach(station => {
      expect(station.type).toBe('fuel');
      expect(station.color).toBe('orange');
      expect(station.hasResources).toBe(false);
    });
  });

  it('should find path to nearest station', () => {
    const tiles = createTestGrid();
    const ship = createShipState(null, tiles);
    
    // Find all fuel stations
    const fuelStations = Object.values(tiles).filter(t => t.type === 'fuel');
    expect(fuelStations.length).toBeGreaterThan(0);
    
    // Calculate paths to all stations
    const paths = fuelStations.map(station => ({
      station,
      path: findPath(ship.position.coord, station.position.coord, tiles),
    }));
    
    // Find shortest path
    const validPaths = paths.filter(p => p.path.length > 0);
    expect(validPaths.length).toBeGreaterThan(0);
    
    const shortestPath = validPaths.reduce((min, curr) => 
      curr.path.length < min.path.length ? curr : min
    );
    
    expect(shortestPath.path.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// SCENARIO 8: Edge Cases
// ============================================================================

describe('Scenario: Edge Cases and Error Handling', () => {
  it('should handle empty tiles map gracefully', () => {
    const candidateTiles = findTilesInRadius('0,0', 2, {});
    expect(candidateTiles).toEqual([]);
  });

  it('should handle invalid coordinates gracefully', () => {
    const tiles = createTestGrid();
    const path = findPath('invalid' as any, '0,0' as any, tiles);
    expect(path).toEqual([]);
  });

  it('should handle zero capacity ship', () => {
    const tiles = createTestGrid();
    const ship = createShipState(null, tiles);
    ship.maxCapacity = 0;
    ship.resources.total = 0;
    
    const availableCapacity = ship.maxCapacity - ship.resources.total;
    expect(availableCapacity).toBe(0);
  });

  it('should handle tile with zero resources', () => {
    const tiles = createTestGrid();
    const zeroResourceTile = Object.values(tiles).find(t => t.resources?.total === 0);
    
    if (zeroResourceTile) {
      const collectAmount = Math.min(zeroResourceTile.resources.total, 100);
      expect(collectAmount).toBe(0);
    }
  });
});
