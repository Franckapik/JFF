import { MACHINE_EVENT_TYPES } from '../events/events.config.js';
/**
 * ==========================================================================
 * XSTATE COLLECTING STATE - Structure conforme au modèle machine.xstate.js
 * ==========================================================================
 *
 * État collecting avec sous-états : ship_moving_to_tile, ship_collecting, ship_returning.
 * Transitions internes :
 *   - SHIP_REACHES_TILE → ship_collecting
 *   - SHIP_LOAD_RESOURCES → ship_returning
 *   - SHIP_REACHES_BASE → evaluating (état parent)
 * Actions d'entrée/sortie pour chaque sous-état.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0
 */

export const collectingState = {
  entry: { type: 'action_collecting_entry' },
  exit: { type: 'action_collecting_exit' },
  initial: 'ship_moving_to_tile',
  states: {
    ship_moving_to_tile: {
      entry: { type: 'action_ship_moving_to_tile_entry' },
      exit: { type: 'action_ship_moving_to_tile_exit' },
      on: {
        [MACHINE_EVENT_TYPES.SHIP_REACHES_TILE]: 'ship_collecting'
      }
    },
    ship_collecting: {
      entry: { type: 'action_ship_collecting_entry' },
      exit: { type: 'action_ship_collecting_exit' },
      on: {
        [MACHINE_EVENT_TYPES.SHIP_LOAD_RESOURCES]: 'ship_returning'
      }
    },
    ship_returning: {
      entry: { type: 'action_ship_returning_entry' },
      exit: { type: 'action_ship_returning_exit' },
      on: {
        [MACHINE_EVENT_TYPES.SHIP_REACHES_BASE]: '#machineX.evaluating'
      }
    }
  }
};
