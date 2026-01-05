/**
 * ============================================================================
 * RADIUS SLICE - Shared exploration radius configuration
 * ============================================================================
 * 
 * PHASE 2: Dynamic radius expansion system
 * 
 * This slice manages the shared exploration radius for all bots:
 * - Initial radius: 1
 * - Max radius: 3 (triggers GAME_OVER when reached)
 * - Incrementable via relocating state with penalties
 */

import type { GameStoreType, RadiusSliceActions } from '../../../types/stores.d.ts';

/** Maximum allowed exploration radius - triggers GAME_OVER when reached */
export const MAX_EXPLORATION_RADIUS = 3;

/** Initial exploration radius for new games */
export const INITIAL_EXPLORATION_RADIUS = 1;

const createRadiusSlice = (set: (fn: (state: GameStoreType) => Partial<GameStoreType>) => void, get: () => GameStoreType): RadiusSliceActions => ({
  
  /* ========================================
   * EXPLORATION RADIUS STATE
   * ======================================== */
  
  /**
   * Current exploration radius (shared by all bots)
   * Starts at 1, can be increased up to MAX_EXPLORATION_RADIUS (3)
   */
  explorationRadius: INITIAL_EXPLORATION_RADIUS,
  
  /* ========================================
   * RADIUS ACTIONS
   * ======================================== */
  
  /**
   * Get current exploration radius
   * @returns Current radius value
   */
  getExplorationRadius: (): number => {
    return get().explorationRadius;
  },
  
  /**
   * Increment exploration radius by 1 (capped at MAX_EXPLORATION_RADIUS)
   * Called when bot enters relocating state and radius < 3
   * 
   * @param botId - ID of the bot requesting the increment (for logging)
   * @returns New radius value, or -1 if already at max
   */
  incrementRadius: (botId: string): number => {
    const currentRadius = get().explorationRadius;
    
    if (currentRadius >= MAX_EXPLORATION_RADIUS) {
      console.warn(`⚠️ [RadiusSlice] ${botId} tried to increment radius but already at max (${MAX_EXPLORATION_RADIUS})`);
      return -1; // Signal that GAME_OVER should trigger
    }
    
    const newRadius = currentRadius + 1;
    
    set(() => ({
      explorationRadius: newRadius
    }));
    
    console.log(`🔄 [RadiusSlice] ${botId} increased exploration radius: ${currentRadius} → ${newRadius}`);
    
    return newRadius;
  },
  
  /**
   * Check if current radius is at maximum (GAME_OVER condition)
   * @returns true if radius >= MAX_EXPLORATION_RADIUS
   */
  isAtMaxRadius: (): boolean => {
    return get().explorationRadius >= MAX_EXPLORATION_RADIUS;
  },
  
  /**
   * Reset radius to initial value (for new game)
   */
  resetRadius: (): void => {
    set(() => ({
      explorationRadius: INITIAL_EXPLORATION_RADIUS
    }));
    console.log(`🔄 [RadiusSlice] Radius reset to ${INITIAL_EXPLORATION_RADIUS}`);
  }
});

export default createRadiusSlice;
