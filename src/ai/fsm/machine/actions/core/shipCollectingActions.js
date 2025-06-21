/**
 * ============================================================================
 * SHIP COLLECTING ACTIONS CORE - Actions de collecte des ships
 * ============================================================================
 * 
 * Actions pures pour la collecte de ressources par les ships.
 * Ces fonctions gèrent le mouvement, la collecte et le transport de ressources.
 * 
 * 📋 FONCTIONS DISPONIBLES DANS CE FICHIER:
 * ==========================================
 * 
 * 🚢 ACTIONS SHIP (shipCollectingActions):
 * - shipMoveToTile(context, event) : Initie mouvement ship vers tuile cible
 * - shipStopMovement(context) : Arrête le mouvement ship en cours
 * - shipUpdateProgress(context, event) : Met à jour progression ship (0-100)
 * - shipUpdatePosition(context, event) : Met à jour position ship + sync drones
 * - shipCompleteMovement(context) : Finalise un mouvement ship
 * - shipCreateWithCapacities(context, event) : Crée ship avec capacités
 * - shipCollectResource(context, event) : Collecte ressource sur position
 * - shipDepositResources(context, event) : Dépose ressources à la base
 * - shipUpdateInventory(context, event) : Met à jour l'inventaire ship
 * 
 * 🔄 RÉTROCOMPATIBILITÉ (movementActions, shipMovementActions, entityMovementActions):
 * - moveToTile(context, event) : Initie mouvement vers tuile cible
 * - stopMovement(context) : Arrête le mouvement en cours
 * - updateProgress(context, event) : Met à jour progression (0-100)
 * - updatePosition(context, event) : Met à jour position + sync drones
 * - completeMovement(context) : Finalise un mouvement
 * - createVehicleWithCapacities(context, event) : Crée véhicule avec capacités
 * 
 * 🔧 UTILITAIRES INTERNES:
 * - validateTargetTile(tile) : Validation tuile cible
 * - calculateDistance(coord1, coord2) : Distance Manhattan
 * - clamp(value, min, max) : Contraindre valeur
 * - validateVehicle(vehicle) : Validation véhicule
 * - validateUpdates(updates) : Validation mises à jour
 * - combineVehicleUpdates(...updates) : Combine mises à jour
 * - filterVehicles(vehicles, predicate) : Filtre véhicules
 * - validateVehicleIntegrity(vehicle) : Validation intégrité
 * 
 * @author Migration FSM - Actions Métier
 * @version 3.0.0
 */

import fsmLogger from '../../../../../logger/fsmLogger.js';
import { VEHICLE_TYPES, DEFAULT_VEHICLE_STATE, DEFAULT_CAPACITIES } from '../../constants/constants.js';

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

/**
 * Validation et normalisation des propriétés d'un véhicule
 */
const validateVehicle = (vehicle) => {
  if (!vehicle || typeof vehicle !== 'object') {
    throw new Error('Vehicle must be a valid object');
  }

  if (!vehicle.id) {
    throw new Error('Vehicle must have an id');
  }

  if (!vehicle.type || !Object.values(VEHICLE_TYPES).includes(vehicle.type)) {
    throw new Error(`Invalid vehicle type. Must be one of: ${Object.values(VEHICLE_TYPES).join(', ')}`);
  }

  return {
    ...DEFAULT_VEHICLE_STATE,
    ...vehicle,
    health: Math.max(0, Math.min(100, Number(vehicle.health) || 100)),
    shield: Math.max(0, Number(vehicle.shield) || 0),
    speed: Math.max(0.1, Number(vehicle.speed) || 1)
  };
};

/**
 * Validation et normalisation des mises à jour de propriétés
 */
const validateUpdates = (updates) => {
  if (!updates || typeof updates !== 'object') {
    return {};
  }

  const validated = { ...updates };

  if (validated.health !== undefined) {
    validated.health = Math.max(0, Math.min(100, Number(validated.health)));
  }
  
  if (validated.shield !== undefined) {
    validated.shield = Math.max(0, Number(validated.shield));
  }
  
  if (validated.speed !== undefined) {
    validated.speed = Math.max(0.1, Number(validated.speed));
  }

  if (validated.isMoving !== undefined) {
    validated.isMoving = Boolean(validated.isMoving);
  }
  
  if (validated.active !== undefined) {
    validated.active = Boolean(validated.active);
  }

  return validated;
};

