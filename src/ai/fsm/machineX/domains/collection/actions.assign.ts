/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * ✅ Phase 5: Pure actions - uses context.gridInfo + tiles domain helpers
 * 
 * MIGRATION COMPLETE: useTileStore has been fully removed!
 * All tile mutations are now done via context.gridInfo and tiles domain helpers.
 * The FSM context is the single source of truth for tiles.
 */

import { assign } from 'xstate';

import { findPath, findTilesInRadius, gridToWorld, selectRandomTile } from '../../../../../core/spatial/index.ts';
import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { GridCoordinate, TileMap } from '../../../../../types/index.ts';
import type { VehicleVisualState } from '../../../../../types/vehicle.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';
import {
    collectResourcesFromTile,
    findTileWithResources,
    getTileFromContext,
    updateTileInContext,
} from '../tiles/helpers.pure.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Helper pour synchroniser la position des drones docked avec le vaisseau
 * Appelé après chaque changement de position du vaisseau
 */
function syncDockedDronesPosition(
  context: FSMContext,
  newShipCoord: string
): Partial<FSMContext> {
  const drones = context.droneFleet?.drones;
  if (!drones) return {};

  // Construire un nouvel objet drones avec les positions mises à jour
  const updatedDrones = { ...drones };
  let hasDockedDrone = false;

  for (const droneType of Object.keys(drones) as Array<keyof typeof drones>) {
    const drone = drones[droneType];
    if (drone?.visualState === 'docked') {
      updatedDrones[droneType] = {
        ...drone,
        coord: newShipCoord as `${number},${number}`,
      };
      hasDockedDrone = true;
    }
  }

  // Ne retourner une mise à jour que si un drone docked a été trouvé
  if (hasDockedDrone) {
    return {
      droneFleet: {
        ...context.droneFleet,
        drones: updatedDrones,
      },
    };
  }

  return {};
}

/**
 * Action assign pour le démarrage de la collecte
 * ✅ Phase 4: Uses context.gridInfo.tiles instead of useTileStore.getState()
 */
