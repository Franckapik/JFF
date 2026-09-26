import { findPath } from "../core/spatial/pathfinding";

import { addResources, emptyResources, type Resources } from "./resources";

export type Coord = `${number},${number}`;
export type BotId = "bot-0" | "bot-1";
export const BOT_IDS: BotId[] = ["bot-0", "bot-1"];
export type TileKind = "resource" | "empty" | "obstacle" | "danger" | "base" | "fuel" | "repair";
export interface WorldTile {
  coord: Coord;
  kind: TileKind;
  walkable: boolean;
  neighbors: Coord[];
  resources: Resources;
  owner: BotId | null;
}
export type World = Record<Coord, WorldTile>;

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
] as const;

export function axial(coord: Coord): [number, number] {
  const [column, row] = coord.split(",").map(Number);
  return [column, row];
}

export function hexDistance(from: Coord, to: Coord): number {
  const [fromColumn, fromRow] = axial(from);
  const [toColumn, toRow] = axial(to);
  const column = toColumn - fromColumn;
  const row = toRow - fromRow;
  return (Math.abs(column) + Math.abs(row) + Math.abs(column + row)) / 2;
}

export function worldPosition(coord: Coord): [number, number, number] {
  const [column, row] = axial(coord);
  return [Math.sqrt(3) * (column + row / 2), 0, 1.5 * row];
}

export function nextRandom(state: number): { state: number; value: number } {
  const next = (state + 0x6d2b79f5) >>> 0;
  let value = Math.imul(next ^ (next >>> 15), next | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return { state: next, value: ((value ^ (value >>> 14)) >>> 0) / 4294967296 };
}

export function pathBetween(world: World, from: Coord, to: Coord): Coord[] {
  return findPath(from, to, world);
}

export function reachableCoords(world: World, from: Coord): Coord[] {
  if (!world[from]?.walkable) return [];
  const queue: Coord[] = [from];
  const visited = new Set(queue);
  for (let head = 0; head < queue.length; head++) {
    for (const neighbor of world[queue[head]].neighbors) {
      if (world[neighbor]?.walkable && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return queue;
}

export function worldResources(world: World): Resources {
  return Object.values(world).reduce((total, tile) => addResources(total, tile.resources), emptyResources());
}

export function generateWorld(seed: number, radius = 3): World {
  if (!Number.isSafeInteger(seed) || !Number.isInteger(radius) || radius < 2 || radius > 8) throw new Error("Invalid map configuration");
  let randomState = seed >>> 0;
  const random = () => {
    const result = nextRandom(randomState);
    randomState = result.state;
    return result.value;
  };
  const world: World = {};
  for (let column = -radius; column <= radius; column++) {
    for (let row = -radius; row <= radius; row++) {
      const coord: Coord = `${column},${row}`;
      if (hexDistance("0,0", coord) > radius) continue;
      world[coord] = { coord, kind: "resource", walkable: true, neighbors: [], resources: emptyResources(), owner: null };
    }
  }
  for (const tile of Object.values(world)) {
    const [column, row] = axial(tile.coord);
    tile.neighbors = DIRECTIONS.map(([deltaColumn, deltaRow]): Coord => `${column + deltaColumn},${row + deltaRow}`).filter(
      coord => !!world[coord]
    );
  }
  const bases: Coord[] = [`${-radius},0`, `${radius},0`];
  bases.forEach((coord, index) => {
    world[coord].kind = "base";
    world[coord].owner = BOT_IDS[index];
  });
  for (const coord of ["-1,1", "1,-1"] as Coord[]) world[coord].kind = "fuel";
  for (const coord of ["-1,0", "1,0"] as Coord[]) world[coord].kind = "repair";
  const processed = new Set<Coord>();
  for (const tile of Object.values(world)) {
    if (processed.has(tile.coord) || tile.kind !== "resource") continue;
    const [column, row] = axial(tile.coord);
    const mirror: Coord = `${-column},${-row}`;
    processed.add(tile.coord);
    processed.add(mirror);
    const roll = random();
    const protectedTile = bases.some(base => hexDistance(base, tile.coord) <= 1);
    const kind: TileKind = protectedTile
      ? "resource"
      : roll < 0.12
        ? "obstacle"
        : roll < 0.2
          ? "danger"
          : roll < 0.3
            ? "empty"
            : "resource";
    const resources =
      kind === "resource"
        ? { food: 20 + Math.floor(random() * 81), debris: 80 + Math.floor(random() * 221), special: Math.floor(random() * 7) }
        : emptyResources();
    for (const coord of new Set([tile.coord, mirror])) {
      world[coord].kind = kind;
      world[coord].walkable = kind !== "obstacle";
      world[coord].resources = { ...resources };
    }
    if (
      kind === "obstacle" &&
      reachableCoords(world, bases[0]).length !== Object.values(world).filter(candidate => candidate.walkable).length
    ) {
      for (const coord of [tile.coord, mirror]) {
        world[coord].kind = "empty";
        world[coord].walkable = true;
      }
    }
  }
  return world;
}
