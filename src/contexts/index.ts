/**
 * Contexts module exports
 * React Context providers (replaces Zustand stores)
 */

// UI Context - View selection, clock state
export { 
  UIProvider, 
  useUI, 
  useSelectedView, 
  useIsClockRunning,
  type BotViewMode 
} from './UIContext';

// Game Context - FSM actors, tiles (Provider only)
export { GameProvider } from './GameContext';

// Game Hooks - Reactive access to engine state
export { 
  useGame, 
  useBotSnapshot,
  useBotStatesFromEngine,
  useActiveBotsFromEngine,
  useTiles,
  useFSMContextFromEngine
} from './useGameHooks';
