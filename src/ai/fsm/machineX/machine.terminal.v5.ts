/**
 * ==========================================================================
 * MACHINE XState v5 - VERSION TERMINAL (Sans dépendances R3F)
 * ==========================================================================
 * 
 * Version autonome du FSM pour les tests en terminal Node.js.
 * Remplace les actions avec effets R3F par des logs console.
 * 
 * USAGE:
 *   import { machineXV5Terminal } from './machine.terminal.v5.ts';
 *   const actor = createActor(machineXV5Terminal, { input: context });
 *   actor.start();
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* ts-ignore: allows .ts imports for Node.js ESM */

import { assign, setup } from 'xstate';

import type { FSMContext } from '../../../types/fsm.d.ts';

import { createMachineContext } from './context/initialContext.ts';
import type { MachineEvents } from './events.pure.v5.ts';

// Import des guards réels depuis l'architecture domain-based
import { canCollectTile, isVehicleOverloaded } from './domains/collection/guards.pure.ts';
import { canStartExploring, shouldCollect, shouldExplore, shouldMaintain } from './domains/evaluation/guards.ts';
import { isShipOnBase, maintenanceComplete, needsDeposit, needsRefuel, needsRepair } from './domains/maintenance/guards.pure.ts';

/**
 * Actions d'effets pour le mode terminal (remplacent les effets R3F par des logs)
 * Définies inline pour éviter les dépendances au logger
 */
const terminalEffects = {
  // Initializing
  onInitializingEntry: () => console.log('🎬 [FSM] → INITIALIZING'),
  onInitializingExit: () => console.log('✅ [FSM] ← INITIALIZING → EVALUATING'),
  
  // Evaluating
  onEvaluatingEntry: () => console.log('🤔 [FSM] → EVALUATING'),
  onEvaluatingExit: () => console.log('✅ [FSM] ← EVALUATING'),
  
  // Exploring
  onExploringEntry: () => console.log('🔍 [FSM] → EXPLORING'),
  onExploringExit: () => console.log('✅ [FSM] ← EXPLORING'),
  
  onDroneDeployingEntry: () => console.log('  🚁 [Drone] Deploying'),
  onDroneDeployingExit: () => console.log('  ✅ [Drone] Deployed'),
  
  onDroneScanningEntry: () => console.log('  📡 [Drone] Scanning'),
  onDroneScanningExit: () => console.log('  ✅ [Drone] Scan complete'),
  
  onDroneReturningEntry: () => console.log('  🔙 [Drone] Returning to base'),
  onDroneReturningExit: () => console.log('  ✅ [Drone] Returned to base'),
  
  // Collecting
  onCollectingEntry: () => console.log('⛏️  [FSM] → COLLECTING'),
  onCollectingExit: () => console.log('✅ [FSM] ← COLLECTING'),
  
  onShipMovingToTileEntry: () => console.log('  🚀 [Ship] Moving to tile'),
  onShipMovingToTileExit: () => console.log('  ✅ [Ship] Reached tile'),
  
  onShipCollectingEntry: () => console.log('  ⛏️  [Ship] Collecting resources'),
  onShipCollectingExit: () => console.log('  ✅ [Ship] Collected resources'),
  
  onShipReturningEntry: () => console.log('  🔙 [Ship] Returning to base'),
  onShipReturningExit: () => console.log('  ✅ [Ship] Returned to base'),
  
  // Maintaining
  onMaintainingEntry: () => console.log('🔧 [FSM] → MAINTAINING'),
  onMaintainingExit: () => console.log('✅ [FSM] ← MAINTAINING'),
  
  onShipOnBaseEntry: () => console.log('  🏠 [Ship] On base'),
  onShipOnBaseExit: () => console.log('  ✅ [Ship] Leaving base'),
  
  onShipDepositingEntry: () => console.log('  📦 [Ship] Depositing resources'),
  onShipDepositingExit: () => console.log('  ✅ [Ship] Resources deposited'),
  
  onShipRepairingEntry: () => console.log('  🔨 [Ship] Repairing'),
  onShipRepairingExit: () => console.log('  ✅ [Ship] Repaired'),
  
  onShipRefuelingEntry: () => console.log('  ⛽ [Ship] Refueling'),
  onShipRefuelingExit: () => console.log('  ✅ [Ship] Refueled'),
};

