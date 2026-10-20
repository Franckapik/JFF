import { addResources, emptyResources, type Resources } from "./resources";
import { MAX_MAP_RADIUS, MIN_MAP_RADIUS, RULES } from "./rules";

export type Coord = `${number},${number}`;
export type BotId = "bot-0" | "bot-1";
export const BOT_IDS: BotId[] = ["bot-0", "bot-1"];
export type TileKind = "resource" | "plain" | "empty" | "obstacle" | "danger" | "base" | "fuel" | "repair" | "ramp" | "tower";
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

export function tileLevel(tile: Pick<WorldTile, "kind">): number {
  switch (tile.kind) {
    case "empty": return 0;
    case "obstacle":
    case "ramp": return 2;
    case "tower": return 3;
    default: return 1;
  }
}

export function canStep(world: World, from: Coord, to: Coord): boolean {
  const origin = world[from];
  const destination = world[to];
  return !!origin?.walkable && origin.kind !== "empty" && !!destination?.walkable && destination.kind !== "empty" && origin.neighbors.includes(to) &&
    Math.abs(tileLevel(origin) - tileLevel(destination)) <= 1;
}

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

export function worldRadius(world: World): number {
  return Math.max(0, ...Object.keys(world).map(coord => hexDistance("0,0", coord as Coord)));
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
  if (!world[from]?.walkable || world[from].kind === "empty" || !world[to]?.walkable || world[to].kind === "empty") return [];
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
      if (canStep(world, current, neighbor) && !parents.has(neighbor)) {
        parents.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }
  return [];
}

