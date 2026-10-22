import { describe, expect, it, vi } from "vitest";

import { useSessionStore } from "../stores/useSessionStore";
import { cloudOpacity, cloudTravelProgress } from "../components/session/presentation";

import { SessionHost } from "./protocol";
import { addResources, emptyResources, resourceTotal, transferResources } from "./resources";
import { RULES } from "./rules";
import { createBot, GameSession as CoreGameSession } from "./session";
import { TIDE_HIGH, tideLevel, timeUntilFlood } from "./tide";
import { activeCoords, effectiveRadius, hasLineOfSight, isCloudVisible, resourceMarkerCoords, revealedTileKind } from "./visibility";
import { axial, canStep, generateWorld, hexDistance, hexLine, isSubmerged, pathBetween, reachableCoords, tileLevel, worldPosition, type Coord } from "./world";

// Controlled worlds exercise one mechanic at a time; generated games keep the treasure enabled.
class GameSession extends CoreGameSession {
  constructor(seed: number, scenario?: ConstructorParameters<typeof CoreGameSession>[1]) {
    super(seed, scenario?.world ? { ...scenario, treasureCoord: null } : scenario);
  }
}

function markKnownResourcesScanned(world: ReturnType<typeof generateWorld>, ...bots: ReturnType<typeof createBot>[]) {
  for (const bot of bots) bot.scanned = bot.known.filter(coord => world[coord]?.kind === "resource");
}

describe("rising tide", () => {
  it("floods low terraces while preserving a dry path between both refuges and the tower", () => {
    const world = generateWorld(42, 5);
    expect(tideLevel(0)).toBeLessThan(tideLevel(90_000));
    expect(tideLevel(180_000)).toBe(TIDE_HIGH);
    expect(Object.values(world).some(tile => tile.walkable && tileLevel(tile) === 1 && isSubmerged(tile, TIDE_HIGH))).toBe(true);
    expect(Object.values(world).some(tile => tile.walkable && tileLevel(tile) === 2 && isSubmerged(tile, TIDE_HIGH))).toBe(true);
    for (const base of ["-5,0", "5,0"] as Coord[]) {
      const route = pathBetween(world, base, "0,0", TIDE_HIGH);
      expect(route.length).toBeGreaterThan(1);
      expect(route.every(coord => !isSubmerged(world[coord], TIDE_HIGH))).toBe(true);
    }
    const flooded = Object.values(world).find(tile => tile.walkable && tileLevel(tile) === 1)!;
    expect(pathBetween(world, "-5,0", flooded.coord, TIDE_HIGH)).toEqual([]);
    for (const radius of [2, 5, 8]) for (let seed = 0; seed < 12; seed++) {
      const generated = generateWorld(seed, radius);
      const services = Object.values(generated).filter(tile => tile.kind === "fuel" || tile.kind === "repair");
      for (const base of [`${-radius},0`, `${radius},0`] as Coord[])
        for (const target of [...services.map(tile => tile.coord), "0,0" as Coord])
          expect(pathBetween(generated, base, target, TIDE_HIGH).length, `${seed}, ${radius}: ${base} → ${target}`).toBeGreaterThan(1);
    }
  });

  it("cancels a collection at submersion and evacuates the bot", () => {
    const world = generateWorld(42, 5);
    const target = Object.values(world).find(tile => tile.kind === "resource" && tileLevel(tile) === 1)!;
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    target.resources.food = 50;
    world["4,0"].kind = "resource";
    world["4,0"].resources.food = 50;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = target.coord;
    bots["bot-0"].known = [target.coord];
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].droneAvailable = false;
    bots["bot-1"].damage = 100;
    const session = new GameSession(42, { world, bots, elapsed: timeUntilFlood(target, 0) - 500 });
    session.advance(500);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].coord).toBe(snapshot.bots["bot-0"].base);
    expect(snapshot.world[target.coord].resources.food).toBe(50);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "rescue.completed", botId: "bot-0", coord: target.coord }));
    expect(snapshot.events.some(event => event.type === "collection.completed" && event.coord === target.coord)).toBe(false);
    session.assertInvariants();
    session.stop();
  });

  it("allows a drone to scan a submerged resource without collecting it", () => {
    const world = generateWorld(42, 5);
    const dry = Object.values(world).filter(tile => tile.walkable && tileLevel(tile) >= 3 && tile.kind !== "base" && tile.kind !== "tower");
    const target = Object.values(world).find(tile => tile.kind === "resource" && tileLevel(tile) === 1 &&
      dry.some(anchor => hexDistance(anchor.coord, tile.coord) <= 3 && hexDistance(anchor.coord, "4,0") > 3))!;
    const anchor = dry.find(tile => hexDistance(tile.coord, target.coord) <= 3 && hexDistance(tile.coord, "4,0") > 3)!;
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    target.resources.food = 50;
    world["4,0"].kind = "resource";
    world["4,0"].resources.food = 50;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = anchor.coord;
    bots["bot-0"].radius = 3;
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord).filter(coord => coord !== target.coord && coord !== "4,0");
    markKnownResourcesScanned(world, bots["bot-0"]);
    const session = new GameSession(42, { world, bots, elapsed: 180_000 });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "scan", target: target.coord });
    session.advance(session.getSnapshot().bots["bot-0"].operation!.remaining);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].scanned).toContain(target.coord);
    expect(snapshot.world[target.coord].resources.food).toBe(50);
    session.assertInvariants();
    session.stop();
  });
});

describe("resource transactions", () => {
  it("moves away before scanning a resource beneath its ship, then collects it", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const target = "-2,0" as Coord;
    world[target] = { ...world[target], kind: "resource", walkable: true, resources: { food: 2, debris: 0, special: 0 } };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = target;
    bots["bot-0"].known = Object.keys(world) as Coord[];
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].scanned = bots["bot-0"].scanned.filter(coord => coord !== target);
    bots["bot-1"].damage = 100;
    const session = new GameSession(42, { world, bots });
    expect(session.getSnapshot().bots["bot-0"].known).toContain(target);
    expect(session.getSnapshot().bots["bot-0"].scanned).not.toContain(target);
    expect(() => session.placeBeacon("bot-0", target, "collect")).toThrow();
    expect(() => session.placeBeacon("bot-0", target, "explore")).toThrow();
    session.advance(1);
    const first = session.getSnapshot().bots["bot-0"].operation;
    expect(first).toMatchObject({ kind: "move" });
    expect(first?.target).not.toBe(target);
    expect(session.getSnapshot().bots["bot-0"].cargo.food).toBe(0);
    session.advance(first!.remaining);
    const scanning = session.getSnapshot().bots["bot-0"];
    expect(scanning.coord).not.toBe(target);
    expect(scanning.operation).toMatchObject({ kind: "scan", target });
    session.advance(scanning.operation!.remaining);
    const returning = session.getSnapshot().bots["bot-0"];
    expect(returning.scanned).toContain(target);
    expect(returning.operation).toMatchObject({ kind: "move", target });
    session.advance(returning.operation!.remaining);
    const collecting = session.getSnapshot().bots["bot-0"];
    expect(collecting.operation).toMatchObject({ kind: "collect", target });
    session.advance(collecting.operation!.remaining);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].cargo.food).toBe(2);
    expect(snapshot.world[target].resources.food).toBe(0);
    session.assertInvariants();
    session.stop();
  });

  it("cannot collect an unscanned resource after losing its drone", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const target = "-2,0" as Coord;
    world[target] = { ...world[target], kind: "resource", walkable: true, resources: { food: 2, debris: 0, special: 0 } };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = target;
    bots["bot-0"].known = Object.keys(world) as Coord[];
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].scanned = bots["bot-0"].scanned.filter(coord => coord !== target);
    bots["bot-0"].droneAvailable = false;
    bots["bot-1"].damage = 100;
    const session = new GameSession(42, { world, bots });
    expect(() => session.placeBeacon("bot-0", target, "collect")).toThrow();
    session.advance(10_000);
    const snapshot = session.getSnapshot();
    expect(snapshot.world[target].resources.food).toBe(2);
    expect(snapshot.bots["bot-0"].cargo.food).toBe(0);
    expect(snapshot.bots["bot-0"].statistics.collections).toBe(0);
    session.assertInvariants();
    session.stop();
  });

  const capacity = { food: 200, debris: 1800, special: 3 };

  it("respects each compartment without blocking the others", () => {
    const stock = { food: 50, debris: 500, special: 10 };
    const cargo = { food: 200, debris: 1700, special: 1 };
    const transfer = transferResources(stock, cargo, capacity);
    expect(transfer.cargo).toEqual(capacity);
    expect(transfer.taken).toEqual({ food: 0, debris: 100, special: 2 });
    expect(addResources(transfer.remaining, transfer.cargo)).toEqual(addResources(stock, cargo));
    expect(stock).toEqual({ food: 50, debris: 500, special: 10 });
  });

  it("cannot collect the same shared stock twice", () => {
    const stock = { food: 100, debris: 100, special: 2 };
    const first = transferResources(stock, emptyResources(), capacity);
    const second = transferResources(first.remaining, emptyResources(), capacity);
    expect(resourceTotal(second.taken)).toBe(0);
    expect(addResources(first.cargo, second.cargo)).toEqual(stock);
  });

  it("rejects negative, fractional and over-capacity quantities", () => {
    expect(() => transferResources({ food: -1, debris: 0, special: 0 }, emptyResources(), capacity)).toThrow();
    expect(() => transferResources({ food: 0.5, debris: 0, special: 0 }, emptyResources(), capacity)).toThrow();
    expect(() => transferResources(emptyResources(), { food: 201, debris: 0, special: 0 }, capacity)).toThrow();
  });
});

