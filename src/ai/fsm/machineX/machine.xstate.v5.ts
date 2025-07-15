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

import v5Actions from './actions.v5.ts';
import { createMachineContext } from './context/initialContext.ts';
import v5Guards from './guards.v5.ts';

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
        // Transitions basées sur les guards
        needExploring: { 
          target: 'exploring', 
          guard: 'shouldExplore',
          actions: ['action_evaluating_exit']
        },
        needCollecting: { 
          target: 'collecting', 
          guard: 'shouldCollect',
          actions: ['action_evaluating_exit']
        },
        needMaintenance: { 
          target: 'maintaining', 
          guard: 'shouldMaintain',
          actions: ['action_evaluating_exit']
        }
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
      initial: 'ship_moving_to_tile',
      states: {
        ship_moving_to_tile: {
          entry: ['action_ship_moving_to_tile_entry'],
          exit: ['action_ship_moving_to_tile_exit'],
          on: {
            'SHIP_REACHES_TILE': [
              {
                target: 'ship_collecting',
                guard: 'canCollectTile'
              },
              {
                target: '#machineXV5.evaluating' // Retour si plus rien à collecter
              }
            ],
            'SHIP_POSITION_UPDATE': {
              actions: ['updateShipPosition']
            }
          }
        },
        ship_collecting: {
          entry: ['action_ship_collecting_entry'],
          exit: ['action_ship_collecting_exit'],
          on: {
            'SHIP_LOAD_RESOURCES': [
              {
                target: 'ship_returning',
                guard: 'isVehicleOverloaded' // Si plein, retourner
              },
              {
                target: 'ship_moving_to_tile' // Sinon continuer collecte
              }
            ],
            'RESOURCE_DEPLETED': '#machineXV5.evaluating' // Plus de ressources
          }
        },
        ship_returning: {
          entry: ['action_ship_returning_entry'],
          exit: ['action_ship_returning_exit'],
          on: {
            'SHIP_REACHES_BASE': [
              {
                target: '#machineXV5.maintaining',
                guard: 'shouldMaintain' // Maintenance si nécessaire
              },
              {
                target: '#machineXV5.evaluating' // Sinon évaluation
              }
            ],
            'SHIP_POSITION_UPDATE': {
              actions: ['updateShipPosition']
            }
          }
        }
      },
      // Transitions globales pour l'état collecting
      on: {
        'EMERGENCY_STOP': '#machineXV5.maintaining',
        'LOW_FUEL_WARNING': '#machineXV5.maintaining'
      }
    },

    maintaining: {
      entry: ['action_maintaining_entry'],
      exit: ['action_maintaining_exit'],
      initial: 'ship_on_base',
      states: {
        ship_on_base: {
          entry: ['action_ship_on_base_entry'],
          exit: ['action_ship_on_base_exit'],
          always: [
            // Transitions automatiques basées sur les besoins
            {
              target: 'depositing',
              guard: 'needsDeposit'
            },
            {
              target: 'refueling',
              guard: 'needsRefuel'
            },
            {
              target: 'repairing',
              guard: 'needsRepair'
            },
            {
              target: '#machineXV5.evaluating' // Si rien à faire
            }
          ],
          on: {
            // Événements manuels pour forcer certaines actions
            'SHIP_START_DEPOSIT': 'depositing',
            'SHIP_START_REPAIR': 'repairing',
            'SHIP_START_REFUEL': 'refueling'
          }
        },
        depositing: {
          entry: ['action_ship_depositing_entry'],
          exit: ['action_ship_depositing_exit'],
          on: {
            'SHIP_DEPOSIT_COMPLETE': [
              {
                target: 'refueling',
                guard: 'needsRefuel'
              },
              {
                target: 'repairing',
                guard: 'needsRepair'
              },
              {
                target: '#machineXV5.evaluating'
              }
            ]
          }
        },
        repairing: {
          entry: ['action_ship_repairing_entry'],
          exit: ['action_ship_repairing_exit'],
          on: {
            'SHIP_REPAIR_COMPLETE': [
              {
                target: 'refueling',
                guard: 'needsRefuel'
              },
              {
                target: 'depositing',
                guard: 'needsDeposit'
              },
              {
                target: '#machineXV5.evaluating'
              }
            ]
          }
        },
        refueling: {
          entry: ['action_ship_refueling_entry'],
          exit: ['action_ship_refueling_exit'],
          on: {
            'SHIP_REFUEL_COMPLETE': [
              {
                target: 'depositing',
                guard: 'needsDeposit'
              },
              {
                target: 'repairing',
                guard: 'needsRepair'
              },
              {
                target: '#machineXV5.evaluating'
              }
            ]
          }
        }
      },
      // Transitions globales pour l'état maintaining
      on: {
        'EMERGENCY_STOP': 'ship_on_base' // Retour immédiat à la base
      }
    }
  }
});

export default machineXV5;
