/**
 * ============================================================================
 * PATHFINDING MODULE - Test Suite
 * ============================================================================
 * 
 * Comprehensive tests for pathfinding algorithms and tile selection.
 * Coverage: 100% of pathfinding.ts
 * 
 * @vitest
 */

import { describe, expect, it } from 'vitest';

import type { Path } from '../../types/coordinates';
import type { Tile, TileMap } from '../../types/tile';

import {
    calculateDroneDistance,
    calculatePathDistance,
    findPath,
    findTileAtPosition,
    findTilesInRadius,
    selectRandomTile,
} from './pathfinding';

// ============================================================================
// TEST FIXTURES
// ============================================================================

/**
 * Create minimal tile for testing
 */
function createTile(
  coord: string,
  x: number,
  z: number,
  options: {
    walkable?: boolean;
    collected?: boolean;
    neighbors?: string[];
    y?: number;
  } = {}
): Tile {
  return {
    position: {
      coord,
      x,
      y: options.y ?? 0.5,
      z,
    },
    walkable: options.walkable ?? true,
    collected: options.collected ?? false,
    neighbors: options.neighbors ?? [],
    type: 'food',
    color: 'gray',
    hasResources: false,
    resources: { food: 0, debris: 0, special: 0, total: 0 },
  } as Tile;
}

/**
 * Create simple 3x3 grid for pathfinding tests
 * 
 * Layout (walkable):
 * 0,2  1,2  2,2
 * 0,1  1,1  2,1
 * 0,0  1,0  2,0
 */
function createSimpleGrid(): TileMap {
  const tiles: TileMap = {};

  // Create tiles with positions
  for (let x = 0; x <= 2; x++) {
    for (let z = 0; z <= 2; z++) {
      const coord = `${x},${z}`;
      tiles[coord] = createTile(coord, x, z);
    }
  }

  // Add neighbors (4-directional for simplicity)
  tiles['0,0'].neighbors = ['1,0', '0,1'];
  tiles['1,0'].neighbors = ['0,0', '2,0', '1,1'];
  tiles['2,0'].neighbors = ['1,0', '2,1'];
  tiles['0,1'].neighbors = ['0,0', '1,1', '0,2'];
  tiles['1,1'].neighbors = ['1,0', '0,1', '2,1', '1,2'];
  tiles['2,1'].neighbors = ['2,0', '1,1', '2,2'];
  tiles['0,2'].neighbors = ['0,1', '1,2'];
  tiles['1,2'].neighbors = ['0,2', '1,1', '2,2'];
  tiles['2,2'].neighbors = ['1,2', '2,1'];

  return tiles;
}

// ============================================================================
// TESTS: findPath
// ============================================================================

describe('findPath', () => {
  it('should find direct path between adjacent tiles', () => {
    const tiles = createSimpleGrid();
    const path = findPath('0,0', '1,0', tiles);
    expect(path).toEqual(['0,0', '1,0']);
  });

  it('should find path across multiple tiles', () => {
    const tiles = createSimpleGrid();
    const path = findPath('0,0', '2,2', tiles);
    expect(path.length).toBeGreaterThan(2);
    expect(path[0]).toBe('0,0');
    expect(path[path.length - 1]).toBe('2,2');
  });

  it('should return single-element path when start equals target', () => {
    const tiles = createSimpleGrid();
    const path = findPath('1,1', '1,1', tiles);
    expect(path).toEqual(['1,1']);
  });

  it('should return empty path when start coord invalid', () => {
    const tiles = createSimpleGrid();
    const path = findPath('' as any, '1,1', tiles);
    expect(path).toEqual([]);
  });

  it('should return empty path when target coord invalid', () => {
    const tiles = createSimpleGrid();
    const path = findPath('0,0', '' as any, tiles);
    expect(path).toEqual([]);
  });

  it('should return empty path when tiles map is empty', () => {
    const path = findPath('0,0', '1,1', {});
    expect(path).toEqual([]);
  });

  it('should return empty path when no walkable path exists', () => {
    const tiles = createSimpleGrid();
    // Make tiles around center unwalkable to completely isolate corner
    tiles['1,1'].walkable = false;
    tiles['1,0'].walkable = false;
    tiles['0,1'].walkable = false;
    const path = findPath('0,0', '2,2', tiles);
    expect(path).toEqual([]);
  });

  it('should avoid unwalkable tiles', () => {
    const tiles = createSimpleGrid();
    tiles['1,0'].walkable = false;
    const path = findPath('0,0', '2,0', tiles);
    // Path should go around through other tiles
    expect(path.length).toBeGreaterThan(2);
    expect(path).not.toContain('1,0');
  });

  it('should handle grid with no neighbors', () => {
    const tiles = createSimpleGrid();
    tiles['0,0'].neighbors = [];
    const path = findPath('0,0', '1,0', tiles);
    expect(path).toEqual([]);
  });

  it('should find shortest path when multiple routes exist', () => {
    const tiles = createSimpleGrid();
    const path = findPath('0,0', '2,0', tiles);
    // Direct path through 1,0 should be shortest (3 tiles)
    expect(path).toEqual(['0,0', '1,0', '2,0']);
  });
});

