import { axial, hexDistance, worldPosition, type Coord } from './world';

// Presentation-only relief. The shared game rules still use a flat hex graph.
export const TERRAIN_BOTTOM = -0.22;
export const TERRAIN_OBSTACLE_RISE = 0.24;

export function terrainLevel(coord: Coord): number {
  const [q, r] = axial(coord);
  const ring = hexDistance('0,0', coord);
  if (ring === 0) return 3;
  const variation = (Math.abs(q * 7 + r * 11) + Math.abs(q * 3 - r * 5)) % 2;
  if (ring === 1) return 1 + variation;
  if (ring === 2) return variation;
  if (r === 0 && Math.abs(q) === 3) return 1;
  return variation;
}

export function terrainDeckHeight(coord: Coord): number {
  return 0.08 + terrainLevel(coord) * 0.31;
}

export function terrainPosition(coord: Coord): [number, number, number] {
  const [x, , z] = worldPosition(coord);
  return [x, terrainDeckHeight(coord), z];
}
