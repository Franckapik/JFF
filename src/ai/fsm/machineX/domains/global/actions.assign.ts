/**
 * ==========================================================================
 * GLOBAL DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * ✅ Phase 4: Pure actions - no store dependencies (uses context.gridInfo)
 * Ces actions gèrent les mises à jour de positions et l'initialisation.
 */

import { assign } from 'xstate';

import { worldToGrid } from '../../../../../core/spatial/index.ts';
import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
export function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Helper pour synchroniser la position des drones docked avec le vaisseau
 * Appelé après chaque changement de position du vaisseau
 */
function syncDockedDronesPosition(
  context: FSMContext,
  newShipCoord: string
): Partial<FSMContext> {
  const drones = context.droneFleet?.drones;
  if (!drones) return {};

  // Construire un nouvel objet drones avec les positions mises à jour
  const updatedDrones = { ...drones };
  let hasDockedDrone = false;

  for (const droneType of Object.keys(drones) as Array<keyof typeof drones>) {
    const drone = drones[droneType];
    if (drone?.visualState === 'docked') {
      updatedDrones[droneType] = {
        ...drone,
        coord: newShipCoord as `${number},${number}`,
      };
      hasDockedDrone = true;
    }
  }

  // Ne retourner une mise à jour que si un drone docked a été trouvé
  if (hasDockedDrone) {
    return {
      droneFleet: {
        ...context.droneFleet,
        drones: updatedDrones,
      },
    };
  }

  return {};
}

/**
 * Action assign pour mettre à jour la position du vaisseau
 * Migré depuis actions.pure.v5.ts
 * 
 * ✅ Refactored: Uses GridCoordinate only (no WorldPosition storage)
 */
export const updateShipPosition = createAssignAction(({ context, event }) => {
  if (event.type !== 'SHIP_POSITION_UPDATE') return context;
  
  const { position } = event;
  
  // Protection : vérifier que position n'est pas null
  if (!position) {
    return context;
  }
  
  // ✅ Phase 4: Use context.gridInfo.spacing instead of useTileStore.getState()
  const spacing = context.gridInfo?.spacing ?? 1.2;
  
  // Convert WorldPosition → GridCoordinate
  const coord = worldToGrid(position, { spacing });
  
  // Si c'est la première position réelle, mettre à jour baseCoord aussi
  const isInitialization = !context.vehicle?.coord;
  
  if (isInitialization) {
    fsmLogger.info(`🎯 Ship initialization: coord=${coord}`);
    return {
      vehicle: {
        ...context.vehicle,
        coord,
        baseCoord: coord,  // Set base at first position
      },
      ...syncDockedDronesPosition(context, coord),
    };
  }
  
  // Mise à jour normale de position + synchroniser les drones docked
  return {
    vehicle: {
      ...context.vehicle,
      coord,
    },
    ...syncDockedDronesPosition(context, coord),
  };
});

/**
 * Action assign pour mettre à jour la position du drone
 * Migré depuis actions.pure.v5.ts
 * 
 * ✅ Refactored: Uses GridCoordinate only
 */
export const updateDronePosition = createAssignAction(({ context, event }) => {
  if (event.type !== 'DRONE_POSITION_UPDATE') return context;
  
  const { position, droneType } = event;
  
  // Protection : vérifier que position n'est pas null
  if (!position) {
    return context;
  }
  
  // Convert WorldPosition → GridCoordinate
  const spacing = context.gridInfo?.spacing ?? 1.2;
  const coord = worldToGrid(position, { spacing });
  
  return {
    droneFleet: {
      ...context.droneFleet,
      drones: {
        ...context.droneFleet?.drones,
        [droneType]: {
          ...context.droneFleet?.drones?.[droneType],
          coord,
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

/**
 * Phase 2: Action assign pour mettre à jour gridInfo depuis TILES_UPDATED event
 * Permet au FSM d'avoir accès aux tiles sans appeler useTileStore.getState()
 */
export const updateGridInfo = createAssignAction(({ context, event }) => {
  if (event.type !== 'TILES_UPDATED') return context;
  
  const { tiles, spacing, radius } = event;
  
  fsmLogger.context(`🗺️ [${context.entityId}] Updating gridInfo`, { 
    tileCount: Object.keys(tiles).length,
    spacing,
    radius
  });
  
  return {
    gridInfo: {
      tiles,
      spacing,
      radius,
      departTileCoord: context.gridInfo?.departTileCoord,
      syncedAt: Date.now(),
    },
  };
});
