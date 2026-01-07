/**
 * ==========================================================================
 * MAINTENANCE DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * TODO: Migrer les actions assign liées à la maintenance depuis actions.pure.v5.ts
 * - assignMaintenanceTaskContext
 * - depositResources (si c'est une action assign)
 * - repairVehicle (si c'est une action assign)
 * - refuelVehicle (si c'est une action assign)
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import useGameStore from '../../../../../stores/useGameStore/index.ts';
import { MAX_EXPLORATION_RADIUS } from '../../../../../stores/useGameStore/slices/radiusSlice.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { VehicleVisualState } from '../../../../../types/vehicle.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour le dépôt de ressources à la base
 * Transfert des ressources du véhicule vers le score du joueur
 */
export const assignShipDepositResourcesContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipDepositResourcesContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type
  });
  
  if (!context.vehicle) {
    return {};
  }
  
  // Transférer les ressources du véhicule vers le score
  const vehicleResources = context.vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const currentScore = context.score?.resources || { food: 0, debris: 0, special: 0, total: 0 };
  
  const newScore = {
    food: (currentScore.food || 0) + (vehicleResources.food || 0),
    debris: (currentScore.debris || 0) + (vehicleResources.debris || 0), 
    special: (currentScore.special || 0) + (vehicleResources.special || 0),
    total: 0 // Sera calculé ci-dessous
  };
  newScore.total = newScore.food + newScore.debris + newScore.special;

  fsmLogger.action(`💰 [${context.entityId}] Depositing resources at base:`, {
    resourcesDeposited: vehicleResources,
    scoreBefore: currentScore,
    scoreAfter: newScore,
    totalGained: vehicleResources.total || 0
  });
  
  // ✅ FIX: Réinitialiser le compteur d'exploration par cycle après le dépôt
  // Cela permet de recommencer un nouveau cycle exploration → collection → maintenance
  const resetStats = {
    ...context.memory?.stats,
    tilesExploredInCycle: 0
  };
  
  fsmLogger.info(`🔄 [${context.entityId}] Resetting exploration cycle counter after deposit`, {
    previousCount: context.memory?.stats?.tilesExploredInCycle ?? 0,
    newCount: 0
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      resources: { food: 0, debris: 0, special: 0, total: 0 }, // Ressources déposées
      visualState: 'maintaining' as VehicleVisualState
    },
    score: {
      ...context.score,
      resources: newScore
    },
    memory: {
      ...context.memory,
      stats: resetStats
    },
    lastAction: 'resourcesDeposited_success',
    fsmState: 'maintaining_depositing',
  };
});

/**
 * Action assign pour la réparation du véhicule
 */
export const assignShipRepairContext = createAssignAction(({ context }) => {
  
  if (!context.vehicle) {
    return {};
  }
  
  return {
    vehicle: {
      ...context.vehicle,
      damage: 0, // Réparation complète
      visualState: 'repairing' as VehicleVisualState
    },
    lastAction: 'vehicleRepaired_success',
    fsmState: 'maintaining_repairing',
  };
});

/**
 * Action assign pour le ravitaillement du véhicule
 */
export const assignShipRefuelContext = createAssignAction(({ context }) => {
  
  if (!context.vehicle) {
    return {};
  }
  
  return {
    vehicle: {
      ...context.vehicle,
      fuel: 100, // Plein de carburant
      visualState: 'refueling' as VehicleVisualState
    },
    lastAction: 'vehicleRefueled_success',
    fsmState: 'maintaining_refueling',
  };
});

/**
 * 🆕 PHASE 2: Action assign pour l'état relocating avec pénalités
 * 
 * Gameplay:
 * - Si radius < 3: Incrémente le radius, applique les pénalités, renvoie RADIUS_INCREASED
 * - Si radius >= 3: Renvoie GAME_OVER
 * 
 * Pénalités:
 * - Score resources: divisé par 2
 * - Vehicle damage: +30%
 */
