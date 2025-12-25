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
 * Action assign pour mettre à jour la position du vaisseau
 * Migré depuis actions.pure.v5.ts
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
  
  // Si c'est la première position réelle (différente de la position par défaut), mettre à jour basePosition aussi
  const isInitialization = !context.vehicle?.position || 
    (context.vehicle.position.x === 0 && context.vehicle.position.y === 0.5 && context.vehicle.position.z === 0);
  
  if (isInitialization) {
    
    // Créer une WorldGridPosition pour basePosition
    const coord = worldToGrid(position, { spacing });
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
  const coord = worldToGrid(position, { spacing });
  
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
    return context;
  }
  
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