/**
 * Actions assign avec vraies mutations de contexte (Phase 2)
 * Utilisent l'API assign() de XState v5
 */
const terminalAssignActions = {
  // Initializing
  processShipInitRequest: assign(({ context, event }: { context: FSMContext; event: any }): FSMContext => {
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        position: event.initialPosition || { x: 0, y: 0, z: 0 },
        visualState: 'idle' as any,
      },
    };
  }),
  
  processDroneInitRequest: assign(({ context, event }: { context: FSMContext; event: any }): FSMContext => {
    const firstDroneKey = Object.keys(context.droneFleet.drones)[0];
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [firstDroneKey]: {
            ...context.droneFleet.drones[firstDroneKey],
            position: event.initialPosition || { x: 0, y: 0, z: 0 },
            visualState: 'docked' as any,
          },
        },
      },
    };
  }),
  
  // Global
  updateShipPosition: assign(({ context, event }: { context: FSMContext; event: any }): FSMContext => {
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        position: event.position || context.vehicle.position,
      },
    };
  }),
  
  updateDronePosition: assign(({ context, event }: { context: FSMContext; event: any }): FSMContext => {
    const firstDroneKey = Object.keys(context.droneFleet.drones)[0];
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [firstDroneKey]: {
            ...context.droneFleet.drones[firstDroneKey],
            position: event.position || context.droneFleet.drones[firstDroneKey].position,
          },
        },
      },
    };
  }),
  
  // Exploration
  assignDroneDeployingContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    const firstDroneKey = Object.keys(context.droneFleet.drones)[0];
    const firstDrone = context.droneFleet.drones[firstDroneKey];
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [firstDroneKey]: {
            ...firstDrone,
            visualState: 'deploying' as any,
            targetPosition: context.explorationQueue[0] || null,
          },
        },
      },
      fsmState: 'exploring',
    };
  }),
  
  assignDroneScanningContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    const firstDroneKey = Object.keys(context.droneFleet.drones)[0];
    const firstDrone = context.droneFleet.drones[firstDroneKey];
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [firstDroneKey]: {
            ...firstDrone,
            visualState: 'scanning' as any,
          },
        },
      },
      memory: {
        ...context.memory,
        stats: {
          ...context.memory.stats,
          tilesExploredInCycle: (context.memory.stats.tilesExploredInCycle || 0) + 1,
          tilesExplored: (context.memory.stats.tilesExplored || 0) + 1,
        },
      },
    };
  }),
  
  assignDroneReturningContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    const firstDroneKey = Object.keys(context.droneFleet.drones)[0];
    const firstDrone = context.droneFleet.drones[firstDroneKey];
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [firstDroneKey]: {
            ...firstDrone,
            visualState: 'returning' as any,
            targetPosition: context.vehicle.basePosition,
          },
        },
      },
    };
  }),
  
  assignDroneDockedContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    const firstDroneKey = Object.keys(context.droneFleet.drones)[0];
    const firstDrone = context.droneFleet.drones[firstDroneKey];
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [firstDroneKey]: {
            ...firstDrone,
            visualState: 'docked' as any,
            targetPosition: null,
          },
        },
      },
      fsmState: 'evaluating',
    };
  }),
  
  // Collection
  assignShipMovingToTileContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    const targetTile = context.injectedData?.availableTiles?.[0] as any;
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        visualState: 'moving' as any,
        targetVehicleTile: targetTile || null,
      },
      fsmState: 'collecting',
    };
  }),
  
  assignShipCollectingContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        visualState: 'collecting' as any,
      },
    };
  }),
  
  assignShipLoadResourcesContext: assign(({ context, event }: { context: FSMContext; event: any }): FSMContext => {
    const amountToAdd = event.amount || { food: 50, debris: 50, special: 0 }; // Default amounts for testing
    const currentResources = context.vehicle.resources;
    const newResources = {
      food: (currentResources.food || 0) + (amountToAdd.food || 0),
      debris: (currentResources.debris || 0) + (amountToAdd.debris || 0),
      special: (currentResources.special || 0) + (amountToAdd.special || 0),
      total: 0, // Will be recalculated
    };
    newResources.total = newResources.food + newResources.debris + newResources.special;
    
    // Consume fuel during collection (1% per collection)
    const newFuel = Math.max(0, (context.vehicle.fuel || 100) - 1);
    
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        resources: newResources,
        fuel: newFuel,
      },
      memory: {
        ...context.memory,
        stats: {
          ...context.memory.stats,
          tilesCollected: (context.memory.stats.tilesCollected || 0) + 1,
          totalResourcesFound: (context.memory.stats.totalResourcesFound || 0) + newResources.total,
        },
      },
    };
  }),
  
  assignShipReturningContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        visualState: 'returning' as any,
        targetVehicleTile: null,
      },
    };
  }),
  
  assignShipReachedBaseContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        visualState: 'idle' as any,
        position: context.vehicle.basePosition,
      },
      fsmState: 'maintaining',
    };
  }),
  
  // Maintenance
  assignShipDepositResourcesContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    const depositedResources = context.vehicle.resources;
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        resources: { food: 0, debris: 0, special: 0, total: 0 },
        visualState: 'depositing' as any,
      },
      score: {
        ...context.score,
        resources: {
          food: (context.score.resources.food || 0) + depositedResources.food,
          debris: (context.score.resources.debris || 0) + depositedResources.debris,
          special: (context.score.resources.special || 0) + depositedResources.special,
          total: (context.score.resources.total || 0) + depositedResources.total,
        },
      },
    };
  }),
  
  assignShipRefuelContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        fuel: 100, // Refuel to 100%
        visualState: 'refueling' as any,
      },
    };
  }),
  
  assignShipRepairContext: assign(({ context }: { context: FSMContext }): FSMContext => {
    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        damage: 0, // Full repair
        visualState: 'repairing' as any,
      },
    };
  }),
};

