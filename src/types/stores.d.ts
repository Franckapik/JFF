/**
 * Types pour les stores Zustand du projet
 */

import type { GridCoordinate, TileCoordinate, WorldPosition } from './coordinates.d';
import type { BotSnapshot, EmptyBotState, FSMEvent } from './fsm.d';
import type { ResourceStats } from './resources.d';
import type { Tile, TileMap } from './tile.d';

// ============================================================================
// TILE TYPES (pour éviter les any)
// ============================================================================



// ============================================================================
// TILE STORE TYPE (fusion complète)
// ============================================================================

export type TileStoreType = {
  // --- État principal ---
  tiles: TileMap;
  radius: number;
  spacing: number;
  hoveredTile: GridCoordinate | null;
  selectedTile: GridCoordinate | null;
  autoExploreEnabled: boolean;
  debugMode: boolean;

  // --- Actions de base ---
  updateHoveredTile: (coord: GridCoordinate | null) => void;
  setTiles: (tiles: TileMap) => void;
  getTile: (coord: GridCoordinate) => Tile | undefined;
  getNeighbors: (coord: GridCoordinate) => Tile[];
  updateTile: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  updateTileState: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  clearTiles: () => void;

  // --- Ressources ---
  collectResources: (coord: GridCoordinate, collector: string) => ResourceStats;
  deductResources: (coord: GridCoordinate, amount: Partial<ResourceStats>) => boolean;
  hasResources: (coord: GridCoordinate, minimum?: Partial<ResourceStats>) => boolean;
  markTileAsCollected: (coord: GridCoordinate, collector?: string) => boolean;
  resetTileResources: (coord: GridCoordinate) => void;
  resetAllTileResources: () => void;
  analyzeResourcesNearPosition: (source: GridCoordinate | { coord: GridCoordinate }, radius?: number) => Array<{
    coord: GridCoordinate;
    position: { x: number; y: number; z: number };
    resources: ResourceStats;
    distance: number;
  }>;

  // --- Pathfinding ---
  findPath: (startCoord: GridCoordinate, targetCoord: GridCoordinate, tiles?: TileMap) => GridCoordinate[];
  calculateDistance: (
    from: GridCoordinate | TileCoordinate | WorldPosition,
    to: GridCoordinate | TileCoordinate | WorldPosition,
    usePathfinding?: boolean,
    detailed?: boolean
  ) => number;
  calculatePathDistance: (path: GridCoordinate[], tiles?: TileMap) => number;
  findTileAtPosition: (position: WorldPosition, tiles?: TileMap) => Tile | null;
  isReachable: (from: GridCoordinate, to: GridCoordinate, tiles?: TileMap) => boolean;

  // --- Marquage ---
  markTileAsExplored: (coord: GridCoordinate, explorer?: string) => void;

  // --- Filtrage ---
  getWalkableTiles: () => Tile[];
  getWalkableTilesInRadius: (centerCoord: GridCoordinate, radius: number, options?: object) => Tile[];
  selectRandomWalkableTile: () => Tile | null;
  getTilesByType: (tileType: string) => Tile[];

  // --- Coordonnées ---
  isValidGridCoord: (coord: unknown) => coord is GridCoordinate;
  isValidWorldPosition: (position: unknown) => position is WorldPosition;
  gridToWorld: (coord: GridCoordinate | TileCoordinate) => WorldPosition;
  worldToGrid: (position: WorldPosition) => GridCoordinate | TileCoordinate;
  normalizeCoordinate: (coord: GridCoordinate | TileCoordinate | string) => GridCoordinate | null;

  // --- Génération ---
  initializeGameGrid: (radius: number, spacing: number) => TileMap;
  assignStartingTiles: (activeBotIds: string[]) => void;
};

// ============================================================================
// GAME STORE TYPES
// ============================================================================

/** Interface du GameStore */
export interface GameStoreType {
  // Configuration
  playerCount: number;
  botCount: number;
  
  // Couleurs
  getPlayerBaseColor: (index: number) => string;
  getBotColorById: (botId: string) => string;
  
  // Flags d'initialisation
  tilesInitialized: boolean;
  botsInitialized: boolean;
  playersInitialized: boolean;
  startingTilesAssigned: boolean;
  
  // Actions
  markTilesAsInitialized: () => void;
  markBotsAsInitialized: () => void;
  markPlayersAsInitialized: () => void;
  markStartingTilesAsAssigned: (value: boolean) => void;
  isGameInitialized: () => boolean;
  
  // Fleet positions
  isFleetPositionsInitialized: (botId: string) => boolean;
  markFleetPositionsAsInitialized: (botId: string) => void;
  
  // UI colors
  getBackgroundColor: (baseColor: string) => string;
}

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
