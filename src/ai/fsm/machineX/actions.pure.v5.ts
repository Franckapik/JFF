/**
 * ==========================================================================
 * ACTIONS XState v5 - Actions pures avec types stricts
 * ==========================================================================
 */

import fsmLogger from '../../../logger/fsmLogger';

import type { XStateV5Action } from '../../../types/xstate.v5.types';

/**
 * Action pour mettre à jour la position du vaisseau
 */
const updateShipPosition: XStateV5Action = ({ context, event }) => {
  if (event.type !== 'SHIP_POSITION_UPDATE') return {};
  
  fsmLogger.context(`🚢 [${context.entityId}] Setting ship position`, { 
    position: event.position, 
    shipType: event.shipType 
  });

  return {
    vehicle: {
      ...context.vehicle,
      position: event.position,
    },
  };
};

/**
 * Action pour mettre à jour la position du drone
 */
const updateDronePosition: XStateV5Action = ({ context, event }) => {
  if (event.type !== 'DRONE_POSITION_UPDATE') return {};
  
  fsmLogger.context(`🛸 [${context.entityId}] Updating drone position`, { 
    position: event.position, 
    droneType: event.droneType 
  });

  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet?.drones,
        [event.droneType]: {
          ...context.droneFleet?.drones?.[event.droneType],
          position: event.position,
        },
      },
    },
  };
};

/**
 * Action pour traiter une demande d'initialisation de drone
 */
const processDroneInitRequest: XStateV5Action = ({ context, event }) => {
  if (event.type !== 'DRONE_INITIALIZE_REQUEST') return {};
  
  fsmLogger.context(`🛸 [${context.entityId}] Processing ${event.droneType} drone init request`, {
    shipPosition: context.vehicle.position,
    initialPosition: event.initialPosition,
    droneType: event.droneType,
  });

  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet?.drones,
        [event.droneType]: {
          ...context.droneFleet?.drones?.[event.droneType],
          position: event.initialPosition,
          isActive: true,
          state: 'docked',
        },
      },
    },
  };
};

/**
 * Action pour collecter des ressources
 */
const collectResources: XStateV5Action = ({ context }) => {
  const currentResources = context.vehicle.resources.total;
  const maxCapacity = context.vehicle.maxCapacity.total;
  const newTotal = Math.min(currentResources + 10, maxCapacity);
  
  fsmLogger.context(`⛏️ [${context.entityId}] Collecting resources`, {
    before: currentResources,
    after: newTotal,
    capacity: maxCapacity,
  });

  return {
    vehicle: {
      ...context.vehicle,
      resources: {
        ...context.vehicle.resources,
        total: newTotal,
      },
      isAtCapacity: newTotal >= maxCapacity,
    },
  };
};

/**
 * Action pour se déplacer vers une tuile
 */
const moveToTile: XStateV5Action = ({ context }) => {
  fsmLogger.context(`🚀 [${context.entityId}] Moving to tile`, {
    target: context.selectedTileForCollection,
  });

  return {
    vehicle: {
      ...context.vehicle,
      isMoving: true,
    },
  };
};

/**
 * Action pour retourner à la base
 */
const returnToBase: XStateV5Action = ({ context }) => {
  fsmLogger.context(`🏠 [${context.entityId}] Returning to base`, {
    currentPosition: context.vehicle.position,
    basePosition: context.vehicle.basePosition,
  });

  return {
    vehicle: {
      ...context.vehicle,
      isMoving: true,
    },
  };
};

/**
 * Action pour déposer des ressources
 */
const depositResources: XStateV5Action = ({ context }) => {
  const resourcesDeposited = context.vehicle.resources.total;
  
  fsmLogger.context(`📦 [${context.entityId}] Depositing resources`, {
    amount: resourcesDeposited,
  });

  return {
    vehicle: {
      ...context.vehicle,
      resources: {
        food: 0,
        debris: 0,
        special: 0,
        total: 0,
      },
      isAtCapacity: false,
    },
  };
};

/**
 * Action pour réparer le véhicule
 */
const repairVehicle: XStateV5Action = ({ context }) => {
  const currentDamage = context.vehicle.damage;
  const newDamage = Math.max(currentDamage - 50, 0);
  
  fsmLogger.context(`🔧 [${context.entityId}] Repairing vehicle`, {
    damageBefore: currentDamage,
    damageAfter: newDamage,
  });

  return {
    vehicle: {
      ...context.vehicle,
      damage: newDamage,
    },
  };
};

