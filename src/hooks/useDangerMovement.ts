/**
 * ============================================================================
 * DANGER MOVEMENT HOOK - DISABLED
 * ============================================================================
 * 
 * This hook has been disabled because it depends on useTileStore which has been removed.
 * Danger movement should now be managed through the FSM context and actions.
 * 
 * To restore danger movement:
 * 1. Move danger logic to FSM actions (assign functions)
 * 2. Use FSM context.gridInfo.tiles for tile mutations
 * 3. Trigger danger movement via FSM events (e.g., DANGER_MOVE)
 * 
 * @deprecated Use FSM-based danger management instead
 */

// This file is kept for reference but should not be imported
export function useDangerMovement() {
  console.warn('useDangerMovement is disabled. Use FSM-based danger management instead.');
  return {
    isDangerSystemActive: false,
    startDangerSystem: () => console.warn('Danger system is disabled'),
    stopDangerSystem: () => {},
    currentDangerPosition: null,
    moveDanger: () => {},
    initializeDynamicDanger: () => {},
    activeDangers: [],
    startDangerMovement: () => {},
  };
}
