/**
 * ==========================================================================
 * GAME CONTEXT - React Context pour accès au Game Engine
 * ==========================================================================
 * 
 * Expose le gameEngine singleton dans l'arbre React avec réactivité.
 * Fournit des hooks pour accéder aux états FSM des bots.
 * 
 * @example
 * ```tsx
 * import { GameProvider, useGame, useBotSnapshot } from './contexts/GameContext';
 * 
 * // Dans App
 * <GameProvider>
 *   <MyComponent />
 * </GameProvider>
 * 
 * // Dans un composant
 * const { send, getActiveBots } = useGame();
 * const snapshot = useBotSnapshot('bot-0');
 * ```
 */

import React, { 
  createContext, 
  useState, 
  useEffect, 
  useMemo
} from 'react';

import { gameEngine, type BotSnapshot, type EmptyBotState } from '../engine/gameEngine';
import { tileManager } from '../engine/tileManager';

import type { MachineEvents } from '../ai/fsm/machineX/events.pure.v5';
import type { BotId } from '../types/fsm.d.ts';
import type { TileMap } from '../types/index.ts';

// Re-export types from engine for convenience
export type { BotSnapshot, EmptyBotState } from '../engine/gameEngine';
export type { TileManagerState } from '../engine/tileManager';

// ==========================================================================
// TYPES
// ==========================================================================

interface GameContextValue {
  // Bot management
  addBot: (botId: BotId) => void;
  startBot: (botId: BotId) => void;
  removeBot: (botId: BotId) => void;
  
  // State access
  getActiveBots: () => BotId[];
  getBotState: (botId: BotId) => BotSnapshot | EmptyBotState;
  isBotActive: (botId: BotId) => boolean;
  
  // Event sending
  send: (botId: BotId, event: MachineEvents) => void;
  
  // Tile management
  initializeGrid: (radius: number, spacing: number) => TileMap;
  assignStartingTiles: (botIds: string[]) => void;
  placeGameStations: () => void;
  
  // Initialization
  isFullyInitialized: () => boolean;
  markPlayersAsInitialized: () => void;
  markBotsAsInitialized: () => void;
  markTilesAsInitialized: () => void;
  markStartingTilesAsAssigned: () => void;
}

// ==========================================================================
// CONTEXT
// ==========================================================================

const GameContext = createContext<GameContextValue | null>(null);

// ==========================================================================
// PROVIDER
// ==========================================================================

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  // Force re-render on state changes
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    // Subscribe to gameEngine state changes
    const unsubscribeEngine = gameEngine.subscribe(() => {
      forceUpdate(n => n + 1);
    });

    // Subscribe to tileManager state changes
    const unsubscribeTiles = tileManager.subscribe(() => {
      forceUpdate(n => n + 1);
    });

    return () => {
      unsubscribeEngine();
      unsubscribeTiles();
    };
  }, []);

  // Memoize context value
  const value = useMemo<GameContextValue>(() => ({
    // Bot management
    addBot: (botId: BotId) => {
      gameEngine.addBot(botId);
      forceUpdate(n => n + 1);
    },
    startBot: (botId: BotId) => {
      gameEngine.startBot(botId);
      forceUpdate(n => n + 1);
    },
    removeBot: (botId: BotId) => {
      gameEngine.removeBot(botId);
      forceUpdate(n => n + 1);
    },
    
    // State access (delegate to engine)
    getActiveBots: () => gameEngine.getActiveBots(),
    getBotState: (botId: BotId) => gameEngine.getBotState(botId),
    isBotActive: (botId: BotId) => gameEngine.isBotActive(botId),
    
    // Event sending
    send: (botId: BotId, event: MachineEvents) => gameEngine.send(botId, event),
    
    // Tile management (delegate to tileManager)
    initializeGrid: (radius: number, spacing: number) => {
      const tiles = tileManager.initializeGrid(radius, spacing);
      gameEngine.setGridData(tiles, spacing, radius);
      return tiles;
    },
    assignStartingTiles: (botIds: string[]) => {
      tileManager.assignStartingTiles(botIds);
      // Update grid data in engine
      gameEngine.setGridData(tileManager.tiles, tileManager.spacing, tileManager.radius);
    },
    placeGameStations: () => tileManager.placeGameStations(),
    
    // Initialization flags
    isFullyInitialized: () => gameEngine.isFullyInitialized(),
    markPlayersAsInitialized: () => gameEngine.markPlayersAsInitialized(),
    markBotsAsInitialized: () => gameEngine.markBotsAsInitialized(),
    markTilesAsInitialized: () => gameEngine.markTilesAsInitialized(),
    markStartingTilesAsAssigned: () => gameEngine.markStartingTilesAsAssigned(),
  }), []);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Hooks are in useGameHooks.ts for Fast Refresh compatibility
// Import them from './useGameHooks' or from './index'

export default GameContext;