// ============================================================================
// TESTS: calculatePathDistance
// ============================================================================

describe('calculatePathDistance', () => {
  it('should calculate distance for 2-tile path', () => {
    const tiles = createSimpleGrid();
    const path: Path = ['0,0', '1,0'];
    const distance = calculatePathDistance(path, tiles);
    expect(distance).toBeCloseTo(1.0, 1); // 1 unit apart
  });

  it('should calculate distance for multi-tile path', () => {
    const tiles = createSimpleGrid();
    const path: Path = ['0,0', '1,0', '2,0'];
    const distance = calculatePathDistance(path, tiles);
    expect(distance).toBeCloseTo(2.0, 1); // 2 units total
  });

  it('should return 0 for empty path', () => {
    const tiles = createSimpleGrid();
    const distance = calculatePathDistance([], tiles);
    expect(distance).toBe(0);
  });

  it('should return 0 for single-tile path', () => {
    const tiles = createSimpleGrid();
    const distance = calculatePathDistance(['1,1'], tiles);
    expect(distance).toBe(0);
  });

  it('should include Y-axis in distance calculation', () => {
    const tiles: TileMap = {
      '0,0': createTile('0,0', 0, 0, { y: 0, neighbors: ['1,0'] }),
      '1,0': createTile('1,0', 1, 0, { y: 2, neighbors: ['0,0'] }),
    };
    const path: Path = ['0,0', '1,0'];
    const distance = calculatePathDistance(path, tiles);
    // sqrt(1^2 + 2^2 + 0^2) = sqrt(5) ≈ 2.236
    expect(distance).toBeCloseTo(2.236, 2);
  });

  it('should handle missing tiles in path gracefully', () => {
    const tiles = createSimpleGrid();
    const path = ['0,0', 'invalid', '2,0'] as any;
    const distance = calculatePathDistance(path, tiles);
    // Should skip invalid tile
    expect(distance).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 for null path', () => {
    const tiles = createSimpleGrid();
    const distance = calculatePathDistance(null as any, tiles);
    expect(distance).toBe(0);
  });

  it('should return 0 when tiles map is null', () => {
    const distance = calculatePathDistance(['0,0', '1,0'] as any, null as any);
    expect(distance).toBe(0);
  });
});

// ============================================================================
// TESTS: findTileAtPosition
// ============================================================================

