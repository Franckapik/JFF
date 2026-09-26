/**
 * ==========================================================================
 * USE SHARED WORKER STORE - Hook pour se connecter au SharedWorker FSM
 * ==========================================================================
 *
 * Ce store Zustand se connecte au SharedWorker et synchronise l'état FSM
 * pour toutes les vues (vue1, vue2).
 *
 * Utilisation:
 * ```tsx
 * import { useSharedWorkerStore } from '../stores/useSharedWorkerStore';
 *
 * function MyComponent() {
 *   const { botStates, instanceId, updateCounter, isConnected } = useSharedWorkerStore();
 *   // ...
 * }
 * ```
 */

import { create } from "zustand";

import type { MachineEvents } from "../../ai/fsm/machineX/events.pure.v5.ts";
import type { WorkerBotId as BotId, WorkerBotState as BotState, WorkerRequest, WorkerResponse } from "../../types/worker.ts";

// =========================================================================
// TYPES
// =========================================================================

interface SharedWorkerStoreState {
  // Connection state
  isConnected: boolean;
  isInitialized: boolean;
  gameId: string | null;
  mapSeed: number | null;
  errorMessage: string | null;

  // Synchronization proof
  instanceId: string;
  updateCounter: number;
  lastUpdateTimestamp: number;

  // Bot states (synced from worker)
  botStates: Record<BotId, BotState>;
  activeBots: BotId[];

  // Worker reference
  worker: SharedWorker | null;
  port: MessagePort | null;
}

interface SharedWorkerStoreActions {
  // Connection
  connect: () => void;
  disconnect: () => void;

  initGame: () => void;

  // Send event to bot
  sendEvent: (botId: BotId, event: MachineEvents) => void;

  // Request current state
  requestState: () => void;

  // Reset game (reinitialize bots without killing worker)
  resetGame: () => void;
}

type SharedWorkerStore = SharedWorkerStoreState & SharedWorkerStoreActions;

// =========================================================================
// STORE
// =========================================================================

export const useSharedWorkerStore = create<SharedWorkerStore>((set, get) => {
  // =========================================================================
  // MESSAGE HANDLER
  // =========================================================================

  const handleWorkerMessage = (event: MessageEvent<WorkerResponse>) => {
    const data = event.data;
    if (data.type === "ERROR") {
      set({ errorMessage: data.errorMessage ?? "Worker error" });
      return;
    }

    set({
      isConnected: true,
      isInitialized: data.isInitialized,
      gameId: data.gameId,
      mapSeed: data.mapSeed,
      errorMessage: null,
      instanceId: data.instanceId,
      updateCounter: data.updateCounter,
      botStates: data.botStates,
      activeBots: data.activeBots,
      lastUpdateTimestamp: data.timestamp,
    });
  };

  const postMessage = (message: WorkerRequest) => {
    get().port?.postMessage(message);
  };

  // =========================================================================
  // INITIAL STATE
  // =========================================================================

  const initialState: SharedWorkerStoreState = {
    isConnected: false,
    isInitialized: false,
    gameId: null,
    mapSeed: null,
    errorMessage: null,
    instanceId: "",
    updateCounter: 0,
    lastUpdateTimestamp: 0,
    botStates: {} as Record<BotId, BotState>,
    activeBots: [],
    worker: null,
    port: null,
  };

  // =========================================================================
  // ACTIONS
  // =========================================================================

  const actions: SharedWorkerStoreActions = {
    connect: () => {
      const state = get();
      if (state.worker) {
        console.log("[STORE] Already connected");
        return;
      }

      try {
        console.log("🔌 [STORE] Creating SharedWorker...");

        const worker = new SharedWorker(new URL("../../workers/fsm-shared-worker.ts", import.meta.url), {
          type: "module",
          name: "fsm-shared-worker",
        });

        // Handle worker errors
        worker.onerror = e => {
          if (get().worker !== worker) return;
          worker.port.close();
          set({ ...initialState, errorMessage: e.message || "SharedWorker failed to start" });
        };

        const port = worker.port;

        port.onmessage = event => {
          if (get().port === port) handleWorkerMessage(event);
        };
        port.onmessageerror = e => {
          console.error("[STORE] Message error:", e);
          if (get().port !== port) return;
          actions.disconnect();
          set({ errorMessage: "Cannot read SharedWorker message" });
        };

        port.start();

        set({ worker, port, errorMessage: null });

        // Request connection acknowledgment
        postMessage({ type: "CONNECT" });

        console.log("🔌 [STORE] Connecting to SharedWorker...");
      } catch (error) {
        console.error("[STORE] Failed to connect to SharedWorker:", error);
        get().port?.close();
        set({ ...initialState, errorMessage: error instanceof Error ? error.message : "Cannot connect to SharedWorker" });
      }
    },

    disconnect: () => {
      const state = get();
      if (state.port) {
        postMessage({ type: "DISCONNECT" });
        state.port.onmessage = null;
        state.port.onmessageerror = null;
        state.port.close();
      }
      set(initialState);
      console.log("🔌 [STORE] Disconnected from SharedWorker");
    },

    initGame: () => {
      const state = get();
      if (!state.port) {
        console.error("[STORE] Cannot init game: not connected");
        return;
      }

      postMessage({ type: "INIT" });

      console.log("🎮 [STORE] Initializing game in worker...");
    },

    sendEvent: (botId: BotId, event: MachineEvents) => {
      const state = get();
      if (!state.port) {
        console.error("[STORE] Cannot send event: not connected");
        return;
      }

      postMessage({
        type: "SEND_EVENT",
        gameId: state.gameId,
        botId,
        event,
      });
    },

    requestState: () => {
      const state = get();
      if (!state.port) return;

      postMessage({ type: "REQUEST_STATE" });
    },

    resetGame: () => {
      const state = get();
      if (!state.port) {
        console.error("[STORE] Cannot reset game: not connected");
        return;
      }

      postMessage({ type: "RESET", gameId: state.gameId });
    },
  };

  return {
    ...initialState,
    ...actions,
  };
});

export default useSharedWorkerStore;
