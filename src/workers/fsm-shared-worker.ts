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

import { createActor } from 'xstate';

import { machineXV5Pure } from '../ai/fsm/machineX/machine.pure.v5.ts';
import { createWorkerContext } from '../ai/fsm/machineX/context/workerContext.ts';
import { botInitialContexts } from '../ai/fsm/machineX/domains/initializing/actions.workerContext.ts';
import { 
  getScheduledEvents
} from '../ai/fsm/machineX/shared/simulatedTrackerCore.ts';
import { setupLogForwarder } from '../logger/logForwarder.ts';

// =========================================================================
// TYPES (inline pour éviter les problèmes d'import worker)
// =========================================================================

type BotId = 'bot-0' | 'bot-1';

// Type minimal pour le contexte FSM (évite les imports complexes)
type FSMContextMinimal = {
  entityId: string;
  vehicle?: { coord?: string | null };
  droneFleet?: { drones?: { explorer?: { visualState?: string } } };
  gridInfo?: {
    tiles: Record<string, unknown>;
    spacing?: number;
    radius?: number;
    departTileCoord?: string;
    syncedAt?: number;
  };
  memory?: { stats?: { tilesExplored?: number } };
  [key: string]: unknown;
};

type MachineEventsMinimal = { type: string; [key: string]: unknown };

interface WorkerMessage {
  type: 'INIT' | 'SEND_EVENT' | 'REQUEST_STATE' | 'CONNECT' | 'RESET';
  botId?: BotId;
  event?: MachineEventsMinimal;
  tiles?: Record<string, unknown>;
  // ✅ Phase 1 Migration: Game config from Zustand stores
  gameConfig?: {
    isClockRunning?: boolean;
    playerCount?: number;
    botCount?: number;
    mapSeed?: number | null;
    selectedView?: 'bot-0' | 'bot-1' | 'both';
  };
}

interface BotStateData {
  value: unknown;
  context: FSMContextMinimal;
  status: string;
}

interface WorkerResponse {
  type: 'STATE_UPDATE' | 'INIT_COMPLETE' | 'CONNECTED' | 'ERROR';
  instanceId: string;
  updateCounter: number;
  botStates: Record<BotId, BotStateData>;
  activeBots: BotId[];
  timestamp: number;
}

// =========================================================================
// WORKER STATE
// =========================================================================

