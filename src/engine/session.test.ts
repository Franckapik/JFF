import { describe, expect, it, vi } from "vitest";

import { useSessionStore } from "../stores/useSessionStore";

import { SessionHost } from "./protocol";
import { addResources, emptyResources, resourceTotal, transferResources } from "./resources";
import { RULES } from "./rules";
import { createBot, GameSession } from "./session";
import { axial, generateWorld, hexDistance, pathBetween, reachableCoords, worldPosition } from "./world";

describe("resource transactions", () => {
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

describe("shared session", () => {
  it("accumulates repeated harvests of one tile without counting it twice", () => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["0,0"].kind = "resource"; world["0,0"].walkable = true;
    world["0,0"].resources.food = 450;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "0,0";
    bots["bot-0"].known = Object.values(world).map(tile => tile.coord);
    bots["bot-1"].damage = 100;
    const session = new GameSession(42, { world, bots });
    session.advance(1000000);
    const snapshot = session.getSnapshot();
    expect(snapshot.phase).toBe("finished");
    expect(snapshot.bots["bot-0"].score).toBe(450);
    expect(snapshot.bots["bot-0"].statistics.collections).toBe(3);
    expect(snapshot.bots["bot-0"].statistics.collectionAttempts).toBe(3);
    expect(snapshot.bots["bot-0"].harvested).toEqual({ "0,0": { food: 450, debris: 0, special: 0 } });
    session.assertInvariants(); session.stop();
  });

  it.each([0, 10])("reports blocked objectives or final returns with %i resources without awarding a normal victory", remainingFood => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources(); tile.walkable = true;
      if (tile.kind !== "base") tile.kind = "danger";
    }
    world["0,0"].kind = "resource"; world["0,0"].resources.food = remainingFood;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    for (const bot of Object.values(bots)) {
      bot.coord = "0,0"; bot.damage = 90; bot.known = Object.values(world).map(tile => tile.coord);
      bot.cargo.food = 5;
    }
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
    session.assertInvariants(); session.stop();
  });

  it.each(["fuel", "repair", "base"] as const)("does not scan a public %s tile", kind => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const target = Object.values(world).find(tile => tile.kind === kind && tile.owner !== "bot-0")!;
    const origin = target.neighbors.find(coord => world[coord].walkable)!;
    const resource = Object.values(world).find(tile => tile.kind === "resource" && hexDistance(origin, tile.coord) > 1)!;
    resource.resources.food = 20;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = origin;
    bots["bot-0"].known = Object.values(world).filter(tile => tile.coord !== target.coord && tile.coord !== resource.coord).map(tile => tile.coord);
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation?.kind).toBe("move");
    expect(session.getSnapshot().bots["bot-0"].statistics.scans).toBe(0);
    session.assertInvariants(); session.stop();
  });

  it("distinguishes attempted, successful and distinct-tile collections", () => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["0,0"].kind = "resource"; world["0,0"].walkable = true;
    world["0,0"].resources.food = 10;
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    for (const bot of Object.values(bots)) { bot.coord = "0,0"; bot.known = Object.values(world).map(tile => tile.coord); }
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.collectDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].statistics.collectionAttempts).toBe(1);
    expect(snapshot.bots["bot-1"].statistics.collectionAttempts).toBe(1);
    expect(snapshot.bots["bot-0"].statistics.collections).toBe(1);
    expect(snapshot.bots["bot-1"].statistics.collections).toBe(0);
    expect(snapshot.bots["bot-0"].harvested).toEqual({ "0,0": { food: 10, debris: 0, special: 0 } });
    expect(snapshot.bots["bot-1"].harvested).toEqual({});
    session.advance(100000);
    expect(session.getSnapshot().bots["bot-0"].harvested).toEqual(snapshot.bots["bot-0"].harvested);
    expect(session.getSnapshot().bots["bot-0"].statistics.fuelUsed).toBe(session.getSnapshot().bots["bot-0"].statistics.steps);
    session.assertInvariants(); session.stop();
  });

  it("finishes a reproducible batch of 64 seeds", () => {
    for (let seed = 0; seed < 64; seed++) {
      const session = new GameSession(seed);
      session.advance(1000000);
      session.assertInvariants();
      const snapshot = session.getSnapshot();
      expect(snapshot.phase, `seed ${seed}`).toBe("finished");
      expect(resourceTotal(snapshot.remainingResources), `seed ${seed}`).toBe(0);
      expect(
        Object.values(snapshot.bots).every(bot => resourceTotal(bot.cargo) === 0),
        `seed ${seed}`
      ).toBe(true);
      session.stop();
    }
  }, 30000);

  it.each(["fuel", "repair"] as const)("performs only the %s service at its station", service => {
    const world = generateWorld(42);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const station = Object.values(world).find(tile => tile.kind === service)!;
    Object.assign(bots["bot-0"], {
      coord: station.coord,
      fuel: 10,
      damage: 60,
      cargo: { food: 20, debris: 30, special: 1 },
      goal: { coord: station.coord, reason: service },
    });
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.serviceDuration - 1);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(10);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(60);
    session.advance(1);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.fuel).toBe(service === "fuel" ? 100 : 10);
    expect(bot.damage).toBe(service === "repair" ? 0 : 60);
    expect(bot.score).toBe(0);
    expect(bot.cargo).toEqual(bots["bot-0"].cargo);
    session.assertInvariants();
    session.stop();
  });

  it("travels to a repair station before repairing", () => {
    const world = generateWorld(42);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "0,0", fuel: 40, damage: 60 });
    world["0,0"].kind = "empty";
    world["0,0"].walkable = true;
    world["0,0"].resources = emptyResources();
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.stepDuration - 1);
    expect(session.getSnapshot().bots["bot-0"].coord).toBe("0,0");
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(60);
    session.advance(1);
    const arrived = session.getSnapshot().bots["bot-0"];
    expect(world[arrived.coord].kind).toBe("repair");
    expect(arrived.fuel).toBe(39);
    expect(arrived.damage).toBe(60);
    session.advance(RULES.serviceDuration);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(0);
    session.assertInvariants();
    session.stop();
  });

  it("replaces only a lost drone at its own base without reducing score", () => {
    const world = generateWorld(42);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    for (const bot of Object.values(bots)) Object.assign(bot, { score: 50, budget: 50, deposited: { food: 50, debris: 0, special: 0 } });
    bots["bot-0"].droneAvailable = false;
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.purchaseDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].droneAvailable).toBe(true);
    expect(snapshot.bots["bot-0"].budget).toBe(0);
    expect(snapshot.bots["bot-0"].score).toBe(50);
    expect(snapshot.bots["bot-1"].budget).toBe(50);
    session.assertInvariants();
    session.stop();
  });

  it("buys radius three for 100 without ending the game", () => {
    const world = generateWorld(42);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const bot = bots["bot-0"];
    Object.assign(bot, { radius: 2, score: 150, budget: 100, spent: 50, deposited: { food: 150, debris: 0, special: 0 } });
    bot.known = Object.values(world)
      .filter(tile => hexDistance(bot.base, tile.coord) <= 2)
      .map(tile => tile.coord);
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.purchaseDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].radius).toBe(3);
    expect(snapshot.bots["bot-0"].budget).toBe(0);
    expect(snapshot.bots["bot-0"].score).toBe(150);
    expect(snapshot.phase).toBe("running");
    session.assertInvariants();
    session.stop();
  });

  it("scans from the mobile ship and keeps discoveries individual", () => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["2,0"].resources = { food: 20, debris: 0, special: 0 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    bots["bot-0"].coord = "1,0";
    bots["bot-0"].known = Object.values(world)
      .filter(tile => tile.coord !== "2,0")
      .map(tile => tile.coord);
    bots["bot-1"].coord = "-3,0";
    const session = new GameSession(42, { world, bots });
    session.advance(1);
    expect(session.getSnapshot().bots["bot-0"].operation?.target).toBe("2,0");
    expect(session.getSnapshot().bots["bot-1"].known).not.toContain("2,0");
    session.advance(RULES.scanDuration + 2 * RULES.stepDuration - 1);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].known).toContain("2,0");
    expect(snapshot.bots["bot-0"].coord).toBe("1,0");
    expect(snapshot.bots["bot-1"].known).not.toContain("2,0");
    session.assertInvariants();
    session.stop();
  });

  it("applies danger damage once per arrival and charges every waypoint", () => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.walkable = axial(tile.coord)[1] === 0;
    world["-1,0"].kind = "danger";
    world["-1,0"].resources = emptyResources();
    world["0,0"].kind = "resource";
    world["0,0"].resources = { food: 20, debris: 0, special: 0 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "-2,0", fuel: 90, goal: { coord: "0,0", reason: "collect" } });
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.stepDuration);
    expect(session.getSnapshot().bots["bot-0"].damage).toBe(10);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(89);
    session.advance(RULES.stepDuration);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.coord).toBe("0,0");
    expect(bot.damage).toBe(10);
    expect(bot.fuel).toBe(88);
    expect(bot.statistics.steps).toBe(2);
    session.assertInvariants();
    session.stop();
  });

  it("deposits final cargo before awarding a tie", () => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "-2,0", cargo: { food: 10, debris: 0, special: 0 } });
    Object.assign(bots["bot-1"], { coord: "2,0", cargo: { food: 10, debris: 0, special: 0 } });
    const session = new GameSession(42, { world, bots });
    session.advance(RULES.stepDuration);
    expect(session.getSnapshot().phase).toBe("returning");
    expect(session.getSnapshot().winners).toEqual([]);
    session.advance(RULES.serviceDuration);
    const snapshot = session.getSnapshot();
    expect(snapshot.phase).toBe("finished");
    expect(snapshot.winners).toEqual(["bot-0", "bot-1"]);
    expect(snapshot.bots["bot-0"].score).toBe(10);
    expect(snapshot.bots["bot-1"].score).toBe(10);
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
    const session = new GameSession(42, { world, bots });
    session.advance(distance * RULES.stepDuration - 1);
    expect(session.getSnapshot().bots["bot-0"].droneAvailable).toBe(true);
    expect(session.getSnapshot().bots["bot-0"].known).not.toContain(target);
    session.advance(1);
    const bot = session.getSnapshot().bots["bot-0"];
    expect(bot.droneAvailable).toBe(false);
    expect(bot.statistics.droneLosses).toBe(1);
    expect(bot.statistics.scans).toBe(1);
    expect(bot.known).toContain(target);
    expect(bot.damage).toBe(0);
    expect(bot.coord).toBe("0,0");
    const singleAdvance = new GameSession(42, { world, bots });
    singleAdvance.advance(distance * RULES.stepDuration);
    expect({ ...session.getSnapshot(), revision: 0 }).toEqual({ ...singleAdvance.getSnapshot(), revision: 0 });
    singleAdvance.stop();
    session.assertInvariants();
    session.stop();
  });

  it("excludes a destroyed high scorer and accounts for its lost cargo", () => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], {
      damage: 100,
      score: 200,
      budget: 200,
      deposited: { food: 200, debris: 0, special: 0 },
      cargo: { food: 20, debris: 0, special: 0 },
    });
    const session = new GameSession(42, { world, bots });
    session.advance(100);
    const snapshot = session.getSnapshot();
    expect(snapshot.winners).toEqual(["bot-1"]);
    expect(snapshot.bots["bot-0"].state).toBe("eliminated");
    expect(snapshot.lostResources.food).toBe(20);
    session.assertInvariants();
    session.stop();
  });

  it.each([0, 1, 42, 4294967295])("finishes seed %i without duplicating resources or exceeding compartments", seed => {
    const session = new GameSession(seed);
    for (let step = 0; step < 1000 && session.getSnapshot().phase !== "finished"; step++) {
      session.advance(1000);
      session.assertInvariants();
    }
    const snapshot = session.getSnapshot();
    expect(snapshot.phase).toBe("finished");
    expect(resourceTotal(snapshot.remainingResources)).toBe(0);
    expect(Object.values(snapshot.bots).every(bot => resourceTotal(bot.cargo) === 0)).toBe(true);
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
    const world = generateWorld(1);
    const bots = { "bot-0": createBot("bot-0", world, 1), "bot-1": createBot("bot-1", world, 1) };
    Object.assign(bots["bot-0"], { coord: "-2,0", fuel: 0, cargo: { food: 20, debris: 10, special: 1 } });
    const session = new GameSession(1, { world, bots });
    session.advance(5000);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].coord).toBe("-3,0");
    expect(snapshot.bots["bot-0"].score).toBe(0);
    expect(snapshot.lostResources).toEqual({ food: 20, debris: 10, special: 1 });
    session.assertInvariants();
    session.stop();
  });

  it("eliminates destroyed bots and ends when no bot survives", () => {
    const world = generateWorld(1);
    const bots = { "bot-0": createBot("bot-0", world, 1), "bot-1": createBot("bot-1", world, 1) };
    bots["bot-0"].damage = 100;
    bots["bot-1"].damage = 100;
    const session = new GameSession(1, { world, bots });
    session.advance(100);
    expect(session.getSnapshot().phase).toBe("finished");
    expect(session.getSnapshot().winners).toEqual([]);
    session.assertInvariants();
    session.stop();
  });

  it("serializes simultaneous collections against a single stock", () => {
    const world = generateWorld(42);
    for (const tile of Object.values(world)) tile.resources = emptyResources();
    world["0,0"].kind = "resource";
    world["0,0"].walkable = true;
    world["0,0"].resources = { food: 100, debris: 500, special: 6 };
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    for (const bot of Object.values(bots)) {
      bot.coord = "0,0";
      bot.known = Object.values(world).map(tile => tile.coord);
    }
    const session = new GameSession(42, { world, bots });
    session.advance(1000);
    const snapshot = session.getSnapshot();
    expect(addResources(snapshot.bots["bot-0"].cargo, snapshot.bots["bot-1"].cargo)).toEqual({ food: 100, debris: 500, special: 6 });
    expect(resourceTotal(snapshot.remainingResources)).toBe(0);
    session.assertInvariants();
    session.stop();
  });

  it("buys an individual radius upgrade without reducing the score", () => {
    const world = generateWorld(42);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    const bot = bots["bot-0"];
    bot.deposited = { food: 80, debris: 0, special: 0 };
    bot.score = 80;
    bot.budget = 80;
    bot.known = Object.values(world)
      .filter(tile => hexDistance(bot.base, tile.coord) <= 1)
      .map(tile => tile.coord);
    const session = new GameSession(42, { world, bots });
    session.advance(1000);
    const snapshot = session.getSnapshot();
    expect(snapshot.bots["bot-0"].radius).toBe(2);
    expect(snapshot.bots["bot-1"].radius).toBe(1);
    expect(snapshot.bots["bot-0"].budget).toBe(30);
    expect(snapshot.bots["bot-0"].score).toBe(80);
    session.assertInvariants();
    session.stop();
  });

  it("charges the last return step before servicing at the base", () => {
    const world = generateWorld(42);
    const bots = { "bot-0": createBot("bot-0", world, 42), "bot-1": createBot("bot-1", world, 42) };
    Object.assign(bots["bot-0"], { coord: "-2,0", fuel: 5, cargo: { food: 20, debris: 10, special: 3 } });
    const session = new GameSession(42, { world, bots });
    session.advance(400);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(4);
    expect(session.getSnapshot().bots["bot-0"].score).toBe(0);
    session.advance(1200);
    expect(session.getSnapshot().bots["bot-0"].fuel).toBe(100);
    expect(session.getSnapshot().bots["bot-0"].score).toBe(33);
    session.assertInvariants();
    session.stop();
  });
});

