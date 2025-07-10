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

import { assign, createMachine } from 'xstate';

import allActions from './actions/index.ts';
import { createMachineContext } from './context/initialContext.ts';
import * as allGuards from './guards/guards.all.ts';
import { collectingState } from './states/collecting.state.js';
import { evaluatingState } from './states/evaluating.state.js';
import { exploringState } from './states/exploring.state.js';
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
  context: ({ input }) => {
    // L'input est déjà le contexte complet créé par le store
    if (input && input.entityId) {
      return input;
    }
    // Fallback si l'input n'est pas fourni correctement
    return createMachineContext(input?.entityId || 'bot-0', input?.entityType || 'auto');
  },
  on: {
    // Global event handlers - These events can be received in any state
    SHIP_POSITION_UPDATE: {
      actions: assign(({ context, event }) => {
        return allActions.updateShipPosition(context, event);
      })
    },
    DRONE_POSITION_UPDATE: {
      actions: assign(({ context, event }) => {
        return allActions.updateDronePosition(context, event);
      })
    },
    DRONE_INITIALIZE_REQUEST: {
      actions: assign(({ context, event }) => {
        return allActions.processDroneInitRequest(context, event);
      })
    }
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
