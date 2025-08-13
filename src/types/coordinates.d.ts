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

/** Coordonnées hexagonales avec rayon */
export interface HexCoordinate {
  q: number;
  r: number;
  radius: number;
}

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