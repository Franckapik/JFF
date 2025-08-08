/**
 * ==========================================================================
 * MACHINE XState v5 - Machine pure avec architecture domain-based
 * ==========================================================================
 * 
 * ✅ MIGRATION COMPLÈTE vers architecture domain-based !
 * 
 * STATUT DES DOMAINES :
 * ✅ Domaine evaluation : COMPLET (assignEvaluationContext, onEvaluatingEntry)
 * 🔄 Domaine exploration : Placeholders temporaires (prêt pour migration)
 * 🔄 Domaine collection : Placeholders temporaires (prêt pour migration)
 * 🔄 Domaine maintenance : Placeholders temporaires (prêt pour migration)
 * 
 * PROCHAINES ÉTAPES :
 * 1. Migrer assignDroneDeployingContext vers exploration domain
 * 2. Migrer toutes les actions effects temporaires vers leurs domaines respectifs
 * 3. Migrer les guards depuis guards.pure.v5.ts vers les domaines
 * 4. Supprimer complètement actions.pure.v5.ts et guards.pure.v5.ts
 * 
 * STRUCTURE ACTUELLE :
 * - Plus d'imports depuis actions.pure.v5.ts (sauf actions globales temporaires)
 * - Plus d'imports depuis guards.pure.v5.ts 
 * - Utilise uniquement l'architecture domain-based via ./domains
 */

import { setup } from 'xstate';

import type { FSMContext } from '../../../types/fsm.d.ts';

// Import depuis l'architecture domain-based
import {
  __collectionEffectsPlaceholder,
  __collectionGuardsPlaceholder,
  __explorationEffectsPlaceholder,
  __explorationGuardsPlaceholder,
  __maintenanceEffectsPlaceholder,
  __maintenanceGuardsPlaceholder,
  assignDroneDeployingContext,
  // Evaluation domain (COMPLET)
  assignEvaluationContext,
  onEvaluatingEntry,
  // Global domain (COMPLET - actions transversales)
  processDroneInitRequest,
  updateDronePosition,
  updateShipPosition
} from './domains';


import { createMachineContext } from './context/initialContext';
import type { MachineEvents } from './events.pure.v5';

/**
 * Machine XState v5 avec syntaxe pure
 */
