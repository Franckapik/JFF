/**
 * ============================================================================
 * XSTATE EFFICIENCY GUARDS - Guards d'efficacité pour XState
 * ============================================================================
 * 
 * Guards d'efficacité migrés depuis Robot3 vers syntaxe XState.
 * Incluent uniquement les guards utilisés dans l'état evaluating.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 * @migration FROM: src/ai/fsm/machine/guards/efficiencyGuard.js
 * @usage Used in evaluating state for efficiency-based return decisions
 */

import { FUEL_THRESHOLDS, RESOURCE_CONSTANTS, DEFAULT_CAPACITIES, VEHICLE_TYPES } from '../config/constants.js';

/**
 * ============================================================================
 * RESOURCE MANAGEMENT UTILITIES
 * ============================================================================
 */

/**
 * Gets the maximum capacity of the vehicle
 * @param {Object} vehicle - Vehicle object
 * @returns {number} Total maximum capacity
 */
const getMaxCapacity = (vehicle) => {
  const maxCapacity = vehicle?.maxCapacity;
  
  if (maxCapacity && typeof maxCapacity === 'object') {
    return Object.values(maxCapacity).reduce((total, cap) => total + (cap || 0), 0);
  }
  
  // Fallback to default capacities
  const defaultCapacities = DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP] || { food: 200, debris: 1800, special: 3 };
  return Object.values(defaultCapacities).reduce((total, cap) => total + cap, 0);
};

/**
 * Calculates total current resources
 * @param {Object} vehicle - Vehicle object
 * @returns {number} Total resources
 */
const getTotalResources = (vehicle) => {
  const resources = vehicle?.resources || {};
  return Object.values(resources).reduce((total, amount) => total + (amount || 0), 0);
};

/**
 * Calculates remaining capacity
 * @param {Object} vehicle - Vehicle object
 * @returns {number} Remaining capacity
 */
const getRemainingCapacity = (vehicle) => {
  const maxCapacity = getMaxCapacity(vehicle);
  const totalResources = getTotalResources(vehicle);
  return Math.max(0, maxCapacity - totalResources);
};

/**
 * ============================================================================
 * CORE EFFICIENCY GUARDS - Primitive efficiency logic
 * ============================================================================
 */

/**
 * Checks if vehicle has capacity for a specific amount
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @param {number} amount - Amount to check (default: 1)
 * @returns {boolean} True if has capacity
 */
export const hasCapacityFor = (context, event, amount = 1) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const remainingCapacity = getRemainingCapacity(vehicle);
  return remainingCapacity >= amount;
};

/**
 * Checks if vehicle is at maximum capacity
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if at max capacity
 */
export const isAtMaxCapacity = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const remainingCapacity = getRemainingCapacity(vehicle);
  return remainingCapacity <= 0;
};

/**
 * Checks if vehicle can collect resource
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @param {string} resourceType - Resource type (optional)
 * @returns {boolean} True if can collect
 */
export const canCollectResource = (context, event, resourceType = null) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  if (isAtMaxCapacity(context, event)) return false;
  
  // Check if vehicle is operational
  const damage = vehicle.damage || 0;
  if (damage >= 90) return false; // Using constant from MOVEMENT_CONSTANTS.MAX_DAMAGE
  
  return true;
};

/**
 * Checks if vehicle can deposit resources
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if can deposit
 */
export const canDepositResources = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const totalResources = getTotalResources(vehicle);
  return totalResources > 0;
};

/**
 * Checks if fuel tank is full
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if tank is full
 */
export const isFullTank = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel >= FUEL_THRESHOLDS.FULL;
};

/**
 * Checks if vehicle can refuel
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if can refuel
 */
export const canRefuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel < FUEL_THRESHOLDS.FULL;
};

/**
 * Checks if fuel level is low
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if fuel is low
 */
export const isLowFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel <= FUEL_THRESHOLDS.LOW;
};

/**
 * ============================================================================
 * COMPOSITE EFFICIENCY GUARDS - Used in evaluating state
 * ============================================================================
 */

/**
 * Determines if vehicle should return to base for efficiency reasons
 * USED IN: evaluatingState.js line 143
 * Checks both max capacity and low fuel conditions
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if should return for efficiency
 */
export const shouldReturnForEfficiency = (context, event) => {
  const atMaxCapacity = isAtMaxCapacity(context, event);
  const isLowFuel_ = isLowFuel(context, event);
  
  return atMaxCapacity || isLowFuel_;
};

/**
 * Checks if it's efficient to continue collecting
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if collection is efficient
 */
export const isCollectionEfficient = (context, event) => {
  return hasCapacityFor(context, event) && !isLowFuel(context, event);
};

/**
 * Checks if vehicle should collect more resources
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if should collect more
 */
export const shouldCollectMore = (context, event) => {
  return !isAtMaxCapacity(context, event) && !isLowFuel(context, event);
};

/**
 * Checks if refueling is needed for efficiency
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if needs refuel for efficiency
 */
export const needsRefuelForEfficiency = (context, event) => {
  return isLowFuel(context, event) && canRefuel(context, event);
};

/**
 * Checks if inventory management is needed
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if needs inventory management
 */
export const needsInventoryManagement = (context, event) => {
  return isAtMaxCapacity(context, event);
};

/**
 * ============================================================================
 * EXPORTS - XState format
 * ============================================================================
 */

// Individual exports for XState machine configuration
export const efficiencyGuards = {
  // Core guards
  hasCapacityFor,
  isAtMaxCapacity,
  canCollectResource,
  canDepositResources,
  isFullTank,
  canRefuel,
  isLowFuel,
  
  // Composite guards (used in evaluating)
  shouldReturnForEfficiency,
  isCollectionEfficient,
  shouldCollectMore,
  needsRefuelForEfficiency,
  needsInventoryManagement
};

// Default export for convenience
export default efficiencyGuards;
