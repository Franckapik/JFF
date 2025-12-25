/**
 * ==========================================================================
 * EVALUATION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * CONVENTION : assign[Action]Context
 * Actions pures qui modifient le contexte via assign()
 */

import { assign } from 'xstate';

import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Assign action pour l'évaluation initiale du contexte
 * Actuellement pas d'action assign spécifique pour l'évaluation,
 * la logique de décision se fait dans les effets de bord
 */
export const assignEvaluationContext = createAssignAction(({ context: _context, event: _event }) => {
  
  // Pour le moment, l'évaluation ne modifie pas le contexte directement
  // La logique de décision se fait dans onEvaluatingEntry
  return {};
});
