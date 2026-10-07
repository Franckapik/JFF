import { addResources, emptyResources, type Resources } from "./resources";
import { RULES } from "./rules";

export type Coord = `${number},${number}`;
export type BotId = "bot-0" | "bot-1";
export const BOT_IDS: BotId[] = ["bot-0", "bot-1"];
export type TileKind = "resource" | "empty" | "obstacle" | "danger" | "base" | "fuel" | "repair";
export interface Mine {
  owner: BotId;
  state: "arming" | "armed";
  armsAt: number;
}
export interface WorldTile {
  coord: Coord;
  kind: TileKind;
  walkable: boolean;
  neighbors: Coord[];
  resources: Resources;
  owner: BotId | null;
  mine?: Mine;
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

export function hexLine(from: Coord, to: Coord): Coord[] {
  const distance = hexDistance(from, to);
  if (distance === 0) return [from];
  const [fromColumn, fromRow] = axial(from);
  const [toColumn, toRow] = axial(to);
  return Array.from({ length: distance + 1 }, (_, step) => {
    const fraction = step / distance;
    const column = fromColumn + (toColumn - fromColumn) * fraction;
    const row = fromRow + (toRow - fromRow) * fraction;
    const cube = -column - row;
    let q = Math.round(column);
    let r = Math.round(row);
    const s = Math.round(cube);
    const errors = [Math.abs(q - column), Math.abs(r - row), Math.abs(s - cube)];
    if (errors[0] > errors[1] && errors[0] > errors[2]) q = -r - s;
    else if (errors[1] > errors[2]) r = -q - s;
    return `${q},${r}` as Coord;
  });
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
  if (!world[from]?.walkable || !world[to]?.walkable) return [];
  const queue: Coord[] = [from];
  const parents = new Map<Coord, Coord | null>([[from, null]]);
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (current === to) {
      const path: Coord[] = [];
      let cursor: Coord | null = current;
      while (cursor !== null) {
        path.push(cursor);
        cursor = parents.get(cursor) ?? null;
      }
      return path.reverse();
    }
    for (const neighbor of world[current].neighbors) {
      if (world[neighbor]?.walkable && !parents.has(neighbor)) {
        parents.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }
  return [];
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

function placeServices(world: World, fuel: Coord, repair: Coord): World {
  const placed: World = Object.fromEntries(
    Object.entries(world).map(([coord, tile]) => [coord, { ...tile }])
  );
  for (const coord of [fuel, repair]) {
    const [column, row] = axial(coord);
    const mirror: Coord = `${-column},${-row}`;
    if (mirror !== fuel && mirror !== repair) {
      placed[mirror] = { ...placed[mirror], kind: "empty", walkable: true, resources: emptyResources() };
    }
  }
  placed[fuel] = { ...placed[fuel], kind: "fuel", walkable: true, resources: emptyResources() };
  placed[repair] = { ...placed[repair], kind: "repair", walkable: true, resources: emptyResources() };
  return placed;
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
  const processed = new Set<Coord>();
  const specialPriority = new Map<Coord, number>();
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
    const guaranteedDebris = tile.coord === `${-radius + 1},0` || mirror === `${-radius + 1},0`;
    let resources = emptyResources();
    if (kind === "resource") {
      const foodRoll = random();
      const debrisRoll = random();
      const specialRoll = random();
      specialPriority.set(tile.coord, specialRoll);
      specialPriority.set(mirror, specialRoll);
      resources = {
        food: 20 + Math.floor(foodRoll * 81),
        debris: guaranteedDebris
          ? RULES.debrisMin + Math.floor(debrisRoll * (RULES.debrisMax - RULES.debrisMin + 1))
          : debrisRoll < RULES.debrisTileChance
            ? RULES.debrisMin + Math.floor(debrisRoll / RULES.debrisTileChance * (RULES.debrisMax - RULES.debrisMin + 1))
            : 0,
        special: 0,
      };
    }
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
  const candidates = Object.values(world).filter(tile => {
    const distances = bases.map(base => hexDistance(base, tile.coord));
    return Math.min(...distances) > 1 && Math.max(...distances) <= radius + 1 && Math.abs(distances[0] - distances[1]) <= 1;
  });
  const layouts: World[] = [];
  for (const fuel of candidates.filter(tile => hexDistance(bases[0], tile.coord) === hexDistance(bases[1], tile.coord))) {
    for (const repair of candidates) {
      if (repair.coord === fuel.coord) continue;
      const placed = placeServices(world, fuel.coord, repair.coord);
      const fair = [fuel.coord, repair.coord].every(coord => {
        const distances = bases.map(base => pathBetween(placed, base, coord).length - 1);
        return distances.every(distance => distance >= 0 && distance <= radius + 2) && Math.abs(distances[0] - distances[1]) <= 1;
      });
      if (fair) layouts.push(placed);
    }
  }
  if (!layouts.length) throw new Error("No balanced service placement");
  const selected = layouts[Math.floor(random() * layouts.length)];
  const specialPairs = Object.values(selected)
    .filter(tile => {
      const [column, row] = axial(tile.coord);
      const mirror: Coord = `${-column},${-row}`;
      return tile.kind === "resource" && tile.coord < mirror && selected[mirror]?.kind === "resource";
    })
    .sort((left, right) => (specialPriority.get(right.coord) ?? 0) - (specialPriority.get(left.coord) ?? 0))
    .slice(0, RULES.specialPairCount);
  for (const tile of specialPairs) {
    const [column, row] = axial(tile.coord);
    const mirror: Coord = `${-column},${-row}`;
    selected[tile.coord].resources.special = 1;
    selected[mirror].resources.special = 1;
  }
  return selected;
}
