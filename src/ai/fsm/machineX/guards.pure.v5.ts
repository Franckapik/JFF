/**
 * ==========================================================================
 * GUARDS XState v5 - Guards purs avec types stricts
 * ==========================================================================
 */


import fsmLogger from '../../../logger/fsmLogger';
import type { XStateV5Guard } from '../../../types/xstate.v5.types';

/**
 * Générateur de guards typés avec log automatique
 */
function createGuard(
  name: string,
  fn: (args: Parameters<XStateV5Guard>[0]) => boolean
): XStateV5Guard {
  return (args) => {
    const result = fn(args);
    fsmLogger.condition(`[GUARD] ${name}: ${result}`, { context: args.context, event: args.event });
    return result;
  };
}

/**
 * Guard principal pour déterminer si l'exploration est nécessaire
 */

export const shouldExplore = createGuard('shouldExplore', ({ context }) => {
  if (context.vehicle.fuel < context.config.fuelThreshold) return false;
  if (context.vehicle.damage > 80) return false;
  if (context.vehicle.isAtCapacity) return false;
  const hasUnexploredTiles = context.explorationQueue && context.explorationQueue.length > 0;
  const isDroneAvailable = context.droneFleet?.drones?.explorer?.state === 'docked';
  return hasUnexploredTiles && isDroneAvailable;
});

export const shouldCollect = createGuard('shouldCollect', ({ context }) => {
  return context.selectedTileForCollection !== null && 
         !context.vehicle.isAtCapacity &&
         context.vehicle.fuel > context.config.fuelThreshold;
});

export const canCollectTile = createGuard('canCollectTile', ({ context }) => {
  const tile = context.selectedTileForCollection;
  return tile !== null && tile.resources.total > 0 && !context.vehicle.isAtCapacity;
});

export const isAtTargetTile = createGuard('isAtTargetTile', ({ context }) => {
  const target = context.selectedTileForCollection;
  if (!target) return false;
  const currentPos = context.vehicle.position;
  const [targetX, targetZ] = target.coord.coord.split(',').map(Number);
  const distance = Math.sqrt(
    Math.pow(currentPos.x - targetX, 2) + 
    Math.pow(currentPos.z - targetZ, 2)
  );
  return distance < 1.5;
});

export const shouldMaintain = createGuard('shouldMaintain', ({ context }) => {
  const needsRefuel = context.vehicle.fuel < context.config.fuelThreshold;
  const needsRepair = context.vehicle.damage > 50;
  const shouldDeposit = context.vehicle.isAtCapacity;
  return needsRefuel || needsRepair || shouldDeposit;
});

export const needsDeposit = createGuard('needsDeposit', ({ context }) => {
  return context.vehicle.isAtCapacity;
});

export const needsRefuel = createGuard('needsRefuel', ({ context }) => {
  return context.vehicle.fuel < context.config.fuelThreshold;
});

export const needsRepair = createGuard('needsRepair', ({ context }) => {
  return context.vehicle.damage > 50;
});

export const isDroneAvailable = createGuard('isDroneAvailable', ({ context }) => {
  return context.droneFleet?.drones?.explorer?.state === 'docked' || 
         context.droneFleet?.drones?.explorer?.state === 'returning';
});

export const isDroneDeployed = createGuard('isDroneDeployed', ({ context }) => {
  const droneState = context.droneFleet?.drones?.explorer?.state;
  return droneState === 'deploying' || droneState === 'scanning';
});

export const isDroneScanComplete = createGuard('isDroneScanComplete', ({ context }) => {
  const drone = context.droneFleet?.drones?.explorer;
  return drone?.state === 'returning';
});

export const hasValidTarget = createGuard('hasValidTarget', ({ context }) => {
  return context.currentTarget !== null;
});

export const isAtBase = createGuard('isAtBase', ({ context }) => {
  const basePosition = context.vehicle.basePosition;
  const currentPosition = context.vehicle.position;
  const distance = Math.sqrt(
    Math.pow(currentPosition.x - basePosition.x, 2) + 
    Math.pow(currentPosition.z - basePosition.z, 2)
  );
  return distance < 2;
});

export const isAtTarget = createGuard('isAtTarget', ({ context }) => {
  const target = context.currentTarget;
  if (!target) return false;
  const currentPos = context.vehicle.position;
  const [targetX, targetZ] = target.coord.split(',').map(Number);
  const distance = Math.sqrt(
    Math.pow(currentPos.x - targetX, 2) + 
    Math.pow(currentPos.z - targetZ, 2)
  );
  return distance < 1.5;
});

export const hasPendingTargets = createGuard('hasPendingTargets', ({ context }) => {
  return context.explorationQueue && context.explorationQueue.length > 0;
});

export const isExplorationComplete = createGuard('isExplorationComplete', ({ context }) => {
  return context.explorationCycle.phase === 'evaluating' || 
         context.explorationCycle.phase === 'collecting';
});

export const hasDiscoveredTiles = createGuard('hasDiscoveredTiles', ({ context }) => {
  return context.explorationCycle.exploredTiles && 
         context.explorationCycle.exploredTiles.length > 0;
});

export const isVehicleOperational = createGuard('isVehicleOperational', ({ context }) => {
  return context.vehicle.fuel > 10 && context.vehicle.damage < 80;
});

export const isVehicleOverloaded = createGuard('isVehicleOverloaded', ({ context }) => {
  return context.vehicle.isAtCapacity;
});

export const hasResourcesToDeposit = createGuard('hasResourcesToDeposit', ({ context }) => {
  return context.vehicle.isAtCapacity || 
         (context.vehicle.resources && context.vehicle.resources.total > 0);
});

export const isMaintenanceTime = createGuard('isMaintenanceTime', ({ context }) => {
  const needsFuel = context.vehicle.fuel < context.config.fuelThreshold;
  const needsRepair = context.vehicle.damage > 50;
  const needsDeposit = context.vehicle.isAtCapacity;
  return needsFuel || needsRepair || needsDeposit;
});

// Export des guards pour XState v5
export const guards = {
  shouldExplore,
  shouldCollect,
  canCollectTile,
  isAtTargetTile,
  shouldMaintain,
  needsDeposit,
  needsRefuel,
  needsRepair,
  isDroneAvailable,
  isDroneDeployed,
  isDroneScanComplete,
  hasValidTarget,
  isAtBase,
  isAtTarget,
  hasPendingTargets,
  isExplorationComplete,
  hasDiscoveredTiles,
  isVehicleOperational,
  isVehicleOverloaded,
  hasResourcesToDeposit,
  isMaintenanceTime,
};
