import { create } from "zustand";

import type { SessionSnapshot } from "../engine/model";
import type { SessionRequest, SessionResponse } from "../engine/protocol";

interface SessionStore {
  status: "disconnected" | "connecting" | "connected";
  instanceId: string;
  gameId: string | null;
  snapshot: SessionSnapshot | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  control: (command: "PAUSE" | "RESUME" | "STEP" | "SPEED", speed?: number) => void;
  reset: (seed?: number) => void;
  dismissError: () => void;
}

let worker: SharedWorker | null = null;
let port: MessagePort | null = null;
let heartbeat: ReturnType<typeof setInterval> | undefined;
let handshake: ReturnType<typeof setTimeout> | undefined;
let lastSeen = 0;

function closeConnection() {
  clearInterval(heartbeat);
  clearTimeout(handshake);
  if (port) {
    port.postMessage({ protocol: 1, type: "DISCONNECT" } satisfies SessionRequest);
    port.onmessage = null;
    port.onmessageerror = null;
    port.close();
  }
  if (worker) worker.onerror = null;
  worker = null;
  port = null;
}

export const useSessionStore = create<SessionStore>((set, get) => {
  const fail = (message: string) => {
    closeConnection();
    set({ status: "disconnected", error: message });
  };
  const send = (message: SessionRequest) => {
    try {
      port?.postMessage(message);
    } catch {
      fail("Connexion interrompue");
    }
  };
  return {
    status: "disconnected",
    instanceId: "",
    gameId: null,
    snapshot: null,
    error: null,
    connect: () => {
      if (port) return;
      set({ status: "connecting", error: null });
      try {
        worker = new SharedWorker(new URL("../workers/session-worker.ts", import.meta.url), { type: "module", name: "jff-session-v5" });
        const connection = worker.port;
        port = connection;
        worker.onerror = () => {
          if (port === connection) fail("Le moteur ne peut pas demarrer. Reessayez la connexion.");
        };
        connection.onmessageerror = () => {
          if (port === connection) fail("Reponse du moteur illisible");
        };
        connection.onmessage = ({ data }: MessageEvent<SessionResponse>) => {
          if (port !== connection) return;
          if (data?.type === "DISCONNECTED") {
            fail(data.error ?? "Connexion interrompue");
            return;
          }
          if (!data || data.protocol !== 1 || data.snapshot?.schemaVersion !== 10) {
            fail(data?.error ?? "Version du moteur incompatible. Fermez les anciens onglets du jeu, puis reconnectez-vous.");
            return;
          }
          clearTimeout(handshake);
          lastSeen = Date.now();
          const previous = get();
          const sameGame = previous.gameId === data.gameId && !!previous.snapshot;
          const previousEvents = sameGame ? previous.snapshot!.events : [];
          const lastEventSequence = previousEvents[previousEvents.length - 1]?.sequence ?? 0;
          const newEvents = sameGame ? data.snapshot.events.filter(event => event.sequence > lastEventSequence) : data.snapshot.events;
          const events = sameGame && newEvents.length === 0 ? previousEvents : sameGame ? [...previousEvents, ...newEvents] : newEvents;
          const world = sameGame && previous.snapshot!.worldRevision === data.snapshot.worldRevision ? previous.snapshot!.world : data.snapshot.world;
          const snapshot = { ...data.snapshot, world, events };
          set({ status: "connected", instanceId: data.instanceId, gameId: data.gameId, snapshot, error: data.error });
        };
        connection.start();
        handshake = setTimeout(() => {
          if (port === connection) fail("Le moteur ne repond pas");
        }, 5000);
        lastSeen = Date.now();
        send({ protocol: 1, type: "CONNECT" });
        heartbeat = setInterval(() => {
          if (document.visibilityState === "visible" && Date.now() - lastSeen > 45000) {
            fail("Connexion au moteur perdue");
            return;
          }
          send({ protocol: 1, type: "PING" });
        }, 15000);
      } catch (error) {
        fail(error instanceof Error ? error.message : "SharedWorker indisponible");
      }
    },
    disconnect: () => {
      closeConnection();
      set({ status: "disconnected" });
    },
    control: (command, speed) => {
      const state = get();
      if (state.status !== "connected" || !state.gameId) return;
      send({ protocol: 1, type: "CONTROL", gameId: state.gameId, command, speed });
    },
    reset: (seed = crypto.getRandomValues(new Uint32Array(1))[0]) => {
      const state = get();
      if (state.status !== "connected") return;
      send({ protocol: 1, type: "RESET", gameId: state.gameId, seed });
    },
    dismissError: () => set({ error: null }),
  };
});