describe("offensive drone", () => {
  function scenario() {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.level = undefined;
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      if (tile.kind !== "base") {
        tile.kind = "plain";
        tile.walkable = true;
      }
    }
    world["-3,1"].kind = "resource";
    world["-3,1"].resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].radius = 2;
    bots["bot-1"].coord = "1,0";
    bots["bot-1"].fuel = 0;
    return { world, bots };
  }

  it("places an overlay mine near a visible opponent and arms it after 800 ms", () => {
    const { world, bots } = scenario();
    world["0,1"].kind = "fuel";
    bots["bot-0"].goal = { coord: "0,1", reason: "fuel" };
    bots["bot-0"].fuel = 10;
    bots["bot-0"].offensiveDroneAvailable = false;
    bots["bot-1"].fuel = 100;
    bots["bot-1"].actions = 1;
    bots["bot-1"].deposited.special = 1;
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const operation = session.getSnapshot().bots["bot-1"].operation;
    expect(operation?.kind).toBe("mine");
    const target = operation!.target;
    expect(target).toBe("0,1");
    session.advance(RULES.stepDuration - 1);
    let snapshot = session.getSnapshot();
    expect(snapshot.world[target].kind).toBe(world[target].kind);
    expect(snapshot.world[target].mine).toMatchObject({ owner: "bot-1", state: "arming", armsAt: snapshot.elapsed + 800 });
    expect(snapshot.bots["bot-1"].knownMines[target]).toBe(Number.MAX_SAFE_INTEGER);
    expect(snapshot.bots["bot-0"].knownMines[target]).toBeGreaterThan(snapshot.elapsed);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "mine.placed", botId: "bot-1", target }));
    expect(snapshot.bots["bot-1"].actions).toBe(0);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "mine.placed", delta: { actions: -1 } }));
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "mine.spotted", botId: "bot-0", coord: target }));
    expect(snapshot.trust).toEqual({ "bot-0": 38, "bot-1": 50 });
    expect(snapshot.lastTrustChange["bot-0"]).toMatchObject({ type: "trust.changed", botId: "bot-0", coord: target,
      trust: { toward: "bot-1", cause: "mine-spotted", before: 50, delta: -12, after: 38 } });
    session.advance(799);
    expect(session.getSnapshot().world[target].mine?.state).toBe("arming");
    session.advance(1);
    snapshot = session.getSnapshot();
    expect(snapshot.world[target].mine?.state).toBe("armed");
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "mine.armed", coord: target }));
    session.advance(snapshot.bots["bot-1"].operation!.remaining);
    snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-1"].fuel).toBe(RULES.fuelCapacity - 2 * hexDistance("1,0", target) * RULES.droneFuelPerHex - RULES.minePlacementFuel);
    session.assertInvariants();
    session.stop();
  });

  it("does not play the mine action without a deposited special resource", () => {
    const { world, bots } = scenario();
    world["0,1"].kind = "fuel";
    bots["bot-0"].goal = { coord: "0,1", reason: "fuel" };
    bots["bot-0"].fuel = 10;
    bots["bot-0"].offensiveDroneAvailable = false;
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-1"].operation?.kind).not.toBe("mine");
    expect(session.getSnapshot().events.some(event => event.type === "mine.placed")).toBe(false);
    session.stop();
  });

  it("applies ordinary danger damage when a ship enters a mined tile", () => {
    const { world, bots } = scenario();
    world["1,0"] = { ...world["1,0"], mine: { owner: "bot-0", state: "armed", armsAt: 0 } };
    bots["bot-0"].damage = 100;
    bots["bot-0"].coord = "-1,0";
    bots["bot-1"].coord = "0,0";
    bots["bot-1"].fuel = 100;
    bots["bot-1"].offensiveDroneAvailable = false;
    bots["bot-1"].goal = { coord: "1,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.stepDuration);
    const bot = session.getSnapshot().bots["bot-1"];
    expect(bot.coord).toBe("1,0");
    expect(bot.damage).toBe(RULES.mineDamage);
    expect(session.getSnapshot().world["1,0"].mine).toBeUndefined();
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "danger.impact", botId: "bot-1", coord: "1,0", reason: "mine" }));
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "mine.exploded", coord: "1,0" }));
    expect(session.getSnapshot().trust).toEqual({ "bot-0": 50, "bot-1": 25 });
    expect(session.getSnapshot().lastTrustChange["bot-1"]?.trust).toMatchObject({ toward: "bot-0", cause: "mine-hit", delta: -25 });
    session.assertInvariants();
    session.stop();
  });

  it("bounds trust after discovering an enemy mine", () => {
    const { world, bots } = scenario();
    world["1,0"].mine = { owner: "bot-1", state: "arming", armsAt: 800 };
    const session = new GameSession(42, { world, bots, trust: { "bot-0": 5 } });
    const snapshot = session.getSnapshot();
    expect(snapshot.trust).toEqual({ "bot-0": 0, "bot-1": 50 });
    expect(snapshot.lastTrustChange["bot-0"]?.trust).toMatchObject({ cause: "mine-spotted", before: 5, delta: -5, after: 0 });
    expect(() => new GameSession(42, { world, bots, trust: { "bot-0": 101 } })).toThrow("Invalid initial trust");
    session.assertInvariants();
    session.stop();
  });

  it("reduces trust when an exploration drone is lost on an enemy mine", () => {
    const world = generateWorld(42, 4);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["1,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
    world["-4,1"].resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].offensiveDroneAvailable = false;
    bots["bot-0"].known = Object.values(world).filter(tile => !["1,0", "-4,1"].includes(tile.coord)).map(tile => tile.coord);
    markKnownResourcesScanned(world, bots["bot-0"]);
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "scan", target: "1,0" });
    session.advance(RULES.stepDuration - 1);
    const snapshot = session.getSnapshot();
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "drone.lost", botId: "bot-0", reason: "mine" }));
    expect(snapshot.trust).toEqual({ "bot-0": 32, "bot-1": 50 });
    expect(snapshot.lastTrustChange["bot-0"]?.trust).toMatchObject({ toward: "bot-1", cause: "drone-lost", delta: -18 });
    session.assertInvariants();
    session.stop();
  });

  it("neutralizes a remembered mine with the offensive drone without damage", () => {
    const { world, bots } = scenario();
    world["1,0"] = { ...world["1,0"], mine: { owner: "bot-1", state: "armed", armsAt: 0 } };
    bots["bot-0"].knownMines["1,0"] = 10000;
    bots["bot-0"].goal = { coord: "1,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const operation = session.getSnapshot().bots["bot-0"].operation;
    expect(operation).toMatchObject({ kind: "neutralize", target: "1,0" });
    session.advance(operation!.remaining);
    const snapshot = session.getSnapshot();
    expect(snapshot.world["1,0"].mine).toBeUndefined();
    expect(snapshot.bots["bot-0"].damage).toBe(0);
    expect(snapshot.bots["bot-0"].offensiveDroneAvailable).toBe(true);
    expect(snapshot.bots["bot-0"].fuel).toBe(RULES.fuelCapacity - 2 * RULES.droneFuelPerHex - RULES.mineNeutralizeFuel);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "mine.neutralized", target: "1,0" }));
    session.assertInvariants();
    session.stop();
  });

  it("leaves a nearby mine alone when it is not on the chosen route", () => {
    const { world, bots } = scenario();
    world["1,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
    bots["bot-0"].knownMines["1,0"] = 10000;
    bots["bot-0"].goal = { coord: "0,1", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", target: "0,1" });
    expect(session.getSnapshot().world["1,0"].mine?.state).toBe("armed");
    session.assertInvariants();
    session.stop();
  });

  it("takes a safe detour around a remembered mine instead of neutralizing it", () => {
    const { world, bots } = scenario();
    world["1,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
    bots["bot-0"].knownMines["1,0"] = 10000;
    bots["bot-0"].goal = { coord: "2,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const operation = session.getSnapshot().bots["bot-0"].operation;
    expect(operation?.kind).toBe("move");
    expect(operation?.target).not.toBe("1,0");
    expect(session.getSnapshot().world["1,0"].mine?.state).toBe("armed");
    session.assertInvariants();
    session.stop();
  });

  it("confirms a stale memory is empty after a failed neutralization", () => {
    const { world, bots } = scenario();
    bots["bot-0"].knownMines["1,0"] = 10000;
    bots["bot-0"].goal = { coord: "1,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const operation = session.getSnapshot().bots["bot-0"].operation;
    expect(operation?.kind).toBe("neutralize");
    session.advance(operation!.remaining);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].knownMines["1,0"]).toBeUndefined();
    expect(snapshot.events.some(event => event.type === "mine.neutralized")).toBe(false);
    expect(snapshot.bots["bot-0"].operation?.kind).not.toBe("neutralize");
    session.assertInvariants();
    session.stop();
  });

  it("neutralizes an adjacent remembered mine even when entering it would be fatal", () => {
    const { world, bots } = scenario();
    world[bots["bot-0"].base].walkable = false;
    world["1,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
    bots["bot-0"].damage = 95;
    bots["bot-0"].knownMines["1,0"] = 10000;
    bots["bot-0"].goal = { coord: "1,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "neutralize", target: "1,0" });
    session.assertInvariants();
    session.stop();
  });

  it("gives both the bot and player an imprecise mine scan report", () => {
    const { world, bots } = scenario();
    world["1,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const operation = session.getSnapshot().bots["bot-0"].operation;
    expect(operation).toMatchObject({ kind: "mineScan", target: "0,0" });
    session.advance(operation!.remaining);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].mineReports.slice(-1)[0]).toEqual({ center: "0,0", radius: 2, count: 1, nearestDistance: 1, time: snapshot.elapsed });
    expect(snapshot.bots["bot-0"].knownMines["1,0"]).toBeUndefined();
    expect(snapshot.bots["bot-0"].fuel).toBe(RULES.fuelCapacity - RULES.mineScanFuel);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "mine.scan.completed", botId: "bot-0" }));
    session.assertInvariants();
    session.stop();
  });

  it("forgets an armed mine when its remembered position expires", () => {
    const { world, bots } = scenario();
    world["3,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
    bots["bot-0"].knownMines["3,0"] = 1000;
    bots["bot-0"].offensiveDroneAvailable = false;
    const session = new GameSession(42, { world, bots });
    expect(session.getSnapshot().bots["bot-0"].knownMines["3,0"]).toBe(1000);
    session.advance(1000);
    expect(session.getSnapshot().bots["bot-0"].knownMines["3,0"]).toBeUndefined();
    expect(session.getSnapshot().world["3,0"].mine?.state).toBe("armed");
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "mine.forgotten", botId: "bot-0", coord: "3,0" }));
    session.assertInvariants();
    session.stop();
  });

  it("can hit a mine after forgetting its position when the direct route becomes attractive", () => {
    function run(expiresAt: number) {
      const { world, bots } = scenario();
      world["0,0"].kind = "fuel";
      world["1,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
      world["2,0"].kind = "resource";
      world["2,0"].resources.food = 200;
      bots["bot-0"].fuel = 90;
      bots["bot-0"].radius = 1;
      bots["bot-0"].droneAvailable = false;
      bots["bot-0"].offensiveDroneAvailable = false;
      bots["bot-0"].known.push("2,0");
      markKnownResourcesScanned(world, bots["bot-0"]);
      bots["bot-0"].knownMines["1,0"] = expiresAt;
      return new GameSession(42, { world, bots });
    }
    const forgotten = run(1000);
    const remembered = run(10000);
    try {
      forgotten.advance(1600);
      remembered.advance(1600);
      expect(forgotten.getSnapshot().bots["bot-0"].damage).toBe(RULES.mineDamage);
      expect(forgotten.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "mine.forgotten", botId: "bot-0", coord: "1,0" }));
      expect(remembered.getSnapshot().bots["bot-0"].damage).toBe(0);
      expect(remembered.getSnapshot().world["1,0"].mine?.state).toBe("armed");
      forgotten.assertInvariants();
      remembered.assertInvariants();
    } finally {
      forgotten.stop();
      remembered.stop();
    }
  });

  it.each([
    { level: 1, duration: 10000 },
    { level: 2, duration: 20000 },
    { level: 3, duration: 40000 },
  ])("remembers an arming mine for $duration ms at memory level $level", ({ level, duration }) => {
    const { world, bots } = scenario();
    world["1,0"].mine = { owner: "bot-1", state: "arming", armsAt: 800 };
    bots["bot-0"].mineMemoryLevel = level;
    bots["bot-0"].offensiveDroneAvailable = false;
    const session = new GameSession(42, { world, bots });
    expect(session.getSnapshot().bots["bot-0"].knownMines["1,0"]).toBe(duration);
    session.advance(800);
    expect(session.getSnapshot().world["1,0"].mine?.state).toBe("armed");
    expect(session.getSnapshot().bots["bot-0"].knownMines["1,0"]).toBeGreaterThan(800);
    session.assertInvariants();
    session.stop();
  });

  it.each([
    { before: 1, after: 2, price: RULES.mineMemoryUpgradePrices[1], duration: 20000 },
    { before: 2, after: 3, price: RULES.mineMemoryUpgradePrices[2], duration: 40000 },
  ])("buys mine memory level $after for $price at the base", ({ before, after, price, duration }) => {
    const { world, bots } = scenario();
    bots["bot-0"].coord = bots["bot-0"].base;
    bots["bot-0"].known = Object.keys(world) as Coord[];
    bots["bot-0"].mineMemoryLevel = before;
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].budget = price + RULES.repairPrice;
    bots["bot-0"].score = price + RULES.repairPrice;
    bots["bot-0"].deposited.food = price + RULES.repairPrice;
    bots["bot-0"].deposited.debris = price + RULES.repairPrice;
    bots["bot-0"].statistics.mineSightings = 1;
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const operation = session.getSnapshot().bots["bot-0"].operation;
    expect(operation?.kind).toBe("memoryUpgrade");
    session.advance(operation!.remaining);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.mineMemoryLevel).toBe(after);
    expect(RULES.mineMemoryDurations[bot.mineMemoryLevel - 1]).toBe(duration);
    expect(bot.budget).toBe(RULES.repairPrice);
    expect(bot.spent).toBe(price);
    session.assertInvariants();
    session.stop();
  });
});

