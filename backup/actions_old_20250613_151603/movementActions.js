/**
 * ============================================================================
 * MOVEMENT & VEHICLE ACTIONS CORE - Actions pures et partagées
 * ============================================================================
 * 
 * Actions de mouvement et véhicule pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * 📋 FONCTIONS DISPONIBLES DANS CE FICHIER:
 * ==========================================
 * 
 * 🚢 ACTIONS SHIP (shipMovementActions):
 * - moveShipToTile(context, event) : Initie mouvement ship vers tuile cible
 * - stopShipMovement(context) : Arrête le mouvement ship en cours
 * - updateShipProgress(context, event) : Met à jour progression ship (0-100)
 * - updateShipPosition(context, event) : Met à jour position ship + sync drones
 * - completeShipMovement(context) : Finalise un mouvement ship
 * - createShipWithCapacities(context, event) : Crée ship avec capacités
 * 
 * 🔧 ACTIONS ENTITY (entityMovementActions):
 * - moveEntityToTile(context, event) : Initie mouvement entity vers tuile cible
 * - stopEntityMovement(context) : Arrête le mouvement entity en cours
 * - updateEntityProgress(context, event) : Met à jour progression entity (0-100)
 * - updateEntityPosition(context, event) : Met à jour position entity
 * - completeEntityMovement(context) : Finalise un mouvement entity
 * - createEntityWithCapacities(context, event) : Crée entity avec capacités
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
 * ❌ FONCTIONNALITÉS COMMENTÉES (Éviter confusion/conflits):
 * - Guards (movementGuards) - COMMENTÉS
 * - Selectors (movementSelectors) - COMMENTÉS  
 * - Events (movementEvents) - COMMENTÉS (sauf createShipUpdatePositionEvent)
 * 
 * Consolidation de movement.js et vehicle.js
 * 
 * @author Migration FSM
 * @version 2.0.0
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
// 🚢 SHIP MOVEMENT ACTIONS - Actions spécialisées pour ships
// ============================================================================

/**
 * Actions de mouvement spécialisées pour ships avec synchronisation automatique des drones
 */