/**
 * Guards avec implémentations réelles des domaines
 * Note: areAllEntitiesInitialized gardé en stub car dépend de stores (impure)
 * Note: hasMoreCollectibleTiles nécessite injectedData (Option A - voir roadmap)
 */
const terminalGuards = {
  // Initializing (stub - impure, deferred)
  areAllEntitiesInitialized: () => true,
  
  // Evaluation (guards)
  canStartExploring: ({ context }: { context: FSMContext }) => canStartExploring({ context, event: {} as any }),
  shouldExplore: ({ context }: { context: FSMContext }) => shouldExplore({ context, event: {} as any }),
  shouldCollect: ({ context }: { context: FSMContext }) => shouldCollect({ context, event: {} as any }),
  shouldMaintain: ({ context }: { context: FSMContext }) => shouldMaintain({ context, event: {} as any }),
  
  // Collection (guards purs)
  canCollectTile: ({ context }: { context: FSMContext }) => canCollectTile({ context, event: {} as any }),
  isVehicleOverloaded: ({ context }: { context: FSMContext }) => isVehicleOverloaded({ context, event: {} as any }),
  
  // hasMoreCollectibleTiles: avec logique overload prioritaire
  // Si overloaded, retourner false même si des tuiles existent
  hasMoreCollectibleTiles: ({ context }: { context: FSMContext }) => {
    // Vérifier d'abord si overloaded (priorité plus haute)
    const currentResources = context.vehicle.resources;
    const totalResources = (currentResources.food || 0) + (currentResources.debris || 0) + (currentResources.special || 0);
    const maxCapacity = typeof context.vehicle.maxCapacity === 'object' && context.vehicle.maxCapacity !== null 
      ? (context.vehicle.maxCapacity as any).total || 2003
      : Number(context.vehicle.maxCapacity) || 2003;
    const threshold = maxCapacity * 0.8;
    
    // Si overloaded, pas de nouvelles collectes
    if (totalResources >= threshold) {
      return false;
    }
    
    // Sinon, vérifier les tuiles disponibles
    const tiles = context.injectedData?.availableTiles;
    return tiles && tiles.length > 1; // Si plus d'une tuile disponible
  },
  
  // Maintenance (guards purs)
  needsDeposit: ({ context }: { context: FSMContext }) => needsDeposit({ context, event: {} as any }),
  needsRefuel: ({ context }: { context: FSMContext }) => needsRefuel({ context, event: {} as any }),
  needsRepair: ({ context }: { context: FSMContext }) => needsRepair({ context, event: {} as any }),
  isShipOnBase: ({ context }: { context: FSMContext }) => isShipOnBase({ context, event: {} as any }),
  maintenanceComplete: ({ context }: { context: FSMContext }) => maintenanceComplete({ context, event: {} as any }),
};

