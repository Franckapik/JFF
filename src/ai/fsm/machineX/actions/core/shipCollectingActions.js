/**
 * ============================================================================
 * SHIP COLLECTING ACTIONS CORE - Actions de collecte des ships (SIMPLIFIÉ)
 * ============================================================================
 * 

 * 
 * @author Migration FSM - Simplification Mémoire
 * @version 4.0.0
 */

import fsmLogger from '../../../../../logger/fsmLogger.js';
import { useTileStore } from '../../../../../stores/useTileStore/index.ts';
import { isTileAvailableForCollection, isTileCompletelyCollected } from '../../../../../stores/useTileStore/slices/tileResourceSlice.js';
import { DEFAULT_CAPACITIES, DEFAULT_VEHICLE_STATE, EXPLORATION_CYCLE_CONFIG, RESOURCE_CONSTANTS, VEHICLE_TYPES } from '../../config/constants.ts';

// ============================================================================
// UTILITAIRES INTERNES
// ============================================================================

/**
 * Validation et normalisation d'une tuile cible
 */
const validateTargetTile = (tile) => {
  if (!tile) {
    throw new Error('Target tile is required');
  }
  
  if (!tile.position || tile.coord === undefined || tile.coord === null) {
    throw new Error('Invalid target tile: missing position or coord');
  }
  
  // Validation spécifique du format de coordonnée
  if (typeof tile.coord !== 'string') {
    throw new Error('Invalid coordinate format: expected "x,y" string');
  }
  
  if (!tile.coord.includes(',')) {
    throw new Error('Invalid coordinate format: expected "x,y" string');
  }
  
  // Validation plus poussée du format x,y
  const coords = tile.coord.split(',');
  if (coords.length !== 2 || isNaN(Number(coords[0])) || isNaN(Number(coords[1]))) {
    throw new Error('Invalid coordinate format: expected "x,y" string');
  }
  
  return {
    position: tile.position,
    coord: tile.coord
  };
};

/**
 * Utilitaire pour contraindre une valeur dans une plage
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Calcule la distance entre deux coordonnées
 */
const calculateDistance = (coord1, coord2) => {
  if (!coord1 || !coord2) return 0;
  
  const [x1, y1] = coord1.split(',').map(Number);
  const [x2, y2] = coord2.split(',').map(Number);
  
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
};

// ============================================================================
// 🚢 ACTIONS PRINCIPALES - Collecte et mouvement simplifiés
// ============================================================================

/**
 * Action unifiée : Ship collecte les ressources d'une tuile explorée
 * Utilise la Map `knownTiles` pour vérifier et marquer la collecte
 * @param {Object} context - Contexte FSM actuel
 * @param {Object} event - Événement avec coord et optionnel resourceType
 * @returns {Object} - Contexte mis à jour avec mémoire unifiée
 */
