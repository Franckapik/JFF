/**
 * ==========================================================================
 * GAME ENGINE - Singleton pour la gestion des acteurs XState
 * ==========================================================================
 * 
 * Remplace useXFSMStore et useGameStore.
 * Module singleton qui gère:
 * - Création/démarrage des acteurs XState
 * - Configuration globale du jeu
 * - Flags d'initialisation
 * 
 * @example
 * ```ts
 * import { gameEngine } from './engine/gameEngine';
 * 
 * // Initialisation
 * gameEngine.init({ playerCount: 2 });
 * gameEngine.addBot('bot-0');
 * gameEngine.startBot('bot-0');
 * 
 * // Accès aux acteurs
 * const actor = gameEngine.getActor('bot-0');
 * const snapshot = gameEngine.getBotState('bot-0');
 * ```
 */

import { createBrowserInspector } from '@statelyai/inspect';
import { createActor, type Actor, type Snapshot } from 'xstate';

import { createBroadcastChannel } from '../ai/fsm/broadcast.ts';
import { createMachineContext } from '../ai/fsm/machineX/context/initialContext.ts';
import type { MachineEvents } from '../ai/fsm/machineX/events.pure.v5';
import { machineXV5Pure } from '../ai/fsm/machineX/machine.pure.v5';
import { config as appConfig } from '../config.ts';
import type { BotId, FSMContext } from '../types/fsm.d.ts';
import type { Tile } from '../types/tile.d.ts';

// ==========================================================================
// TYPES
// ==========================================================================

export type BotSnapshot = Snapshot<unknown>;

export interface EmptyBotState {
  value: 'uninitialized';
  context: Partial<FSMContext>;
}

export interface GameConfig {
  playerCount: number;
  botCount: number;
  mapSeed: number | null;
  botColors: string[];
  humanPlayerColor: string;
}

export interface InitFlags {
  playersInitialized: boolean;
  botsInitialized: boolean;
  tilesInitialized: boolean;
  startingTilesAssigned: boolean;
  fleetPositionsInitialized: Record<string, boolean>;
}

type StateChangeCallback = (botId: BotId, snapshot: BotSnapshot) => void;

// ==========================================================================
// SINGLETON CLASS
// ==========================================================================

class GameEngine {
  // XState actors storage
  private actors = new Map<BotId, Actor<typeof machineXV5Pure>>();
  private snapshotCache = new Map<BotId, BotSnapshot>();
  private startedActors = new Set<BotId>();
  
  // Broadcast channel for viewer sync
  private broadcast = createBroadcastChannel();
  
  // Inspector for devtools
  private inspector = appConfig.enableXStateInspection 
    ? createBrowserInspector() 
    : null;
  
  // Configuration
  public config: GameConfig = {
    playerCount: 1,
    botCount: 2,
    mapSeed: null,
    botColors: ['#00bfff', '#ff6b35'],
    humanPlayerColor: '#4caf50',
  };
  
  // Initialization flags
  public initFlags: InitFlags = {
    playersInitialized: false,
    botsInitialized: false,
    tilesInitialized: false,
    startingTilesAssigned: false,
    fleetPositionsInitialized: {},
  };
  
  // Subscribers for state changes
  private subscribers = new Set<StateChangeCallback>();
  
  // Grid data (injected from tileManager)
  private gridData: {
    tiles: Record<string, Tile>;
    spacing: number;
    radius: number;
  } | null = null;

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  init(partialConfig?: Partial<GameConfig>): void {
    if (partialConfig) {
      this.config = { ...this.config, ...partialConfig };
    }
    console.log('🎮 [GameEngine] Initialized with config:', this.config);
  }

  setGridData(tiles: Record<string, Tile>, spacing: number, radius: number): void {
    this.gridData = { tiles, spacing, radius };
    console.log('🗺️ [GameEngine] Grid data set:', {
      tilesCount: Object.keys(tiles).length,
      spacing,
      radius
    });
  }

  // ========================================================================
  // BOT MANAGEMENT
  // ========================================================================

  addBot(botId: BotId): Actor<typeof machineXV5Pure> {
    if (this.actors.has(botId)) {
      return this.actors.get(botId)!;
    }

    // Find depart tile for this bot
    let departTile = null;
    if (this.gridData?.tiles) {
      departTile = Object.values(this.gridData.tiles).find(
        tile => tile.type === 'depart' && tile.assignedToBot === botId
      );
    }

    // Create context
    const botContext = createMachineContext(botId, 'auto');

    // Inject grid info
    if (this.gridData) {
      botContext.gridInfo = {
        tiles: this.gridData.tiles,
        spacing: this.gridData.spacing,
        radius: this.gridData.radius,
        departTileCoord: departTile?.position?.coord,
        syncedAt: Date.now(),
      };
    }

    // Create actor with optional inspector
    const actorConfig = {
      input: botContext,
      ...(this.inspector && { inspect: this.inspector.inspect })
    };

    const actor = createActor(machineXV5Pure, actorConfig);
    this.actors.set(botId, actor);

    console.log(`🤖 [GameEngine] Bot ${botId} created`);
    return actor;
  }

