import { addResources, emptyResources, type Resources } from "./resources";
import { MAX_MAP_RADIUS, MIN_MAP_RADIUS, RULES } from "./rules";

export type Coord = `${number},${number}`;
export type BotId = "bot-0" | "bot-1";
export const BOT_IDS: BotId[] = ["bot-0", "bot-1"];
export type TileKind = "resource" | "treasure" | "plain" | "empty" | "obstacle" | "danger" | "base" | "fuel" | "repair" | "ramp" | "tower";
export interface Mine {
  owner: BotId;
  state: "arming" | "armed";
  armsAt: number;
}
export interface WorldTile {
  coord: Coord;
  kind: TileKind;
  level?: number;
  walkable: boolean;
  neighbors: Coord[];
  resources: Resources;
  owner: BotId | null;
  mine?: Mine;
}
export type World = Record<Coord, WorldTile>;

export const TERRAIN_BASE_TOP = 0.08;
export const TERRAIN_LEVEL_STEP = 0.31;

export function tileLevel(tile: Pick<WorldTile, "kind" | "level">): number {
  if (tile.level !== undefined) return tile.level;
  switch (tile.kind) {
    case "empty": return 0;
    case "obstacle":
    case "ramp": return 2;
    case "tower": return 3;
    default: return 1;
  }
}

export function tileSurfaceHeight(tile: Pick<WorldTile, "kind" | "level">): number {
  return TERRAIN_BASE_TOP + tileLevel(tile) * TERRAIN_LEVEL_STEP;
}

export function isSubmerged(tile: WorldTile, waterLevel: number): boolean {
  return tile.kind === "empty" || tileSurfaceHeight(tile) <= waterLevel;
}

