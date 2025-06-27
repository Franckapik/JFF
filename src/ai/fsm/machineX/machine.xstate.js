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
import { exploringState } from './states/exploring.state.js';
import { collectingState } from './states/collecting.state.js';
import { maintainingState } from './states/maintaining.state.js';

// États temporaires/simplifiés pour la structure
const maintainingStateRef = maintainingState;

/**
 * Machine XState principale (modulaire)
 */
export const machineX = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5gF8A0IB2B7CdGgFsBDAYwAsBLDMADXxAActYKAXCrDegD0QFoAbOgCe-AcjQhi5KrQB0YbgwA2WAE5Uo9Ji3aceiACwBOOQGYzARgBMAVmvGz9swAYA7JZGJrls+Zu2LvbWhmaGbtYS6NKU1DRyJFjKymAk7BhaSIzMbBxcWbwI4XLGAnYulqGWlu62niCiCGGGJYEuLgAcLtZutrZmblFSpLHyxFSsRFSa2jl6+aCFhtZeCB2WcgK97SE+lS4CHRISQA */
  id: 'machineX',
  initial: 'evaluating',
  states: {
    evaluating: evaluatingState,
    exploring: exploringState,
    collecting: collectingState,
    maintaining: maintainingStateRef
  }
}, {
  actions: allActions,
  guards: allGuards
});

export default machineX;
