import type { Tile } from './tile.d.ts';
/**
 * Types FSM (extraits de initialContext.ts)
 */

import type { GridCoordinate } from './coordinates';
import type { DroneFleet } from './drone.d';
import type { ResourceStats } from './resources';
import type { VehicleState } from './vehicle.d';

/** Données d'une tuile connue en mémoire (extrait de initialContext.ts) */
export interface KnownTileData {
  coord: GridCoordinate;
  explored: boolean;
  collected: boolean;
  exploredAt: number | null;
  hasResources: boolean;
  resources: ResourceStats;
  collectedAt: number | null;
  collectedBy: string | null;
}

/** Danger connu sur la carte (extrait de initialContext.ts) */
export interface KnownDanger {
  x: number;
  z: number;
  type: 'enemy' | 'trap' | 'hazard';
}

/** Exploration récente (extrait de initialContext.ts) */
export interface ExplorationRecord {
  coord: GridCoordinate;
  timestamp: number;
  hasResources: boolean;
}

/** Collecte récente (extrait de initialContext.ts) */
export interface CollectionRecord {
  coord: GridCoordinate;
  timestamp: number;
  shipId: string;
}

/** Statistiques de l'entité (extrait de initialContext.ts) */
export interface EntityStats {
  tilesExplored: number;
  tilesCollected: number;
  totalResourcesFound: number;
  lastExploration: ExplorationRecord | null;
  lastCollection: CollectionRecord | null;
  explorationCycles: number;
  currentCycleStartTime: number | null;
  tilesExploredInCycle: number;
  bestTileInCycle: KnownTileData | null;
}

/** Transition d'état FSM (extrait de initialContext.ts) */
export interface StateTransition {
  from: string;
  to: string;
  timestamp: number;
}

/** Mémoire de l'entité (extrait de initialContext.ts) */
export interface EntityMemory {
  knownTiles: Tile[];
  knownDangers: KnownDanger[];
  stats: EntityStats;
  stateHistory: string[];
  transitionHistory: StateTransition[];
}

/** Timestamps du contexte (extrait de initialContext.ts) */
export interface ContextTimestamps {
  stateChange: number;
  lastMovement: number | null;
  lastCollection: number | null;
}

/** Tuile explorée dans un cycle (extrait de initialContext.ts) */
export interface ExploredTile {
  coord: GridCoordinate;
  resources: ResourceStats;
  value: number;
  exploredAt: number;
}

/** Cycle d'exploration multi-tuiles (extrait de initialContext.ts) */
export interface ExplorationCycle {
  isActive: boolean;
  targetTilesCount: number;
  exploredTiles: ExploredTile[];
  bestTileFound: ExploredTile | null;
  startTime: number | null;
  phase: 'idle' | 'exploring' | 'evaluating' | 'collecting';
}


/** Configuration FSM (extrait de initialContext.ts) */
export interface FSMConfig {
  exploringRadius: number;
  collectingRadius: number;
  fuelThreshold: number;
  capacityThreshold: number;
  movementSpeed: number;
  explorationInterval: number;
  enableLogging: boolean;
}

/** Score de l'entité (extrait de initialContext.ts) */
export interface EntityScore {
  resources: ResourceStats;
}

/** Contexte FSM complet (extrait de initialContext.ts) */
export interface FSMContext {
  // Identité
  entityId: string;
  entityType: string;
  autonomousMode: boolean;

  // Véhicule principal
  vehicle: VehicleState;

  // État FSM
  fsmState: string;
  explorationQueue: GridCoordinate[];
  lastAction: string | null;
  error: string | null;
  timestamps: ContextTimestamps;

  // Score et ressources
  score: EntityScore;

  // Mémoire
  memory: EntityMemory;

  // Cycle d'exploration
  explorationCycle: ExplorationCycle;
  // selectedTileForCollection supprimé

  /** Compteur de tuiles explorées (pour stats et viewer) */
  explorationCount?: number;

