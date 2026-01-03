/**
 * ============================================================================
 * ANIMATION MODULE - Pure animation calculations
 * ============================================================================
 * 
 * Pure mathematical functions for position interpolation and velocity.
 * No dependencies on Three.js, R3F, or animation state management.
 * All functions testable in Node.js environment.
 * 
 * Functions:
 * - interpolatePosition: Linear interpolation between positions
 * - calculateLerpFactor: Calculate interpolation factor from speed/delta
 * - calculateVelocity: Calculate velocity vector from positions and speed
 * - shouldSyncPosition: Determine if position sync needed based on threshold
 * - calculateDistance3D: Simple 3D euclidean distance
 * 
 * @module core/spatial/animation
 */

import type { WorldPosition } from '../../types/coordinates';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LerpOptions {
  /** Speed multiplier for interpolation */
  speed: number;
  /** Delta time in seconds */
  deltaTime: number;
  /** Maximum lerp factor (default: 1.0) */
  maxFactor?: number;
}

export interface VelocityOptions {
  /** Speed multiplier */
  speed: number;
  /** Normalize velocity vector (default: true) */
  normalize?: boolean;
}

export interface SyncOptions {
  /** Distance threshold for sync (default: 0.1) */
  threshold?: number;
  /** Time threshold in seconds (default: no time check) */
  timeThreshold?: number;
}

// ============================================================================
// INTERPOLATION FUNCTIONS
// ============================================================================

/**
 * Linearly interpolate between two positions
 * Pure lerp: result = from + (to - from) * factor
 * 
 * @param from - Starting position
 * @param to - Target position
 * @param factor - Interpolation factor [0, 1]
 * @returns Interpolated position
 * 
 * @example
 * const pos = interpolatePosition(
 *   { x: 0, y: 0, z: 0 },
 *   { x: 10, y: 5, z: 0 },
 *   0.5
 * );
 * // { x: 5, y: 2.5, z: 0 }
 */
export function interpolatePosition(
  from: WorldPosition,
  to: WorldPosition,
  factor: number
): WorldPosition {
  const clampedFactor = Math.max(0, Math.min(1, factor));
  
  return {
    x: from.x + (to.x - from.x) * clampedFactor,
    y: from.y + (to.y - from.y) * clampedFactor,
    z: from.z + (to.z - from.z) * clampedFactor,
  };
}

/**
 * Calculate lerp factor from speed and delta time
 * Formula: min(maxFactor, deltaTime * speed)
 * 
 * @param options - Speed and delta time configuration
 * @returns Clamped lerp factor [0, maxFactor]
 * 
 * @example
 * const factor = calculateLerpFactor({ speed: 2.0, deltaTime: 0.016 });
 * // 0.032 (clamped to maxFactor=1.0)
 */
export function calculateLerpFactor(options: LerpOptions): number {
  const { speed, deltaTime, maxFactor = 1.0 } = options;
  const factor = deltaTime * speed;
  return Math.min(maxFactor, Math.max(0, factor));
}

/**
 * Interpolate position using speed and delta time
 * Convenience function combining interpolatePosition + calculateLerpFactor
 * 
 * @param from - Starting position
 * @param to - Target position
 * @param options - Speed and delta time
 * @returns Interpolated position
 * 
 * @example
 * const pos = interpolateWithSpeed(
 *   { x: 0, y: 0, z: 0 },
 *   { x: 10, y: 0, z: 0 },
 *   { speed: 2.0, deltaTime: 0.1 }
 * );
 * // { x: 2.0, y: 0, z: 0 }
 */
export function interpolateWithSpeed(
  from: WorldPosition,
  to: WorldPosition,
  options: LerpOptions
): WorldPosition {
  const factor = calculateLerpFactor(options);
  return interpolatePosition(from, to, factor);
}

// ============================================================================
// VELOCITY CALCULATIONS
// ============================================================================

/**
 * Calculate velocity vector from two positions and speed
 * Returns direction vector scaled by speed
 * 
 * @param from - Starting position
 * @param to - Target position
 * @param options - Speed and normalization options
 * @returns Velocity vector
 * 
 * @example
 * const vel = calculateVelocity(
 *   { x: 0, y: 0, z: 0 },
 *   { x: 10, y: 0, z: 0 },
 *   { speed: 2.0, normalize: true }
 * );
 * // { x: 2.0, y: 0, z: 0 }
 */
