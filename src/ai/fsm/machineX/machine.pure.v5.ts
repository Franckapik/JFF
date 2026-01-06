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
import { assignDangerDamageContext, assignShipCollectingContext, assignShipLoadResourcesContext, assignShipMovingToTileContext, assignShipNextWaypointContext, assignShipReachedBaseContext, assignShipReturningContext, onCollectingEntry, onCollectingExit, onShipCollectingEntry, onShipCollectingExit, onShipMovingToTileEntry, onShipMovingToTileExit, onShipReturningEntry, onShipReturningExit } from './domains/collection/index.ts';
import { assignEvaluationContext, assignShipRelocatedContext, assignShipRelocationContext, onEvaluatingEntry, onEvaluatingExit } from './domains/evaluation/index.ts';
// ✅ Phase 1: ALL guards from guards.pure.ts (no store dependencies)
import { allLocalTilesExplored, canStartExploring, canStartExploringWithValidTarget, hasTilesAvailable, hasUnexploredTilesInRadius, isStuckInEvaluating, shouldCollect, shouldExplore, shouldMaintain, shouldRelocateShip } from './domains/evaluation/guards.pure.ts';
import { assignDroneDeployingContext, assignDroneDockedContext, assignDroneReadyContext, assignDroneReturningContext, assignDroneScanningContext, onDroneDeployingEntry, onDroneDeployingExit, onDroneDockedEntry, onDroneDockedExit, onDroneReturningEntry, onDroneReturningExit, onDroneScanningEntry, onDroneScanningExit, onExploringEntry, onExploringExit } from './domains/exploration/index.ts';
// ✅ Phase 2: Import updateGridInfo for TILES_UPDATED event
import { updateDronePosition, updateGridInfo, updateShipPosition } from './domains/global/index.ts';
import { processDroneInitRequest, processShipInitRequest } from './domains/initializing/actions.assign.ts';
import { onInitializingEntry, onInitializingExit } from './domains/initializing/actions.effects.ts';
import { assignShipDepositResourcesContext, assignShipRefuelContext, assignShipRelocatingContext, assignShipRepairContext } from './domains/maintenance/actions.assign.ts';
import { onGameOverEntry, onMaintainingEntry, onMaintainingExit, onShipDepositingEntry, onShipDepositingExit, onShipRefuelingEntry, onShipRefuelingExit, onShipRelocatingEntry, onShipRelocatingExit, onShipRepairingEntry, onShipRepairingExit } from './domains/maintenance/actions.effects.ts';
import { canIncreaseRadius, isAtMaxRadius, isShipOnBase, maintenanceComplete, needsDeposit, needsRefuel, needsRepair } from './domains/maintenance/guards.pure.ts';

