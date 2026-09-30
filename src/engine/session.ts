import { createActor, type ActorRefFrom } from "xstate";

import { botMachine } from "./botMachine";
import type { Bot, BotPhase, BotView, ElectricCloud, GoalReason, OperationKind, SessionEvent, SessionLog, SessionSnapshot } from "./model";
import { addResources, emptyResources, RESOURCE_KINDS, resourceTotal, transferResources, type Resources } from "./resources";
import { RULES } from "./rules";
import { activeCoords, hasLineOfSight, rememberTerrain } from "./visibility";
import {
    axial,
    BOT_IDS,
    generateWorld,
    hexDistance,
    hexLine,
    nextRandom,
    pathBetween,
    reachableCoords,
    worldResources,
    type BotId,
    type Coord,
    type World,
} from "./world";

export function createBot(id: BotId, world: World, seed: number): Bot {
  const base = Object.values(world).find(tile => tile.kind === "base" && tile.owner === id)?.coord;
  if (!base) throw new Error(`Missing base for ${id}`);
  return {
    id,
    coord: base,
    base,
    cargo: emptyResources(),
    deposited: emptyResources(),
    budget: 0,
    spent: 0,
    score: 0,
    fuel: RULES.fuelCapacity,
    damage: 0,
    radius: RULES.initialExplorationRadius,
    droneAvailable: true,
    known: [base],
    scanned: [],
    explored: activeCoords(world, { coord: base, radius: RULES.initialExplorationRadius }),
    randomState: (seed ^ (id === "bot-0" ? 0x9e3779b9 : 0x85ebca6b)) >>> 0,
    operation: null,
    route: [],
    goal: null,
    decision: "Initialisation",
    harvested: {},
    statistics: { scans: 0, collectionAttempts: 0, collections: 0, steps: 0, fuelUsed: 0, rescues: 0, droneLosses: 0 },
    visits: { [base]: 1 },
    eliminationReason: null,
  };
}

export class GameSession {
  private readonly actors = new Map<BotId, ActorRefFrom<typeof botMachine>>();
  private readonly world: World;
  private readonly initialResources: Resources;
  private lostResources = emptyResources();
  private elapsed = 0;
  private revision = 0;
  private worldRevision = 0;
  private phase: SessionSnapshot["phase"] = "running";
  private paused = false;
  private speed = 1;
  private turn = 0;
  private logs: SessionLog[] = [];
  private logSequence = 0;
  private events: SessionEvent[] = [];
  private eventSequence = 0;
  private winners: BotId[] = [];
  private endReason: string | null = null;
  private cloud: ElectricCloud | null = null;
  private readonly shipCloudContacts = new Set<BotId>();
  private cloudRandomState: number;
  private exploredSinceStart = 0;
  private nextCloudAt = RULES.cloudExplorationInterval;
  readonly seed: number;

  constructor(seed: number, scenario?: { world: World; bots?: Record<BotId, Bot>; cloud?: ElectricCloud | null }) {
    if (!Number.isSafeInteger(seed)) throw new Error("Invalid seed");
    this.seed = seed >>> 0;
    this.cloudRandomState = (this.seed ^ 0xc10d1234) >>> 0;
    this.cloud = scenario?.cloud ? structuredClone(scenario.cloud) : null;
    this.world = structuredClone(scenario?.world ?? generateWorld(this.seed, RULES.mapRadius));
    const startingBots = BOT_IDS.map(id => structuredClone(scenario?.bots?.[id] ?? createBot(id, this.world, this.seed)));
    if (startingBots[0].coord === startingBots[1].coord) throw new Error("Bots cannot start on the same tile");
    for (const bot of startingBots) {
      bot.explored = rememberTerrain(bot.explored, activeCoords(this.world, bot));
      this.actors.set(bot.id, createActor(botMachine, { input: bot }).start());
    }
    this.initialResources = this.bots().reduce(
      (total, bot) => addResources(total, addResources(bot.cargo, bot.deposited)),
      worldResources(this.world)
    );
    this.log(null, "Partie initialisee");
    this.emit({ type: "session.started", category: "lifecycle", botId: null });
    this.syncCloudContacts();
    this.assertInvariants();
  }

  private bots(): BotView[] {
    return BOT_IDS.map(id => {
      const snapshot = this.actors.get(id)!.getSnapshot();
      return { ...snapshot.context, state: snapshot.value as BotPhase };
    });
  }

  private log(botId: BotId | null, message: string) {
    this.logs.push({ sequence: ++this.logSequence, time: this.elapsed, botId, message });
    if (this.logs.length > RULES.maxLogEntries) this.logs.shift();
  }

  private emit(event: Omit<SessionEvent, "sequence" | "time">) {
    this.events.push({ ...event, sequence: ++this.eventSequence, time: this.elapsed });
  }

  private random(): number {
    const result = nextRandom(this.cloudRandomState);
    this.cloudRandomState = result.state;
    return result.value;
  }

  private cloudMoveCandidates(): Coord[] {
    const bases = this.bots().map(bot => bot.base);
    return Object.values(this.world)
      .filter(tile => tile.walkable && bases.every(base => hexDistance(base, tile.coord) > 1))
      .map(tile => tile.coord);
  }

  private cloudSpawnCandidates(): Coord[] {
    const positions = this.bots().map(bot => bot.coord);
    return this.cloudMoveCandidates().filter(coord => positions.every(position => hexDistance(coord, position) >= 2));
  }

