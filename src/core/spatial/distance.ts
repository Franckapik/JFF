/**
 * ============================================================================
 * DISTANCE UTILITIES - Pure Functions
 * ============================================================================
 * 
 * Fonctions pures pour les calculs de distance entre positions.
 * Extraites depuis tilePathSlice et trackers pour être testables sans dépendances.
 * 
 * @module core/spatial/distance
 * @pure All functions are pure (no side effects)
 * @author Spatial Migration Team
 * @version 1.0.0
 */

import type { WorldPosition } from '../../types/coordinates';
import type { DistanceOptions, ReachedTargetOptions } from '../../types/spatial';

// ============================================================================
// DISTANCE CALCULATIONS
// ============================================================================

/**
 * Calcule la distance euclidienne entre deux positions 3D
 * Formule: sqrt((x2-x1)² + (y2-y1)² + (z2-z1)²)
 * 
 * @pure
 * @param posA - Première position
 * @param posB - Deuxième position
 * @param options - Options de calcul
 * @returns Distance euclidienne
 * 
 * @example
 * const distance = calculateDistance(
 *   { x: 0, y: 0, z: 0 },
 *   { x: 3, y: 4, z: 0 }
 * );
 * // distance = 5
 */
export function calculateDistance(
  posA: WorldPosition,
  posB: WorldPosition,
  options: DistanceOptions = {}
): number {
  const { type = 'euclidean' } = options;

  const dx = posB.x - posA.x;
  const dy = posB.y - posA.y;
  const dz = posB.z - posA.z;

  switch (type) {
    case 'euclidean':
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    case 'manhattan':
      return Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
    
    case 'chebyshev':
      return Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
    
    default:
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

/**
 * Vérifie si une position a atteint sa cible (dans un seuil donné)
 * Utilisé pour détecter l'arrivée du ship/drone à une tuile
 * 
 * @pure
 * @param current - Position actuelle
 * @param target - Position cible
 * @param options - Options de détection (threshold, ignoreY)
 * @returns True si la cible est atteinte
 * 
 * @example
 * const reached = hasReachedTarget(
 *   { x: 5.02, y: 0.5, z: 3.01 },
 *   { x: 5, y: 0.5, z: 3 },
 *   { threshold: 0.05, ignoreY: true }
 * );
 * // reached = true
 */
export function hasReachedTarget(
  current: WorldPosition,
  target: WorldPosition,
  options: ReachedTargetOptions = {}
): boolean {
  const { threshold = 0.05, ignoreY = false } = options;

  const dx = target.x - current.x;
  const dy = ignoreY ? 0 : target.y - current.y;
  const dz = target.z - current.z;

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return distance < threshold;
}

/**
 * Calcule le vecteur directionnel normalisé entre deux positions
 * Utile pour l'interpolation et le déplacement
 * 
 * @pure
 * @param from - Position de départ
 * @param to - Position d'arrivée
 * @returns Vecteur directionnel normalisé (longueur = 1)
 * 
 * @example
 * const direction = getDirectionVector(
 *   { x: 0, y: 0, z: 0 },
 *   { x: 3, y: 4, z: 0 }
 * );
 * // direction ≈ { x: 0.6, y: 0.8, z: 0 }
 */
export function getDirectionVector(
  from: WorldPosition,
  to: WorldPosition
): WorldPosition {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;

  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Éviter division par zéro
  if (length === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  return {
    x: dx / length,
    y: dy / length,
    z: dz / length,
  };
}

/**
 * Calcule la distance en 2D (ignore Y) entre deux positions
 * Utilisé pour la détection de proximité sur le plan horizontal
 * 
 * @pure
 * @param posA - Première position
 * @param posB - Deuxième position
 * @returns Distance euclidienne en 2D (plan XZ)
 * 
 * @example
 * const distance2D = calculateDistance2D(
 *   { x: 0, y: 10, z: 0 },
 *   { x: 3, y: 5, z: 4 }
 * );
 * // distance2D = 5 (Y ignored)
 */
export function calculateDistance2D(
  posA: WorldPosition,
  posB: WorldPosition
): number {
  const dx = posB.x - posA.x;
  const dz = posB.z - posA.z;
  return Math.sqrt(dx * dx + dz * dz);
}