// ✅ Phase 1: Pure guards from collection domain
import { canCollectTile, hasMoreCollectibleTiles, hasMoreWaypoints, isAtFinalWaypoint, isVehicleOverloaded, noMoreCollectibleTiles, shouldApplyDangerDamage } from './domains/collection/guards.pure.ts';
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
    assignShipRelocationContext, // ✅ NEW: Ship relocation to explore new area
    assignShipRelocatedContext, // ✅ NEW: Update ship position after relocation
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
    assignShipNextWaypointContext, // 🛤️ PATHFINDING: Advance to next waypoint
    assignShipCollectingContext,
    assignShipReturningContext,
    assignShipReachedBaseContext,
    assignShipLoadResourcesContext,
    assignDangerDamageContext, // 🆕 NEW: Apply +10% damage on danger tile
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
    assignShipRelocatingContext, // 🆕 PHASE 1: Marque lastAction pour éviter boucle
    onMaintainingEntry,
    onMaintainingExit,
    onShipDepositingEntry,
    onShipDepositingExit,
    onShipRepairingEntry,
    onShipRepairingExit,
    onShipRefuelingEntry,
    onShipRefuelingExit,
    onShipRelocatingEntry, // 🆕 NEW: Relocating entry effect
    onShipRelocatingExit,  // 🆕 NEW: Relocating exit effect
    onGameOverEntry, // 🆕 PHASE 2: Game over entry effect

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
    hasUnexploredTilesInRadius, // 🆕 Bug #7 Fix: Guarantees assignDroneDeployingContext will succeed
    canStartExploringWithValidTarget, // 🆕 Bug #7 Fix: Combined guard (canStartExploring + hasUnexploredTilesInRadius)
    shouldExplore,
    shouldMaintain,
    shouldCollect, // ✅ Pure: uses context.gridInfo.tiles
    allLocalTilesExplored, // ✅ NEW: Check if all tiles in radius are explored
    shouldRelocateShip, // ✅ NEW: Ship must relocate to explore new area
    isStuckInEvaluating, // 🆕 FALLBACK: Force relocation when no action possible
    
    // Guards du domaine COLLECTION (pure)
    canCollectTile,
    isVehicleOverloaded,
    hasMoreCollectibleTiles, // ✅ Pure: uses context.memory.knownTiles
    noMoreCollectibleTiles, // ✅ Inverse de hasMoreCollectibleTiles
    shouldApplyDangerDamage, // 🆕 NEW: Check if ship hits danger tile
    // 🛤️ PATHFINDING guards
    hasMoreWaypoints, // Check if ship has more tiles to traverse
    isAtFinalWaypoint, // Check if ship reached target tile
    
    // Guards du domaine MAINTENANCE (pure)
    needsDeposit,
    needsRefuel,
    needsRepair,
    isShipOnBase,
    maintenanceComplete,
    isAtMaxRadius, // 🆕 PHASE 2: Check if radius >= 3
    canIncreaseRadius // 🆕 PHASE 2: Check if radius < 3
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

      // 🆕 FALLBACK: Si aucune action n'est possible, force relocation
      // Ceci évite les blocages dus aux race conditions entre guards
      always: {
        target: 'maintaining.relocating',
        guard: 'isStuckInEvaluating'
      },

      // Transitions manuelles (en cas d'événements explicites)
      on: {
        // 🆕 PRIORITY 1: RELOCATING (ship stuck - all local tiles explored)
        NEED_RELOCATING: {
          target: 'maintaining.relocating',
          guard: 'shouldRelocateShip'
          // 🚧 PHASE 1: Actions commentées - décision gameplay à prendre (relocation vs augmentation radius)
          // actions: 'assignShipRelocationContext'
        },
        NEED_EXPLORING: { 
          target: 'exploring', 
          // ✅ Unified: canStartExploring now guarantees valid targets via TileStore
          guard: 'canStartExploring',
          actions: 'assignDroneDeployingContext' // MAJ contexte ici (assign)
        },
        NEED_COLLECTING: { 
          target: 'collecting', 
          guard: 'shouldCollect',
          actions: 'assignShipMovingToTileContext' // MAJ contexte ici (assign)
        },
        NEED_MAINTENANCE: { 
          target: 'maintaining', 
          guard: 'shouldMaintain'
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
            },
            // 🆕 Recovery: Si pas de cible valide → DIRECTEMENT à relocating
            // C'est la condition de fin de cycle: aucune tuile explorable dans le rayon
            // ✅ FIX: Removed assignShipRelocatingContext - déjà dans entry de relocating
            NO_TARGET_FOUND: {
              target: '#machineXV5Pure.maintaining.relocating'
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
            // 🛤️ PATHFINDING: Handle intermediate waypoints
            SHIP_REACHES_WAYPOINT: {
              // Self-transition: advance to next waypoint, stay in same state
              target: 'ship_moving_to_tile',
              guard: 'hasMoreWaypoints',
              actions: 'assignShipNextWaypointContext'
            },
            SHIP_REACHES_TILE: [
              {
                // Priority 1: Ship hits danger tile → apply damage, then collect
                target: 'ship_collecting',
                guard: 'shouldApplyDangerDamage',
                actions: ['assignDangerDamageContext', 'assignShipCollectingContext']
              },
              {
                // Priority 2: Normal collection (no danger)
                target: 'ship_collecting',
                guard: 'canCollectTile',
                actions: 'assignShipCollectingContext'
              },
              {
                // Priority 3: Cannot collect → return to evaluating
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
                // Priority 1: Vehicle overloaded → must return to base
                target: 'ship_returning',
                guard: 'isVehicleOverloaded',
                actions: ['assignShipLoadResourcesContext', 'assignShipReturningContext']
              },
              {
                // Priority 2: No more collectible tiles → go back to evaluating
                // ✅ FIX: Changed from ship_returning to evaluating when no more tiles
                target: '#machineXV5Pure.evaluating',
                guard: 'noMoreCollectibleTiles',
                actions: 'assignShipLoadResourcesContext'
              },
              {
                // Priority 3: More tiles available → continue collecting
                target: 'ship_moving_to_tile',
                actions: 'assignShipLoadResourcesContext'
              }
            ],
            RESOURCE_DEPLETED: '#machineXV5Pure.evaluating'
          }
        },
        
        ship_returning: {
          entry: 'onShipReturningEntry',
          exit: 'onShipReturningExit',
          on: {
            // 🛤️ PATHFINDING: Waypoint progression during return journey
            SHIP_REACHES_WAYPOINT: {
              guard: 'hasMoreWaypoints',
              actions: 'assignShipNextWaypointContext'
              // Self-transition: stay in ship_returning, advance to next waypoint
            },
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
     * État MAINTAINING - Gère la maintenance (dépôt, réparation, carburant, relocalisation)
     * 🆕 Architecture event-driven : transitions via événements explicites
     * 
     * Sous-états:
     * - relocating: Ship se déplace vers nouvelle zone d'exploration
     * - depositing: Dépose les ressources collectées
     * - refueling: Ravitaillement en carburant
     * - repairing: Réparation des dommages
     */
    maintaining: {
      entry: 'onMaintainingEntry',
      exit: 'onMaintainingExit',
      initial: 'depositing',
      
      states: {
        /**
         * 🆕 Sous-état RELOCATING - Ship bloqué (toutes tuiles locales explorées)
         * Entré via NEED_RELOCATING depuis evaluating
         * 
         * ✅ PHASE 2: Radius expansion with penalties
         * - If radius < 3: Increment radius, apply penalties, return to evaluating
         * - If radius >= 3: Transition to game_over (final state)
         * 
         * ✅ OPTION A: Uses RELOCATING_COMPLETE event for UI visibility (500ms delay)
         */
        relocating: {
          entry: ['assignShipRelocatingContext', 'onShipRelocatingEntry'],
          exit: 'onShipRelocatingExit',
          // Wait for RELOCATING_COMPLETE event (sent by tracker after delay)
          on: {
            RELOCATING_COMPLETE: [
              {
                // Priority 1: Max radius reached → GAME_OVER (final state)
                target: '#machineXV5Pure.game_over',
                guard: 'isAtMaxRadius'
              },
              {
                // Priority 2: Can increase radius → return to evaluating
                target: '#machineXV5Pure.evaluating',
                guard: 'canIncreaseRadius'
              }
            ]
          }
        },
        
        depositing: {
          entry: ['onShipDepositingEntry'],
          exit: 'onShipDepositingExit',
          on: {
            SHIP_DEPOSIT_COMPLETE: [
              {
                target: 'refueling',
                guard: 'needsRefuel',
                actions: 'assignShipDepositResourcesContext'
              },
              {
                target: 'repairing',
                guard: 'needsRepair',
                actions: 'assignShipDepositResourcesContext'
              },
              {
                target: '#machineXV5Pure.evaluating',
                actions: 'assignShipDepositResourcesContext'
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
                guard: 'needsDeposit',
                actions: 'assignShipRefuelContext'
              },
              {
                target: 'repairing',
                guard: 'needsRepair',
                actions: 'assignShipRefuelContext'
              },
              {
                target: '#machineXV5Pure.evaluating',
                actions: 'assignShipRefuelContext'
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
    },

    /**
     * 🆕 PHASE 2: État GAME_OVER - Fin de partie pour ce bot
     * 
     * Atteint lorsque le bot a:
     * - Exploré toutes les tuiles dans le radius maximum (3)
     * - Collecté toutes les ressources disponibles
     * - Ne peut plus s'étendre (radius >= 3)
     * 
     * C'est un état final - le bot ne peut plus agir.
     */
    game_over: {
      type: 'final',
      entry: 'onGameOverEntry'
    }
  }
});