export const assignShipRelocatingContext = createAssignAction(({ context }) => {
  const gameStore = useGameStore.getState();
  const currentRadius = gameStore.getExplorationRadius();
  
  fsmLogger.action(`🔄 [${context.entityId}] ========================================`);
  fsmLogger.action(`🔄 [${context.entityId}] RELOCATING - Checking radius expansion`);
  fsmLogger.action(`🔄 [${context.entityId}] Current radius: ${currentRadius}, Max: ${MAX_EXPLORATION_RADIUS}`);
  
  // Check if we're at max radius → GAME OVER
  if (currentRadius >= MAX_EXPLORATION_RADIUS) {
    fsmLogger.action(`🏁 [${context.entityId}] MAX RADIUS REACHED - GAME OVER incoming`);
    fsmLogger.action(`🏁 [${context.entityId}] Final Score: ${context.score?.resources?.total || 0}`);
    fsmLogger.action(`🏁 [${context.entityId}] ========================================`);
    
    // Mark for GAME_OVER event (will be raised by separate action)
    return {
      lastAction: 'game_over_pending',
      fsmState: 'maintaining_relocating'
    };
  }
  
  // Increment radius via GameStore
  const newRadius = gameStore.incrementRadius(context.entityId);
  
  // Apply penalties: score / 2
  const currentScore = context.score?.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const penalizedScore = {
    food: Math.floor((currentScore.food || 0) / 2),
    debris: Math.floor((currentScore.debris || 0) / 2),
    special: Math.floor((currentScore.special || 0) / 2),
    total: 0
  };
  penalizedScore.total = penalizedScore.food + penalizedScore.debris + penalizedScore.special;
  
  // Apply penalties: damage + 30%
  const currentDamage = context.vehicle?.damage || 0;
  const newDamage = Math.min(100, currentDamage + 30);
  
  fsmLogger.action(`💥 [${context.entityId}] PENALTIES APPLIED:`);
  fsmLogger.action(`   - Score: ${currentScore.total} → ${penalizedScore.total} (÷2)`);
  fsmLogger.action(`   - Damage: ${currentDamage}% → ${newDamage}% (+30%)`);
  fsmLogger.action(`   - Radius: ${currentRadius} → ${newRadius}`);
  fsmLogger.action(`🔄 [${context.entityId}] ========================================`);
  
  return {
    vehicle: {
      ...context.vehicle,
      damage: newDamage,
      visualState: 'relocating' as VehicleVisualState
    },
    score: {
      ...context.score,
      resources: penalizedScore
    },
    // Update config with new radius (sync with GameStore)
    config: {
      ...context.config,
      exploringRadius: newRadius
    },
    lastAction: 'radius_increased_pending',
    fsmState: 'maintaining_relocating'
  };
});

// Placeholder pour éviter les erreurs d'import
export const __maintenanceAssignPlaceholder = createAssignAction(({ context: _context }) => {
  return {};
});

// ============================================================================
// 🆕 DRONE DESTRUCTION - Actions for drone purchase
// ============================================================================

const DRONE_COST = 50;
const DRONE_DAMAGE_PENALTY = 20;

/**
 * 🆕 Action assign pour l'achat d'un drone avec ressources
 * 
 * Coût: 50 ressources du score
 * Réactive le drone explorer avec toutes ses propriétés
 */
export const assignPurchaseDroneContext = createAssignAction(({ context }) => {
  const currentScore = context.score?.resources || { food: 0, debris: 0, special: 0, total: 0 };
  
  // Déduire le coût proportionnellement aux types de ressources
  const totalResources = currentScore.total || 0;
  const ratio = totalResources > 0 ? DRONE_COST / totalResources : 0;
  
  const newScore = {
    food: Math.floor((currentScore.food || 0) * (1 - ratio)),
    debris: Math.floor((currentScore.debris || 0) * (1 - ratio)),
    special: Math.floor((currentScore.special || 0) * (1 - ratio)),
    total: 0
  };
  newScore.total = newScore.food + newScore.debris + newScore.special;

  const currentDrone = context.droneFleet?.drones?.explorer;
  
  // Réactiver le drone
  const updatedDrone = {
    ...currentDrone,
    isActive: true,
    isDestroyed: false,
    visualState: 'docked' as const,
    health: 100,
    isMoving: false,
    targetDroneTile: null,
    coord: undefined // Drone retourne à la position du ship
  };

  fsmLogger.action(`🛒 [${context.entityId}] Drone PURCHASED with resources`, {
    cost: DRONE_COST,
    scoreBefore: currentScore.total,
    scoreAfter: newScore.total,
    droneStatus: 'active'
  });

  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: updatedDrone
      }
    },
    score: {
      ...context.score,
      resources: newScore
    },
    lastAction: 'drone_purchased_success',
    fsmState: 'maintaining_purchasing_drone'
  };
});

