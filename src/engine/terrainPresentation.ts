import { tileLevel, worldPosition, type Coord, type World } from './world';

export const TERRAIN_BOTTOM = -0.22;
export const TERRAIN_BASE_TOP = 0.08;
export const TERRAIN_LEVEL_STEP = 0.31;

export function terrainDeckHeight(world: World, coord: Coord): number {
  return TERRAIN_BASE_TOP + tileLevel(world[coord]) * TERRAIN_LEVEL_STEP;
}

export function terrainPosition(world: World, coord: Coord): [number, number, number] {
  const [x, , z] = worldPosition(coord);
  return [x, terrainDeckHeight(world, coord), z];
}
