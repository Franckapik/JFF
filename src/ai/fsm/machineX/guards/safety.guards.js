/**
 * ============================================================================
 * XSTATE SAFETY GUARDS - Guards de sécurité pour XState
 * ============================================================================
 * 
 * Guards de sécurité migrés depuis Robot3 vers syntaxe XState.
 * Incluent uniquement les guards utilisés dans l'état evaluating.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 * @migration FROM: src/ai/fsm/machine/guards/safetyGuard.js
 * @usage Used in evaluating state for emergency return and critical fuel checks
 */

import { FUEL_THRESHOLDS, MOVEMENT_CONSTANTS } from '../config/constants.js';

/**
 * ============================================================================
 * CORE SAFETY GUARDS - Primitive safety logic
 * ============================================================================
 */

/**
 * Checks if fuel level is critically low
 * USED IN: evaluatingState.js line 148
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if fuel is critical
 */
export const isCriticalFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel <= FUEL_THRESHOLDS.CRITICAL;
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
 * Checks if vehicle has enough fuel for a specific distance
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @param {number} distance - Distance to travel (default: 10)
 * @returns {boolean} True if enough fuel for distance
 */
export const hasEnoughFuelForDistance = (context, event, distance = 10) => {
  const fuel = context?.vehicle?.fuel || 0;
  const fuelConsumptionRate = context?.vehicle?.fuelConsumptionRate || 1;
  const requiredFuel = distance * fuelConsumptionRate;
  
  return fuel >= requiredFuel;
};

/**
 * Checks if vehicle can consume fuel
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @param {number} amount - Amount to consume (default: 1)
 * @returns {boolean} True if can consume fuel
 */
export const canConsumeFuel = (context, event, amount = 1) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel >= amount;
};

/**
 * Checks if vehicle is in critical condition
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if vehicle is critical
 */
export const isVehicleCritical = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return true;
  
  const damage = vehicle.damage || 0;
  const fuel = vehicle.fuel || 0;
  
  return damage >= MOVEMENT_CONSTANTS.CRITICAL_DAMAGE || fuel <= 5;
};

/**
 * Checks if vehicle is operational
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if vehicle is operational
 */
export const isVehicleOperational = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const damage = vehicle.damage || 0;
  const speed = vehicle.speed || 0;
  
  return damage < MOVEMENT_CONSTANTS.MAX_DAMAGE && 
         speed >= MOVEMENT_CONSTANTS.MIN_SPEED;
};

/**
 * Checks if vehicle has enough fuel for basic operations
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if enough fuel
 */
export const hasEnoughFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel > 10; // Minimum threshold for operations
};

/**
 * ============================================================================
 * COMPOSITE SAFETY GUARDS - Used in evaluating state
 * ============================================================================
 */

/**
 * Determines if emergency return is needed
 * USED IN: evaluatingState.js line 142
 * Checks both critical fuel and vehicle critical conditions
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if emergency return needed
 */
export const needsEmergencyReturn = (context, event) => {
  const isCritical = isCriticalFuel(context, event);
  const isVehicleCritical_ = isVehicleCritical(context, event);

  return isCritical || isVehicleCritical_;
};

/**
 * Checks if it's safe to operate the vehicle
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if safe to operate
 */
export const isSafeToOperate = (context, event) => {
  return isVehicleOperational(context, event) &&
         !isCriticalFuel(context, event);
};

/**
 * Checks if vehicle can safely continue current operation
 * @param {Object} context - XState context
 * @param {Object} event - XState event
 * @returns {boolean} True if can continue operation
 */
export const canContinueOperation = (context, event) => {
  return hasEnoughFuelForDistance(context, event) &&
         isVehicleOperational(context, event);
};

/**
 * ============================================================================
 * EXPORTS - XState format
 * ============================================================================
 */

// Individual exports for XState machine configuration
export const safetyGuards = {
  // Core guards
  isCriticalFuel,
  isLowFuel,
  hasEnoughFuelForDistance,
  canConsumeFuel,
  isVehicleCritical,
  isVehicleOperational,
  hasEnoughFuel,
  
  // Composite guards (used in evaluating)
  needsEmergencyReturn,
  isSafeToOperate,
  canContinueOperation
};

// Default export for convenience
export default safetyGuards;