/**
 * Machine XState v5 pour environnement terminal (sans R3F)
 */
export const machineXV5Terminal = setup({
  types: {
    context: {} as FSMContext,
    events: {} as MachineEvents,
  },
  actions: {
    ...terminalAssignActions,
    ...terminalEffects,
  } as any,
  guards: terminalGuards as any,
} as any).createMachine({
  id: 'machineXV5Terminal',
  initial: 'initializing',
  
  context: ({ input }) => {
    if (input && typeof input === 'object' && 'entityId' in input) {
      return input as FSMContext;
    }
    return createMachineContext('bot-0', 'auto');
  },

  on: {
    SHIP_POSITION_UPDATE: { actions: 'updateShipPosition' },
    DRONE_POSITION_UPDATE: { actions: 'updateDronePosition' }
  },

  states: {
    initializing: {
      entry: 'onInitializingEntry',
      exit: 'onInitializingExit',
      on: {
        SHIP_INITIALIZE_REQUEST: { actions: 'processShipInitRequest' },
        DRONE_INITIALIZE_REQUEST: { actions: 'processDroneInitRequest' },
      },
      always: { target: 'evaluating', guard: 'areAllEntitiesInitialized' }
    },

    evaluating: {
      entry: 'onEvaluatingEntry',
      exit: 'onEvaluatingExit',
      on: {
        NEED_EXPLORING: { target: 'exploring', guard: 'canStartExploring', actions: 'assignDroneDeployingContext' },
        NEED_COLLECTING: { target: 'collecting', guard: 'shouldCollect', actions: 'assignShipMovingToTileContext' },
        NEED_MAINTENANCE: { target: 'maintaining', guard: 'shouldMaintain' }
      }
    },

    exploring: {
      entry: 'onExploringEntry',
      exit: 'onExploringExit',
      initial: 'drone_deploying',
      states: {
        drone_deploying: {
          entry: 'onDroneDeployingEntry',
          exit: 'onDroneDeployingExit',
          on: { DRONE_REACHES_TILE: { target: 'drone_scanning', actions: 'assignDroneScanningContext' } }
        },
        drone_scanning: {
          entry: 'onDroneScanningEntry',
          exit: 'onDroneScanningExit',
          on: { DRONE_HAS_SCANNED: { target: 'drone_returning', actions: 'assignDroneReturningContext' } }
        },
        drone_returning: {
          entry: 'onDroneReturningEntry',
          exit: 'onDroneReturningExit',
          on: { DRONE_REACHES_BASE: { target: '#machineXV5Terminal.evaluating', actions: 'assignDroneDockedContext' } }
        }
      }
    },

    collecting: {
      entry: 'onCollectingEntry',
      exit: 'onCollectingExit',
      initial: 'ship_moving_to_tile',
      states: {
        ship_moving_to_tile: {
          entry: 'onShipMovingToTileEntry',
          exit: 'onShipMovingToTileExit',
          // Transition automatique si overloaded (après mutation du contexte)
          always: [
            { target: 'ship_returning', guard: 'isVehicleOverloaded', actions: 'assignShipReturningContext' }
          ],
          on: {
            SHIP_REACHES_TILE: [
              { target: 'ship_collecting', guard: 'canCollectTile', actions: 'assignShipCollectingContext' },
              { target: '#machineXV5Terminal.evaluating' }
            ]
          }
        },
        ship_collecting: {
          entry: 'onShipCollectingEntry',
          exit: 'onShipCollectingExit',
          on: {
            SHIP_LOAD_RESOURCES: [
              { target: 'ship_returning', guard: 'isVehicleOverloaded', actions: ['assignShipLoadResourcesContext', 'assignShipReturningContext'] },
              { target: 'ship_moving_to_tile', guard: 'hasMoreCollectibleTiles', actions: 'assignShipLoadResourcesContext' },
              { target: 'ship_returning', actions: ['assignShipLoadResourcesContext', 'assignShipReturningContext'] }
            ],
            RESOURCE_DEPLETED: '#machineXV5Terminal.evaluating'
          }
        },
        ship_returning: {
          entry: 'onShipReturningEntry',
          exit: 'onShipReturningExit',
          on: { SHIP_REACHES_BASE: { target: '#machineXV5Terminal.maintaining', actions: 'assignShipReachedBaseContext' } }
        }
      },
      on: {
        EMERGENCY_STOP: '#machineXV5Terminal.maintaining',
        LOW_FUEL_WARNING: '#machineXV5Terminal.maintaining'
      }
    },

    maintaining: {
      entry: 'onMaintainingEntry',
      exit: 'onMaintainingExit',
      initial: 'ship_on_base',
      states: {
        ship_on_base: {
          entry: 'onShipOnBaseEntry',
          exit: 'onShipOnBaseExit',
          always: [
            { target: 'depositing', guard: 'needsDeposit', actions: 'assignShipDepositResourcesContext' },
            { target: 'refueling', guard: 'needsRefuel', actions: 'assignShipRefuelContext' },
            { target: 'repairing', guard: 'needsRepair', actions: 'assignShipRepairContext' },
            { target: '#machineXV5Terminal.evaluating' }
          ],
          on: {
            SHIP_START_DEPOSIT: 'depositing',
            SHIP_START_REPAIR: 'repairing',
            SHIP_START_REFUEL: 'refueling'
          }
        },
        depositing: {
          entry: 'onShipDepositingEntry',
          exit: 'onShipDepositingExit',
          always: [
            { target: 'refueling', guard: 'needsRefuel' },
            { target: 'repairing', guard: 'needsRepair' },
            { target: '#machineXV5Terminal.evaluating' }
          ],
          on: {
            SHIP_DEPOSIT_COMPLETE: [
              { target: 'refueling', guard: 'needsRefuel' },
              { target: 'repairing', guard: 'needsRepair' },
              { target: '#machineXV5Terminal.evaluating' }
            ]
          }
        },
        repairing: {
          entry: 'onShipRepairingEntry',
          exit: 'onShipRepairingExit',
          on: {
            SHIP_REPAIR_COMPLETE: [
              { target: 'refueling', guard: 'needsRefuel' },
              { target: 'depositing', guard: 'needsDeposit' },
              { target: '#machineXV5Terminal.evaluating' }
            ]
          }
        },
        refueling: {
          entry: 'onShipRefuelingEntry',
          exit: 'onShipRefuelingExit',
          on: {
            SHIP_REFUEL_COMPLETE: [
              { target: 'depositing', guard: 'needsDeposit' },
              { target: 'repairing', guard: 'needsRepair' },
              { target: '#machineXV5Terminal.evaluating' }
            ]
          }
        }
      },
      on: { EMERGENCY_STOP: '.ship_on_base' }
    }
  }
} as any);

