/**
 * Types pour les stores Zustand du projet
 * Architecture avec composition des slices pour éviter la redondance
 */

import type { GridCoordinate, WorldPosition } from './coordinates.d';
import type { DroneVisualState } from './drone.d';
import type { BotSnapshot, EmptyBotState, FSMEvent } from './fsm.d';
import type { ResourceStats } from './resources.d';
import type { Path, Tile, TileMap, TileType, TileWithDistance } from './tile.d';
import type { FairnessValidationResult } from '../stores/useTileStore/slices/tileFairnessSlice';

// ============================================================================
// SLICE INTERFACES - Actions et état pour chaque slice
// ============================================================================

/** Interface pour le slice de base des tuiles */
export interface TileBaseSliceActions {
  // État principal
  tiles: TileMap;
  radius: number;
  spacing: number;
  hoveredTile: GridCoordinate | null;
  selectedTile: GridCoordinate | null;
  autoExploreEnabled: boolean;
  debugMode: boolean;
  lastFairnessValidation: FairnessValidationResult | null;

  // Actions de base
  updateHoveredTile: (coord: GridCoordinate | null) => void;
  setTiles: (tiles: TileMap) => void;
  getTile: (coord: GridCoordinate) => Tile | undefined;
  getNeighbors: (coord: GridCoordinate) => Tile[];
  updateTile: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  updateTileState: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  clearTiles: () => void;
}

/** Interface pour le slice de coordonnées */
export interface TileCoordinateSliceActions {
  // Validateurs
  isValidGridCoord: (coord: unknown) => coord is GridCoordinate;
  isValidWorldPosition: (position: unknown) => position is WorldPosition;
  
  // Encodage hexagonal
  encodeHexCoord: (q: number, r: number, radius: number) => GridCoordinate;
  
  // Conversions position/grille
  gridToWorld: (coord: GridCoordinate) => WorldPosition;
  worldToGrid: (position: WorldPosition) => GridCoordinate;
  
  // Vector3 (retour unknown pour éviter dépendance Three.js dans les types)
  toVector3: (position: WorldPosition) => unknown;
  fromVector3: (vector: unknown) => WorldPosition;
  
  // Distance
  hasReachedTarget: (current: WorldPosition, target: WorldPosition, threshold?: number) => boolean;
}

/** Interface pour le slice de pathfinding */
export interface TilePathSliceActions {
  // Pathfinding principal
  findPath: (startCoord: GridCoordinate, targetCoord: GridCoordinate, tiles?: TileMap) => Path;
  
  // Calculs de distance
  calculateDistance: (from: WorldPosition, to: WorldPosition) => number;
  calculatePathDistance: (path: Path, tiles?: TileMap) => number;
  
  // Recherche et analyse
  findTileAtPosition: (position: WorldPosition, tiles?: TileMap) => Tile | null;
  
  // Calculs spécialisés pour drones
  calculateDroneDistance: (
    dronePosition: WorldPosition,
    droneState: DroneVisualState,
    targetPosition?: Tile | null,
    shipPosition?: import('./index').WorldGridPosition
  ) => number;
  tileInRadius: (
    shipPosition: import('./index').WorldGridPosition,
    range: number,
    tiles?: import('./index').TileMap
  ) => import('./index').Tile | null;
}

/** Interface pour le slice de ressources */
export interface TileResourceSliceActions {
  // Gestion des ressources
  collectResources: (coord: GridCoordinate, collector: string) => ResourceStats;
  deductResources: (coord: GridCoordinate, amount: Partial<ResourceStats>) => boolean;
  hasResources: (coord: GridCoordinate, minimum?: Partial<ResourceStats>) => boolean;
  markTileAsCollected: (coord: GridCoordinate, collector?: string) => boolean;
  resetTileResources: (coord: GridCoordinate) => void;
  resetAllTileResources: () => void;
  
  // Analyse des ressources
  analyzeResourcesNearPosition: (
    source: GridCoordinate | { coord: GridCoordinate }, 
    radius?: number
  ) => Array<{
    coord: GridCoordinate;
    position: { x: number; y: number; z: number };
    resources: ResourceStats;
    distance: number;
  }>;
}

/** Interface pour le slice de filtrage */
export interface TileFilterSliceActions {
  // Filtrage et sélection
  getWalkableTiles: () => Tile[];
  getWalkableTilesInRadius: (centerCoord: GridCoordinate, radius: number, options?: object) => TileWithDistance[];
  selectRandomWalkableTile: () => Tile | null;
  getTilesByType: (tileType: TileType) => Tile[];
}

