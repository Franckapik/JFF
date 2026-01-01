/**
 * Types de coordonnées unifiés (extrait de initialContext.ts)
 */

/** Coordonnées globales de type {x, y, z} */
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

/** Coordonnées grille en q,r (système hexagonal) */
export type GridCoordinate = `${number},${number}`;

/** Coordonnées hexagonales avec rayon */
export interface HexCoordinate {
  q: number;
  r: number;
  radius: number;
}

/** 
 * Coordonnées simple format ColRow: A1, B2, C3, ...
 * - Colonne: Lettres (A-Z, AA-AZ, BA-BZ, ...)
 * - Ligne: Chiffres (1, 2, 3, ...)
 * @example "A1", "B2", "AA5"
 */
export type ColRowCoordinate = string & { readonly __brand: 'ColRowCoordinate' };

/** Position unifiée combinant coordonnées monde et grille */
export interface WorldGridPosition {
  // Position 3D dans le monde
  x: number;
  y: number;
  z: number;
  // Coordonnée de grille correspondante
  coord: GridCoordinate;
}

/**
 * Type pour représenter un chemin comme une liste de positions de grille
 */
export type Path = GridCoordinate[];

/**
 * Type pour représenter un chemin comme une liste de positions ColRow
 */
export type ColRowPath = ColRowCoordinate[];

/**
 * Helper pour créer une ColRowCoordinate avec validation
 */
export function createColRowCoordinate(value: string): ColRowCoordinate {
  // Validation simple: format A1, AA5, etc.
  if (!/^[A-Z]+\d+$/.test(value)) {
    throw new Error(`Invalid ColRowCoordinate format: ${value}. Expected format like A1, B2, AA5`);
  }
  return value as ColRowCoordinate;
}

/**
 * Type guard pour vérifier si une valeur est une ColRowCoordinate valide
 */
export function isColRowCoordinate(value: unknown): value is ColRowCoordinate {
  return typeof value === 'string' && /^[A-Z]+\d+$/.test(value);
}