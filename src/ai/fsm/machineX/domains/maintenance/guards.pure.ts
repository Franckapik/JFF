/**
 * ==========================================================================
 * MAINTENANCE DOMAIN - Pure Guards (No Side Effects, No External Dependencies)
 * ==========================================================================
 * 
 * These guards are 100% testable in Node.js without R3F, Zustand, or React.
 * They accept only FSMContext and return boolean.
 * 
 * All guards follow the pattern: GuardPredicate<FSMContext, MachineEvents>
 */

import type { XStateV5Guard } from '../../../../../types/xstate.v5.types';

/**
 * Pure guard: Check if vehicle needs refueling (fuel < 30%)
 * 
 * @param context FSMContext containing vehicle state
 * @returns true if vehicle fuel is below 30 percent threshold
 * 
 * @example
 * // In Node.js test:
 * const context = { vehicle: { fuel: 25 } };
 * const result = needsRefuel({ context, event: {} });
 * console.log(result); // true
 */
export const needsRefuel: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return false;
  }

  const fuel = vehicle.fuel ?? 0;
  const REFUEL_THRESHOLD = 30;
  
  return fuel < REFUEL_THRESHOLD;
};

/**
 * Pure guard: Check if vehicle needs repairs (damage > 50%)
 * 
 * @param context FSMContext containing vehicle state
 * @returns true if vehicle damage exceeds 50 percent threshold
 * 
 * @example
 * // In Node.js test:
 * const context = { vehicle: { damage: 75 } };
 * const result = needsRepair({ context, event: {} });
 * console.log(result); // true
 */
export const needsRepair: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return false;
  }

  const damage = vehicle.damage ?? 0;
  const REPAIR_THRESHOLD = 50;
  
  return damage > REPAIR_THRESHOLD;
};

/**
 * Pure guard: Check if vehicle has resources to deposit
 * 
 * @param context FSMContext containing vehicle resources
 * @returns true if total resources (food + debris + special) > 0
 * 
 * @example
 * // In Node.js test:
 * const context = { vehicle: { resources: { food: 100, debris: 50, special: 0 } } };
 * const result = needsDeposit({ context, event: {} });
 * console.log(result); // true
 */
export const needsDeposit: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle || !vehicle.resources) {
    return false;
  }

  const resources = vehicle.resources;
  const totalResources = (resources.food ?? 0) + (resources.debris ?? 0) + (resources.special ?? 0);
  
  return totalResources > 0;
};

/**
 * Pure guard: Check if ship is at base (distance to basePosition <= 1.0 unit)
 * 
 * @param context FSMContext containing vehicle position and basePosition
 * @returns true if ship is within 1.0 unit distance from base
 * 
 * @example
 * // In Node.js test:
 * const context = {
 *   vehicle: {
 *     position: { x: 0, z: 0 },
 *     basePosition: { x: 0.5, z: 0.5 }
 *   }
 * };
 * const result = isShipOnBase({ context, event: {} });
 * console.log(result); // true (distance ~0.707 < 1.0)
 */
export const isShipOnBase: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle || !vehicle.position || !vehicle.basePosition) {
    return false;
  }

  const shipPos = vehicle.position;
  const basePos = vehicle.basePosition;
  
  const distance = Math.sqrt(
    Math.pow(shipPos.x - basePos.x, 2) + 
    Math.pow(shipPos.z - basePos.z, 2)
  );
  
  const BASE_PROXIMITY_THRESHOLD = 1.0;
  
  return distance <= BASE_PROXIMITY_THRESHOLD;
};

/**
 * Pure guard: Check if all maintenance tasks are complete
 * 
 * Returns true when:
 * - Vehicle has NO resources to deposit (hasResources = false)
 * - Vehicle damage <= 50% (needsRepairs = false)
 * - Vehicle fuel >= 30% (needsFuel = false)
 * 
 * @param context FSMContext containing vehicle state
 * @returns true if all maintenance conditions are satisfied
 * 
 * @example
 * // In Node.js test:
 * const context = {
 *   vehicle: {
 *     fuel: 50,
 *     damage: 0,
 *     resources: { food: 0, debris: 0, special: 0 }
 *   }
 * };
 * const result = maintenanceComplete({ context, event: {} });
 * console.log(result); // true
 */
export const maintenanceComplete: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    // No vehicle = maintenance already complete (edge case)
    return true;
  }

  // Check each condition independently
  const resources = vehicle.resources ?? { food: 0, debris: 0, special: 0 };
  const totalResources = (resources.food ?? 0) + (resources.debris ?? 0) + (resources.special ?? 0);
  const hasResources = totalResources > 0;
  
  const damage = vehicle.damage ?? 0;
  const REPAIR_THRESHOLD = 50;
  const needsRepairs = damage > REPAIR_THRESHOLD;
  
  const fuel = vehicle.fuel ?? 0;
  const REFUEL_THRESHOLD = 30;
  const needsFuel = fuel < REFUEL_THRESHOLD;
  
  // Maintenance is complete when none of these conditions are true
  return !hasResources && !needsRepairs && !needsFuel;
};
