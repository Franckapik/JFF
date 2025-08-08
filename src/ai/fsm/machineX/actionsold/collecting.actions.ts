/**
 * ==========================================================================
 * XSTATE COLLECTING ACTIONS - Actions spécifiques à l'état collecting
 * ==========================================================================
 *
 * Actions d'entrée/sortie pour chaque sous-état de collecting.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0
 */

import fsmLogger from '../../../../logger/fsmLogger.ts';

export const action_collecting_entry = () => fsmLogger.state('action_collecting_entry');
export const action_collecting_exit = () => fsmLogger.state('action_collecting_exit');
export const action_ship_moving_to_tile_entry = () => fsmLogger.state('action_ship_moving_to_tile_entry');
export const action_ship_moving_to_tile_exit = () => fsmLogger.state('action_ship_moving_to_tile_exit');
export const action_ship_collecting_entry = () => fsmLogger.state('action_ship_collecting_entry');
export const action_ship_collecting_exit = () => fsmLogger.state('action_ship_collecting_exit');
export const action_ship_returning_entry = () => fsmLogger.state('action_ship_returning_entry');
export const action_ship_returning_exit = () => fsmLogger.state('action_ship_returning_exit');

export default {
  action_collecting_entry,
  action_collecting_exit,
  action_ship_moving_to_tile_entry,
  action_ship_moving_to_tile_exit,
  action_ship_collecting_entry,
  action_ship_collecting_exit,
  action_ship_returning_entry,
  action_ship_returning_exit
};
