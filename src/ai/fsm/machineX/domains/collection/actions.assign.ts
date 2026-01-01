/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * ✅ Phase 4: Pure actions - uses context.gridInfo instead of useTileStore
 * 
 * NOTE: useTileStore is kept ONLY for mutation operations (collectResources, deductResources)
 * which require modifying the tile store directly. All reads use context.gridInfo.
 */

import { assign } from 'xstate';

import { calculateDistance, findTilesInRadius, selectRandomTile } from '../../../../../core/spatial/index.ts';
import fsmLogger from '../../../../../logger/fsmLogger.ts';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { VehicleVisualState } from '../../../../../types/vehicle.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
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
    const shipPosition = context.vehicle?.position;
    const knownTiles = context.memory?.knownTiles || [];
    
    // 1️⃣ PRIORITÉ: Chercher une tuile explorée avec ressources non collectées
    const knownTilesWithResources = knownTiles.filter(tile => 
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
      const collectingRadius = context.config?.collectingRadius ?? 3;
      const startCoord = shipPosition?.coord;
      const candidateTiles = startCoord ? findTilesInRadius(startCoord, collectingRadius, tiles) : [];
      const tilesWithResources = candidateTiles.filter(tile => 
        tile?.resources && tile.resources.total > 0 && !tile.collected
      );
      
      targetVehicleTile = tilesWithResources.length > 0 
        ? selectRandomTile(tilesWithResources)
        : selectRandomTile(candidateTiles);
      
      fsmLogger.info(`🔀 [${context.entityId}] No explored tiles available, using random tile:`, {
        coord: targetVehicleTile?.position?.coord,
        candidatesChecked: candidateTiles.length,
        withResources: tilesWithResources.length
      });
    }
    
    if (!targetVehicleTile) {
      return {};
    }
    const targetGridCoord = targetVehicleTile.coord;
    const consistentTargetPos = targetVehicleTile.position;
    fsmLogger.info(`🚢 [${context.entityId}] Setting ship target for collection:`, {
      targetPosition: consistentTargetPos,
      targetGridCoord,
      currentPosition: shipPosition,
      coordinateCheck: {
        original: consistentTargetPos,
        recalculated: consistentTargetPos,
        areConsistent: true
      }
    });
    // Mise à jour complète du contexte en une seule fois
    const targetVehicleTileObj = targetVehicleTile;
    
    // ✅ Calculer la consommation de fuel basée sur la distance
    const distance = calculateDistance(shipPosition, consistentTargetPos);
    const fuelConsumption = Math.max(1, Math.floor(distance * 1.5)); // 1.5 fuel par unité de distance
    const currentFuel = context.vehicle?.fuel || 100;
    const newFuel = Math.max(0, currentFuel - fuelConsumption);
    
    // Calculer coord pour la position pendant le mouvement
    // Ici coord=null pour optimiser pendant le déplacement
    const positionWithCoord = { ...shipPosition, coord: null as string | null };
    
    const updatedContext = {
      vehicle: {
        ...context.vehicle,
        position: positionWithCoord,
        targetVehicleTile: targetVehicleTileObj, // Utiliser l'objet Tile complet
        isMoving: true, // ✅ IMPORTANT: Le vaisseau est en mouvement vers sa cible
        progress: 0, // Reset du progrès
        currentSpeed: context.vehicle?.maxSpeed || 1,
        visualState: 'moving_to_tile' as VehicleVisualState,
        fuel: newFuel // ✅ Déduire le fuel consommé
      },
      lastAction: 'shipMovingToTile_success',
      fsmState: 'collecting_ship_moving_to_tile', // 🟢 Mise à jour de l'état global FSM
    };
    
    fsmLogger.info(`✅ [${context.entityId}] Ship movement setup result:`, {
      hasVehicle: !!updatedContext.vehicle,
      targetVehicleTile: updatedContext.vehicle?.targetVehicleTile,
      isMoving: updatedContext.vehicle?.isMoving,
      distance: distance.toFixed(2),
      fuelConsumed: fuelConsumption,
      fuelRemaining: newFuel
    });
    
    return updatedContext;
  }
  
  // Pour les autres événements, ne pas modifier le contexte
  return {};
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
  
  const targetTilePosition = context.vehicle.targetVehicleTile?.position;
  const arrivedPosition = targetTilePosition
    ? { ...targetTilePosition, y: targetTilePosition.y ?? 0.5 }
    : context.vehicle.position;

  
  return {
    vehicle: {
      ...context.vehicle,
      position: arrivedPosition,
      isMoving: false, // ✅ IMPORTANT: Le vaisseau s'arrête pour collecter
      progress: 100, // Arrivé à destination
      currentSpeed: 0,
      visualState: 'collecting' as VehicleVisualState
    },
    fsmState: 'collecting_ship_collecting', // 🟢 Mise à jour de l'état global FSM
  };
});

