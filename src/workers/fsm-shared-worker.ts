/**
 * ==========================================================================
 * FSM SHARED WORKER - Instance unique de la machine XState
 * ==========================================================================
 *
 * Ce SharedWorker contient l'unique instance de la machine XState.
 * Toutes les vues (vue1, vue2) se connectent à ce worker pour recevoir
 * les mêmes états synchronisés.
 *
 * Architecture:
 * - Une seule machine XState par worker
 * - Un tracker simulé intégré (logique pure de simulatedTrackerCore)
 * - Broadcast des snapshots à toutes les vues connectées
 * - Compteur d'updates et ID d'instance pour preuve de synchronisation
 *
 * Note: Ce fichier utilise des types explicites pour éviter les problèmes
 * d'import dans le contexte worker.
 */

import { createActor } from "xstate";

import { createWorkerContext } from "../ai/fsm/machineX/context/workerContext.ts";
import { botInitialContexts } from "../ai/fsm/machineX/domains/initializing/actions.workerContext.ts";
import type { MachineEvents as MachineEventsMinimal } from "../ai/fsm/machineX/events.pure.v5.ts";
import { machineXV5Pure } from "../ai/fsm/machineX/machine.pure.v5.ts";
import { getScheduledEvents } from "../ai/fsm/machineX/shared/simulatedTrackerCore.ts";
import {
    assignStartingTilesToBots,
    initializeGameGrid,
    placeDangerTiles,
    placeEmptyTiles,
    placeGameStations,
    placeObstacleTiles,
    placeStartingTiles,
} from "../core/spatial/hexGrid.ts";
import { setupLogForwarder } from "../logger/logForwarder.ts";
import type { TileMap } from "../types/tile.d.ts";
import type {
    WorkerBotId as BotId,
    WorkerBotState as BotStateData,
    WorkerRequest as WorkerMessage,
    WorkerResponse,
} from "../types/worker.ts";

// =========================================================================
// TYPES (inline pour éviter les problèmes d'import worker)
// =========================================================================

const BOT_IDS: BotId[] = ["bot-0", "bot-1"];

// =========================================================================
// WORKER STATE
// =========================================================================

