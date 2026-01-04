/**
 * Types pour les stores Zustand du projet
 * Architecture avec composition des slices pour éviter la redondance
 */

import type { GridCoordinate, WorldPosition } from './coordinates.d';
import type { DroneVisualState } from './drone.d';
import type { BotSnapshot, EmptyBotState, FSMEvent } from './fsm.d';
import type { ResourceStats } from './resources.d';
import type { Path, Tile, TileMap, TileType, TileWithDistance } from './tile.d';

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
  initializeGameGrid: (radius: number, spacing: number) => TileMap;
  placeGameStations: (tileMap: TileMap, radius: number) => TileMap;
  placeEmptyTiles: (tileMap: TileMap, emptyRatio?: number) => TileMap;
  placeObstacleTiles: (tileMap: TileMap) => TileMap;
  placeDangerTiles: (tileMap: TileMap) => TileMap;
  placeStartingTiles: (tileMap: TileMap, botCount: number) => TileMap;
  assignStartingTiles: (activeBotIds: string[]) => void;
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
                           TileGenerationSliceActions;
// ============================================================================
// GAME STORE SLICE INTERFACES
// ============================================================================

/** Type complet du GameStore */
export type GameStoreType = PlayerCountSliceActions & 
                           InitializationFlagsSliceActions & 
                           UiConfigSliceActions & 
                           ClockSliceActions;

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