export const shipMovementActions = {
  
  /**
   * Initie le mouvement du ship vers une tuile cible
   */
  moveShipToTile: (context, event) => {
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
      return { ...context, error: error.message, lastAction: 'moveShipToTile_failed' };
    }
  },

  /**
   * Arrête le mouvement du ship en cours
   */
  stopShipMovement: (context) => ({
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
  updateShipProgress: (context, event) => {
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
  updateShipPosition: (context, event) => {
    const hasValidData = event.position || event.coord || event.newCoord;
    
    if (!hasValidData) {
      fsmLogger.error(`❌ [updateShipPosition] No position data found in event:`, {
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
  completeShipMovement: (context) => ({
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
  createShipWithCapacities: (context, event) => {
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
  }
};

// ============================================================================
// 🔧 ENTITY MOVEMENT ACTIONS - Actions génériques pour toute entité
// ============================================================================

/**
 * Actions de mouvement génériques compatibles Bot et Player
 */
export const entityMovementActions = {
  
  /**
   * Initie le mouvement vers une tuile cible
   */
  moveEntityToTile: (context, event) => {
    try {
      const validatedTile = validateTargetTile(event.targetTile);
      
      const vehicle = context.vehicle;
      if (!vehicle) {
        return { ...context, error: 'Cannot move: no vehicle found' };
      }
      
      if (vehicle.isMoving) {
        return { ...context, error: 'Cannot move: vehicle is already moving' };
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
      return { ...context, error: error.message, lastAction: 'moveEntityToTile_failed' };
    }
  },

  /**
   * Arrête le mouvement en cours
   */
  stopEntityMovement: (context) => ({
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
   * Met à jour la progression du mouvement
   */
  updateEntityProgress: (context, event) => {
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
   * Met à jour la position actuelle du véhicule
   */
  updateEntityPosition: (context, event) => {
    const hasValidData = event.position || event.coord || event.newCoord;
    
    if (!hasValidData) {
      fsmLogger.error(`❌ [updateEntityPosition] No position data found in event:`, {
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
    }

    return {
      ...context,
      vehicle: updatedVehicle
    };
  },

  /**
   * Finalise un mouvement (position atteinte)
   */
  completeEntityMovement: (context) => ({
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
   * Crée un véhicule avec capacités par défaut selon son type
   */
  createEntityWithCapacities: (context, event) => {
    const vehicle = validateVehicle(event.vehicleData);
    const defaultCapacity = DEFAULT_CAPACITIES[vehicle.type] || DEFAULT_CAPACITIES[VEHICLE_TYPES.DRONE];
    
    const vehicleWithCapacities = {
      ...vehicle,
      maxCapacity: vehicle.maxCapacity || defaultCapacity,
      resources: vehicle.resources || { food: 0, debris: 0, special: 0 }
    };

    return {
      ...context,
      vehicle: vehicleWithCapacities
    };
  }
};

// ============================================================================
// 🔄 RÉTROCOMPATIBILITÉ - Actions héritées (utilise shipMovementActions)
// ============================================================================

/**
 * Actions de mouvement et véhicule pures - Compatible Bot et Player
 * @deprecated Utilisez shipMovementActions ou entityMovementActions selon le contexte
 */
export const movementActions = {
  
  /**
   * Initie le mouvement vers une tuile cible
   * @deprecated Utilisez shipMovementActions.moveShipToTile ou entityMovementActions.moveEntityToTile
   */
  moveToTile: (context, event) => shipMovementActions.moveShipToTile(context, event),

  /**
   * Arrête le mouvement en cours
   * @deprecated Utilisez shipMovementActions.stopShipMovement ou entityMovementActions.stopEntityMovement
   */
  stopMovement: (context) => shipMovementActions.stopShipMovement(context),

  /**
   * Met à jour la progression du mouvement
   * @deprecated Utilisez shipMovementActions.updateShipProgress ou entityMovementActions.updateEntityProgress
   */
  updateProgress: (context, event) => shipMovementActions.updateShipProgress(context, event),

  /**
   * Met à jour la position actuelle du véhicule ET synchronise les drones ancrés
   * @deprecated Utilisez shipMovementActions.updateShipPosition ou entityMovementActions.updateEntityPosition
   */
  updatePosition: (context, event) => shipMovementActions.updateShipPosition(context, event),

  /**
   * Finalise un mouvement (position atteinte)
   * @deprecated Utilisez shipMovementActions.completeShipMovement ou entityMovementActions.completeEntityMovement
   */
  completeMovement: (context) => shipMovementActions.completeShipMovement(context),

  /**
   * Crée un véhicule avec capacités par défaut selon son type
   * @deprecated Utilisez shipMovementActions.createShipWithCapacities ou entityMovementActions.createEntityWithCapacities
   */
  createVehicleWithCapacities: (context, event) => shipMovementActions.createShipWithCapacities(context, event)
};

// ============================================================================
// EVENTS SPÉCIALISÉS NÉCESSAIRES
// ============================================================================

export const movementEvents = {
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
// ✅ GUARDS MOVED TO guards/core/movementGuard.js
// ============================================================================

/**
 * Les guards de mouvement ont été déplacés vers guards/core/movementGuard.js
 * pour une meilleure architecture. Plus d'exports temporaires nécessaires.
 */

// ============================================================================
// ✅ GUARDS & SELECTORS MOVED TO guards/core/movementGuard.js  
// ============================================================================

/**
 * Les guards et selectors de mouvement ont été déplacés vers guards/core/movementGuard.js
 * pour une meilleure architecture. Plus d'exports temporaires nécessaires.
 */

// ============================================================================
// EXPORT PAR DÉFAUT - SIMPLIFIÉ
// ============================================================================

export default {
  // Actions principales
  actions: movementActions,
  shipActions: shipMovementActions,
  entityActions: entityMovementActions,
  
  // Events spécialisés
  events: movementEvents, // Seulement createShipUpdatePositionEvent
  
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