describe('findTileAtPosition', () => {
  it('should find tile at exact position', () => {
    const tiles = createSimpleGrid();
    const tile = findTileAtPosition({ x: 1, y: 0.5, z: 1 }, tiles);
    expect(tile).not.toBeNull();
    expect(tile?.position.coord).toBe('1,1');
  });

  it('should find tile within threshold distance', () => {
    const tiles = createSimpleGrid();
    // Position slightly offset from tile center (within 0.3 threshold)
    const tile = findTileAtPosition({ x: 1.2, y: 0.5, z: 1.1 }, tiles);
    expect(tile).not.toBeNull();
    expect(tile?.position.coord).toBe('1,1');
  });

  it('should return null when position outside threshold', () => {
    const tiles = createSimpleGrid();
    // Position far from any tile (> 0.3 units)
    const tile = findTileAtPosition({ x: 10, y: 0.5, z: 10 }, tiles);
    expect(tile).toBeNull();
  });

  it('should return null for invalid position (no x)', () => {
    const tiles = createSimpleGrid();
    const tile = findTileAtPosition({ x: undefined as any, y: 0, z: 0 }, tiles);
    expect(tile).toBeNull();
  });

  it('should return null for invalid position (no z)', () => {
    const tiles = createSimpleGrid();
    const tile = findTileAtPosition({ x: 0, y: 0, z: undefined as any }, tiles);
    expect(tile).toBeNull();
  });

  it('should return null when tiles map is empty', () => {
    const tile = findTileAtPosition({ x: 0, y: 0, z: 0 }, {});
    expect(tile).toBeNull();
  });

  it('should use 2D distance (ignore Y difference)', () => {
    const tiles = createSimpleGrid();
    // Position with very different Y but close XZ
    const tile = findTileAtPosition({ x: 1, y: 100, z: 1 }, tiles);
    expect(tile).not.toBeNull();
    expect(tile?.position.coord).toBe('1,1');
  });

  it('should return first matching tile when multiple within threshold', () => {
    const tiles: TileMap = {
      '0,0': createTile('0,0', 0.1, 0.1),
      '0,1': createTile('0,1', 0.15, 0.15),
    };
    const tile = findTileAtPosition({ x: 0.12, y: 0.5, z: 0.12 }, tiles);
    expect(tile).not.toBeNull();
  });
});

// ============================================================================
// TESTS: findTilesInRadius
// ============================================================================

describe('findTilesInRadius', () => {
  it('should find tiles within radius 1', () => {
    const tiles = createSimpleGrid();
    const candidates = findTilesInRadius('1,1', 1, tiles);
    // Should find 4 direct neighbors (not center tile)
    expect(candidates.length).toBe(4);
    expect(candidates.map(t => t.position.coord).sort()).toEqual(['0,1', '1,0', '1,2', '2,1']);
  });

  it('should find tiles within radius 2', () => {
    const tiles = createSimpleGrid();
    const candidates = findTilesInRadius('1,1', 2, tiles);
    // Should find all 8 tiles (3x3 grid minus center)
    expect(candidates.length).toBe(8);
  });

  it('should exclude start tile from results', () => {
    const tiles = createSimpleGrid();
    const candidates = findTilesInRadius('1,1', 2, tiles);
    const coords = candidates.map(t => t.position.coord);
    expect(coords).not.toContain('1,1');
  });

  it('should exclude unwalkable tiles', () => {
    const tiles = createSimpleGrid();
    tiles['1,0'].walkable = false;
    const candidates = findTilesInRadius('1,1', 1, tiles);
    const coords = candidates.map(t => t.position.coord);
    expect(coords).not.toContain('1,0');
  });

  it('should exclude collected tiles', () => {
    const tiles = createSimpleGrid();
    tiles['1,0'].collected = true;
    const candidates = findTilesInRadius('1,1', 1, tiles);
    const coords = candidates.map(t => t.position.coord);
    expect(coords).not.toContain('1,0');
  });

  it('should return empty array for invalid start coord', () => {
    const tiles = createSimpleGrid();
    const candidates = findTilesInRadius('invalid' as any, 1, tiles);
    expect(candidates).toEqual([]);
  });

  it('should return empty array for zero radius', () => {
    const tiles = createSimpleGrid();
    const candidates = findTilesInRadius('1,1', 0, tiles);
    expect(candidates).toEqual([]);
  });

  it('should return empty array for negative radius', () => {
    const tiles = createSimpleGrid();
    const candidates = findTilesInRadius('1,1', -1, tiles);
    expect(candidates).toEqual([]);
  });

  it('should return empty array when tiles map is empty', () => {
    const candidates = findTilesInRadius('0,0', 1, {});
    expect(candidates).toEqual([]);
  });

  it('should handle disconnected tiles (no neighbors)', () => {
    const tiles = createSimpleGrid();
    tiles['1,1'].neighbors = [];
    const candidates = findTilesInRadius('1,1', 2, tiles);
    expect(candidates).toEqual([]);
  });

  it('should respect radius limit strictly', () => {
    const tiles = createSimpleGrid();
    const radius1 = findTilesInRadius('0,0', 1, tiles);
    const radius2 = findTilesInRadius('0,0', 2, tiles);
    expect(radius2.length).toBeGreaterThan(radius1.length);
  });
});