// ============================================================================
// 🚢 SHIP COLLECTING ACTIONS - Actions principales avec préfixes ship
// ============================================================================

/**
 * Actions de collecte spécialisées pour ships avec nommage explicite
 */
export const shipCollectingActions = {
  
  /**
   * Initie le mouvement du ship vers une tuile cible
   */
  shipMoveToTile: (context, event) => {
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
        }
      };
    } catch (error) {
      return { ...context, error: error.message, lastAction: 'shipMoveToTile_failed' };
    }
  },

  /**
   * Arrête le mouvement du ship en cours
   */
  shipStopMovement: (context) => ({
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
    }
  }),

  /**
   * Met à jour la progression du mouvement du ship
   */
  shipUpdateProgress: (context, event) => {
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
      }
    };
  },

  /**
   * Met à jour la position actuelle du ship ET synchronise les drones ancrés
   */
  shipUpdatePosition: (context, event) => {
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
      vehicle: updatedVehicle
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
  },

  /**
   * Finalise un mouvement du ship (position atteinte)
   */
  shipCompleteMovement: (context) => ({
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
    }
  }),

  /**
   * Crée un ship avec capacités par défaut selon son type
   */
  shipCreateWithCapacities: (context, event) => {
    const vehicle = validateVehicle(event.vehicleData);
    const defaultCapacity = DEFAULT_CAPACITIES[vehicle.type] || DEFAULT_CAPACITIES[VEHICLE_TYPES.SHIP];
    
    const vehicleWithCapacities = {
      ...vehicle,
      maxCapacity: vehicle.maxCapacity || defaultCapacity,
      resources: vehicle.resources || { food: 0, debris: 0, special: 0 }
    };

    return {
      ...context,
      vehicle: vehicleWithCapacities
    };
  },

  // ========================================================================
  // 🚢 NOUVELLES ACTIONS COLLECTE - Spécialisées pour ships
  // ========================================================================

  /**
   * Collecte une ressource sur la position actuelle du ship
   */
  shipCollectResource: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle) {
      return { ...context, error: 'Cannot collect: no ship found' };
    }

    if (!event.resource) {
      return { ...context, error: 'Cannot collect: no resource specified' };
    }

    const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
    const resourceType = event.resource.type || 'debris';
    const resourceAmount = Number(event.resource.amount) || 1;
    
    // Vérifier la capacité
    const totalCurrent = Object.values(currentResources).reduce((sum, val) => sum + val, 0);
    const maxCapacity = vehicle.maxCapacity || DEFAULT_CAPACITIES[VEHICLE_TYPES.SHIP];
    
    if (totalCurrent + resourceAmount > maxCapacity) {
      return { ...context, error: 'Cannot collect: ship capacity full' };
    }

    const updatedResources = {
      ...currentResources,
      [resourceType]: (currentResources[resourceType] || 0) + resourceAmount
    };

    return {
      ...context,
      vehicle: {
        ...vehicle,
        resources: updatedResources,
        lastCollectionTime: Date.now()
      },
      lastAction: 'shipCollectResource_success'
    };
  },

  /**
   * Dépose les ressources du ship à la base
   */
  shipDepositResources: (context, event) => {
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
  },

  /**
   * Met à jour l'inventaire du ship
   */
  shipUpdateInventory: (context, event) => {
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
  }
};

// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Actions héritées (utilise shipCollectingActions)
// ============================================================================

/**
 * Actions de mouvement ship héritées
 * @deprecated Utilisez shipCollectingActions avec préfixes explicites
 */