  private recordExploration(before: Coord[], after: Coord[]) {
    this.exploredSinceStart += after.length - before.length;
    while (this.exploredSinceStart >= this.nextCloudAt) {
      this.nextCloudAt += RULES.cloudExplorationInterval;
      if (this.cloud) continue;
      const candidates = this.cloudSpawnCandidates();
      if (!candidates.length) continue;
      const coord = candidates[Math.floor(this.random() * candidates.length)];
      this.cloud = { coord, previousCoord: null, appearedAt: this.elapsed, nextMoveAt: this.elapsed + RULES.cloudMoveDuration, expiresAt: this.elapsed + RULES.cloudLifetime };
      this.emit({ type: "cloud.appeared", category: "incident", botId: null, reason: "Nuage electrique apparu" });
      this.syncCloudContacts();
    }
  }

  private updateCloud(): boolean {
    if (!this.cloud) return false;
    if (this.elapsed >= this.cloud.expiresAt) {
      this.cloud = null;
      this.emit({ type: "cloud.disappeared", category: "incident", botId: null, reason: "Nuage electrique dissipe" });
      return this.syncCloudContacts();
    }
    if (this.elapsed < this.cloud.nextMoveAt) return false;
    const old = this.cloud.coord;
    const safe = new Set(this.cloudMoveCandidates());
    const neighbors = this.world[old].neighbors.filter(coord => safe.has(coord) && coord !== this.cloud?.previousCoord);
    const fallback = this.world[old].neighbors.filter(coord => safe.has(coord));
    const choices = neighbors.length ? neighbors : fallback;
    const coord = choices.length ? choices[Math.floor(this.random() * choices.length)] : old;
    this.cloud = { ...this.cloud, coord, previousCoord: old, nextMoveAt: this.cloud.nextMoveAt + RULES.cloudMoveDuration };
    this.emit({ type: "cloud.moved", category: "movement", botId: null, reason: "Le nuage electrique se deplace" });
    return this.syncCloudContacts();
  }

  private syncCloudContacts(): boolean {
    let eliminated = false;
    for (const bot of this.bots()) {
      const leaving = bot.operation?.kind === "move" && bot.operation.remaining < bot.operation.duration;
      const touching = this.cloud?.coord === bot.coord && !leaving && bot.state !== "eliminated" && bot.state !== "finished";
      if (!touching) {
        this.shipCloudContacts.delete(bot.id);
        continue;
      }
      if (this.shipCloudContacts.has(bot.id)) continue;
      this.shipCloudContacts.add(bot.id);
      const damage = Math.min(100 - bot.damage, RULES.cloudDamage);
      if (damage <= 0) continue;
      const next = { ...bot, damage: bot.damage + damage };
      this.actors.get(bot.id)!.send({ type: "TICK", bot: next });
      this.emit({ type: "cloud.impact", category: "incident", botId: bot.id, coord: bot.coord,
        before: { damage: bot.damage }, delta: { damage }, after: { damage: next.damage } });
      if (next.damage >= 100) {
        this.eliminate(next, "Vaisseau detruit par le nuage electrique");
        eliminated = true;
      }
    }
    if (this.cloud) {
      for (const bot of this.bots()) {
        const operation = bot.operation;
        if (operation?.kind !== "scan") continue;
        const elapsed = operation.duration - operation.remaining;
        const detour = operation.scanDetour;
        const arrival = detour?.destinationAt ?? hexDistance(bot.coord, operation.scanInitialTarget ?? operation.target) * RULES.stepDuration;
        const coord = detour?.destination ?? operation.target;
        if (!operation.scanArrived || elapsed < arrival || elapsed >= arrival + RULES.scanDuration || coord !== this.cloud.coord) continue;
        const from = detour?.edge ?? bot.coord;
        const line = hexLine(from, coord);
        const previous = line[line.length - 2] ?? coord;
        this.startScanDetour(bot, coord, previous);
      }
    }
    return eliminated;
  }

  private startScanDetour(bot: BotView, contact: Coord, previous: Coord) {
    const operation = bot.operation;
    if (operation?.kind !== "scan") return;
    const [column, row] = axial(contact);
    const [previousColumn, previousRow] = axial(previous);
    const reverseColumn = previousColumn - column;
    const reverseRow = previousRow - row;
    const edges = Object.values(this.world).filter(tile => tile.neighbors.length < 6 && tile.coord !== contact).map(tile => tile.coord);
    edges.sort((left, right) => {
      const score = (coord: Coord) => {
        const [q, r] = axial(coord);
        const dq = q - column;
        const dr = r - row;
        const reverse = dq * reverseColumn + dr * reverseRow + (-dq - dr) * (-reverseColumn - reverseRow);
        return [Number(hexLine(contact, coord)[1] === previous), reverse, hexDistance(contact, coord)] as const;
      };
      const a = score(left);
      const b = score(right);
      return b[0] - a[0] || b[1] - a[1] || b[2] - a[2] || left.localeCompare(right);
    });
    const edge = edges[0];
    if (!edge) return;
    const coords = Object.keys(this.world) as Coord[];
    const destination = coords[Math.floor(this.random() * coords.length)];
    const contactAt = operation.duration - operation.remaining;
    const edgeAt = contactAt + hexDistance(contact, edge) * RULES.stepDuration;
    const destinationAt = edgeAt + hexDistance(edge, destination) * RULES.stepDuration;
    const duration = destinationAt + RULES.scanDuration + hexDistance(destination, bot.coord) * RULES.stepDuration;
    this.actors.get(bot.id)!.send({ type: "TICK", bot: {
      ...bot,
      operation: { ...operation, target: destination, duration, remaining: duration - contactAt,
        scanDetour: { contact, edge, destination, contactAt, edgeAt, destinationAt },
        scanEdgeReached: false, scanArrived: false, scanCheckedSteps: 0 },
      decision: `Interference electromagnetique : rebond vers le bord ${edge}`,
    } });
    this.log(bot.id, `Interference electromagnetique : drone rebondit vers ${edge}`);
    this.emit({ type: "drone.interfered", category: "incident", botId: bot.id, coord: contact, target: edge, reason: "Rebond vers le bord du plateau" });
  }

