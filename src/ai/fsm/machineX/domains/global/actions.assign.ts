/**
 * ==========================================================================
 * GLOBAL DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * Actions globales qui ne dépendent d'aucun domaine spécifique métier.
 * Ces actions gèrent les mises à jour de positions et l'initialisation.
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour mettre à jour la position du vaisseau
 * Migré depuis actions.pure.v5.ts
 */
export const updateShipPosition = createAssignAction(({ context, event }) => {
  if (event.type !== 'SHIP_POSITION_UPDATE') return context;
  
  const { position } = event;
  fsmLogger.context(`🚢 [${context.entityId}] Setting ship position`, { position, shipType: event.shipType });
  
  // Si c'est la première position réelle (différente de la position par défaut), mettre à jour basePosition aussi
  const isInitialization = !context.vehicle?.position || 
    (context.vehicle.position.x === 0 && context.vehicle.position.y === 0.5 && context.vehicle.position.z === 0);
  
  if (isInitialization) {
    fsmLogger.context(`🚢 [${context.entityId}] First ship position update - setting as base position`);
    
    // Créer une WorldGridPosition pour basePosition
    const tileStore = useTileStore.getState();
    const coord = tileStore.worldToGrid(position);
    const basePosition = { ...position, coord };
    
    return {
      vehicle: {
        ...context.vehicle,
        position: position,
        basePosition: basePosition,
      },
    };
  }
  
  return {
    vehicle: {
      ...context.vehicle,
      position: position,
    },
  };
});

/**
 * Action assign pour mettre à jour la position du drone
 * Migré depuis actions.pure.v5.ts
 */
export const updateDronePosition = createAssignAction(({ context, event }) => {
  if (event.type !== 'DRONE_POSITION_UPDATE') return context;
  fsmLogger.context(`🛸 [${context.entityId}] Updating drone position`, { position: event.position, droneType: event.droneType });
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
});

/**
 * Action assign pour traiter les demandes d'initialisation de drone
 * Migré depuis actions.pure.v5.ts
 */
export const processDroneInitRequest = createAssignAction(({ context, event }) => {
  if (event.type !== 'DRONE_INITIALIZE_REQUEST') return context;
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
          visualState: 'docked',
        },
      },
    },
  };
});

/**
 * Action assign pour traiter les demandes d'initialisation de vaisseau
 * Similaire à processDroneInitRequest mais pour le vaisseau principal
 */
export const processShipInitRequest = createAssignAction(({ context, event }) => {
  if (event.type !== 'SHIP_INITIALIZE_REQUEST') return context;
  
  fsmLogger.context(`🚢 [${context.entityId}] Processing ship init request`, {
    currentPosition: context.vehicle.position,
    initialPosition: event.initialPosition,
    shipType: event.shipType,
  });
  
  // Créer une WorldGridPosition pour basePosition
  const tileStore = useTileStore.getState();
  const coord = tileStore.worldToGrid(event.initialPosition);
  const basePosition = { ...event.initialPosition, coord };
  
  return {
    vehicle: {
      ...context.vehicle,
      position: event.initialPosition,
      basePosition: basePosition,
      type: event.shipType as "main-ship", // Cast vers le type ShipType
    },
  };
});