// Unique instance ID pour ce worker
const INSTANCE_ID = `fsm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Compteur global d'updates
let updateCounter = 0;
let gameNumber = 0;
let gameId: string | null = null;
let mapSeed: number | null = null;
let isStarting = false;

// Actors XState par bot (typed as any for worker compatibility)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actors = new Map<BotId, any>();
const startedActors = new Set<BotId>();

// Timers pour le tracker simulé
const timersMap = new Map<BotId, ReturnType<typeof setTimeout>[]>();
const pendingEventsMap = new Map<BotId, Map<string, boolean>>();
const lastStateMap = new Map<BotId, string>();

// Ports connectés (vues)
const connectedPorts: MessagePort[] = [];

let tilesStore: TileMap = {};

// ✅ Phase 2 Migration: Shared radius tracking for multi-bot sync
let sharedExplorationRadius = 1;

// =========================================================================
// HELPER: Broadcast to all connected views
// =========================================================================

function createResponse(type: WorkerResponse["type"]): WorkerResponse {
  const botStates: Record<string, BotStateData> = {};
  const activeBots: BotId[] = [];

  actors.forEach((actor, botId) => {
    try {
      const snapshot = actor.getSnapshot();
      botStates[botId] = {
        value: snapshot.value,
        context: snapshot.context,
        status: snapshot.status,
      };
      activeBots.push(botId);
    } catch (e) {
      console.error(`[WORKER] Error getting snapshot for ${botId}:`, e);
    }
  });

  return {
    type,
    instanceId: INSTANCE_ID,
    gameId,
    mapSeed,
    isInitialized: gameId !== null && !isStarting,
    updateCounter,
    botStates: botStates as Record<BotId, BotStateData>,
    activeBots,
    timestamp: Date.now(),
  };
}

function broadcastState(type: WorkerResponse["type"] = "STATE_UPDATE"): void {
  if (isStarting) return;
  updateCounter++;
  const response = createResponse(type);

  // Filter out closed ports
  const validPorts: MessagePort[] = [];
  connectedPorts.forEach(port => {
    try {
      port.postMessage(response);
      validPorts.push(port);
    } catch (_e) {
      // Port is closed, don't add to valid ports
    }
  });

  // Update connectedPorts to only include valid ports
  connectedPorts.length = 0;
  validPorts.forEach(p => connectedPorts.push(p));
}

// =========================================================================
// TRACKER SIMULÉ (adapté de useMultiSimulatedTracker)
// =========================================================================

function scheduleEvent(botId: BotId, event: MachineEventsMinimal, delay: number, reason?: string): void {
  const actor = actors.get(botId);
  if (!actor) return;

  let pendingEvents = pendingEventsMap.get(botId);
  if (!pendingEvents) {
    pendingEvents = new Map();
    pendingEventsMap.set(botId, pendingEvents);
  }

  let timers = timersMap.get(botId);
  if (!timers) {
    timers = [];
    timersMap.set(botId, timers);
  }

  const stateAtSchedule = lastStateMap.get(botId) || null;
  const eventType = event.type;

  // Éviter les doublons
  if (pendingEvents.has(eventType)) {
    return;
  }

  pendingEvents.set(eventType, true);

  const timer = setTimeout(() => {
    pendingEvents?.delete(eventType);
    const timerIndex = timers.indexOf(timer);
    if (timerIndex !== -1) timers.splice(timerIndex, 1);

    if (actors.get(botId) !== actor || lastStateMap.get(botId) !== stateAtSchedule) {
      return;
    }

    console.log(`🤖 [WORKER:${botId}] Sending: ${eventType}${reason ? ` (${reason})` : ""}`);
    try {
      actor.send(event);
    } catch (e) {
      console.error(`[WORKER] Error sending event:`, e);
    }
  }, delay);

  timers.push(timer);
}

function clearTimers(botId: BotId): void {
  const timers = timersMap.get(botId) || [];
  timers.forEach(timer => clearTimeout(timer));
  timersMap.set(botId, []);
  pendingEventsMap.set(botId, new Map());
}

// =========================================================================
// RESET BOTS (sans tuer le worker)
// =========================================================================

function resetBots(): void {
  console.log("🔄 [WORKER] Resetting all bots...");

  const seed = Math.max(Date.now(), (mapSeed ?? 0) + 1);
  let tiles = initializeGameGrid({ radius: 3, spacing: -0.2, seed });
  tiles = placeEmptyTiles(tiles, 0.15, seed);
  tiles = placeObstacleTiles(tiles, seed);
  tiles = placeDangerTiles(tiles, seed);
  tiles = placeStartingTiles(tiles, BOT_IDS.length, seed);
  tiles = placeGameStations(tiles, { radius: 3, seed });
  tiles = assignStartingTilesToBots(tiles, BOT_IDS);

  if (!BOT_IDS.every(botId => Object.values(tiles).some(tile => tile.type === "depart" && tile.assignedToBot === botId))) {
    throw new Error("Map generation did not provide a starting tile for each bot");
  }

  // Clear timers for all bots
  actors.forEach((_, botId) => {
    clearTimers(botId);
  });

  // Clear timers and events maps
  timersMap.clear();
  pendingEventsMap.clear();
  lastStateMap.clear();

  // Stop all actors
  actors.forEach((actor, botId) => {
    try {
      actor.stop();
    } catch (e) {
      console.error(`[WORKER] Error stopping actor ${botId}:`, e);
    }
  });

  startedActors.clear();
  actors.clear();
  botInitialContexts.clear();
  sharedExplorationRadius = 1;
  tilesStore = tiles;
  mapSeed = seed;
  gameId = `${INSTANCE_ID}:${++gameNumber}`;

  isStarting = true;
  try {
    BOT_IDS.forEach(createBot);
    BOT_IDS.forEach(startBot);
  } finally {
    isStarting = false;
  }

  console.log("✅ [WORKER] Bots reset successfully");

  // Broadcast new state to all views
  broadcastState("INIT_COMPLETE");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSnapshot(botId: BotId, snapshot: any): void {
  const state = snapshot.value;
  const context = snapshot.context;
  if (!context) return;
  const stateStr = JSON.stringify([
    state,
    context.vehicle?.currentPath,
    context.vehicle?.pathIndex,
    context.vehicle?.targetVehicleTile?.position?.coord,
    context.droneFleet?.drones?.explorer?.targetDroneTile?.position?.coord,
  ]);
  const scheduleChanged = stateStr !== lastStateMap.get(botId);

  if (scheduleChanged) {
    clearTimers(botId);
    lastStateMap.set(botId, stateStr);
  }

  // ✅ Phase 2 Migration: Check if radius changed and sync to other bots
  if (context?.config?.exploringRadius && context.config.exploringRadius !== sharedExplorationRadius) {
    const newRadius = context.config.exploringRadius;
    console.log(`🔄 [WORKER] Radius changed by ${botId}: ${sharedExplorationRadius} → ${newRadius}`);
    sharedExplorationRadius = newRadius;

    // Sync to all OTHER bots
    actors.forEach((actor, otherBotId) => {
      if (otherBotId !== botId) {
        try {
          actor.send({ type: "RADIUS_SYNC", newRadius });
          console.log(`🔄 [WORKER] Synced radius ${newRadius} to ${otherBotId}`);
        } catch (e) {
          console.error(`[WORKER] Error syncing radius to ${otherBotId}:`, e);
        }
      }
    });
  }

  if (!scheduleChanged) {
    broadcastState();
    return;
  }

  // ✅ Phase 5 Migration: Use context.gridInfo.tiles as source of truth
  // The FSM context is now the single source of truth for tiles after INIT
  const contextTiles = context?.gridInfo?.tiles || tilesStore;

  // Create tile provider from context tiles (with minimal typing)
  const tileProvider = {
    tiles: contextTiles,
    findAssignedDepartTile: (entityId: string) => {
      return Object.values(contextTiles).find(t => {
        const tile = t as { type?: string; assignedToBot?: string };
        return tile.type === "depart" && tile.assignedToBot === entityId;
      });
    },
  };

  try {
    // 🔍 DEBUG: Log context state for exploring transitions
    if (typeof state === "object" && "exploring" in state) {
      const exploringSubState = (state as Record<string, unknown>).exploring;
      const hasDroneTarget = !!context.droneFleet?.drones?.explorer?.targetDroneTile;
      const targetCoord = context.droneFleet?.drones?.explorer?.targetDroneTile?.position?.coord;

      console.log(`🔍 [WORKER:${botId}] EXPLORING STATE DEBUG:`, {
        subState: exploringSubState,
        hasDroneTarget,
        targetCoord,
        droneCoord: context.droneFleet?.drones?.explorer?.coord,
      });
    }

    const scheduledEvents = getScheduledEvents(
      state,
      context,
      false, // verbose
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tileProvider as any
    );

    // Planifier tous les événements
    scheduledEvents.forEach(({ event, delay, reason }) => {
      scheduleEvent(botId, event as MachineEventsMinimal, delay, reason);
    });
  } catch (e) {
    console.error(`[WORKER] Error scheduling events:`, e);
  }

  // Broadcast to all views
  broadcastState();
}

// =========================================================================
// BOT CREATION & MANAGEMENT
// =========================================================================

function createBot(botId: BotId): void {
  if (actors.has(botId)) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const botContext = createWorkerContext(botId, "auto") as any;
  botContext.gameConfig.mapSeed = mapSeed;

  // Inject tiles if available
  if (Object.keys(tilesStore).length > 0) {
    // 1. Inject into gridInfo (for backward compat)
    botContext.gridInfo = {
      tiles: tilesStore,
      spacing: 1.2,
      radius: 3,
      departTileCoord: undefined,
      syncedAt: Date.now(),
    };

    // 2. ✅ FIX: Do NOT populate memory.knownTiles initially!
    // memory.knownTiles should ONLY contain tiles that have been explored by the drone
    // Pre-populating this breaks the exploration logic and makes bots think they have collectible tiles
    // before exploring anything
    botContext.memory.knownTiles = []; // Empty at start - tiles added via DRONE_HAS_SCANNED

    // DEBUG: Check tile structure
    const sampleTile = Object.values(tilesStore)[0] as any;
    const tileHasNeighbors = sampleTile?.neighbors ? true : false;
    const tileHasPosition = sampleTile?.position ? true : false;
    const tileHasCoord = sampleTile?.position?.coord ? true : false;

    console.log(`✅ [WORKER] Bot ${botId} created with ${Object.keys(tilesStore).length} tiles in gridInfo AND memory.knownTiles`);
    console.log(`   🔍 Sample tile structure: neighbors=${tileHasNeighbors}, position=${tileHasPosition}, coord=${tileHasCoord}`);
  } else {
    console.warn(`⚠️ [WORKER] Bot ${botId} created WITHOUT tiles - initialization may fail`);
  }

  // ✅ CRITICAL: Store initial context in the shared map for context initialization
  // XState v5's context function may not receive input properly, so use this fallback
  botInitialContexts.set(botId, botContext as any);

  // ✅ ALSO: Try passing context via input to machine
  const actor = createActor(machineXV5Pure, { input: botContext as any });

  actors.set(botId, actor);

  // Initialize timer structures
  timersMap.set(botId, []);
  pendingEventsMap.set(botId, new Map());

  console.log(`✅ [WORKER] Bot ${botId} created with context from input`);
  console.log(`   🔍 Context ready: entityId=${botContext.entityId}, tiles=${Object.keys(botContext.gridInfo?.tiles || {}).length}`);
}

function startBot(botId: BotId): void {
  const actor = actors.get(botId);
  if (!actor || startedActors.has(botId)) return;

  startedActors.add(botId);

  // Subscribe to state changes
  actor.subscribe((snapshot: unknown) => {
    handleSnapshot(botId, snapshot);
  });

  actor.start();
  console.log(`🚀 [WORKER] Bot ${botId} started`);
}

function sendEvent(botId: BotId, event: MachineEventsMinimal): void {
  const actor = actors.get(botId);
  if (actor) {
    try {
      actor.send(event);
    } catch (e) {
      console.error(`[WORKER] Error sending event to ${botId}:`, e);
    }
  }
}

// =========================================================================
// MESSAGE HANDLER
// =========================================================================

function handleMessage(port: MessagePort, message: WorkerMessage): void {
  console.log(`[WORKER] Received message:`, {
    type: message.type,
    typeOf: typeof message.type,
    rawMessage: message,
  });

  switch (message.type) {
    case "CONNECT": {
      // Register port if not already registered
      if (!connectedPorts.includes(port)) {
        connectedPorts.push(port);
        console.log(`🔌 [WORKER] New view connected. Total: ${connectedPorts.length}`);
      }

      port.postMessage(createResponse("CONNECTED"));
      break;
    }

    case "DISCONNECT": {
      const index = connectedPorts.indexOf(port);
      if (index !== -1) connectedPorts.splice(index, 1);
      port.close();
      break;
    }

    case "INIT": {
      if (gameId === null) {
        resetBots();
      } else {
        port.postMessage(createResponse("INIT_COMPLETE"));
      }
      break;
    }

    case "SEND_EVENT":
      if (message.gameId === gameId && message.botId && message.event) {
        sendEvent(message.botId, message.event);
      }
      break;

    case "REQUEST_STATE":
      broadcastState();
      break;

    case "RESET":
      if (message.gameId === gameId) resetBots();
      break;

    default:
      console.warn(`[WORKER] Unknown message type: ${(message as { type: string }).type}`);
  }
}

// =========================================================================
// SHARED WORKER ENTRY POINT
// =========================================================================

// SharedWorkerGlobalScope declaration for TypeScript
declare const self: {
  onconnect: (event: MessageEvent) => void;
};

// ✅ Setup log forwarding to VS Code terminal
setupLogForwarder("worker", import.meta.env.DEV);

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];

  port.onmessage = (e: MessageEvent<WorkerMessage>) => {
    try {
      handleMessage(port, e.data);
    } catch (error) {
      port.postMessage({
        ...createResponse("ERROR"),
        errorMessage: error instanceof Error ? error.message : "Worker request failed",
      } satisfies WorkerResponse);
    }
  };

  port.start();
  console.log(`🔌 [WORKER] Port connected. Instance: ${INSTANCE_ID}`);
};

console.log(`🚀 [SHARED WORKER] Started. Instance: ${INSTANCE_ID}`);