describe("session protocol", () => {
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
    host.advance(1000);
    const second = host.receive({ protocol: 1, type: "INIT" });
    expect(second.gameId).toBe(first.gameId);
    expect(second.snapshot!.elapsed).toBe(1000);
    const reset = host.receive({ protocol: 1, type: "RESET", gameId: first.gameId, seed: 42 });
    expect(reset.gameId).not.toBe(first.gameId);
    expect(reset.snapshot!.seed).toBe(42);
    expect(reset.snapshot!.elapsed).toBe(0);
    expect(host.receive({ protocol: 1, type: "RESET", gameId: first.gameId, seed: 99 }).type).toBe("ERROR");
    expect(host.receive({ protocol: 1, type: "CONTROL", gameId: reset.gameId, command: "SPEED", speed: "8" }).type).toBe("ERROR");
    expect(host.receive(null).type).toBe("ERROR");
    expect(host.receive({ protocol: 1, type: ["PING"] }).type).toBe("ERROR");
    expect(host.receive({ protocol: 1, type: "CONTROL", gameId: reset.gameId, command: ["PAUSE"] }).type).toBe("ERROR");
    host.receive({ protocol: 1, type: "CONTROL", gameId: reset.gameId, command: "PAUSE" });
    expect(host.advance(10000)).toBe(false);
    expect(host.snapshot().snapshot!.elapsed).toBe(0);
    host.stop();
  });
});