export const assignShipMovingToTileContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignShipMovingToTileContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    contextKeys: Object.keys(context || {})
  });
  
  // Vérification de sécurité pour l'événement
  if (!event || !event.type) {
    return {}; // Préserver le contexte
  }
  
  
  if (event.type === 'NEED_COLLECTING') {
    // ✅ Phase 5: Priorité aux tuiles explorées (memory.knownTiles) avec ressources
    const tiles = context.gridInfo?.tiles || {};
    const shipCoord = context.vehicle?.coord;
    const knownTiles = context.memory?.knownTiles || [];
    
    // 1️⃣ PRIORITÉ: Chercher une tuile explorée avec ressources non collectées
    const knownTilesWithResources = knownTiles.filter(tile => 
      tile?.collectable &&  // ✅ Check collectable property
      tile?.resources && 
      tile.resources.total > 0 && 
      !tile.collected &&
      tile.hasResources
    );
    
    let targetVehicleTile = null;
    
    if (knownTilesWithResources.length > 0) {
      // Sélectionner la tuile avec le plus de ressources
      targetVehicleTile = knownTilesWithResources.reduce((best, current) => 
        (current.resources?.total || 0) > (best.resources?.total || 0) ? current : best
      );
      
      fsmLogger.info(`🎯 [${context.entityId}] Targeting explored tile with resources:`, {
        coord: targetVehicleTile.position?.coord,
        resources: targetVehicleTile.resources,
        totalKnownTiles: knownTiles.length,
        tilesWithResources: knownTilesWithResources.length
      });
    } else {
      // 2️⃣ FALLBACK: Si aucune tuile connue avec ressources, chercher dans un rayon aléatoire
      // ⚠️ CRITICAL: Must only select EXPLORED tiles to avoid re-entering non-explored tiles
      const collectingRadius = context.config?.collectingRadius ?? 3;
      const candidateTiles = shipCoord ? findTilesInRadius(shipCoord, collectingRadius, tiles) : [];
      
      // Filter for explored tiles with resources only
      const exploredTiles = candidateTiles.filter(tile => 
        tile?.collectable &&  // ✅ Check collectable property
        tile?.explored === true && 
        !tile?.collected &&
        tile?.hasResources === true
      );
      
      // Only select tiles with actual resources (no fallback to empty tiles)
      const tilesWithResources = exploredTiles.filter(tile => 
        tile?.resources && tile.resources.total > 0
      );
      
      targetVehicleTile = tilesWithResources.length > 0 
        ? selectRandomTile(tilesWithResources)
        : null;
      
      fsmLogger.info(`🔀 [${context.entityId}] No known collectible tiles, using explored tile fallback:`, {
        coord: targetVehicleTile?.position?.coord,
        candidatesChecked: candidateTiles.length,
        exploredTiles: exploredTiles.length,
        withResources: tilesWithResources.length
      });
    }
    
    if (!targetVehicleTile) {
      return {};
    }
    const targetGridCoord = targetVehicleTile.position.coord;
    const consistentTargetPos = targetVehicleTile.position;
    fsmLogger.info(`🚢 [${context.entityId}] Setting ship target for collection:`, {
      targetPosition: consistentTargetPos,
      targetGridCoord,
      currentCoord: shipCoord,
      coordinateCheck: {
        original: consistentTargetPos,
        recalculated: consistentTargetPos,
        areConsistent: true
      }
    });
    // Mise à jour complète du contexte en une seule fois
    const targetVehicleTileObj = targetVehicleTile;
    
    // ========================================================================
    // 🛤️ PATHFINDING: Calculate path from ship to target tile
    // ========================================================================
    const path = shipCoord 
      ? findPath(shipCoord, targetGridCoord, tiles as TileMap) 
      : [];
    
    // If no path found, ship cannot reach target (blocked by obstacles)
    if (path.length === 0) {
      fsmLogger.warn(`⚠️ [${context.entityId}] No walkable path to ${targetGridCoord}!`);
      console.log(`🚫 [PATHFINDING] No path from ${shipCoord} to ${targetGridCoord} - blocked?`);
      return {};
    }
    
    // ✅ Calculate fuel based on PATH LENGTH (number of tiles traversed)
    // Fuel consumption = 1% per tile traversed (path includes start, so -1)
    const pathSteps = Math.max(0, path.length - 1); // Number of tiles to traverse
    const FUEL_PER_TILE = 1; // 🔧 SPEC: 1% fuel per tile (collection.feature line 56)
    const fuelConsumption = Math.max(1, pathSteps * FUEL_PER_TILE);
    const currentFuel = context.vehicle?.fuel || 100;
    const newFuel = Math.max(0, currentFuel - fuelConsumption);
    
    fsmLogger.info(`🛤️ [${context.entityId}] Pathfinding result:`, {
      pathLength: path.length,
      pathSteps,
      path: path.slice(0, 5).join(' → ') + (path.length > 5 ? ' ...' : ''),
      fuelConsumption,
      fuelRemaining: newFuel
    });
    
    console.log(`🛤️ [PATHFINDING] Path: ${path.join(' → ')}`);
    console.log(`⛽ [PATHFINDING] Fuel: ${currentFuel} - ${fuelConsumption} = ${newFuel} (${pathSteps} tiles × ${FUEL_PER_TILE}/tile)`);
    
    const updatedContext = {
      vehicle: {
        ...context.vehicle,
        coord: shipCoord || '0,0',
        targetVehicleTile: targetVehicleTileObj, // Utiliser l'objet Tile complet
        isMoving: true, // ✅ IMPORTANT: Le vaisseau est en mouvement vers sa cible
        progress: 0, // Reset du progrès
        currentSpeed: context.vehicle?.maxSpeed || 1,
        visualState: 'moving_to_tile' as VehicleVisualState,
        fuel: newFuel, // ✅ Déduire le fuel consommé
        // 🛤️ PATHFINDING: Store path in context
        currentPath: path,
        pathIndex: 0
      },
      lastAction: 'shipMovingToTile_success',
      fsmState: 'collecting_ship_moving_to_tile', // 🟢 Mise à jour de l'état global FSM
    };
    
    fsmLogger.info(`✅ [${context.entityId}] Ship movement setup result:`, {
      hasVehicle: !!updatedContext.vehicle,
      targetVehicleTile: updatedContext.vehicle?.targetVehicleTile,
      isMoving: updatedContext.vehicle?.isMoving,
      pathLength: path.length,
      fuelConsumed: fuelConsumption,
      fuelRemaining: newFuel
    });
    
    console.log(`🚢 [SHIP MOVING] Ship moving from ${context.vehicle?.coord} to ${targetGridCoord} via ${path.length} tiles`);
    console.log(`🏠 [SHIP MOVING] Original base coord is: ${context.vehicle?.baseCoord} (this should stay constant!)`);
    console.log(`🚢 [SHIP MOVING] ⚠️  The ship is leaving its starting position to collect resources!`);
    
    return updatedContext;
  }
  
  // Pour les autres événements, ne pas modifier le contexte
  return {};
});

