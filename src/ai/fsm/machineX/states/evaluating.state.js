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

import { action_evaluating_entry, action_evaluating_exit } from '../actions/evaluating.actions.js';
import { shouldExplore } from '../guards/guards.all.js';
import { assign } from 'xstate';
import { FSM_STATES } from '../config/constants.js';

console.log(FSM_STATES.EXPLORING);

/**
 * Configuration XState de l'état evaluating (modulaire)
 */
export const evaluatingState = {
  entry: 'action_evaluating_entry',
  exit: 'action_evaluating_exit',
  on: {
    needExploring: {
      target: FSM_STATES.EXPLORING,
      guard: 'shouldExplore', // Ajout du guard pour contrôler la transition
      actions: 'updateContext'
    },
    needCollecting: {
      target: FSM_STATES.COLLECTING,
      guard: 'shouldCollect',
      actions: 'updateContext'
    },
    needMaintenance: {
      target: FSM_STATES.MAINTAINING,
      guard: 'shouldMaintain',
      actions: 'updateContext'
    }
  }
};

export default evaluatingState;
