import { TERRAIN_BASE_TOP, TERRAIN_LEVEL_STEP, tileSurfaceHeight, type WorldTile } from './world';

export const TIDE_LOW = -0.12;
export const TIDE_HIGH = TERRAIN_BASE_TOP + 2 * TERRAIN_LEVEL_STEP + 0.08;
export const TIDE_RISE_DURATION = 180_000;

export function tideLevel(elapsed: number): number {
  return TIDE_LOW + (TIDE_HIGH - TIDE_LOW) * Math.min(1, Math.max(0, elapsed) / TIDE_RISE_DURATION);
}

export function timeUntilFlood(tile: WorldTile, elapsed: number): number {
  const surface = tileSurfaceHeight(tile);
  if (surface > TIDE_HIGH) return Infinity;
  const at = (surface - TIDE_LOW) / (TIDE_HIGH - TIDE_LOW) * TIDE_RISE_DURATION;
  return Math.max(0, at - elapsed);
}
