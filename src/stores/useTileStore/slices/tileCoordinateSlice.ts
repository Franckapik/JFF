/**
 * =========================================================================
 * TILE COORDINATE SLICE - Thin wrappers over core/spatial (TypeScript)
 * =========================================================================
 * 
 * Ce slice gère tous les aspects liés aux coordonnées des tuiles :
 * - Validation des coordonnées (grille et monde)
 * - Conversion entre formats (hex, grille, monde)
 * - Opérations sur les Vector3
 * - Calculs de distance et de cibles
 * 
 * ARCHITECTURE POST-MIGRATION:
 * - Logique pure déléguée à core/spatial
 * - Ce slice = wrappers qui injectent le state (spacing, radius)
 * - Préserve l'API existante pour compatibilité
 */

import { Vector3 } from "three";

// Import des fonctions pures depuis core/spatial
import {
  encodeHexCoord as coreEncodeHexCoord,
  gridToWorld as coreGridToWorld,
  hasReachedTarget as coreHasReachedTarget,
  isValidGridCoord as coreIsValidGridCoord,
  isValidWorldPosition as coreIsValidWorldPosition,
  worldToGrid as coreWorldToGrid,
} from '../../../core/spatial';

import type {
  GridCoordinate,
  WorldPosition
} from '../../../types/index.ts';
import type { TileCoordinateSliceActions } from '../../../types/stores.d.ts';

// =========================================================================
// SLICE FACTORY - COORDINATE UTILITIES (Wrappers over core/spatial)
// =========================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTileCoordinateSlice = (_set: unknown, get: () => any): TileCoordinateSliceActions => ({
  // =========================================================================
  // VALIDATION FUNCTIONS - Delegated to core/spatial
  // =========================================================================
  
  /**
   * Valide une coordonnée de grille
   * Wrapper over core/spatial/coordinates.isValidGridCoord
   */
  isValidGridCoord: (coord: unknown): coord is GridCoordinate => {
    return coreIsValidGridCoord(coord);
  },

  /**
   * Valide une position mondiale
   * Wrapper over core/spatial/coordinates.isValidWorldPosition
   */
  isValidWorldPosition: (position: unknown): position is WorldPosition => {
    return coreIsValidWorldPosition(position);
  },

  // =========================================================================
  // COORDINATE CONVERSION FUNCTIONS - Inject spacing from state
  // =========================================================================

  /**
   * Encode les coordonnées hexagonales q,r en coordonnée de grille
   * Wrapper over core/spatial/coordinates.encodeHexCoord
   */
  encodeHexCoord: (q: number, r: number, radius: number): GridCoordinate => {
    return coreEncodeHexCoord(q, r, { radius });
  },

  /**
   * Convertit une coordonnée de grille vers une position mondiale
   * Wrapper that injects spacing from store state
   */
  gridToWorld: (coord: GridCoordinate): WorldPosition => {
    const spacing = get().spacing ?? -0.2; // Inject state
    const worldPos = coreGridToWorld(coord, { spacing, defaultY: 0.5 });
    
    // Log pour debug des conversions avec fsmLogger si disponible
    if (typeof window !== 'undefined' && 'fsmLogger' in window && window.fsmLogger) {
      (window.fsmLogger as { mouvement: (msg: string) => void }).mouvement(
        `🔄 gridToWorld: ${coord} -> {x: ${worldPos.x}, y: ${worldPos.y}, z: ${worldPos.z}} (spacing: ${spacing})`
      );
    }
    
    return worldPos;
  },

  /**
   * Convertit une position mondiale vers une coordonnée de grille
   * Wrapper that injects spacing from store state
   */
  worldToGrid: (position: WorldPosition): GridCoordinate => {
    const spacing = get().spacing ?? -0.2; // Inject state
    return coreWorldToGrid(position, { spacing });
  },

  // =========================================================================
  // VECTOR3 OPERATIONS - R3F specific (kept as-is)
  // =========================================================================

  /**
   * Convertit une position vers un Vector3 Three.js
   */
  toVector3: (position: WorldPosition): Vector3 => {
    return new Vector3(position.x, position.y, position.z);
  },

  /**
   * Convertit un Vector3 Three.js vers une position
   */
  fromVector3: (vector: Vector3): WorldPosition => {
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z
    };
  },

  // =========================================================================
  // DISTANCE AND TARGET FUNCTIONS - Delegated to core/spatial
  // =========================================================================

  /**
   * Vérifie si une position a atteint sa cible
   * Wrapper over core/spatial/distance.hasReachedTarget
   */
  hasReachedTarget: (current: WorldPosition, target: WorldPosition, threshold: number = 0.1): boolean => {
    if (!coreIsValidWorldPosition(current) || !coreIsValidWorldPosition(target)) {
      return false;
    }
    
    return coreHasReachedTarget(current, target, { threshold, ignoreY: false });
  },

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

});

export default createTileCoordinateSlice;