  private scanSegment(bot: Bot): { from: Coord; to: Coord; startAt: number; kind: "outbound" | "edge" | "destination" | "return" } {
    const operation = bot.operation!;
    const detour = operation.scanDetour;
    if (detour) {
      if (!operation.scanEdgeReached)
        return { from: detour.contact, to: detour.edge, startAt: detour.contactAt, kind: "edge" };
      if (!operation.scanArrived)
        return { from: detour.edge, to: detour.destination, startAt: detour.edgeAt, kind: "destination" };
      return { from: detour.destination, to: bot.coord, startAt: detour.destinationAt + RULES.scanDuration, kind: "return" };
    }
    const target = operation.scanInitialTarget ?? operation.target;
    if (!operation.scanArrived) return { from: bot.coord, to: target, startAt: 0, kind: "outbound" };
    const outbound = hexDistance(bot.coord, target);
    return { from: target, to: bot.coord, startAt: outbound * RULES.stepDuration + RULES.scanDuration, kind: "return" };
  }

  private route(bot: Bot, target: Coord): Coord[] {
    const knownDangers = new Set(bot.known);
    const safeWorld = Object.fromEntries(
      Object.entries(this.world).map(([coord, tile]) => [coord, { ...tile, walkable: tile.walkable && !(tile.kind === "danger" && knownDangers.has(tile.coord) && coord !== bot.coord) }])
    ) as World;
    const safe = pathBetween(safeWorld, bot.coord, target);
    const path = safe.length ? safe : pathBetween(this.world, bot.coord, target);
    const damage = path.slice(1).filter(coord => knownDangers.has(coord) && this.world[coord].kind === "danger").length * RULES.dangerDamage;
    return bot.damage + damage < 100 ? path : [];
  }

  private servicePath(bot: Bot, service: "fuel" | "repair"): Coord[] {
    return (
      Object.values(this.world)
        .filter(tile => (service === "repair" && tile.coord === bot.base) || (tile.kind === service && bot.explored.includes(tile.coord)))
        .map(tile => this.route(bot, tile.coord))
        .filter(path => path.length > 0)
        .sort((left, right) => left.length - right.length)[0] ?? []
    );
  }

  private launch(bot: Bot, kind: OperationKind, target: Coord, duration: number, decision: string) {
    this.actors.get(bot.id)!.send({ type: "PLAN", bot: { ...bot, decision, operation: {
      kind, target, duration, remaining: duration,
      ...(kind === "scan" ? { scanInitialTarget: target, scanCheckedSteps: 0, scanArrived: false } : {}),
    } } });
    if (kind !== "wait" || bot.decision !== decision) {
      this.log(bot.id, decision);
      this.emit({ type: "operation.started", category: "decision", botId: bot.id, operation: kind, coord: bot.coord, target, reason: decision });
    }
    if (kind === "scan" && this.cloud?.coord === bot.coord)
      this.startScanDetour(this.bots().find(candidate => candidate.id === bot.id)!, bot.coord, bot.coord);
  }

  // Only the destination of a final movement step is reserved. Intermediate
  // waypoints remain flyable, even when another bot is using the tile below.
  private claimant(coord: Coord, requester: BotId): BotView | undefined {
    return this.bots().find(bot => {
      if (bot.id === requester || bot.state === "finished" || bot.state === "eliminated") return false;
      if (bot.operation?.kind === "move") return bot.operation.target === coord && bot.goal?.coord === coord;
      if (bot.operation?.kind === "rescue") return false;
      return bot.coord === coord;
    });
  }

  private move(bot: Bot, target: Coord, reason: GoalReason): boolean {
    if (bot.fuel < RULES.fuelPerStep) return false;
    const path = this.route(bot, target);
    if (path.length < 2) return false;
    const claimant = path[1] === target ? this.claimant(target, bot.id) : undefined;
    if (claimant?.operation?.kind === "wait" && claimant.operation.target === bot.coord && claimant.fuel >= RULES.fuelPerStep) {
      this.launch(
        { ...claimant, route: [bot.coord] },
        "move",
        bot.coord,
        RULES.stepDuration,
        `Croisement vers ${bot.coord}`
      );
    } else if (claimant) {
      this.launch(
        { ...bot, route: path.slice(1), goal: { coord: target, reason } },
        "wait",
        target,
        RULES.stepDuration,
        `Attente : tuile ${target} occupee`
      );
      return true;
    }
    this.launch(
      { ...bot, route: path.slice(1), goal: { coord: target, reason } },
      "move",
      path[1],
      RULES.stepDuration,
      `Trajet ${reason} vers ${target}`
    );
    return true;
  }