describe("electric cloud", () => {
  function scanScenario(target: Coord, cloudCoord: Coord, expiresAt: number = RULES.cloudLifetime, seed = 42, dangerCoord?: Coord) {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      if (tile.kind === "danger") tile.kind = "plain";
    }
    for (const coord of ["0,0", "1,0", "1,1", "2,0", target, cloudCoord] as Coord[]) {
      world[coord].kind = "plain";
      world[coord].walkable = true;
    }
    world["-3,1"].kind = "resource";
    world["-3,1"].walkable = true;
    world["-3,1"].resources.food = 20;
    if (dangerCoord) {
      world[dangerCoord].kind = "danger";
      world[dangerCoord].walkable = true;
      world[dangerCoord].resources = emptyResources();
    }
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].radius = 2;
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord).filter(coord => coord !== target && coord !== "-3,1");
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-1"].damage = 100;
    const cloud = { coord: cloudCoord, previousCoord: null, appearedAt: 0, nextMoveAt: RULES.cloudMoveDuration, expiresAt };
    return new GameSession(seed, { world, bots, cloud });
  }

  it("has no effect on a drone passing beside its tile", () => {
    const session = scanScenario("2,0", "1,1");
    session.advance(2 * RULES.stepDuration);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.operation).toMatchObject({ kind: "scan", target: "2,0", scanArrived: true });
    expect(bot.operation?.scanDetour).toBeUndefined();
    expect(session.getSnapshot().events.some(event => event.type === "drone.interfered")).toBe(false);
    session.assertInvariants();
    session.stop();
  });

  it("reverses the drone on the cloud tile, bounces at an edge, visits a random tile, then returns", () => {
    const session = scanScenario("2,0", "1,0");
    session.advance(RULES.stepDuration);
    const detour = session.getSnapshot().bots["bot-0"].operation?.scanDetour;
    expect(detour).toMatchObject({ contact: "1,0", contactAt: RULES.stepDuration });
    expect(detour).toBeDefined();
    expect(session.getSnapshot().world[detour!.edge].neighbors.length).toBeLessThan(6);
    expect(hexLine(detour!.contact, detour!.edge)[1]).toBe("0,0");
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "drone.interfered", coord: "1,0", target: detour!.edge }));
    session.advance(detour!.edgeAt - RULES.stepDuration);
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "drone.bounced", coord: detour!.edge, target: detour!.destination }));
    const duration = session.getSnapshot().bots["bot-0"].operation!.duration;
    session.advance(duration - detour!.edgeAt);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].droneAvailable).toBe(true);
    expect(snapshot.bots["bot-0"].coord).toBe("0,0");
    expect(snapshot.bots["bot-0"].scanned).toContain(detour!.destination);
    expect(snapshot.bots["bot-0"].statistics.scans).toBe(1);
    expect(snapshot.bots["bot-0"].fuel).toBe(RULES.fuelCapacity - 4 * RULES.droneFuelPerHex);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "scan.completed", target: detour!.destination }));
    session.assertInvariants();
    session.stop();
  });

  it("rebounds when the cloud is the drone's exact target", () => {
    const session = scanScenario("1,0", "1,0");
    session.advance(RULES.stepDuration);
    expect(session.getSnapshot().bots["bot-0"].operation?.scanDetour?.contact).toBe("1,0");
    expect(session.getSnapshot().bots["bot-0"].droneAvailable).toBe(true);
    expect(session.getSnapshot().events.some(event => event.type === "drone.lost")).toBe(false);
    session.stop();
  });

  function cloudMovesIntoFlight(target: Coord, nextMoveAt: number) {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      if (tile.kind === "danger") tile.kind = "plain";
    }
    for (const coord of ["0,0", "1,0", "1,1", "2,0", target] as Coord[]) {
      world[coord].kind = "plain";
      world[coord].walkable = true;
    }
    for (const neighbor of world["1,1"].neighbors) {
      if (neighbor !== "1,0" && neighbor !== target) world[neighbor].walkable = false;
    }
    world["-3,1"].kind = "resource";
    world["-3,1"].walkable = true;
    world["-3,1"].resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].radius = 2;
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord).filter(coord => coord !== target && coord !== "-3,1");
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-1"].damage = 100;
    const cloud = { coord: "1,1" as const, previousCoord: null, appearedAt: 0, nextMoveAt, expiresAt: RULES.cloudLifetime };
    return new GameSession(42, { world, bots, cloud });
  }

  it("rebounds when the cloud reaches the drone during its visit", () => {
    const session = cloudMovesIntoFlight("1,0", 800);
    session.advance(400);
    expect(session.getSnapshot().bots["bot-0"].operation?.scanArrived).toBe(true);
    session.advance(400);
    expect(session.getSnapshot().cloud?.coord).toBe("1,0");
    expect(session.getSnapshot().bots["bot-0"].operation?.scanDetour).toMatchObject({ contact: "1,0", contactAt: 800 });
    session.assertInvariants();
    session.stop();
  });

  it("rebounds when the return path crosses the cloud", () => {
    const session = cloudMovesIntoFlight("2,0", 1200);
    session.advance(1200);
    expect(session.getSnapshot().bots["bot-0"].operation?.scanDetour).toBeUndefined();
    expect(session.getSnapshot().cloud?.coord).toBe("1,0");
    session.advance(800);
    expect(session.getSnapshot().bots["bot-0"].operation?.scanDetour).toMatchObject({ contact: "1,0", contactAt: 2000 });
    session.assertInvariants();
    session.stop();
  });

  it("can lose a drone on the random tile when that tile is dangerous", () => {
    let chosen: { seed: number; destination: Coord } | null = null;
    for (let seed = 0; seed < 40 && !chosen; seed++) {
      const probe = scanScenario("2,0", "1,0", RULES.cloudLifetime, seed);
      probe.advance(RULES.stepDuration);
      const destination = probe.getSnapshot().bots["bot-0"].operation?.scanDetour?.destination;
      if (destination && !["-3,0", "3,0", "-3,1", "0,0", "1,0", "2,0"].includes(destination))
        chosen = { seed, destination };
      probe.stop();
    }
    expect(chosen).not.toBeNull();
    const session = scanScenario("2,0", "1,0", RULES.cloudLifetime, chosen!.seed, chosen!.destination);
    session.advance(RULES.stepDuration);
    const detour = session.getSnapshot().bots["bot-0"].operation!.scanDetour!;
    expect(detour.destination).toBe(chosen!.destination);
    session.advance(detour.destinationAt - RULES.stepDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].droneAvailable).toBe(false);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "drone.lost", coord: detour.destination, reason: "case dangereuse" }));
    session.assertInvariants();
    session.stop();
  });

  it("damages a ship on arrival at the cloud tile, but not beside it", () => {
    const makeSession = (cloudCoord: Coord) => {
      const world = generateWorld(42, 3);
      for (const tile of Object.values(world)) { tile.resources = emptyResources(); tile.level = undefined; }
      world["1,0"].kind = "plain";
      world["1,0"].walkable = true;
      world["0,0"].kind = "resource";
      world["-3,1"].kind = "resource";
      world["-3,1"].resources.food = 20;
      const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
      bots["bot-0"].coord = "0,0";
      bots["bot-0"].goal = { coord: "1,0", reason: "explore" };
      bots["bot-1"].damage = 100;
      const cloud = { coord: cloudCoord, previousCoord: null, appearedAt: 0, nextMoveAt: RULES.cloudMoveDuration, expiresAt: RULES.cloudLifetime };
      return new GameSession(42, { world, bots, cloud });
    };
    const hit = makeSession("1,0");
    hit.advance(RULES.stepDuration - 1);
    expect(hit.getSnapshot().bots["bot-0"].damage).toBe(0);
    hit.advance(1);
    expect(hit.getSnapshot().bots["bot-0"].damage).toBe(RULES.cloudDamage);
    expect(hit.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "cloud.impact", coord: "1,0", delta: { damage: RULES.cloudDamage } }));
    hit.assertInvariants();
    hit.stop();
    const beside = makeSession("1,1");
    beside.advance(RULES.stepDuration);
    expect(beside.getSnapshot().bots["bot-0"].damage).toBe(0);
    beside.stop();
  });

  it("applies one hit when the cloud moves onto a stationary ship", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) { tile.resources = emptyResources(); tile.level = undefined; }
    world["-1,0"].kind = "resource";
    world["-1,0"].walkable = true;
    world["-1,0"].resources.food = 20;
    world["0,0"].kind = "plain";
    world["0,0"].walkable = true;
    const cloudCoord: Coord = "1,0";
    world[cloudCoord].kind = "plain";
    world[cloudCoord].walkable = true;
    for (const neighbor of world[cloudCoord].neighbors) if (neighbor !== "0,0") world[neighbor].walkable = false;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-1"].damage = 100;
    const cloud = { coord: cloudCoord, previousCoord: null, appearedAt: 0, nextMoveAt: 100, expiresAt: RULES.cloudLifetime };
    const session = new GameSession(42, { world, bots, cloud });
    session.advance(100);
    expect(session.getSnapshot().cloud?.coord).toBe("0,0");
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(RULES.cloudDamage);
    session.advance(100);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(RULES.cloudDamage);
    session.assertInvariants();
    session.stop();

    const movingBots = structuredClone(bots);
    movingBots["bot-0"].goal = { coord: "-1,0", reason: "explore" };
    const moving = new GameSession(42, { world, bots: movingBots, cloud });
    moving.advance(100);
    expect(moving.getSnapshot().cloud?.coord).toBe("0,0");
    expect(moving.getSnapshot().bots["bot-0"].damage).toBe(0);
    moving.advance(300);
    expect(moving.getSnapshot().bots["bot-0"].coord).toBe("-1,0");
    expect(moving.getSnapshot().bots["bot-0"].damage).toBe(0);
    moving.assertInvariants();
    moving.stop();
  });

  it("hides the cloud in fog and fades it in and out", () => {
    const cloud = { coord: "1,0" as const, previousCoord: null, appearedAt: 0, nextMoveAt: 2400, expiresAt: 10000 };
    expect(isCloudVisible(cloud, ["0,0"])).toBe(false);
    expect(isCloudVisible(cloud, ["1,0"])).toBe(true);
    expect(isCloudVisible(cloud, ["0,0"], true)).toBe(true);
    expect(isCloudVisible(null, ["1,0"], true)).toBe(false);
    expect(cloudOpacity(cloud, 0)).toBe(0);
    expect(cloudOpacity(cloud, RULES.cloudFadeDuration / 2)).toBe(0.5);
    expect(cloudOpacity(cloud, 5000)).toBe(1);
    expect(cloudOpacity(cloud, cloud.expiresAt - RULES.cloudFadeDuration / 2)).toBe(0.5);
  });

  it("eases each visible cloud hop and settles before the next logical move", () => {
    const cloud = { coord: "1,0" as const, previousCoord: "0,0" as const, appearedAt: 0, nextMoveAt: RULES.cloudMoveDuration * 2, expiresAt: 10000 };
    const movedAt = RULES.cloudMoveDuration;
    expect(cloudTravelProgress(cloud, movedAt)).toBe(0);
    expect(cloudTravelProgress(cloud, movedAt + 450)).toBeCloseTo(0.5);
    expect(cloudTravelProgress(cloud, movedAt + 900)).toBe(1);
    expect(cloudTravelProgress(cloud, cloud.nextMoveAt - 1)).toBe(1);
    expect(cloudTravelProgress({ ...cloud, previousCoord: null }, movedAt)).toBe(1);
  });

  it("moves slowly, expires, and behaves the same with split time advances", () => {
    const first = scanScenario("2,0", "1,1", 4000);
    const second = scanScenario("2,0", "1,1", 4000);
    first.advance(3000);
    for (let index = 0; index < 3; index++) second.advance(1000);
    expect(first.getSnapshot().events.filter(event => event.type === "cloud.moved")).toHaveLength(1);
    expect({ ...first.getSnapshot(), revision: 0 }).toEqual({ ...second.getSnapshot(), revision: 0 });
    first.advance(1000);
    expect(first.getSnapshot().cloud).toBeNull();
    expect(first.getSnapshot().events.filter(event => event.type === "cloud.disappeared")).toHaveLength(1);
    first.assertInvariants();
    first.stop();
    second.stop();
  });

  it("appears after six newly explored tiles at least two tiles from both ships", () => {
    const session = new GameSession(42);
    const initial = Object.values(session.getSnapshot().bots).reduce((total, bot) => total + bot.explored.length, 0);
    let discovered = 0;
    for (let index = 0; index < 1000; index++) {
      session.advance(RULES.stepDuration);
      const snapshot = session.getSnapshot();
      discovered = Object.values(snapshot.bots).reduce((total, bot) => total + bot.explored.length, 0) - initial;
      if (snapshot.events.some(event => event.type === "cloud.appeared")) break;
      expect(discovered).toBeLessThan(RULES.cloudExplorationInterval);
    }
    expect(discovered).toBeGreaterThanOrEqual(RULES.cloudExplorationInterval);
    const snapshot = session.getSnapshot();
    expect(snapshot.cloud).not.toBeNull();
    for (const bot of Object.values(snapshot.bots)) expect(hexDistance(snapshot.cloud!.coord, bot.coord)).toBeGreaterThanOrEqual(2);
    session.assertInvariants();
    session.stop();
  });
});

