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

import { calculateDistanceGrid } from '../../../../../core/spatial/index.ts';
import useGameStore from '../../../../../stores/useGameStore/index.ts';
import { MAX_EXPLORATION_RADIUS } from '../../../../../stores/useGameStore/slices/radiusSlice.ts';
import type { XStateV5Guard } from '../../../../../types/xstate.v5.types.ts';

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
 * @returns true if total resources (food + debris + special) > 100
 * 
 * @example
 * // In Node.js test:
 * const context = { vehicle: { resources: { food: 100, debris: 50, special: 0 } } };
 * const result = needsDeposit({ context, event: {} });
 * console.log(result); // true (150 > 100)
 */
export const needsDeposit: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle || !vehicle.resources) {
    return false;
  }

  const resources = vehicle.resources;
  const totalResources = (resources.food ?? 0) + (resources.debris ?? 0) + (resources.special ?? 0);
  
  return totalResources > 100;
};

/**
 * Pure guard: Check if ship is at base (distance to baseCoord <= 1 hex)
 * 
 * @param context FSMContext containing vehicle coord and baseCoord
 * @returns true if ship is within 1 hex distance from base
 * 
 * @example
 * // In Node.js test:
 * const context = {
 *   vehicle: {
 *     coord: { col: 0, row: 0 },
 *     baseCoord: { col: 1, row: 0 }
 *   }
 * };
 * const result = isShipOnBase({ context, event: {} });
 * console.log(result); // true (distance = 1)
 */
export const isShipOnBase: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle || !vehicle.coord || !vehicle.baseCoord) {
    return false;
  }

  const distance = calculateDistanceGrid(vehicle.coord, vehicle.baseCoord);
  
  const BASE_PROXIMITY_THRESHOLD = 1;
  
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

/**
 * 🆕 PHASE 2: Guard to check if exploration radius is at maximum
 * 
 * Uses GameStore to read the shared exploration radius.
 * Returns true when radius >= MAX_EXPLORATION_RADIUS (3)
 * 
 * @returns true if radius is at or above maximum (GAME_OVER condition)
 */
export const isAtMaxRadius: XStateV5Guard = ({ context }) => {
  const gameStore = useGameStore.getState();
  const currentRadius = gameStore.getExplorationRadius();
  const result = currentRadius >= MAX_EXPLORATION_RADIUS;
  
  console.log(`🔍 [isAtMaxRadius] ${context.entityId}: radius=${currentRadius}, max=${MAX_EXPLORATION_RADIUS}, result=${result}`);
  
  return result;
};

/**
 * 🆕 PHASE 2: Guard to check if exploration radius can still be increased
 * 
 * Inverse of isAtMaxRadius - returns true when radius < MAX_EXPLORATION_RADIUS
 * 
 * @returns true if radius can be increased
 */
export const canIncreaseRadius: XStateV5Guard = ({ context }) => {
  const gameStore = useGameStore.getState();
  const currentRadius = gameStore.getExplorationRadius();
  const result = currentRadius < MAX_EXPLORATION_RADIUS;
  
  console.log(`🔍 [canIncreaseRadius] ${context.entityId}: radius=${currentRadius}, max=${MAX_EXPLORATION_RADIUS}, result=${result}`);
  
  return result;
};

// ============================================================================
// 🆕 DRONE DESTRUCTION - Guards for drone purchase
// ============================================================================

/**
 * Guard: Vérifie si le drone explorer est détruit et nécessite un achat
 * 
 * @returns true si le drone explorer est détruit (isDestroyed === true || isActive === false)
 */
export const needsDronePurchase: XStateV5Guard = ({ context }) => {
  const drone = context.droneFleet?.drones?.explorer;
  if (!drone) return false;
  
  const result = drone.isDestroyed === true || drone.isActive === false;
  
  console.log(`🔍 [needsDronePurchase] ${context.entityId}: isDestroyed=${drone.isDestroyed}, isActive=${drone.isActive}, result=${result}`);
  
  return result;
};

/**
 * Guard: Vérifie si le bot a assez de ressources pour acheter un drone (>= 50)
 * 
 * @returns true si score.resources.total >= 50
 */
export const hasResourcesForDrone: XStateV5Guard = ({ context }) => {
  const DRONE_COST = 50;
  const totalResources = context.score?.resources?.total ?? 0;
  const result = totalResources >= DRONE_COST;
  
  console.log(`🔍 [hasResourcesForDrone] ${context.entityId}: resources=${totalResources}, cost=${DRONE_COST}, result=${result}`);
  
  return result;
};

// ============================================================================
// 🆕 STATION SUPPORT - Guards for maintenance stations
// ============================================================================

/**
 * Helper: Trouve la station la plus proche d'un type donné
 * 
 * @param context FSMContext contenant gridInfo et position du vaisseau
 * @param stationType Type de station recherché ('fuel' ou 'repair')
 * @returns La tuile station la plus proche ou null
 */
