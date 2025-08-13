/**
 * =========================================================================
 * TILE COORDINATE SLICE - Gestion centralisée des systèmes de coordonnées (TypeScript)
 * =========================================================================
 * 
 * Ce slice gère tous les aspects liés aux coordonnées des tuiles :
 * - Validation des coordonnées (grille et monde)
 * - Conversion entre formats (hex, grille, monde)
 * - Opérations sur les Vector3
 * - Calculs de distance et de cibles
 * 
 * Fonctionnalités migrées depuis utils/coordinateSystem.js :
 * - isValidGridCoord, isValidWorldPosition
 * - gridToWorld, worldToGrid
 * - toVector3, fromVector3
 * - hasReachedTarget
 */

import { Vector3 } from "three";

import type {
  GridCoordinate,
  WorldPosition
} from '../../../types/index.ts';
import type { TileCoordinateSliceActions } from '../../../types/stores.d.ts';

// =========================================================================
// SLICE FACTORY - COORDINATE UTILITIES
// =========================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTileCoordinateSlice = (_set: unknown, get: () => any): TileCoordinateSliceActions => ({
  // =========================================================================
  // VALIDATION FUNCTIONS
  // =========================================================================
  
  /**
   * Valide une coordonnée de grille
   * @param coord - Coordonnée au format "x,z"
   * @returns True si valide
   */
  isValidGridCoord: (coord: unknown): coord is GridCoordinate => {
    if (coord === null || coord === undefined) return false;
    if (typeof coord !== 'string') return false;
    return /^-?\d+,-?\d+$/.test(coord);
  },

  /**
   * Valide une position mondiale
   * @param position - Position avec propriétés x, y, z
   * @returns True si valide
   */
  isValidWorldPosition: (position: unknown): position is WorldPosition => {
    if (!position || typeof position !== 'object' || Array.isArray(position)) return false;
    return (
      'x' in position &&
      'y' in position &&
      'z' in position &&
      typeof position.x === 'number' &&
      typeof position.y === 'number' &&
      typeof position.z === 'number' &&
      !isNaN(position.x) &&
      !isNaN(position.y) &&
      !isNaN(position.z)
    );
  },

  // =========================================================================
  // COORDINATE CONVERSION FUNCTIONS
  // =========================================================================

  /**
   * Encode les coordonnées hexagonales q,r en coordonnée de grille
   * Migré depuis tileGenerationSlice.ts pour centraliser les coordonnées
   * @param q - Coordonnée q du système hexagonal
   * @param r - Coordonnée r du système hexagonal  
   * @param radius - Rayon de la grille hexagonale
   * @returns Coordonnée encodée au format GridCoordinate
   */
  encodeHexCoord: (q: number, r: number, radius: number): GridCoordinate => {
    return `${q + radius},${r + radius}` as GridCoordinate;
  },

  /**
   * Convertit une coordonnée de grille vers une position mondiale
   * @param coord - Coordonnée de grille sous forme "x,z"
   * @returns Position mondiale {x, y, z}
   */
  gridToWorld: (coord: GridCoordinate): WorldPosition => {
    const spacing = get().spacing || 0.1;
    
    // Parsing de la GridCoordinate "x,z"
    const parts = coord.split(',').map(Number);
    const x = parts[0];
    const z = parts[1];
    
    const worldPos = {
      x: x * (1 + spacing),
      y: 0.5, // Hauteur standard des tuiles
      z: z * (1 + spacing)
    };
    
    // Log pour debug des conversions avec fsmLogger si disponible
    if (typeof window !== 'undefined' && 'fsmLogger' in window && window.fsmLogger) {
      (window.fsmLogger as { mouvement: (msg: string) => void }).mouvement(`🔄 gridToWorld: ${coord} -> {x: ${worldPos.x}, y: ${worldPos.y}, z: ${worldPos.z}} (spacing: ${spacing})`);
    }
    
    return worldPos;
  },

  /**
   * Convertit une position mondiale vers une coordonnée de grille
   * @param position - Position mondiale {x, y, z}
   * @returns Coordonnée de grille "x,z"
   */
  worldToGrid: (position: WorldPosition): GridCoordinate => {
    const spacing = get().spacing || 0.1;
    
    const x = Math.round(position.x / (1 + spacing));
    const z = Math.round(position.z / (1 + spacing));
    
    return `${x},${z}`;
  },

  // =========================================================================
  // VECTOR3 OPERATIONS
  // =========================================================================

  /**
   * Convertit une position vers un Vector3 Three.js
   * @param position - Position {x, y, z}
   * @returns Vector3 Three.js
   */
  toVector3: (position: WorldPosition): Vector3 => {
    return new Vector3(position.x, position.y, position.z);
  },

  /**
   * Convertit un Vector3 Three.js vers une position
   * @param vector - Vector3 Three.js
   * @returns Position {x, y, z}
   */
  fromVector3: (vector: Vector3): WorldPosition => {
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z
    };
  },

  // =========================================================================
  // DISTANCE AND TARGET FUNCTIONS
  // =========================================================================

  /**
   * Vérifie si une position a atteint sa cible
   * @param current - Position actuelle
   * @param target - Position cible
   * @param threshold - Seuil de distance (défaut: 0.1)
   * @returns True si la cible est atteinte
   */
  hasReachedTarget: (current: WorldPosition, target: WorldPosition, threshold: number = 0.1): boolean => {
    if (!get().isValidWorldPosition(current) || !get().isValidWorldPosition(target)) {
      return false;
    }
    
    const distance = get().calculateDistance(current, target);
    
    return distance <= threshold;
  },

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

});

export default createTileCoordinateSlice;
