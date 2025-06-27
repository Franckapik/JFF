import { MACHINE_EVENT_TYPES } from '../config/events.config.js';

/**
 * ==========================================================================
 * XSTATE MAINTAINING STATE - Structure conforme au modèle machine.xstate.js
 * ==========================================================================
 *
 * État maintaining avec sous-états : ship_on_base, depositing, repairing, refueling.
 * Transitions internes :
 *   - SHIP_START_DEPOSIT → depositing
 *   - SHIP_START_REPAIR → repairing
 *   - SHIP_START_REFUEL → refueling
 *   - SHIP_DEPOSIT_COMPLETE → evaluating (état parent)
 *   - SHIP_REPAIR_COMPLETE → evaluating (état parent)
 *   - SHIP_REFUEL_COMPLETE → evaluating (état parent)
 * Actions d'entrée/sortie pour chaque sous-état.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0
 */

export const maintainingState = {
  entry: { type: 'action_maintaining_entry' },
  exit: { type: 'action_maintaining_exit' },
  initial: 'ship_on_base',
  states: {
    ship_on_base: {
      entry: { type: 'action_ship_on_base_entry' },
      exit: { type: 'action_ship_on_base_exit' },
      on: {
        [MACHINE_EVENT_TYPES.SHIP_START_DEPOSIT]: 'depositing',
        [MACHINE_EVENT_TYPES.SHIP_START_REPAIR]: 'repairing',
        [MACHINE_EVENT_TYPES.SHIP_START_REFUEL]: 'refueling'
      }
    },
    depositing: {
      entry: { type: 'action_ship_depositing_entry' },
      exit: { type: 'action_ship_depositing_exit' },
      on: {
        [MACHINE_EVENT_TYPES.SHIP_DEPOSIT_COMPLETE]: '#machineX.evaluating'
      }
    },
    repairing: {
      entry: { type: 'action_ship_repairing_entry' },
      exit: { type: 'action_ship_repairing_exit' },
      on: {
        [MACHINE_EVENT_TYPES.SHIP_REPAIR_COMPLETE]: '#machineX.evaluating'
      }
    },
    refueling: {
      entry: { type: 'action_ship_refueling_entry' },
      exit: { type: 'action_ship_refueling_exit' },
      on: {
        [MACHINE_EVENT_TYPES.SHIP_REFUEL_COMPLETE]: '#machineX.evaluating'
      }
    }
  }
};
