import type { Bot } from "./model";
import { resourceTotal } from "./resources";
import { axial, hexDistance, type Coord, type World } from "./world";

function roundedHex(column: number, row: number): Coord {
  let q = Math.round(column);
  let r = Math.round(row);
  let s = Math.round(-column - row);
  const qError = Math.abs(q - column);
  const rError = Math.abs(r - row);
  const sError = Math.abs(s + column + row);
  if (qError > rError && qError > sError) q = -r - s;
  else if (rError > sError) r = -q - s;
  else s = -q - r;
  return `${q},${r}`;
}

export function hasLineOfSight(world: World, from: Coord, to: Coord): boolean {
  if (!world[from] || !world[to]) return false;
  const distance = hexDistance(from, to);
  const [fromColumn, fromRow] = axial(from);
  const [toColumn, toRow] = axial(to);
  for (let step = 1; step < distance; step++) {
    const fraction = step / distance;
    const coord = roundedHex(
      fromColumn + (toColumn - fromColumn) * fraction,
      fromRow + (toRow - fromRow) * fraction
    );
    if (world[coord]?.kind === "obstacle") return false;
  }
  return true;
}

export function activeCoords(world: World, ship: Pick<Bot, "coord" | "radius">): Coord[] {
  return Object.values(world)
    .filter(tile => hexDistance(ship.coord, tile.coord) <= ship.radius && hasLineOfSight(world, ship.coord, tile.coord))
    .map(tile => tile.coord);
}

export function rememberTerrain(explored: Coord[], visible: Coord[]): Coord[] {
  return [...new Set([...explored, ...visible])].sort();
}

export function resourceMarkerCoords(world: World, current: Iterable<Coord>, scanned: Iterable<Coord>): Coord[] {
  const visibleCoords = new Set(current);
  const scannedCoords = new Set(scanned);
  return Object.values(world)
    .filter(tile => tile.kind === "resource" && resourceTotal(tile.resources) > 0 && visibleCoords.has(tile.coord) && scannedCoords.has(tile.coord))
    .map(tile => tile.coord);
}