  startBot(botId: BotId): void {
    const actor = this.actors.get(botId);
    if (!actor) {
      console.warn(`[GameEngine] Cannot start bot ${botId}: not found`);
      return;
    }

    if (this.startedActors.has(botId)) {
      console.warn(`[GameEngine] Bot ${botId} already started`);
      return;
    }

    this.startedActors.add(botId);

    // Subscribe to state changes
    actor.subscribe((snapshot: BotSnapshot) => {
      const previousSnapshot = this.snapshotCache.get(botId);
      if (snapshot === previousSnapshot) return;
      
      this.snapshotCache.set(botId, snapshot);
      
      // Notify subscribers
      this.subscribers.forEach(callback => callback(botId, snapshot));

      // Broadcast for viewer
      const snapshotData = snapshot as { value?: unknown; context?: Record<string, unknown> };
      this.broadcast?.post({
        type: 'STATE_UPDATE',
        botId,
        snapshot: {
          value: snapshotData.value ?? 'unknown',
          context: snapshotData.context ?? {},
          status: snapshot.status
        }
      });
    });

    try {
      actor.start();
      const initialSnapshot = actor.getSnapshot();
      this.snapshotCache.set(botId, initialSnapshot);
      console.log(`🚀 [GameEngine] Bot ${botId} started`);
    } catch (error) {
      console.error(`[GameEngine] Error starting bot ${botId}:`, error);
    }
  }

  removeBot(botId: BotId): void {
    const actor = this.actors.get(botId);
    if (actor) {
      actor.stop();
      this.actors.delete(botId);
      this.snapshotCache.delete(botId);
      this.startedActors.delete(botId);
      console.log(`🗑️ [GameEngine] Bot ${botId} removed`);
    }
  }

  // ========================================================================
  // STATE ACCESS
  // ========================================================================

  getActor(botId: BotId): Actor<typeof machineXV5Pure> | null {
    return this.actors.get(botId) ?? null;
  }

  getBotState(botId: BotId): BotSnapshot | EmptyBotState {
    const snapshot = this.snapshotCache.get(botId);
    if (snapshot) return snapshot;
    
    return { value: 'uninitialized', context: {} };
  }

  getBotStates(): Record<BotId, BotSnapshot | EmptyBotState> {
    const states: Record<BotId, BotSnapshot | EmptyBotState> = {};
    for (const botId of this.actors.keys()) {
      states[botId] = this.getBotState(botId);
    }
    return states;
  }

  getActiveBots(): BotId[] {
    return Array.from(this.startedActors);
  }

  isBotActive(botId: BotId): boolean {
    return this.startedActors.has(botId);
  }

  // ========================================================================
  // EVENT SENDING
  // ========================================================================

  send(botId: BotId, event: MachineEvents): void {
    const actor = this.actors.get(botId);
    if (!actor) {
      console.warn(`[GameEngine] Cannot send to bot ${botId}: not found`);
      return;
    }

    if (!this.startedActors.has(botId)) {
      console.warn(`[GameEngine] Cannot send to bot ${botId}: not started`);
      return;
    }

    actor.send(event);
  }

  // ========================================================================
  // SUBSCRIPTIONS
  // ========================================================================

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // ========================================================================
  // INIT FLAGS
  // ========================================================================

  markPlayersAsInitialized(): void {
    this.initFlags.playersInitialized = true;
  }

  markBotsAsInitialized(): void {
    this.initFlags.botsInitialized = true;
  }

  markTilesAsInitialized(): void {
    this.initFlags.tilesInitialized = true;
  }

  markStartingTilesAsAssigned(): void {
    this.initFlags.startingTilesAssigned = true;
  }

  isFullyInitialized(): boolean {
    return (
      this.initFlags.playersInitialized &&
      this.initFlags.botsInitialized &&
      this.initFlags.tilesInitialized &&
      this.initFlags.startingTilesAssigned
    );
  }

  // ========================================================================
  // RESET
  // ========================================================================

  reset(): void {
    // Stop all actors
    for (const botId of this.actors.keys()) {
      this.removeBot(botId);
    }

    // Reset flags
    this.initFlags = {
      playersInitialized: false,
      botsInitialized: false,
      tilesInitialized: false,
      startingTilesAssigned: false,
      fleetPositionsInitialized: {},
    };

    console.log('🔄 [GameEngine] Reset complete');
  }
}

// ==========================================================================
// SINGLETON EXPORT
// ==========================================================================

export const gameEngine = new GameEngine();

export default gameEngine;
