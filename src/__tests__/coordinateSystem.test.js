import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
const Vector3 = THREE.Vector3;
import {
  gridToWorld,
  worldToGrid,
  toVector3,
  fromVector3,
  hasReachedTarget,
  isValidGridCoord,
  isValidWorldPosition
} from '../utils/coordinateSystem';

describe('Coordinate System', () => {
  describe('Validation Functions', () => {
    it('should validate grid coordinates', () => {
      expect(isValidGridCoord('1,2')).toBe(true);
      expect(isValidGridCoord('-1,-2')).toBe(true);
      expect(isValidGridCoord('0,0')).toBe(true);
      expect(isValidGridCoord('invalid')).toBe(false);
      expect(isValidGridCoord('1,2,3')).toBe(false);
      expect(isValidGridCoord('1.5,2')).toBe(false);
      expect(isValidGridCoord(null)).toBe(false);
      expect(isValidGridCoord(undefined)).toBe(false);
      expect(isValidGridCoord({ x: 1, z: 2 })).toBe(false);
    });

    it('should validate world positions', () => {
      expect(isValidWorldPosition({ x: 1, y: 0, z: 2 })).toBe(true);
      expect(isValidWorldPosition({ x: -1, y: 0, z: -2 })).toBe(true);
      expect(isValidWorldPosition({ x: 1.5, y: 0, z: 2.7 })).toBe(true);
      expect(isValidWorldPosition({ x: '1', y: 0, z: 2 })).toBe(false);
      expect(isValidWorldPosition({ x: 1, z: 2 })).toBe(false);
      expect(isValidWorldPosition(null)).toBe(false);
      expect(isValidWorldPosition(undefined)).toBe(false);
      expect(isValidWorldPosition('1,2')).toBe(false);
    });
  });

  describe('Coordinate Transformations', () => {
    it('should convert grid coordinates to world positions', () => {
      expect(gridToWorld('1,2')).toEqual({ x: 1, y: 0, z: 2 });
      expect(gridToWorld('-1,-2')).toEqual({ x: -1, y: 0, z: -2 });
      expect(gridToWorld('0,0')).toEqual({ x: 0, y: 0, z: 0 });
      expect(gridToWorld(null)).toBeNull();
      expect(gridToWorld('invalid')).toBeNull();
    });

    it('should convert world positions to grid coordinates', () => {
      expect(worldToGrid({ x: 1, y: 0, z: 2 })).toBe('1,2');
      expect(worldToGrid({ x: -1, y: 0, z: -2 })).toBe('-1,-2');
      expect(worldToGrid({ x: 1.4, y: 0, z: 2.6 })).toBe('1,3');
      expect(worldToGrid(null)).toBeNull();
      expect(worldToGrid({ x: 'invalid' })).toBeNull();
    });
  });

  describe('Vector3 Conversions', () => {
    it('should convert world positions to Vector3', () => {
      const vector = toVector3({ x: 1, y: 0, z: 2 });
      expect(vector instanceof Vector3).toBe(true);
      expect(vector.x).toBe(1);
      expect(vector.y).toBe(0);
      expect(vector.z).toBe(2);
      expect(toVector3(null)).toBeNull();
      expect(toVector3({ x: 'invalid' })).toBeNull();
    });

    it('should convert Vector3 to world positions', () => {
      const vector = new Vector3(1, 0, 2);
      expect(fromVector3(vector)).toEqual({ x: 1, y: 0, z: 2 });
      expect(fromVector3(null)).toBeNull();
      expect(fromVector3({ x: 1, y: 0, z: 2 })).toBeNull();
    });
  });

  describe('Target Reaching Detection', () => {
    it('should detect when target is reached', () => {
      expect(hasReachedTarget(
        { x: 1, y: 0, z: 2 },
        '1,2',
        0.1
      )).toBe(true);

      expect(hasReachedTarget(
        { x: 1.09, y: 0, z: 2.09 },
        '1,2',
        0.1
      )).toBe(true);

      expect(hasReachedTarget(
        { x: 1.2, y: 0, z: 2 },
        '1,2',
        0.1
      )).toBe(false);
    });

    it('should handle invalid inputs for target detection', () => {
      expect(hasReachedTarget(null, '1,2')).toBe(false);
      expect(hasReachedTarget({ x: 1, y: 0, z: 2 }, null)).toBe(false);
      expect(hasReachedTarget({ x: 'invalid' }, '1,2')).toBe(false);
      expect(hasReachedTarget({ x: 1, y: 0, z: 2 }, 'invalid')).toBe(false);
    });
  });

  describe('Hex Coordinate Conversions', () => {
    it('should convert hex coordinates to grid coordinates', () => {
      expect(hexToGridCoord('A0')).toBe('0,0');
      expect(hexToGridCoord('B5')).toBe('1,5');
      expect(hexToGridCoord('C2')).toBe('2,2');
      expect(hexToGridCoord('1,5')).toBe('1,5'); // Should return as-is
      expect(hexToGridCoord(null)).toBeNull();
      expect(hexToGridCoord('invalid')).toBe('invalid');
    });

    it('should convert grid coordinates to hex coordinates', () => {
      expect(gridToHexCoord('0,0')).toBe('A0');
      expect(gridToHexCoord('1,5')).toBe('B5');
      expect(gridToHexCoord('2,2')).toBe('C2');
      expect(gridToHexCoord('B5')).toBe('B5'); // Should return as-is
      expect(gridToHexCoord(null)).toBeNull();
      expect(gridToHexCoord('invalid')).toBe('invalid');
    });

    it('should validate both grid and hex coordinate formats', () => {
      expect(isValidGridCoord('1,5')).toBe(true);
      expect(isValidGridCoord('B5')).toBe(true);
      expect(isValidGridCoord('-1,5')).toBe(true);
      expect(isValidGridCoord('invalid')).toBe(false);
      expect(isValidGridCoord('12')).toBe(false);
      expect(isValidGridCoord('B5,2')).toBe(false);
    });
  });
});