export const shipMovementActions = {
  /**
   * Initie le mouvement du ship vers une tuile cible
   * @deprecated Utilisez shipCollectingActions.shipMoveToTile
   */
  moveShipToTile: (context, event) => shipCollectingActions.shipMoveToTile(context, event),

  /**
   * Arrête le mouvement du ship en cours
   * @deprecated Utilisez shipCollectingActions.shipStopMovement
   */
  stopShipMovement: (context) => shipCollectingActions.shipStopMovement(context),

  /**
   * Met à jour la progression du mouvement du ship
   * @deprecated Utilisez shipCollectingActions.shipUpdateProgress
   */
  updateShipProgress: (context, event) => shipCollectingActions.shipUpdateProgress(context, event),

  /**
   * Met à jour la position actuelle du ship ET synchronise les drones ancrés
   * @deprecated Utilisez shipCollectingActions.shipUpdatePosition
   */
  updateShipPosition: (context, event) => shipCollectingActions.shipUpdatePosition(context, event),

  /**
   * Finalise un mouvement du ship (position atteinte)
   * @deprecated Utilisez shipCollectingActions.shipCompleteMovement
   */
  completeShipMovement: (context) => shipCollectingActions.shipCompleteMovement(context),

  /**
   * Crée un ship avec capacités par défaut selon son type
   * @deprecated Utilisez shipCollectingActions.shipCreateWithCapacities
   */
  createShipWithCapacities: (context, event) => shipCollectingActions.shipCreateWithCapacities(context, event)
};

/**
 * Actions entity génériques héritées
 * @deprecated Utilisez shipCollectingActions selon le contexte
 */
export const entityMovementActions = {
  /**
   * Initie le mouvement vers une tuile cible
   * @deprecated Utilisez shipCollectingActions.shipMoveToTile
   */
  moveEntityToTile: (context, event) => shipCollectingActions.shipMoveToTile(context, event),

  /**
   * Arrête le mouvement en cours
   * @deprecated Utilisez shipCollectingActions.shipStopMovement
   */
  stopEntityMovement: (context) => shipCollectingActions.shipStopMovement(context),

  /**
   * Met à jour la progression du mouvement
   * @deprecated Utilisez shipCollectingActions.shipUpdateProgress
   */
  updateEntityProgress: (context, event) => shipCollectingActions.shipUpdateProgress(context, event),

  /**
   * Met à jour la position actuelle du véhicule
   * @deprecated Utilisez shipCollectingActions.shipUpdatePosition
   */
  updateEntityPosition: (context, event) => shipCollectingActions.shipUpdatePosition(context, event),

  /**
   * Finalise un mouvement (position atteinte)
   * @deprecated Utilisez shipCollectingActions.shipCompleteMovement
   */
  completeEntityMovement: (context) => shipCollectingActions.shipCompleteMovement(context),

  /**
   * Crée un véhicule avec capacités par défaut selon son type
   * @deprecated Utilisez shipCollectingActions.shipCreateWithCapacities
   */
  createEntityWithCapacities: (context, event) => shipCollectingActions.shipCreateWithCapacities(context, event)
};

/**
 * Actions de mouvement et véhicule pures - Compatible Bot et Player
 * @deprecated Utilisez shipCollectingActions avec préfixes explicites
 */
export const movementActions = {
  
  /**
   * Initie le mouvement vers une tuile cible
   * @deprecated Utilisez shipCollectingActions.shipMoveToTile
   */
  moveToTile: (context, event) => shipCollectingActions.shipMoveToTile(context, event),

  /**
   * Arrête le mouvement en cours
   * @deprecated Utilisez shipCollectingActions.shipStopMovement
   */
  stopMovement: (context) => shipCollectingActions.shipStopMovement(context),

  /**
   * Met à jour la progression du mouvement
   * @deprecated Utilisez shipCollectingActions.shipUpdateProgress
   */
  updateProgress: (context, event) => shipCollectingActions.shipUpdateProgress(context, event),

  /**
   * Met à jour la position actuelle du véhicule ET synchronise les drones ancrés
   * @deprecated Utilisez shipCollectingActions.shipUpdatePosition
   */
  updatePosition: (context, event) => shipCollectingActions.shipUpdatePosition(context, event),

  /**
   * Finalise un mouvement (position atteinte)
   * @deprecated Utilisez shipCollectingActions.shipCompleteMovement
   */
  completeMovement: (context) => shipCollectingActions.shipCompleteMovement(context),

  /**
   * Crée un véhicule avec capacités par défaut selon son type
   * @deprecated Utilisez shipCollectingActions.shipCreateWithCapacities
   */
  createVehicleWithCapacities: (context, event) => shipCollectingActions.shipCreateWithCapacities(context, event)
};

