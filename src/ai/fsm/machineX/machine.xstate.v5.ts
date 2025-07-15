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
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgA0A1AVgGIBlACQEkAFAfToHkKaAVG5gOQYFU6AEQCC7AKIBtAAwBdRKAAOAe1jYALtiW55IAB6IAzFIBMATgB0xgOwBGABwkAbMccAWG44MAaEAE9EHq7mjiRSUlZSnnam0VYAvnE+aFh4hKRkggBKPGJMrBxcvAIi4tJySCDKqhpaOvoIxnYu5jYkdq7uUqZSruEkPv4IoS1S9lYGpo6TVq6ODglJGDj4xORZOQw03AXCADI0AFq5mWIAinxiFOxlOlXqmtoV9cZOUuYkBrO2dgbGPSRWAaIAC0Vjs5m6kJ67SsblMpgWIGSyzSJHMYAAbqgADYAV1QGlwUDI+EgYl0CmxSgATngoDcKncao9QPU2s5zK4SFz7L0DLDTECEB47OCXKYDHYrDEbH8YojkalVuisXiCXSSWBIABhJTY7FgdCE+myW4qe61J6IVwOSyuUyuCaimJST79PwBOaOSxWEgvDrTTwIxJIpZK0gqnH442ayAAWVQeDUYFwqFw6DADMU5uZdUMphIaNsJAljo8jnCQucaNd9s+xllBklxgVYZWEbAFKptKJ5gg1K0YAYEDAlKUvg1624xzEwm1VEuDE4u0kpsZOYeeaGERs5gMIUc4ybNnLQobzTs4VMspIJ4lANbKXbaM7Y57UD7A-wDFg6DTuEnbJpwYChtWEbgKCXGgVyzSoN0tVlEGcflORLSV91MaVZjPWVvUvaUbzvAwHxDRVn3RLsaTpT9BwYakwDUXFqQAokMiAmc5wXSCACFhAoVdymzapNytbczwmXc7FlUZfkw-krBbUi21Rcx0D1A0jQ1MQ4zETIAHExG4bUAE0QPYZg6FgpkRMQ4VPG9GYDBsX4rFsSUASFVpD2CRxWmiGwZjmSJHxRZU1P1Q0Y12ZgAHUGAAMQuXYGBi4RMm2bg9Ks+CWT0AIpSCUY2jaGJZPaTyASCVynNCTD7EqkLwzRcKNONcxYBwBQGGQJQMTpBg1CUAbsANShaEYE5OMXZcBLNYSELyhBgQCt5wkveFGhicYbFcTzjGaYrfN9BxekcRryJayLqI67Aup6vqiQGoaNFG6h6AYSb52m6DJBsQS4Pm3L6nsT5zCKhxoh+Mxyo9BB+SCYiJX3Ha2icxTFifFTLs03sbru3r+sG4bXvGvI2E4Hh+CEURZvXQGt2BLlwR6OYSzMRtok8yI3lCX0m0dP1CxIc6sfUq7cc6hhsZjN7GGi4RBA+y5mD4TJtUubL6dEm1vR2yIHDmdoPkBWHZWsTl7ALLoxgmYWlMxsKxZxj88alp2ZdJ+XFZOCgVbVjW-rmi0gZBFawbBLpTE2qUnN202Au9KQDZcYxJTmdHQwdiNpeuyWc9Yn2-fVhhBDEOgV3EQRNeDrdeUKvySqhmI48GVxjCCBwJWse0Xm5eJ7dC7P3dz266IYpiWOJWWlamni+NpoSa9EhsT2CGxr3stDOdNyrzGq1oum+BqB6a1Th4l0f6MY5iNWnz6uIYXj+IkQO6aX2z6vr4rIbKlvrV9PcaF7A-CjmCJsItHYRWdu1SWV8J631JiwcmhQqYlAXgDd+i0JS7mvG3a8bRLx+k8jYLo5hRQvB2tKUUnwIERjQEmRMk8yDaV0gZIypkrgWWrrmUSHgApkJ5JhW87RfjukGE5XylgpK9BmCeKQdsMaDzRPQ3AahGEjy6loBgAAjVAsAwBjXelcNK7AS5l3yNcNci8eG2QbJ4PeTQAQlj9L5IURh+EBQUnYEIJ5bYGFocoxhai8AaIYFo3R+jDGMGMZkUxJw6DCBoJkbhNlFp2IMA4l4voCwuBsGebku4Sy9C5B8XyjQAnmBUcEyeMDR7hL0QY6eMS4liESmIXYKSFrPA8BksEWTnG5Lca0DujoHTOUmA4bkFSqnqIvpo3AOiGlkE6SHBoPTMlOJya42GZhbAtFcivE8QYM5kRUjMkJcywkLIiQYl+-1rJdMQOkjZ2SXF5Nhr8eRe5RkuQFtKaZQTZku0lvUyJEhjD3JyluZ5fTNlvPyVHMGDpXSG0aLeBRmclGVMBRc4FdTrlLIkAYSFWtbL2imO8BwYJ15uFqkKJoxg96eEdBEduJCPAAoYbivso4NysWnqXJBHAGDamYHGcuYhShWIwTYtJXikWzBPLMEwPQzzXgyZ8W2YRQjOXsJy1RQKeXWX5aTQVFiRViolaUV+1jUnPHlV0RVO0Kx-D-g0bxjKREFilLWJO+rqnURHMaqeprzHkwteKiukgIVB1lfUHWaJZR1lhG4EhdguZfMmJENuZgQhNn7oo0+5yan0QUImd8USlYJKSRGq16CHmrLdEEGIHxvF9FFIeM8YIHKWzKU5Zurh-WGtLeWhB714mJMyLWqNdzY12qeeMRlOanBzDGBKE2gxrAUsctMMZXRPBDu5SO7AFa75l0ndOyV0aSWYPjd4xN7d12OFTUnLmThOQVk8PuR0WSzon3IsW6i9EABmuIwDYjHRNVpSVL1SpvXGwwrhpR7grPyK2SHnBuNrEiiYXIFKfAlH+wtAGcUlrAKB8DkGlZtOSqKyNV7Z1vwQ3DLkzaHBp3bd4jdC79yWF7TEBwuTD1kYoxBk147oPtNg9eudjyEAJpaI+-kz7OjptNrMcE3J4TUtLKMOwCQQy4CUCOeAFRTmrFk6s4EJZBQ7O8WQtC7gKwKSTkRzFp9MRRnVESSzW5uThCZZbX0z7tNiICM5IIt5U7tGKc4CUFTXzdjpL50SHxHQtGcDrCLYRHCeQlG8Iw0pnC+gKfF-9KlEtUV7P2WiQaqQTh80x+dQwJIZfbt47LkQzxdDePhfLWmwj+PK8qSr74aLfl-P+ZLTW5NoUZa6X0-pUYOG690MhV4jADddAlyiY2avfjgTfRrtq5O0reHKCSx1fhqc3T19b0pNv2kGxU-OUAUu2Ws7eelDowauicCQkw+0wQvfPni-GD0oBPWJmAd7i1rOumIZI5Vbggo-ucCDqBbVXavdh88ALaGo73vaO0ewb7It-d8mEfa1h9PDaHpj0Jh3J648QN0T1jR3Ft31iWPaJCyHEWcFJQ83QbTCemyd1ZXkLBG3Xr6XkojxJSQVeEVybduQdDF5c0FMOZuS6aBk1osInHKfGUMl4Uidr+htCeWnxGzmkcDby4Sx2ZXNei+CG0HxnEhEqmqyRsJs0fH3PuDF5m6EO97Me98LO4atDRPuEwl5mW9Ewl2hs7wJTwn+D10PyllSAcj+RsDYm3u663JKdoKHXSdxiPtbxarrzvDaC8FwUxn0BQM3EIAA */
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
        'EMERGENCY_STOP': '.ship_on_base' // Retour immédiat à la base
      }
    }
  }
});

export default machineXV5;
