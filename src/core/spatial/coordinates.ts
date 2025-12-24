/**
 * ============================================================================
 * COORDINATE UTILITIES - Pure Functions
 * ============================================================================
 * 
 * Fonctions pures pour la validation et conversion de coordonnées.
 * Extraites depuis tileCoordinateSlice pour être testables sans Zustand.
 * 
 * @module core/spatial/coordinates
 * @pure All functions are pure (no side effects)
 * @author Spatial Migration Team
 * @version 1.0.0
 */

import type { GridCoordinate, WorldPosition } from '../../types/coordinates';
import type { CoordinateConversionConfig, HexCoordEncodeOptions } from '../../types/spatial';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Valide une coordonnée de grille
 * Format attendu: "x,z" où x et z sont des nombres (possiblement négatifs)
 * 
 * @pure
 * @param coord - Coordonnée à valider
 * @returns True si la coordonnée est valide
 * 
 * @example
 * isValidGridCoord("5,10")  // true
 * isValidGridCoord("-3,2")  // true
 * isValidGridCoord("5")     // false
 * isValidGridCoord(null)    // false
 */
export function isValidGridCoord(coord: unknown): coord is GridCoordinate {
  if (coord === null || coord === undefined) return false;
  if (typeof coord !== 'string') return false;
  return /^-?\d+,-?\d+$/.test(coord);
}

/**
 * Valide une position mondiale
 * Doit avoir les propriétés x, y, z de type number (non NaN)
 * 
 * @pure
 * @param position - Position à valider
 * @returns True si la position est valide
 * 
 * @example
 * isValidWorldPosition({ x: 1, y: 0.5, z: 3 })  // true
 * isValidWorldPosition({ x: NaN, y: 0, z: 0 })  // false
 * isValidWorldPosition({ x: 1, z: 3 })          // false (manque y)
 */
export function isValidWorldPosition(position: unknown): position is WorldPosition {
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
}

// ============================================================================
// COORDINATE CONVERSION FUNCTIONS
// ============================================================================

/**
 * Encode les coordonnées hexagonales q,r en coordonnée de grille
 * Utilisé lors de la génération de grilles hexagonales
 * 
 * @pure
 * @param q - Coordonnée q du système hexagonal
 * @param r - Coordonnée r du système hexagonal
 * @param options - Options d'encodage (radius)
 * @returns Coordonnée encodée au format GridCoordinate
 * 
 * @example
 * encodeHexCoord(0, 0, { radius: 5 })   // "5,5"
 * encodeHexCoord(-2, 3, { radius: 5 })  // "3,8"
 */
export function encodeHexCoord(
  q: number,
  r: number,
  options: HexCoordEncodeOptions
): GridCoordinate {
  const { radius } = options;
  return `${q + radius},${r + radius}` as GridCoordinate;
}

/**
 * Convertit une coordonnée de grille vers une position mondiale
 * Applique l'espacement entre tuiles pour obtenir la position 3D
 * 
 * @pure
 * @param coord - Coordonnée de grille sous forme "x,z"
 * @param config - Configuration de conversion (spacing, defaultY)
 * @returns Position mondiale {x, y, z}
 * 
 * @example
 * gridToWorld("5,10", { spacing: -0.2, defaultY: 0.5 })
 * // { x: 4, y: 0.5, z: 8 }
 */
export function gridToWorld(
  coord: GridCoordinate,
  config: CoordinateConversionConfig = {}
): WorldPosition {
  const { spacing = -0.2, defaultY = 0.5 } = config;

  // Parsing de la GridCoordinate "x,z"
  const parts = coord.split(',').map(Number);
  const x = parts[0];
  const z = parts[1];

  return {
    x: x * (1 + spacing),
    y: defaultY,
    z: z * (1 + spacing),
  };
}

/**
 * Convertit une position mondiale vers une coordonnée de grille
 * Arrondit aux coordonnées de grille les plus proches
 * 
 * @pure
 * @param position - Position mondiale {x, y, z}
 * @param config - Configuration de conversion (spacing)
 * @returns Coordonnée de grille "x,z"
 * 
 * @example
 * worldToGrid({ x: 4.1, y: 0.5, z: 8.2 }, { spacing: -0.2 })
 * // "5,10"
 */
export function worldToGrid(
  position: WorldPosition,
  config: CoordinateConversionConfig = {}
): GridCoordinate {
  const { spacing = -0.2 } = config;

  const x = Math.round(position.x / (1 + spacing));
  const z = Math.round(position.z / (1 + spacing));

  return `${x},${z}` as GridCoordinate;
}

/**
 * Parse une GridCoordinate en tuple [x, z]
 * Utile pour les opérations nécessitant les valeurs séparées
 * 
 * @pure
 * @param coord - Coordonnée de grille
 * @returns Tuple [x, z]
 * 
 * @example
 * parseGridCoord("5,10")  // [5, 10]
 * parseGridCoord("-3,2")  // [-3, 2]
 */
export function parseGridCoord(coord: GridCoordinate): [number, number] {
  const parts = coord.split(',').map(Number);
  return [parts[0], parts[1]];
}

/**
 * Crée une GridCoordinate à partir de valeurs x et z
 * 
 * @pure
 * @param x - Coordonnée x de la grille
 * @param z - Coordonnée z de la grille
 * @returns Coordonnée de grille formatée
 * 
 * @example
 * createGridCoord(5, 10)   // "5,10"
 * createGridCoord(-3, 2)   // "-3,2"
 */
export function createGridCoord(x: number, z: number): GridCoordinate {
  return `${x},${z}` as GridCoordinate;
}