  // Configuration
  config: FSMConfig;

  // Système de drones
  droneFleet: DroneFleet;

  // ========================================================================
  // ⚠️ DEPRECATED: DEPENDENCY INJECTION PATTERN - No Longer Used
  // ========================================================================
  // This zone was used to hold query results injected by effects, allowing
  // guards to remain pure. This pattern is now OBSOLETE.
  // 
  // REPLACEMENT: Guards now read directly from context.gridInfo.tiles which
  // is populated by TILES_UPDATED event or initial sync in useXFSMStore.
  // This eliminates the need for a separate injection layer.
  // 
  // @deprecated Use context.gridInfo.tiles directly in guards
  // ========================================================================
  injectedData?: {
    /**
     * @deprecated Use context.gridInfo.tiles instead
     */
    availableTiles?: Tile[];

    /**
     * @deprecated Use context.gridInfo.tiles with distance calculations
     */
    nearbyCollectibleTiles?: Array<Tile & { distance: number }>;

    /**
     * @deprecated Compute this in guards if needed
     */
    canReachBase?: boolean;

    /**
     * @deprecated No longer needed
     */
    injectedAt?: number;
  };

  // ========================================================================
  // 🗺️ GRID INFO - Tile data injected at FSM startup (Phase 2)
  // ========================================================================
  // Contains spatial grid data injected from TileStore at bot creation.
  // This allows pure guards and actions to access grid data without
  // calling useTileStore.getState() directly.
  // 
  // Updated via TILES_UPDATED event when grid state changes significantly.
  // ========================================================================
  gridInfo?: {
    /** All tiles in the grid, indexed by coord string "x,z" */
    tiles: Record<string, Tile>;
    
    /** Grid spacing for world position calculations */
    spacing: number;
    
    /** Grid radius for boundary checks */
    radius: number;
    
    /** Depart tile coord for this bot */
    departTileCoord?: string;
    
    /** Timestamp when grid was last synced */
    syncedAt: number;
  };
}

/** Fonction utilitaire de type uniquement pour validation d'état */
export declare const isValidStateTransition: (from: string, to: string) => boolean;

/**
 * Type d'événement FSM générique (pour XState, actions, guards...)
 */
export interface FSMEvent {
  type: string;
  [key: string]: unknown;
}

/** ID unique d'un bot dans le système */
export type BotId = string;

/** Snapshot d'état d'un bot XState */
export type BotSnapshot = import('xstate').Snapshot<unknown>;

/** État vide par défaut pour éviter les undefined */
export interface EmptyBotState {
  value: 'uninitialized';
  context: Partial<FSMContext>;
}

/** Map des états de tous les bots actifs */
export interface BotStatesMap {
  [botId: BotId]: BotSnapshot | EmptyBotState;
}

/** Actions disponibles dans le store XFSM */
export interface XFSMStoreActions {
  send: (event: FSMEvent, botId?: BotId) => void;
  addBot: (botId: BotId) => void;
  startBot: (botId: BotId) => void;
  removeBot: (botId: BotId) => void;
  getBotState: (botId?: BotId) => BotSnapshot | EmptyBotState;
  getActor: (botId?: BotId) => any | null; // Retourne l'acteur XState
  isBotActive: (botId: BotId) => boolean;
}

/** État complet du store XFSM */
export interface XFSMStoreState {
  botStates: BotStatesMap;
  activeBots: BotId[];
}

/** Store XFSM complet (état + actions) */
export type XFSMStore = XFSMStoreState & XFSMStoreActions;

/** États possibles de la FSM (déplacé depuis constants.ts) */
export type FSMState = 
  | 'uninitialized'
  | 'exploring_deploying'
  | 'exploring_returning'
  | 'collecting_moving_to_target'
  | 'collecting_returning_to_base'
  | 'idleAtBase';

/** Type d'entité (déplacé depuis constants.ts) */
export type EntityType = 'auto' | 'player';