export const machineXV5Pure = setup({
  types: {
    context: {} as FSMContext,
    events: {} as MachineEvents,
  },
  actions: {
    // Actions globales (ne dépendent d'aucun domaine spécifique)
    updateShipPosition,
    updateDronePosition,
    processDroneInitRequest,
    
    // Actions du domaine EVALUATION (migrées)
    assignEvaluationContext,
    onEvaluatingEntry,
    onEvaluatingExit: __explorationEffectsPlaceholder, // TODO: créer le vrai onEvaluatingExit
    
    // Actions temporaires du domaine EXPLORATION (à migrer)
    assignDroneDeployingContext, // TODO: migrer vers exploration domain
    onExploringEntry: __explorationEffectsPlaceholder,
    onExploringExit: __explorationEffectsPlaceholder,
    onDroneDeployingEntry: __explorationEffectsPlaceholder,
    onDroneDeployingExit: __explorationEffectsPlaceholder,
    onDroneScanningEntry: __explorationEffectsPlaceholder,
    onDroneScanningExit: __explorationEffectsPlaceholder,
    onDroneReturningEntry: __explorationEffectsPlaceholder,
    onDroneReturningExit: __explorationEffectsPlaceholder,
    
    // Actions temporaires du domaine COLLECTION (à migrer)
    onCollectingEntry: __collectionEffectsPlaceholder,
    onCollectingExit: __collectionEffectsPlaceholder,
    onShipMovingToTileEntry: __collectionEffectsPlaceholder,
    onShipMovingToTileExit: __collectionEffectsPlaceholder,
    onShipCollectingEntry: __collectionEffectsPlaceholder,
    onShipCollectingExit: __collectionEffectsPlaceholder,
    onShipReturningEntry: __collectionEffectsPlaceholder,
    onShipReturningExit: __collectionEffectsPlaceholder,
    
    // Actions temporaires du domaine MAINTENANCE (à migrer)
    onMaintainingEntry: __maintenanceEffectsPlaceholder,
    onMaintainingExit: __maintenanceEffectsPlaceholder,
    onShipOnBaseEntry: __maintenanceEffectsPlaceholder,
    onShipOnBaseExit: __maintenanceEffectsPlaceholder,
    onShipDepositingEntry: __maintenanceEffectsPlaceholder,
    onShipDepositingExit: __maintenanceEffectsPlaceholder,
    onShipRepairingEntry: __maintenanceEffectsPlaceholder,
    onShipRepairingExit: __maintenanceEffectsPlaceholder,
    onShipRefuelingEntry: __maintenanceEffectsPlaceholder,
    onShipRefuelingExit: __maintenanceEffectsPlaceholder,
  },
  guards: {
    // Guards du domaine EVALUATION (migré)
    shouldExplore: __explorationGuardsPlaceholder,
    
    // Guards temporaires des domaines (à migrer)
    shouldCollect: __collectionGuardsPlaceholder,
    shouldMaintain: __maintenanceGuardsPlaceholder,
    canCollectTile: __collectionGuardsPlaceholder,
    isVehicleOverloaded: __collectionGuardsPlaceholder,
    needsDeposit: __maintenanceGuardsPlaceholder,
    needsRefuel: __maintenanceGuardsPlaceholder,
    needsRepair: __maintenanceGuardsPlaceholder
  },
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
      entry: 'onEvaluatingEntry',
      exit: 'onEvaluatingExit',

      // Transitions manuelles (en cas d'événements explicites)
      on: {
        NEED_EXPLORING: { 
          target: 'exploring', 
          guard: 'shouldExplore',
          actions: 'assignDroneDeployingContext' // MAJ contexte ici (assign)
        },
        NEED_COLLECTING: { 
          target: 'collecting', 
          guard: 'shouldCollect',
          // Ajoute ici l'action assign si besoin
        },
        NEED_MAINTENANCE: { 
          target: 'maintaining', 
          guard: 'shouldMaintain',
          // Ajoute ici l'action assign si besoin
        }
      }
    },

    /**
     * État EXPLORING - Gère l'exploration avec le drone
     */
    exploring: {
      entry: 'onExploringEntry',
      exit: 'onExploringExit',
      initial: 'drone_deploying',

      states: {
        drone_deploying: {
          entry: 'onDroneDeployingEntry', // Effet de bord ici
          exit: 'onDroneDeployingExit',
          on: {
            DRONE_REACHES_TILE: 'drone_scanning'
          }
        },
        drone_scanning: {
          entry: 'onDroneScanningEntry',
          exit: 'onDroneScanningExit',
          on: {
            DRONE_SCANS_TILE: 'drone_returning'
          }
        },
        drone_returning: {
          entry: 'onDroneReturningEntry',
          exit: 'onDroneReturningExit',
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
      entry: 'onCollectingEntry',
      exit: 'onCollectingExit',
      initial: 'ship_moving_to_tile',
      
      states: {
        ship_moving_to_tile: {
          entry: 'onShipMovingToTileEntry',
          exit: 'onShipMovingToTileExit',
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
          entry: 'onShipCollectingEntry',
          exit: 'onShipCollectingExit',
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
          entry: 'onShipReturningEntry',
          exit: 'onShipReturningExit',
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
      entry: 'onMaintainingEntry',
      exit: 'onMaintainingExit',
      initial: 'ship_on_base',
      
      states: {
        ship_on_base: {
          entry: 'onShipOnBaseEntry',
          exit: 'onShipOnBaseExit',
          
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
          entry: ['onShipDepositingEntry'],
          exit: 'onShipDepositingExit',
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
          entry: ['onShipRepairingEntry'],
          exit: 'onShipRepairingExit',
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
          entry: ['onShipRefuelingEntry'],
          exit: 'onShipRefuelingExit',
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
