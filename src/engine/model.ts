import type { Resources } from "./resources";
import type { BotId, Coord, World } from "./world";

export type OperationKind = "move" | "scan" | "collect" | "service" | "upgrade" | "purchase" | "rescue";
export type BotPhase =
  | "deciding"
  | "moving"
  | "scanning"
  | "collecting"
  | "servicing"
  | "upgrading"
  | "purchasing"
  | "rescuing"
  | "eliminated"
  | "finished";
export type GoalReason = "collect" | "explore" | "base" | "fuel" | "repair";
export interface Operation {
  kind: OperationKind;
  target: Coord;
  duration: number;
  remaining: number;
}
export interface Bot {
  id: BotId;
  coord: Coord;
  base: Coord;
  cargo: Resources;
  deposited: Resources;
  budget: number;
  spent: number;
  score: number;
  fuel: number;
  damage: number;
  radius: number;
  droneAvailable: boolean;
  known: Coord[];
  harvested: Partial<Record<Coord, Resources>>;
  randomState: number;
  operation: Operation | null;
  route: Coord[];
  goal: { coord: Coord; reason: GoalReason } | null;
  decision: string;
  statistics: { scans: number; collectionAttempts: number; collections: number; steps: number; fuelUsed: number; rescues: number; droneLosses: number };
  visits: Partial<Record<Coord, number>>;
  eliminationReason: string | null;
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
export interface SessionSnapshot {
  schemaVersion: 2;
  seed: number;
  revision: number;
  worldRevision: number;
  elapsed: number;
  phase: "running" | "returning" | "finished" | "blocked";
  paused: boolean;
  speed: number;
  world: World;
  bots: Record<BotId, BotView>;
  initialResources: Resources;
  lostResources: Resources;
  remainingResources: Resources;
  winners: BotId[];
  endReason: string | null;
  logs: SessionLog[];
}
