/**
 * ==========================================================================
 * GAME HOOKS - Hooks for accessing game engine state
 * ==========================================================================
 * 
 * Separated from GameContext.tsx for Fast Refresh compatibility.
 * These hooks provide reactive access to gameEngine and tileManager.
 */

import { useCallback, useContext, useSyncExternalStore } from 'react';

import { gameEngine, type BotSnapshot, type EmptyBotState } from '../engine/gameEngine';
import { tileManager, type TileManagerState } from '../engine/tileManager';
import type { BotId, FSMContext } from '../types/fsm.d.ts';

import GameContext from './GameContext';

// Re-export types
export type { BotSnapshot, EmptyBotState, TileManagerState };

/**
 * Access the full game context
 */
export function useGame() {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
}

/**
 * Subscribe to a specific bot's snapshot with reactivity
 */
export function useBotSnapshot(botId: BotId): BotSnapshot | EmptyBotState {
  const subscribe = useCallback(
    (callback: () => void) => gameEngine.subscribe(() => callback()),
    []
  );
  
  const getSnapshot = useCallback(
    () => gameEngine.getBotState(botId),
    [botId]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Subscribe to all bot states with reactivity
 */
export function useBotStatesFromEngine(): Record<BotId, BotSnapshot | EmptyBotState> {
  const subscribe = useCallback(
    (callback: () => void) => gameEngine.subscribe(() => callback()),
    []
  );
  
  const getSnapshot = useCallback(
    () => gameEngine.getBotStates(),
    []
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Subscribe to active bots list
 */
export function useActiveBotsFromEngine(): BotId[] {
  const subscribe = useCallback(
    (callback: () => void) => gameEngine.subscribe(() => callback()),
    []
  );
  
  const getSnapshot = useCallback(
    () => gameEngine.getActiveBots(),
    []
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Subscribe to tile manager state
 */
export function useTiles(): TileManagerState {
  const subscribe = useCallback(
    (callback: () => void) => tileManager.subscribe(() => callback()),
    []
  );
  
  const getSnapshot = useCallback(
    () => tileManager.getState(),
    []
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Get FSM context from a bot snapshot
 */
export function useFSMContextFromEngine(botId: BotId): FSMContext | null {
  const snapshot = useBotSnapshot(botId);
  
  if (!snapshot) {
    return null;
  }
  
  // Check for uninitialized state
  const snapshotWithValue = snapshot as { value?: unknown; context?: FSMContext };
  if (snapshotWithValue.value === 'uninitialized') {
    return null;
  }
  
  return snapshotWithValue.context ?? null;
}
