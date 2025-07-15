import type { XStateActionsRegistry } from '../../../types/xstate.types';

import allActions from './actions/index';
import { adaptLegacyAction, createBusinessAction, createStateAction } from './adapters/actionAdapters';

const v5Actions: XStateActionsRegistry = {
  // ...actions comme dans le fichier original...
  updateShipPosition: adaptLegacyAction(allActions.updateShipPosition),
  updateDronePosition: adaptLegacyAction(allActions.updateDronePosition),
  processDroneInitRequest: adaptLegacyAction(allActions.processDroneInitRequest),
  collectResources: createBusinessAction('collectResources', (context) => ({
    vehicle: {
      ...context.vehicle,
      resources: {
        ...context.vehicle.resources,
        total: Math.min(context.vehicle.resources.total + 10, context.vehicle.maxCapacity.total)
      }
    }
  })),
  moveToTile: createBusinessAction('moveToTile', (context) => ({
    vehicle: {
      ...context.vehicle,
      isMoving: true
    }
  })),
  returnToBase: createBusinessAction('returnToBase', (context) => ({
    vehicle: {
      ...context.vehicle,
      isMoving: true
    }
  })),
  depositResources: createBusinessAction('depositResources', (context) => ({
    vehicle: {
      ...context.vehicle,
      resources: {
        food: 0,
        debris: 0,
        special: 0,
        total: 0
      },
      isAtCapacity: false
    }
  })),
  repairVehicle: createBusinessAction('repairVehicle', (context) => ({
    vehicle: {
      ...context.vehicle,
      damage: Math.max(context.vehicle.damage - 50, 0)
    }
  })),
  refuelVehicle: createBusinessAction('refuelVehicle', (context) => ({
    vehicle: {
      ...context.vehicle,
      fuel: Math.min(context.vehicle.fuel + 100, 1000)
    }
  })),
  action_exploring_entry: createStateAction('exploring', 'entry'),
  action_exploring_exit: createStateAction('exploring', 'exit'),
  action_evaluating_entry: createStateAction('evaluating', 'entry'),
  action_evaluating_exit: createStateAction('evaluating', 'exit'),
  action_collecting_entry: createStateAction('collecting', 'entry'),
  action_collecting_exit: createStateAction('collecting', 'exit'),
  action_maintaining_entry: createStateAction('maintaining', 'entry'),
  action_maintaining_exit: createStateAction('maintaining', 'exit'),
  action_drone_deploying_entry: createStateAction('drone_deploying', 'entry'),
  action_drone_deploying_exit: createStateAction('drone_deploying', 'exit'),
  action_drone_scanning_entry: createStateAction('drone_scanning', 'entry'),
  action_drone_scanning_exit: createStateAction('drone_scanning', 'exit'),
  action_drone_returning_entry: createStateAction('drone_returning', 'entry'),
  action_drone_returning_exit: createStateAction('drone_returning', 'exit'),
  action_ship_moving_to_tile_entry: createStateAction('ship_moving_to_tile', 'entry'),
  action_ship_moving_to_tile_exit: createStateAction('ship_moving_to_tile', 'exit'),
  action_ship_collecting_entry: createStateAction('ship_collecting', 'entry'),
  action_ship_collecting_exit: createStateAction('ship_collecting', 'exit'),
  action_ship_returning_entry: createStateAction('ship_returning', 'entry'),
  action_ship_returning_exit: createStateAction('ship_returning', 'exit'),
  action_ship_on_base_entry: createStateAction('ship_on_base', 'entry'),
  action_ship_on_base_exit: createStateAction('ship_on_base', 'exit'),
  action_ship_depositing_entry: createStateAction('ship_depositing', 'entry'),
  action_ship_depositing_exit: createStateAction('ship_depositing', 'exit'),
  action_ship_repairing_entry: createStateAction('ship_repairing', 'entry'),
  action_ship_repairing_exit: createStateAction('ship_repairing', 'exit'),
  action_ship_refueling_entry: createStateAction('ship_refueling', 'entry'),
  action_ship_refueling_exit: createStateAction('ship_refueling', 'exit'),
};

export default v5Actions;
