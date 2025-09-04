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
export function createAssignAction(
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
  
  // Protection : vérifier que position n'est pas null
  if (!position) {
    fsmLogger.error(`🚢 [${context.entityId}] updateShipPosition: position is null`);
    return context;
  }
  
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
        position: { ...position, coord },
        basePosition: basePosition,
      },
    };
  }
  
  // Calculer coord pour position normale
  const tileStore = useTileStore.getState();
  const coord = tileStore.worldToGrid(position);
  
  return {
    vehicle: {
      ...context.vehicle,
      position: { ...position, coord },
    },
  };
});

/**
 * Action assign pour mettre à jour la position du drone
 * Migré depuis actions.pure.v5.ts
 */
export const updateDronePosition = createAssignAction(({ context, event }) => {
  if (event.type !== 'DRONE_POSITION_UPDATE') return context;
  
  // Protection : vérifier que position n'est pas null
  if (!event.position) {
    fsmLogger.error(`🛸 [${context.entityId}] updateDronePosition: position is null`);
    return context;
  }
  
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
// ...existing code...
