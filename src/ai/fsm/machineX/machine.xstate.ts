/**
 * ============================================================================
 * XSTATE MAIN MACHINE - Nouvelle machine XState (architecture modulaire)
 * ============================================================================
 * 
 * Machine principale XState intégrant l'état evaluating migré, avec états temporaires
 * pour exploring, collecting, maintaining. Utilise les guards/actions centralisés.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

import { createMachine } from 'xstate';


import allActions from './actions/index.ts';
import { createMachineContext } from './context/initialContext.ts';
import { globalEventHandlers } from './events/global.events.ts';
import * as allGuards from './guards/guards.all.ts';
import { collectingState } from './states/collecting.state.ts';
import { evaluatingState } from './states/evaluating.state.ts';
import { exploringState } from './states/exploring.state.ts';
import { maintainingState } from './states/maintaining.state.ts';


// États temporaires/simplifiés pour la structure
const maintainingStateRef = maintainingState;

/**
 * Machine XState principale (modulaire) - Version TypeScript avec validation d'événements
 */
export const machineX = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgA0BiAZQAkBJABQH0qB5EigFQvoDkaBVKgEQEFmAUQDaABgC6iUAAcA9rGwAXbHNzSQAD0QAmHQFYAdAYDsADgCMBgDQgAnogAsYk4YCcYgGwGAvj9toWHiERLwAShxCdIwsbJw8AsLiUkgg8ooqahraCBYmYoYAzPpuhSb6tg4IBW76hVb6fgEYOPjE4ZE0FOyx-AAyFABaUWFCAIpcQiTMyRrpyqrqqTkAtBZmnpWIa55+-iC4chBwGoGthHMKC1nLiGaOhhbOnnllXmL6jiZbCIViD2YSmVGnsgA */
  id: 'machineX',
  initial: 'evaluating',
  context: ({ input }) => {
    // L'input est déjà le contexte complet créé par le store
    if (input && (input as { entityId?: string }).entityId) {
      return input;
    }
    // Fallback si l'input n'est pas fourni correctement
    return createMachineContext((input as { entityId?: string; entityType?: string })?.entityId || 'bot-0', (input as { entityId?: string; entityType?: string })?.entityType || 'auto');
  },
  on: {
    ...globalEventHandlers
  },
  states: {
    evaluating: evaluatingState,
    exploring: exploringState,
    collecting: collectingState,
    maintaining: maintainingStateRef
  }
}, {
  guards: {
    ...allGuards
  },
  actions: {
    ...allActions
  }
});

export default machineX;