describe("shared session", () => {
  it("shows an obstacle but hides terrain and scan targets behind it", () => {
    const world = generateWorld(42, 3);
    world["1,0"].kind = "obstacle";
    world["1,0"].walkable = false;
    world["2,0"].kind = "resource";
    world["2,0"].walkable = true;
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["2,0"].resources.food = 20;

    expect(hasLineOfSight(world, "0,0", "1,0")).toBe(true);
    expect(hasLineOfSight(world, "0,0", "2,0")).toBe(false);
    expect(hasLineOfSight(world, "2,0", "0,0")).toBe(false);
    expect(activeCoords(world, { coord: "0,0", radius: 2 })).toContain("1,0");
    expect(activeCoords(world, { coord: "0,0", radius: 2 })).not.toContain("2,0");
    expect(activeCoords(world, { coord: "1,-1", radius: 2 })).toContain("2,0");

    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].radius = 2;
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord).filter(coord => coord !== "2,0");
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-1"].damage = 100;
    const session = new GameSession(42, { world, bots });
    expect(session.getSnapshot().bots["bot-0"].explored).not.toContain("2,0");
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation?.kind).not.toBe("scan");
    expect(session.getSnapshot().bots["bot-0"].statistics.scans).toBe(0);
    session.stop();

    bots["bot-0"].coord = "1,-1";
    const clearViewSession = new GameSession(42, { world, bots });
    clearViewSession.advance(1);
    expect(clearViewSession.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "scan", target: "2,0" });
    clearViewSession.stop();
  });

  it("shows ground resource markers only on scanned targets still inside ship vision", () => {
    const world = generateWorld(42, 3);
    const bot = createBot("bot-0", world, 42);
    const targets = world[bot.base].neighbors.slice(0, 2);
    for (const coord of targets) {
      world[coord].kind = "resource";
      world[coord].resources = { food: 10, debris: 0, special: 0 };
    }
    const current = activeCoords(world, bot);
    expect(targets.every(coord => current.includes(coord))).toBe(true);
    expect(resourceMarkerCoords(world, current, [])).toEqual([]);
    expect(resourceMarkerCoords(world, current, [targets[0]])).toEqual([targets[0]]);
    expect(resourceMarkerCoords(world, current, [])).not.toContain(targets[1]);
    expect(resourceMarkerCoords(world, [bot.base], [targets[0]])).toEqual([]);
    world[targets[0]].resources = emptyResources();
    expect(resourceMarkerCoords(world, current, [targets[0]])).toEqual([]);
  });

  it("reveals public services in view but keeps danger hidden until discovered", () => {
    const world = generateWorld(42, 3);
    const known = new Set(["-3,0"] as const);
    const scanned = new Set<`${number},${number}`>();
    const danger = world["-2,0"];
    danger.kind = "danger";
    const repair = Object.values(world).find(tile => tile.kind === "repair")!;
    expect(revealedTileKind(repair, known, scanned, true)).toBe("repair");
    expect(revealedTileKind(danger, known, scanned, true)).toBe("terrain");
    expect(revealedTileKind(danger, new Set([danger.coord]), scanned, true)).toBe("danger");
    expect(revealedTileKind(danger, known, scanned, true, true)).toBe("danger");
    const resource = world["-2,1"];
    resource.kind = "resource";
    expect(revealedTileKind(resource, known, scanned, true)).toBe("terrain");
    expect(revealedTileKind(resource, new Set([resource.coord]), scanned, true)).toBe("terrain");
    expect(revealedTileKind(resource, known, new Set([resource.coord]), true)).toBe("resource");
  });

  it("plans around a danger only after this bot has discovered it", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["-1,0"].kind = "danger";
    world["-1,0"].walkable = true;
    world["0,0"].kind = "resource";
    world["0,0"].resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "-2,0";
    bots["bot-0"].goal = { coord: "0,0", reason: "collect" };
    bots["bot-1"].damage = 100;
    const unknown = new GameSession(42, { world, bots });
    unknown.advance(1);
    expect(unknown.getSnapshot().bots["bot-0"].operation?.target).toBe("-1,0");
    unknown.stop();

    bots["bot-0"].known.push("-1,0");
    const discovered = new GameSession(42, { world, bots });
    discovered.advance(1);
    expect(discovered.getSnapshot().bots["bot-0"].operation?.target).not.toBe("-1,0");
    discovered.stop();
  });

  it("keeps terrain memory separate for each bot after the ship leaves its radius", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].goal = { coord: "-1,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    const initial = session.getSnapshot().bots["bot-0"];
    expect(initial.explored).toContain("-2,0");
    expect(initial.known).not.toContain("-2,0");
    session.advance(2 * RULES.stepDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].coord).toBe("-1,0");
    expect(activeCoords(snapshot.world, snapshot.bots["bot-0"])).not.toContain("-3,0");
    expect(snapshot.bots["bot-0"].explored).toContain("-3,0");
    expect(snapshot.bots["bot-1"].explored).not.toContain("-1,0");
    const withoutDrone = { ...snapshot.bots["bot-0"], droneAvailable: false };
    expect(activeCoords(snapshot.world, withoutDrone)).toEqual(activeCoords(snapshot.world, snapshot.bots["bot-0"]));
    expect(snapshot.bots["bot-0"].scanned).toEqual([]);
    expect(snapshot.bots["bot-0"].known).toContain("-1,0");
    session.stop();
  });

  it("accumulates repeated harvests of one tile without counting it twice", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["-2,0"].kind = "resource";
    world["-2,0"].walkable = true;
    world["-2,0"].resources.food = 18;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "-2,0";
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord);
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-1"].fuel = 0;
    const session = new GameSession(42, { world, bots });
    session.advance(1000000);
    const snapshot = session.getSnapshot();
    expect(snapshot.phase).toBe("finished");
    expect(snapshot.bots["bot-0"].score).toBe(18);
    expect(snapshot.bots["bot-0"].statistics.collections).toBe(3);
    expect(snapshot.bots["bot-0"].statistics.collectionAttempts).toBe(3);
    expect(snapshot.bots["bot-0"].harvested).toEqual({ "-2,0": { food: 18, debris: 0, special: 0 } });
    session.assertInvariants();
    session.stop();
  });

  it.each([0, 10])("reports blocked objectives or final returns with %i resources without awarding a normal victory", remainingFood => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      tile.walkable = true;
      if (tile.kind !== "base") tile.kind = "danger";
    }
    world["0,0"].kind = "resource";
    world["0,0"].resources.food = remainingFood;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].damage = 90;
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord);
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].cargo.food = 5;
    bots["bot-1"].damage = 100;
    expect(pathBetween(world, "0,0", bots["bot-0"].base).length).toBeGreaterThan(1);
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const snapshot = session.getSnapshot();
    expect(snapshot.phase).toBe("blocked");
    expect(snapshot.winners).toEqual([]);
    expect(snapshot.remainingResources.food).toBe(remainingFood);
    expect(snapshot.bots["bot-0"].cargo.food).toBe(5);
    expect(snapshot.bots["bot-0"].damage).toBe(90);
    expect(snapshot.lostResources.food).toBe(0);
    session.advance(10000);
    expect(session.getSnapshot()).toEqual(snapshot);
    session.assertInvariants();
    session.stop();
  });

  it.each(["fuel", "repair", "base"] as const)("does not scan a public %s tile", kind => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const target = Object.values(world).find(tile => tile.kind === kind && tile.owner !== "bot-0")!;
    const origin = target.neighbors.find(coord => world[coord].walkable)!;
    const resource = Object.values(world).find(tile => tile.kind === "resource" && hexDistance(origin, tile.coord) > 1)!;
    resource.resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = origin;
    bots["bot-0"].offensiveDroneAvailable = false;
    bots["bot-0"].known = Object.values(world)
      .filter(tile => tile.coord !== target.coord && tile.coord !== resource.coord)
      .map(tile => tile.coord);
    markKnownResourcesScanned(world, bots["bot-0"]);
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation?.kind).toBe("move");
    expect(session.getSnapshot().bots["bot-0"].statistics.scans).toBe(0);
    session.assertInvariants();
    session.stop();
  });

  it("plans maintenance toward the public fuel station before exploring it", () => {
    const world = generateWorld(42, 3);
    const fuel = Object.values(world).find(tile => tile.kind === "fuel")!;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].fuel = RULES.fuelUrgencyThreshold;
    bots["bot-1"].damage = 100;
    expect(bots["bot-0"].explored).toContain(fuel.coord);
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].goal).toEqual({ coord: fuel.coord, reason: "fuel" });
    session.stop();
  });

  it("does not count a contested and depleted tile as a collection attempt", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["-2,0"].kind = "resource";
    world["-2,0"].walkable = true;
    world["-2,0"].resources.food = 2;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "-2,0";
    bots["bot-1"].coord = "-1,0";
    bots["bot-1"].goal = { coord: "-2,0", reason: "collect" };
    for (const bot of Object.values(bots)) bot.known = Object.values(world).map(tile => tile.coord);
    markKnownResourcesScanned(world, ...Object.values(bots));
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.collectDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].statistics.collectionAttempts).toBe(1);
    expect(snapshot.bots["bot-1"].statistics.collectionAttempts).toBe(0);
    expect(snapshot.bots["bot-0"].statistics.collections).toBe(1);
    expect(snapshot.bots["bot-1"].statistics.collections).toBe(0);
    expect(snapshot.bots["bot-0"].harvested).toEqual({ "-2,0": { food: 2, debris: 0, special: 0 } });
    expect(snapshot.bots["bot-1"].harvested).toEqual({});
    session.advance(100000);
    expect(session.getSnapshot().bots["bot-0"].harvested).toEqual(snapshot.bots["bot-0"].harvested);
    expect(session.getSnapshot().bots["bot-0"].statistics.fuelUsed).toBe(session.getSnapshot().bots["bot-0"].statistics.steps * RULES.fuelPerStep);
    session.assertInvariants();
    session.stop();
  });

  it("resolves a reproducible batch of 64 seeds", () => {
    for (let seed = 0; seed < 64; seed++) {
      const session = new GameSession(seed);
      session.advance(1000000);
      session.assertInvariants();
      const snapshot = session.getSnapshot();
      expect(["finished", "blocked"], `seed ${seed}`).toContain(snapshot.phase);
      if (snapshot.phase === "finished") {
        expect([...new Set(Object.values(snapshot.bots).flatMap(bot => reachableCoords(snapshot.world, bot.coord, snapshot.waterLevel)))].every(coord => resourceTotal(snapshot.world[coord].resources) === 0), `seed ${seed}`).toBe(true);
        expect(Object.values(snapshot.bots).every(bot => resourceTotal(bot.cargo) === 0), `seed ${seed}`).toBe(true);
      } else expect(snapshot.winners, `seed ${seed}`).toEqual([]);
      session.stop();
    }
  }, 90000);

  it.each(["fuel", "repair"] as const)("performs only the %s service at its station", service => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const station = Object.values(world).find(tile => tile.kind === service)!;
    Object.assign(bots["bot-0"], {
      coord: station.coord,
      fuel: 10,
      damage: 70,
      budget: RULES.repairPrice,
      score: RULES.repairPrice,
      deposited: { food: RULES.repairPrice, debris: RULES.repairPrice, special: 0 },
      cargo: { food: 2, debris: 3, special: 1 },
      goal: { coord: station.coord, reason: service },
    });
    const session = new GameSession(42, { world, bots });
    const duration = service === "fuel" ? RULES.fuelServiceStepMultiplier * RULES.stepDuration : RULES.serviceDuration;
    expect(session.getSnapshot().bots["bot-0"].operation).toBeNull();
    session.advance(duration - 1);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(10);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(70);
    expect(session.getSnapshot().bots["bot-0"].operation?.duration).toBe(duration);
    session.advance(1);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.fuel).toBe(service === "fuel" ? 100 : 10);
    expect(bot.damage).toBe(service === "repair" ? 0 : 70);
    expect(bot.score).toBe(RULES.repairPrice);
    expect(bot.budget).toBe(service === "repair" ? 0 : RULES.repairPrice);
    if (service === "repair") expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({
      type: "ship.repaired", delta: { damage: -70, budget: -RULES.repairPrice },
    }));
    expect(bot.cargo).toEqual(bots["bot-0"].cargo);
    session.assertInvariants();
    session.stop();
  });

  it("deposits cargo at the base while keeping damage until the repair station", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { damage: 60, fuel: 30, cargo: { food: 2, debris: 3, special: 1 } });
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.serviceDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].cargo).toEqual(emptyResources());
    expect(snapshot.bots["bot-0"].score).toBe(2);
    expect(snapshot.bots["bot-0"].budget).toBe(3);
    expect(snapshot.bots["bot-0"].actions).toBe(1);
    expect(snapshot.bots["bot-0"].fuel).toBe(30);
    expect(snapshot.bots["bot-0"].damage).toBe(60);
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "resources.deposited", botId: "bot-0", coord: bots["bot-0"].base }));
    expect(snapshot.events.some(event => event.type === "ship.repaired" && event.botId === "bot-0")).toBe(false);
    session.assertInvariants();
    session.stop();
  });

  it("credits provisions, debris and special to separate accounts", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].cargo = { food: 4, debris: 0, special: 2 };
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.serviceDuration);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.score).toBe(4);
    expect(bot.budget).toBe(0);
    expect(bot.actions).toBe(2);
    expect(bot.deposited).toEqual({ food: 4, debris: 0, special: 2 });
    session.assertInvariants();
    session.stop();
  });

  it("does not repair without enough deposited debris", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const station = Object.values(world).find(tile => tile.kind === "repair")!;
    Object.assign(bots["bot-0"], { coord: station.coord, damage: 70, budget: RULES.repairPrice - 1,
      score: RULES.repairPrice - 1, deposited: { food: RULES.repairPrice - 1, debris: RULES.repairPrice - 1, special: 0 },
      goal: { coord: station.coord, reason: "repair" } });
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation?.kind).not.toBe("service");
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(70);
    session.assertInvariants();
    session.stop();
  });

  it("prioritizes debris while short of funds and food once funded", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      if (tile.kind !== "base") { tile.kind = "plain"; tile.walkable = true; }
    }
    world["-2,0"].kind = "resource";
    world["-2,0"].resources.food = 2;
    world["-3,1"].kind = "resource";
    world["-3,1"].resources.debris = 1;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].known = Object.keys(world) as Coord[];
    markKnownResourcesScanned(world, bots["bot-0"]);
    const short = new GameSession(42, { world, bots });
    short.advance(1);
    expect(short.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-3,1" });
    short.stop();

    bots["bot-0"].budget = 8;
    bots["bot-0"].score = 8;
    bots["bot-0"].deposited.food = 8;
    bots["bot-0"].deposited.debris = 8;
    const funded = new GameSession(42, { world, bots });
    funded.advance(1);
    expect(funded.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-2,0" });
    funded.stop();
  });

  it("seeks a first special action before favoring provisions again", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      if (tile.kind !== "base") { tile.kind = "plain"; tile.walkable = true; }
    }
    world["-2,0"].kind = "resource";
    world["-2,0"].resources.food = 2;
    world["-3,1"].kind = "resource";
    world["-3,1"].resources = { food: 0, debris: 0, special: 1 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].known = Object.keys(world) as Coord[];
    bots["bot-0"].budget = 8;
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].deposited.debris = 8;
    const seeking = new GameSession(42, { world, bots });
    seeking.advance(1);
    expect(seeking.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-3,1" });
    seeking.stop();

    bots["bot-0"].actions = 1;
    bots["bot-0"].deposited.special = 1;
    const supplied = new GameSession(42, { world, bots });
    supplied.advance(1);
    expect(supplied.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-2,0" });
    supplied.stop();
  });

  it("does not plan base service for damage alone and heads to the known repair station", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const station = Object.values(world).find(tile => tile.kind === "repair")!;
    bots["bot-0"].damage = 70;
    bots["bot-0"].budget = RULES.repairPrice;
    bots["bot-0"].score = RULES.repairPrice;
    bots["bot-0"].deposited.food = RULES.repairPrice;
    bots["bot-0"].deposited.debris = RULES.repairPrice;
    bots["bot-0"].explored.push(station.coord);
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.damage).toBe(70);
    expect(bot.operation?.kind).toBe("move");
    expect(bot.goal).toEqual({ coord: station.coord, reason: "repair" });
    session.stop();
  });

  it("refuels before a repair trip that would leave too little fuel to reach the station", () => {
    const world = generateWorld(47, 5);
    const bots = { "bot-0": createBot("bot-0", world, 47), "bot-1": createBot("bot-1", world, 47) };
    Object.assign(bots["bot-0"], {
      coord: "0,1", fuel: 10, damage: 75, budget: RULES.repairPrice, score: RULES.repairPrice,
      deposited: { food: RULES.repairPrice, debris: RULES.repairPrice, special: 0 },
      explored: [...bots["bot-0"].explored, "-1,2"],
    });
    const session = new GameSession(47, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].goal?.reason).toBe("fuel");
    session.stop();
  });

  it("reduces effective radius at 50 damage and restores it after repair", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const station = Object.values(world).find(tile => tile.kind === "repair")!;
    Object.assign(bots["bot-0"], { coord: station.coord, radius: 3, damage: 50, budget: RULES.repairPrice, score: RULES.repairPrice,
      deposited: { food: RULES.repairPrice, debris: RULES.repairPrice, special: 0 }, goal: { coord: station.coord, reason: "repair" } });
    const session = new GameSession(42, { world, bots });
    expect(effectiveRadius(session.getSnapshot().bots["bot-0"])).toBe(2);
    expect(effectiveRadius({ radius: 1, damage: 50 })).toBe(1);
    expect(activeCoords(world, session.getSnapshot().bots["bot-0"]).every(coord => hexDistance(station.coord, coord) <= 2)).toBe(true);
    session.advance(RULES.serviceDuration);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(0);
    expect(effectiveRadius(session.getSnapshot().bots["bot-0"])).toBe(3);
    session.stop();
  });

  it("doubles ship movement duration at 70 damage", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].damage = 70;
    bots["bot-0"].goal = { coord: "-2,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", duration: 2 * RULES.stepDuration });
    session.advance(RULES.stepDuration - 1);
    expect(session.getSnapshot().bots["bot-0"].coord).toBe(bots["bot-0"].base);
    session.advance(RULES.stepDuration);
    expect(session.getSnapshot().bots["bot-0"].coord).toBe("-2,0");
    session.stop();
  });

  it("waits for the repair station cooldown before starting service", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const station = Object.values(world).find(tile => tile.kind === "repair")!;
    Object.assign(bots["bot-0"], { coord: station.coord, damage: 60, budget: RULES.repairPrice, score: RULES.repairPrice,
      deposited: { food: RULES.repairPrice, debris: RULES.repairPrice, special: 0 }, goal: { coord: station.coord, reason: "repair" } });
    const session = new GameSession(42, { world, bots, repairAvailableAt: 5000 });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "wait", remaining: 4999 });
    session.advance(4999);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "service", duration: RULES.serviceDuration });
    session.advance(RULES.serviceDuration);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(0);
    expect(session.getSnapshot().repairAvailableAt).toBe(5000 + RULES.serviceDuration + RULES.repairCooldown);
    session.stop();
  });

  it("takes a worthwhile known-danger shortcut to a resource tile", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      tile.walkable = true;
      if (tile.kind !== "base") tile.kind = "plain";
    }
    world["-2,0"].kind = "danger";
    world["-1,0"].kind = "resource";
    world["-1,0"].resources = { food: 100, debris: 250, special: 3 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].known.push("-2,0", "-1,0");
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].goal = { coord: "-1,0", reason: "collect" };
    bots["bot-1"].fuel = 0;
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-2,0" });
    session.stop();
  });

  it("travels to a repair station before repairing", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "0,0", fuel: 100, damage: 70, budget: RULES.repairPrice, score: RULES.repairPrice,
      deposited: { food: RULES.repairPrice, debris: RULES.repairPrice, special: 0 } });
    const repairCoord = Object.values(world).find(tile => tile.kind === "repair")!.coord;
    bots["bot-0"].explored.push(repairCoord);
    const repairPath = pathBetween(world, "0,0", repairCoord);
    const session = new GameSession(42, { world, bots });
    session.advance((repairPath.length - 1) * 2 * RULES.stepDuration - 1);
    expect(session.getSnapshot().bots["bot-0"].coord).toBe(repairPath[repairPath.length - 2]);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(70);
    session.advance(1);
    const arrived = session.getSnapshot().bots["bot-0"];
    expect(world[arrived.coord].kind).toBe("repair");
    expect(arrived.fuel).toBe(100 - (repairPath.length - 1) * RULES.fuelPerStep);
    expect(arrived.damage).toBe(70);
    session.advance(RULES.serviceDuration);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(0);
    session.assertInvariants();
    session.stop();
  });

  it("replaces only a lost drone at its own base without reducing score", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    for (const bot of Object.values(bots)) Object.assign(bot, { score: 5, budget: RULES.dronePrice, deposited: { food: 5, debris: RULES.dronePrice, special: 0 } });
    bots["bot-0"].droneAvailable = false;
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.purchaseDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].droneAvailable).toBe(true);
    expect(snapshot.bots["bot-0"].budget).toBe(0);
    expect(snapshot.bots["bot-0"].score).toBe(5);
    expect(snapshot.bots["bot-1"].budget).toBe(RULES.dronePrice);
    session.assertInvariants();
    session.stop();
  });

  it("buys radius three for its current price without ending the game", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const bot = bots["bot-0"];
    Object.assign(bot, { radius: 2, score: 8, budget: RULES.upgradePrices[2] + RULES.repairPrice,
      spent: RULES.upgradePrices[1], deposited: { food: 8, debris: RULES.upgradePrices[1] + RULES.upgradePrices[2] + RULES.repairPrice, special: 0 } });
    bot.known = Object.values(world)
      .filter(tile => hexDistance(bot.base, tile.coord) <= 2)
      .map(tile => tile.coord);
    markKnownResourcesScanned(world, bot);
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.purchaseDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].radius).toBe(3);
    expect(snapshot.bots["bot-0"].budget).toBe(RULES.repairPrice);
    expect(snapshot.bots["bot-0"].score).toBe(8);
    expect(snapshot.phase).toBe("running");
    session.assertInvariants();
    session.stop();
  });

  it("scans from the mobile ship and keeps discoveries individual", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["2,0"].resources = { food: 20, debris: 0, special: 0 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "1,0";
    bots["bot-0"].fuel = 30;
    bots["bot-0"].known = Object.values(world)
      .filter(tile => tile.coord !== "2,0")
      .map(tile => tile.coord);
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-1"].coord = "-3,0";
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation?.target).toBe("2,0");
    expect(session.getSnapshot().bots["bot-0"].scanned).not.toContain("2,0");
    expect(session.getSnapshot().bots["bot-1"].known).not.toContain("2,0");
    session.advance(RULES.stepDuration - 1);
    expect(activeCoords(world, session.getSnapshot().bots["bot-0"])).not.toContain("3,0");
    expect(session.getSnapshot().bots["bot-0"].explored).not.toContain("3,0");
    session.advance(RULES.scanDuration + RULES.stepDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].known).toContain("2,0");
    expect(snapshot.bots["bot-0"].scanned).toContain("2,0");
    expect(snapshot.bots["bot-0"].coord).toBe("1,0");
    expect(snapshot.bots["bot-0"].fuel).toBe(28);
    expect(snapshot.bots["bot-0"].statistics.fuelUsed).toBe(2);
    expect(activeCoords(world, snapshot.bots["bot-0"])).not.toContain("3,0");
    expect(snapshot.bots["bot-0"].explored).not.toContain("3,0");
    expect(snapshot.bots["bot-1"].known).not.toContain("2,0");
    expect(snapshot.bots["bot-1"].scanned).not.toContain("2,0");
    expect(resourceMarkerCoords(world, activeCoords(world, snapshot.bots["bot-0"]), snapshot.bots["bot-0"].scanned)).toContain("2,0");
    session.assertInvariants();
    session.stop();
  });

  it("sends a drone with insufficient scan fuel to a fuel station", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["0,0"].kind = "plain";
    world["0,0"].walkable = true;
    world["0,1"].kind = "fuel";
    world["0,1"].walkable = true;
    world["2,0"].resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].fuel = 3;
    bots["bot-0"].radius = 2;
    bots["bot-0"].known = Object.values(world).filter(tile => tile.coord !== "2,0").map(tile => tile.coord);
    markKnownResourcesScanned(world, bots["bot-0"]);
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.operation?.kind).toBe("move");
    expect(bot.goal?.reason).toBe("fuel");
    expect(bot.known).not.toContain("2,0");
    session.stop();
  });

  it.each([0, 1])("does not move or refuel a ship with %i fuel at its base", fuel => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].fuel = fuel;
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.state).toBe("finished");
    expect(bot.fuel).toBe(fuel);
    expect(session.getSnapshot().events.some(event => event.botId === bot.id && event.type === "fuel.refueled")).toBe(false);
    session.stop();
  });

  it("applies danger damage once per arrival and charges every waypoint", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) { tile.walkable = axial(tile.coord)[1] === 0; tile.level = undefined; }
    world["-1,0"].kind = "danger";
    world["-1,0"].resources = emptyResources();
    world["0,0"].kind = "resource";
    world["0,0"].resources = { food: 20, debris: 0, special: 0 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "-2,0", fuel: 90, goal: { coord: "0,0", reason: "collect" } });
    bots["bot-0"].scanned.push("0,0");
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.stepDuration);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(RULES.dangerDamage);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(88);
    session.advance(RULES.stepDuration);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.coord).toBe("0,0");
    expect(bot.damage).toBe(RULES.dangerDamage);
    expect(bot.fuel).toBe(86);
    expect(bot.statistics.steps).toBe(2);
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({
      type: "danger.impact",
      botId: "bot-0",
      coord: "-1,0",
      reason: "terrain",
      delta: { damage: RULES.dangerDamage },
    }));
    session.assertInvariants();
    session.stop();
  });

  it("deposits final cargo before awarding a tie", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "-2,0", cargo: { food: 2, debris: 0, special: 0 } });
    Object.assign(bots["bot-1"], { coord: "2,0", cargo: { food: 2, debris: 0, special: 0 } });
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.stepDuration);
    expect(session.getSnapshot().phase).toBe("returning");
    expect(session.getSnapshot().winners).toEqual([]);
    session.advance(RULES.serviceDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.phase).toBe("finished");
    expect(snapshot.winners).toEqual(["bot-0", "bot-1"]);
    expect(snapshot.bots["bot-0"].score).toBe(2);
    expect(snapshot.bots["bot-1"].score).toBe(2);
    session.assertInvariants();
    session.stop();
  });

  it("awards victory from provisions even when the rival has more debris and actions", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { score: 10, deposited: { food: 10, debris: 0, special: 0 } });
    Object.assign(bots["bot-1"], { score: 5, budget: 100, actions: 2,
      deposited: { food: 5, debris: 100, special: 2 } });
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().phase).toBe("finished");
    expect(session.getSnapshot().winners).toEqual(["bot-0"]);
    session.assertInvariants();
    session.stop();
  });

  it.each([1, 2, 3])("loses a drone and reveals danger exactly on arrival at distance %i without damaging its distant ship", distance => {
    const world = generateWorld(42, 4);
    const target = `${distance},0` as const;
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world[target].kind = "danger";
    world[target].walkable = true;
    world["-4,1"].resources = { food: 20, debris: 0, special: 0 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].radius = distance;
    bots["bot-0"].known = Object.values(world)
      .filter(tile => ![target, "-4,1"].includes(tile.coord))
      .map(tile => tile.coord);
    markKnownResourcesScanned(world, bots["bot-0"]);
    const session = new GameSession(42, { world, bots });
    session.advance(distance * RULES.stepDuration - 1);
    expect(session.getSnapshot().bots["bot-0"].droneAvailable).toBe(true);
    expect(session.getSnapshot().bots["bot-0"].known).not.toContain(target);
    session.advance(1);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.droneAvailable).toBe(false);
    expect(bot.radius).toBe(RULES.initialExplorationRadius);
    expect(bot.statistics.droneLosses).toBe(1);
    expect(bot.statistics.scans).toBe(1);
    expect(bot.known).toContain(target);
    expect(bot.scanned).toContain(target);
    expect(bot.damage).toBe(0);
    expect(bot.coord).toBe("0,0");
    expect(bot.fuel).toBe(RULES.fuelCapacity - distance * RULES.droneFuelPerHex);
    expect(bot.statistics.fuelUsed).toBe(distance * RULES.droneFuelPerHex);
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({
      botId: "bot-0",
      type: "drone.lost",
      category: "incident",
      coord: target,
    }));
    const singleAdvance = new GameSession(42, { world, bots });
    singleAdvance.advance(distance * RULES.stepDuration);
    expect({ ...session.getSnapshot(), revision: 0 }).toEqual({ ...singleAdvance.getSnapshot(), revision: 0 });
    singleAdvance.stop();
    session.assertInvariants();
    session.stop();
  });

  it("resets drone vision after a loss and charges each replacement upgrade again", () => {
    const world = generateWorld(42, 4);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["-2,0"].kind = "danger";
    world["-2,0"].walkable = true;
    world["-2,1"].kind = "resource";
    world["-2,1"].walkable = true;
    world["-2,1"].resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], {
      radius: 2,
      score: 15,
      budget: 15,
      deposited: { food: 15, debris: 15, special: 0 },
    });
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord).filter(coord => coord !== "-2,0" && coord !== "-2,1");
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-1"].damage = 100;
    const session = new GameSession(42, { world, bots });
    expect(activeCoords(world, session.getSnapshot().bots["bot-0"])).toContain("-2,0");

    session.advance(2 * RULES.stepDuration);
    let bot = session.getSnapshot().bots["bot-0"];
    expect(bot.droneAvailable).toBe(false);
    expect(bot.radius).toBe(1);
    expect(activeCoords(world, bot)).not.toContain("-2,0");
    expect(bot.explored).toContain("-2,0");
    expect(bot.operation?.kind).toBe("purchase");
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "drone.lost", after: { radius: 1 } }));

    session.advance(RULES.purchaseDuration);
    bot = session.getSnapshot().bots["bot-0"];
    expect(bot.droneAvailable).toBe(true);
    expect(bot.radius).toBe(1);
    expect(bot.budget).toBe(11);

    session.advance(RULES.purchaseDuration);
    bot = session.getSnapshot().bots["bot-0"];
    expect(bot.radius).toBe(2);
    expect(bot.budget).toBe(8);

    session.advance(RULES.purchaseDuration);
    bot = session.getSnapshot().bots["bot-0"];
    expect(bot.radius).toBe(3);
    expect(bot.budget).toBe(RULES.repairPrice);
    expect(bot.score).toBe(15);
    session.assertInvariants();
    session.stop();
  });

  it("immobilizes a ship at 100 damage while preserving its cargo and score", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], {
      damage: 100,
      score: 20,
      budget: 20,
      deposited: { food: 20, debris: 20, special: 0 },
      cargo: { food: 2, debris: 0, special: 0 },
    });
    const session = new GameSession(42, { world, bots });
    session.advance(100);
    const snapshot = session.getSnapshot();
    expect(snapshot.winners).toEqual([]);
    expect(snapshot.phase).toBe("blocked");
    expect(snapshot.bots["bot-0"].state).toBe("disabled");
    expect(snapshot.bots["bot-0"].cargo.food).toBe(2);
    expect(snapshot.bots["bot-0"].score).toBe(20);
    expect(snapshot.lostResources.food).toBe(0);
    expect(snapshot.events.filter(event => event.botId === "bot-0")).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "ship.disabled", reason: "Vaisseau immobilise : remorquage requis" }),
    ]));
    session.assertInvariants();
    session.stop();
  });

  it("keeps cargo on the ship when a mine impact reaches 100 damage", () => {
    const world = generateWorld(42, 3);
    world["-2,1"].walkable = true;
    world["-2,1"].kind = "plain";
    world["-2,1"].resources = emptyResources();
    world["-2,0"].mine = { owner: "bot-1", state: "armed", armsAt: 0 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "-2,1", damage: 60, offensiveDroneAvailable: false,
      cargo: { food: 2, debris: 0, special: 0 }, goal: { coord: "-2,0", reason: "explore" } });
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.stepDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].state).toBe("disabled");
    expect(snapshot.bots["bot-0"].damage).toBe(100);
    expect(snapshot.bots["bot-0"].coord).toBe("-2,0");
    expect(snapshot.bots["bot-0"].cargo.food).toBe(2);
    expect(snapshot.bots["bot-0"].operation).toBeNull();
    expect(snapshot.events).toContainEqual(expect.objectContaining({ type: "ship.disabled", botId: "bot-0" }));
    expect(snapshot.events.some(event => event.type === "cargo.lost" && event.botId === "bot-0")).toBe(false);
    session.assertInvariants();
    session.stop();
  });

  it.each([0, 1, 42, 4294967295])("settles seed %i without duplicating resources or exceeding compartments", seed => {
    const session = new GameSession(seed);
    for (let step = 0; step < 1000 && !["finished", "blocked"].includes(session.getSnapshot().phase); step++) {
      session.advance(1000);
      session.assertInvariants();
    }
    const snapshot = session.getSnapshot();
    expect(["finished", "blocked"]).toContain(snapshot.phase);
    if (snapshot.phase === "finished") {
      expect([...new Set(Object.values(snapshot.bots).flatMap(bot => reachableCoords(snapshot.world, bot.coord, snapshot.waterLevel)))].every(coord => resourceTotal(snapshot.world[coord].resources) === 0)).toBe(true);
      expect(Object.values(snapshot.bots).every(bot => resourceTotal(bot.cargo) === 0)).toBe(true);
    } else expect(snapshot.winners).toEqual([]);
    session.stop();
  });

  it("pauses logical time and produces the same result with different frame sizes", () => {
    const first = new GameSession(42);
    const second = new GameSession(42);
    first.advance(10000);
    for (let frame = 0; frame < 100; frame++) second.advance(100);
    const normalize = (session: GameSession) => {
      const snapshot = session.getSnapshot();
      return { ...snapshot, revision: 0 };
    };
    expect(normalize(first)).toEqual(normalize(second));
    first.setPaused(true);
    const paused = first.getSnapshot();
    first.advance(50000);
    expect(first.getSnapshot()).toEqual(paused);
    first.step();
    expect(first.getSnapshot().elapsed).toBe(paused.elapsed + 100);
    expect(first.getSnapshot().paused).toBe(true);
    first.stop();
    second.stop();
  });

  it("rescues an out-of-fuel ship without adding cargo to the score", () => {
    const world = generateWorld(1, 3);
    const bots = { "bot-0": createBot("bot-0", world, 1), "bot-1": createBot("bot-1", world, 1) };
    Object.assign(bots["bot-0"], { coord: "-2,0", fuel: 0, cargo: { food: 2, debris: 1, special: 1 } });
    const session = new GameSession(1, { world, bots });
    session.advance(5000);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].coord).toBe("-3,0");
    expect(snapshot.bots["bot-0"].score).toBe(0);
    expect(snapshot.lostResources).toEqual({ food: 2, debris: 1, special: 1 });
    expect(snapshot.events.filter(event => event.botId === "bot-0")).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "fuel.stranded", coord: "-2,0" }),
      expect.objectContaining({ type: "cargo.lost", reason: "remorquage", resources: { food: 2, debris: 1, special: 1 } }),
      expect.objectContaining({ type: "rescue.completed", target: "-3,0" }),
    ]));
    session.assertInvariants();
    session.stop();
  });

  it("blocks a session when both ships are immobilized", () => {
    const world = generateWorld(1, 3);
    const bots = { "bot-0": createBot("bot-0", world, 1), "bot-1": createBot("bot-1", world, 1) };
    bots["bot-0"].damage = 100;
    bots["bot-1"].damage = 100;
    const session = new GameSession(1, { world, bots });
    session.advance(100);
    expect(session.getSnapshot().phase).toBe("blocked");
    expect(Object.values(session.getSnapshot().bots).every(bot => bot.state === "disabled")).toBe(true);
    expect(session.getSnapshot().winners).toEqual([]);
    session.assertInvariants();
    session.stop();
  });

  it("serializes contested collection of stock larger than one compartment", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["-2,0"].kind = "resource";
    world["-2,0"].walkable = true;
    world["-2,0"].resources = { food: 12, debris: 12, special: 3 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "-2,0";
    bots["bot-1"].coord = "-1,0";
    bots["bot-1"].goal = { coord: "-2,0", reason: "collect" };
    for (const bot of Object.values(bots)) bot.known = Object.values(world).map(tile => tile.coord);
    markKnownResourcesScanned(world, ...Object.values(bots));
    const session = new GameSession(42, { world, bots });
    session.advance(3000);
    const snapshot = session.getSnapshot();
    const collected = Object.values(snapshot.bots).reduce((total, bot) => addResources(total, addResources(bot.cargo, bot.deposited)), emptyResources());
    expect(collected).toEqual({ food: 12, debris: 12, special: 3 });
    expect(resourceTotal(snapshot.remainingResources)).toBe(0);
    session.assertInvariants();
    session.stop();
  });

  it("rejects an initial scenario with two bots on the same tile", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-1"].coord = bots["bot-0"].coord;
    expect(() => new GameSession(42, { world, bots })).toThrow("Bots cannot start on the same tile");
  });

  it("reserves a contested resource on the final step and releases the loser without spending fuel", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["-2,0"].kind = "resource";
    world["-2,0"].walkable = true;
    world["-2,0"].resources.food = 2;
    world["-1,0"].walkable = true;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-1"].coord = "-1,0";
    for (const bot of Object.values(bots)) {
      bot.known = ["-2,0"];
      markKnownResourcesScanned(world, bot);
      bot.goal = { coord: "-2,0", reason: "collect" };
    }
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    let snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-2,0" });
    expect(snapshot.bots["bot-1"].operation).toMatchObject({ kind: "wait", target: "-2,0" });
    expect(snapshot.bots["bot-1"].fuel).toBe(RULES.fuelCapacity);
    expect(snapshot.trust).toEqual({ "bot-0": 55, "bot-1": 50 });
    expect(snapshot.lastTrustChange["bot-0"]?.trust).toMatchObject({ toward: "bot-1", cause: "yield", delta: 5 });
    session.advance(RULES.stepDuration - 1);
    snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].operation?.kind).toBe("collect");
    expect(snapshot.bots["bot-1"].coord).toBe("-1,0");
    session.advance(RULES.collectDuration + RULES.stepDuration);
    snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-1"].coord).toBe("-1,0");
    expect(snapshot.bots["bot-1"].statistics.collections).toBe(0);
    expect(snapshot.bots["bot-1"].fuel).toBe(RULES.fuelCapacity);
    expect(snapshot.trust).toEqual({ "bot-0": 55, "bot-1": 42 });
    expect(snapshot.lastTrustChange["bot-1"]?.trust).toMatchObject({ toward: "bot-0", cause: "depletion", delta: -8 });
    expect(snapshot.events.filter(event => event.trust?.cause === "yield")).toHaveLength(1);
    const withoutNewEvents = session.getSnapshot(snapshot.eventSequence);
    expect(withoutNewEvents.events).toEqual([]);
    expect(withoutNewEvents.lastTrustChange).toEqual(snapshot.lastTrustChange);
    session.assertInvariants();
    session.stop();
  });

  it("keeps an occupied intermediate waypoint flyable", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    for (const coord of ["-2,0", "-1,0"] as const) {
      world[coord].kind = "resource";
      world[coord].walkable = true;
      world[coord].resources.food = 20;
    }
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].known.push("-1,0");
    markKnownResourcesScanned(world, bots["bot-0"]);
    bots["bot-0"].goal = { coord: "-1,0", reason: "collect" };
    bots["bot-1"].coord = "-2,0";
    bots["bot-1"].known.push("-2,0");
    markKnownResourcesScanned(world, bots["bot-1"]);
    bots["bot-1"].droneAvailable = false;
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-2,0" });
    expect(session.getSnapshot().bots["bot-1"].operation?.kind).toBe("collect");
    session.advance(RULES.stepDuration - 1);
    const passing = session.getSnapshot();
    expect(passing.bots["bot-0"].coord).toBe("-2,0");
    expect(passing.bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-1,0" });
    expect(passing.bots["bot-1"].operation?.kind).toBe("collect");
    session.assertInvariants();
    session.stop();
  });

  it("queues for the fuel station without consuming fuel while waiting", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const station = Object.values(world).find(tile => tile.kind === "fuel")!;
    const neighbors = station.neighbors.filter(coord => world[coord].walkable);
    const resource = Object.values(world).find(tile => tile.kind === "resource" && !neighbors.includes(tile.coord))!;
    resource.resources.food = 40;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    for (const [index, bot] of Object.values(bots).entries()) {
      bot.coord = neighbors[index];
      bot.fuel = 10;
      bot.explored = Object.keys(world) as (typeof bot.coord)[];
      bot.known = Object.keys(world) as (typeof bot.coord)[];
      markKnownResourcesScanned(world, bot);
      bot.droneAvailable = false;
      bot.goal = { coord: station.coord, reason: "fuel" };
    }
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    let snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].operation).toMatchObject({ kind: "move", target: station.coord });
    expect(snapshot.bots["bot-1"].operation).toMatchObject({ kind: "wait", target: station.coord });
    session.advance(RULES.stepDuration - 1);
    snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].operation?.kind).toBe("service");
    expect(snapshot.bots["bot-1"].coord).toBe(neighbors[1]);
    expect(snapshot.bots["bot-1"].fuel).toBe(10);
    session.advance(RULES.fuelServiceStepMultiplier * RULES.stepDuration + RULES.stepDuration);
    snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].fuel).toBe(RULES.fuelCapacity - RULES.fuelPerStep);
    expect(snapshot.bots["bot-1"].coord).toBe(station.coord);
    expect(snapshot.bots["bot-1"].operation?.kind).toBe("service");
    expect(snapshot.bots["bot-1"].fuel).toBe(10 - RULES.fuelPerStep);
    session.assertInvariants();
    session.stop();
  });

  it("lets two waiting bots exchange adjacent destinations in one airborne crossing", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["-2,0"].kind = "resource";
    world["-2,0"].walkable = true;
    world["-2,0"].resources.food = 40;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-1"].coord = "-2,0";
    bots["bot-0"].goal = { coord: "-2,0", reason: "collect" };
    bots["bot-0"].scanned.push("-2,0");
    bots["bot-1"].goal = { coord: "-3,0", reason: "explore" };
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const moving = session.getSnapshot();
    expect(moving.bots["bot-0"].operation).toMatchObject({ kind: "move", target: "-2,0" });
    expect(moving.bots["bot-1"].operation).toMatchObject({ kind: "move", target: "-3,0" });
    session.advance(RULES.stepDuration - 1);
    const arrived = session.getSnapshot();
    expect(arrived.bots["bot-0"].coord).toBe("-2,0");
    expect(arrived.bots["bot-1"].coord).toBe("-3,0");
    session.assertInvariants();
    session.stop();
  });

  it("buys an individual radius upgrade without reducing the score", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const bot = bots["bot-0"];
    bot.deposited = { food: 8, debris: RULES.upgradePrices[1] + RULES.repairPrice, special: 0 };
    bot.score = 8;
    bot.budget = RULES.upgradePrices[1] + RULES.repairPrice;
    bot.known = Object.values(world)
      .filter(tile => hexDistance(bot.base, tile.coord) <= 1)
      .map(tile => tile.coord);
    markKnownResourcesScanned(world, bot);
    const session = new GameSession(42, { world, bots });
    session.advance(1000);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].radius).toBe(2);
    expect(snapshot.bots["bot-1"].radius).toBe(1);
    expect(snapshot.bots["bot-0"].budget).toBe(RULES.repairPrice);
    expect(snapshot.bots["bot-0"].score).toBe(8);
    session.assertInvariants();
    session.stop();
  });

  it("charges the last return step and deposits at the base without refueling", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "-2,0", fuel: 30, cargo: { food: 2, debris: 1, special: 2 } });
    const session = new GameSession(42, { world, bots });
    session.advance(400);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(28);
    expect(session.getSnapshot().bots["bot-0"].score).toBe(0);
    session.advance(1200);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(28);
    expect(session.getSnapshot().bots["bot-0"].score).toBe(2);
    expect(session.getSnapshot().bots["bot-0"].budget).toBe(1);
    expect(session.getSnapshot().bots["bot-0"].actions).toBe(2);
    expect(session.getSnapshot().events).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "resources.deposited", botId: "bot-0", resources: { food: 2, debris: 1, special: 2 } }),
    ]));
    expect(session.getSnapshot().events.some(event => event.type === "fuel.refueled" && event.botId === "bot-0")).toBe(false);
    session.assertInvariants();
    session.stop();
  });
});