function findNearestStationOfType(context: import('../../../../../types/fsm.d.ts').FSMContext, stationType: 'fuel' | 'repair'): import('../../../../../types/tile.d.ts').Tile | null {
  if (!context.gridInfo?.tiles || !context.vehicle?.coord) {
    return null;
  }

  const stations = Object.values(context.gridInfo.tiles).filter(
    (tile): tile is import('../../../../../types/tile.d.ts').Tile => 
      tile !== null && 
      typeof tile === 'object' && 
      'type' in tile && 
      tile.type === stationType
  );

  if (stations.length === 0) {
    return null;
  }

  // Trouver la station la plus proche
  let nearestStation: import('../../../../../types/tile.d.ts').Tile | null = null;
  let minDistance = Infinity;

  for (const station of stations) {
    const distance = calculateDistanceGrid(context.vehicle.coord, station.position.coord);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }

  return nearestStation;
}

/**
 * Guard: Vérifie si une station fuel est plus proche que la base
 * 
 * Retourne true si:
 * - Le vaisseau a besoin de carburant (fuel < 30%)
 * - Une station fuel existe
 * - La station fuel est plus proche que la base
 * 
 * @returns true si la station fuel doit être utilisée
 */
export const shouldUseFuelStation: XStateV5Guard = ({ context }) => {
  // Vérifier si refuel nécessaire
  const fuel = context.vehicle?.fuel ?? 100;
  const REFUEL_THRESHOLD = 30;
  const needsRefuel = fuel < REFUEL_THRESHOLD;
  
  if (!needsRefuel) {
    return false;
  }

  // Chercher la station fuel la plus proche
  const nearestStation = findNearestStationOfType(context, 'fuel');
  if (!nearestStation) {
    return false;
  }

  // Comparer distances: station vs base
  if (!context.vehicle?.coord || !context.vehicle?.baseCoord) {
    return false;
  }

  const distToStation = calculateDistanceGrid(context.vehicle.coord, nearestStation.position.coord);
  const distToBase = calculateDistanceGrid(context.vehicle.coord, context.vehicle.baseCoord);

  const result = distToStation < distToBase;
  
  console.log(`🔍 [shouldUseFuelStation] ${context.entityId}: fuel=${fuel.toFixed(1)}%, distStation=${distToStation.toFixed(1)}, distBase=${distToBase.toFixed(1)}, result=${result}`);
  
  return result;
};

/**
 * Guard: Vérifie si une station repair est plus proche que la base
 * 
 * Retourne true si:
 * - Le vaisseau a besoin de réparations (damage > 50%)
 * - Une station repair existe
 * - La station repair est plus proche que la base
 * 
 * @returns true si la station repair doit être utilisée
 */
export const shouldUseRepairStation: XStateV5Guard = ({ context }) => {
  // Vérifier si repair nécessaire
  const damage = context.vehicle?.damage ?? 0;
  const REPAIR_THRESHOLD = 50;
  const needsRepair = damage > REPAIR_THRESHOLD;
  
  if (!needsRepair) {
    return false;
  }

  // Chercher la station repair la plus proche
  const nearestStation = findNearestStationOfType(context, 'repair');
  if (!nearestStation) {
    return false;
  }

  // Comparer distances: station vs base
  if (!context.vehicle?.coord || !context.vehicle?.baseCoord) {
    return false;
  }

  const distToStation = calculateDistanceGrid(context.vehicle.coord, nearestStation.position.coord);
  const distToBase = calculateDistanceGrid(context.vehicle.coord, context.vehicle.baseCoord);

  const result = distToStation < distToBase;
  
  console.log(`🔍 [shouldUseRepairStation] ${context.entityId}: damage=${damage.toFixed(1)}%, distStation=${distToStation.toFixed(1)}, distBase=${distToBase.toFixed(1)}, result=${result}`);
  
  return result;
};

/**
 * Guard: Vérifie si le vaisseau est en train de naviguer vers une station fuel
 * 
 * Utilise les flags context.vehicle.isMovingToStation et context.vehicle.stationType
 * 
 * @returns true si le vaisseau navigue vers une station fuel
 */
export const isMovingToFuelStation: XStateV5Guard = ({ context }) => {
  const result = context.vehicle?.isMovingToStation === true && 
                 context.vehicle?.stationType === 'fuel';
  
  console.log(`🔍 [isMovingToFuelStation] ${context.entityId}: isMovingToStation=${context.vehicle?.isMovingToStation}, stationType=${context.vehicle?.stationType}, result=${result}`);
  
  return result;
};

/**
 * Guard: Vérifie si le vaisseau est en train de naviguer vers une station repair
 * 
 * Utilise les flags context.vehicle.isMovingToStation et context.vehicle.stationType
 * 
 * @returns true si le vaisseau navigue vers une station repair
 */
export const isMovingToRepairStation: XStateV5Guard = ({ context }) => {
  const result = context.vehicle?.isMovingToStation === true && 
                 context.vehicle?.stationType === 'repair';
  
  console.log(`🔍 [isMovingToRepairStation] ${context.entityId}: isMovingToStation=${context.vehicle?.isMovingToStation}, stationType=${context.vehicle?.stationType}, result=${result}`);
  
  return result;
};