/** Interface pour le slice de marquage */
export interface TileMarkSliceActions {
  // Marquage d'exploration
  markTileAsExplored: (coord: GridCoordinate, explorer?: string) => void;
}

/** Interface pour le slice de génération */
export interface TileGenerationSliceActions {
  // Génération et initialisation
  initializeGameGrid: (radius: number, spacing: number, seed?: number) => TileMap;
  placeGameStations: (tileMap: TileMap, radius: number, seed?: number, spawns?: GridCoordinate[]) => TileMap;
  placeEmptyTiles: (tileMap: TileMap, emptyRatio?: number, seed?: number, spawns?: GridCoordinate[]) => TileMap;
  placeObstacleTiles: (tileMap: TileMap, seed?: number, spawns?: GridCoordinate[]) => TileMap;
  placeDangerTiles: (tileMap: TileMap, seed?: number, spawns?: GridCoordinate[]) => TileMap;
  placeStartingTiles: (tileMap: TileMap, botCount: number, seed?: number) => TileMap;
  assignStartingTiles: (activeBotIds: string[], seed?: number) => void;
}

/** Interface pour le slice d'équité (fairness) */
export interface TileFairnessSliceActions {
  // Seeded Random Number Generator
  createSeededRandom: (seed: number) => () => number;
  
  // Validation des spawns
  calculateHexDistance: (coord1: GridCoordinate, coord2: GridCoordinate) => number;
  validateSpawnDistance: (spawns: GridCoordinate[], radius: number) => import('../stores/useTileStore/slices/tileFairnessSlice.ts').FairnessRuleResult;
  
  // Balance des ressources
  getNeighborResources: (tileMap: TileMap, coord: GridCoordinate, radius: number) => number;
  validateResourceBalance: (tileMap: TileMap, spawns: GridCoordinate[]) => import('../stores/useTileStore/slices/tileFairnessSlice.ts').FairnessRuleResult;
  
  // Accès aux stations
  calculateStationAccess: (tileMap: TileMap, spawn: GridCoordinate, stationType: 'fuel' | 'repair') => number;
  validateStationAccess: (tileMap: TileMap, spawns: GridCoordinate[]) => import('../stores/useTileStore/slices/tileFairnessSlice.ts').FairnessRuleResult[];
  
  // Équité du terrain
  getWalkablePercent: (tileMap: TileMap, coord: GridCoordinate, radius: number) => number;
  validateTerrainFairness: (tileMap: TileMap, spawns: GridCoordinate[]) => import('../stores/useTileStore/slices/tileFairnessSlice.ts').FairnessRuleResult;
  
  // Orchestration
  validateMapFairness: (
    tileMap: TileMap, 
    spawns: GridCoordinate[], 
    radius: number, 
    seed: number, 
    attempt: number
  ) => import('../stores/useTileStore/slices/tileFairnessSlice.ts').FairnessValidationResult;
  
  // Placement avec validation
  placeStartingTilesWithFairness: (
    tileMap: TileMap, 
    botCount: number, 
    radius: number, 
    seed: number
  ) => { tileMap: TileMap; spawns: GridCoordinate[]; validation: import('../stores/useTileStore/slices/tileFairnessSlice.ts').FairnessValidationResult };
}

/** Interface pour le slice des dangers dynamiques */
export interface TileDangerSliceActions {
  // État des dangers dynamiques
  dynamicDangers: Map<string, import('../stores/useTileStore/slices/tileDangerSlice.ts').DynamicDanger>;
  dangerCount: number;
  lastDangerSpawn: number;

  // Actions des dangers
  spawnDynamicDanger: (coord: GridCoordinate, dangerId?: string) => boolean;
  despawnDynamicDanger: (dangerId: string) => boolean;
  moveDynamicDanger: (dangerId: string, newCoord: GridCoordinate) => boolean;
  getDynamicDanger: (dangerId: string) => any | undefined;
  getCurrentDynamicDangers: () => any[];
  checkDangerCollision: (coord: GridCoordinate) => any | null;
  getAllDangerCoords: () => GridCoordinate[];
}

// ============================================================================
// GAME STORE SLICE INTERFACES
// ============================================================================

/** Interface pour le slice de configuration des joueurs */
export interface PlayerCountSliceActions {
  // État
  playerCount: number;
  botCount: number;
  
