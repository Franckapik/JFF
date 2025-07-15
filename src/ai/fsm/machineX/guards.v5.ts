import type { XStateGuardsRegistry } from '../../../types/xstate.types';

import type { FSMContext } from '../../../types/fsm.d.ts';

import { adaptLegacyGuard } from './adapters/guardAdapters';
import * as allGuards from './guards/guards.all';

const v5Guards: XStateGuardsRegistry = {
  shouldExplore: adaptLegacyGuard(allGuards.shouldExplore),
  shouldCollect: adaptLegacyGuard((context: FSMContext) => {
    return context.selectedTileForCollection !== null && 
           !context.vehicle.isAtCapacity &&
           context.vehicle.fuel > context.config.fuelThreshold;
  }),
  canCollectTile: adaptLegacyGuard((context: FSMContext) => {
    const tile = context.selectedTileForCollection;
    return tile !== null && tile.resources.total > 0 && !context.vehicle.isAtCapacity;
  }),
  isAtTargetTile: adaptLegacyGuard((context: FSMContext) => {
    const target = context.selectedTileForCollection;
    if (!target) return false;
    const currentPos = context.vehicle.position;
    const [targetX, targetZ] = target.coord.coord.split(',').map(Number);
    const distance = Math.sqrt(
      Math.pow(currentPos.x - targetX, 2) + 
      Math.pow(currentPos.z - targetZ, 2)
    );
    return distance < 1.5;
  }),
  shouldMaintain: adaptLegacyGuard((context: FSMContext) => {
    const needsRefuel = context.vehicle.fuel < context.config.fuelThreshold;
    const needsRepair = context.vehicle.damage > 50;
    const shouldDeposit = context.vehicle.isAtCapacity;
    return needsRefuel || needsRepair || shouldDeposit;
  }),
  needsDeposit: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.isAtCapacity;
  }),
  needsRefuel: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.fuel < context.config.fuelThreshold;
  }),
  needsRepair: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.damage > 50;
  }),
  isDroneAvailable: adaptLegacyGuard((context: FSMContext) => {
    return context.droneFleet?.drones?.explorer?.state === 'docked' || 
           context.droneFleet?.drones?.explorer?.state === 'returning';
  }),
  isDroneDeployed: adaptLegacyGuard((context: FSMContext) => {
    const droneState = context.droneFleet?.drones?.explorer?.state;
    return droneState === 'deploying' || droneState === 'scanning';
  }),
  isDroneScanComplete: adaptLegacyGuard((context: FSMContext) => {
    const drone = context.droneFleet?.drones?.explorer;
    return drone?.state === 'returning';
  }),
  hasValidTarget: adaptLegacyGuard((context: FSMContext) => {
    return context.currentTarget !== null;
  }),
  isAtBase: adaptLegacyGuard((context: FSMContext) => {
    const basePosition = context.vehicle.basePosition;
    const currentPosition = context.vehicle.position;
    const distance = Math.sqrt(
      Math.pow(currentPosition.x - basePosition.x, 2) + 
      Math.pow(currentPosition.z - basePosition.z, 2)
    );
    return distance < 2;
  }),
  isAtTarget: adaptLegacyGuard((context: FSMContext) => {
    const target = context.currentTarget;
    if (!target) return false;
    const currentPos = context.vehicle.position;
    const [targetX, targetZ] = target.coord.split(',').map(Number);
    const distance = Math.sqrt(
      Math.pow(currentPos.x - targetX, 2) + 
      Math.pow(currentPos.z - targetZ, 2)
    );
    return distance < 1.5;
  }),
  hasPendingTargets: adaptLegacyGuard((context: FSMContext) => {
    return context.explorationQueue && context.explorationQueue.length > 0;
  }),
  isExplorationComplete: adaptLegacyGuard((context: FSMContext) => {
    return context.explorationCycle.phase === 'evaluating' || 
           context.explorationCycle.phase === 'collecting';
  }),
  hasDiscoveredTiles: adaptLegacyGuard((context: FSMContext) => {
    return context.explorationCycle.exploredTiles && 
           context.explorationCycle.exploredTiles.length > 0;
  }),
  isVehicleOperational: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.fuel > 10 && context.vehicle.damage < 80;
  }),
  isVehicleOverloaded: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.isAtCapacity;
  }),
  hasResourcesToDeposit: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.isAtCapacity || 
           (context.vehicle.resources && context.vehicle.resources.total > 0);
  }),
  isMaintenanceTime: adaptLegacyGuard((context: FSMContext) => {
    const needsFuel = context.vehicle.fuel < context.config.fuelThreshold;
    const needsRepair = context.vehicle.damage > 50;
    const needsDeposit = context.vehicle.isAtCapacity;
    return needsFuel || needsRepair || needsDeposit;
  }),
};

export default v5Guards;
