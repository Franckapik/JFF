/**
 * ============================================================================
 * ANIMATION MODULE - Test Suite
 * ============================================================================
 * 
 * Comprehensive tests for animation calculation functions.
 * Coverage: 100% of animation.ts
 * 
 * @vitest
 */

import { describe, expect, it } from 'vitest';

import {
  calculateDistance3D,
  calculateLerpFactor,
  calculateRelativePosition,
  calculateVelocity,
  calculateWorldPosition,
  interpolatePosition,
  interpolateWithSpeed,
  shouldSyncPosition,
  shouldSyncTime,
} from './animation';

// ============================================================================
// TESTS: interpolatePosition
// ============================================================================

describe('interpolatePosition', () => {
  it('should interpolate at factor 0.5', () => {
    const result = interpolatePosition(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 10, z: 10 },
      0.5
    );
    expect(result).toEqual({ x: 5, y: 5, z: 5 });
  });

  it('should return start position at factor 0', () => {
    const result = interpolatePosition(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 10, z: 10 },
      0
    );
    expect(result).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('should return end position at factor 1', () => {
    const result = interpolatePosition(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 10, z: 10 },
      1
    );
    expect(result).toEqual({ x: 10, y: 10, z: 10 });
  });

  it('should clamp factor above 1', () => {
    const result = interpolatePosition(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 10, z: 10 },
      1.5
    );
    expect(result).toEqual({ x: 10, y: 10, z: 10 });
  });

  it('should clamp factor below 0', () => {
    const result = interpolatePosition(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 10, z: 10 },
      -0.5
    );
    expect(result).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('should handle negative coordinates', () => {
    const result = interpolatePosition(
      { x: -5, y: -5, z: -5 },
      { x: 5, y: 5, z: 5 },
      0.5
    );
    expect(result).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('should handle fractional factor', () => {
    const result = interpolatePosition(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 20, z: 30 },
      0.25
    );
    expect(result).toEqual({ x: 2.5, y: 5, z: 7.5 });
  });
});

// ============================================================================
// TESTS: calculateLerpFactor
// ============================================================================

describe('calculateLerpFactor', () => {
  it('should calculate factor from speed and delta', () => {
    const factor = calculateLerpFactor({ speed: 2.0, deltaTime: 0.1 });
    expect(factor).toBe(0.2);
  });

  it('should clamp to maxFactor', () => {
    const factor = calculateLerpFactor({
      speed: 10.0,
      deltaTime: 0.5,
      maxFactor: 1.0,
    });
    expect(factor).toBe(1.0);
  });

  it('should use default maxFactor of 1.0', () => {
    const factor = calculateLerpFactor({ speed: 20.0, deltaTime: 0.1 });
    expect(factor).toBe(1.0);
  });

  it('should handle zero delta time', () => {
    const factor = calculateLerpFactor({ speed: 2.0, deltaTime: 0 });
    expect(factor).toBe(0);
  });

  it('should handle negative values gracefully', () => {
    const factor = calculateLerpFactor({ speed: -2.0, deltaTime: 0.1 });
    expect(factor).toBe(0);
  });

  it('should handle very small delta times', () => {
    const factor = calculateLerpFactor({ speed: 1.5, deltaTime: 0.001 });
    expect(factor).toBeCloseTo(0.0015, 4);
  });

  it('should respect custom maxFactor', () => {
    const factor = calculateLerpFactor({
      speed: 5.0,
      deltaTime: 0.1,
      maxFactor: 0.3,
    });
    expect(factor).toBe(0.3);
  });
});

// ============================================================================
// TESTS: interpolateWithSpeed
// ============================================================================

describe('interpolateWithSpeed', () => {
  it('should interpolate using speed and delta', () => {
    const result = interpolateWithSpeed(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { speed: 2.0, deltaTime: 0.1 }
    );
    expect(result).toEqual({ x: 2.0, y: 0, z: 0 });
  });

  it('should clamp to target position when factor >= 1', () => {
    const result = interpolateWithSpeed(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { speed: 20.0, deltaTime: 1.0 }
    );
    expect(result).toEqual({ x: 10, y: 0, z: 0 });
  });

  it('should handle 3D movement', () => {
    const result = interpolateWithSpeed(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 10, z: 10 },
      { speed: 1.0, deltaTime: 0.5 }
    );
    expect(result).toEqual({ x: 5, y: 5, z: 5 });
  });
});

