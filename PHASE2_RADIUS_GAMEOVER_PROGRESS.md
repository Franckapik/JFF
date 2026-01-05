# PHASE 2: Dynamic Radius & Game Over Implementation

## Overview
Transform the `relocating` state from a convergence point into a functional gameplay mechanic.
When bots exhaust all tiles in their exploration radius, they can **expand the radius** (up to max 3) with penalties, or reach **GAME OVER**.

## Gameplay Rules
- **Initial radius**: 1
- **Max radius**: 3
- **On relocating**:
  - If radius < 3: Increment radius by 1, apply penalties, return to `evaluating`
  - If radius >= 3: Transition to `game_over` (final state)
- **Penalties per relocation**:
  - Score resources: divided by 2
  - Vehicle damage: +30%

## Implementation Checklist

### 1. ✅ GameStore - Add shared radius
- [x] Add `explorationRadius: number` (default: 1) to store
- [x] Add `incrementRadius(botId: string)` action
- [x] Add `getExplorationRadius()` getter
- [x] Update `GameStoreType` in stores.d.ts

### 2. ✅ Events - Add new event types
- [x] `RADIUS_INCREASED` event in events.d.ts and events.pure.v5.ts
- [x] `GAME_OVER` event with reason payload

### 3. ✅ Machine States - Add game_over
- [x] Add `game_over` top-level final state
- [x] Add `onGameOverEntry` action
- [x] Update state machine diagram

### 4. ✅ Relocating Logic - Penalties & transitions
- [x] Modify `assignShipRelocatingContext` to apply penalties
- [x] Read radius from GameStore (not hardcoded)
- [x] Check if radius >= 3 → trigger GAME_OVER
- [x] Otherwise increment radius and trigger RADIUS_INCREASED

### 5. ✅ Relocating Transitions
- [x] Remove `type: 'final'` from relocating
- [x] Add `RADIUS_INCREASED` → `evaluating` transition
- [x] Add `GAME_OVER` → `game_over` transition

### 6. ✅ Guards - Use GameStore radius
- [x] Update `allLocalTilesExplored` to use GameStore radius
- [x] Update `canStartExploring` to use GameStore radius
- [x] Update `hasUnexploredTilesInRadius` to use GameStore radius

### 7. ✅ FSMVisualization - UI updates
- [x] Add `game_over` state display
- [x] Display current radius in Context Memory
- [x] Update Cycle Flow diagram with GAME_OVER path

### 8. ✅ Testing - COMPLETE
- [x] Run `npm run dev:all` - Success
- [x] Verify TypeScript with `tsc --noEmit` - No errors
- [x] Confirm 2 bots reach `game_over` state - ✅ Verified in logs:
  - bot-1: Reached game_over first (status: done)
  - bot-0: Reached game_over after full cycle with Final Score: 2331
  - Both showing: `🔄 [FSM:bot-X] State: game_over | Status: done`
  - Radius confirmed at max: `🔍 [isAtMaxRadius] bot-0: radius=3, max=3, result=true`

## Files Modified
- `src/stores/useGameStore/slices/radiusSlice.ts` (NEW)
- `src/stores/useGameStore/index.ts`
- `src/types/stores.d.ts`
- `src/types/events.d.ts`
- `src/ai/fsm/machineX/events.pure.v5.ts`
- `src/ai/fsm/machineX/machine.pure.v5.ts`
- `src/ai/fsm/machineX/domains/maintenance/actions.assign.ts`
- `src/ai/fsm/machineX/domains/maintenance/actions.effects.ts`
- `src/ai/fsm/machineX/domains/evaluation/guards.pure.ts`
- `src/ai/fsm/machineX/context/initialContext.ts`
- `src/components/FSMVisualization.tsx`

## Anti-Loop Safeguards
1. `shouldRelocateShip` guard requires: all tiles explored + no collectibles + sufficient fuel
2. Radius can only increase (never decrease), capped at 3
3. Each relocation has significant penalties (score/2, damage+30%)
4. Game over at max radius prevents infinite expansion
