/**
 * ==========================================================================
 * MACHINE XState v5 - Machine architecture domain-based
 * ==========================================================================
 * 
 * ✅ MIGRATION COMPLÈTE vers architecture domain-based !
 * 
 * STATUT DES DOMAINES :
 * ✅ Domaine global : COMPLET (updateShipPosition, updateDronePosition, processDroneInitRequest)
 * ✅ Domaine evaluation : COMPLET (assignEvaluationContext, onEvaluatingEntry)
 * ✅ Domaine exploration : COMPLET (assignDroneDeployingContext + toutes les actions effects)
 * ✅ Domaine collection : COMPLET (migration complète)
 * ✅ Domaine maintenance : COMPLET (migration complète)
 * 
 * ACTIONS MIGRÉES :
 * - Global: updateShipPosition, updateDronePosition, processDroneInitRequest
 * - Evaluation: assignEvaluationContext, onEvaluatingEntry
 * - Exploration: assignDroneDeployingContext, onExploringEntry/Exit, onDroneDeployingEntry/Exit, 
 *   onDroneScanningEntry/Exit, onDroneReturningEntry/Exit
 * - Collection: toutes les actions de déplacement et chargement de ressources
 * - Maintenance: toutes les actions de dépôt, réparation, ravitaillement
 * 
 * STRUCTURE ACTUELLE :
 * - Imports uniquement depuis l'architecture domain-based via ./domains
 * - Actions organisées par domaine métier pour une meilleure maintenabilité
 */

import { setup } from 'xstate';

import type { FSMContext } from '../../../types/fsm.d.ts';

// Import depuis l'architecture domain-based
// Imports par domaine pour éviter les erreurs de syntaxe
import { assignShipCollectingContext, assignShipLoadResourcesContext, assignShipMovingToTileContext, assignShipReachedBaseContext, assignShipReturningContext, onCollectingEntry, onCollectingExit, onShipCollectingEntry, onShipCollectingExit, onShipMovingToTileEntry, onShipMovingToTileExit, onShipReturningEntry, onShipReturningExit } from './domains/collection/index.ts';
import { assignEvaluationContext, onEvaluatingEntry, onEvaluatingExit } from './domains/evaluation/index.ts';
// ✅ Phase 1: ALL guards from guards.pure.ts (no store dependencies)
import { canStartExploring, hasTilesAvailable, shouldCollect, shouldExplore, shouldMaintain } from './domains/evaluation/guards.pure.ts';
import { assignDroneDeployingContext, assignDroneDockedContext, assignDroneReturningContext, assignDroneScanningContext, assignDroneReadyContext, onDroneDeployingEntry, onDroneDeployingExit, onDroneReturningEntry, onDroneReturningExit, onDroneScanningEntry, onDroneScanningExit, onDroneDockedEntry, onDroneDockedExit, onExploringEntry, onExploringExit } from './domains/exploration/index.ts';
// ✅ Phase 2: Import updateGridInfo for TILES_UPDATED event
import { updateDronePosition, updateGridInfo, updateShipPosition } from './domains/global/index.ts';
import { processDroneInitRequest, processShipInitRequest } from './domains/initializing/actions.assign.ts';
import { onInitializingEntry, onInitializingExit } from './domains/initializing/actions.effects.ts';
import { assignShipDepositResourcesContext, assignShipRefuelContext, assignShipRepairContext } from './domains/maintenance/actions.assign.ts';
import { onMaintainingEntry, onMaintainingExit, onShipDepositingEntry, onShipDepositingExit, onShipRefuelingEntry, onShipRefuelingExit, onShipRepairingEntry, onShipRepairingExit } from './domains/maintenance/actions.effects.ts';
import { isShipOnBase, maintenanceComplete, needsDeposit, needsRefuel, needsRepair } from './domains/maintenance/guards.pure.ts';

// ✅ Phase 1: Pure guards from collection domain
import { canCollectTile, hasMoreCollectibleTiles, isVehicleOverloaded } from './domains/collection/guards.pure.ts';
// ✅ Phase 1: Pure guards from initializing domain
import { areAllEntitiesInitialized, isBasePositionInitialized, isDronePositionInitialized, isVehiclePositionInitialized } from './domains/initializing/guards.pure.ts';