  private eliminate(bot: Bot, reason: string) {
    this.lostResources = addResources(this.lostResources, bot.cargo);
    if (resourceTotal(bot.cargo) > 0)
      this.emit({ type: "cargo.lost", category: "incident", botId: bot.id, coord: bot.coord, reason: "elimination", resources: bot.cargo });
    this.actors.get(bot.id)!.send({
      type: "ELIMINATE",
      bot: { ...bot, cargo: emptyResources(), route: [], goal: null, operation: null, eliminationReason: reason, decision: reason },
    });
    this.log(bot.id, reason);
    this.emit({ type: "bot.eliminated", category: "lifecycle", botId: bot.id, coord: bot.coord, reason });
  }

  private finishBot(bot: Bot, decision: string) {
    this.actors.get(bot.id)!.send({ type: "FINISH", bot: { ...bot, decision, operation: null } });
    this.emit({ type: "bot.finished", category: "lifecycle", botId: bot.id, coord: bot.coord, reason: decision });
  }

  private available(bot: Bot, coord: Coord): number {
    return resourceTotal(transferResources(this.world[coord].resources, bot.cargo, RULES.capacity).taken);
  }

  private affordableRoute(bot: Bot, coord: Coord): Coord[] {
    const path = this.route(bot, coord);
    if (!path.length) return [];
    const fuelStationKnown = Object.values(this.world).some(tile => tile.kind === "fuel" && bot.explored.includes(tile.coord));
    const returnPath = fuelStationKnown ? this.servicePath({ ...bot, coord }, "fuel") : this.route({ ...bot, coord }, bot.base);
    return returnPath.length && (path.length + returnPath.length - 2) * RULES.fuelPerStep + RULES.fuelReserve <= bot.fuel ? path : [];
  }

  private plan(bot: BotView) {
    const tile = this.world[bot.coord];
    if (bot.damage >= 100) {
      this.eliminate(bot, "Vaisseau detruit");
      return;
    }
    if (bot.goal?.reason === "collect" && this.available(bot, bot.goal.coord) === 0)
      bot = { ...bot, goal: null, route: [] };
    const isBase = bot.coord === bot.base;
    const atFuel = tile.kind === "fuel";
    if (bot.fuel < RULES.fuelPerStep && !atFuel) {
      if (isBase) {
        this.finishBot(bot, "Carburant insuffisant pour quitter la base");
        return;
      }
      this.emit({ type: "fuel.stranded", category: "incident", botId: bot.id, coord: bot.coord, after: { fuel: bot.fuel } });
      this.launch({ ...bot, route: [], goal: null }, "rescue", bot.base, RULES.rescueDuration, "Remorquage : cargaison perdue");
      return;
    }
    if (
      (isBase && (resourceTotal(bot.cargo) > 0 || bot.damage > 0)) ||
      (tile.kind === "fuel" && bot.fuel < RULES.fuelCapacity) ||
      (tile.kind === "repair" && bot.damage > 0 && (bot.goal?.reason === "repair" || bot.damage >= RULES.repairThreshold))
    ) {
      const duration = atFuel ? RULES.fuelServiceStepMultiplier * RULES.stepDuration : RULES.serviceDuration;
      this.launch(bot, "service", bot.coord, duration, isBase ? "Depot et maintenance a la base" : `Service ${tile.kind}`);
      return;
    }
    if (this.phase === "returning") {
      if (isBase) this.finishBot(bot, "Cargaison soldee");
      else if (!this.move(bot, bot.base, "base"))
        this.finishBot(bot, "Retour a la base impossible");
      return;
    }
    if (bot.damage >= RULES.repairThreshold) {
      const repair = this.servicePath(bot, "repair");
      if (repair.length > 1 && this.move(bot, repair[repair.length - 1], "repair")) return;
    }
    const fuelPath = this.servicePath(bot, "fuel");
    if (
      bot.fuel <= Math.max(RULES.fuelUrgencyThreshold, (fuelPath.length - 1) * RULES.fuelPerStep + RULES.fuelReserve) &&
      fuelPath.length > 1
    ) {
      this.move(bot, fuelPath[fuelPath.length - 1], "fuel");
      return;
    }
    if (bot.goal && bot.coord !== bot.goal.coord) {
      if (this.move(bot, bot.goal.coord, bot.goal.reason)) return;
    }
    bot = { ...bot, goal: null, route: [] };
    if (isBase && !bot.droneAvailable && bot.budget >= RULES.dronePrice) {
      this.launch(bot, "purchase", bot.base, RULES.purchaseDuration, "Remplacement du drone");
      return;
    }
    const unknown = Object.values(this.world).filter(candidate =>
      candidate.walkable && !bot.known.includes(candidate.coord) &&
      (!["base", "fuel", "repair"].includes(candidate.kind) || !bot.explored.includes(candidate.coord))
    );
    const price = RULES.upgradePrices[bot.radius];
    if (
      isBase &&
      price !== undefined &&
      bot.budget >= price &&
      bot.droneAvailable &&
      unknown.some(candidate => hexDistance(bot.coord, candidate.coord) > bot.radius && hexDistance(bot.coord, candidate.coord) <= RULES.maxExplorationRadius) &&
      !unknown.some(candidate => hexDistance(bot.coord, candidate.coord) <= bot.radius)
    ) {
      this.launch(bot, "upgrade", bot.base, RULES.purchaseDuration, `Extension du rayon a ${bot.radius + 1}`);
      return;
    }
    const collections = bot.known
      .filter(coord => this.world[coord]?.kind === "resource" && this.available(bot, coord) > 0)
      .map(coord => ({ coord, path: this.affordableRoute(bot, coord), amount: this.available(bot, coord) }))
      .filter(candidate => candidate.path.length > 0)
      .sort((left, right) => right.amount / right.path.length - left.amount / left.path.length);
    const scans = bot.droneAvailable ? unknown.filter(candidate => {
      const distance = hexDistance(bot.coord, candidate.coord);
      return ["resource", "empty", "danger"].includes(candidate.kind) && distance <= bot.radius && hasLineOfSight(this.world, bot.coord, candidate.coord) && 2 * distance * RULES.droneFuelPerHex <= bot.fuel;
    }) : [];
    const cargoTotal = resourceTotal(bot.cargo);
    const storagePressure = RESOURCE_KINDS.some(kind => bot.cargo[kind] >= RULES.capacity[kind]);
    if (cargoTotal > 0 && (!collections.length || (storagePressure && !collections.some(candidate => candidate.coord === bot.coord)))) {
      if (this.move(bot, bot.base, "base")) return;
    }
    let random = nextRandom(bot.randomState);
    bot = { ...bot, randomState: random.state };
    const collectProbability = collections.length ? Math.min(0.9, 0.55 + collections[0].amount / 1500 + cargoTotal / 5000) : 0;
    if (collections.length && (!scans.length || random.value < collectProbability)) {
      const target = collections[0].coord;
      if (target === bot.coord) this.launch(bot, "collect", target, RULES.collectDuration, `Collecte a ${target}`);
      else this.move(bot, target, "collect");
      return;
    }
    if (scans.length) {
      random = nextRandom(bot.randomState);
      const target = scans[Math.floor(random.value * scans.length)].coord;
      this.launch(
        { ...bot, randomState: random.state },
        "scan",
        target,
        RULES.scanDuration + 2 * hexDistance(bot.coord, target) * RULES.stepDuration,
        `Exploration de ${target}`
      );
      return;
    }
    if (cargoTotal > 0 && this.move(bot, bot.base, "base")) return;
    if (!isBase && ((price !== undefined && bot.budget >= price) || (!bot.droneAvailable && bot.budget >= RULES.dronePrice))) {
      const baseInterest = unknown.some(
        candidate => hexDistance(bot.base, candidate.coord) > bot.radius && hexDistance(bot.base, candidate.coord) <= RULES.maxExplorationRadius
      );
      if ((baseInterest || !bot.droneAvailable) && this.move(bot, bot.base, "base")) return;
    }
    const frontiers = unknown
      .map(candidate => ({ coord: candidate.coord, path: this.affordableRoute(bot, candidate.coord) }))
      .filter(candidate => candidate.path.length > 1)
      .sort((left, right) => left.path.length - right.path.length);
    if (frontiers.length && this.move(bot, frontiers[0].coord, "explore")) return;
    if (fuelPath.length > 1 && bot.fuel < RULES.fuelCapacity && this.move(bot, fuelPath[fuelPath.length - 1], "fuel")) return;
    this.finishBot(bot, "Aucun objectif accessible");
  }

