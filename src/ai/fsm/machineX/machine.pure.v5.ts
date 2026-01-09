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
import { assignDroneDeployingContext, assignDroneDestroyedContext, assignDroneDockedContext, assignDroneReadyContext, assignDroneReturningContext, assignDroneScanningContext, isDroneDestroyed, onDroneDeployingEntry, onDroneDeployingExit, onDroneDestroyedEntry, onDroneDestroyedExit, onDroneDockedEntry, onDroneDockedExit, onDroneReturningEntry, onDroneReturningExit, onDroneScanningEntry, onDroneScanningExit, onExploringEntry, onExploringExit, shouldDestroyDroneOnDanger } from './domains/exploration/index.ts';
// ✅ Phase 2: Import updateGridInfo for TILES_UPDATED event
// ✅ Phase 1 Migration: Import game config actions
// ✅ Phase 2 Migration: Import radius sync action
import { selectView, syncRadius, toggleClock, updateDronePosition, updateGameConfig, updateGridInfo, updateShipPosition } from './domains/global/index.ts';
import { processDroneInitRequest, processShipInitRequest } from './domains/initializing/actions.assign.ts';
import { initializeBotContextFromWorker, onInitializingEntry, onInitializingExit } from './domains/initializing/actions.effects.ts';
import { assignDroneDamagePenaltyContext, assignPurchaseDroneContext, assignShipAtFuelStationContext, assignShipAtRepairStationContext, assignShipDepositResourcesContext, assignShipMovingToFuelStationContext, assignShipMovingToRepairStationContext, assignShipRefuelContext, assignShipRelocatingContext, assignShipRepairContext } from './domains/maintenance/actions.assign.ts';
import { onGameOverEntry, onMaintainingEntry, onMaintainingExit, onPurchasingDroneEntry, onPurchasingDroneExit, onShipDepositingEntry, onShipDepositingExit, onShipRefuelingEntry, onShipRefuelingExit, onShipRelocatingEntry, onShipRelocatingExit, onShipRepairingEntry, onShipRepairingExit } from './domains/maintenance/actions.effects.ts';
import { canIncreaseRadius, hasResourcesForDrone, isAtMaxRadius, isMovingToFuelStation, isMovingToRepairStation, isShipOnBase, maintenanceComplete, needsDeposit, needsDronePurchase, needsRefuel, needsRepair, shouldUseFuelStation, shouldUseRepairStation } from './domains/maintenance/guards.pure.ts';

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
    // ✅ Phase 1 Migration: Game config actions
    updateGameConfig,
    toggleClock,
    selectView,
    // ✅ Phase 2 Migration: Radius sync action
    syncRadius,
    
    // Actions du domaine INITIALIZING
    initializeBotContextFromWorker, // ✅ NEW: Initialize context from worker for SharedWorker mode
    processDroneInitRequest,
    processShipInitRequest,
    onInitializingEntry,
    onInitializingExit,
    
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
    
    // 🆕 DRONE DESTRUCTION: Actions de destruction et achat de drone
    assignDroneDestroyedContext,
    onDroneDestroyedEntry,
    onDroneDestroyedExit,
    assignPurchaseDroneContext,
    assignDroneDamagePenaltyContext,
    onPurchasingDroneEntry,
    onPurchasingDroneExit,
    
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
    // 🆕 STATION SUPPORT: Actions for maintenance stations
    assignShipMovingToFuelStationContext,
    assignShipMovingToRepairStationContext,
    assignShipAtFuelStationContext,
    assignShipAtRepairStationContext,
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
    canIncreaseRadius, // 🆕 PHASE 2: Check if radius < 3
    
    // 🆕 DRONE DESTRUCTION: Guards
    shouldDestroyDroneOnDanger, // Check if drone scans danger tile
    isDroneDestroyed, // Check if drone is destroyed
    needsDronePurchase, // Check if drone needs to be purchased
    hasResourcesForDrone, // Check if bot can afford drone (>= 50 resources)
    
    // 🆕 STATION SUPPORT: Guards for maintenance stations
    shouldUseFuelStation, // Check if fuel station is closer than base
    shouldUseRepairStation, // Check if repair station is closer than base
    isMovingToFuelStation, // Check if ship is navigating to fuel station
    isMovingToRepairStation // Check if ship is navigating to repair station
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgA0A1AVgAUBXAJzAGIBlACQEkyB9MgeXuYBVnOAOTYBVMgBEAgrwCiAbQAMAXUSgADgHtY2AC7YNuVSAAeiAMwA2BWYB0ADgCcAFgcKAjACYzJdx4sAaEABPRABaDxs3AHYFOyiLPwsnKLczBwsAXwzAtCw8QlJKGlpxACUhGQ5uPgFhMSlZRRUkEE1tPQMjUwQzDwcSGw8PKKinZIsLEhJJwJCEcMiYqJI3Tyc3FbiosyycjBx8YnJqOn4AGRl6UQlpGXEmozbdfUMW7o9otxt+szsLOycvQ8dgUAWCYQi0Vi8USyVS6V2IFyBwKx2KAHFJABZSoAYSEADFmOjrg15MpHlpnp03ogvHYBit+goFPEHMMprNEE4bE4POs3ACHKkFM4SFFEcj8kcinRcWdOLiANJsXicdHoi4PFpPDqvUDvSYWQYOfrA8UJaJchA8vkCoUi5wMkiS-bSwonWhEZgyADqbHoMguuN42vUVL1XTpdjsXzc-2SdjMLgcy2tCyhcQSEzhaUy2SRbsOHuKpUk4mYIiu9AAmoJcWHWhGXlGeqyojZLG51ikSE4fAoSOnITEs7CUmlB668sW0WAbHhnqgADbYABeeCgDBY7GYghqkjOzAAWpVSjIAIoiS6hik65s0g3c8UOGwWMyeJIjKwrIfgnpRF4NjxFMwJeD+DjTiiMonAuuBLquG64FuZQVGwe4Hkep5sOeV43o2uotrSNrigowG9I4KZJmCcyWMM9giiQQzxE4kxOFB7pznBCHrputAEQ++omOYKTAS4lHxr4MbWr8yzfP83hRK44pDBxs6yjYYAAG4rhQqB6MhtCCDIdxsKhxkcCIpS4owkiBgJ7REU+CB+B4AzJqxTHbP8DjSf+qyAZ2yxmEpbkWKkKxqaiGnabp+l8cZpnngquLSHu6IOdSQmGoOnZjJMwyWI4flzG4rIDHEfbDLG2w7AWUrqbBsXLnpBlbol4hsDIBBkAqpTpZlkbESMMl9BEgIKE4DKxm46QWBK9VFtFTU6S18WGR1bD4mcwb8IIGV3uGjmPsJCB9l8wJlWVaTbIO1p+ICwEJMMVhQgtewzstNCaatrUJSZnVYpIe6yIIkj1uSzRHVlrZ+D4vIhQ43jhWYliAfdUxkdEqbnaaJD9O9hafTB33NX9G0A2wQMgzIYMQ3IbhQ02x3ZRCr79BsgoqUm7IePdSSvq9fyDjE-bsYtxMlvOZPre1lPU4IoPg7i8geEzhEne8+PuflXlFb5djWmVblBSQaQfsKnmEw1X3S79sv8YdzMw8RfgbHlnmFT5JWIKsfim6x-KArN-ZRST0vGGoy4aFQm42BAVAGGAbAQGAUcaEEfHmWeMiSDZlyqswWpOxrrM9ACvIAkkqxV2YrIybEdg2KKgF2JdwquNbS3h5pkfR7HyHx4n+Ap2n0eZxtnCqpIpTojIvBsASnAiII9wl4JsOCnG6zlSkfQuGY92xgMrjvqM1jJlsYdS736cD1AQ9J2wsDoKguDwYZ2dsLZ1apYIxlr3VhvYirgeQsgUMCVMSM-gbHus4dmddg7WFjEka+XEwB9xjnHBOT8X5vw-ihcoFkf4Bj-gAhmQCWatlAc3FkkClK-HCn+WiZVjT-AvhRYYrE0ExUwffR+I9U6wB0InIIkAShEMqOIG8pQRAhlqGwPOSpBCcF9BccQc9AGUioa7LekQd7LD3vAw+-4+iBSNN+AE2wpo8Kanw7Bw9k40B0NQAhEi0LnjzowAuAAhOykNtEu2cvGVikRpjvnZNCXyTgZKsLfCCWIfRfKsPzB9aCN8MF3wcU-CAGh0AAGtxFf08eIGsi9OClBwncGQvVOA1kGk5U6HxYz6LKoYzwxjYmgniSyNuppYyglSUTdJXF0AaGXMuMA6A2q0BkDiWetNcRlPoGqMgDTNZ0lmhdSaGwLCpmTNYI2FpBg+A+MjMYzFbHfTGRMqZMyFT+gJNeM4bBfQz33PtdZZchjuEGDs6Y+ynCHP8tmYCpypqzQgXEK584bmTOmXHWAOA1BsGQBoLSm42A6A0Fi7AkztysCqV4gubyaxcBBl81sqwvimlpXSulUR7puTIh4awsRXquBCi6CWIyNJwruYi5FqL0WYuxbi-FTBCWePzlcc4AT7w6Ocs07Z6wAXWOBaVKaLL0i+Xmj4YU3YYU2H5QiweSLsAorRRi5CWKcV6AlTuIlMrC5akZoEoaSrWUqt2YCjVdIgU8nSFMaaUKWTizSZxPl4z4VtRsOay1IqbVivtXQSV7BpXeNlUXVWlCgmnSmIyBIKQOllX7CYuYPywGWHcMmFYQK6oRsatc6NAqzVCqtaKu1eLU2OozQXOVcgzC5o9fmqYNhpjDD9sKSaZt7plSbrEOulheZmynDyyNsETWxvjcK61UBbXip7VK3OzqB1OGHY0943ZvVqoOeWxAywm7RHAskLwSl-hGq3YKi1bAv2GTTWwBU5Yqn0GXtZS4lLiIdLIj8U0YxUZAsZaYzwAwvCpFZQyVwHwu6S1GS201D8d1-q3ABoDnVzygasiregFD3WXs2SsP5qq9nqvvQgEETd5ofBcKCU5HhP34e3UK4jBL2BkZA2B6jcg1Z0Y2QgCYF1Uz9mcCybYI1TG+EiH0AZZVXCzRw7yzdgnv0opExRyTUiakXFkFohVear3hSYz61j1oaEJDNo+qIDJUYNuGRu5ttyCNxqFc41xfEAN9quKS8litIPBJiBEauYxpht0Ukhitk1bBfmmOsYU2Y7ACcC0Jn9oWqBuIiyezNbA-H2XXoqppnwnO3vrUbX4PJkxctNCFIFoIjVoDwDoVAi5DJzJkAs+syzVlxdHR8cdxaViJDrobf83hVjyTmn08qfWhu4EG8Nh+NBo6vxmclRUaV9pbU4FiXq895XQxHd0cYER3ACgOUkNuRy4jjr5Ne0EoxJi+Ztj3fru2dtx0O3kh2p3Up7RJPia71n5Bursw97kMJm7XtSEC97fMQW-GbrltyQK-jKW2wNsHg9U6EX-Y66RXAeAL3hzdxodX7OIHCkBVMMRG772SDJKar5+R10ArNPZwwyeg-2-HNOzYaeErp9URnV3mdI4vXJjntgue9L6WMdL5hei2GvdMOu4CRgS72wQ6X1OSO05qYry7CPbvSbV2XJ7GPXvY6mrjituXFg41y-0Am5uKcHbTkN++omqlkGBpUpniPpvdH+O7bsMZ4xm1Rg4GSaQLqi-1SMWMBX11NvnCDi34Ow-YAjxV6PzBY-K-j8j+79H5OeCbogpGsQyr4z1z0YYiXVXAm62c4PUuaBqHD+F3tNSY8O5V872Trv0cvdWG9r3Rsarjrod1+aLhDVF9tjYUvIebA0AAGYUDAKuOX6aZBPKDLP+PrPUfyZ5uOrwZsWPvgZDJd8EQUjJNZFYjoRH0tzPwvyvxt2PTvxeTjyd0b2dmfyTwGBTxQXTzSFGn6EGAmB3zGEoiGSBxviP1HzAHP0v0nygOeQfydxkxR2bzd2Xyx1BDX1MXAmbksBIB00HHxhALjjUGoCwFQG0BtRwXwHcQsjICox-jxHrydyfzoKX0x1Xw+38hCjIiYjy05QUj8B4MHj4KoAEKEP3RELoC-gkOsikKoMaHgNLlbHoMUM92UM1QmErm4ymEmFFjqgLFwA0CESMAILnAX1bFCBGG+F-C5lbjSCGGtHmjIi4whS2VBHjCNUXD0BXF4mQkCOIiYhkjbh5BSAZEmhYiRjcCNRljakyOcjNndhiE-HZUQRol9hYjCR8CTHcGQXwO7gyXsQyNoPVxiVMW-DCXfHmisHfF-FKO6IfmMNHnTgnigAqNOj9gbmmEGHrWiBBEtH433x7kyX7myRHjwXfk3AWMT0sGbgSFjC60BDch72Fx5FS3CmdDGF622K6KyUp0cVHmEVEUgBON9hCi+BAlaI+H0ymjgTOKNBWHeziBugmPeKmM+NKwIT+IQFSFEiBLrhBKU2W1olFFsGxw7kxI6Nw14XhIEWTlyQKV+N6LLkFBjH0VFFZHjABCmgaLbCRl5EGT2XcHfVZEKxjWOJpNbHfG+HpTFNTHX0YwSF8lAT7FjHDT82L2NWMzbR-Q7STS7UmRROfXiWWGiFGKTBBDcHulWyGI-EHyJyTH5NbUI2ExVPmKFKg3cAXWcCSQQ0SX6Iy1TE7FFGeldLa25UbQP2I2CxKzABcTK0FKbzk2iFGEiHSFZFZV+FT2YU2TGDfDaPWHoTN1eK4iIORMdMqOSFsHFFWAWwmCW35g-FaRQTfW4NzI0nzPLyO1lhRNAmNFLM5kW1iDgSAmvTYjxkHEmh0KmJl0ch6OjLLg4PWHsCZGlOhFGH5zkh1UmDbnjC8xKIbNgibMHjHwnwnIQOb0mEY35BBISxSzZIohpWKO8F6HexeKDOBx2zL13JIPAKjMPLk0Aj7Dfz6B8ASGSFVRkhfGAiUg4ImBlMsBHJsD0IMMxWMLbL7EZBumDnYW-wGOFDfHWAKJ8A4OhS3O+igFQGQGTnRTACoDbI-AGBqL8DqMmjZN2VsD6FmiRgmHCVSCyCyCAA */
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
    },
    // ✅ Phase 1 Migration: Game config event handlers
    GAME_CONFIG_UPDATE: {
      actions: 'updateGameConfig'
    },
    CLOCK_TOGGLE: {
      actions: 'toggleClock'
    },
    VIEW_SELECT: {
      actions: 'selectView'
    },
    // ✅ Phase 2 Migration: Radius sync event handler
    RADIUS_SYNC: {
      actions: 'syncRadius'
    }
  },

  states: {
    /**
     * État INITIALIZING - Initialise le vaisseau et le drone
     */
    initializing: {
      entry: ['initializeBotContextFromWorker', 'onInitializingEntry'],
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
        // 🆕 PRIORITY 0: DRONE PURCHASE (drone destroyed, needs replacement)
        NEED_DRONE_PURCHASE: {
          target: 'maintaining.purchasing_drone',
          guard: 'needsDronePurchase'
        },
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
        NEED_MAINTENANCE: [
          {
            // 🆕 STATION SUPPORT: Priority 1 - Use fuel station if closer
            target: 'collecting.ship_moving_to_tile',
            guard: 'shouldUseFuelStation',
            actions: 'assignShipMovingToFuelStationContext'
          },
          {
            // 🆕 STATION SUPPORT: Priority 2 - Use repair station if closer
            target: 'collecting.ship_moving_to_tile',
            guard: 'shouldUseRepairStation',
            actions: 'assignShipMovingToRepairStationContext'
          },
          {
            // Default: Return to base for maintenance
            target: 'maintaining',
            guard: 'shouldMaintain'
          }
        ]
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
              DRONE_HAS_SCANNED: [
                {
                  // 🆕 Priority 1: Danger tile → drone destroyed
                  target: 'drone_destroyed',
                  guard: 'shouldDestroyDroneOnDanger',
                  actions: 'assignDroneDestroyedContext'
                },
                {
                  // Priority 2: Normal scan → drone returning
                  target: 'drone_returning',
                  actions: 'assignDroneReturningContext'
                }
              ]
          }
        },
        
        /**
         * 🆕 DRONE DESTRUCTION: État drone_destroyed
         * 
         * Entré lorsque le drone explore une tuile danger.
         * Le drone est marqué détruit (isDestroyed=true, isActive=false).
         * ✅ Transition après 800ms pour visibilité UI (via DRONE_DESTRUCTION_ACKNOWLEDGED).
         */
        drone_destroyed: {
          entry: 'onDroneDestroyedEntry',
          exit: 'onDroneDestroyedExit',
          on: {
            DRONE_DESTRUCTION_ACKNOWLEDGED: {
              target: '#machineXV5Pure.evaluating'
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
                // 🆕 STATION SUPPORT: Priority 1 - Arrived at fuel station
                target: '#machineXV5Pure.maintaining.refueling',
                guard: 'isMovingToFuelStation',
                actions: 'assignShipAtFuelStationContext'
              },
              {
                // 🆕 STATION SUPPORT: Priority 2 - Arrived at repair station
                target: '#machineXV5Pure.maintaining.repairing',
                guard: 'isMovingToRepairStation',
                actions: 'assignShipAtRepairStationContext'
              },
              {
                // Priority 3: Ship hits danger tile → apply damage, then collect
                target: 'ship_collecting',
                guard: 'shouldApplyDangerDamage',
                actions: ['assignDangerDamageContext', 'assignShipCollectingContext']
              },
              {
                // Priority 4: Normal collection (no danger)
                target: 'ship_collecting',
                guard: 'canCollectTile',
                actions: 'assignShipCollectingContext'
              },
              {
                // Priority 5: Cannot collect → return to evaluating
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
        },
        
        /**
         * 🆕 DRONE DESTRUCTION: État purchasing_drone
         * 
         * Entré lorsque le drone est détruit et doit être remplacé.
         * 
         * Coût: 50 ressources du score
         * Pénalité: Si ressources < 50, +20% dégâts au vaisseau
         * 
         * Transition via événement DRONE_PURCHASE_COMPLETE
         */
        purchasing_drone: {
          entry: 'onPurchasingDroneEntry',
          exit: 'onPurchasingDroneExit',
          on: {
            DRONE_PURCHASE_COMPLETE: [
              {
                // Priority 1: Has resources → purchase with cost
                target: '#machineXV5Pure.evaluating',
                guard: 'hasResourcesForDrone',
                actions: 'assignPurchaseDroneContext'
              },
              {
                // Priority 2: No resources → purchase with damage penalty
                target: '#machineXV5Pure.evaluating',
                actions: 'assignDroneDamagePenaltyContext'
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