/**
 * 🆕 Action assign pour l'achat d'un drone SANS ressources (pénalité de dégâts)
 * 
 * Pénalité: +20% dégâts au vaisseau
 * Réactive le drone explorer gratuitement
 */
export const assignDroneDamagePenaltyContext = createAssignAction(({ context }) => {
  const currentDamage = context.vehicle?.damage || 0;
  const newDamage = Math.min(100, currentDamage + DRONE_DAMAGE_PENALTY);
  
  const currentDrone = context.droneFleet?.drones?.explorer;
  
  // Réactiver le drone gratuitement
  const updatedDrone = {
    ...currentDrone,
    isActive: true,
    isDestroyed: false,
    visualState: 'docked' as const,
    health: 100,
    isMoving: false,
    targetDroneTile: null,
    coord: undefined
  };

  fsmLogger.action(`💥 [${context.entityId}] Drone PURCHASED with DAMAGE PENALTY`, {
    penalty: DRONE_DAMAGE_PENALTY,
    damageBefore: currentDamage,
    damageAfter: newDamage,
    droneStatus: 'active (free but ship damaged)'
  });

  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet.drones,
        explorer: updatedDrone
      }
    },
    vehicle: {
      ...context.vehicle,
      damage: newDamage
    },
    lastAction: 'drone_purchased_with_penalty',
    fsmState: 'maintaining_purchasing_drone'
  };
});

// ============================================================================
// 🆕 STATION SUPPORT - Actions for maintenance stations
// ============================================================================

/**
 * Helper function to find nearest station of given type
 */
function findNearestStationOfType(
  context: FSMContext, 
  stationType: 'fuel' | 'repair'
): import('../../../../../types/tile.d.ts').Tile | null {
  const tiles = context.gridInfo?.tiles || {};
  const shipCoord = context.vehicle?.coord;
  
  if (!shipCoord) return null;
  
  const stations = Object.values(tiles).filter(
    (tile): tile is import('../../../../../types/tile.d.ts').Tile => 
      tile !== null && 
      typeof tile === 'object' && 
      'type' in tile && 
      tile.type === stationType
  );
  
  if (stations.length === 0) return null;
  
  // Find closest station using calculateDistanceGrid
  const { calculateDistanceGrid } = require('../../../../../core/spatial/index.ts');
  let nearestStation: import('../../../../../types/tile.d.ts').Tile | null = null;
  let minDistance = Infinity;
  
  for (const station of stations) {
    const distance = calculateDistanceGrid(shipCoord, station.position.coord);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }
  
  return nearestStation;
}

/**
 * Action assign pour naviguer vers une station fuel
 * Similaire à assignShipMovingToTileContext, mais cible une station fuel
 */
export const assignShipMovingToFuelStationContext = createAssignAction(({ context }) => {
  const nearestStation = findNearestStationOfType(context, 'fuel');
  
  if (!nearestStation) {
    fsmLogger.warn(`⚠️ [${context.entityId}] No fuel station found!`);
    return {};
  }
  
  const shipCoord = context.vehicle?.coord;
  const targetCoord = nearestStation.position.coord;
  const tiles = context.gridInfo?.tiles || {};
  
  // Calculate path to station
  const { findPath } = require('../../../../../core/spatial/index.ts');
  const path = shipCoord ? findPath(shipCoord, targetCoord, tiles) : [];
  
  if (path.length === 0) {
    fsmLogger.warn(`⚠️ [${context.entityId}] No path to fuel station at ${targetCoord}!`);
    return {};
  }
  
  // Calculate fuel consumption for pathfinding
  const pathSteps = Math.max(0, path.length - 1);
  const FUEL_PER_TILE = 8; // 🆕 INCREASED: 8 fuel per tile to test station decisions
  const fuelConsumption = Math.max(1, pathSteps * FUEL_PER_TILE);
  const currentFuel = context.vehicle?.fuel || 100;
  const newFuel = Math.max(0, currentFuel - fuelConsumption);
  
  fsmLogger.info(`⛽ [${context.entityId}] Moving to FUEL STATION:`, {
    stationCoord: targetCoord,
    pathLength: path.length,
    fuelConsumption,
    fuelRemaining: newFuel
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      coord: shipCoord || '0,0',
      targetVehicleTile: nearestStation,
      isMoving: true,
      progress: 0,
      visualState: 'moving_to_tile' as VehicleVisualState,
      fuel: newFuel,
      currentPath: path,
      pathIndex: 0,
      isMovingToStation: true,
      stationType: 'fuel' as const
    },
    lastAction: 'ship_moving_to_fuel_station',
    fsmState: 'collecting_ship_moving_to_tile'
  };
});