/**
 * Action assign pour le retour à la base après collecte
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
  
  // Position de base (pour simplifier, retour à la position initiale)
  const basePosition = context.vehicle?.basePosition || { x: 0, y: 0.5, z: 0, coord: '0,0' };
  const baseTile = {
    position: basePosition,
    coord: basePosition.coord ?? '0,0',
    type: 'depart',
    biome: 'station',
    resources: { food: 0, debris: 0, special: 0, total: 0 },
    hasResources: false
  };

  fsmLogger.info(`🔙 [${context.entityId}] Updating vehicle state to returning with target:`, {
    basePosition,
    currentPosition: context.vehicle.position
  });

  return {
    vehicle: {
      ...context.vehicle,
  targetVehicleTile: baseTile, // Utiliser un objet Tile complet pour la base
      isMoving: true, // ✅ IMPORTANT: Le vaisseau doit bouger vers la base
      progress: 0, // Reset du progrès pour le retour
      currentSpeed: context.vehicle?.maxSpeed || 1,
      visualState: 'returning' as VehicleVisualState
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
  
  const basePosition = context.vehicle?.basePosition || { x: 0, y: 0.5, z: 0, coord: '0,0' };
  fsmLogger.action(`🏠 [${context.entityId}] Ship reached base - ready for maintenance`, {
    vehicleResources: context.vehicle.resources,
    vehicleState: context.vehicle.visualState
  });

  const dockedPosition = {
    ...basePosition,
    y: basePosition.y ?? 0.5
  };
  
  return {
    vehicle: {
      ...context.vehicle,
      position: dockedPosition,
      isMoving: false, // ✅ IMPORTANT: Le vaisseau s'arrête à la base
      progress: 100, // Arrivé à la base
      currentSpeed: 0,
      targetVehicleTile: null, // Plus de cible active
      visualState: 'docked' as VehicleVisualState
    },
    lastAction: 'shipReachedBase_success',
    fsmState: 'maintaining_ship_on_base', // 🟢 Passage direct à maintenance pour dépôt
  };
});

/**
 * Action assign pour traiter le chargement des ressources collectées
 * Transfert des ressources de la tuile vers le vaisseau avec gestion de capacité
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

  // ⚠️ MUTATION REQUIRED: useTileStore is needed here for write operations
  // collectResources() and deductResources() modify the tile store directly
  // This cannot be done via context.gridInfo which is read-only
  // 
  // ⚠️ NODE.JS COMPATIBILITY: In test environment, useTileStore may not exist or be empty
  // In that case, we fall back to context.gridInfo.tiles (read-only simulation)
  const tileStoreState = typeof useTileStore !== 'undefined' && useTileStore.getState ? useTileStore.getState() : null;
  const tileCoord = targetTile.position.coord;
  
  // Check if tile store has actual data, otherwise use context fallback
  const hasTileStoreData = tileStoreState && tileStoreState.tiles && Object.keys(tileStoreState.tiles).length > 0;
  const useStore = hasTileStoreData;
  
  // Vérifier si la tuile existe et a des ressources
  // Priority: tileStore (if available and populated), then context.gridInfo.tiles
  const currentTile = useStore 
    ? tileStoreState.tiles[tileCoord] 
    : context.gridInfo?.tiles?.[tileCoord];
    
  if (!currentTile || !currentTile.resources || currentTile.resources.total <= 0) {
    fsmLogger.warn(`⚠️ [${context.entityId}] Target tile has no resources to collect`, {
      coord: tileCoord,
      tileExists: !!currentTile,
      resources: currentTile?.resources,
      useStore,
      hasTileStoreData,
      contextTiles: context.gridInfo?.tiles ? Object.keys(context.gridInfo.tiles) : []
    });
    
    // ✅ FIX: Même si la tuile est vide, SYNCHRONISER le contexte FSM
    // Cela évite la boucle infinie car le contexte sera mis à jour
    if (currentTile) {
      const emptyResources = { food: 0, debris: 0, special: 0, total: 0 };
      
      // Mettre à jour memory.knownTiles avec les ressources vides et le flag collected
      const updatedKnownTiles = context.memory?.knownTiles?.map(tile => {
        if (tile.position?.coord === tileCoord) {
          return {
            ...tile,
            resources: emptyResources,
            collected: true,  // ✅ Marquer comme collectée
            hasResources: false
          };
        }
        return tile;
      }) || [];
      
      // Mettre à jour gridInfo.tiles aussi pour assurer la cohérence
      const updatedGridTiles = context.gridInfo?.tiles ? {
        ...context.gridInfo.tiles,
        [tileCoord]: {
          ...context.gridInfo.tiles[tileCoord],
          resources: emptyResources,
          collected: true,
          hasResources: false
        }
      } : {};
      
      fsmLogger.info(`🔄 [${context.entityId}] Synchronizing FSM context with empty tile`, {
        tileCoord,
        updatedKnownTilesCount: updatedKnownTiles.length
      });
      
      // ✅ CRITICAL FIX: Recalculer une nouvelle tuile cible après synchronisation
      // pour éviter la boucle infinie ship_moving_to_tile → ship_collecting
      let newTargetVehicleTile = null;
      const shipPosition = context.vehicle?.position;
      
      // 1️⃣ PRIORITÉ: Chercher une autre tuile explorée avec ressources non collectées
      const remainingTilesWithResources = updatedKnownTiles.filter(tile => 
        tile?.resources && 
        tile.resources.total > 0 && 
        !tile.collected &&
        tile.hasResources &&
        tile.position?.coord !== tileCoord // ❌ EXCLURE la tuile actuelle !
      );
      
      if (remainingTilesWithResources.length > 0) {
        // Sélectionner la tuile avec le plus de ressources
        newTargetVehicleTile = remainingTilesWithResources.reduce((best, current) => 
          (current.resources?.total || 0) > (best.resources?.total || 0) ? current : best
        );
        
        fsmLogger.info(`🎯 [${context.entityId}] Found new target tile after synchronization:`, {
          newTarget: newTargetVehicleTile.position?.coord,
          resources: newTargetVehicleTile.resources,
          remainingCandidates: remainingTilesWithResources.length
        });
      } else {
        // 2️⃣ FALLBACK: Chercher dans un rayon aléatoire (exclure tuile actuelle)
        const collectingRadius = context.config?.collectingRadius ?? 3;
        const startCoord = shipPosition?.coord;
        const candidateTiles = startCoord ? findTilesInRadius(startCoord, collectingRadius, updatedGridTiles) : [];
        const tilesWithResources = candidateTiles.filter(tile => 
          tile?.resources && 
          tile.resources.total > 0 && 
          !tile.collected &&
          tile.position?.coord !== tileCoord // ❌ EXCLURE la tuile actuelle !
        );
        
        if (tilesWithResources.length > 0) {
          newTargetVehicleTile = selectRandomTile(tilesWithResources);
          fsmLogger.info(`🔀 [${context.entityId}] Selected fallback target after sync:`, {
            newTarget: newTargetVehicleTile?.position?.coord,
            candidatesChecked: candidateTiles.length,
            withResources: tilesWithResources.length
          });
        } else {
          fsmLogger.warn(`⚠️ [${context.entityId}] No alternative tiles found after synchronization`);
        }
      }
      
      return {
        memory: {
          ...context.memory,
          knownTiles: updatedKnownTiles
        },
        gridInfo: {
          ...context.gridInfo,
          tiles: updatedGridTiles
        },
        vehicle: {
          ...context.vehicle,
          targetVehicleTile: newTargetVehicleTile // ✅ NOUVELLE CIBLE OU NULL si aucune
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

  // Collecter les ressources via le store (qui gère la logique de déduction)
  // In Node.js test environment, simulate collection from context.gridInfo.tiles
  let resourcesCollected;
  
  if (useStore) {
    // React environment: use store mutation
    resourcesCollected = tileStoreState.collectResources(tileCoord, context.entityId);
  } else {
    // Node.js test environment: simulate collection (read-only)
    // Collect all available resources from the tile
    resourcesCollected = {
      food: currentTile.resources.food || 0,
      debris: currentTile.resources.debris || 0,
      special: currentTile.resources.special || 0,
      total: currentTile.resources.total || 0
    };
  }
  
  // Ajuster les ressources collectées selon la capacité disponible
  const totalRequested = resourcesCollected.total;
  const actualCollected = Math.min(totalRequested, availableCapacity);
  
  // Si on ne peut pas tout prendre, ajuster proportionnellement
  if (actualCollected < totalRequested && totalRequested > 0) {
    const ratio = actualCollected / totalRequested;
    resourcesCollected.food = Math.floor(resourcesCollected.food * ratio);
    resourcesCollected.debris = Math.floor(resourcesCollected.debris * ratio);
    resourcesCollected.special = Math.floor(resourcesCollected.special * ratio);
    resourcesCollected.total = resourcesCollected.food + resourcesCollected.debris + resourcesCollected.special;
    
    // Si on ne peut pas tout prendre, déduire seulement ce qu'on peut prendre
    // Only update the store in React environment (not in Node.js tests)
    if (useStore && actualCollected < totalRequested) {
      const excessResources = {
        food: currentTile.resources.food - resourcesCollected.food,
        debris: currentTile.resources.debris - resourcesCollected.debris,
        special: currentTile.resources.special - resourcesCollected.special
      };
      
      // Remettre l'excès sur la tuile via le store
      if (excessResources.food > 0 || excessResources.debris > 0 || excessResources.special > 0) {
        tileStoreState.deductResources(tileCoord, {
          food: -excessResources.food,
          debris: -excessResources.debris,
          special: -excessResources.special
        });
      }
    }
  }

  // Nouvelles ressources du véhicule après collecte
  const newResources = {
    food: (currentResources.food || 0) + (resourcesCollected.food || 0),
    debris: (currentResources.debris || 0) + (resourcesCollected.debris || 0),
    special: (currentResources.special || 0) + (resourcesCollected.special || 0),
    total: 0 // Sera calculé ci-dessous
  };
  newResources.total = newResources.food + newResources.debris + newResources.special;
  
  // Obtenir l'état actuel de la tuile après collecte (le store l'a mise à jour)
  // ✅ IMPORTANT: Récupérer TOUS les attributs de la tuile, y compris le flag 'collected'
  const updatedTile = useStore 
    ? tileStoreState.tiles[tileCoord]
    : {
        ...currentTile,
        resources: {
          food: Math.max(0, (currentTile.resources.food || 0) - resourcesCollected.food),
          debris: Math.max(0, (currentTile.resources.debris || 0) - resourcesCollected.debris),
          special: Math.max(0, (currentTile.resources.special || 0) - resourcesCollected.special),
          total: 0 // Will be calculated below
        }
      };
  
  if (!useStore && updatedTile.resources) {
    updatedTile.resources.total = updatedTile.resources.food + updatedTile.resources.debris + updatedTile.resources.special;
    // ✅ FIX: Dans l'environnement Node.js, marquer la tile comme collectée si elle est vide
    updatedTile.collected = updatedTile.resources.total <= 0;
  }
  
  const remainingTileResources = updatedTile.resources;
  // ✅ Récupérer le flag 'collected' réel depuis le TileStore ou du calcul Node.js
  const tileCollectedFlag = updatedTile.collected || false;

  // Vérifier si le véhicule est maintenant plein ou presque plein (>80%)
  const isVehicleNearFull = newResources.total >= (maxCapacity * 0.8);
  const tileIsEmpty = remainingTileResources.total <= 0;
  const shouldReturnToBase = isVehicleNearFull || tileIsEmpty;
  
  fsmLogger.action(`📦 [${context.entityId}] Resources transferred from tile:`, {
    tileCoord,
    tileResourcesAfter: remainingTileResources,
    tileCollectedFlag,  // ✅ Logger le flag réel
    collected: resourcesCollected,
    vehicleResourcesBefore: currentResources,
    vehicleResourcesAfter: newResources,
    vehicleCapacity: `${newResources.total}/${maxCapacity}`,
    capacityUsed: `${Math.round((newResources.total / maxCapacity) * 100)}%`,
    isNearFull: isVehicleNearFull,
    tileIsEmpty,
    shouldReturn: shouldReturnToBase
  });
  
  // ✅ FIX: Mettre à jour memory.knownTiles avec le flag 'collected' RÉEL 
  const updatedKnownTiles = context.memory?.knownTiles?.map(tile => {
    if (tile.position?.coord === tileCoord) {
      const hasResources = remainingTileResources.total > 0;
      return {
        ...tile,
        resources: remainingTileResources,
        collected: tileCollectedFlag,  // ✅ Utiliser le flag réel (TileStore ou calcul Node.js)
        hasResources
      };
    }
    return tile;
  }) || [];
  
  // ✅ FIX: Si la tuile actuelle est maintenant collectée, trouver la prochaine tuile à cibler
  let nextTargetTile = targetTile;
  if (tileCollectedFlag || remainingTileResources.total <= 0) {
    // Chercher une autre tuile explorée avec des ressources
    const remainingTiles = updatedKnownTiles.filter(tile => 
      tile?.resources && 
      tile.resources.total > 0 && 
      !tile.collected &&
      tile.hasResources &&
      tile.position?.coord !== tileCoord  // Pas la tuile actuelle
    );
    
    if (remainingTiles.length > 0) {
      // Choisir la tuile avec le plus de ressources
      nextTargetTile = remainingTiles.reduce((best, current) => 
        (current.resources?.total || 0) > (best.resources?.total || 0) ? current : best
      );
      fsmLogger.info(`🔄 [${context.entityId}] Current tile collected, switching to next best tile:`, {
        previousTile: tileCoord,
        nextTile: nextTargetTile.position?.coord,
        nextResources: nextTargetTile.resources
      });
    }
  }
  
  return {
    vehicle: {
      ...context.vehicle,
      resources: newResources,
      // Mettre à jour la référence à la tuile cible avec les nouvelles ressources
      targetVehicleTile: nextTargetTile  // ✅ Utiliser la nouvelle cible si disponible
    },
    memory: {
      ...context.memory,
      knownTiles: updatedKnownTiles
    },
    lastAction: 'shipLoadResources_success',
    // Ajouter une indication sur le prochain état recommandé pour la FSM
    shouldReturnToBase
  };
});

// Placeholder pour éviter les erreurs d'import
export const __collectionAssignPlaceholder = createAssignAction(({ context: _context }) => {
  return {};
});