  // Actions
  setPlayerCount: (count: number) => void;
  setBotCount: (count: number) => void;
}

/** Interface pour le slice d'initialisation */
export interface InitializationFlagsSliceActions {
  // États d'initialisation
  playersInitialized: boolean;
  botsInitialized: boolean;
  tilesInitialized: boolean;
  startingTilesAssigned: boolean;
  fleetPositionsInitialized: Record<string, boolean>;
  
  // Actions d'initialisation
  markPlayersAsInitialized: () => void;
  markBotsAsInitialized: () => void;
  markTilesAsInitialized: () => void;
  markStartingTilesAsAssigned: () => void;
  markFleetPositionsAsInitialized: (botId: string) => void;
  isFleetPositionsInitialized: (botId: string) => boolean;
  isGameInitialized: () => boolean;
}

/** Interface pour le slice de configuration UI */
export interface UiConfigSliceActions {
  // Configuration des couleurs
  botColors: string[];
  humanPlayerColor: string;
  
  // Utilitaires de couleurs
  getBotColor: (botIndex: number) => string;
  getBotColorById: (botId: string) => string;
  getPlayerBaseColor: (index: number) => string;
  getBackgroundColor: (baseColor: string) => string;
}

/** Interface pour le slice d'horloge */
export interface ClockSliceActions {
  // État de l'horloge
  isClockRunning: boolean;
  
  // Actions
  setClockRunning: (isRunning: boolean) => void;
}

/** Interface pour le slice de radius (PHASE 2) */
export interface RadiusSliceActions {
  // État du radius d'exploration partagé
  explorationRadius: number;
  
  // Actions
  getExplorationRadius: () => number;
  incrementRadius: (botId: string) => number;
  isAtMaxRadius: () => boolean;
  resetRadius: () => void;
}

/** Interface pour le slice de seed (FAIRNESS) */
export interface SeedSliceActions {
  // État du seed de génération
  mapSeed: number | null;
  
  // Actions
  generateSeed: () => number;
  setSeed: (seed: number) => void;
  getSeed: () => number | null;
  resetSeed: () => void;
}

// ============================================================================
// COMPOSITION DES STORES - Types globaux via intersection
// ============================================================================

/** Type complet du TileStore (composition de tous les slices) */
export type TileStoreType = TileBaseSliceActions & 
                           TileCoordinateSliceActions & 
                           TilePathSliceActions & 
                           TileResourceSliceActions & 
                           TileFilterSliceActions & 
                           TileMarkSliceActions & 
                           TileGenerationSliceActions &
                           TileFairnessSliceActions &
                           TileDangerSliceActions;
// ============================================================================
// GAME STORE SLICE INTERFACES
// ============================================================================

/** Type complet du GameStore */
export type GameStoreType = PlayerCountSliceActions & 
                           InitializationFlagsSliceActions & 
                           UiConfigSliceActions & 
                           ClockSliceActions &
                           RadiusSliceActions &
                           SeedSliceActions;

// ============================================================================
// XFSM STORE TYPES
// ============================================================================

/** Interface du XFSMStore */
export interface XFSMStoreType {
  // État
  botStates: Record<string, BotSnapshot | EmptyBotState>;
  activeBots: string[];
  
  // Actions
  send: (event: FSMEvent, botId?: string) => void;
  addBot: (botId: string) => void;
  removeBot: (botId: string) => void;
  isBotActive: (botId: string) => boolean;
  getBotState: (botId?: string) => BotSnapshot | EmptyBotState;
  startBot: (botId: string) => void;
}

// ============================================================================
// PLAYER STORE TYPES
// ============================================================================

/** Type pour un message de joueur */
export interface PlayerMessage {
  droneId: string;
  title: string;
  text: string;
  tileName: string;
  timestamp: number;
  isRead: boolean;
  resources?: {
    food: number;
    debris: number;
    special: number;
  };
}

/** Type pour un joueur */
export interface Player {
  id: string;
  messages: PlayerMessage[];
}

/** Interface du PlayerStore */
export interface PlayerStoreType {
  // État
  players: Record<string, Player>;
  
  // Actions
  addPlayer: (playerId: string) => void;
  addMessage: (playerId: string, message: Omit<PlayerMessage, 'isRead'>) => void;
  markMessagesAsRead: (playerId: string) => void;
  markMessageAsRead: (messageIndex: number) => void;
  getPlayer: (playerId: string) => Player | undefined;
  getPlayerMessages: (playerId: string) => PlayerMessage[];
}
