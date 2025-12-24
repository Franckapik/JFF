/**
 * ==========================================================================
 * EVALUATION DOMAIN - Pure Guards (No Side Effects, No External Dependencies)
 * ==========================================================================
 * 
 * These guards are 100% testable in Node.js without R3F, Zustand, or React.
 * They accept only FSMContext and return boolean.
 * 
 * All guards follow the pattern: GuardPredicate<FSMContext, MachineEvents>
 */

import type { XStateV5Guard } from '../../../../../types/xstate.v5.types';

/**
 * Pure guard: Check if tiles are available in FSM context
 * 
 * Uses injectedData.availableTiles or memory.knownTiles instead of TileStore.
 * Tiles must be injected into context before this guard can return true.
 * 
 * @returns true if tiles data is available in context
 */
export const hasTilesAvailable: XStateV5Guard = ({ context }) => {
  // Check injected tiles first (from onEvaluatingEntry effect)
  const injectedTiles = context.injectedData?.availableTiles;
  if (injectedTiles && injectedTiles.length > 0) return true;
  
  // Fallback: check known tiles in memory
  const knownTiles = context.memory?.knownTiles || [];
  return knownTiles.length > 0;
};

/**
 * Pure guard: Combined check for tiles available AND exploration conditions
 * 
 * Combines hasTilesAvailable + shouldExplore into a single guard.
 * This is a pure version that only reads FSM context.
 * 
 * @returns true if exploration can start
 */
export const canStartExploring: XStateV5Guard = ({ context }) => {
  // Check 1: Tiles must be available
  const injectedTiles = context.injectedData?.availableTiles;
  const knownTiles = context.memory?.knownTiles || [];
  const hasTiles = (injectedTiles && injectedTiles.length > 0) || knownTiles.length > 0;
  
  if (!hasTiles) return false;
  
  // Check 2: Exploration cycle limit
  const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const MAX_EXPLORATIONS_PER_CYCLE = 2;
  
  if (exploredThisCycle > MAX_EXPLORATIONS_PER_CYCLE) return false;
  
  // Check 3: Vehicle state
  const fuel = context.vehicle?.fuel ?? 0;
  const damage = context.vehicle?.damage ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
  
  const DAMAGE_THRESHOLD = 80;
  
  if (fuel < fuelThreshold) return false;
  if (damage > DAMAGE_THRESHOLD) return false;
  if (isAtCapacity) return false;
  
  return true;
};

/**
 * Pure guard: Check if exploration is appropriate based on vehicle state
 * 
 * Returns true when:
 * - Explored tiles in cycle <= 2 (limit per cycle)
 * - Fuel >= fuelThreshold
 * - Damage <= 80%
 * - Vehicle is NOT at capacity
 * 
 * @param context FSMContext containing vehicle state and memory stats
 * @returns true if exploration should proceed
 * 
 * @example
 * // In Node.js test:
 * const context = {
 *   vehicle: { fuel: 50, damage: 20, isAtCapacity: false },
 *   config: { fuelThreshold: 20 },
 *   memory: { stats: { tilesExploredInCycle: 1 } }
 * };
 * const result = shouldExplore({ context, event: {} });
 * console.log(result); // true
 */
export const shouldExplore: XStateV5Guard = ({ context }) => {
  // Limit: max 2 explorations per cycle
  const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const MAX_EXPLORATIONS_PER_CYCLE = 2;
  
  if (exploredThisCycle > MAX_EXPLORATIONS_PER_CYCLE) {
    return false;
  }

  // ⚠️ NOTE: Cannot check TileStore here (pure guard, no side effects)
  // The assignDroneDeployingContext action will handle empty TileStore gracefully
  
  // Vehicle state checks
  const fuel = context.vehicle?.fuel ?? 0;
  const damage = context.vehicle?.damage ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
  
  const DAMAGE_THRESHOLD = 80;
  
  if (fuel < fuelThreshold) return false;
  if (damage > DAMAGE_THRESHOLD) return false;
  if (isAtCapacity) return false;
  
  return true;
};

/**
 * Pure guard: Check if maintenance is necessary
 * 
 * Returns true when:
 * - Fuel < 30%, OR
 * - Damage > 50%
 * 
 * @param context FSMContext containing vehicle state
 * @returns true if maintenance is needed
 * 
 * @example
 * // In Node.js test:
 * const context = { vehicle: { fuel: 25, damage: 10 } };
 * const result = shouldMaintain({ context, event: {} });
 * console.log(result); // true (low fuel)
 * 
 * const context2 = { vehicle: { fuel: 50, damage: 60 } };
 * const result2 = shouldMaintain({ context: context2, event: {} });
 * console.log(result2); // true (high damage)
 */
export const shouldMaintain: XStateV5Guard = ({ context }) => {
  const fuel = context.vehicle?.fuel ?? 100;
  const damage = context.vehicle?.damage ?? 0;
  
  const FUEL_MAINTENANCE_THRESHOLD = 30;
  const DAMAGE_MAINTENANCE_THRESHOLD = 50;
  
  return fuel < FUEL_MAINTENANCE_THRESHOLD || damage > DAMAGE_MAINTENANCE_THRESHOLD;
};

/**
 * 🔍 Pure guard: Check if collection is appropriate based on available tiles and vehicle state
 * 
 * Returns true when:
 * - Available tiles exist (via injected query result)
 * - Vehicle is NOT at capacity
 * - Vehicle has sufficient fuel
 * 
 * DEPENDENCY INJECTION PATTERN:
 * This guard reads injectedData.availableTiles which is populated by onEvaluatingEntry effect.
 * The effect queries useTileStore and injects results, keeping this guard pure for testing.
 * 
 * ARCHITECTURE: Effect Zone (gets data) → Injection Zone → Guard Zone (uses data)
 * This maintains guard purity while deferring SoC boundary discussion to Phase 2.
 * 
 * @see FSM_CONTEXT_VS_STORES_ANALYSIS.md for long-term architectural options
 * 
 * @param context FSMContext containing injectedData with availableTiles
 * @returns true if collection should proceed
 * 
 * @example
 * // In Node.js test (with injected data):
 * const context = {
 *   vehicle: { fuel: 50, isAtCapacity: false },
 *   config: { fuelThreshold: 20 },
 *   injectedData: { 
 *     availableTiles: [{ coord: { x: 1, z: 1 } }],
 *     injectedAt: Date.now()
 *   }
 * };
 * const result = shouldCollect({ context, event: {} });
 * console.log(result); // true
 */
export const shouldCollect: XStateV5Guard = ({ context }) => {
  // ✅ PURE: Read injected data, not getState()
  const availableTiles = context.injectedData?.availableTiles;
  
  // Must have tiles available to collect
  if (!availableTiles || availableTiles.length === 0) return false;
  
  // Vehicle state checks
  const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
  const fuel = context.vehicle?.fuel ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  
  if (isAtCapacity) return false;
  if (fuel < fuelThreshold) return false;
  
  return true;
};
