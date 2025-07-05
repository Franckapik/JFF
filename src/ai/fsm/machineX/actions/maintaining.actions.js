/**
 * ==========================================================================
 * XSTATE MAINTAINING ACTIONS - Actions spécifiques à l'état maintaining
 * ==========================================================================
 *
 * Actions d'entrée/sortie pour chaque sous-état de maintaining.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0
 */

import fsmLogger from '../../../../logger/fsmLogger.js';

export const action_maintaining_entry = () => fsmLogger.state('action_maintaining_entry');
export const action_maintaining_exit = () => fsmLogger.state('action_maintaining_exit');
export const action_ship_on_base_entry = () => fsmLogger.state('action_ship_on_base_entry');
export const action_ship_on_base_exit = () => fsmLogger.state('action_ship_on_base_exit');
export const action_ship_depositing_entry = () => fsmLogger.state('action_ship_depositing_entry');
export const action_ship_depositing_exit = () => fsmLogger.state('action_ship_depositing_exit');
export const action_ship_repairing_entry = () => fsmLogger.state('action_ship_repairing_entry');
export const action_ship_repairing_exit = () => fsmLogger.state('action_ship_repairing_exit');
export const action_ship_refueling_entry = () => fsmLogger.state('action_ship_refueling_entry');
export const action_ship_refueling_exit = () => fsmLogger.state('action_ship_refueling_exit');

export default {
  action_maintaining_entry,
  action_maintaining_exit,
  action_ship_on_base_entry,
  action_ship_on_base_exit,
  action_ship_depositing_entry,
  action_ship_depositing_exit,
  action_ship_repairing_entry,
  action_ship_repairing_exit,
  action_ship_refueling_entry,
  action_ship_refueling_exit
};
