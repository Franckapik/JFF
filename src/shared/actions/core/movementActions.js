/**
 * ============================================================================
 * MOVEMENT & VEHICLE ACTIONS CORE - Actions pures et partagées
 * ============================================================================
 * 
 * Actions de mouvement et véhicule pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * Consolidation de movement.js et vehicle.js
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

// ============================================================================
// CONSTANTS ET TYPES - VÉHICULES
// ============================================================================

/**
 * Types de véhicules supportés
 */
export const VEHICLE_TYPES = {
  MAIN_SHIP: 'main-ship',
  DRONE: 'drone',
  SCOUT: 'scout',
  HARVESTER: 'harvester'
};

/**
 * États de véhicule par défaut
 */
export const DEFAULT_VEHICLE_STATE = {
  isMoving: false,
  speed: 1,
  health: 100,
  shield: 0,
  active: true
};

/**
 * Configuration par défaut des capacités
 */
export const DEFAULT_CAPACITIES = {
  [VEHICLE_TYPES.MAIN_SHIP]: { food: 100, debris: 1000, special: 2 },
  [VEHICLE_TYPES.DRONE]: { food: 20, debris: 50, special: 1 },
  [VEHICLE_TYPES.SCOUT]: { food: 10, debris: 20, special: 0 },
  [VEHICLE_TYPES.HARVESTER]: { food: 50, debris: 500, special: 1 }
};

// ============================================================================
// CONSTANTS ET HELPERS - MOUVEMENT
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
 * @param {number} value - Valeur à contraindre
 * @param {number} min - Valeur minimum
 * @param {number} max - Valeur maximum
 * @returns {number} - Valeur contrainte
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Calcule la distance entre deux coordonnées
 * @param {string} coord1 - Première coordonnée "x,y"
 * @param {string} coord2 - Deuxième coordonnée "x,y"
 * @returns {number} - Distance Manhattan
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
// VALIDATORS ET GUARDS
// ============================================================================

/**
 * Guards pour valider les conditions de mouvement
 */
export const movementGuards = {
  
  /**
   * Vérifie si un mouvement est possible
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement de mouvement
   * @returns {boolean} - True si mouvement possible
   */
  canMoveTo: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;
    
    // Vérifier si pas déjà en mouvement
    if (vehicle.isMoving) return false;
    
    // Vérifier la validité de la tuile cible
    try {
      validateTargetTile(event.targetTile);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Vérifie si un véhicule a assez de carburant pour un mouvement
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec targetTile
   * @returns {boolean} - True si assez de carburant
   */
  hasEnoughFuel: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle?.fuel || !vehicle?.coord || !event?.targetTile?.coord) {
      return false;
    }
    
    const distance = calculateDistance(vehicle.coord, event.targetTile.coord);
    const fuelRequired = distance * 2; // Facteur de consommation par défaut
    
    return vehicle.fuel >= fuelRequired;
  },

  /**
   * Vérifie si le mouvement est terminé
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si mouvement terminé
   */
  isMovementComplete: (context) => {
    const vehicle = context.vehicle;
    return vehicle?.progress >= 100 || 
           (vehicle?.coord === vehicle?.targetTile?.coord);
  },

  // ============================================================================
  // GUARDS VÉHICULE - Ajoutés lors de la consolidation avec vehicle.js
  // ============================================================================

  /**
   * Vérifie si un véhicule est actif
   * @param {Object} context - Contexte à vérifier
   * @returns {boolean} - True si le véhicule est actif
   */
  isVehicleActive: (context) => {
    return Boolean(context.vehicle?.active);
  },

  /**
   * Vérifie si un véhicule est opérationnel
   * @param {Object} context - Contexte à vérifier
   * @returns {boolean} - True si le véhicule est opérationnel
   */
  isVehicleOperational: (context) => {
    const vehicle = context.vehicle;
    return movementGuards.isVehicleActive(context) && (vehicle?.health || 0) > 0;
  },

  /**
   * Vérifie si un véhicule est endommagé
   * @param {Object} context - Contexte à vérifier
   * @returns {boolean} - True si le véhicule est endommagé
   */
  isVehicleDamaged: (context) => {
    return (context.vehicle?.health || 100) < 100;
  },

  /**
   * Vérifie si un véhicule est en état critique
   * @param {Object} context - Contexte à vérifier
   * @param {number} threshold - Seuil critique (défaut: 20)
   * @returns {boolean} - True si le véhicule est en état critique
   */
  isVehicleCritical: (context, threshold = 20) => {
    return (context.vehicle?.health || 100) <= threshold;
  },

  /**
   * Vérifie si un véhicule peut être utilisé
   * @param {Object} context - Contexte à vérifier
   * @returns {boolean} - True si le véhicule peut être utilisé
   */
  canUseVehicle: (context) => {
    return movementGuards.isVehicleOperational(context) && 
           !movementGuards.isVehicleCritical(context);
  },

  /**
   * Vérifie si un véhicule a un bouclier
   * @param {Object} context - Contexte à vérifier
   * @returns {boolean} - True si le véhicule a un bouclier
   */
  hasShield: (context) => {
    return (context.vehicle?.shield || 0) > 0;
  }
};

