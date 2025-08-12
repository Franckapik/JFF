/**
 * Types de coordonnées unifiés (extrait de initialContext.ts)
 */

/** Coordonnées globales de type {x, y, z} */
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

/** Coordonnées grille en x,z */
export type GridCoordinate = `${number},${number}`;