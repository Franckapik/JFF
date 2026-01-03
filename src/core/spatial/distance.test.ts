/**
 * ============================================================================
 * DISTANCE UTILITIES - Test Suite
 * ============================================================================
 * 
 * Tests complets pour les fonctions de calcul de distance.
 * Coverage: 100% de distance.ts
 * 
 * @vitest
 */

import { describe, expect, it } from 'vitest';

import type { WorldPosition } from '../../types/coordinates';

import {
    calculateDistance,
    calculateDistance2D,
    getDirectionVector,
    hasReachedTarget,
} from './distance';

describe('core/spatial/distance', () => {
  // ============================================================================
  // calculateDistance
  // ============================================================================

  describe('calculateDistance', () => {
    it('should calculate euclidean distance correctly', () => {
      const posA: WorldPosition = { x: 0, y: 0, z: 0 };
      const posB: WorldPosition = { x: 3, y: 4, z: 0 };
      
      const distance = calculateDistance(posA, posB);
      
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('should handle negative coordinates', () => {
      const posA: WorldPosition = { x: -5, y: 0, z: -3 };
      const posB: WorldPosition = { x: -2, y: 0, z: 1 };
      
      const distance = calculateDistance(posA, posB);
      
      expect(distance).toBe(5); // sqrt(3² + 4²) = 5
    });

    it('should return 0 for identical positions', () => {
      const pos: WorldPosition = { x: 5, y: 2, z: 3 };
      
      const distance = calculateDistance(pos, pos);
      
      expect(distance).toBe(0);
    });

    it('should calculate 3D distance with Y axis', () => {
      const posA: WorldPosition = { x: 0, y: 0, z: 0 };
      const posB: WorldPosition = { x: 1, y: 1, z: 1 };
      
      const distance = calculateDistance(posA, posB);
      
      expect(distance).toBeCloseTo(Math.sqrt(3), 5);
    });

    it('should calculate manhattan distance', () => {
      const posA: WorldPosition = { x: 0, y: 0, z: 0 };
      const posB: WorldPosition = { x: 3, y: 4, z: 5 };
      
      const distance = calculateDistance(posA, posB, { type: 'manhattan' });
      
      expect(distance).toBe(12); // |3| + |4| + |5| = 12
    });

    it('should calculate chebyshev distance', () => {
      const posA: WorldPosition = { x: 0, y: 0, z: 0 };
      const posB: WorldPosition = { x: 3, y: 4, z: 2 };
      
      const distance = calculateDistance(posA, posB, { type: 'chebyshev' });
      
      expect(distance).toBe(4); // max(|3|, |4|, |2|) = 4
    });

    it('should handle very large coordinates', () => {
      const posA: WorldPosition = { x: 1000000, y: 0, z: 0 };
      const posB: WorldPosition = { x: 1000003, y: 0, z: 4 };
      
      const distance = calculateDistance(posA, posB);
      
      expect(distance).toBe(5);
    });

    it('should handle fractional coordinates', () => {
      const posA: WorldPosition = { x: 0.5, y: 1.2, z: 2.3 };
      const posB: WorldPosition = { x: 1.5, y: 2.2, z: 3.3 };
      
      const distance = calculateDistance(posA, posB);
      
      expect(distance).toBeCloseTo(Math.sqrt(3), 5); // sqrt(1² + 1² + 1²)
    });
  });

  // ============================================================================
  // hasReachedTarget
  // ============================================================================

  describe('hasReachedTarget', () => {
    it('should return true when within default threshold', () => {
      const current: WorldPosition = { x: 5.02, y: 0.5, z: 3.01 };
      const target: WorldPosition = { x: 5, y: 0.5, z: 3 };
      
      const reached = hasReachedTarget(current, target);
      
      expect(reached).toBe(true); // Distance ≈ 0.022 < 0.05
    });

    it('should return false when beyond threshold', () => {
      const current: WorldPosition = { x: 5, y: 0, z: 3 };
      const target: WorldPosition = { x: 6, y: 0, z: 3 };
      
      const reached = hasReachedTarget(current, target);
      
      expect(reached).toBe(false); // Distance = 1 > 0.05
    });

    it('should respect custom threshold', () => {
      const current: WorldPosition = { x: 5, y: 0, z: 3 };
      const target: WorldPosition = { x: 5.5, y: 0, z: 3 };
      
      const reached = hasReachedTarget(current, target, { threshold: 1 });
      
      expect(reached).toBe(true); // Distance = 0.5 < 1
    });

    it('should ignore Y axis when requested', () => {
      const current: WorldPosition = { x: 5, y: 10, z: 3 };
      const target: WorldPosition = { x: 5, y: 0, z: 3 };
      
      const reached = hasReachedTarget(current, target, { ignoreY: true });
      
      expect(reached).toBe(true); // XZ distance = 0
    });

    it('should consider Y axis by default', () => {
      const current: WorldPosition = { x: 5, y: 10, z: 3 };
      const target: WorldPosition = { x: 5, y: 0, z: 3 };
      
      const reached = hasReachedTarget(current, target);
      
      expect(reached).toBe(false); // Y distance = 10 > 0.05
    });

    it('should return true for identical positions', () => {
      const pos: WorldPosition = { x: 5, y: 2, z: 3 };
      
      const reached = hasReachedTarget(pos, pos);
      
      expect(reached).toBe(true);
    });

    it('should handle edge case at exact threshold', () => {
      const current: WorldPosition = { x: 0, y: 0, z: 0 };
      const target: WorldPosition = { x: 0.05, y: 0, z: 0 };
      
      const reached = hasReachedTarget(current, target, { threshold: 0.05 });
      
      expect(reached).toBe(false); // Distance = 0.05, not < 0.05
    });
  });

  // ============================================================================
  // getDirectionVector
  // ============================================================================

  describe('getDirectionVector', () => {
    it('should return normalized direction vector', () => {
      const from: WorldPosition = { x: 0, y: 0, z: 0 };
      const to: WorldPosition = { x: 3, y: 4, z: 0 };
      
      const direction = getDirectionVector(from, to);
      
      expect(direction.x).toBeCloseTo(0.6, 5);
      expect(direction.y).toBeCloseTo(0.8, 5);
      expect(direction.z).toBe(0);
      
      // Verify it's normalized (length = 1)
      const length = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
      expect(length).toBeCloseTo(1, 5);
    });

    it('should return zero vector for identical positions', () => {
      const pos: WorldPosition = { x: 5, y: 2, z: 3 };
      
      const direction = getDirectionVector(pos, pos);
      
      expect(direction).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should handle negative directions', () => {
      const from: WorldPosition = { x: 5, y: 0, z: 5 };
      const to: WorldPosition = { x: 2, y: 0, z: 2 };
      
      const direction = getDirectionVector(from, to);
      
      expect(direction.x).toBeCloseTo(-0.707, 3);
      expect(direction.y).toBe(0);
      expect(direction.z).toBeCloseTo(-0.707, 3);
    });

    it('should work in 3D space', () => {
      const from: WorldPosition = { x: 0, y: 0, z: 0 };
      const to: WorldPosition = { x: 1, y: 1, z: 1 };
      
      const direction = getDirectionVector(from, to);
      
      const expected = 1 / Math.sqrt(3);
      expect(direction.x).toBeCloseTo(expected, 5);
      expect(direction.y).toBeCloseTo(expected, 5);
      expect(direction.z).toBeCloseTo(expected, 5);
    });
  });

  // ============================================================================
  // calculateDistance2D
  // ============================================================================

  describe('calculateDistance2D', () => {
    it('should calculate distance on XZ plane only', () => {
      const posA: WorldPosition = { x: 0, y: 10, z: 0 };
      const posB: WorldPosition = { x: 3, y: 5, z: 4 };
      
      const distance = calculateDistance2D(posA, posB);
      
      expect(distance).toBe(5); // sqrt(3² + 4²), Y ignored
    });

    it('should ignore Y coordinate completely', () => {
      const posA: WorldPosition = { x: 5, y: 100, z: 3 };
      const posB: WorldPosition = { x: 5, y: -50, z: 3 };
      
      const distance = calculateDistance2D(posA, posB);
      
      expect(distance).toBe(0); // Same XZ position
    });

    it('should return 0 for same XZ coordinates', () => {
      const posA: WorldPosition = { x: 5, y: 0, z: 10 };
      const posB: WorldPosition = { x: 5, y: 100, z: 10 };
      
      const distance = calculateDistance2D(posA, posB);
      
      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const posA: WorldPosition = { x: -3, y: 0, z: -4 };
      const posB: WorldPosition = { x: 0, y: 0, z: 0 };
      
      const distance = calculateDistance2D(posA, posB);
      
      expect(distance).toBe(5);
    });

    it('should be consistent with calculateDistance when Y is identical', () => {
      const posA: WorldPosition = { x: 1, y: 0.5, z: 2 };
      const posB: WorldPosition = { x: 4, y: 0.5, z: 6 };
      
      const distance2D = calculateDistance2D(posA, posB);
      const distance3D = calculateDistance(posA, posB);
      
      expect(distance2D).toBe(distance3D); // Same because Y is identical
    });
  });
});
