import { nextRandom, pathBetween, tileLevel, type Coord, type World } from "./world";

/** Pick one reproducible resource tile, keeping the routes from the two bases within one step. */
export function chooseTreasureCoord(world: World, bases: readonly [Coord, Coord], seed: number): Coord | null {
  const candidates = Object.values(world).filter(tile => tile.kind === "resource").map(tile => {
    const distances = bases.map(base => pathBetween(world, base, tile.coord).length - 1);
    return { coord: tile.coord, difference: Math.abs(distances[0] - distances[1]), nearest: Math.min(...distances),
      level: tileLevel(tile) };
  }).filter(tile => tile.nearest >= 0);
  if (!candidates.length) return null;
  const balanced = candidates.filter(tile => tile.difference <= 1 && tile.nearest >= 2);
  const pool = balanced.length ? balanced : candidates;
  const bestDifference = Math.min(...pool.map(tile => tile.difference));
  const bestLevel = Math.max(...pool.filter(tile => tile.difference === bestDifference).map(tile => tile.level));
  const best = pool.filter(tile => tile.difference === bestDifference && tile.level === bestLevel)
    .sort((a, b) => a.coord.localeCompare(b.coord));
  return best[Math.floor(nextRandom(seed ^ 0x7e45a9b1).value * best.length)].coord;
}
