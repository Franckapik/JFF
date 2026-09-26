import type { SessionSnapshot } from "./model";
import { GameSession } from "./session";

export type SessionRequest =
  | { protocol: 1; type: "CONNECT" | "INIT" | "REQUEST_STATE" | "PING" | "DISCONNECT" }
  | { protocol: 1; type: "RESET"; gameId: string | null; seed: number }
  | { protocol: 1; type: "CONTROL"; gameId: string; command: "PAUSE" | "RESUME" | "STEP" | "SPEED"; speed?: number };

export interface SessionResponse {
  protocol: 1;
  type: "STATE" | "ERROR" | "DISCONNECTED";
  instanceId: string;
  gameId: string | null;
  snapshot: SessionSnapshot | null;
  error: string | null;
}

export function isSessionRequest(input: unknown): input is SessionRequest {
  if (!input || typeof input !== "object") return false;
  const message = input as Record<string, unknown>;
  if (message.protocol !== 1 || typeof message.type !== "string") return false;
  if (["CONNECT", "INIT", "REQUEST_STATE", "PING", "DISCONNECT"].includes(message.type)) return true;
  if (message.type === "RESET")
    return (
      (message.gameId === null || typeof message.gameId === "string") &&
      typeof message.seed === "number" &&
      Number.isInteger(message.seed) &&
      message.seed >= 0 &&
      message.seed <= 0xffffffff
    );
  return (
    message.type === "CONTROL" &&
    typeof message.gameId === "string" &&
    typeof message.command === "string" &&
    ["PAUSE", "RESUME", "STEP", "SPEED"].includes(message.command) &&
    (message.command !== "SPEED" || ([1, 2, 4, 8].includes(Number(message.speed)) && typeof message.speed === "number"))
  );
}

export class SessionHost {
  private session: GameSession | null = null;
  private gameNumber = 0;
  private gameId: string | null = null;

  constructor(
    readonly instanceId: string,
    private readonly initialSeed = Date.now() >>> 0
  ) {}

  snapshot(error: string | null = null): SessionResponse {
    return {
      protocol: 1,
      type: error ? "ERROR" : "STATE",
      instanceId: this.instanceId,
      gameId: this.gameId,
      snapshot: this.session?.getSnapshot() ?? null,
      error,
    };
  }

  receive(input: unknown): SessionResponse {
    if (!isSessionRequest(input)) return this.snapshot("Commande invalide ou version incompatible");
    if (input.type === "CONNECT" || input.type === "INIT") {
      if (!this.session) this.reset(this.initialSeed);
      return this.snapshot();
    }
    if (input.type === "RESET" || input.type === "CONTROL") {
      if (!this.session || input.gameId !== this.gameId) return this.snapshot("Commande ignoree : cette partie a ete remplacee");
      if (input.type === "RESET") this.reset(input.seed);
      else {
        switch (input.command) {
          case "PAUSE":
            this.session.setPaused(true);
            break;
          case "RESUME":
            this.session.setPaused(false);
            break;
          case "STEP":
            this.session.step();
            break;
          case "SPEED":
            this.session.setSpeed(input.speed!);
            break;
        }
      }
    }
    return this.snapshot();
  }

  advance(milliseconds: number): boolean {
    if (!this.session) return false;
    const before = this.session.version;
    this.session.advance(milliseconds * this.session.playbackSpeed);
    this.session.assertInvariants();
    return before !== this.session.version;
  }

  stop() {
    this.session?.stop();
  }

  private reset(seed: number) {
    const replacement = new GameSession(seed);
    this.session?.stop();
    this.session = replacement;
    this.gameId = `${this.instanceId}:${++this.gameNumber}`;
  }
}