export const shipCollectsFromTile = (context, event) => {
  try {
    // Collection attempt started
    const collectionStartTime = Date.now();
    fsmLogger.info(`[${context.entityId}] Starting collection from tile ${event.coord}`);

    const { coord } = event;
     
    if (!coord) {
      fsmLogger.resources(`[${context.entityId}] ❌ FAILED: No coord in event`);
      return { 
        ...context, 
        error: 'Tile coordinate is required for collection',
        lastAction: 'shipCollectsFromTile_failed'
      };
    }
    
    const vehicle = context.vehicle;
    if (!vehicle) {
      fsmLogger.resources(`[${context.entityId}] ❌ FAILED: No vehicle in context`);
      return { 
        ...context, 
        error: 'Cannot collect: no ship found',
        lastAction: 'shipCollectsFromTile_failed'
      };
    }
    
    fsmLogger.resources(`[${context.entityId}] ✅ Basic validation passed, checking memory...`);
    
    // Vérifier la mémoire unifiée
    const knownTiles = new Map(context.memory?.knownTiles || new Map());
    const tileData = knownTiles.get(coord);
    
    // 🔍 PHASE 3 DEBUG: État détaillé de la tuile AVANT collecte
    fsmLogger.resources(`[${context.entityId}] 🔍 PHASE3-TILE-BEFORE: Tile state before collection`, {
      coord,
      tileExists: !!tileData,
      tileData: tileData ? {
        explored: tileData.explored,
        resourcePercentage: tileData.resourcePercentage,
        isCompletelyCollected: isTileCompletelyCollected(tileData),
        hasResources: tileData.hasResources,
        resources: tileData.resources,
        totalResourcesCollected: tileData.totalResourcesCollected,
        lastCollectedTimestamp: tileData.lastCollectedTimestamp
      } : null,
      knownTilesTotal: knownTiles.size,
      memoryTimestamp: context.memory?.timestamp
    });

    fsmLogger.resources(`[${context.entityId}] Attempting collection from tile ${coord}`, {
      tileExists: !!tileData,
      explored: tileData?.explored,
      isCompletelyCollected: tileData ? isTileCompletelyCollected(tileData) : false,
      hasResources: tileData?.hasResources,
      resources: tileData?.resources
    });
  
  if (!tileData || !tileData.explored) {
    fsmLogger.resources(`[${context.entityId}] ❌ FAILED: Tile not found or not explored`, {
      tileData: !!tileData,
      explored: tileData?.explored
    });
    return { 
      ...context, 
      error: 'Cannot collect from unexplored tile',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  if (tileData && isTileCompletelyCollected(tileData)) {
    fsmLogger.resources(`[${context.entityId}] ❌ FAILED: Tile already completely collected`, {
      resourcePercentage: tileData.resourcePercentage,
      isCompletelyCollected: true
    });
    return { 
      ...context, 
      error: 'Tile already completely collected',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  if (!tileData.hasResources || !tileData.resources) {
    fsmLogger.resources(`[${context.entityId}] ❌ FAILED: No resources on tile`, {
      hasResources: tileData.hasResources,
      resources: tileData.resources
    });
    return { 
      ...context, 
      error: 'No resources available on this tile',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  fsmLogger.resources(`[${context.entityId}] ✅ Tile validation passed, calculating collection...`);
  
  // Force l'utilisation des nouvelles capacités depuis constants.js
  const maxCapacity = DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP] || { food: 200, debris: 1800, special: 3 };
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const availableResources = tileData.resources;
  
  // 🔍 PHASE 3 DEBUG: État détaillé du véhicule AVANT collecte
  fsmLogger.resources(`[${context.entityId}] 🔍 PHASE3-VEHICLE-BEFORE: Vehicle state before collection`, {
    vehicleId: vehicle.id,
    vehicleType: vehicle.type,
    currentResources: { ...currentResources },
    maxCapacity: vehicle.maxCapacity,
    lastCollectionTime: vehicle.lastCollectionTime,
    availableResources: { ...availableResources },
    totalCurrentResources: Object.values(currentResources).reduce((sum, val) => sum + val, 0),
    totalAvailable: Object.values(availableResources).reduce((sum, val) => sum + val, 0)
  });
  
  // COLLECTE PARTIELLE : Calculer ce qu'on peut réellement collecter selon les capacités par type
  const resourcesToCollect = { food: 0, debris: 0, special: 0 };
  const remainingResources = { ...availableResources };
  let hasCollectedSomething = false;
  
  // Collecter chaque type de ressource selon les capacités spécifiques
  Object.entries(availableResources).forEach(([resourceType, availableAmount]) => {
    if (availableAmount > 0) {
      const currentAmount = currentResources[resourceType] || 0;
      const maxForType = maxCapacity[resourceType] || 0;
      const canCollect = Math.max(0, maxForType - currentAmount);
      const toCollect = Math.min(availableAmount, canCollect);
      
      if (toCollect > 0) {
        resourcesToCollect[resourceType] = toCollect;
        remainingResources[resourceType] = availableAmount - toCollect;
        hasCollectedSomething = true;
      }
      
      fsmLogger.resources(`[${context.entityId}] 📊 Resource calculation for ${resourceType}`, {
        available: availableAmount,
        current: currentAmount,
        maxCapacity: maxForType,
        canCollect,
        willCollect: toCollect,
        remaining: remainingResources[resourceType]
      });
    }
  });
  
  // Vérification finale de sécurité
  if (!hasCollectedSomething) {
    const totalCurrent = Object.values(currentResources).reduce((sum, val) => sum + val, 0);
    const totalMaxCapacity = Object.values(maxCapacity).reduce((sum, val) => sum + val, 0);
    
    fsmLogger.resources(`[${context.entityId}] ❌ FAILED: Cannot collect anything (capacity full)`, {
      totalCurrent,
      totalMaxCapacity,
      currentResources,
      maxCapacity,
      availableResources
    });
    return { 
      ...context, 
      error: 'Cannot collect: ship is at full capacity',
      lastAction: 'shipCollectsFromTile_capacity_full'
    };
  }
  
  fsmLogger.resources(`[${context.entityId}] 📊 PARTIAL COLLECTION CALCULATED`, {
    availableResources,
    resourcesToCollect,
    remainingResources,
    currentResources,
    maxCapacity,
    hasCollectedSomething,
    isPartialCollection: Object.values(remainingResources).some(amount => amount > 0)
  });
  
  fsmLogger.resources(`[${context.entityId}] ✅ Capacity check passed, updating resources...`);
  // Mettre à jour les ressources du vaisseau (SANS ajouter au score)
  const updatedResources = { ...currentResources };
  Object.entries(resourcesToCollect).forEach(([type, amount]) => {
    updatedResources[type] = (updatedResources[type] || 0) + amount;
  });

  // 🔍 PHASE 3 DEBUG: État détaillé du véhicule APRÈS collecte
  fsmLogger.resources(`[${context.entityId}] 🔍 PHASE3-VEHICLE-AFTER: Vehicle state after collection`, {
    vehicleId: vehicle.id,
    previousResources: { ...currentResources },
    resourcesToCollect: { ...resourcesToCollect },
    updatedResources: { ...updatedResources },
    resourceChanges: Object.fromEntries(
      Object.entries(resourcesToCollect).map(([type, amount]) => [
        type, 
        { 
          before: currentResources[type] || 0, 
          amount: amount, 
          after: updatedResources[type] 
        }
      ])
    ),
    totalBefore: Object.values(currentResources).reduce((sum, val) => sum + val, 0),
    totalAfter: Object.values(updatedResources).reduce((sum, val) => sum + val, 0)
  });

  fsmLogger.resources(`[${context.entityId}] Collection successful: +${JSON.stringify(resourcesToCollect)} -> Vehicle resources: ${JSON.stringify(updatedResources)} (Score transfer will happen at base)`);

  // Déterminer si la tuile est entièrement collectée ou partiellement collectée
  const hasRemainingResources = Object.values(remainingResources).some(amount => amount > 0);
  const totalCollected = Object.values(resourcesToCollect).reduce((sum, val) => sum + val, 0);
  const isFullyCollected = !hasRemainingResources;
  
  // Calculer le nouveau pourcentage de ressources restantes pour la FSM
  const originalResources = tileData.originalResources || tileData.resources;
  const totalOriginal = Object.values(originalResources).reduce((sum, val) => sum + val, 0);
  const totalRemaining = Object.values(remainingResources).reduce((sum, val) => sum + val, 0);
  const newResourcePercentage = totalOriginal > 0 ? Math.round((totalRemaining / totalOriginal) * 100) : 0;
  
  // Mettre à jour la tuile dans la mémoire FSM selon le type de collected
  const updatedTileData = {
    ...tileData,
    resources: remainingResources, // Les ressources restantes après collecte
    resourcePercentage: newResourcePercentage, // Pourcentage de ressources restantes
    originalResources: originalResources, // Conserver les ressources originales pour référence
    lastCollectedTimestamp: Date.now(),
    totalResourcesCollected: (tileData.totalResourcesCollected || 0) + totalCollected,
    hasResources: hasRemainingResources, // False seulement si plus rien sur la tuile
    partiallyCollected: hasRemainingResources, // Nouvelle propriété pour tracking
    lastPartialCollection: hasRemainingResources ? {
      timestamp: Date.now(),
      vehicleId: vehicle.id,
      resourcesCollected: resourcesToCollect,
      remaining: remainingResources
    } : tileData.lastPartialCollection
  };
  knownTiles.set(coord, updatedTileData);
  
  // 🔍 PHASE 3 DEBUG: État détaillé de la tuile APRÈS mise à jour FSM
  fsmLogger.resources(`[${context.entityId}] 🔍 PHASE3-TILE-AFTER-FSM: Tile state after FSM update`, {
    coord,
    previousTileData: {
      resourcePercentage: tileData.resourcePercentage,
      resources: tileData.resources,
      totalResourcesCollected: tileData.totalResourcesCollected
    },
    updatedTileData: {
      resourcePercentage: updatedTileData.resourcePercentage,
      resources: updatedTileData.resources,
      totalResourcesCollected: updatedTileData.totalResourcesCollected
    },
    fsmMemoryUpdated: knownTiles.has(coord),
    knownTilesSize: knownTiles.size
  });
  
  fsmLogger.resources(`[${context.entityId}] Tile ${coord} updated in FSM memory`, {
    resourcePercentage: updatedTileData.resourcePercentage,
    isCompletelyCollected: isTileCompletelyCollected(updatedTileData),
    totalCollected: updatedTileData.totalResourcesCollected
  });
  
  // Synchroniser avec le TileStore pour permettre la collecte partielle et l'affichage du pourcentage
  try {
    const tileStore = useTileStore.getState();
    
    // 🔍 PHASE 3 DEBUG: État du TileStore AVANT synchronisation
    const tileStoreStateBefore = tileStore.tiles?.[coord];
    fsmLogger.resources(`[${context.entityId}] 🔍 PHASE3-STORE-BEFORE: TileStore state before sync`, {
      coord,
      tileStoreExists: !!tileStore,
      tileExistsInStore: !!tileStoreStateBefore,
      tileStoreData: tileStoreStateBefore ? {
        resources: tileStoreStateBefore.resources,
        resourcePercentage: tileStoreStateBefore.resourcePercentage,
        isCompletelyCollected: isTileCompletelyCollected(tileStoreStateBefore),
        explored: tileStoreStateBefore.explored
      } : null,
      resourcesToDeduct: { ...resourcesToCollect }
    });
    
    const syncSuccess = tileStore.deductTileResources(coord, resourcesToCollect);
    
    // 🔍 PHASE 3 DEBUG: État du TileStore APRÈS synchronisation
    const tileStoreStateAfter = tileStore.tiles?.[coord];
    fsmLogger.resources(`[${context.entityId}] 🔍 PHASE3-STORE-AFTER: TileStore state after sync`, {
      coord,
      syncSuccess,
      tileStoreStateBefore: tileStoreStateBefore ? {
        resources: tileStoreStateBefore.resources,
        resourcePercentage: tileStoreStateBefore.resourcePercentage,
        isCompletelyCollected: isTileCompletelyCollected(tileStoreStateBefore)
      } : null,
      tileStoreStateAfter: tileStoreStateAfter ? {
        resources: tileStoreStateAfter.resources,
        resourcePercentage: tileStoreStateAfter.resourcePercentage,
        isCompletelyCollected: isTileCompletelyCollected(tileStoreStateAfter)
      } : null,
      resourcesDeducted: { ...resourcesToCollect }
    });
    
    if (syncSuccess) {
      fsmLogger.resources(`[${context.entityId}] ✅ TileStore synchronized - partial collection enabled`, {
        coord,
        deductedResources: resourcesToCollect
      });
    } else {
      fsmLogger.resources(`[${context.entityId}] ⚠️ TileStore sync failed - tile not found in store`, {
        coord
      });
    }
  } catch (error) {
    fsmLogger.resources(`[${context.entityId}] ⚠️ TileStore sync error (non-critical):`, error.message);
  }

  // Mettre à jour les statistiques
  const currentStats = context.memory?.stats || {
    tilesExplored: 0,
    tilesCollected: 0,
    totalResourcesFound: 0,
    lastExploration: null,
    lastCollection: null
  };
  
  const newStats = {
    ...currentStats,
    tilesCollected: currentStats.tilesCollected + 1,
    lastCollection: {
      coord,
      timestamp: Date.now(),
      shipId: vehicle.id
    }
  };
  
  // 🔍 PHASE 3 DEBUG: Résumé final de la collecte
  const collectionEndTime = Date.now();
  fsmLogger.resources(`[${context.entityId}] 🔍 PHASE3-FINAL: Collection completed successfully`, {
    coord,
    collectionDuration: collectionEndTime - collectionStartTime,
    vehicleIdBefore: context.vehicle?.id,
    vehicleIdAfter: vehicle.id,
    resourcesBefore: context.vehicle?.resources,
    resourcesAfter: updatedResources,
    tileResourcePercentage: updatedTileData.resourcePercentage,
    tileCompletelyCollected: isTileCompletelyCollected(updatedTileData),
    statsUpdated: {
      tilesCollectedBefore: currentStats.tilesCollected,
      tilesCollectedAfter: newStats.tilesCollected
    },
    memorySize: knownTiles.size,
    lastAction: 'shipCollectsFromTile_success'
  });
  
  return {
    ...context,
    vehicle: {
      ...vehicle,
      resources: updatedResources,
      lastCollectionTime: Date.now()
    },
    // Score sera mis à jour uniquement lors du retour à la base
    memory: {
      ...context.memory,
      knownTiles,
      stats: newStats
    },
    timestamps: {
      ...context.timestamps,
      lastCollection: Date.now()
    },
    lastAction: 'shipCollectsFromTile_success'
  };
  
  } catch (error) {
    fsmLogger.error(`[${context.entityId}] 💥 CRITICAL ERROR in shipCollectsFromTile:`, error);
    return {
      ...context,
      error: `Collection failed: ${error.message}`,
      lastAction: 'shipCollectsFromTile_critical_error'
    };
  }
};
/**
 * Initie le mouvement du ship vers une tuile cible
 */
export const shipMoveToTile = (context, event) => {
  try {
    const validatedTile = validateTargetTile(event.targetTile);
    
    const vehicle = context.vehicle;
    if (!vehicle) {
      return { ...context, error: 'Cannot move ship: no vehicle found' };
    }
    
    if (vehicle.isMoving) {
      return { ...context, error: 'Cannot move ship: vehicle is already moving' };
    }
    
    return {
      ...context,
      vehicle: {
        ...vehicle,
        targetTile: validatedTile,
        isMoving: true,
        movementStartTime: Date.now(),
        progress: 0
      },
      lastAction: 'shipMoveToTile_success'
    };
  } catch (error) {
    return { ...context, error: error.message, lastAction: 'shipMoveToTile_failed' };
  }
};

/**
 * Arrête le mouvement du ship en cours
 */
export const shipStopMovement = (context) => ({
  ...context,
  vehicle: {
    ...context.vehicle,
    isMoving: false,
    targetTile: {
      position: null,
      coord: null
    },
    progress: 0,
    movementStartTime: null
  },
  lastAction: 'shipStopMovement_success'
});

/**
 * Met à jour la progression du mouvement du ship
 */
export const shipUpdateProgress = (context, event) => {
  let progress = event.progress;
  if (typeof progress !== 'number' || isNaN(progress)) {
    progress = 0;
  }
  progress = clamp(progress, 0, 100);
  
  return {
    ...context,
    vehicle: {
      ...context.vehicle,
      progress
    },
    lastAction: 'shipUpdateProgress_success'
  };
};

/**
 * Met à jour la position actuelle du ship ET synchronise les drones ancrés
 */
export const shipUpdatePosition = (context, event) => {
  const hasValidData = event.position || event.coord || event.newCoord;
  
  if (!hasValidData) {
    fsmLogger.error(`❌ [shipUpdatePosition] No position data found in event:`, {
      event,
      checks: {
        newCoord: event.newCoord,
        coord: event.coord,
        position: event.position
      }
    });
    return context;
  }

  const updatedVehicle = {
    ...context.vehicle,
    lastUpdate: Date.now()
  };

  // Mettre à jour la coordonnée
  if (event.newCoord || event.coord) {
    updatedVehicle.coord = event.newCoord || event.coord;
  }

  // Mettre à jour la position 3D
  if (event.position) {
    updatedVehicle.position = event.position;
    
    // 🏠 INITIALISER basePosition SI C'EST LA PREMIÈRE FOIS
    if (!updatedVehicle.basePosition) {
      updatedVehicle.basePosition = { ...event.position };
    }
  }

  let updatedContext = {
    ...context,
    vehicle: updatedVehicle,
    lastAction: 'shipUpdatePosition_success'
  };

  // IMPORTANT: Synchroniser automatiquement les drones ancrés
  if (event.position && context.droneFleet?.drones) {
    const updatedDrones = {};
    Object.entries(context.droneFleet.drones).forEach(([type, drone]) => {
      if (drone.state === 'docked' || !drone.isActive) {
        updatedDrones[type] = {
          ...drone,
          position: event.position // Les drones ancrés suivent le vaisseau
        };
      } else {
        updatedDrones[type] = drone; // Les drones actifs gardent leur position
      }
    });

    updatedContext.droneFleet = {
      ...context.droneFleet,
      basePosition: event.position,
      drones: updatedDrones
    };
  }

  return updatedContext;
};

/**
 * Finalise un mouvement du ship (position atteinte)
 */
export const shipCompleteMovement = (context) => ({
  ...context,
  vehicle: {
    ...context.vehicle,
    isMoving: false,
    progress: 100,
    coord: context.vehicle.targetTile?.coord || context.vehicle.coord,
    targetTile: {
      position: null,
      coord: null
    },
    movementStartTime: null,
    lastMovementTime: Date.now()
  },
  lastAction: 'shipCompleteMovement_success'
});

/**
 * Crée un ship avec capacités par défaut selon son type
 */
export const shipCreateWithCapacities = (context, event) => {
  const vehicleData = event.vehicleData || {};
  const defaultCapacity = DEFAULT_CAPACITIES[vehicleData.type] || DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP];
  
  const vehicleWithCapacities = {
    ...DEFAULT_VEHICLE_STATE,
    ...vehicleData,
    maxCapacity: vehicleData.maxCapacity || defaultCapacity,
    resources: vehicleData.resources || { food: 0, debris: 0, special: 0 }
  };

  return {
    ...context,
    vehicle: vehicleWithCapacities,
    lastAction: 'shipCreateWithCapacities_success'
  };
};

/**
 * Dépose les ressources du ship à la base
 */
export const shipDepositResources = (context, event) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return { ...context, error: 'Cannot deposit: no ship found' };
  }

  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const depositType = event.resourceType || 'all';
  
  let updatedResources = { ...currentResources };
  let depositedResources = { food: 0, debris: 0, special: 0 };

  if (depositType === 'all') {
    depositedResources = { ...currentResources };
    updatedResources = { food: 0, debris: 0, special: 0 };
  } else {
    depositedResources[depositType] = currentResources[depositType] || 0;
    updatedResources[depositType] = 0;
  }

  // Transférer les ressources vers le score accumulé
  const currentScore = context.score?.resources || { food: 0, debris: 0, special: 0 };
  const updatedScore = { ...currentScore };
  Object.entries(depositedResources).forEach(([type, amount]) => {
    if (amount > 0) {
      updatedScore[type] = (updatedScore[type] || 0) + amount;
    }
  });

  const totalDeposited = Object.values(depositedResources).reduce((sum, val) => sum + val, 0);
  fsmLogger.resources(`[${context.entityId}] Deposit successful: +${JSON.stringify(depositedResources)} -> Total Score: ${JSON.stringify(updatedScore)}`);

  return {
    ...context,
    vehicle: {
      ...vehicle,
      resources: updatedResources,
      lastDepositTime: Date.now()
    },
    score: {
      ...context.score,
      resources: updatedScore
    },
    depositedResources: {
      type: depositType,
      resources: depositedResources,
      totalAmount: totalDeposited,
      timestamp: Date.now()
    },
    timestamps: {
      ...context.timestamps,
      lastDeposit: Date.now()
    },
    lastAction: 'shipDepositResources_success'
  };
};

/**
 * Dépose toutes les ressources du ship à la base avec logging spécialisé
 */
export const shipDepositResourcesAtBase = (context) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return { ...context, error: 'Cannot deposit at base: no ship found' };
  }

  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const totalToDeposit = Object.values(currentResources).reduce((sum, val) => sum + val, 0);
  
  if (totalToDeposit === 0) {
    fsmLogger.resources(`[${context.entityId}] No resources to deposit at base`);
    return {
      ...context,
      lastAction: 'shipDepositResourcesAtBase_no_resources'
    };
  }

  // Utiliser l'action générale de dépôt
  const depositResult = shipDepositResources(context, { resourceType: 'all' });
  
  // Ajouter des métadonnées spécifiques au dépôt à la base
  return {
    ...depositResult,
    timestamps: {
      ...depositResult.timestamps,
      lastBaseDeposit: Date.now()
    },
    stats: {
      ...context.stats,
      baseDeposits: (context.stats?.baseDeposits || 0) + 1,
      totalResourcesDeposited: (context.stats?.totalResourcesDeposited || 0) + totalToDeposit
    },
    lastAction: 'shipDepositResourcesAtBase_success'
  };
};