export function canStep(world: World, from: Coord, to: Coord, waterLevel = -Infinity): boolean {
  const origin = world[from];
  const destination = world[to];
  return !!origin?.walkable && !isSubmerged(origin, waterLevel) && !!destination?.walkable && !isSubmerged(destination, waterLevel) && origin.neighbors.includes(to) &&
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

export function pathBetween(world: World, from: Coord, to: Coord, waterLevel = -Infinity): Coord[] {
  if (!world[from]?.walkable || isSubmerged(world[from], waterLevel) || !world[to]?.walkable || isSubmerged(world[to], waterLevel)) return [];
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
      if (canStep(world, current, neighbor, waterLevel) && !parents.has(neighbor)) {
        parents.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }
  return [];
}

export function reachableCoords(world: World, from: Coord, waterLevel = -Infinity): Coord[] {
  if (!world[from]?.walkable || isSubmerged(world[from], waterLevel)) return [];
  const queue: Coord[] = [from];
  const visited = new Set(queue);
  for (let head = 0; head < queue.length; head++) {
    for (const neighbor of world[queue[head]].neighbors) {
      if (canStep(world, queue[head], neighbor, waterLevel) && !visited.has(neighbor)) {
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
    const resources = emptyResources();
    if (kind === "resource") {
      // Keep the terrain's seeded random sequence independent of drop balance.
      random();
      random();
      const specialRoll = random();
      specialPriority.set(tile.coord, specialRoll);
      specialPriority.set(mirror, specialRoll);
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
  const specialPairCount = Math.min(RULES.specialPairCount, Math.max(1, Math.floor(radius / 2)));
  const specialPairs = Object.values(selected)
    .filter(tile => {
      const [column, row] = axial(tile.coord);
      const mirror: Coord = `${-column},${-row}`;
      return tile.kind === "resource" && tile.coord < mirror && selected[mirror]?.kind === "resource" &&
        tile.coord !== `${-radius + 1},0` && mirror !== `${-radius + 1},0`;
    })
    .sort((left, right) => (specialPriority.get(right.coord) ?? 0) - (specialPriority.get(left.coord) ?? 0))
    .slice(0, specialPairCount);
  if (specialPairs.length < specialPairCount) {
    const supplemental = Object.values(selected)
      .filter(tile => {
        const [column, row] = axial(tile.coord);
        const mirror: Coord = `${-column},${-row}`;
        return tile.coord < mirror && selected[mirror]?.kind === tile.kind &&
          !["resource", "base", "fuel", "repair", "ramp", "tower"].includes(tile.kind);
      })
      .map(tile => ({ tile, priority: random() }))
      .sort((left, right) => right.priority - left.priority)
      .slice(0, specialPairCount - specialPairs.length);
    if (specialPairs.length + supplemental.length < specialPairCount) {
      if (attempt < 32) return generateWorldAttempt(seed, radius, attempt + 1);
      throw new Error("Insufficient special resource pairs");
    }
    for (const { tile } of supplemental) {
      const [column, row] = axial(tile.coord);
      const mirror: Coord = `${-column},${-row}`;
      for (const coord of [tile.coord, mirror]) {
        selected[coord].kind = "resource";
        selected[coord].walkable = true;
        selected[coord].resources = emptyResources();
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
  for (const tile of Object.values(selected)) {
    const [q, r] = axial(tile.coord);
    if (r === 0 && q !== 0 && !tile.walkable) {
      tile.kind = "plain";
      tile.walkable = true;
      tile.resources = emptyResources();
    }
  }
  // A dry central spine keeps both refuges connected as the lowlands vanish.
  // The two opposite ramps are the only legal final steps onto the tower.
  for (const tile of Object.values(selected)) {
    tile.level = tile.kind === "empty" ? 0 : tile.kind === "tower" ? 5 : tile.kind === "ramp" ? 4 :
      tile.kind === "obstacle" ? 2 : (coastPriority.get(tile.coord) ?? 0) < 0.3 ? 2 : 1;
    const [q, r] = axial(tile.coord);
    if (tile.walkable && r === 0 && q !== 0) tile.level = 3;
    if (["base", "fuel", "repair"].includes(tile.kind)) tile.level = 3;
  }
  const spine = Object.values(selected).filter(tile => tile.walkable && axial(tile.coord)[1] === 0 && tile.kind !== "tower");
  const flatWorld = Object.fromEntries(Object.entries(selected).map(([coord, tile]) =>
    [coord, { ...tile, level: tile.kind === "empty" ? 0 : 1, walkable: tile.walkable && tile.kind !== "tower" }])) as World;
  for (const station of Object.values(selected).filter(tile => tile.kind === "fuel" || tile.kind === "repair")) {
    const nearest = [...spine].sort((a, b) => hexDistance(station.coord, a.coord) - hexDistance(station.coord, b.coord))[0];
    for (const coord of pathBetween(flatWorld, station.coord, nearest.coord))
      if (selected[coord]?.walkable && selected[coord].kind !== "tower" && selected[coord].kind !== "ramp") selected[coord].level = 3;
  }
  for (let pass = 0; pass < 4; pass++) {
    for (const tile of Object.values(selected)) {
      if (!tile.walkable || tile.kind === "tower" || tile.kind === "ramp") continue;
      tile.level = Math.max(tile.level ?? 1, ...tile.neighbors.filter(coord => selected[coord].walkable && selected[coord].kind !== "tower")
        .map(coord => (selected[coord].level ?? 1) - 1));
    }
  }
  if (!validLand(selected, bases, radius)) {
    if (attempt < 32) return generateWorldAttempt(seed, radius, attempt + 1);
    throw new Error("No connected elevated routes");
  }
  // One small find per resource tile; paired drops keep both bots' maps fair.
  for (const tile of Object.values(selected)) {
    const [column, row] = axial(tile.coord);
    const mirror: Coord = `${-column},${-row}`;
    if (tile.kind !== "resource" || tile.coord > mirror) continue;
    const isSpecial = tile.resources.special > 0;
    const isStartingDebris = tile.coord === `${-radius + 1},0` || mirror === `${-radius + 1},0`;
    const kind = isSpecial ? "special" : isStartingDebris || random() < RULES.debrisTileChance ? "debris" : "food";
    const amount = kind === "special" ? 1 : random() < 0.16 ? 2 : 1;
    const resources = { ...emptyResources(), [kind]: amount };
    selected[tile.coord].resources = { ...resources };
    selected[mirror].resources = { ...resources };
  }
  return selected;
}
