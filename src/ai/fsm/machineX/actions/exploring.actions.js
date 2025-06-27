/**
 * ==========================================================================
 * XSTATE EXPLORING ACTIONS - Actions spécifiques à l'état exploring
 * ==========================================================================
 * 
 * Actions migrées depuis la logique Robot3/XState, version modulaire.
 * - action_exploring_entry : log d'entrée, initialisation éventuelle
 * - action_exploring_exit : log de sortie
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * Action d'entrée de l'état exploring : log + initialisation éventuelle
 */
export const action_exploring_entry = ({ context, self }) => {
  fsmLogger.state('action_exploring_entry');
  // TODO: Initialisation du cycle d'exploration si besoin
};

/**
 * Action de sortie de l'état exploring : simple log
 */
export const action_exploring_exit = () => {
  fsmLogger.state('action_exploring_exit');
};

export default {
  action_exploring_entry,
  action_exploring_exit
};