describe("player beacon", () => {
  it("waits for the current operation, then follows a visible exploration request", () => {
    const world = generateWorld(42, 3);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].radius = 3;
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    const running = session.getSnapshot().bots["bot-0"].operation!;
    const current = session.getSnapshot().bots["bot-0"];
    const target = activeCoords(world, current).find(coord => coord !== running.target && !current.known.includes(coord) &&
      ["resource", "plain", "danger"].includes(world[coord].kind))!;
    expect(target).toBeDefined();
    session.placeBeacon("bot-0", target, "explore");
    expect(session.getSnapshot().bots["bot-0"].operation).toEqual(running);
    expect(session.getSnapshot().beacon).toMatchObject({ status: "pending", coord: target });
    session.advance(running.remaining);
    const after = session.getSnapshot();
    expect(after.beacon).toMatchObject({ status: "followed", coord: target });
    expect(after.bots["bot-0"].operation).toMatchObject({ kind: "scan", target });
    expect(after.events).toContainEqual(expect.objectContaining({ type: "beacon.followed", botId: "bot-0", coord: target }));
    session.assertInvariants();
    session.stop();
  });

  it("expires when the running scan has already explored the requested tile", () => {
    const session = new GameSession(42, { radius: 3 });
    session.advance(1);
    const running = session.getSnapshot().bots["bot-0"].operation!;
    expect(running.kind).toBe("scan");
    session.placeBeacon("bot-0", running.target, "explore");
    session.advance(running.remaining);
    expect(session.getSnapshot().beacon).toMatchObject({ status: "expired", coord: running.target });
    expect(session.getSnapshot().events).toContainEqual(expect.objectContaining({ type: "beacon.expired", botId: "bot-0" }));
    session.stop();
  });

  it("routes a known resource request once and rejects a second beacon", () => {
    const world = generateWorld(42, 3);
    const base = "-3,0" as Coord;
    const target = world[base].neighbors.find(coord => world[coord].walkable && canStep(world, base, coord, tideLevel(0)))!;
    world[target] = { ...world[target], kind: "resource", resources: { food: 2, debris: 0, special: 0 } };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].known.push(target);
    markKnownResourcesScanned(world, bots["bot-0"]);
    const session = new GameSession(42, { world, bots });
    session.placeBeacon("bot-0", target, "collect");
    expect(() => session.placeBeacon("bot-1", target, "collect")).toThrow(/deja ete utilisee/);
    session.advance(1);
    expect(session.getSnapshot().beacon?.status).toBe("followed");
    expect(session.getSnapshot().bots["bot-0"].goal).toMatchObject({ coord: target, reason: "collect" });
    session.advance(RULES.stepDuration + RULES.collectDuration);
    expect(session.getSnapshot().bots["bot-0"].cargo.food).toBe(2);
    session.assertInvariants();
    session.stop();
  });
});