  private complete(bot: BotView, scanDestroyed = false) {
    const operation = bot.operation!;
    let next: Bot = { ...bot, operation: null };
    switch (operation.kind) {
      case "wait":
        break;
      case "move": {
        if (!this.world[bot.coord].neighbors.includes(operation.target) || !this.world[operation.target]?.walkable)
          throw new Error("Invalid waypoint");
        const dangerImpact = this.world[operation.target].kind === "danger" ? Math.min(100 - bot.damage, RULES.dangerDamage) : 0;
        const cloudImpact = this.cloud?.coord === operation.target ? Math.min(100 - bot.damage - dangerImpact, RULES.cloudDamage) : 0;
        next = {
          ...next,
          coord: operation.target,
          fuel: Math.max(0, bot.fuel - RULES.fuelPerStep),
          damage: bot.damage + dangerImpact + cloudImpact,
          route: bot.route.slice(1),
          known: [...new Set([...bot.known, operation.target])],
          explored: rememberTerrain(bot.explored, activeCoords(this.world, { ...bot, coord: operation.target })),
          visits: { ...bot.visits, [operation.target]: (bot.visits[operation.target] ?? 0) + 1 },
          statistics: {
            ...bot.statistics,
            steps: bot.statistics.steps + 1,
            fuelUsed: bot.statistics.fuelUsed + Math.min(bot.fuel, RULES.fuelPerStep),
          },
        };
        this.emit({
          type: "movement.arrived",
          category: "movement",
          botId: bot.id,
          operation: operation.kind,
          coord: bot.coord,
          target: operation.target,
          before: { fuel: bot.fuel, damage: bot.damage },
          delta: { fuel: next.fuel - bot.fuel, damage: next.damage - bot.damage },
          after: { fuel: next.fuel, damage: next.damage },
        });
        if (dangerImpact > 0)
          this.emit({
            type: "danger.impact",
            category: "incident",
            botId: bot.id,
            coord: operation.target,
            before: { damage: bot.damage },
            delta: { damage: dangerImpact },
            after: { damage: bot.damage + dangerImpact },
          });
        if (cloudImpact > 0)
          this.emit({ type: "cloud.impact", category: "incident", botId: bot.id, coord: operation.target,
            before: { damage: bot.damage + dangerImpact }, delta: { damage: cloudImpact }, after: { damage: next.damage } });
        break;
      }
      case "scan": {
        const destroyed = scanDestroyed;
        const distance = (destroyed ? 1 : 2) * hexDistance(bot.coord, operation.scanInitialTarget ?? operation.target);
        const cost = Math.min(bot.fuel, distance * RULES.droneFuelPerHex);
        if (!bot.droneAvailable) throw new Error("Unavailable drone for scan");
        next = {
          ...next,
          fuel: bot.fuel - cost,
          known: [...new Set([...bot.known, operation.target])],
          scanned: [...new Set([...bot.scanned, operation.target])],
          explored: bot.explored,
          droneAvailable: !destroyed,
          radius: destroyed ? RULES.initialExplorationRadius : bot.radius,
          statistics: { ...bot.statistics, scans: bot.statistics.scans + 1, fuelUsed: bot.statistics.fuelUsed + cost, droneLosses: bot.statistics.droneLosses + Number(destroyed) },
        };
        this.emit({ type: "scan.completed", category: "movement", botId: bot.id, operation: operation.kind, coord: bot.coord, target: operation.target, before: { fuel: bot.fuel }, delta: { fuel: -cost }, after: { fuel: next.fuel } });
        if (destroyed) {
          this.log(bot.id, "Drone perdu sur une case dangereuse");
          this.emit({ type: "drone.lost", category: "incident", botId: bot.id, coord: operation.target, reason: "case dangereuse", before: { radius: bot.radius }, delta: { radius: next.radius - bot.radius }, after: { radius: next.radius } });
        }
        break;
      }
      case "collect": {
        if (bot.coord !== operation.target || this.world[bot.coord].kind !== "resource")
          throw new Error("Collection outside resource tile");
        const transfer = transferResources(this.world[bot.coord].resources, bot.cargo, RULES.capacity);
        this.world[bot.coord] = { ...this.world[bot.coord], resources: transfer.remaining };
        this.worldRevision++;
        const collected = resourceTotal(transfer.taken) > 0;
        next = {
          ...next,
          cargo: transfer.cargo,
          harvested: collected
            ? { ...bot.harvested, [bot.coord]: addResources(bot.harvested[bot.coord] ?? emptyResources(), transfer.taken) }
            : bot.harvested,
          statistics: {
            ...bot.statistics,
            collectionAttempts: bot.statistics.collectionAttempts + 1,
            collections: bot.statistics.collections + Number(collected),
          },
        };
        this.log(bot.id, `${resourceTotal(transfer.taken)} ressources collectees`);
        this.emit({
          type: "collection.completed",
          category: "resource",
          botId: bot.id,
          coord: bot.coord,
          target: operation.target,
          reason: collected ? "transfert non vide" : "stock indisponible ou capacite atteinte",
          resources: transfer.taken,
        });
        break;
      }
      case "service": {
        const tile = this.world[bot.coord];
        if (bot.coord === bot.base) {
          const amount = resourceTotal(bot.cargo);
          next = {
            ...next,
            cargo: emptyResources(),
            deposited: addResources(bot.deposited, bot.cargo),
            score: bot.score + amount,
            budget: bot.budget + amount,
            damage: 0,
            goal: null,
          };
          this.log(bot.id, `${amount} ressources deposees`);
          if (amount > 0)
            this.emit({ type: "resources.deposited", category: "resource", botId: bot.id, coord: bot.coord, resources: bot.cargo, delta: { budget: amount, score: amount }, after: { budget: next.budget, score: next.score } });
          if (bot.damage > 0)
            this.emit({ type: "ship.repaired", category: "maintenance", botId: bot.id, coord: bot.coord, before: { damage: bot.damage }, delta: { damage: -bot.damage }, after: { damage: 0 } });
        } else if (tile.kind === "fuel") {
          next = { ...next, fuel: RULES.fuelCapacity, goal: null };
          this.emit({ type: "fuel.refueled", category: "maintenance", botId: bot.id, coord: bot.coord, before: { fuel: bot.fuel }, delta: { fuel: RULES.fuelCapacity - bot.fuel }, after: { fuel: RULES.fuelCapacity } });
        } else if (tile.kind === "repair") {
          next = { ...next, damage: 0, goal: null };
          this.emit({ type: "ship.repaired", category: "maintenance", botId: bot.id, coord: bot.coord, before: { damage: bot.damage }, delta: { damage: -bot.damage }, after: { damage: 0 } });
        }
        else throw new Error("Service outside a station");
        break;
      }
      case "upgrade": {
        const cost = RULES.upgradePrices[bot.radius];
        if (bot.coord !== bot.base || cost === undefined || bot.budget < cost) throw new Error("Invalid upgrade");
        next = { ...next, radius: bot.radius + 1, explored: rememberTerrain(bot.explored, activeCoords(this.world, { ...bot, radius: bot.radius + 1 })), budget: bot.budget - cost, spent: bot.spent + cost };
        this.emit({ type: "exploration.upgraded", category: "economy", botId: bot.id, coord: bot.coord, before: { budget: bot.budget, radius: bot.radius }, delta: { budget: -cost, radius: 1 }, after: { budget: next.budget, radius: next.radius } });
        break;
      }
      case "purchase":
        if (bot.coord !== bot.base || bot.droneAvailable || bot.budget < RULES.dronePrice) throw new Error("Invalid drone purchase");
        next = { ...next, droneAvailable: true, radius: RULES.initialExplorationRadius, budget: bot.budget - RULES.dronePrice, spent: bot.spent + RULES.dronePrice };
        this.emit({ type: "drone.replaced", category: "economy", botId: bot.id, coord: bot.coord, before: { budget: bot.budget }, delta: { budget: -RULES.dronePrice }, after: { budget: next.budget } });
        break;
      case "rescue":
        this.lostResources = addResources(this.lostResources, bot.cargo);
        if (resourceTotal(bot.cargo) > 0)
          this.emit({ type: "cargo.lost", category: "incident", botId: bot.id, coord: bot.coord, reason: "remorquage", resources: bot.cargo });
        next = {
          ...next,
          coord: bot.base,
          cargo: emptyResources(),
          fuel: 0,
          route: [],
          goal: null,
          statistics: { ...bot.statistics, rescues: bot.statistics.rescues + 1 },
          visits: { ...bot.visits, [bot.base]: (bot.visits[bot.base] ?? 0) + 1 },
        };
        this.emit({ type: "rescue.completed", category: "incident", botId: bot.id, coord: bot.coord, target: bot.base, after: { fuel: 0 } });
        break;
    }
    this.actors.get(bot.id)!.send({ type: "COMPLETE", bot: next });
    if (operation.kind === "move") {
      if (this.cloud?.coord === next.coord) this.shipCloudContacts.add(bot.id);
      else this.shipCloudContacts.delete(bot.id);
    }
    if (next.explored.length > bot.explored.length) this.recordExploration(bot.explored, next.explored);
    if (next.damage >= 100) this.eliminate(next, "Vaisseau detruit");
  }