/**
 * Met à jour l'inventaire du ship
 */
export const shipUpdateInventory = (context, event) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return { ...context, error: 'Cannot update inventory: no ship found' };
  }

  if (!event.inventory || typeof event.inventory !== 'object') {
    return { ...context, error: 'Cannot update inventory: invalid inventory data' };
  }

  const updatedResources = {
    food: Math.max(0, Number(event.inventory.food) || 0),
    debris: Math.max(0, Number(event.inventory.debris) || 0),
    special: Math.max(0, Number(event.inventory.special) || 0)
  };

  return {
    ...context,
    vehicle: {
      ...vehicle,
      resources: updatedResources,
      lastInventoryUpdate: Date.now()
    },
    lastAction: 'shipUpdateInventory_success'
  };
};

/**
 * Vérifie si le ship doit retourner à la base pour déposer les ressources
 */
export const shipShouldReturnToBase = (context) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return false;
  }

  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  
  // Force l'utilisation des nouvelles capacités depuis constants.js
  const maxCapacity = DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP] || { food: 200, debris: 1800, special: 3 };
  
  // Seuil configurable de retour à la base (80% par défaut)
  const threshold = RESOURCE_CONSTANTS.RETURN_TO_BASE_THRESHOLD;
  
  // Vérifier si une des capacités individuelles atteint le seuil
  const capacityChecks = {
    food: (currentResources.food || 0) >= (maxCapacity.food || 200) * threshold,
    debris: (currentResources.debris || 0) >= (maxCapacity.debris || 1800) * threshold,
    special: (currentResources.special || 0) >= (maxCapacity.special || 3) * threshold
  };
  
  const anyCapacityNearFull = Object.values(capacityChecks).some(isFull => isFull);
  
  // Pour les logs, calculer le total pour comparaison
  const totalResources = Object.values(currentResources).reduce((sum, val) => sum + val, 0);
  const totalMaxCapacity = Object.values(maxCapacity).reduce((sum, val) => sum + val, 0);
  const globalCapacityPercentage = totalMaxCapacity > 0 ? Math.round((totalResources / totalMaxCapacity) * 100) : 0;
  
  if (anyCapacityNearFull) {
    // Calculer les pourcentages individuels pour un meilleur diagnostic
    const individualPercentages = {
      food: Math.round(((currentResources.food || 0) / (maxCapacity.food || 200)) * 100),
      debris: Math.round(((currentResources.debris || 0) / (maxCapacity.debris || 1800)) * 100),
      special: Math.round(((currentResources.special || 0) / (maxCapacity.special || 3)) * 100)
    };
    
    const detailedCapacity = `F:${individualPercentages.food}% D:${individualPercentages.debris}% S:${individualPercentages.special}%`;
    
    fsmLogger.resources(`[${context.entityId}] Ship should return to base: ${JSON.stringify(currentResources)} (${globalCapacityPercentage}% full - ${detailedCapacity}) - Threshold: ${Math.round(threshold * 100)}%`, {
      currentResources,
      maxCapacity,
      capacityChecks,
      individualPercentages,
      totalResources,
      totalMaxCapacity,
      vehicleMaxCapacityOriginal: vehicle.maxCapacity
    });
  }
  
  return anyCapacityNearFull;
};

