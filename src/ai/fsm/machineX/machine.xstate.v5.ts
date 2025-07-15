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

import { adaptLegacyAction, createBusinessAction, createStateAction } from './adapters/actionAdapters.ts';
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
  
  // Actions des états collecting (créées pour v5)
  collectResources: createBusinessAction('collectResources', (context) => ({
    vehicle: {
      ...context.vehicle,
      resources: {
        ...context.vehicle.resources,
        total: Math.min(context.vehicle.resources.total + 10, context.vehicle.maxCapacity.total)
      }
    }
  })),
  moveToTile: createBusinessAction('moveToTile', (context) => ({
    vehicle: {
      ...context.vehicle,
      isMoving: true
    }
  })),
  returnToBase: createBusinessAction('returnToBase', (context) => ({
    vehicle: {
      ...context.vehicle,
      isMoving: true
    }
  })),
  
  // Actions des états maintaining (créées pour v5)
  depositResources: createBusinessAction('depositResources', (context) => ({
    vehicle: {
      ...context.vehicle,
      resources: {
        food: 0,
        debris: 0,
        special: 0,
        total: 0
      },
      isAtCapacity: false
    }
  })),
  repairVehicle: createBusinessAction('repairVehicle', (context) => ({
    vehicle: {
      ...context.vehicle,
      damage: Math.max(context.vehicle.damage - 50, 0)
    }
  })),
  refuelVehicle: createBusinessAction('refuelVehicle', (context) => ({
    vehicle: {
      ...context.vehicle,
      fuel: Math.min(context.vehicle.fuel + 100, 1000) // Max fuel = 1000
    }
  })),
  
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
  
  // Actions collecting
  action_ship_moving_to_tile_entry: createStateAction('ship_moving_to_tile', 'entry'),
  action_ship_moving_to_tile_exit: createStateAction('ship_moving_to_tile', 'exit'),
  action_ship_collecting_entry: createStateAction('ship_collecting', 'entry'),
  action_ship_collecting_exit: createStateAction('ship_collecting', 'exit'),
  action_ship_returning_entry: createStateAction('ship_returning', 'entry'),
  action_ship_returning_exit: createStateAction('ship_returning', 'exit'),
  
  // Actions maintaining
  action_ship_on_base_entry: createStateAction('ship_on_base', 'entry'),
  action_ship_on_base_exit: createStateAction('ship_on_base', 'exit'),
  action_ship_depositing_entry: createStateAction('ship_depositing', 'entry'),
  action_ship_depositing_exit: createStateAction('ship_depositing', 'exit'),
  action_ship_repairing_entry: createStateAction('ship_repairing', 'entry'),
  action_ship_repairing_exit: createStateAction('ship_repairing', 'exit'),
  action_ship_refueling_entry: createStateAction('ship_refueling', 'entry'),
  action_ship_refueling_exit: createStateAction('ship_refueling', 'exit'),
};

/**
 * Guards adaptés pour XState v5
 */