  private settle() {
    const alive = this.bots().filter(bot => bot.state !== "eliminated");
    if (!alive.length) {
      this.finish("Tous les bots sont elimines");
      return;
    }
    const reachable = new Set(alive.flatMap(bot => reachableCoords(this.world, bot.coord)));
    const hasResources = [...reachable].some(coord => resourceTotal(this.world[coord].resources) > 0);
    if (!hasResources && this.phase === "running") {
      this.phase = "returning";
      this.log(null, "Ressources accessibles epuisees : derniers depots");
    }
    for (const bot of this.bots()) if (bot.state === "deciding") this.plan(bot);
    if (this.bots().every(bot => bot.state === "eliminated" || bot.state === "finished"))
      this.finish(hasResources ? "Plus aucun objectif accessible aux bots" : "Ressources accessibles epuisees");
  }

  private finish(reason: string) {
    this.endReason = reason;
    const eligible = this.bots().filter(bot => bot.state !== "eliminated");
    const reachable = new Set(eligible.flatMap(bot => reachableCoords(this.world, bot.coord)));
    const blocked =
      [...reachable].some(coord => resourceTotal(this.world[coord].resources) > 0) ||
      eligible.some(bot => bot.coord !== bot.base || resourceTotal(bot.cargo) > 0);
    this.phase = blocked ? "blocked" : "finished";
    if (blocked) this.endReason = "Objectifs ou retour final impossibles : partie bloquee";
    const best = Math.max(...eligible.map(bot => bot.score));
    this.winners = blocked ? [] : eligible.filter(bot => bot.score === best).map(bot => bot.id);
    this.log(null, this.endReason);
    this.emit({ type: blocked ? "session.blocked" : "session.finished", category: "lifecycle", botId: null, reason: this.endReason });
  }