/**
 * 🛤️ PATHFINDING: Action assign pour avancer au prochain waypoint du chemin
 * Appelée quand SHIP_REACHES_WAYPOINT est émis par le tracker
 * 
 * - Incrémente pathIndex
 * - Met à jour vehicle.coord vers la tuile actuelle du path
 * - Applique les dégâts si la tuile est de type danger (Option B)
 */
export const assignShipNextWaypointContext = createAssignAction(({ context }) => {
  if (!context.vehicle) return {};
  
  const currentPath = context.vehicle.currentPath || [];
  const currentIndex = context.vehicle.pathIndex || 0;
  const nextIndex = currentIndex + 1;
  
  // Safety check: don't exceed path bounds
  if (nextIndex >= currentPath.length) {
    fsmLogger.warn(`⚠️ [${context.entityId}] pathIndex ${nextIndex} exceeds path length ${currentPath.length}`);
    return {};
  }
  
  const newCoord = currentPath[nextIndex] as GridCoordinate;
  
  // Check if this tile is a danger tile (Option B: apply damage per traversal)
  const tiles = context.gridInfo?.tiles || {};
  const tile = tiles[newCoord];
  let damageIncrement = 0;
  
  if (tile?.type === 'danger' || tile?.isDynamicDanger) {
    damageIncrement = 10; // +10% damage per danger tile traversal
    fsmLogger.warn(`💥 [${context.entityId}] Ship traversing danger tile at ${newCoord}! +${damageIncrement}% damage`);
    console.log(`💥 [PATHFINDING] Danger tile at ${newCoord}! Damage +${damageIncrement}%`);
  }
  
  const currentDamage = context.vehicle.damage || 0;
  const newDamage = Math.min(100, currentDamage + damageIncrement);
  
  fsmLogger.info(`🛤️ [${context.entityId}] Waypoint reached:`, {
    waypointIndex: nextIndex,
    totalWaypoints: currentPath.length,
    newCoord,
    remainingSteps: currentPath.length - nextIndex - 1,
    damage: damageIncrement > 0 ? `${currentDamage}% → ${newDamage}%` : 'none'
  });
  
  console.log(`🛤️ [PATHFINDING] Waypoint ${nextIndex}/${currentPath.length - 1}: ${newCoord}`);
  
  return {
    vehicle: {
      ...context.vehicle,
      coord: newCoord,
      pathIndex: nextIndex,
      damage: newDamage
    }
  };
});

/**
 * Action assign pour appliquer les dégâts quand le ship atteint une tuile danger
 * Ajoute +10% damage au vehicle.damage (max 100%)
 */
export const assignDangerDamageContext = createAssignAction(({ context }) => {
  if (!context.vehicle) return {};
  
  const targetTile = context.vehicle.targetVehicleTile;
  const dangerType = targetTile?.isDynamicDanger ? 'dynamic' : 'static';
  const currentDamage = context.vehicle.damage || 0;
  const newDamage = Math.min(100, currentDamage + 10);
  
  fsmLogger.warn(`💥 [${context.entityId}] Ship hit ${dangerType} danger at ${targetTile?.position?.coord}! Damage: ${currentDamage}% → ${newDamage}%`);
  
  return {
    vehicle: {
      ...context.vehicle,
      damage: newDamage
    }
  };
});