const v5Guards: XStateGuardsRegistry = {
  // Guard principal d'exploration
  shouldExplore: adaptLegacyGuard(allGuards.shouldExplore),
  
  // Guards pour collecting
  shouldCollect: adaptLegacyGuard((context: FSMContext) => {
    return context.selectedTileForCollection !== null && 
           !context.vehicle.isAtCapacity &&
           context.vehicle.fuel > context.config.fuelThreshold; // Besoin de carburant
  }),
  
  canCollectTile: adaptLegacyGuard((context: FSMContext) => {
    const tile = context.selectedTileForCollection;
    return tile !== null && tile.resources.total > 0 && !context.vehicle.isAtCapacity;
  }),
  
  isAtTargetTile: adaptLegacyGuard((context: FSMContext) => {
    const target = context.selectedTileForCollection;
    if (!target) return false;
    
    const currentPos = context.vehicle.position;
    // Extraire x,z depuis le format GridCoordinate
    const [targetX, targetZ] = target.coord.coord.split(',').map(Number);
    const distance = Math.sqrt(
      Math.pow(currentPos.x - targetX, 2) + 
      Math.pow(currentPos.z - targetZ, 2)
    );
    return distance < 1.5; // Tolérance de proximité
  }),
  
  // Guards pour maintaining
  shouldMaintain: adaptLegacyGuard((context: FSMContext) => {
    const needsRefuel = context.vehicle.fuel < context.config.fuelThreshold;
    const needsRepair = context.vehicle.damage > 50;
    const shouldDeposit = context.vehicle.isAtCapacity;
    
    return needsRefuel || needsRepair || shouldDeposit;
  }),
  
  needsDeposit: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.isAtCapacity;
  }),
  
  needsRefuel: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.fuel < context.config.fuelThreshold;
  }),
  
  needsRepair: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.damage > 50;
  }),
  
  // Guards pour les drones
  isDroneAvailable: adaptLegacyGuard((context: FSMContext) => {
    return context.droneFleet?.drones?.explorer?.state === 'docked' || 
           context.droneFleet?.drones?.explorer?.state === 'returning';
  }),
  
  isDroneDeployed: adaptLegacyGuard((context: FSMContext) => {
    const droneState = context.droneFleet?.drones?.explorer?.state;
    return droneState === 'deploying' || droneState === 'scanning';
  }),
  
  isDroneScanComplete: adaptLegacyGuard((context: FSMContext) => {
    // Utiliser la progression du drone ou un indicateur de complétion
    const drone = context.droneFleet?.drones?.explorer;
    return drone?.state === 'returning'; // Retour indique scan complet
  }),
  
  hasValidTarget: adaptLegacyGuard((context: FSMContext) => {
    return context.currentTarget !== null;
  }),
  
  // Guards de position
  isAtBase: adaptLegacyGuard((context: FSMContext) => {
    const basePosition = context.vehicle.basePosition;
    const currentPosition = context.vehicle.position;
    const distance = Math.sqrt(
      Math.pow(currentPosition.x - basePosition.x, 2) + 
      Math.pow(currentPosition.z - basePosition.z, 2)
    );
    return distance < 2;
  }),
  
  isAtTarget: adaptLegacyGuard((context: FSMContext) => {
    const target = context.currentTarget;
    if (!target) return false;
    
    const currentPos = context.vehicle.position;
    // Extraire x,z depuis le format GridCoordinate
    const [targetX, targetZ] = target.coord.split(',').map(Number);
    const distance = Math.sqrt(
      Math.pow(currentPos.x - targetX, 2) + 
      Math.pow(currentPos.z - targetZ, 2)
    );
    return distance < 1.5;
  }),
  
  // Guards de cycle et evaluation
  hasPendingTargets: adaptLegacyGuard((context: FSMContext) => {
    return context.explorationQueue && context.explorationQueue.length > 0;
  }),
  
  isExplorationComplete: adaptLegacyGuard((context: FSMContext) => {
    return context.explorationCycle.phase === 'evaluating' || 
           context.explorationCycle.phase === 'collecting';
  }),
  
  hasDiscoveredTiles: adaptLegacyGuard((context: FSMContext) => {
    return context.explorationCycle.exploredTiles && 
           context.explorationCycle.exploredTiles.length > 0;
  }),
  
  // Guards d'état du véhicule
  isVehicleOperational: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.fuel > 10 && context.vehicle.damage < 80; // Seuils critiques
  }),
  
  isVehicleOverloaded: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.isAtCapacity;
  }),
  
  // Guards de ressources
  hasResourcesToDeposit: adaptLegacyGuard((context: FSMContext) => {
    return context.vehicle.isAtCapacity || 
           (context.vehicle.resources && context.vehicle.resources.total > 0);
  }),
  
  // Guards temporels
  isMaintenanceTime: adaptLegacyGuard((context: FSMContext) => {
    // Maintenance périodique ou nécessaire (sans lastMaintenanceTime)
    const needsFuel = context.vehicle.fuel < context.config.fuelThreshold;
    const needsRepair = context.vehicle.damage > 50;
    const needsDeposit = context.vehicle.isAtCapacity;
    
    return needsFuel || needsRepair || needsDeposit;
  }),
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
