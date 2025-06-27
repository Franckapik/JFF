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
import { allActions } from './actions/index.js';
import { allGuards } from './guards/index.js';
import { evaluatingState } from './states/evaluating.state.js';

// États temporaires/simplifiés pour la structure
const exploringState = {
  entry: 'action_exploring_entry',
  exit: 'action_exploring_exit',
  // ...transitions internes à ajouter plus tard
};
const collectingState = {
  entry: 'action_collecting_entry',
  exit: 'action_collecting_exit',
  // ...transitions internes à ajouter plus tard
};
const maintainingState = {
  entry: 'action_maintaining_entry',
  exit: 'action_maintaining_exit',
  // ...transitions internes à ajouter plus tard
};

/**
 * Machine XState principale (modulaire)
 */
export const machineX = createMachine({
  id: 'machineX',
  initial: 'evaluating',
  states: {
    evaluating: evaluatingState,
    exploring: exploringState,
    collecting: collectingState,
    maintaining: maintainingState
  }
}, {
  actions: allActions,
  guards: allGuards
});

export default machineX;