/**
 * Action pour faire le plein de carburant
 */
const refuelVehicle: XStateV5Action = ({ context }) => {
  const currentFuel = context.vehicle.fuel;
  const newFuel = Math.min(currentFuel + 100, 1000);
  
  fsmLogger.context(`⛽ [${context.entityId}] Refueling vehicle`, {
    fuelBefore: currentFuel,
    fuelAfter: newFuel,
  });

  return {
    vehicle: {
      ...context.vehicle,
      fuel: newFuel,
    },
  };
};

/**
 * Générateur d'actions d'état pour logging
 */
const createStateAction = (stateName: string, phase: 'entry' | 'exit'): XStateV5Action => {
  return ({ context: _context }) => {
    fsmLogger.state(`action_${stateName}_${phase}`);
    
    if (phase === 'entry') {
      return { currentState: stateName };
    }
    
    return {};
  };
};

// Actions d'état générées
const action_evaluating_entry = createStateAction('evaluating', 'entry');
const action_evaluating_exit = createStateAction('evaluating', 'exit');
const action_exploring_entry = createStateAction('exploring', 'entry');
const action_exploring_exit = createStateAction('exploring', 'exit');
const action_collecting_entry = createStateAction('collecting', 'entry');
const action_collecting_exit = createStateAction('collecting', 'exit');
const action_maintaining_entry = createStateAction('maintaining', 'entry');
const action_maintaining_exit = createStateAction('maintaining', 'exit');
const action_drone_deploying_entry = createStateAction('drone_deploying', 'entry');
const action_drone_deploying_exit = createStateAction('drone_deploying', 'exit');
const action_drone_scanning_entry = createStateAction('drone_scanning', 'entry');
const action_drone_scanning_exit = createStateAction('drone_scanning', 'exit');
const action_drone_returning_entry = createStateAction('drone_returning', 'entry');
const action_drone_returning_exit = createStateAction('drone_returning', 'exit');
const action_ship_moving_to_tile_entry = createStateAction('ship_moving_to_tile', 'entry');
const action_ship_moving_to_tile_exit = createStateAction('ship_moving_to_tile', 'exit');
const action_ship_collecting_entry = createStateAction('ship_collecting', 'entry');
const action_ship_collecting_exit = createStateAction('ship_collecting', 'exit');
const action_ship_returning_entry = createStateAction('ship_returning', 'entry');
const action_ship_returning_exit = createStateAction('ship_returning', 'exit');
const action_ship_on_base_entry = createStateAction('ship_on_base', 'entry');
const action_ship_on_base_exit = createStateAction('ship_on_base', 'exit');
const action_ship_depositing_entry = createStateAction('ship_depositing', 'entry');
const action_ship_depositing_exit = createStateAction('ship_depositing', 'exit');
const action_ship_repairing_entry = createStateAction('ship_repairing', 'entry');
const action_ship_repairing_exit = createStateAction('ship_repairing', 'exit');
const action_ship_refueling_entry = createStateAction('ship_refueling', 'entry');
const action_ship_refueling_exit = createStateAction('ship_refueling', 'exit');

// Export des actions pour XState v5
export const actions = {
  updateShipPosition,
  updateDronePosition,
  processDroneInitRequest,
  collectResources,
  moveToTile,
  returnToBase,
  depositResources,
  repairVehicle,
  refuelVehicle,
  action_evaluating_entry,
  action_evaluating_exit,
  action_exploring_entry,
  action_exploring_exit,
  action_collecting_entry,
  action_collecting_exit,
  action_maintaining_entry,
  action_maintaining_exit,
  action_drone_deploying_entry,
  action_drone_deploying_exit,
  action_drone_scanning_entry,
  action_drone_scanning_exit,
  action_drone_returning_entry,
  action_drone_returning_exit,
  action_ship_moving_to_tile_entry,
  action_ship_moving_to_tile_exit,
  action_ship_collecting_entry,
  action_ship_collecting_exit,
  action_ship_returning_entry,
  action_ship_returning_exit,
  action_ship_on_base_entry,
  action_ship_on_base_exit,
  action_ship_depositing_entry,
  action_ship_depositing_exit,
  action_ship_repairing_entry,
  action_ship_repairing_exit,
  action_ship_refueling_entry,
  action_ship_refueling_exit,
};
