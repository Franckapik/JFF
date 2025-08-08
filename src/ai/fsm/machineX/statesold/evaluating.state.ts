/**
 * ============================================================================
 * XSTATE EVALUATING STATE - Configuration de l'état evaluating
 * ============================================================================
 * 
 * État evaluating migré depuis la logique machine.xstate.js (XState natif).
 * - Transitions : NEED_EXPLORING, NEED_COLLECTING, NEED_MAINTENANCE
 * - Actions : action_evaluating_entry, action_evaluating_exit, updateContext
 * - Guards : shouldExplore, shouldCollect, shouldMaintain
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */


/**
 * Configuration XState de l'état evaluating (modulaire)
 */
export const evaluatingState = {
  entry: 'action_evaluating_entry',
  exit: 'action_evaluating_exit',
  on: {
    NEED_EXPLORING: {
      target: 'exploring',
      guard: 'shouldExplore', // Ajout du guard pour contrôler la transition
      actions: 'updateContext'
    },
    NEED_COLLECTING: {
      target: 'collecting',
      guard: 'shouldCollect',
      actions: 'updateContext'
    },
    NEED_MAINTENANCE: {
      target: 'maintaining',
      guard: 'shouldMaintain',
      actions: 'updateContext'
    }
  }
};

export default evaluatingState;
