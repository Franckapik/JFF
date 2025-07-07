/**
 * Types de coordonnées standardisées (extraits de initialContext.ts)
 */

/** Format grid "x,z" pour clés Map */
export type GridCoordinate = string;

/** Position 3D Three.js */
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

/** Coordonnée tuile {x,z} */
export interface TileCoordinate {
  x: number;
  z: number;
}

/** Cible de mouvement (extrait de initialContext.ts) */
export interface MovementTarget {
  position: WorldPosition | null;
  coord: TileCoordinate | null;
}

/** Cible typée pour exploration/collecte (extrait de initialContext.ts) */
export interface TypedTarget {
  x: number;
  z: number;
  type: 'food' | 'debris' | 'special' | 'explore';
}

// Fonctions utilitaires de type uniquement
export const tileToGrid = (coord: TileCoordinate): GridCoordinate => `${coord.x},${coord.z}`;

export const gridToTile = (grid: GridCoordinate): TileCoordinate => {
  const [x, z] = grid.split(',').map(Number);
  return { x, z };
};

/** Valide qu'un objet respecte l'interface WorldPosition */
export const isValidWorldPosition = (position: any): position is WorldPosition => {
  return (
    position &&
    typeof position === 'object' &&
    typeof position.x === 'number' &&
    typeof position.y === 'number' &&
    typeof position.z === 'number' &&
    !isNaN(position.x) &&
    !isNaN(position.y) &&
    !isNaN(position.z)
  );
};

/** Valide qu'un objet respecte l'interface TileCoordinate */
export const isValidTileCoordinate = (coord: any): coord is TileCoordinate => {
  return (
    coord &&
    typeof coord === 'object' &&
    typeof coord.x === 'number' &&
    typeof coord.z === 'number' &&
    !isNaN(coord.x) &&
    !isNaN(coord.z)
  );
};
