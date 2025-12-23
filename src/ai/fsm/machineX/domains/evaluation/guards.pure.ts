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
