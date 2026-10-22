import type { Resources } from "./resources";
import type { BotId, Coord, World } from "./world";

export type OperationKind = "move" | "wait" | "scan" | "mine" | "mineScan" | "neutralize" | "collect" | "service" | "upgrade" | "memoryUpgrade" | "purchase" | "rescue";
export type BotPhase =
  | "deciding"
  | "moving"
  | "waiting"
  | "scanning"
  | "mining"
  | "mineScanning"
  | "neutralizing"
  | "collecting"
  | "servicing"
  | "upgrading"
  | "memoryUpgrading"
  | "purchasing"
  | "rescuing"
  | "disabled"
  | "finished";
export type GoalReason = "collect" | "explore" | "base" | "fuel" | "repair";
export type BeaconKind = "explore" | "collect";
export interface Beacon {
  botId: BotId;
  coord: Coord;
  kind: BeaconKind;
  status: "pending" | "followed" | "expired";
  reason: string | null;
}
export interface Treasure {
  status: "hidden" | "revealed" | "carried" | "deposited";
  coord: Coord | null;
  developerCoord: Coord | null;
  owner: BotId | null;
}
export interface Operation {
  kind: OperationKind;
  target: Coord;
  duration: number;
  remaining: number;
  minePlacementAttempted?: boolean;
  minePlacementSucceeded?: boolean;
  scanInitialTarget?: Coord;
  scanCheckedSteps?: number;
  scanArrived?: boolean;
  scanEdgeReached?: boolean;
  scanDetour?: {
    contact: Coord;
    edge: Coord;
    destination: Coord;
    contactAt: number;
    edgeAt: number;
    destinationAt: number;
  };
}
export interface MineReport {
  center: Coord;
  radius: number;
  count: number;
  nearestDistance: number | null;
  time: number;
}
export interface ElectricCloud {
  coord: Coord;
  previousCoord: Coord | null;
  appearedAt: number;
  nextMoveAt: number;
  expiresAt: number;
}
export interface Bot {
  id: BotId;
  coord: Coord;
  base: Coord;
  cargo: Resources;
  deposited: Resources;
  budget: number;
  spent: number;
  actions: number;
  actionsSpent: number;
  score: number;
  fuel: number;
  damage: number;
  radius: number;
  droneAvailable: boolean;
  offensiveDroneAvailable: boolean;
  known: Coord[];
  knownMines: Partial<Record<Coord, number>>;
  mineReports: MineReport[];
  mineChecked: Partial<Record<Coord, number>>;
  mineWarning: boolean;
  mineMemoryLevel: number;
  scanned: Coord[];
  explored: Coord[];
  harvested: Partial<Record<Coord, Resources>>;
  randomState: number;
  operation: Operation | null;
  route: Coord[];
  goal: { coord: Coord; reason: GoalReason } | null;
  decision: string;
  statistics: {
    scans: number;
    minesPlaced: number;
    minesExploded: number;
    minesNeutralized: number;
    mineScans: number;
    mineSightings: number;
    collectionAttempts: number;
    collections: number;
    steps: number;
    fuelUsed: number;
    rescues: number;
    droneLosses: number;
  };
  visits: Partial<Record<Coord, number>>;
  immobilizationReason: string | null;
}
export interface BotView extends Bot {
  state: BotPhase;
}
export interface SessionLog {
  sequence: number;
  time: number;
  botId: BotId | null;
  message: string;
}
export type TrustCause = "yield" | "depletion" | "mine-spotted" | "mine-hit" | "drone-lost";
export interface TrustChange {
  toward: BotId;
  cause: TrustCause;
  before: number;
  delta: number;
  after: number;
}
export type SessionEventCategory = "decision" | "movement" | "incident" | "resource" | "maintenance" | "economy" | "lifecycle" | "social";
export type SessionEventType =
  | "session.started"
  | "operation.started"
  | "movement.arrived"
  | "danger.impact"
  | "cloud.appeared"
  | "cloud.moved"
  | "cloud.disappeared"
  | "cloud.impact"
  | "drone.interfered"
  | "drone.bounced"
  | "scan.completed"
  | "mine.placed"
  | "mine.armed"
  | "mine.exploded"
  | "mine.neutralized"
  | "mine.spotted"
  | "mine.forgotten"
  | "mine.scan.completed"
  | "mine.memory.upgraded"
  | "drone.lost"
  | "collection.completed"
  | "resources.deposited"
  | "fuel.refueled"
  | "ship.repaired"
  | "ship.disabled"
  | "exploration.upgraded"
  | "drone.replaced"
  | "fuel.stranded"
  | "cargo.lost"
  | "rescue.completed"
  | "bot.finished"
  | "session.finished"
  | "session.blocked"
  | "trust.changed"
  | "beacon.placed"
  | "beacon.followed"
  | "beacon.expired"
  | "treasure.revealed"
  | "treasure.collected"
  | "treasure.deposited";
export interface SessionEvent {
  sequence: number;
  time: number;
  botId: BotId | null;
  type: SessionEventType;
  category: SessionEventCategory;
  operation?: OperationKind;
  coord?: Coord;
  target?: Coord;
  reason?: string;
  resources?: Resources;
  before?: Partial<Record<"fuel" | "damage" | "budget" | "actions" | "score" | "radius", number>>;
  delta?: Partial<Record<"fuel" | "damage" | "budget" | "actions" | "score" | "radius", number>>;
  after?: Partial<Record<"fuel" | "damage" | "budget" | "actions" | "score" | "radius", number>>;
  trust?: TrustChange;
}
export interface SessionSnapshot {
  schemaVersion: 19;
  seed: number;
  mapRadius: number;
  revision: number;
  worldRevision: number;
  elapsed: number;
  waterLevel: number;
  phase: "running" | "returning" | "finished" | "blocked";
  paused: boolean;
  speed: number;
  world: World;
  cloud: ElectricCloud | null;
  repairAvailableAt: number;
  beacon: Beacon | null;
  treasure: Treasure;
  bots: Record<BotId, BotView>;
  trust: Record<BotId, number>;
  lastTrustChange: Record<BotId, SessionEvent | null>;
  initialResources: Resources;
  lostResources: Resources;
  remainingResources: Resources;
  winners: BotId[];
  endReason: string | null;
  logs: SessionLog[];
  eventSequence: number;
  events: SessionEvent[];
}