/**
 * Action assign pour naviguer vers une station repair
 * Similaire à assignShipMovingToTileContext, mais cible une station repair
 */
export const assignShipMovingToRepairStationContext = createAssignAction(({ context }) => {
  const nearestStation = findNearestStationOfType(context, 'repair');
  
  if (!nearestStation) {
    fsmLogger.warn(`⚠️ [${context.entityId}] No repair station found!`);
    return {};
  }
  
  const shipCoord = context.vehicle?.coord;
  const targetCoord = nearestStation.position.coord;
  const tiles = context.gridInfo?.tiles || {};
  
  // Calculate path to station
  const { findPath } = require('../../../../../core/spatial/index.ts');
  const path = shipCoord ? findPath(shipCoord, targetCoord, tiles) : [];
  
  if (path.length === 0) {
    fsmLogger.warn(`⚠️ [${context.entityId}] No path to repair station at ${targetCoord}!`);
    return {};
  }
  
  // Calculate fuel consumption for pathfinding
  const pathSteps = Math.max(0, path.length - 1);
  const FUEL_PER_TILE = 8; // 🆕 INCREASED: 8 fuel per tile to test station decisions
  const fuelConsumption = Math.max(1, pathSteps * FUEL_PER_TILE);
  const currentFuel = context.vehicle?.fuel || 100;
  const newFuel = Math.max(0, currentFuel - fuelConsumption);
  
  fsmLogger.info(`🔧 [${context.entityId}] Moving to REPAIR STATION:`, {
    stationCoord: targetCoord,
    pathLength: path.length,
    fuelConsumption,
    fuelRemaining: newFuel
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      coord: shipCoord || '0,0',
      targetVehicleTile: nearestStation,
      isMoving: true,
      progress: 0,
      visualState: 'moving_to_tile' as VehicleVisualState,
      fuel: newFuel,
      currentPath: path,
      pathIndex: 0,
      isMovingToStation: true,
      stationType: 'repair' as const
    },
    lastAction: 'ship_moving_to_repair_station',
    fsmState: 'collecting_ship_moving_to_tile'
  };
});

/**
 * Action assign quand le vaisseau arrive à une station fuel
 * Clear les flags isMovingToStation et passe en mode refueling
 */
export const assignShipAtFuelStationContext = createAssignAction(({ context }) => {
  fsmLogger.info(`⛽ [${context.entityId}] Ship ARRIVED at FUEL STATION`);
  
  return {
    vehicle: {
      ...context.vehicle,
      isMovingToStation: false,
      stationType: undefined,
      isMoving: false,
      visualState: 'maintaining' as VehicleVisualState
    },
    lastAction: 'ship_at_fuel_station',
    fsmState: 'maintaining_refueling'
  };
});

/**
 * Action assign quand le vaisseau arrive à une station repair
 * Clear les flags isMovingToStation et passe en mode repairing
 */
export const assignShipAtRepairStationContext = createAssignAction(({ context }) => {
  fsmLogger.info(`🔧 [${context.entityId}] Ship ARRIVED at REPAIR STATION`);
  
  return {
    vehicle: {
      ...context.vehicle,
      isMovingToStation: false,
      stationType: undefined,
      isMoving: false,
      visualState: 'maintaining' as VehicleVisualState
    },
    lastAction: 'ship_at_repair_station',
    fsmState: 'maintaining_repairing'
  };
});
