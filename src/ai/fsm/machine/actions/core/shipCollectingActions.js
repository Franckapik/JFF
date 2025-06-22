/**
 * ============================================================================
 * SHIP COLLECTING ACTIONS CORE - Actions de collecte des ships (SIMPLIFIÉ)
 * ============================================================================
 * 
 * Actions simplifiées pour la collecte de ressources par les ships.
 * Utilise la mémoire unifiée `knownTiles` au lieu des anciens systèmes.
 * 
 * 📋 ACTIONS PRINCIPALES:
 * =======================
 * 
 * 🚢 ACTION UNIFIÉE:
 * - shipCollectsFromTile(context, event) : Ship collecte ressources d'une tuile explorée
 * 
 * 🚢 ACTIONS MOUVEMENT:
 * - shipMoveToTile(context, event) : Initie mouvement ship vers tuile cible
 * - shipStopMovement(context) : Arrête le mouvement ship en cours
 * - shipUpdateProgress(context, event) : Met à jour progression ship (0-100)
 * - shipUpdatePosition(context, event) : Met à jour position ship + sync drones
 * - shipCompleteMovement(context) : Finalise un mouvement ship
 * 
 * 🚢 ACTIONS INVENTAIRE:
 * - shipCreateWithCapacities(context, event) : Crée ship avec capacités
 * - shipDepositResources(context, event) : Dépose ressources à la base
 * - shipUpdateInventory(context, event) : Met à jour l'inventaire ship
 * 
 * @author Migration FSM - Simplification Mémoire
 * @version 4.0.0
 */

import fsmLogger from '../../../../../logger/fsmLogger.js';
import { VEHICLE_TYPES, DEFAULT_VEHICLE_STATE, DEFAULT_CAPACITIES } from '../../constants/constants.js';
import { EXPLORATION_CYCLE_CONFIG } from '../../constants/constants.js';

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
  const { coord, resourceType } = event;
  
  if (!coord) {
    return { 
      ...context, 
      error: 'Tile coordinate is required for collection',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  const vehicle = context.vehicle;
  if (!vehicle) {
    return { 
      ...context, 
      error: 'Cannot collect: no ship found',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  // Vérifier la mémoire unifiée
  const knownTiles = new Map(context.memory?.knownTiles || new Map());
  const tileData = knownTiles.get(coord);
  
  if (!tileData || !tileData.explored) {
    return { 
      ...context, 
      error: 'Cannot collect from unexplored tile',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  if (tileData.collected) {
    return { 
      ...context, 
      error: 'Tile already collected',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  if (!tileData.hasResources || !tileData.resources) {
    return { 
      ...context, 
      error: 'No resources available on this tile',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  // Calculer les ressources à collecter
  const resourcesToCollect = tileData.resources;
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const maxCapacity = vehicle.maxCapacity || DEFAULT_CAPACITIES[VEHICLE_TYPES.SHIP];
  
  // Vérifier la capacité
  const totalCurrent = Object.values(currentResources).reduce((sum, val) => sum + val, 0);
  const totalToCollect = Object.values(resourcesToCollect).reduce((sum, val) => sum + val, 0);
  
  if (totalCurrent + totalToCollect > maxCapacity) {
    return { 
      ...context, 
      error: 'Cannot collect: ship capacity would be exceeded',
      lastAction: 'shipCollectsFromTile_failed'
    };
  }
  
  // Mettre à jour les ressources du vaisseau
  const updatedResources = { ...currentResources };
  Object.entries(resourcesToCollect).forEach(([type, amount]) => {
    updatedResources[type] = (updatedResources[type] || 0) + amount;
  });
  
  // Marquer la tuile comme collectée dans la mémoire
  const updatedTileData = {
    ...tileData,
    collected: true,
    collectedAt: Date.now(),
    collectedBy: vehicle.id
  };
  knownTiles.set(coord, updatedTileData);
  
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
  
  return {
    ...context,
    vehicle: {
      ...vehicle,
      resources: updatedResources,
      lastCollectionTime: Date.now()
    },
    memory: {
      ...context.memory,
      knownTiles,
      stats: newStats
    },
    lastAction: 'shipCollectsFromTile_success'
  };
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
  const defaultCapacity = DEFAULT_CAPACITIES[vehicleData.type] || DEFAULT_CAPACITIES[VEHICLE_TYPES.SHIP];
  
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
  let depositedAmount = 0;

  if (depositType === 'all') {
    depositedAmount = Object.values(currentResources).reduce((sum, val) => sum + val, 0);
    updatedResources = { food: 0, debris: 0, special: 0 };
  } else {
    depositedAmount = currentResources[depositType] || 0;
    updatedResources[depositType] = 0;
  }

  return {
    ...context,
    vehicle: {
      ...vehicle,
      resources: updatedResources,
      lastDepositTime: Date.now()
    },
    depositedResources: {
      type: depositType,
      amount: depositedAmount,
      timestamp: Date.now()
    },
    lastAction: 'shipDepositResources_success'
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
  const collectibleTiles = Array.from(context.memory.knownTiles.values())
    .filter(tile => tile.explored && tile.hasResources && !tile.collected);
  
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
  
  // Calculer la valeur pour le log
  const bestTile = sortedTiles[0];
  const bestTileValue = (bestTile.resources?.special || 0) * EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES.special + 
                       (bestTile.resources?.food || 0) * EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES.food + 
                       (bestTile.resources?.debris || 0) * EXPLORATION_CYCLE_CONFIG.RESOURCE_PRIORITIES.debris;
  
  fsmLogger.info('🎯 [selectBestTileForCollection] Selected best tile', { 
    coord: bestTile.coord,
    value: bestTileValue,
    availableTiles: collectibleTiles.length,
    selectedTile: bestTile 
  });
  
  return {
    ...context,
    selectedTileForCollection: sortedTiles[0],
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
  resetExplorationCycleStats
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