describe("hexagonal world", () => {
  it.each([2, 8])("supports generator radius %i with connected usable tiles", radius => {
    const world = generateWorld(0, radius);
    expect(Object.keys(world)).toHaveLength(1 + 3 * radius * (radius + 1));
    expect(reachableCoords(world, `${-radius},0`)).toHaveLength(Object.values(world).filter(tile => tile.walkable).length);
    expect(Object.values(world).filter(tile => tile.kind === "base")).toHaveLength(2);
    expect(() => generateWorld(0, 1)).toThrow();
    expect(() => generateWorld(0, 9)).toThrow();
  });

  it.each([0, 1, 42, 4294967295])("generates a symmetric connected world for seed %i", seed => {
    const world = generateWorld(seed);
    expect(world).toEqual(generateWorld(seed));
    expect(Object.keys(world)).toHaveLength(37);
    expect(reachableCoords(world, "-3,0")).toHaveLength(Object.values(world).filter(tile => tile.walkable).length);
    for (const tile of Object.values(world)) {
      const [column, row] = axial(tile.coord);
      const mirror = world[`${-column},${-row}`];
      expect(tile.kind).toBe(mirror.kind);
      expect(tile.resources).toEqual(mirror.resources);
      expect(Object.values(tile.resources).every(value => value >= 0 && Number.isInteger(value))).toBe(true);
      if (tile.kind !== "resource") expect(resourceTotal(tile.resources)).toBe(0);
    }
  });

  it("gives all six neighbors the same logical and rendered distance", () => {
    const world = generateWorld(0);
    expect(world["0,0"].neighbors).toHaveLength(6);
    for (const coord of world["0,0"].neighbors) {
      expect(hexDistance("0,0", coord)).toBe(1);
      const [horizontal, , vertical] = worldPosition(coord);
      expect(Math.hypot(horizontal, vertical)).toBeCloseTo(Math.sqrt(3));
    }
  });

  it("does not manufacture a route to a missing or blocked tile", () => {
    const world = generateWorld(0);
    expect(pathBetween(world, "-3,0", "99,99")).toEqual([]);
    world["0,0"].walkable = false;
    expect(pathBetween(world, "0,0", "0,0")).toEqual([]);
    const path = pathBetween(world, "-3,0", "3,0");
    expect(path.length).toBeGreaterThan(1);
    for (let index = 1; index < path.length; index++) expect(hexDistance(path[index - 1], path[index])).toBe(1);
  });
});
