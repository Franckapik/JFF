/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * TODO: Migrer les actions assign liées à la collecte depuis actions.pure.v5.ts
 * - assignCollectingTargetContext
 * - assignShipMovementContext
 * - collectResources (si c'est une action assign)
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

// TODO: Migrer les actions assign de collecte ici
// export const assignCollectingTargetContext = createAssignAction(({ context, event }) => { ... });

// Placeholder pour éviter les erreurs d'import
export const __collectionAssignPlaceholder = createAssignAction(({ context }) => {
  fsmLogger.info(`🔄 [${context.entityId}] Collection assign actions placeholder`);
  return {};
});