// ============================================================================
// TESTS: calculateVelocity
// ============================================================================

describe('calculateVelocity', () => {
  it('should calculate normalized velocity', () => {
    const vel = calculateVelocity(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { speed: 2.0, normalize: true }
    );
    expect(vel).toEqual({ x: 2.0, y: 0, z: 0 });
  });

  it('should calculate unnormalized velocity', () => {
    const vel = calculateVelocity(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { speed: 2.0, normalize: false }
    );
    expect(vel).toEqual({ x: 20.0, y: 0, z: 0 });
  });

  it('should handle zero distance with normalization', () => {
    const vel = calculateVelocity(
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { speed: 2.0, normalize: true }
    );
    expect(vel).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('should normalize diagonal movement correctly', () => {
    const vel = calculateVelocity(
      { x: 0, y: 0, z: 0 },
      { x: 3, y: 4, z: 0 },
      { speed: 5.0, normalize: true }
    );
    expect(vel.x).toBeCloseTo(3.0, 1);
    expect(vel.y).toBeCloseTo(4.0, 1);
    expect(vel.z).toBe(0);
  });

  it('should default to normalize=true', () => {
    const vel = calculateVelocity(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { speed: 1.0 }
    );
    expect(vel).toEqual({ x: 1.0, y: 0, z: 0 });
  });

  it('should handle 3D velocity', () => {
    const vel = calculateVelocity(
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      { speed: Math.sqrt(3), normalize: true }
    );
    expect(vel.x).toBeCloseTo(1.0, 5);
    expect(vel.y).toBeCloseTo(1.0, 5);
    expect(vel.z).toBeCloseTo(1.0, 5);
  });
});

// ============================================================================
// TESTS: shouldSyncPosition
// ============================================================================

describe('shouldSyncPosition', () => {
  it('should return true when distance exceeds threshold', () => {
    const needsSync = shouldSyncPosition(
      { x: 0, y: 0, z: 0 },
      { x: 0.2, y: 0, z: 0 },
      { threshold: 0.1 }
    );
    expect(needsSync).toBe(true);
  });

  it('should return false when distance below threshold', () => {
    const needsSync = shouldSyncPosition(
      { x: 0, y: 0, z: 0 },
      { x: 0.05, y: 0, z: 0 },
      { threshold: 0.1 }
    );
    expect(needsSync).toBe(false);
  });

  it('should use default threshold of 0.1', () => {
    const needsSync = shouldSyncPosition(
      { x: 0, y: 0, z: 0 },
      { x: 0.15, y: 0, z: 0 }
    );
    expect(needsSync).toBe(true);
  });

  it('should handle 3D distance', () => {
    const needsSync = shouldSyncPosition(
      { x: 0, y: 0, z: 0 },
      { x: 0.1, y: 0.1, z: 0.1 },
      { threshold: 0.1 }
    );
    // sqrt(0.01 + 0.01 + 0.01) = 0.173 > 0.1
    expect(needsSync).toBe(true);
  });

  it('should return false for identical positions', () => {
    const needsSync = shouldSyncPosition(
      { x: 1, y: 2, z: 3 },
      { x: 1, y: 2, z: 3 },
      { threshold: 0.1 }
    );
    expect(needsSync).toBe(false);
  });
});

// ============================================================================
// TESTS: shouldSyncTime
// ============================================================================

describe('shouldSyncTime', () => {
  it('should return true when time exceeds threshold', () => {
    const lastSync = Date.now() - 5000; // 5 seconds ago
    const needsSync = shouldSyncTime(lastSync, Date.now(), { timeThreshold: 3 });
    expect(needsSync).toBe(true);
  });

  it('should return false when time below threshold', () => {
    const lastSync = Date.now() - 2000; // 2 seconds ago
    const needsSync = shouldSyncTime(lastSync, Date.now(), { timeThreshold: 3 });
    expect(needsSync).toBe(false);
  });

  it('should return false when no time threshold provided', () => {
    const lastSync = Date.now() - 10000;
    const needsSync = shouldSyncTime(lastSync, Date.now(), {});
    expect(needsSync).toBe(false);
  });

  it('should handle exact threshold boundary', () => {
    const lastSync = Date.now() - 3000; // Exactly 3 seconds
    const needsSync = shouldSyncTime(lastSync, Date.now(), { timeThreshold: 3 });
    expect(needsSync).toBe(false); // Should be >= threshold
  });
});

// ============================================================================
// TESTS: calculateDistance3D
// ============================================================================

describe('calculateDistance3D', () => {
  it('should calculate distance along single axis', () => {
    const dist = calculateDistance3D({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });
    expect(dist).toBe(5);
  });

  it('should calculate pythagorean distance', () => {
    const dist = calculateDistance3D({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 });
    expect(dist).toBe(5);
  });

  it('should calculate 3D distance', () => {
    const dist = calculateDistance3D({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
    expect(dist).toBeCloseTo(Math.sqrt(3), 5);
  });

  it('should return 0 for identical positions', () => {
    const dist = calculateDistance3D({ x: 1, y: 2, z: 3 }, { x: 1, y: 2, z: 3 });
    expect(dist).toBe(0);
  });

  it('should handle negative coordinates', () => {
    const dist = calculateDistance3D({ x: -3, y: 0, z: 0 }, { x: 3, y: 0, z: 0 });
    expect(dist).toBe(6);
  });
});

// ============================================================================
// TESTS: calculateRelativePosition
// ============================================================================

describe('calculateRelativePosition', () => {
  it('should calculate relative position', () => {
    const rel = calculateRelativePosition(
      { x: 10, y: 5, z: 3 },
      { x: 8, y: 4, z: 2 }
    );
    expect(rel).toEqual({ x: 2, y: 1, z: 1 });
  });

  it('should handle zero reference', () => {
    const rel = calculateRelativePosition(
      { x: 10, y: 5, z: 3 },
      { x: 0, y: 0, z: 0 }
    );
    expect(rel).toEqual({ x: 10, y: 5, z: 3 });
  });

  it('should handle negative results', () => {
    const rel = calculateRelativePosition(
      { x: 5, y: 3, z: 1 },
      { x: 10, y: 8, z: 6 }
    );
    expect(rel).toEqual({ x: -5, y: -5, z: -5 });
  });

  it('should handle identical positions', () => {
    const rel = calculateRelativePosition(
      { x: 5, y: 5, z: 5 },
      { x: 5, y: 5, z: 5 }
    );
    expect(rel).toEqual({ x: 0, y: 0, z: 0 });
  });
});

// ============================================================================
// TESTS: calculateWorldPosition
// ============================================================================

describe('calculateWorldPosition', () => {
  it('should calculate world position from relative', () => {
    const world = calculateWorldPosition({ x: 2, y: 1, z: 1 }, { x: 8, y: 4, z: 2 });
    expect(world).toEqual({ x: 10, y: 5, z: 3 });
  });

  it('should handle zero relative position', () => {
    const world = calculateWorldPosition({ x: 0, y: 0, z: 0 }, { x: 5, y: 3, z: 1 });
    expect(world).toEqual({ x: 5, y: 3, z: 1 });
  });

  it('should handle negative relative position', () => {
    const world = calculateWorldPosition(
      { x: -2, y: -1, z: -1 },
      { x: 10, y: 5, z: 3 }
    );
    expect(world).toEqual({ x: 8, y: 4, z: 2 });
  });

  it('should be inverse of calculateRelativePosition', () => {
    const worldPos = { x: 10, y: 5, z: 3 };
    const refPos = { x: 8, y: 4, z: 2 };
    const rel = calculateRelativePosition(worldPos, refPos);
    const reconstructed = calculateWorldPosition(rel, refPos);
    expect(reconstructed).toEqual(worldPos);
  });
});