// ============================================================================
// ACTIONS PRINCIPALES
// ============================================================================

/**
 * Actions de mouvement et véhicule pures - Compatible Bot et Player
 */
export const movementActions = {
  
  /**
   * Initie le mouvement vers une tuile cible
   * @param {Object} context - Contexte contenant vehicle/player
   * @param {Object} event - Événement avec targetTile
   * @returns {Object} - Nouveau contexte avec véhicule mis à jour
   */
  moveToTile: (context, event) => {
    try {
      // Validation de la tuile cible
      const validatedTile = validateTargetTile(event.targetTile);
      
      // Vérifications avec les guards
      if (!movementGuards.canMoveTo(context, event)) {
        return {
          ...context,
          error: 'Cannot move: vehicle is already moving or invalid target',
          lastAction: 'moveToTile_failed'
        };
      }
      
      if (!movementGuards.hasEnoughFuel(context, event)) {
        return {
          ...context,
          error: 'Cannot move: insufficient fuel',
          lastAction: 'moveToTile_failed'
        };
      }
      
      return {
        ...context,
        vehicle: {
          ...context.vehicle,
          targetTile: validatedTile,
          isMoving: true,
          movementStartTime: Date.now(),
          progress: 0
        }
      };
    } catch (error) {
      // En cas d'erreur, retourner le contexte inchangé avec l'erreur
      return {
        ...context,
        error: error.message,
        lastAction: 'moveToTile_failed'
      };
    }
  },

  /**
   * Arrête le mouvement en cours
   * @param {Object} context - Contexte actuel
   * @returns {Object} - Nouveau contexte avec mouvement arrêté
   */
  stopMovement: (context) => ({
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
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec progress (0-100)
   * @returns {Object} - Nouveau contexte avec progression mise à jour
   */
  updateProgress: (context, event) => {
    // Valider et normaliser la progression
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
   * Met à jour la position actuelle du véhicule ET synchronise les drones ancrés
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec position, coord, newCoord
   * @returns {Object} - Nouveau contexte avec position mise à jour
   */
  updatePosition: (context, event) => {
    if (!event.newCoord && !event.coord && !event.position) {
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
   * Finalise un mouvement (position atteinte)
   * @param {Object} context - Contexte actuel
   * @returns {Object} - Nouveau contexte avec mouvement finalisé
   */
  completeMovement: (context) => ({
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
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec vehicleData
   * @returns {Object} - Nouveau contexte avec véhicule créé
   */
  createVehicleWithCapacities: (context, event) => {
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
// SELECTORS ET UTILITAIRES
// ============================================================================

export const movementSelectors = {
  
  /**
   * Vérifie si un véhicule est en mouvement
   * @param {Object} vehicle - Véhicule à vérifier
   * @returns {boolean} - True si en mouvement
   */
  isMoving: (vehicle) => Boolean(vehicle?.isMoving),

  /**
   * Obtient la destination actuelle
   * @param {Object} vehicle - Véhicule
   * @returns {Object|null} - Tuile cible ou null
   */
  getDestination: (vehicle) => vehicle?.targetTile || null,

  /**
   * Obtient la progression du mouvement
   * @param {Object} vehicle - Véhicule
   * @returns {number} - Progression 0-100
   */
  getProgress: (vehicle) => vehicle?.progress || 0,

  /**
   * Calcule le temps écoulé depuis le début du mouvement
   * @param {Object} vehicle - Véhicule
   * @returns {number} - Temps en millisecondes, 0 si pas de mouvement
   */
  getMovementDuration: (vehicle) => {
    if (!vehicle?.movementStartTime) return 0;
    return Date.now() - vehicle.movementStartTime;
  },

  /**
   * Vérifie si le véhicule peut se déplacer (pas déjà en mouvement)
   * @param {Object} vehicle - Véhicule
   * @returns {boolean} - True si peut se déplacer
   */
  canStartMovement: (vehicle) => !movementSelectors.isMoving(vehicle),

  /**
   * Calcule la distance vers la destination
   * @param {Object} vehicle - Véhicule
   * @returns {number} - Distance ou 0
   */
  getDistanceToTarget: (vehicle) => {
    if (!vehicle?.coord || !vehicle?.targetTile?.coord) return 0;
    return calculateDistance(vehicle.coord, vehicle.targetTile.coord);
  },

  /**
   * Récupère l'état complet d'un véhicule
   * @param {Object} vehicle - Véhicule source
   * @returns {Object} - État complet du véhicule
   */
  getVehicleStatus: (vehicle) => {
    return {
      id: vehicle?.id,
      type: vehicle?.type,
      active: Boolean(vehicle?.active),
      operational: Boolean(vehicle?.active && (vehicle?.health || 0) > 0),
      moving: Boolean(vehicle?.isMoving),
      damaged: (vehicle?.health || 100) < 100,
      critical: (vehicle?.health || 100) <= 20,
      health: vehicle?.health || 100,
      shield: vehicle?.shield || 0,
      speed: vehicle?.speed || 1
    };
  },

  /**
   * Calcule le pourcentage de santé d'un véhicule
   * @param {Object} vehicle - Véhicule source
   * @returns {number} - Pourcentage de santé (0-100)
   */
  getHealthPercentage: (vehicle) => {
    return Math.max(0, Math.min(100, vehicle?.health || 100));
  },

  /**
   * Récupère les informations essentielles d'un véhicule
   * @param {Object} vehicle - Véhicule source
   * @returns {Object} - Informations essentielles
   */
  getVehicleEssentials: (vehicle) => {
    return {
      id: vehicle?.id,
      type: vehicle?.type,
      coord: vehicle?.coord,
      position: vehicle?.position,
      isMoving: Boolean(vehicle?.isMoving),
      active: Boolean(vehicle?.active),
      health: Math.max(0, Math.min(100, vehicle?.health || 100))
    };
  },

  /**
   * Vérifie si un véhicule a un bouclier actif
   * @param {Object} vehicle - Véhicule à vérifier
   * @returns {boolean} - True si le véhicule a un bouclier
   */
  hasActiveShield: (vehicle) => {
    return (vehicle?.shield || 0) > 0;
  },

  /**
   * Récupère les capacités d'un véhicule
   * @param {Object} vehicle - Véhicule source
   * @returns {Object} - Capacités du véhicule
   */
  getVehicleCapacities: (vehicle) => {
    const defaultCapacity = DEFAULT_CAPACITIES[vehicle?.type] || DEFAULT_CAPACITIES[VEHICLE_TYPES.DRONE];
    return vehicle?.maxCapacity || defaultCapacity;
  }
};

// ============================================================================
// EVENTS ET TRANSFORMATIONS
// ============================================================================

export const movementEvents = {
  
  /**
   * Crée un événement de mouvement vers une tuile
   * @param {Object} targetTile - Tuile de destination
   * @returns {Object} - Événement formaté
   */
  moveToTile: (targetTile) => ({
    type: 'MOVE_TO_TILE',
    targetTile
  }),

  /**
   * Crée un événement d'arrêt de mouvement
   * @returns {Object} - Événement formaté
   */
  stopMovement: () => ({
    type: 'STOP_MOVEMENT'
  }),

  /**
   * Crée un événement de mise à jour de progression
   * @param {number} progress - Progression 0-100
   * @returns {Object} - Événement formaté
   */
  updateProgress: (progress) => ({
    type: 'UPDATE_MOVEMENT_PROGRESS',
    progress
  }),

  /**
   * Crée un événement de finalisation de mouvement
   * @returns {Object} - Événement formaté
   */
  completeMovement: () => ({
    type: 'COMPLETE_MOVEMENT'
  }),

  /**
   * Crée un événement de création de véhicule avec capacités
   * @param {Object} vehicleData - Données du véhicule
   * @returns {Object} - Événement formaté
   */
  createVehicleWithCapacities: (vehicleData) => ({
    type: 'CREATE_VEHICLE_WITH_CAPACITIES',
    vehicleData
  }),

  /**
   * Événement de mise à jour de véhicule
   * @param {Object} vehicle - Véhicule mis à jour
   * @param {Object} changes - Changements appliqués
   * @returns {Object} - Événement
   */
  vehicleUpdatedEvent: (vehicle, changes) => ({
    type: 'VEHICLE_UPDATED',
    payload: {
      vehicleId: vehicle.id,
      changes,
      timestamp: Date.now()
    }
  }),

  /**
   * Événement d'activation/désactivation de véhicule
   * @param {Object} vehicle - Véhicule concerné
   * @param {boolean} active - Nouvel état d'activation
   * @returns {Object} - Événement
   */
  vehicleStateChangedEvent: (vehicle, active) => ({
    type: 'VEHICLE_STATE_CHANGED',
    payload: {
      vehicleId: vehicle.id,
      active,
      timestamp: Date.now()
    }
  }),

  /**
   * Événement de dégâts sur véhicule
   * @param {Object} vehicle - Véhicule endommagé
   * @param {number} damage - Dégâts subis
   * @param {number} newHealth - Nouvelle santé
   * @returns {Object} - Événement
   */
  vehicleDamagedEvent: (vehicle, damage, newHealth) => ({
    type: 'VEHICLE_DAMAGED',
    payload: {
      vehicleId: vehicle.id,
      damage,
      oldHealth: vehicle.health || 100,
      newHealth,
      critical: newHealth <= 20,
      timestamp: Date.now()
    }
  }),

  /**
   * Événement de réparation de véhicule
   * @param {Object} vehicle - Véhicule réparé
   * @param {number} amount - Quantité réparée
   * @param {number} newHealth - Nouvelle santé
   * @returns {Object} - Événement
   */
  vehicleRepairedEvent: (vehicle, amount, newHealth) => ({
    type: 'VEHICLE_REPAIRED',
    payload: {
      vehicleId: vehicle.id,
      repairAmount: amount,
      oldHealth: vehicle.health || 100,
      newHealth,
      fullyRepaired: newHealth >= 100,
      timestamp: Date.now()
    }
  })
};

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Combine plusieurs mises à jour de véhicule
 * @param {...Object} updates - Mises à jour à combiner
 * @returns {Object} - Mises à jour combinées
 */
export const combineVehicleUpdates = (...updates) => {
  return updates.reduce((combined, update) => ({
    ...combined,
    ...validateUpdates(update)
  }), {});
};

/**
 * Filtre les véhicules par état
 * @param {Object} vehicles - Dictionnaire des véhicules
 * @param {Function} predicate - Fonction de filtrage
 * @returns {Object} - Véhicules filtrés
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
 * @param {Object} vehicle - Véhicule à valider
 * @returns {Object} - Résultat de validation
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
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  actions: movementActions,
  selectors: movementSelectors,
  guards: movementGuards,
  events: movementEvents,
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

// ============================================================================
// EXPORTS NOMMÉS POUR COMPATIBILITÉ
// ============================================================================

// Exports pour les actions véhicule
export const {
  updateVehicleProperties,
  activateVehicle,
  deactivateVehicle,
  damageVehicle,
  repairVehicle,
  setVehicleShield,
  setVehicleSpeed,
  createVehicleWithCapacities
} = movementActions;

// Exports pour les selectors véhicule
export const {
  getVehicleStatus,
  getHealthPercentage,
  getVehicleEssentials,
  hasActiveShield,
  getVehicleCapacities
} = movementSelectors;

// Exports pour les événements véhicule
export const {
  vehicleUpdatedEvent,
  vehicleStateChangedEvent,
  vehicleDamagedEvent,
  vehicleRepairedEvent
} = movementEvents;
