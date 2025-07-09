/**
 * ============================================================================
 * XSTATE EVALUATING STATE - Configuration de l'état evaluating
 * ============================================================================
 * 
 * État evaluating migré depuis la logique machine.xstate.js (XState natif).
 * - Transitions : needExploring, needCollecting, needMaintenance
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
    needExploring: {
      target: 'exploring',
      guard: 'shouldExplore', // Ajout du guard pour contrôler la transition
      actions: 'updateContext'
    },
    needCollecting: {
      target: 'collecting',
      guard: 'shouldCollect',
      actions: 'updateContext'
    },
    needMaintenance: {
      target: 'maintaining',
      guard: 'shouldMaintain',
      actions: 'updateContext'
    }
  }
};

export default evaluatingState;