// Unique instance ID pour ce worker
const INSTANCE_ID = `fsm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Compteur global d'updates
let updateCounter = 0;

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

// Tiles store simplifié (injecté depuis la vue principale)
// ⚠️ Note: tilesStore est injecté une seule fois à l'INIT
// La vraie source de vérité après init est context.memory.knownTiles + context.gridInfo.tiles
let tilesStore: Record<string, unknown> = {};

// ✅ Phase 1 Migration: Game config store (replaces Zustand)
let gameConfigStore: {
  isClockRunning: boolean;
  playerCount: number;
  botCount: number;
  mapSeed: number | null;
  selectedView: 'bot-0' | 'bot-1' | 'both';
} = {
  isClockRunning: false,
  playerCount: 1,
  botCount: 2,
  mapSeed: null,
  selectedView: 'both',
};

// ✅ Phase 2 Migration: Shared radius tracking for multi-bot sync
let sharedExplorationRadius = 1;

// =========================================================================
// HELPER: Broadcast to all connected views
// =========================================================================

function broadcastState(): void {
  updateCounter++;
  
  const botStates: Record<string, BotStateData> = {};
  const activeBots: BotId[] = [];
  
  actors.forEach((actor, botId) => {
    try {
      const snapshot = actor.getSnapshot();
      botStates[botId] = {
        value: snapshot.value,
        context: snapshot.context as FSMContextMinimal,
        status: snapshot.status
      };
      activeBots.push(botId);
    } catch (e) {
      console.error(`[WORKER] Error getting snapshot for ${botId}:`, e);
    }
  });
  
  const response: WorkerResponse = {
    type: 'STATE_UPDATE',
    instanceId: INSTANCE_ID,
    updateCounter,
    botStates: botStates as Record<BotId, BotStateData>,
    activeBots,
    timestamp: Date.now()
  };
  
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
    // Vérifier que l'état n'a pas changé
    if (lastStateMap.get(botId) !== stateAtSchedule) {
      pendingEvents?.delete(eventType);
      return;
    }
    
    console.log(`🤖 [WORKER:${botId}] Sending: ${eventType}${reason ? ` (${reason})` : ''}`);
    try {
      actor.send(event);
    } catch (e) {
      console.error(`[WORKER] Error sending event:`, e);
    }
    pendingEvents?.delete(eventType);
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
  console.log('🔄 [WORKER] Resetting all bots...');
  
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
  
  // Recreate and start bots
  createBot('bot-0');
  createBot('bot-1');
  startBot('bot-0');
  startBot('bot-1');
  
  console.log('✅ [WORKER] Bots reset successfully');
  
  // Broadcast new state to all views
  broadcastState();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSnapshot(botId: BotId, snapshot: any): void {
  const state = snapshot.value;
  const stateStr = JSON.stringify(state);
  
  // Éviter de traiter le même état plusieurs fois
  if (stateStr === lastStateMap.get(botId)) return;
  
  // Clear previous timers on state change
  clearTimers(botId);
  lastStateMap.set(botId, stateStr);
  
  // ✅ Phase 2 Migration: Check if radius changed and sync to other bots
  const context = snapshot.context;
  if (context?.config?.exploringRadius && context.config.exploringRadius !== sharedExplorationRadius) {
    const newRadius = context.config.exploringRadius;
    console.log(`🔄 [WORKER] Radius changed by ${botId}: ${sharedExplorationRadius} → ${newRadius}`);
    sharedExplorationRadius = newRadius;
    
    // Sync to all OTHER bots
    actors.forEach((actor, otherBotId) => {
      if (otherBotId !== botId) {
        try {
          actor.send({ type: 'RADIUS_SYNC', newRadius });
          console.log(`🔄 [WORKER] Synced radius ${newRadius} to ${otherBotId}`);
        } catch (e) {
          console.error(`[WORKER] Error syncing radius to ${otherBotId}:`, e);
        }
      }
    });
  }
  
  // ✅ Phase 5 Migration: Use context.gridInfo.tiles as source of truth
  // The FSM context is now the single source of truth for tiles after INIT
  const contextTiles = context?.gridInfo?.tiles || tilesStore;
  
  // Create tile provider from context tiles (with minimal typing)
  const tileProvider = {
    tiles: contextTiles,
    findAssignedDepartTile: (entityId: string) => {
      return Object.values(contextTiles).find(
        (t) => {
          const tile = t as { type?: string; assignedToBot?: string };
          return tile.type === 'depart' && tile.assignedToBot === entityId;
        }
      );
    }
  };
  
  // Obtenir les événements à planifier (context already defined above)
  if (!context) return;
  
  try {
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
  const botContext = createWorkerContext(botId, 'auto') as any;
  
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
    
    // 2. CRITICAL: Populate memory.knownTiles (FSM source of truth)
    botContext.memory.knownTiles = Object.values(tilesStore);
    
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
    rawMessage: message
  });
  
  switch (message.type) {
    case 'CONNECT': {
      // Register port if not already registered
      if (!connectedPorts.includes(port)) {
        connectedPorts.push(port);
        console.log(`🔌 [WORKER] New view connected. Total: ${connectedPorts.length}`);
      }
      
      // Send current state to new connection
      const botStates: Record<string, BotStateData> = {};
      
      actors.forEach((actor, botId) => {
        try {
          const snapshot = actor.getSnapshot();
          botStates[botId] = {
            value: snapshot.value,
            context: snapshot.context as FSMContextMinimal,
            status: snapshot.status
          };
        } catch (_e) {
          // Ignore errors
        }
      });
      
      const connectResponse: WorkerResponse = {
        type: 'CONNECTED',
        instanceId: INSTANCE_ID,
        updateCounter,
        botStates: botStates as Record<BotId, BotStateData>,
        activeBots: Array.from(actors.keys()),
        timestamp: Date.now()
      };
      
      port.postMessage(connectResponse);
      break;
    }
      
    case 'INIT': {
      // Store tiles
      if (message.tiles) {
        tilesStore = message.tiles;
        console.log(`📦 [WORKER] Tiles received: ${Object.keys(tilesStore).length}`);
      }
      
      // ✅ Phase 1 Migration: Store game config
      if (message.gameConfig) {
        gameConfigStore = { ...gameConfigStore, ...message.gameConfig };
        console.log(`⚙️ [WORKER] Game config received:`, gameConfigStore);
      }
      
      // Create and start bots
      createBot('bot-0');
      createBot('bot-1');
      startBot('bot-0');
      startBot('bot-1');
      
      // ✅ Phase 1 Migration: Send initial game config to bots
      if (message.gameConfig) {
        actors.forEach((actor, botId) => {
          try {
            actor.send({ type: 'GAME_CONFIG_UPDATE', config: gameConfigStore });
            console.log(`⚙️ [WORKER] Sent GAME_CONFIG_UPDATE to ${botId}`);
          } catch (e) {
            console.error(`[WORKER] Error sending game config to ${botId}:`, e);
          }
        });
      }
      
      // Broadcast initial state
      broadcastState();
      
      port.postMessage({
        type: 'INIT_COMPLETE',
        instanceId: INSTANCE_ID,
        updateCounter,
        botStates: {},
        activeBots: ['bot-0', 'bot-1'],
        timestamp: Date.now()
      } as WorkerResponse);
      break;
    }
      
    case 'SEND_EVENT':
      if (message.botId && message.event) {
        sendEvent(message.botId, message.event);
      }
      break;
      
    case 'REQUEST_STATE':
      broadcastState();
      break;
      
    case 'RESET':
      resetBots();
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
setupLogForwarder('worker', true);

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  
  port.onmessage = (e: MessageEvent<WorkerMessage>) => {
    handleMessage(port, e.data);
  };
  
  port.start();
  console.log(`🔌 [WORKER] Port connected. Instance: ${INSTANCE_ID}`);
};

console.log(`🚀 [SHARED WORKER] Started. Instance: ${INSTANCE_ID}`);
