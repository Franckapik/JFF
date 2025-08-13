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
 * - hexToGridCoord, gridToHexCoord
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
   * Convertit format lettre-numéro vers format x,z (ex: "B5" vers "1,5")
   * @param hexCoord - Coordonnée hex (ex: "B5")
   * @returns Coordonnée grille ou null si invalide
   */
  hexToGridCoord: (hexCoord: string): GridCoordinate | null => {
    if (hexCoord === null || hexCoord === undefined || hexCoord === '') return null;
    if (typeof hexCoord !== 'string') return null;
    
    // Check if it's already in grid format
    if (hexCoord.match(/^-?\d+,-?\d+$/)) return hexCoord as GridCoordinate;
    
    const match = hexCoord.match(/^([A-Za-z])(\d+)$/i);
    if (!match) return null;
    
    const letter = match[1].toUpperCase();
    const number = parseInt(match[2]);
    
    // Convert letter to number (A=0, B=1, etc.)
    const x = letter.charCodeAt(0) - 'A'.charCodeAt(0);
    
    return `${x},${number}` as GridCoordinate;
  },

  /**
   * Convertit format x,z vers format lettre-numéro (ex: "1,5" vers "B5")
   * @param gridCoord - Coordonnée grille (ex: "1,5")
   * @returns Coordonnée hex ou null si invalide
   */
  gridToHexCoord: (gridCoord: GridCoordinate): string | null => {
    if (!get().isValidGridCoord(gridCoord)) return null;
    
    const [x, z] = gridCoord.split(',').map(Number);
    
    // Convert number to letter (0=A, 1=B, etc.)
    if (x < 0 || x > 25) return null; // Only support A-Z
    
    const letter = String.fromCharCode('A'.charCodeAt(0) + x);
    
    return `${letter}${z}`;
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
    
    const distance = Math.sqrt(
      Math.pow(target.x - current.x, 2) + 
      Math.pow(target.z - current.z, 2)
    );
    
    return distance <= threshold;
  },

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

  /**
   * Normalise une coordonnée vers le format GridCoordinate
   * @param coord - Coordonnée à normaliser
   * @returns GridCoordinate normalisée ou null
   */
  normalizeCoordinate: (coord: GridCoordinate | string): GridCoordinate | null => {
    if (get().isValidGridCoord(coord)) {
      return coord as GridCoordinate;
    }
    
    if (typeof coord === 'string') {
      // Essayer de convertir depuis format hex
      return get().hexToGridCoord(coord);
    }
    
    return null;
  }
});

export default createTileCoordinateSlice;
