/**
 * ==========================================================================
 * MACHINE XState v5 - Machine pure avec architecture domain-based
 * ==========================================================================
 * 
 * ✅ MIGRATION COMPLÈTE vers architecture domain-based !
 * 
 * STATUT DES DOMAINES :
 * ✅ Domaine global : COMPLET (updateShipPosition, updateDronePosition, processDroneInitRequest)
 * ✅ Domaine evaluation : COMPLET (assignEvaluationContext, onEvaluatingEntry)
 * ✅ Domaine exploration : COMPLET (assignDroneDeployingContext + toutes les actions effects)
 * 🔄 Domaine collection : Placeholders temporaires (prêt pour migration)
 * 🔄 Domaine maintenance : Placeholders temporaires (prêt pour migration)
 * 
 * ACTIONS MIGRÉES :
 * - Global: updateShipPosition, updateDronePosition, processDroneInitRequest
 * - Evaluation: assignEvaluationContext, onEvaluatingEntry
 * - Exploration: assignDroneDeployingContext, onExploringEntry/Exit, onDroneDeployingEntry/Exit, 
 *   onDroneScanningEntry/Exit, onDroneReturningEntry/Exit
 * 
 * STRUCTURE ACTUELLE :
 * - Imports uniquement depuis l'architecture domain-based via ./domains
 * - Actions organisées par domaine métier pour une meilleure maintenabilité
 */

import { setup } from 'xstate';

import type { FSMContext } from '../../../types/fsm.d.ts';

// Import depuis l'architecture domain-based
import {
  __maintenanceEffectsPlaceholder,
  __maintenanceGuardsPlaceholder,
  assignDroneDeployingContext,
  assignDroneDockedContext,
  assignDroneReturningContext,
  assignDroneScanningContext,
  // Evaluation domain (COMPLET)
  assignEvaluationContext,
  assignShipCollectingContext,
  assignShipLoadResourcesContext,
  assignShipMovingToTileContext,
  assignShipReachedBaseContext,
  assignShipReturningContext,
  // Exploration domain (COMPLET - actions effects migrées)
  onCollectingEntry,
  onCollectingExit,
  onDroneDeployingEntry,
  onDroneDeployingExit,
  onDroneReturningEntry,
  onDroneReturningExit,
  onDroneScanningEntry,
  onDroneScanningExit,
  onEvaluatingEntry,
  onEvaluatingExit,
  onExploringEntry,
  onExploringExit,
  onShipCollectingEntry,
  onShipCollectingExit,
  onShipMovingToTileEntry,
  onShipMovingToTileExit,
  onShipReturningEntry,
  onShipReturningExit,
  // Global domain (COMPLET - actions transversales)
  processDroneInitRequest,
  shouldCollect,
  shouldExplore,
  updateDronePosition,
  updateShipPosition
} from './domains';

// Import des guards de collection
import {
  canCollectTile,
  hasMoreCollectibleTiles,
  isVehicleOverloaded
} from './domains/collection/guards';


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
    onEvaluatingExit, 
    
    // Actions du domaine EXPLORATION (migrées)
    assignDroneDeployingContext,
    assignDroneScanningContext,
    assignDroneReturningContext,
    assignDroneDockedContext,
    onExploringEntry,
    onExploringExit,
    onDroneDeployingEntry,
    onDroneDeployingExit,
    onDroneScanningEntry,
    onDroneScanningExit,
    onDroneReturningEntry,
    onDroneReturningExit,
    
    // Actions du domaine COLLECTION (migrées)
    assignShipMovingToTileContext,
    assignShipCollectingContext,
    assignShipReturningContext,
    assignShipReachedBaseContext,
    assignShipLoadResourcesContext,
    onCollectingEntry,
    onCollectingExit,
    onShipMovingToTileEntry,
    onShipMovingToTileExit,
    onShipCollectingEntry,
    onShipCollectingExit,
    onShipReturningEntry,
    onShipReturningExit,
    
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
  shouldExplore,
    
    // Guards temporaires des domaines (à migrer)
    shouldCollect,
    shouldMaintain: __maintenanceGuardsPlaceholder,
    canCollectTile,
    isVehicleOverloaded,
    hasMoreCollectibleTiles,
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
          actions: 'assignShipMovingToTileContext' // MAJ contexte ici (assign)
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
            DRONE_REACHES_TILE: {
              target: 'drone_scanning',
              actions: 'assignDroneScanningContext' // MAJ contexte du drone à 'scanning'
            }
          }
        },
        drone_scanning: {
          entry: 'onDroneScanningEntry',
          exit: 'onDroneScanningExit',
          on: {
              DRONE_HAS_SCANNED: {
                target: 'drone_returning',
                actions: 'assignDroneReturningContext' // MAJ contexte du drone à 'returning'
              }
          }
        },
        drone_returning: {
          entry: 'onDroneReturningEntry',
          exit: 'onDroneReturningExit',
          on: {
            DRONE_REACHES_BASE: {
              target: '#machineXV5Pure.evaluating',
              actions: 'assignDroneDockedContext' // MAJ contexte du drone à 'docked' et currentState à 'evaluating'
            }
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
                guard: 'canCollectTile',
                actions: 'assignShipCollectingContext'
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
                guard: 'isVehicleOverloaded',
                actions: ['assignShipLoadResourcesContext', 'assignShipReturningContext']
              },
              {
                target: 'ship_moving_to_tile',
                guard: 'hasMoreCollectibleTiles',
                actions: 'assignShipLoadResourcesContext'
              },
              {
                target: 'ship_returning',
                actions: ['assignShipLoadResourcesContext', 'assignShipReturningContext']
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
                guard: 'shouldMaintain',
                actions: 'assignShipReachedBaseContext'
              },
              {
                target: '#machineXV5Pure.evaluating',
                actions: 'assignShipReachedBaseContext'
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