/**
 * Initie le retour du ship vers la base pour déposer les ressources
 */
export const shipReturnToBase = (context) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return { ...context, error: 'Cannot return to base: no ship found' };
  }

  const basePosition = vehicle.basePosition;
  if (!basePosition) {
    return { ...context, error: 'Cannot return to base: no base position found' };
  }

  fsmLogger.resources(`[${context.entityId}] Ship returning to base from ${JSON.stringify(vehicle.coord)} to deposit resources`);

  return {
    ...context,
    vehicle: {
      ...vehicle,
      targetTile: {
        position: basePosition,
        coord: { x: 0, z: 0 } // Position de la base (peut être ajustée)
      },
      isMoving: true,
      progress: 0,
      startCoord: vehicle.coord
    },
    currentAction: 'returning_to_base',
    lastAction: 'shipReturnToBase_initiated'
  };
};

// ============================================================================
// 🎯 ACTIONS CYCLE D'EXPLORATION MULTI-TUILES
// ============================================================================

/**
 * Sélectionne la meilleure tuile pour la collecte
 * Utilise les priorités configurées pour trier les tuiles par valeur
 * @param {Object} context - Contexte FSM actuel
 * @param {Object} event - Événement (non utilisé)
 * @returns {Object} - Contexte mis à jour avec selectedTileForCollection
 */
