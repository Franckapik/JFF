// guards.all.js
// Centralise toutes les fonctions guards ET utilitaires utilisées dans les guards
// pour permettre un import unique et simplifier la maintenance.

// --- EFFICIENCY GUARDS & UTILS ---
import fsmLogger from '../../../../logger/fsmLogger.js';
import { FUEL_THRESHOLDS, RESOURCE_CONSTANTS, DEFAULT_CAPACITIES, VEHICLE_TYPES } from '../config/constants.js';

// Utils
export const getMaxCapacity = (vehicle) => {
  const maxCapacity = vehicle?.maxCapacity;
  if (maxCapacity && typeof maxCapacity === 'object') {
    return Object.values(maxCapacity).reduce((total, cap) => total + (cap || 0), 0);
  }
  const defaultCapacities = DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP] || { food: 200, debris: 1800, special: 3 };
  return Object.values(defaultCapacities).reduce((total, cap) => total + cap, 0);
};

export const getTotalResources = (vehicle) => {
  const resources = vehicle?.resources || {};
  return Object.values(resources).reduce((total, amount) => total + (amount || 0), 0);
};

export const getRemainingCapacity = (vehicle) => {
  const maxCapacity = getMaxCapacity(vehicle);
  const totalResources = getTotalResources(vehicle);
  return Math.max(0, maxCapacity - totalResources);
};

// Guards (copiés depuis efficiency.guards.js)
export const hasCapacityFor = (context, event, amount = 1) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  const remainingCapacity = getRemainingCapacity(vehicle);
  return remainingCapacity >= amount;
};
export const isAtMaxCapacity = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  const remainingCapacity = getRemainingCapacity(vehicle);
  return remainingCapacity <= 0;
};
export const canCollectResource = (context, event, resourceType = null) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  if (isAtMaxCapacity(context, event)) return false;
  const damage = vehicle.damage || 0;
  if (damage >= 90) return false;
  return true;
};
export const canDepositResources = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  const totalResources = getTotalResources(vehicle);
  return totalResources > 0;
};
export const isFullTank = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel >= FUEL_THRESHOLDS.FULL;
};
export const canRefuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel < FUEL_THRESHOLDS.FULL;
};
export const isLowFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel <= FUEL_THRESHOLDS.LOW;
};
export const shouldReturnForEfficiency = (context, event) => {
  const atMaxCapacity = isAtMaxCapacity(context, event);
  const isLowFuel_ = isLowFuel(context, event);
  return atMaxCapacity || isLowFuel_;
};
export const isCollectionEfficient = (context, event) => {
  return hasCapacityFor(context, event) && !isLowFuel(context, event);
};
export const shouldCollectMore = (context, event) => {
  return !isAtMaxCapacity(context, event) && !isLowFuel(context, event);
};
export const needsRefuelForEfficiency = (context, event) => {
  return isLowFuel(context, event) && canRefuel(context, event);
};
export const needsInventoryManagement = (context, event) => {
  return isAtMaxCapacity(context, event);
};

// --- DISCOVERY GUARDS ---
export const hasBestTileForCollection = (context, event) => {
  const knownTiles = context.memory?.knownTiles || new Map();
  const collectibleTiles = Array.from(knownTiles.values())
    .filter(tile => tile && tile.collectible);
  return collectibleTiles.length > 0;
};
export const hasExploredEnoughTiles = (context, event) => {
  const exploredCount = context.memory?.stats?.tilesExplored || 0;
  return exploredCount >= (window.EXPLORATION_CYCLE_CONFIG?.TILES_BEFORE_COLLECTION || 10);
};
export const shouldTransitionToCollection = (context, event) => {
  const exploredCount = context.memory?.stats?.tilesExplored || 0;
  const knownTiles = context.memory?.knownTiles || new Map();
  const collectibleTiles = Array.from(knownTiles.values())
    .filter(tile => tile && tile.collectible);
  const required = window.EXPLORATION_CYCLE_CONFIG?.TILES_BEFORE_COLLECTION || 10;
  return exploredCount >= required && collectibleTiles.length > 0;
};
export const hasUnexploredAreas = (context, event) => {
  return needsExploration(context, event);
};
export const needsExploration = (context, event) => {
  const exploredCount = context.memory?.stats?.tilesExplored || 0;
  if (exploredCount >= (window.EXPLORATION_CYCLE_CONFIG?.TILES_BEFORE_COLLECTION || 10)) {
    const collectibleTiles = Array.from(context.memory.knownTiles.values())
      .filter(tile => tile && tile.collectible);
    return collectibleTiles.length === 0;
  }
  return true;
};

// --- SAFETY GUARDS ---
export const isCriticalFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel <= FUEL_THRESHOLDS.CRITICAL;
};
export const isLowFuelSafety = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel <= FUEL_THRESHOLDS.LOW;
};
export const hasEnoughFuelForDistance = (context, event, distance = 10) => {
  const fuel = context?.vehicle?.fuel || 0;
  const fuelConsumptionRate = context?.vehicle?.fuelConsumptionRate || 1;
  const requiredFuel = distance * fuelConsumptionRate;
  return fuel >= requiredFuel;
};
export const canConsumeFuel = (context, event, amount = 1) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel >= amount;
};
export const isVehicleCritical = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return true;
  const damage = vehicle.damage || 0;
  const fuel = vehicle.fuel || 0;
  return damage >= (window.MOVEMENT_CONSTANTS?.CRITICAL_DAMAGE || 90) || fuel <= 5;
};
export const isVehicleOperational = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  const damage = vehicle.damage || 0;
  const speed = vehicle.speed || 0;
  return damage < (window.MOVEMENT_CONSTANTS?.MAX_DAMAGE || 100) && speed >= (window.MOVEMENT_CONSTANTS?.MIN_SPEED || 1);
};
export const hasEnoughFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel > 10;
};
export const needsEmergencyReturn = (context, event) => {
  const isCritical = isCriticalFuel(context, event);
  const isVehicleCritical_ = isVehicleCritical(context, event);
  return isCritical || isVehicleCritical_;
};
export const isSafeToOperate = (context, event) => {
  return isVehicleOperational(context, event) && !isCriticalFuel(context, event);
};
export const canContinueOperation = (context, event) => {
  return hasEnoughFuelForDistance(context, event) && isVehicleOperational(context, event);
};

// --- EXPLORING GUARD ---
export function shouldExplore(context, event) {
  fsmLogger.info('[shouldExplore]', { context, event });
  return true
}