// ============================================================================
// EVENTS SPÉCIALISÉS NÉCESSAIRES
// ============================================================================

export const shipCollectingEvents = {
  /**
   * Crée un événement de mise à jour de position du vaisseau
   * @param {Object} position - Position 3D du vaisseau
   * @param {string} entityType - Type d'entité ('ship')
   * @param {string} tileCoord - Coordonnée de tuile
   * @param {string} newCoord - Nouvelle coordonnée
   * @returns {Object} - Événement formaté
   */
  createShipUpdatePositionEvent: (position, entityType = 'ship', tileCoord, newCoord) => ({
    type: 'SHIP_UPDATE_POSITION',
    position,
    entityType,
    tileCoord,
    newCoord,
    timestamp: Date.now()
  }),

  /**
   * Crée un événement de collecte de ressource
   * @param {Object} resource - Ressource collectée
   * @returns {Object} - Événement formaté
   */
  createShipCollectResourceEvent: (resource) => ({
    type: 'SHIP_COLLECT_RESOURCE',
    resource,
    timestamp: Date.now()
  }),

  /**
   * Crée un événement de dépôt de ressources
   * @param {string} resourceType - Type de ressource à déposer
   * @returns {Object} - Événement formaté
   */
  createShipDepositResourcesEvent: (resourceType = 'all') => ({
    type: 'SHIP_DEPOSIT_RESOURCES',
    resourceType,
    timestamp: Date.now()
  })
};

// ============================================================================
// UTILITAIRES PUBLICS
// ============================================================================

/**
 * Combine plusieurs mises à jour de véhicule
 */
export const combineVehicleUpdates = (...updates) => {
  return updates.reduce((combined, update) => ({
    ...combined,
    ...validateUpdates(update)
  }), {});
};

/**
 * Filtre les véhicules par état
 */
export const filterVehicles = (vehicles, predicate) => {
  return Object.entries(vehicles)
    .filter(([_, vehicle]) => predicate(vehicle))
    .reduce((filtered, [id, vehicle]) => {
      filtered[id] = vehicle;
      return filtered;
    }, {});
};

/**
 * Valide l'intégrité d'un véhicule
 */
export const validateVehicleIntegrity = (vehicle) => {
  const errors = [];
  const warnings = [];

  if (!vehicle?.id) errors.push('Missing vehicle ID');
  if (!vehicle?.type) errors.push('Missing vehicle type');
  if ((vehicle?.health || 0) < 0 || (vehicle?.health || 0) > 100) warnings.push('Health out of range');
  if ((vehicle?.speed || 0) <= 0) warnings.push('Invalid speed value');

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Events héritées
// ============================================================================

/**
 * Events de mouvement héritées
 * @deprecated Utilisez shipCollectingEvents
 */
export const movementEvents = {
  createShipUpdatePositionEvent: shipCollectingEvents.createShipUpdatePositionEvent
};

// ============================================================================
// EXPORT PAR DÉFAUT - NOUVELLES ACTIONS MÉTIER
// ============================================================================

export default {
  // Actions principales - nouvelles avec préfixes
  actions: shipCollectingActions,
  
  // Actions de rétrocompatibilité
  shipActions: shipMovementActions,
  entityActions: entityMovementActions,
  movementActions: movementActions,
  
  // Events spécialisés
  events: shipCollectingEvents,
  movementEvents: movementEvents, // Rétrocompatibilité
  
  // Utilitaires
  utils: {
    validateTargetTile,
    calculateDistance,
    clamp,
    combineVehicleUpdates,
    filterVehicles,
    validateVehicleIntegrity,
    validateVehicle,
    validateUpdates
  }
};