describe("session protocol", () => {
  it("validates beacon commands against the current game and resets their use", () => {
    const host = new SessionHost("beacon-host", 42);
    const start = host.receive({ protocol: 1, type: "CONNECT" });
    const bot = start.snapshot!.bots["bot-0"];
    const target = activeCoords(start.snapshot!.world, bot).find(coord => !bot.known.includes(coord) &&
      ["resource", "plain", "danger"].includes(start.snapshot!.world[coord].kind))!;
    expect(target).toBeDefined();
    const command = { protocol: 1, type: "BEACON", gameId: start.gameId, botId: "bot-0", coord: target, kind: "explore" };
    expect(host.receive({ ...command, coord: "999,999" }).type).toBe("ERROR");
    expect(host.receive({ ...command, kind: "other" }).type).toBe("ERROR");
    expect(host.receive(command).snapshot!.beacon).toMatchObject({ status: "pending", coord: target });
    expect(host.receive(command).type).toBe("ERROR");
    const reset = host.receive({ protocol: 1, type: "RESET", gameId: start.gameId, seed: 42 });
    expect(reset.snapshot!.beacon).toBeNull();
    expect(host.receive(command).type).toBe("ERROR");
    expect(host.receive({ ...command, gameId: reset.gameId }).snapshot!.beacon).toMatchObject({ status: "pending" });
    host.stop();
  });

  it("disconnects an expired client immediately, reconnects and times out a missing handshake", () => {
    vi.useFakeTimers();
    const port = {
      onmessage: null as MessagePort["onmessage"],
      onmessageerror: null,
      start: vi.fn(),
      close: vi.fn(),
      postMessage: vi.fn(),
    };
    class TestWorker {
      static instances = 0;
      port = port;
      constructor() {
        TestWorker.instances++;
      }
    }
    vi.stubGlobal("SharedWorker", TestWorker);
    const store = useSessionStore.getState();
    const host = new SessionHost("client-test", 42);
    const response = host.receive({ protocol: 1, type: "CONNECT" });
    const emit = (data: unknown) => port.onmessage?.call(port as unknown as MessagePort, { data } as MessageEvent);
    try {
      store.connect();
      store.connect();
      expect(TestWorker.instances).toBe(1);
      emit(response);
      expect(useSessionStore.getState().status).toBe("connected");
      expect(useSessionStore.getState().snapshot?.schemaVersion).toBe(19);
      const initialEvents = response.snapshot!.events;
      const additionalEvent = { ...initialEvents[0], sequence: response.snapshot!.eventSequence + 1, time: 100 };
      const incremental = { ...response, snapshot: { ...response.snapshot!, eventSequence: additionalEvent.sequence, events: [additionalEvent] } };
      emit(incremental);
      emit(incremental);
      expect(useSessionStore.getState().snapshot?.events).toEqual([...initialEvents, additionalEvent]);
      emit({ ...response, type: "DISCONNECTED", error: "Port expire" });
      expect(useSessionStore.getState().status).toBe("disconnected");
      expect(useSessionStore.getState().error).toBe("Port expire");
      expect(port.close).toHaveBeenCalled();
      store.connect();
      emit(response);
      expect(TestWorker.instances).toBe(2);
      expect(useSessionStore.getState().gameId).toBe(response.gameId);
      expect(useSessionStore.getState().error).toBeNull();
      store.disconnect();
      store.connect();
      vi.advanceTimersByTime(5000);
      expect(useSessionStore.getState().status).toBe("disconnected");
      expect(useSessionStore.getState().error).toBe("Le moteur ne repond pas");
      store.connect();
      emit({ ...response, snapshot: { ...response.snapshot, schemaVersion: 1 } });
      expect(useSessionStore.getState().status).toBe("disconnected");
      expect(useSessionStore.getState().error).toContain("Version du moteur incompatible");
      store.connect();
      emit(response);
      expect(useSessionStore.getState().status).toBe("connected");
    } finally {
      store.disconnect();
      host.stop();
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });

  it("keeps initialization idempotent and rejects stale and malformed commands", () => {
    const host = new SessionHost("host", 0);
    const first = host.receive({ protocol: 1, type: "CONNECT" });
    expect(first.snapshot!.mapRadius).toBe(5);
    expect(Object.keys(first.snapshot!.world)).toHaveLength(91);
    host.advance(1000);
    const second = host.receive({ protocol: 1, type: "INIT" });
    expect(second.gameId).toBe(first.gameId);
    expect(second.snapshot!.elapsed).toBe(1000);
    const reset = host.receive({ protocol: 1, type: "RESET", gameId: first.gameId, seed: 42, radius: 3 });
    expect(reset.gameId).not.toBe(first.gameId);
    expect(reset.snapshot!.seed).toBe(42);
    expect(reset.snapshot!.mapRadius).toBe(3);
    expect(Object.keys(reset.snapshot!.world)).toHaveLength(37);
    expect(reset.snapshot!.elapsed).toBe(0);
    const cursor = reset.snapshot!.eventSequence;
    expect(host.snapshot(null, cursor).snapshot!.events).toEqual([]);
    host.advance(1000);
    expect(host.snapshot(null, cursor).snapshot!.events.every(event => event.sequence > cursor)).toBe(true);
    expect(host.receive({ protocol: 1, type: "RESET", gameId: first.gameId, seed: 99 }).type).toBe("ERROR");
    expect(host.receive({ protocol: 1, type: "RESET", gameId: reset.gameId, seed: 42, radius: 1 }).type).toBe("ERROR");
    expect(host.receive({ protocol: 1, type: "RESET", gameId: reset.gameId, seed: 42, radius: 9 }).type).toBe("ERROR");
    expect(host.snapshot().snapshot!.mapRadius).toBe(3);
    expect(host.receive({ protocol: 1, type: "CONTROL", gameId: reset.gameId, command: "SPEED", speed: "8" }).type).toBe("ERROR");
    expect(host.receive(null).type).toBe("ERROR");
    expect(host.receive({ protocol: 1, type: ["PING"] }).type).toBe("ERROR");
    expect(host.receive({ protocol: 1, type: "CONTROL", gameId: reset.gameId, command: ["PAUSE"] }).type).toBe("ERROR");
    host.receive({ protocol: 1, type: "CONTROL", gameId: reset.gameId, command: "PAUSE" });
    const pausedElapsed = host.snapshot().snapshot!.elapsed;
    expect(host.advance(10000)).toBe(false);
    expect(host.snapshot().snapshot!.elapsed).toBe(pausedElapsed);
    host.stop();
  });

  it("shares a requested radius across the session and can reset it again", () => {
    const host = new SessionHost("sizes", 42);
    const initial = host.receive({ protocol: 1, type: "CONNECT" });
    const large = host.receive({ protocol: 1, type: "RESET", gameId: initial.gameId, seed: 42, radius: 8 });
    expect(large.snapshot!.mapRadius).toBe(8);
    expect(Object.keys(large.snapshot!.world)).toHaveLength(217);
    expect(large.snapshot!.bots["bot-0"].base).toBe("-8,0");
    const small = host.receive({ protocol: 1, type: "RESET", gameId: large.gameId, seed: 42, radius: 2 });
    expect(small.snapshot!.mapRadius).toBe(2);
    expect(Object.keys(small.snapshot!.world)).toHaveLength(19);
    expect(small.snapshot!.bots["bot-0"].base).toBe("-2,0");
    host.stop();
  });
});

describe("hexagonal world", () => {
  it("carves a varying, symmetric coastline that stays outside the game", () => {
    const silhouettes = new Set<string>();
    for (let seed = 0; seed < 24; seed++) {
      const world = generateWorld(seed, 5);
      const coast = Object.values(world).filter(tile => tile.kind === "empty");
      silhouettes.add(coast.map(tile => tile.coord).join("|"));
      expect(coast.length).toBeGreaterThanOrEqual(2);
      expect(reachableCoords(world, "-5,0")).toHaveLength(Object.values(world).filter(tile => tile.walkable).length);
      for (const tile of coast) {
        const [q, r] = axial(tile.coord);
        const ring = hexDistance("0,0", tile.coord);
        expect(ring).toBeGreaterThanOrEqual(4);
        expect(world[`${-q},${-r}`].kind).toBe("empty");
        expect(tile.walkable).toBe(false);
        expect(resourceTotal(tile.resources)).toBe(0);
        expect(pathBetween(world, "-5,0", tile.coord)).toEqual([]);
        if (ring === 4) expect(tile.neighbors.some(neighbor => world[neighbor].kind === "empty" && hexDistance("0,0", neighbor) === 5)).toBe(true);
        const landNeighbor = tile.neighbors.find(neighbor => world[neighbor].walkable);
        if (landNeighbor) expect(activeCoords(world, { coord: landNeighbor, radius: 3 })).not.toContain(tile.coord);
      }
    }
    expect(silhouettes.size).toBeGreaterThan(8);
  });

  it("starts with a layered route to the tower", () => {
    for (const radius of [2, 5, 8]) {
      const world = generateWorld(42, radius);
      expect(new Set(Object.values(world).map(tileLevel))).toEqual(radius === 2 ? new Set([0, 2, 3, 4, 5]) : new Set([0, 1, 2, 3, 4, 5]));
      expect(world["0,0"].kind).toBe("tower");
      expect(world["0,1"].kind).toBe("ramp");
      expect(world["0,-1"].kind).toBe("ramp");
      expect(tileLevel(world["0,0"])).toBe(5);
      expect(tileLevel(world["0,1"])).toBe(4);
      expect(tileLevel(world["0,-1"])).toBe(4);
      expect(Object.values(world).filter(tile => tile.kind === "base").every(tile => tileLevel(tile) === 3)).toBe(true);
      for (const base of [`${-radius},0`, `${radius},0`] as Coord[]) {
        const path = pathBetween(world, base, "0,0");
        expect(path.length).toBeGreaterThan(1);
        for (let index = 1; index < path.length; index++) expect(canStep(world, path[index - 1], path[index])).toBe(true);
      }
    }
  });

  it("rejects jumps over two levels even between adjacent walkable tiles", () => {
    const world = generateWorld(42, 3);
    for (const tile of Object.values(world)) { tile.kind = "plain"; tile.level = undefined; tile.walkable = true; }
    world["1,0"].kind = "tower";
    expect(canStep(world, "0,0", "1,0")).toBe(false);
    expect(pathBetween(world, "0,0", "1,0")).toEqual([]);
    world["1,-1"].kind = "ramp";
    expect(pathBetween(world, "0,0", "1,0")).toEqual(["0,0", "1,-1", "1,0"]);
    world["1,-1"].walkable = false;
    expect(pathBetween(world, "0,0", "1,0")).toEqual([]);
    world["0,1"].kind = "empty";
    expect(canStep(world, "0,0", "0,1")).toBe(false);
    expect(pathBetween(world, "0,0", "0,1")).toEqual([]);
  });

  it("keeps special action resources rare and symmetric", () => {
    for (let seed = 0; seed < 100; seed++) {
      const world = generateWorld(seed, 3);
      expect(Object.values(world).reduce((total, tile) => total + tile.resources.special, 0)).toBe(2);
      for (const tile of Object.values(world)) {
        const [column, row] = axial(tile.coord);
        expect(tile.resources.special).toBeLessThanOrEqual(1);
        expect(tile.resources.special).toBe(world[`${-column},${-row}`].resources.special);
      }
    }
  });

  it("puts one small find on each resource tile, with a rarer debris and special tier", () => {
    const totals = { food: 0, debris: 0, special: 0 };
    for (let seed = 0; seed < 24; seed++) {
      const world = generateWorld(seed, 5);
      expect(world["-4,0"].resources.debris).toBeGreaterThan(0);
      expect(world["4,0"].resources.debris).toBeGreaterThan(0);
      for (const tile of Object.values(world)) {
        if (tile.kind !== "resource") continue;
        expect(Object.values(tile.resources).filter(value => value > 0)).toHaveLength(1);
        expect(resourceTotal(tile.resources)).toBeGreaterThanOrEqual(1);
        expect(resourceTotal(tile.resources)).toBeLessThanOrEqual(2);
        for (const kind of ["food", "debris", "special"] as const)
          if (tile.resources[kind] > 0) totals[kind]++;
      }
    }
    expect(totals.food).toBeGreaterThan(totals.debris);
    expect(totals.debris).toBeGreaterThan(totals.special);
  });
  it("varies the single shared stations while keeping both bases close to each service", () => {
    const layouts = new Set<string>();
    for (let seed = 0; seed < 64; seed++) {
      const world = generateWorld(seed, 3);
      const fuel = Object.values(world).find(tile => tile.kind === "fuel")!;
      const repair = Object.values(world).find(tile => tile.kind === "repair")!;
      layouts.add(`${fuel.coord}|${repair.coord}`);
      for (const station of [fuel, repair]) {
        const distances = (["-3,0", "3,0"] as const).map(base => pathBetween(world, base, station.coord).length - 1);
        expect(Math.abs(distances[0] - distances[1])).toBeLessThanOrEqual(1);
        expect(Math.min(...distances)).toBeGreaterThan(1);
      }
    }
    expect(layouts.size).toBeGreaterThan(1);
  });

  it.each([2, 5, 8])("supports generator radius %i with connected usable tiles", radius => {
    const world = generateWorld(0, radius);
    expect(Object.keys(world)).toHaveLength(1 + 3 * radius * (radius + 1));
    expect(reachableCoords(world, `${-radius},0`)).toHaveLength(Object.values(world).filter(tile => tile.walkable).length);
    expect(Object.values(world).filter(tile => tile.kind === "base")).toHaveLength(2);
    expect(Object.values(world).filter(tile => tile.kind === "fuel")).toHaveLength(1);
    expect(Object.values(world).filter(tile => tile.kind === "repair")).toHaveLength(1);
    expect(() => generateWorld(0, 1)).toThrow();
    expect(() => generateWorld(0, 9)).toThrow();
  });

  it.each([[7, 138], [8, 110]] as const)("regenerates radius %i seed %i when no balanced service layout exists", (radius, seed) => {
    const world = generateWorld(seed, radius);
    expect(world).toEqual(generateWorld(seed, radius));
    const bases = [`${-radius},0`, `${radius},0`] as Coord[];
    for (const kind of ["fuel", "repair"] as const) {
      const station = Object.values(world).find(tile => tile.kind === kind)!;
      const distances = bases.map(base => pathBetween(world, base, station.coord).length - 1);
      expect(Math.abs(distances[0] - distances[1])).toBeLessThanOrEqual(1);
      expect(Math.max(...distances)).toBeLessThanOrEqual(radius + 2);
    }
    expect(Object.values(world).reduce((total, tile) => total + tile.resources.special, 0)).toBe(4);
  });

  it("keeps one special pair on compact radius-2 layouts", () => {
    for (let seed = 0; seed < 50; seed++) {
      const world = generateWorld(seed, 2);
      expect(new Set(Object.values(world).map(tileLevel))).toEqual(new Set([0, 2, 3, 4, 5]));
      expect(Object.values(world).reduce((total, tile) => total + tile.resources.special, 0)).toBe(2);
      expect(reachableCoords(world, "-2,0")).toHaveLength(Object.values(world).filter(tile => tile.walkable).length);
      for (const tile of Object.values(world)) {
        const [q, r] = axial(tile.coord);
        expect(tile.resources.special).toBe(world[`${-q},${-r}`].resources.special);
      }
    }
  });

  it.each([0, 1, 42, 4294967295])("generates a balanced connected world for seed %i", seed => {
    const world = generateWorld(seed, 3);
    expect(world).toEqual(generateWorld(seed, 3));
    expect(Object.keys(world)).toHaveLength(37);
    expect(reachableCoords(world, "-3,0")).toHaveLength(Object.values(world).filter(tile => tile.walkable).length);
    for (const kind of ["fuel", "repair"] as const) {
      const stations = Object.values(world).filter(tile => tile.kind === kind);
      expect(stations).toHaveLength(1);
      const distances = (["-3,0", "3,0"] as const).map(base => pathBetween(world, base, stations[0].coord).length - 1);
      expect(Math.abs(distances[0] - distances[1])).toBeLessThanOrEqual(1);
      expect(Math.max(...distances)).toBeLessThanOrEqual(5);
    }
    for (const tile of Object.values(world)) {
      const [column, row] = axial(tile.coord);
      const mirror = world[`${-column},${-row}`];
      if (!["fuel", "repair"].includes(tile.kind) && !["fuel", "repair"].includes(mirror.kind)) expect(tile.kind).toBe(mirror.kind);
      expect(tile.walkable).toBe(mirror.walkable);
      expect(tile.resources).toEqual(mirror.resources);
      expect(Object.values(tile.resources).every(value => value >= 0 && Number.isInteger(value))).toBe(true);
      if (tile.kind !== "resource") expect(resourceTotal(tile.resources)).toBe(0);
    }
  });

  it("uses 91 tiles by default and makes the fuel station public to both bots", () => {
    const world = generateWorld(42);
    expect(Object.keys(world)).toHaveLength(91);
    const fuel = Object.values(world).find(tile => tile.kind === "fuel")!.coord;
    for (const id of ["bot-0", "bot-1"] as const) {
      expect(createBot(id, world, 42).explored).toContain(fuel);
    }
  });

  it("gives all six neighbors the same logical and rendered distance", () => {
    const world = generateWorld(0, 3);
    expect(world["0,0"].neighbors).toHaveLength(6);
    for (const coord of world["0,0"].neighbors) {
      expect(hexDistance("0,0", coord)).toBe(1);
      const [horizontal, , vertical] = worldPosition(coord);
      expect(Math.hypot(horizontal, vertical)).toBeCloseTo(Math.sqrt(3));
    }
  });

  it("does not manufacture a route to a missing or blocked tile", () => {
    const world = generateWorld(0, 3);
    expect(pathBetween(world, "-3,0", "99,99")).toEqual([]);
    world["0,0"].walkable = false;
    expect(pathBetween(world, "0,0", "0,0")).toEqual([]);
    const path = pathBetween(world, "-3,0", "3,0");
    expect(path.length).toBeGreaterThan(1);
    for (let index = 1; index < path.length; index++) expect(hexDistance(path[index - 1], path[index])).toBe(1);
  });
});