export function reachableCoords(world: World, from: Coord): Coord[] {
  if (!world[from]?.walkable || world[from].kind === "empty") return [];
  const queue: Coord[] = [from];
  const visited = new Set(queue);
  for (let head = 0; head < queue.length; head++) {
    for (const neighbor of world[queue[head]].neighbors) {
      if (canStep(world, queue[head], neighbor) && !visited.has(neighbor)) {
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
      placed[mirror] = { ...placed[mirror], kind: "plain", walkable: true, resources: emptyResources() };
    }
  }
  placed[fuel] = { ...placed[fuel], kind: "fuel", walkable: true, resources: emptyResources() };
  placed[repair] = { ...placed[repair], kind: "repair", walkable: true, resources: emptyResources() };
  return placed;
}

function validLand(world: World, bases: Coord[], radius: number): boolean {
  if (reachableCoords(world, bases[0]).length !== Object.values(world).filter(tile => tile.walkable).length) return false;
  return (["fuel", "repair"] as const).every(kind => {
    const station = Object.values(world).find(tile => tile.kind === kind);
    if (!station) return false;
    const distances = bases.map(base => pathBetween(world, base, station.coord).length - 1);
    return distances.every(distance => distance >= 0) && Math.abs(distances[0] - distances[1]) <= 1 &&
      Math.max(...distances) <= radius + 2;
  });
}

export function generateWorld(seed: number, radius: number = RULES.mapRadius): World {
  if (!Number.isSafeInteger(seed) || !Number.isInteger(radius) || radius < MIN_MAP_RADIUS || radius > MAX_MAP_RADIUS) throw new Error("Invalid map configuration");
  return generateWorldAttempt(seed, radius, 0);
}

function generateWorldAttempt(seed: number, radius: number, attempt: number): World {
  let randomState = ((seed >>> 0) + Math.imul(attempt, 0x9e3779b9)) >>> 0;
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
  world["0,0"].kind = "tower";
  world["0,1"].kind = "ramp";
  world["0,-1"].kind = "ramp";
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
          ? "plain"
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
        world[coord].kind = "plain";
        world[coord].walkable = true;
      }
    }
  }
  const candidates = Object.values(world).filter(tile => {
    const distances = bases.map(base => hexDistance(base, tile.coord));
    return tile.kind !== "tower" && tile.kind !== "ramp" && Math.min(...distances) > 1 &&
      Math.max(...distances) <= radius + 1 && Math.abs(distances[0] - distances[1]) <= 1;
  });
  const layouts: World[] = [];
  for (const fuel of candidates.filter(tile => hexDistance(bases[0], tile.coord) === hexDistance(bases[1], tile.coord))) {
    for (const repair of candidates) {
      if (repair.coord === fuel.coord) continue;
      const placed = placeServices(world, fuel.coord, repair.coord);
      const serviceDistances = [fuel.coord, repair.coord].map(coord =>
        bases.map(base => pathBetween(placed, base, coord).length - 1)
      );
      if (!serviceDistances.every(distances => distances.every(distance => distance >= 0) && Math.abs(distances[0] - distances[1]) <= 1)) continue;
      const longestPath = Math.max(...serviceDistances.flat());
      if (longestPath <= radius + 2) layouts.push(placed);
    }
  }
  if (!layouts.length) {
    if (attempt < 32) return generateWorldAttempt(seed, radius, attempt + 1);
    throw new Error("No balanced service placement");
  }
  const selected = layouts[Math.floor(random() * layouts.length)];
  const specialPairs = Object.values(selected)
    .filter(tile => {
      const [column, row] = axial(tile.coord);
      const mirror: Coord = `${-column},${-row}`;
      return tile.kind === "resource" && tile.coord < mirror && selected[mirror]?.kind === "resource";
    })
    .sort((left, right) => (specialPriority.get(right.coord) ?? 0) - (specialPriority.get(left.coord) ?? 0))
    .slice(0, RULES.specialPairCount);
  if (specialPairs.length < RULES.specialPairCount) {
    const supplemental = Object.values(selected)
      .filter(tile => {
        const [column, row] = axial(tile.coord);
        const mirror: Coord = `${-column},${-row}`;
        return tile.coord < mirror && selected[mirror]?.kind === tile.kind &&
          !["resource", "base", "fuel", "repair", "ramp", "tower"].includes(tile.kind);
      })
      .map(tile => ({ tile, priority: random() }))
      .sort((left, right) => right.priority - left.priority)
      .slice(0, RULES.specialPairCount - specialPairs.length);
    if (specialPairs.length + supplemental.length < RULES.specialPairCount) {
      if (attempt < 32) return generateWorldAttempt(seed, radius, attempt + 1);
      throw new Error("Insufficient special resource pairs");
    }
    for (const { tile } of supplemental) {
      const [column, row] = axial(tile.coord);
      const mirror: Coord = `${-column},${-row}`;
      const resources = {
        food: 20 + Math.floor(random() * 81),
        debris: RULES.debrisMin + Math.floor(random() * (RULES.debrisMax - RULES.debrisMin + 1)),
        special: 0,
      };
      for (const coord of [tile.coord, mirror]) {
        selected[coord].kind = "resource";
        selected[coord].walkable = true;
        selected[coord].resources = { ...resources };
      }
      specialPairs.push(tile);
    }
  }
  for (const tile of specialPairs) {
    const [column, row] = axial(tile.coord);
    const mirror: Coord = `${-column},${-row}`;
    selected[tile.coord].resources.special = 1;
    selected[mirror].resources.special = 1;
  }
  const coastPriority = new Map<Coord, number>();
  for (const tile of Object.values(selected)) coastPriority.set(tile.coord, random());
  const carve = (ring: number, limit: number) => {
    let placed = 0;
    while (placed < limit) {
      const candidates = Object.values(selected).filter(tile => {
        const [q, r] = axial(tile.coord);
        const mirror: Coord = `${-q},${-r}`;
        return tile.coord < mirror && hexDistance("0,0", tile.coord) === ring &&
          tile.kind === selected[mirror]?.kind && !["base", "fuel", "repair", "ramp", "tower", "empty"].includes(tile.kind) &&
          tile.resources.special === 0 && bases.every(base => hexDistance(base, tile.coord) > 1 && hexDistance(base, mirror) > 1) &&
          (ring === radius || tile.neighbors.some(neighbor => selected[neighbor].kind === "empty"));
      }).sort((left, right) => {
        const score = (tile: WorldTile) => (coastPriority.get(tile.coord) ?? 0) +
          tile.neighbors.filter(neighbor => selected[neighbor].kind === "empty").length * 0.7 -
          (tile.kind === "resource" ? 2 : tile.kind === "danger" ? 0.3 : 0);
        return score(right) - score(left);
      });
      let accepted = false;
      for (const tile of candidates) {
        const [q, r] = axial(tile.coord);
        const mirror: Coord = `${-q},${-r}`;
        const former = [selected[tile.coord], selected[mirror]].map(value => ({ ...value }));
        for (const coord of [tile.coord, mirror]) {
          selected[coord] = { ...selected[coord], kind: "empty", walkable: false, resources: emptyResources() };
        }
        if (validLand(selected, bases, radius)) { accepted = true; placed++; break; }
        selected[tile.coord] = former[0];
        selected[mirror] = former[1];
      }
      if (!accepted) break;
    }
    return placed;
  };
  const outerCoast = carve(radius, Math.max(1, Math.round(radius * 0.9)));
  if (radius >= 5) carve(radius - 1, 1);
  if (!outerCoast || !validLand(selected, bases, radius)) {
    if (attempt < 32) return generateWorldAttempt(seed, radius, attempt + 1);
    throw new Error("No connected balanced coastline");
  }
  return selected;
}