export function calculateVelocity(
  from: WorldPosition,
  to: WorldPosition,
  options: VelocityOptions
): WorldPosition {
  const { speed, normalize = true } = options;
  
  // Direction vector
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  
  if (normalize) {
    // Normalize and scale by speed
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (length === 0) {
      return { x: 0, y: 0, z: 0 };
    }
    return {
      x: (dx / length) * speed,
      y: (dy / length) * speed,
      z: (dz / length) * speed,
    };
  }
  
  // Just scale by speed
  return {
    x: dx * speed,
    y: dy * speed,
    z: dz * speed,
  };
}

// ============================================================================
// POSITION SYNC UTILITIES
// ============================================================================

/**
 * Check if position sync is needed based on distance threshold
 * Returns true if distance exceeds threshold
 * 
 * @param current - Current position
 * @param target - Target position
 * @param options - Threshold configuration
 * @returns True if sync needed
 * 
 * @example
 * const needsSync = shouldSyncPosition(
 *   { x: 0, y: 0, z: 0 },
 *   { x: 0.2, y: 0, z: 0 },
 *   { threshold: 0.1 }
 * );
 * // true (distance 0.2 > threshold 0.1)
 */
export function shouldSyncPosition(
  current: WorldPosition,
  target: WorldPosition,
  options: SyncOptions = {}
): boolean {
  const { threshold = 0.1 } = options;
  
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const dz = target.z - current.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  return distance > threshold;
}

/**
 * Check if time-based sync is needed
 * Returns true if elapsed time exceeds threshold
 * 
 * @param lastSyncTime - Timestamp of last sync (ms)
 * @param currentTime - Current timestamp (ms)
 * @param options - Time threshold configuration
 * @returns True if sync needed
 * 
 * @example
 * const needsSync = shouldSyncTime(
 *   Date.now() - 5000,
 *   Date.now(),
 *   { timeThreshold: 3 }
 * );
 * // true (5 seconds > 3 seconds threshold)
 */
export function shouldSyncTime(
  lastSyncTime: number,
  currentTime: number,
  options: SyncOptions = {}
): boolean {
  const { timeThreshold } = options;
  if (timeThreshold === undefined) {
    return false;
  }
  
  const elapsedSeconds = (currentTime - lastSyncTime) / 1000;
  return elapsedSeconds > timeThreshold;
}

/**
 * Simple 3D euclidean distance calculation
 * Provided for convenience in animation context
 * 
 * @param from - First position
 * @param to - Second position
 * @returns Distance in world units
 * 
 * @example
 * const dist = calculateDistance3D(
 *   { x: 0, y: 0, z: 0 },
 *   { x: 3, y: 4, z: 0 }
 * );
 * // 5.0
 */
export function calculateDistance3D(
  from: WorldPosition,
  to: WorldPosition
): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ============================================================================
// RELATIVE POSITION UTILITIES
// ============================================================================

/**
 * Calculate relative position from world position and reference
 * Formula: relative = world - reference
 * 
 * @param worldPosition - Absolute world position
 * @param referencePosition - Reference point (e.g., parent position)
 * @returns Relative position
 * 
 * @example
 * const rel = calculateRelativePosition(
 *   { x: 10, y: 5, z: 3 },
 *   { x: 8, y: 4, z: 2 }
 * );
 * // { x: 2, y: 1, z: 1 }
 */
export function calculateRelativePosition(
  worldPosition: WorldPosition,
  referencePosition: WorldPosition
): WorldPosition {
  return {
    x: worldPosition.x - referencePosition.x,
    y: worldPosition.y - referencePosition.y,
    z: worldPosition.z - referencePosition.z,
  };
}

/**
 * Calculate world position from relative position and reference
 * Formula: world = relative + reference
 * 
 * @param relativePosition - Position relative to reference
 * @param referencePosition - Reference point (e.g., parent position)
 * @returns Absolute world position
 * 
 * @example
 * const world = calculateWorldPosition(
 *   { x: 2, y: 1, z: 1 },
 *   { x: 8, y: 4, z: 2 }
 * );
 * // { x: 10, y: 5, z: 3 }
 */
export function calculateWorldPosition(
  relativePosition: WorldPosition,
  referencePosition: WorldPosition
): WorldPosition {
  return {
    x: relativePosition.x + referencePosition.x,
    y: relativePosition.y + referencePosition.y,
    z: relativePosition.z + referencePosition.z,
  };
}