import { createMachineContext } from './context/initialContext.ts';
import type { MachineEvents } from './events.pure.v5.ts';



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
    updateGridInfo, // ✅ Phase 2: Grid sync action
    processDroneInitRequest,
    processShipInitRequest,
    
    // Actions du domaine EVALUATION (migrées)
    assignEvaluationContext,
    onEvaluatingEntry,
    onEvaluatingExit, 
    
    // Actions du domaine EXPLORATION (migrées)
    assignDroneDeployingContext,
    assignDroneScanningContext,
    assignDroneReturningContext,
    assignDroneDockedContext,
    assignDroneReadyContext,
    onExploringEntry,
    onExploringExit,
    onDroneDeployingEntry,
    onDroneDeployingExit,
    onDroneScanningEntry,
    onDroneScanningExit,
    onDroneReturningEntry,
    onDroneReturningExit,
    onDroneDockedEntry,
    onDroneDockedExit,
    
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
    
    // Actions du domaine MAINTENANCE (migrées)
    assignShipDepositResourcesContext,
    assignShipRepairContext,
    assignShipRefuelContext,
    onMaintainingEntry,
    onMaintainingExit,
    onShipDepositingEntry,
    onShipDepositingExit,
    onShipRepairingEntry,
    onShipRepairingExit,
    onShipRefuelingEntry,
    onShipRefuelingExit,

    // Actions d'effets pour initializing
    onInitializingEntry,
    onInitializingExit,
  },
  guards: {
    // ✅ Phase 1: All guards from guards.pure.ts (no store dependencies)
    // Guards d'initializing (pure) - these take context directly, wrap them
    isVehiclePositionInitialized: (args) => isVehiclePositionInitialized(args.context),
    isDronePositionInitialized: (args) => isDronePositionInitialized(args.context),
    isBasePositionInitialized: (args) => isBasePositionInitialized(args.context),
    areAllEntitiesInitialized: (args) => areAllEntitiesInitialized(args.context),

    // Guards du domaine EVALUATION (pure) - these are XStateV5Guard format
    hasTilesAvailable, // ✅ Uses context.gridInfo.tiles or memory.knownTiles
    canStartExploring, // ✅ Pure: combines hasTilesAvailable + shouldExplore
    shouldExplore,
    shouldMaintain,
    shouldCollect, // ✅ Pure: uses context.gridInfo.tiles
    
    // Guards du domaine COLLECTION (pure)
    canCollectTile,
    isVehicleOverloaded,
    hasMoreCollectibleTiles, // ✅ Pure: uses context.memory.knownTiles
    
    // Guards du domaine MAINTENANCE (pure)
    needsDeposit,
    needsRefuel,
    needsRepair,
    isShipOnBase,
    maintenanceComplete
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgA0A1AVgAUBXAJzAGIBlACQEkyB9MgeXuYBVnOAOTYBVMgBEAgrwCiAbQAMAXUSgADgHtY2AC7YNuVSAAeiAEwkAnJYB0ADgAsAZgckSARnd2STu04A0IACeiO5mAL7hgWhYeISklDQMLOzMgnzMkgAyzABaMmwASjIAiiIy9LyKKkggmtp6BkamCAC0DnY2ln52dpbuTpYOCgDsIySBIQjuIw4jNhZmAGwrI2EOSyOR0Rg4+MTk1HTihUIFXDz8QqIS0vLKRvW6+oa1LRaWCl2uoxuO4+4JsFzCRhjYFID+iQVmYFC4nNsQDE9vFDkkTmc2GkMtk8gVimUKlUHrUno1XqB3iQ-DZqdCzO4lhYNoDJuYHBzwUyRgp6XZAVsokjdnEDokwDYwAA3VAAGwoqD0uCgtEEMhk4jYMgIZCynEKaQA4tVHlpnk03oh+TZ3MMmZYlgphkMRmyEGYGe4bCNrG5fJYrEt3IjkaKEkdJTL5Yq8Cq1Rq2ABhThZLIyRP8QTGknqM3k5qIMZuxlgpZ2BQKZYOBk8pxLEMi-bhmiRuUKpVx9WagCykjSskEkkEifuNVzDReBfdvNsfV5VgGQzmdmLg1sXgrlg9lacJA9DdiTbRErAxjUso0VFjNggVAMYDYEDA540QVjtAxaqKMkkicYFTYfg0xNUk80nS0ECWfobGcWY7B9OYSAULc3Q9EYnHsOtASWXwRiWakDxRMUI1PF8r2VG873wNhYHQVBcFwd9PwKRhJHoNh6ETIc1XEEDx3NCkTFCBkvgDJx3GsflYTwoEpjQjC-CDaFcPwuxCLDY9JTPC9yKgSj7zYGgdGoRjlQ-U4v2KX9-3YgAhNjR1NCcLUpRBBgcWknCcOFLF8OZfOWYsXXBXoSB5Mxem8+shVDI9xRsdANFlWUwHQDtaBkbsZEKQ0ZGHABNDjeE4Mg+LqMCXKE6Y7Bw2kmQcRlkPw5diwGL4avGMKfTMEZvHUuKI0S5LUvSvUAHU2AAMXKLI2DGyRCnSLMyrJcDXOq5w6rMBrHQdUFeta6061mLcIQZOtop2Q9UXioaUrS69YBwNQ2GQDQpVjNgdA0L7sBS5JWG-ayAKAxzQOcwSWjXG14I6AZXDwtZWt3GwXAarxbWhANgxixsbsGpL7o7GwnuwF63o+5Uvp+vR-qYQGrL-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-Rc4EXM0AA */
  id: 'machineXV5Pure',
  initial: 'initializing',
  
  
  context: ({ input }) => {
    // Si input est fourni et contient entityId, l'utiliser
    if (input && typeof input === 'object' && 'entityId' in input) {
      return input as FSMContext;
    }
    // Sinon créer un contexte par défaut
    return createMachineContext('bot-0', 'auto');
  },


  // Événements globaux (disponibles dans tous les états sauf initialisation)
  on: {
    SHIP_POSITION_UPDATE: {
      actions: 'updateShipPosition'
    },
    DRONE_POSITION_UPDATE: {
      actions: 'updateDronePosition'
    },
    // ✅ Phase 2: Grid sync event handler
    TILES_UPDATED: {
      actions: 'updateGridInfo'
    }
  },

  states: {
    /**
     * État INITIALIZING - Initialise le vaisseau et le drone
     */
    initializing: {
      entry: 'onInitializingEntry',
      exit: 'onInitializingExit',
      on: {
        SHIP_INITIALIZE_REQUEST: {
          actions: 'processShipInitRequest'
        },
        DRONE_INITIALIZE_REQUEST: {
          actions: 'processDroneInitRequest'
        },

      },
      always: {
        target: 'evaluating',
        guard: 'areAllEntitiesInitialized'
      }
    },
  /**
   * État EVALUATING - Évalue les conditions pour choisir la prochaine action
   */
    evaluating: {
      entry: ['assignEvaluationContext', 'onEvaluatingEntry'],
      exit: 'onEvaluatingExit',

      // Transitions manuelles (en cas d'événements explicites)
      on: {
        NEED_EXPLORING: { 
          target: 'exploring', 
          guard: 'canStartExploring', // ⚠️ Combine hasTilesAvailable + shouldExplore
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
              target: 'drone_docked',
              actions: 'assignDroneDockedContext' // MAJ contexte du drone à 'docked'
            }
          }
        },
        drone_docked: {
          entry: 'onDroneDockedEntry',
          exit: 'onDroneDockedExit',
          on: {
            DRONE_READY_FOR_REDEPLOY: {
              target: '#machineXV5Pure.evaluating',
              actions: 'assignDroneReadyContext' // Transition vers evaluating
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
            SHIP_REACHES_BASE: {
              target: '#machineXV5Pure.maintaining',
              actions: 'assignShipReachedBaseContext'
            }
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
     * Structure simplifiée : transitions automatiques directes depuis l'état parent
     */
    maintaining: {
      entry: 'onMaintainingEntry',
      exit: 'onMaintainingExit',
      initial: 'depositing',
      
      // Transitions automatiques vers les tâches de maintenance (depuis l'état parent)
      // ⚠️ IMPORTANT: Les actions assign sont RETIRÉES d'ici pour respecter le scénario Gherkin
      // Le dépôt/refuel/repair se fera lors de la réception des événements SHIP_DEPOSIT_COMPLETE, etc.
      always: [
        {
          target: '.depositing',
          guard: 'needsDeposit'
        },
        {
          target: '.refueling',
          guard: 'needsRefuel'
        },
        {
          target: '.repairing',
          guard: 'needsRepair'
        },
        {
          target: '#machineXV5Pure.evaluating'
        }
      ],
      
      states: {
        depositing: {
          entry: ['onShipDepositingEntry'],
          exit: 'onShipDepositingExit',
          on: {
            SHIP_DEPOSIT_COMPLETE: [
              {
                target: 'refueling',
                guard: 'needsRefuel',
                actions: 'assignShipDepositResourcesContext' // ✅ Dépôt UNIQUEMENT lors de l'événement
              },
              {
                target: 'repairing',
                guard: 'needsRepair',
                actions: 'assignShipDepositResourcesContext' // ✅ Dépôt UNIQUEMENT lors de l'événement
              },
              {
                target: '#machineXV5Pure.evaluating',
                actions: 'assignShipDepositResourcesContext' // ✅ Dépôt UNIQUEMENT lors de l'événement
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
      
      // Événement d'urgence redémarre l'évaluation des besoins de maintenance
      on: {
        EMERGENCY_STOP: {
          target: '.depositing',
          guard: 'needsDeposit'
        }
      }
    }
  }
});
