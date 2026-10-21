import { tileSurfaceHeight, worldPosition, type Coord, type World } from './world';

export const TERRAIN_BOTTOM = -0.22;
export { TERRAIN_BASE_TOP, TERRAIN_LEVEL_STEP } from './world';

export function terrainDeckHeight(world: World, coord: Coord): number {
  return tileSurfaceHeight(world[coord]);
}

export function terrainPosition(world: World, coord: Coord): [number, number, number] {
  const [x, , z] = worldPosition(coord);
  return [x, terrainDeckHeight(world, coord), z];
}
