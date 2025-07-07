/**
 * Types FSM (extraits de initialContext.ts)
 */

import type { GridCoordinate, TileCoordinate } from './coordinates';
import type { ResourceStats } from './resources';
import type { DroneFleet, VehicleState } from './vehicle';

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
  coord: TileCoordinate;
  timestamp: number;
  hasResources: boolean;
}

/** Collecte récente (extrait de initialContext.ts) */
export interface CollectionRecord {
  coord: TileCoordinate;
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
  knownTiles: Map<GridCoordinate, KnownTileData>;
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
  coord: TileCoordinate;
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

/** Tuile sélectionnée pour collecte (extrait de initialContext.ts) */
export interface SelectedTile {
  coord: TileCoordinate;
  resources: ResourceStats;
  value: number;
}

/** Configuration FSM (extrait de initialContext.ts) */
export interface FSMConfig {
  exploringRadius: number;
  fuelThreshold: number;
  capacityThreshold: number;
  movementSpeed: number;
  explorationInterval: number;
  enableLogging: boolean;
  logLevel: 'info' | 'debug' | 'warn' | 'error';
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
  currentState: string;
  currentTarget: import('./coordinates').TypedTarget | null;
  explorationQueue: TileCoordinate[];
  lastAction: string | null;
  error: string | null;
  timestamps: ContextTimestamps;
  
  // Score et ressources
  score: EntityScore;
  
  // Mémoire
  memory: EntityMemory;
  
  // Cycle d'exploration
  explorationCycle: ExplorationCycle;
  selectedTileForCollection: SelectedTile | null;
  
  // Configuration
  config: FSMConfig;
  
  // Système de drones
  droneFleet: DroneFleet;
}

// Fonction utilitaire de type uniquement pour validation d'état
export const isValidStateTransition = (from: string, to: string): boolean => {
  return typeof from === 'string' && typeof to === 'string' && from !== to;
};
