/**
 * Engine module exports
 * Singletons for game state management (replaces Zustand stores)
 */

export { gameEngine, type BotSnapshot, type EmptyBotState, type GameConfig, type InitFlags } from './gameEngine';
export { tileManager, type TileManagerState } from './tileManager';
