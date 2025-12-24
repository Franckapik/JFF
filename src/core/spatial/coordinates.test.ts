/**
 * ============================================================================
 * COORDINATE UTILITIES - Test Suite
 * ============================================================================
 * 
 * Tests complets pour les fonctions de coordonnées.
 * Coverage: 100% de coordinates.ts
 * 
 * @vitest
 */

import { describe, expect, it } from 'vitest';

import type { GridCoordinate } from '../../types/coordinates';
import {
  createGridCoord,
  encodeHexCoord,
  gridToWorld,
  isValidGridCoord,
  isValidWorldPosition,
  parseGridCoord,
  worldToGrid,
} from './coordinates';

describe('core/spatial/coordinates', () => {
  // ============================================================================
  // isValidGridCoord
  // ============================================================================

  describe('isValidGridCoord', () => {
    it('should validate correct grid coordinates', () => {
      expect(isValidGridCoord('5,10')).toBe(true);
      expect(isValidGridCoord('0,0')).toBe(true);
      expect(isValidGridCoord('-3,2')).toBe(true);
      expect(isValidGridCoord('-10,-20')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidGridCoord('5')).toBe(false);
      expect(isValidGridCoord('5,10,15')).toBe(false);
      expect(isValidGridCoord('a,b')).toBe(false);
      expect(isValidGridCoord('5.5,10')).toBe(false);
      expect(isValidGridCoord('5, 10')).toBe(false); // Space
    });

    it('should reject null and undefined', () => {
      expect(isValidGridCoord(null)).toBe(false);
      expect(isValidGridCoord(undefined)).toBe(false);
    });

    it('should reject non-string types', () => {
      expect(isValidGridCoord(123)).toBe(false);
      expect(isValidGridCoord({ x: 5, z: 10 })).toBe(false);
      expect(isValidGridCoord([5, 10])).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidGridCoord('')).toBe(false);
    });

    it('should reject strings with only one number', () => {
      expect(isValidGridCoord('5,')).toBe(false);
      expect(isValidGridCoord(',10')).toBe(false);
    });
  });

  // ============================================================================
  // isValidWorldPosition
  // ============================================================================

  describe('isValidWorldPosition', () => {
    it('should validate correct world positions', () => {
      expect(isValidWorldPosition({ x: 1, y: 0.5, z: 3 })).toBe(true);
      expect(isValidWorldPosition({ x: 0, y: 0, z: 0 })).toBe(true);
      expect(isValidWorldPosition({ x: -5, y: 10, z: -3 })).toBe(true);
    });

    it('should reject positions with NaN values', () => {
      expect(isValidWorldPosition({ x: NaN, y: 0, z: 0 })).toBe(false);
      expect(isValidWorldPosition({ x: 0, y: NaN, z: 0 })).toBe(false);
      expect(isValidWorldPosition({ x: 0, y: 0, z: NaN })).toBe(false);
    });

    it('should reject positions with missing coordinates', () => {
      expect(isValidWorldPosition({ x: 1, z: 3 })).toBe(false);
      expect(isValidWorldPosition({ x: 1, y: 2 })).toBe(false);
      expect(isValidWorldPosition({ y: 2, z: 3 })).toBe(false);
    });

    it('should reject non-number coordinates', () => {
      expect(isValidWorldPosition({ x: '1', y: 0, z: 0 })).toBe(false);
      expect(isValidWorldPosition({ x: 1, y: null, z: 0 })).toBe(false);
      expect(isValidWorldPosition({ x: 1, y: 0, z: undefined })).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(isValidWorldPosition(null)).toBe(false);
      expect(isValidWorldPosition(undefined)).toBe(false);
    });

    it('should reject non-object types', () => {
      expect(isValidWorldPosition(123)).toBe(false);
      expect(isValidWorldPosition('position')).toBe(false);
      expect(isValidWorldPosition([1, 2, 3])).toBe(false);
    });

    it('should accept positions with extra properties', () => {
      expect(isValidWorldPosition({ x: 1, y: 2, z: 3, extra: 'value' })).toBe(true);
    });
  });

  // ============================================================================
  // encodeHexCoord
  // ============================================================================

  describe('encodeHexCoord', () => {
    it('should encode center hex coordinate', () => {
      const coord = encodeHexCoord(0, 0, { radius: 5 });
      expect(coord).toBe('5,5');
    });

    it('should encode positive hex coordinates', () => {
      const coord = encodeHexCoord(2, 3, { radius: 5 });
      expect(coord).toBe('7,8');
    });

    it('should encode negative hex coordinates', () => {
      const coord = encodeHexCoord(-2, -3, { radius: 5 });
      expect(coord).toBe('3,2');
    });

    it('should handle different radii', () => {
      expect(encodeHexCoord(0, 0, { radius: 10 })).toBe('10,10');
      expect(encodeHexCoord(0, 0, { radius: 1 })).toBe('1,1');
      expect(encodeHexCoord(0, 0, { radius: 0 })).toBe('0,0');
    });

    it('should handle edge coordinates', () => {
      const coord = encodeHexCoord(-5, -5, { radius: 5 });
      expect(coord).toBe('0,0');
    });

    it('should produce valid GridCoordinate format', () => {
      const coord = encodeHexCoord(1, 2, { radius: 5 });
      expect(isValidGridCoord(coord)).toBe(true);
    });
  });

  // ============================================================================
  // gridToWorld
  // ============================================================================

  describe('gridToWorld', () => {
    it('should convert grid coordinate to world position with default config', () => {
      const world = gridToWorld('5,10' as GridCoordinate);
      
      expect(world.x).toBeCloseTo(4, 5); // 5 * (1 + (-0.2)) = 5 * 0.8 = 4
      expect(world.y).toBe(0.5);
      expect(world.z).toBeCloseTo(8, 5); // 10 * 0.8 = 8
    });

    it('should respect custom spacing', () => {
      const world = gridToWorld('5,10' as GridCoordinate, { spacing: 0 });
      
      expect(world.x).toBe(5);
      expect(world.y).toBe(0.5);
      expect(world.z).toBe(10);
    });

    it('should respect custom defaultY', () => {
      const world = gridToWorld('5,10' as GridCoordinate, { defaultY: 2 });
      
      expect(world.y).toBe(2);
    });

    it('should handle negative coordinates', () => {
      const world = gridToWorld('-3,2' as GridCoordinate);
      
      expect(world.x).toBeCloseTo(-2.4, 5); // -3 * 0.8
      expect(world.y).toBe(0.5);
      expect(world.z).toBeCloseTo(1.6, 5); // 2 * 0.8
    });

    it('should handle origin coordinate', () => {
      const world = gridToWorld('0,0' as GridCoordinate);
      
      expect(world.x).toBe(0);
      expect(world.y).toBe(0.5);
      expect(world.z).toBe(0);
    });

    it('should produce valid WorldPosition', () => {
      const world = gridToWorld('5,10' as GridCoordinate);
      
      expect(isValidWorldPosition(world)).toBe(true);
    });

    it('should handle positive spacing', () => {
      const world = gridToWorld('5,10' as GridCoordinate, { spacing: 0.5 });
      
      expect(world.x).toBeCloseTo(7.5, 5); // 5 * (1 + 0.5) = 5 * 1.5
      expect(world.z).toBeCloseTo(15, 5); // 10 * 1.5
    });
  });

  // ============================================================================
  // worldToGrid
  // ============================================================================

  describe('worldToGrid', () => {
    it('should convert world position to grid coordinate with default config', () => {
      const grid = worldToGrid({ x: 4, y: 0.5, z: 8 });
      
      expect(grid).toBe('5,10'); // 4 / 0.8 = 5, 8 / 0.8 = 10
    });

    it('should respect custom spacing', () => {
      const grid = worldToGrid({ x: 5, y: 0.5, z: 10 }, { spacing: 0 });
      
      expect(grid).toBe('5,10');
    });

    it('should round to nearest grid coordinate', () => {
      const grid = worldToGrid({ x: 4.1, y: 0.5, z: 8.2 });
      
      expect(grid).toBe('5,10'); // Should round to nearest
    });

    it('should handle negative coordinates', () => {
      const grid = worldToGrid({ x: -2.4, y: 0.5, z: 1.6 });
      
      expect(grid).toBe('-3,2');
    });

    it('should handle origin position', () => {
      const grid = worldToGrid({ x: 0, y: 0.5, z: 0 });
      
      expect(grid).toBe('0,0');
    });

    it('should produce valid GridCoordinate', () => {
      const grid = worldToGrid({ x: 4, y: 0.5, z: 8 });
      
      expect(isValidGridCoord(grid)).toBe(true);
    });

    it('should ignore Y coordinate', () => {
      const grid1 = worldToGrid({ x: 4, y: 0.5, z: 8 });
      const grid2 = worldToGrid({ x: 4, y: 100, z: 8 });
      
      expect(grid1).toBe(grid2);
    });
  });

  // ============================================================================
  // parseGridCoord
  // ============================================================================

  describe('parseGridCoord', () => {
    it('should parse positive coordinates', () => {
      const [x, z] = parseGridCoord('5,10' as GridCoordinate);
      
      expect(x).toBe(5);
      expect(z).toBe(10);
    });

    it('should parse negative coordinates', () => {
      const [x, z] = parseGridCoord('-3,2' as GridCoordinate);
      
      expect(x).toBe(-3);
      expect(z).toBe(2);
    });

    it('should parse origin', () => {
      const [x, z] = parseGridCoord('0,0' as GridCoordinate);
      
      expect(x).toBe(0);
      expect(z).toBe(0);
    });

    it('should return tuple of numbers', () => {
      const result = parseGridCoord('5,10' as GridCoordinate);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');
    });
  });

  // ============================================================================
  // createGridCoord
  // ============================================================================

  describe('createGridCoord', () => {
    it('should create coordinate from positive numbers', () => {
      const coord = createGridCoord(5, 10);
      
      expect(coord).toBe('5,10');
      expect(isValidGridCoord(coord)).toBe(true);
    });

    it('should create coordinate from negative numbers', () => {
      const coord = createGridCoord(-3, 2);
      
      expect(coord).toBe('-3,2');
      expect(isValidGridCoord(coord)).toBe(true);
    });

    it('should create coordinate from zero', () => {
      const coord = createGridCoord(0, 0);
      
      expect(coord).toBe('0,0');
      expect(isValidGridCoord(coord)).toBe(true);
    });

    it('should be inverse of parseGridCoord', () => {
      const original: GridCoordinate = '5,10';
      const [x, z] = parseGridCoord(original);
      const recreated = createGridCoord(x, z);
      
      expect(recreated).toBe(original);
    });

    it('should handle large numbers', () => {
      const coord = createGridCoord(1000, 2000);
      
      expect(coord).toBe('1000,2000');
    });
  });

  // ============================================================================
  // Integration Tests (Round-trip conversions)
  // ============================================================================

  describe('Integration: Round-trip conversions', () => {
    it('should convert grid -> world -> grid consistently', () => {
      const original: GridCoordinate = '5,10';
      const world = gridToWorld(original);
      const converted = worldToGrid(world);
      
      expect(converted).toBe(original);
    });

    it('should handle multiple round-trips', () => {
      let coord: GridCoordinate = '3,7';
      
      for (let i = 0; i < 10; i++) {
        const world = gridToWorld(coord);
        coord = worldToGrid(world);
      }
      
      expect(coord).toBe('3,7');
    });

    it('should work with hex encoding', () => {
      const hex = encodeHexCoord(2, 3, { radius: 5 });
      const world = gridToWorld(hex);
      const grid = worldToGrid(world);
      
      expect(grid).toBe(hex);
    });

    it('should preserve coordinate through parse and create', () => {
      const original: GridCoordinate = '-3,7';
      const [x, z] = parseGridCoord(original);
      const recreated = createGridCoord(x, z);
      
      expect(recreated).toBe(original);
    });
  });
});