/**
 * Action assign pour mettre à jour l'état du vaisseau lors de l'arrivée sur la tuile
 */
export const assignShipCollectingContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignShipCollectingContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentVehicleState: context.vehicle?.isMoving
  });
  
  if (!context.vehicle) {
    return {};
  }
  
  const targetTileCoord = context.vehicle.targetVehicleTile?.position?.coord;
  const arrivedCoord = targetTileCoord || context.vehicle.coord;

  return {
    vehicle: {
      ...context.vehicle,
      coord: arrivedCoord,
      isMoving: false, // ✅ IMPORTANT: Le vaisseau s'arrête pour collecter
      progress: 100, // Arrivé à destination
      currentSpeed: 0,
      visualState: 'collecting' as VehicleVisualState
    },
    fsmState: 'collecting_ship_collecting', // 🟢 Mise à jour de l'état global FSM
    ...syncDockedDronesPosition(context, arrivedCoord),
  };
});

/**
 * Action assign pour le retour à la base après collecte
 * ✅ Utilise findPath() pour calculer le chemin de retour
 */
export const assignShipReturningContext = createAssignAction(({ context, event }) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] assignShipReturningContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentVehicleState: context.vehicle?.isMoving
  });
  
  if (!context.vehicle) {
    return {};
  }
  
  // Coordonnée de base (pour simplifier, retour à la position initiale)
  const baseCoord = context.vehicle?.baseCoord || '0,0';
  const baseWorldPos = gridToWorld(baseCoord);
  const currentCoord = context.vehicle.coord || '0,0';
  
  console.log(`🏠 [SHIP RETURNING] Looking for base tile at coord: ${baseCoord}`);
  console.log(`🏠 [SHIP RETURNING] Current ship coord: ${currentCoord}`);
  console.log(`🏠 [SHIP RETURNING] baseCoord from vehicle context: ${context.vehicle?.baseCoord}`);
  
  // 🛤️ PATHFINDING: Calculer le chemin de retour à la base
  // ✅ Phase 5: Use context.gridInfo.tiles instead of useTileStore.getState()
  const tiles = context.gridInfo?.tiles || {};
  const path = findPath(currentCoord, baseCoord, tiles);
  
  console.log(`🛤️ [SHIP RETURNING] Path calculated:`, {
    from: currentCoord,
    to: baseCoord,
    pathLength: path.length,
    path: path.slice(0, 5).join(' → ') + (path.length > 5 ? '...' : '')
  });
  
  const baseTile = {
    position: { ...baseWorldPos, coord: baseCoord },
    type: 'depart',
    biome: 'station',
    explorable: false,
    collectable: false,
    resources: { food: 0, debris: 0, special: 0, total: 0 },
    hasResources: false
  };

  fsmLogger.info(`🔙 [${context.entityId}] Updating vehicle state to returning with target:`, {
    baseCoord,
    basePosition: baseWorldPos,
    currentCoord,
    pathLength: path.length
  });

  // Note: pas de consommation de carburant pour le retour (par design)
  // Le vaisseau revient toujours à la base même sans fuel

  return {
    vehicle: {
      ...context.vehicle,
      coord: currentCoord,
      targetVehicleTile: baseTile, // Utiliser un objet Tile complet pour la base
      isMoving: true, // ✅ IMPORTANT: Le vaisseau doit bouger vers la base
      progress: 0, // Reset du progrès pour le retour
      currentSpeed: context.vehicle?.maxSpeed || 1,
      visualState: 'returning' as VehicleVisualState,
      currentPath: path,  // 🛤️ Stocker le chemin calculé
      pathIndex: 0        // 🛤️ Commencer au début du chemin
    },
    fsmState: 'collecting_ship_returning', // 🟢 Mise à jour de l'état global FSM
  };
});

/**
 * Action assign pour gérer l'arrivée du vaisseau à la base après collecte
 * Prépare le vaisseau pour la maintenance (le transfert de ressources se fait en maintenance)
 */
