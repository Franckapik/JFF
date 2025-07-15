/**
 * ==========================================================================
 * GUARDS XState v5 - Guards purs avec types stricts
 * ==========================================================================
 */

import type { XStateV5Guard } from '../../../types/xstate.v5.types';

/**
 * Guard principal pour déterminer si l'exploration est nécessaire
 */
const shouldExplore: XStateV5Guard = ({ context }) => {
  // Vérifier si le véhicule est opérationnel
  if (context.vehicle.fuel < context.config.fuelThreshold) return false;
  if (context.vehicle.damage > 80) return false;
  if (context.vehicle.isAtCapacity) return false;

  // Vérifier s'il y a des tuiles à explorer
  const hasUnexploredTiles = context.explorationQueue && context.explorationQueue.length > 0;
  const isDroneAvailable = context.droneFleet?.drones?.explorer?.state === 'docked';

  return hasUnexploredTiles && isDroneAvailable;
};

const shouldCollect: XStateV5Guard = ({ context }) => {
  return context.selectedTileForCollection !== null && 
         !context.vehicle.isAtCapacity &&
         context.vehicle.fuel > context.config.fuelThreshold;
};

const canCollectTile: XStateV5Guard = ({ context }) => {
  const tile = context.selectedTileForCollection;
  return tile !== null && tile.resources.total > 0 && !context.vehicle.isAtCapacity;
};

const isAtTargetTile: XStateV5Guard = ({ context }) => {
  const target = context.selectedTileForCollection;
  if (!target) return false;
  const currentPos = context.vehicle.position;
  const [targetX, targetZ] = target.coord.coord.split(',').map(Number);
  const distance = Math.sqrt(
    Math.pow(currentPos.x - targetX, 2) + 
    Math.pow(currentPos.z - targetZ, 2)
  );
  return distance < 1.5;
};

const shouldMaintain: XStateV5Guard = ({ context }) => {
  const needsRefuel = context.vehicle.fuel < context.config.fuelThreshold;
  const needsRepair = context.vehicle.damage > 50;
  const shouldDeposit = context.vehicle.isAtCapacity;
  return needsRefuel || needsRepair || shouldDeposit;
};

const needsDeposit: XStateV5Guard = ({ context }) => {
  return context.vehicle.isAtCapacity;
};

const needsRefuel: XStateV5Guard = ({ context }) => {
  return context.vehicle.fuel < context.config.fuelThreshold;
};

const needsRepair: XStateV5Guard = ({ context }) => {
  return context.vehicle.damage > 50;
};

const isDroneAvailable: XStateV5Guard = ({ context }) => {
  return context.droneFleet?.drones?.explorer?.state === 'docked' || 
         context.droneFleet?.drones?.explorer?.state === 'returning';
};

const isDroneDeployed: XStateV5Guard = ({ context }) => {
  const droneState = context.droneFleet?.drones?.explorer?.state;
  return droneState === 'deploying' || droneState === 'scanning';
};

const isDroneScanComplete: XStateV5Guard = ({ context }) => {
  const drone = context.droneFleet?.drones?.explorer;
  return drone?.state === 'returning';
};

const hasValidTarget: XStateV5Guard = ({ context }) => {
  return context.currentTarget !== null;
};

const isAtBase: XStateV5Guard = ({ context }) => {
  const basePosition = context.vehicle.basePosition;
  const currentPosition = context.vehicle.position;
  const distance = Math.sqrt(
    Math.pow(currentPosition.x - basePosition.x, 2) + 
    Math.pow(currentPosition.z - basePosition.z, 2)
  );
  return distance < 2;
};

const isAtTarget: XStateV5Guard = ({ context }) => {
  const target = context.currentTarget;
  if (!target) return false;
  const currentPos = context.vehicle.position;
  const [targetX, targetZ] = target.coord.split(',').map(Number);
  const distance = Math.sqrt(
    Math.pow(currentPos.x - targetX, 2) + 
    Math.pow(currentPos.z - targetZ, 2)
  );
  return distance < 1.5;
};

const hasPendingTargets: XStateV5Guard = ({ context }) => {
  return context.explorationQueue && context.explorationQueue.length > 0;
};

const isExplorationComplete: XStateV5Guard = ({ context }) => {
  return context.explorationCycle.phase === 'evaluating' || 
         context.explorationCycle.phase === 'collecting';
};

const hasDiscoveredTiles: XStateV5Guard = ({ context }) => {
  return context.explorationCycle.exploredTiles && 
         context.explorationCycle.exploredTiles.length > 0;
};

const isVehicleOperational: XStateV5Guard = ({ context }) => {
  return context.vehicle.fuel > 10 && context.vehicle.damage < 80;
};

const isVehicleOverloaded: XStateV5Guard = ({ context }) => {
  return context.vehicle.isAtCapacity;
};

const hasResourcesToDeposit: XStateV5Guard = ({ context }) => {
  return context.vehicle.isAtCapacity || 
         (context.vehicle.resources && context.vehicle.resources.total > 0);
};

const isMaintenanceTime: XStateV5Guard = ({ context }) => {
  const needsFuel = context.vehicle.fuel < context.config.fuelThreshold;
  const needsRepair = context.vehicle.damage > 50;
  const needsDeposit = context.vehicle.isAtCapacity;
  return needsFuel || needsRepair || needsDeposit;
};

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