export const selectBestTileForCollection = (context, event) => {
  const allKnownTiles = Array.from(context.memory.knownTiles.values());
  
  // Filtrer les tuiles collectibles, en excluant la tuile précédemment collectée si le vaisseau est plein
  const currentVehicle = context.vehicle;
  const isShipFull = currentVehicle && shipShouldReturnToBase(context, null);
  const lastCollectedTile = context.selectedTileCoord;
  
  const collectibleTiles = allKnownTiles
    .filter(tile => {
      // Conditions de base : explorée, a des ressources, pas complètement collectée
      if (!isTileAvailableForCollection(tile)) {
        return false;
      }
      
      // Si le vaisseau est plein et qu'on vient de collecter cette tuile, l'éviter
      if (isShipFull && lastCollectedTile === tile.coord) {
        return false;
      }
      
      // Éviter de re-collecter immédiatement la même tuile (cooldown de 5 secondes)
      if (tile.lastCollectedTimestamp && lastCollectedTile === tile.coord) {
        const timeSinceLastCollection = Date.now() - tile.lastCollectedTimestamp;
        if (timeSinceLastCollection < 5000) { // 5 secondes de cooldown
          return false;
        }
      }
      
      return true;
    });
  
  fsmLogger.resources(`[${context.entityId}] Selecting best tile for collection`, {
    totalKnownTiles: allKnownTiles.length,
    collectibleTiles: collectibleTiles.length,
    isShipFull,
    lastCollectedTile,
    tileStates: allKnownTiles.map(t => ({
      coord: t.coord,
      explored: t.explored,
      hasResources: t.hasResources,
      resourcePercentage: t.resourcePercentage,
      isCompletelyCollected: isTileCompletelyCollected(t),
      lastCollectedTimestamp: t.lastCollectedTimestamp,
      timeSinceLastCollection: t.lastCollectedTimestamp ? Date.now() - t.lastCollectedTimestamp : null,
      excludedByCapacity: (isShipFull && lastCollectedTile === t.coord),
      excludedByCooldown: (t.lastCollectedTimestamp && lastCollectedTile === t.coord && (Date.now() - t.lastCollectedTimestamp) < 5000)
    }))
  });
  
  if (collectibleTiles.length === 0) {
    return { 
      ...context, 
      error: 'No collectible tiles available',
      lastAction: 'selectBestTileForCollection_failed'
    };
  }
  
  // Trier par total des ressources (utilise les priorités configurées)
  const sortedTiles = collectibleTiles.sort((a, b) => {
    const getTotalValue = (tile) => {
      const res = tile.resources || {};
      const priorities = EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES;
      return (res.special || 0) * priorities.special + 
             (res.food || 0) * priorities.food + 
             (res.debris || 0) * priorities.debris;
    };
    return getTotalValue(b) - getTotalValue(a);
  });

  const selectedTile = sortedTiles[0];
  
  // Vérifier que la tuile a bien une position (maintenant incluse lors de l'exploration)
  if (!selectedTile.position) {
    fsmLogger.error(`[${context.entityId}] Selected tile ${selectedTile.coord} has no position data`);
    return { 
      ...context, 
      error: 'Selected tile has no position data',
      lastAction: 'selectBestTileForCollection_failed'
    };
  }
  
  fsmLogger.resources(`[${context.entityId}] Selected tile ${selectedTile.coord} for collection: ${JSON.stringify(selectedTile.resources)}, position: ${JSON.stringify(selectedTile.position)}`);
  
  return {
    ...context,
    selectedTileForCollection: selectedTile,
    vehicle: {
      ...context.vehicle,
      targetPosition: selectedTile.position,
      targetTile: selectedTile
    },
    targetPosition: selectedTile.position, // Pour compatibilité avec l'animation
    lastAction: 'selectBestTileForCollection_success'
  };
};