export const assignShipReachedBaseContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipReachedBaseContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    currentVehicleState: context.vehicle?.isMoving
  });
  
  if (!context.vehicle) {
    return {};
  }
  
  const baseCoord = context.vehicle?.baseCoord || '0,0';
  
  // 🔥 DANGER COLLISION DETECTION: Vérifier s'il y a un danger dynamique sur la base (cas rare mais possible)
  let damageIncrement = 0;
  // ✅ Phase 5: Use getTileFromContext instead of useTileStore.getState()
  const baseTile = getTileFromContext(context, baseCoord);
  
  if (baseTile?.isDynamicDanger) {
    damageIncrement = 10; // 10% de dégâts pour danger dynamique
    fsmLogger.warn(`💥 [${context?.entityId || 'unknown'}] Ship collided with dynamic danger at base ${baseCoord}! Damage: +${damageIncrement}%`);
  }
  
  fsmLogger.action(`🏠 [${context.entityId}] Ship reached base - ready for maintenance`, {
    vehicleResources: context.vehicle.resources,
    vehicleState: context.vehicle.visualState
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      coord: baseCoord,
      isMoving: false, // ✅ IMPORTANT: Le vaisseau s'arrête à la base
      progress: 100, // Arrivé à la base
      currentSpeed: 0,
      damage: Math.min(100, (context.vehicle.damage || 0) + damageIncrement), // 🔥 Appliquer les dégâts, max 100%
      targetVehicleTile: null, // Plus de cible active
      visualState: 'docked' as VehicleVisualState
    },
    lastAction: 'shipReachedBase_success',
    fsmState: 'maintaining_ship_on_base', // 🟢 Passage direct à maintenance pour dépôt
    ...syncDockedDronesPosition(context, baseCoord),
  };
});

/**
 * Action assign pour traiter le chargement des ressources collectées
 * Transfert des ressources de la tuile vers le vaisseau avec gestion de capacité
 * 
 * ✅ Phase 5: Pure implementation using context.gridInfo and tiles domain helpers
 * No more useTileStore dependency - the FSM context is the single source of truth
 */