  private timeUntilBotEvent(bot: Bot): number {
    const operation = bot.operation;
    if (!operation) return Infinity;
    if (operation.kind !== "scan") return operation.remaining;
    const segment = this.scanSegment(bot);
    const elapsed = operation.duration - operation.remaining;
    const distance = hexDistance(segment.from, segment.to);
    const checked = operation.scanCheckedSteps ?? 0;
    const next = checked < distance
      ? segment.startAt + (checked + 1) * RULES.stepDuration
      : segment.startAt;
    return Math.min(operation.remaining, Math.max(0, next - elapsed));
  }

  private processScanEvent(bot: BotView): boolean {
    let current = bot;
    for (let transitions = 0; transitions < 4; transitions++) {
      const operation = current.operation!;
      const elapsed = operation.duration - operation.remaining;
      const segment = this.scanSegment(current);
      const distance = hexDistance(segment.from, segment.to);
      const checked = operation.scanCheckedSteps ?? 0;
      const line = hexLine(segment.from, segment.to);
      if (checked < distance) {
        if (elapsed < segment.startAt + (checked + 1) * RULES.stepDuration) return false;
        const coord = line[checked + 1];
        this.actors.get(current.id)!.send({ type: "TICK", bot: { ...current, operation: { ...operation, scanCheckedSteps: checked + 1 } } });
        current = this.bots().find(candidate => candidate.id === current.id)!;
        if ((segment.kind === "outbound" || segment.kind === "destination") && checked + 1 === distance && this.world[coord].kind === "danger") {
          this.complete(current, true);
          return true;
        }
        if (this.cloud?.coord === coord) {
          this.startScanDetour(current, coord, line[checked]);
          return false;
        }
        continue;
      }
      if (elapsed < segment.startAt + distance * RULES.stepDuration) return false;
      if (segment.kind === "edge") {
        this.actors.get(current.id)!.send({ type: "TICK", bot: { ...current, operation: { ...operation, scanEdgeReached: true, scanCheckedSteps: 0 } } });
        this.emit({ type: "drone.bounced", category: "movement", botId: current.id, coord: operation.scanDetour!.edge,
          target: operation.scanDetour!.destination, reason: "Rebond sur le bord du plateau" });
        current = this.bots().find(candidate => candidate.id === current.id)!;
        continue;
      }
      if (segment.kind === "outbound" || segment.kind === "destination") {
        if (this.world[segment.to].kind === "danger") {
          this.complete(current, true);
          return true;
        }
        this.actors.get(current.id)!.send({ type: "TICK", bot: { ...current, operation: { ...operation, scanArrived: true, scanCheckedSteps: 0 } } });
        current = this.bots().find(candidate => candidate.id === current.id)!;
        continue;
      }
      if (operation.remaining === 0) {
        this.complete(current);
        return true;
      }
      return false;
    }
    return false;
  }