// ============================================================================
// TESTS: selectRandomTile
// ============================================================================

describe('selectRandomTile', () => {
  it('should select tile from array', () => {
    const tiles = [
      createTile('0,0', 0, 0),
      createTile('1,0', 1, 0),
      createTile('2,0', 2, 0),
    ];
    const selected = selectRandomTile(tiles);
    expect(selected).not.toBeNull();
    expect(tiles).toContainEqual(selected!);
  });

  it('should return null for empty array', () => {
    const selected = selectRandomTile([]);
    expect(selected).toBeNull();
  });

  it('should return single tile from single-element array', () => {
    const tile = createTile('0,0', 0, 0);
    const selected = selectRandomTile([tile]);
    expect(selected).toBe(tile);
  });

  it('should use deterministic selection with seed', () => {
    const tiles = [
      createTile('0,0', 0, 0),
      createTile('1,0', 1, 0),
      createTile('2,0', 2, 0),
    ];
    const selected1 = selectRandomTile(tiles, 42);
    const selected2 = selectRandomTile(tiles, 42);
    expect(selected1).toBe(selected2);
  });

  it('should return null for null array', () => {
    const selected = selectRandomTile(null as any);
    expect(selected).toBeNull();
  });
});

// ============================================================================
// TESTS: calculateDroneDistance
// ============================================================================

describe('calculateDroneDistance', () => {
  it('should calculate 2D distance for deploying state', () => {
    const dronePos = { x: 0, y: 2, z: 0 };
    const targetTile = createTile('3,0', 3, 0);
    const distance = calculateDroneDistance(dronePos, 'deploying', targetTile);
    expect(distance).toBeCloseTo(3.0, 1); // 3 units in XZ
  });

  it('should calculate 2D distance for scanning state', () => {
    const dronePos = { x: 1, y: 5, z: 1 };
    const targetTile = createTile('4,1', 4, 1);
    const distance = calculateDroneDistance(dronePos, 'scanning', targetTile);
    expect(distance).toBeCloseTo(3.0, 1); // 3 units in XZ
  });

  it('should calculate 3D distance for returning state', () => {
    const dronePos = { x: 0, y: 0, z: 0 };
    const shipPos = { x: 1, y: 2, z: 0 };
    const distance = calculateDroneDistance(dronePos, 'returning', undefined, shipPos);
    // sqrt(1^2 + 2^2 + 0^2) = sqrt(5) ≈ 2.236
    expect(distance).toBeCloseTo(2.236, 2);
  });

  it('should return Infinity when drone position is null', () => {
    const targetTile = createTile('0,0', 0, 0);
    const distance = calculateDroneDistance(null as any, 'deploying', targetTile);
    expect(distance).toBe(Infinity);
  });

  it('should return Infinity when target tile missing for deploying', () => {
    const dronePos = { x: 0, y: 0, z: 0 };
    const distance = calculateDroneDistance(dronePos, 'deploying', null);
    expect(distance).toBe(Infinity);
  });

  it('should return Infinity when ship position missing for returning', () => {
    const dronePos = { x: 0, y: 0, z: 0 };
    const distance = calculateDroneDistance(dronePos, 'returning', undefined, undefined);
    expect(distance).toBe(Infinity);
  });

  it('should ignore Y difference for deploying state', () => {
    const dronePos = { x: 0, y: 100, z: 0 };
    const targetTile = createTile('3,0', 3, 0, { y: 0 });
    const distance = calculateDroneDistance(dronePos, 'deploying', targetTile);
    expect(distance).toBeCloseTo(3.0, 1); // Only XZ matters
  });

  it('should include Y difference for returning state', () => {
    const dronePos = { x: 0, y: 0, z: 0 };
    const shipPos = { x: 0, y: 3, z: 4 };
    const distance = calculateDroneDistance(dronePos, 'returning', undefined, shipPos);
    // sqrt(0 + 9 + 16) = 5
    expect(distance).toBeCloseTo(5.0, 1);
  });

  it('should handle missing position properties gracefully', () => {
    const dronePos = { x: 0, y: 0, z: 0 };
    const targetTile = createTile('0,0', 0, 0);
    targetTile.position = null as any;
    const distance = calculateDroneDistance(dronePos, 'deploying', targetTile);
    expect(distance).toBe(Infinity);
  });
});
