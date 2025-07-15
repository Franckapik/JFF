/**
 * ==========================================================================
 * MACHINE XState v5 - Machine pure sans adapters ni legacy
 * ==========================================================================
 */

import { setup } from 'xstate';

import type { FSMContext } from '../../../types/fsm.d.ts';

import { actions } from './actions.pure.v5';
import { createMachineContext } from './context/initialContext';
import type { MachineEvents } from './events.pure.v5';
import { guards } from './guards.pure.v5';

/**
 * Machine XState v5 avec syntaxe pure
 */
export const machineXV5Pure = setup({
  types: {
    context: {} as FSMContext,
    events: {} as MachineEvents,
  },
  actions,
  guards,
}).createMachine({
  id: 'machineXV5Pure',
  initial: 'evaluating',
  
  context: ({ input }) => {
    // Si input est fourni et contient entityId, l'utiliser
    if (input && typeof input === 'object' && 'entityId' in input) {
      return input as FSMContext;
    }
    // Sinon créer un contexte par défaut
    return createMachineContext('bot-0', 'auto');
  },

  // Événements globaux (disponibles dans tous les états)
  on: {
    SHIP_POSITION_UPDATE: {
      actions: 'updateShipPosition'
    },
    DRONE_POSITION_UPDATE: {
      actions: 'updateDronePosition'
    },
    DRONE_INITIALIZE_REQUEST: {
      actions: 'processDroneInitRequest'
    }
  },

  states: {
    /**
     * État EVALUATING - Évalue les conditions pour choisir la prochaine action
     */
    evaluating: {
      entry: 'action_evaluating_entry',
      exit: 'action_evaluating_exit',
      
      // Transitions automatiques basées sur les conditions
      always: [
        {
          target: 'exploring', 
          guard: 'shouldExplore',
        },
        {
          target: 'collecting', 
          guard: 'shouldCollect',
        },
        {
          target: 'maintaining', 
          guard: 'shouldMaintain',
        }
      ],

      // Transitions manuelles (en cas d'événements explicites)
      on: {
        needExploring: { 
          target: 'exploring', 
          guard: 'shouldExplore',
        },
        needCollecting: { 
          target: 'collecting', 
          guard: 'shouldCollect',
        },
        needMaintenance: { 
          target: 'maintaining', 
          guard: 'shouldMaintain',
        }
      }
    },

    /**
     * État EXPLORING - Gère l'exploration avec le drone
     */
    exploring: {
      entry: 'action_exploring_entry',
      exit: 'action_exploring_exit',
      initial: 'drone_deploying',
      
      states: {
        drone_deploying: {
          entry: 'action_drone_deploying_entry',
          exit: 'action_drone_deploying_exit',
          on: {
            DRONE_REACHES_TILE: 'drone_scanning'
          }
        },
        
        drone_scanning: {
          entry: 'action_drone_scanning_entry',
          exit: 'action_drone_scanning_exit',
          on: {
            DRONE_SCANS_TILE: 'drone_returning'
          }
        },
        
        drone_returning: {
          entry: 'action_drone_returning_entry',
          exit: 'action_drone_returning_exit',
          on: {
            DRONE_REACHES_BASE: '#machineXV5Pure.evaluating'
          }
        }
      }
    },

    /**
     * État COLLECTING - Gère la collecte de ressources avec le vaisseau
     */
    collecting: {
      entry: 'action_collecting_entry',
      exit: 'action_collecting_exit',
      initial: 'ship_moving_to_tile',
      
      states: {
        ship_moving_to_tile: {
          entry: 'action_ship_moving_to_tile_entry',
          exit: 'action_ship_moving_to_tile_exit',
          on: {
            SHIP_REACHES_TILE: [
              {
                target: 'ship_collecting',
                guard: 'canCollectTile'
              },
              {
                target: '#machineXV5Pure.evaluating'
              }
            ]
          }
        },
        
        ship_collecting: {
          entry: 'action_ship_collecting_entry',
          exit: 'action_ship_collecting_exit',
          on: {
            SHIP_LOAD_RESOURCES: [
              {
                target: 'ship_returning',
                guard: 'isVehicleOverloaded'
              },
              {
                target: 'ship_moving_to_tile'
              }
            ],
            RESOURCE_DEPLETED: '#machineXV5Pure.evaluating'
          }
        },
        
        ship_returning: {
          entry: 'action_ship_returning_entry',
          exit: 'action_ship_returning_exit',
          on: {
            SHIP_REACHES_BASE: [
              {
                target: '#machineXV5Pure.maintaining',
                guard: 'shouldMaintain'
              },
              {
                target: '#machineXV5Pure.evaluating'
              }
            ]
          }
        }
      },
      
      // Événements d'urgence disponibles dans tout l'état collecting
      on: {
        EMERGENCY_STOP: '#machineXV5Pure.maintaining',
        LOW_FUEL_WARNING: '#machineXV5Pure.maintaining'
      }
    },

    /**
     * État MAINTAINING - Gère la maintenance (dépôt, réparation, carburant)
     */
    maintaining: {
      entry: 'action_maintaining_entry',
      exit: 'action_maintaining_exit',
      initial: 'ship_on_base',
      
      states: {
        ship_on_base: {
          entry: 'action_ship_on_base_entry',
          exit: 'action_ship_on_base_exit',
          
          // Transitions automatiques vers les tâches de maintenance
          always: [
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
              target: '#machineXV5Pure.evaluating'
            }
          ],
          
          // Transitions manuelles
          on: {
            SHIP_START_DEPOSIT: 'depositing',
            SHIP_START_REPAIR: 'repairing',
            SHIP_START_REFUEL: 'refueling'
          }
        },
        
        depositing: {
          entry: ['action_ship_depositing_entry', 'depositResources'],
          exit: 'action_ship_depositing_exit',
          on: {
            SHIP_DEPOSIT_COMPLETE: [
              {
                target: 'refueling',
                guard: 'needsRefuel'
              },
              {
                target: 'repairing',
                guard: 'needsRepair'
              },
              {
                target: '#machineXV5Pure.evaluating'
              }
            ]
          }
        },
        
        repairing: {
          entry: ['action_ship_repairing_entry', 'repairVehicle'],
          exit: 'action_ship_repairing_exit',
          on: {
            SHIP_REPAIR_COMPLETE: [
              {
                target: 'refueling',
                guard: 'needsRefuel'
              },
              {
                target: 'depositing',
                guard: 'needsDeposit'
              },
              {
                target: '#machineXV5Pure.evaluating'
              }
            ]
          }
        },
        
        refueling: {
          entry: ['action_ship_refueling_entry', 'refuelVehicle'],
          exit: 'action_ship_refueling_exit',
          on: {
            SHIP_REFUEL_COMPLETE: [
              {
                target: 'depositing',
                guard: 'needsDeposit'
              },
              {
                target: 'repairing',
                guard: 'needsRepair'
              },
              {
                target: '#machineXV5Pure.evaluating'
              }
            ]
          }
        }
      },
      
      // Événement d'urgence pour revenir à la base
      on: {
        EMERGENCY_STOP: '.ship_on_base'
      }
    }
  }
});