  advance(milliseconds: number): void {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) throw new Error("Invalid elapsed time");
    if (this.paused || this.finished || milliseconds === 0) return;
    let remaining = milliseconds;
    this.settle();
    while (remaining > 0 && !this.finished) {
      const working = this.bots().filter(bot => bot.operation);
      if (!working.length) {
        this.settle();
        break;
      }
      const cloudEvent = this.cloud ? Math.min(this.cloud.nextMoveAt, this.cloud.expiresAt) - this.elapsed : Infinity;
      const duration = Math.min(remaining, cloudEvent, ...working.map(bot => this.timeUntilBotEvent(bot)));
      this.elapsed += duration;
      remaining -= duration;
      for (const bot of working) {
        this.actors
          .get(bot.id)!
          .send({ type: "TICK", bot: {
            ...bot,
            operation: { ...bot.operation!, remaining: bot.operation!.remaining - duration },
          } });
      }
      let completed = this.updateCloud();
      const order = this.turn % 2 === 0 ? BOT_IDS : [...BOT_IDS].reverse();
      for (const id of order) {
        const bot = this.bots().find(candidate => candidate.id === id)!;
        if (bot.operation?.kind === "scan" && this.timeUntilBotEvent(bot) === 0)
          completed = this.processScanEvent(bot) || completed;
        else if (bot.operation?.remaining === 0) {
          this.complete(bot);
          completed = true;
        }
      }
      if (completed) {
        this.turn++;
        this.settle();
      }
    }
    this.revision++;
  }

  private get finished() {
    return this.phase === "finished" || this.phase === "blocked";
  }
  get version() {
    return this.revision;
  }
  get playbackSpeed() {
    return this.speed;
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    this.revision++;
  }
  setSpeed(speed: number) {
    if (![1, 2, 4, 8].includes(speed)) throw new Error("Invalid speed");
    this.speed = speed;
    this.revision++;
  }
  step() {
    if (!this.paused) return;
    this.paused = false;
    this.advance(100);
    this.paused = true;
  }
  stop() {
    this.actors.forEach(actor => actor.stop());
  }

  getSnapshot(afterEventSequence = 0): SessionSnapshot {
    return structuredClone({
      schemaVersion: 7,
      seed: this.seed,
      revision: this.revision,
      worldRevision: this.worldRevision,
      elapsed: this.elapsed,
      phase: this.phase,
      paused: this.paused,
      speed: this.speed,
      world: this.world,
      cloud: this.cloud,
      bots: Object.fromEntries(this.bots().map(bot => [bot.id, bot])) as Record<BotId, BotView>,
      initialResources: this.initialResources,
      lostResources: this.lostResources,
      remainingResources: worldResources(this.world),
      winners: this.winners,
      endReason: this.endReason,
      logs: this.logs,
      eventSequence: this.eventSequence,
      events: this.events.filter(event => event.sequence > afterEventSequence),
    });
  }

  assertInvariants() {
    if (this.cloud && (!this.world[this.cloud.coord]?.walkable || this.cloud.expiresAt <= this.elapsed || this.cloud.nextMoveAt <= this.elapsed))
      throw new Error("Cloud bounds failed");
    let accounted = addResources(worldResources(this.world), this.lostResources);
    for (const bot of this.bots()) {
      transferResources(emptyResources(), bot.cargo, RULES.capacity);
      if (bot.score !== resourceTotal(bot.deposited) || bot.budget < 0 || bot.budget + bot.spent !== bot.score)
        throw new Error("Economy invariant failed");
      if (
        bot.fuel < 0 ||
        bot.fuel > RULES.fuelCapacity ||
        bot.damage < 0 ||
        bot.damage > 100 ||
        bot.radius < RULES.initialExplorationRadius ||
        bot.radius > RULES.maxExplorationRadius ||
        (!bot.droneAvailable && bot.radius !== RULES.initialExplorationRadius)
      )
        throw new Error("Bot bounds failed");
      accounted = addResources(accounted, addResources(bot.cargo, bot.deposited));
    }
    if (RESOURCE_KINDS.some(kind => accounted[kind] !== this.initialResources[kind])) throw new Error("Resource conservation failed");
  }
}
