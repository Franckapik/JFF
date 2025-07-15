/**
 * ============================================================================
 * XSTATE V5 MACHINE - Version expérimentale avec setup() et typage strict
 * ============================================================================
 * 
 * Machine XState v5 expérimentale utilisant setup() avec types stricts.
 * Cette version coexiste avec la machine v4 pendant la migration.
 * 
 * @author Migration XState v5
 * @version 1.0.0 - Expérimental
 */

import { setup } from 'xstate';

import type { MachineEvents } from '../../../types/events.d.ts';
import type { FSMContext } from '../../../types/fsm.d.ts';
import type { XStateActionsRegistry, XStateGuardsRegistry } from '../../../types/xstate.types.ts';

import { adaptLegacyAction, createStateAction } from './adapters/actionAdapters.ts';
import { adaptLegacyGuard } from './adapters/guardAdapters.ts';
import { createMachineContext } from './context/initialContext.ts';

// Import des actions/guards existants (à adapter progressivement)
import allActions from './actions/index.ts';
import * as allGuards from './guards/guards.all.ts';

/**
 * Actions adaptées pour XState v5
 */
const v5Actions: XStateActionsRegistry = {
  // Actions de base (adaptées automatiquement)
  updateShipPosition: adaptLegacyAction(allActions.updateShipPosition),
  updateDronePosition: adaptLegacyAction(allActions.updateDronePosition),
  processDroneInitRequest: adaptLegacyAction(allActions.processDroneInitRequest),
  
  // Actions d'états (créées spécifiquement pour v5)
  action_exploring_entry: createStateAction('exploring', 'entry'),
  action_exploring_exit: createStateAction('exploring', 'exit'),
  action_evaluating_entry: createStateAction('evaluating', 'entry'),
  action_evaluating_exit: createStateAction('evaluating', 'exit'),
  action_collecting_entry: createStateAction('collecting', 'entry'),
  action_collecting_exit: createStateAction('collecting', 'exit'),
  action_maintaining_entry: createStateAction('maintaining', 'entry'),
  action_maintaining_exit: createStateAction('maintaining', 'exit'),
  
  // Actions des sous-états (à implémenter progressivement)
  action_drone_deploying_entry: createStateAction('drone_deploying', 'entry'),
  action_drone_deploying_exit: createStateAction('drone_deploying', 'exit'),
  action_drone_scanning_entry: createStateAction('drone_scanning', 'entry'),
  action_drone_scanning_exit: createStateAction('drone_scanning', 'exit'),
  action_drone_returning_entry: createStateAction('drone_returning', 'entry'),
  action_drone_returning_exit: createStateAction('drone_returning', 'exit'),
};

/**
 * Guards adaptés pour XState v5
 */
const v5Guards: XStateGuardsRegistry = {
  shouldExplore: adaptLegacyGuard(allGuards.shouldExplore),
  // Ajouter d'autres guards progressivement...
};

/**
 * Machine XState v5 expérimentale avec setup()
 */
export const machineXV5 = setup({
  types: {
    context: {} as FSMContext,
    events: {} as MachineEvents,
  },
  actions: v5Actions,
  guards: v5Guards,
}).createMachine({
  id: 'machineXV5',
  initial: 'evaluating',
  
  context: ({ input }) => {
    // Gestion des inputs comme dans la v4
    if (input && (input as { entityId?: string }).entityId) {
      return input as FSMContext;
    }
    const inputData = input as { entityId?: string; entityType?: string };
    return createMachineContext(
      inputData?.entityId || 'bot-0', 
      (inputData?.entityType as 'auto' | 'player') || 'auto'
    );
  },

  // Événements globaux (typés strictement)
  on: {
    'SHIP_POSITION_UPDATE': {
      actions: ['updateShipPosition']
    },
    'DRONE_POSITION_UPDATE': {
      actions: ['updateDronePosition']
    },
    'DRONE_INITIALIZE_REQUEST': {
      actions: ['processDroneInitRequest']
    }
  },

  states: {
    evaluating: {
      entry: ['action_evaluating_entry'],
      exit: ['action_evaluating_exit'],
      on: {
        // TODO: Migrer les transitions depuis evaluating.state.ts
        // needExploring: { target: 'exploring', guard: 'shouldExplore' },
        // needCollecting: { target: 'collecting', guard: 'shouldCollect' },
        // needMaintenance: { target: 'maintaining', guard: 'shouldMaintain' }
      }
    },

    exploring: {
      entry: ['action_exploring_entry'],
      exit: ['action_exploring_exit'],
      initial: 'drone_deploying',
      states: {
        drone_deploying: {
          entry: ['action_drone_deploying_entry'],
          exit: ['action_drone_deploying_exit'],
          on: {
            'DRONE_REACHES_TILE': 'drone_scanning'
          }
        },
        drone_scanning: {
          entry: ['action_drone_scanning_entry'],
          exit: ['action_drone_scanning_exit'],
          on: {
            'DRONE_SCANS_TILE': 'drone_returning'
          }
        },
        drone_returning: {
          entry: ['action_drone_returning_entry'],
          exit: ['action_drone_returning_exit'],
          on: {
            'DRONE_REACHES_BASE': '#machineXV5.evaluating'
          }
        }
      }
    },

    collecting: {
      entry: ['action_collecting_entry'],
      exit: ['action_collecting_exit'],
      // TODO: Implémenter les sous-états de collecting
    },

    maintaining: {
      entry: ['action_maintaining_entry'],
      exit: ['action_maintaining_exit'],
      // TODO: Implémenter les sous-états de maintaining
    }
  }
});

export default machineXV5;