export const assignShipLoadResourcesContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipLoadResourcesContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type
  });
  
  if (!context.vehicle) {
    return {};
  }

  // Récupérer la tuile cible et ses ressources
  const targetTile = context.vehicle.targetVehicleTile;
  if (!targetTile || !targetTile.position?.coord) {
    return {};
  }

  // ✅ Phase 5: Use context.gridInfo as the single source of truth
  // No more useTileStore dependency - all mutations are done via context
  const tileCoord = targetTile.position.coord;
  
  // Vérifier si la tuile existe et a des ressources via le contexte FSM
  const currentTile = getTileFromContext(context, tileCoord);
    
  if (!currentTile || !currentTile.resources || currentTile.resources.total <= 0) {
    fsmLogger.warn(`⚠️ [${context.entityId}] Target tile has no resources to collect`, {
      coord: tileCoord,
      tileExists: !!currentTile,
      resources: currentTile?.resources,
      contextTiles: context.gridInfo?.tiles ? Object.keys(context.gridInfo.tiles).slice(0, 5) : []
    });
    
    // ✅ Phase 5: Use updateTileInContext to sync FSM context
    if (currentTile) {
      // Marquer la tuile comme collectée via le helper
      const tileUpdates = updateTileInContext(context, tileCoord, {
        resources: { food: 0, debris: 0, special: 0, total: 0 },
        collected: true,
        hasResources: false,
        collectedAt: Date.now(),
        collectedBy: context.entityId,
      });
      
      fsmLogger.info(`🔄 [${context.entityId}] Synchronized empty tile in FSM context`, {
        tileCoord,
      });
      
      // Trouver une nouvelle tuile cible avec le helper
      const newTargetVehicleTile = findTileWithResources(
        { ...context, ...tileUpdates }, // Utiliser le contexte mis à jour
        tileCoord // Exclure la tuile actuelle
      );
      
      if (newTargetVehicleTile) {
        fsmLogger.info(`🎯 [${context.entityId}] Found new target tile after sync:`, {
          newTarget: newTargetVehicleTile.position?.coord,
          resources: newTargetVehicleTile.resources,
        });
      } else {
        fsmLogger.warn(`⚠️ [${context.entityId}] No alternative tiles found after sync`);
      }
      
      return {
        ...tileUpdates,
        vehicle: {
          ...context.vehicle,
          targetVehicleTile: newTargetVehicleTile
        },
        lastAction: 'shipLoadResources_emptyTile_synced'
      };
    }
    
    return {};
  }

  // Capacité max du véhicule
  const maxCapacity = typeof context.vehicle.maxCapacity === 'object' 
    ? context.vehicle.maxCapacity.total || 2003
    : Number(context.vehicle.maxCapacity) || 2003;

  // Ressources actuelles du véhicule
  const currentResources = context.vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const currentTotal = currentResources.total || 0;
  
  // Espace disponible dans le véhicule
  const availableCapacity = maxCapacity - currentTotal;
  
  if (availableCapacity <= 0) {
    return {};
  }

  // ✅ Phase 5: Use collectResourcesFromTile helper instead of useTileStore
  const collectionResult = collectResourcesFromTile(
    context,
    tileCoord,
    availableCapacity,
    context.entityId
  );
  
  if (!collectionResult) {
    fsmLogger.warn(`⚠️ [${context.entityId}] collectResourcesFromTile returned null`);
    return {};
  }
  
  const { collected: resourcesCollected, remaining: remainingTileResources, isCollected: tileCollectedFlag, contextUpdates } = collectionResult;

  // Nouvelles ressources du véhicule après collecte
  const newResources = {
    food: (currentResources.food || 0) + (resourcesCollected.food || 0),
    debris: (currentResources.debris || 0) + (resourcesCollected.debris || 0),
    special: (currentResources.special || 0) + (resourcesCollected.special || 0),
    total: 0
  };
  newResources.total = newResources.food + newResources.debris + newResources.special;
  
  // 🔥 FUEL CONSUMPTION: 1% per collection (as per business rules)
  const currentFuel = context.vehicle?.fuel ?? 100;
  const fuelConsumed = 1;
  const newFuel = Math.max(0, currentFuel - fuelConsumed);

  // Vérifier si le véhicule est maintenant plein ou presque plein (>80%)
  const isVehicleNearFull = newResources.total >= (maxCapacity * 0.8);
  const tileIsEmpty = remainingTileResources.total <= 0;
  const shouldReturnToBase = isVehicleNearFull || tileIsEmpty;
  
  fsmLogger.action(`📦 [${context.entityId}] Resources transferred from tile:`, {
    tileCoord,
    tileResourcesAfter: remainingTileResources,
    tileCollectedFlag,
    collected: resourcesCollected,
    vehicleResourcesBefore: currentResources,
    vehicleResourcesAfter: newResources,
    vehicleCapacity: `${newResources.total}/${maxCapacity}`,
    capacityUsed: `${Math.round((newResources.total / maxCapacity) * 100)}%`,
    isNearFull: isVehicleNearFull,
    tileIsEmpty,
    shouldReturn: shouldReturnToBase
  });
  
  // Trouver la prochaine tuile cible si la tuile actuelle est collectée
  let nextTargetTile = targetTile;
  if (tileCollectedFlag || remainingTileResources.total <= 0) {
    const newTarget = findTileWithResources(
      { ...context, ...contextUpdates },
      tileCoord
    );
    
    if (newTarget) {
      nextTargetTile = newTarget;
      fsmLogger.info(`🔄 [${context.entityId}] Current tile collected, switching to next best tile:`, {
        previousTile: tileCoord,
        nextTile: nextTargetTile.position?.coord,
        nextResources: nextTargetTile.resources
      });
    }
  }
  
  return {
    ...contextUpdates,
    vehicle: {
      ...context.vehicle,
      resources: newResources,
      fuel: newFuel,
      targetVehicleTile: nextTargetTile
    },
    lastAction: 'shipLoadResources_success',
    shouldReturnToBase
  };
});

// Placeholder pour éviter les erreurs d'import
export const __collectionAssignPlaceholder = createAssignAction(({ context: _context }) => {
  return {};
});

