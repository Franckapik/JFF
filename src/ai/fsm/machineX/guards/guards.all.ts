 // guards.all.ts
// Centralise toutes les fonctions guards ET utilitaires utilisées dans les guards
// pour permettre un import unique et simplifier la maintenance.

import fsmLogger from '../../../../logger/fsmLogger';

export type FSMContext = import('../../../../types/fsm').FSMContext;
export type FSMEvent = import('../../../../types/fsm').FSMEvent;
export type Guard = (context: FSMContext, event?: FSMEvent, ...args: any[]) => boolean;

// --- EXPLORING GUARD ---
export const shouldExplore: Guard = (context, event) => {
  fsmLogger.condition('[shouldExplore]', { context, event });
  if (context.explorationCycle) {
    fsmLogger.condition('[shouldExplore] Local exploration complete - no valid targets within radius 3');
    return false;
  }
  return true;
};
