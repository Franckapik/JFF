/**
 * ==========================================================================
 * XSTATE EXPLORING STATE - Structure conforme au modèle machine.xstate.js
 * ==========================================================================
 *
 * État exploring avec sous-états : drone_deploying, drone_scanning, drone_returning.
 * Transitions internes :
 *   - DRONE_REACHES_TILE → drone_scanning
 *   - DRONE_SCANS_TILE → drone_returning
 *   - DRONE_REACHES_BASE → evaluating (état parent)
 * Actions d'entrée/sortie pour chaque sous-état.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0
 */

import { createTypedTransitions } from '../utils/stateHelpers.ts';

export const exploringState = {
  entry: { type: 'action_exploring_entry' },
  exit: { type: 'action_exploring_exit' },
  initial: 'drone_deploying',
  states: {
    drone_deploying: {
      entry: { type: 'action_drone_deploying_entry' },
      exit: { type: 'action_drone_deploying_exit' },
      on: createTypedTransitions({
        'DRONE_REACHES_TILE': 'drone_scanning'
      })
    },
    drone_scanning: {
      entry: { type: 'action_drone_scanning_entry' },
      exit: { type: 'action_drone_scanning_exit' },
      on: createTypedTransitions({
        'DRONE_SCANS_TILE': 'drone_returning'
      })
    },
    drone_returning: {
      entry: { type: 'action_drone_returning_entry' },
      exit: { type: 'action_drone_returning_exit' },
      on: createTypedTransitions({
        'DRONE_REACHES_BASE': '#machineX.evaluating'
      })
    }
  }
} as const;