/**
 * Remet à zéro les statistiques du cycle d'exploration
 * Permet de commencer un nouveau cycle d'exploration
 * @param {Object} context - Contexte FSM actuel
 * @param {Object} event - Événement (non utilisé)
 * @returns {Object} - Contexte mis à jour avec stats remises à zéro
 */
export const resetExplorationCycleStats = (context, event) => {
  fsmLogger.logInfo('resetExplorationCycleStats', 'Resetting exploration cycle stats for new cycle');
  
  return {
    ...context,
    memory: {
      ...context.memory,
      stats: {
        ...context.memory.stats,
        tilesExplored: 0, // Reset pour nouveau cycle
        cycleStartTime: Date.now()
      }
    },
    lastAction: 'resetExplorationCycleStats_success'
  };
};

// ============================================================================
// EXPORTS ORGANISÉS
// ============================================================================

/**
 * Groupe principal des actions ship
 */
export const shipCollectingActions = {
  shipCollectsFromTile,
  shipMoveToTile,
  shipStopMovement,
  shipUpdateProgress,
  shipUpdatePosition,
  shipCompleteMovement,
  shipCreateWithCapacities,
  shipDepositResources,
  shipUpdateInventory,
  
  // Nouvelles actions pour cycle d'exploration multi-tuiles
  selectBestTileForCollection,
  resetExplorationCycleStats,
  shipShouldReturnToBase,
  shipDepositResourcesAtBase,
  shipReturnToBase,
  shipReturnToBase,
  shipReturnToBase
};

/**
 * Export par défaut avec structure organisée
 */
export default {
  // Actions principales
  actions: shipCollectingActions,
  
  // Utilitaires
  utils: {
    validateTargetTile,
    calculateDistance,
    clamp
  }
};
