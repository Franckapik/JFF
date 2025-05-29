/**
 * ============================================================================
 * MOVEMENT ACTIONS CORE - Actions de mouvement pures et partagées
 * ============================================================================
 * 
 * Actions de mouvement pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * Inspiré du pattern présenté dans actions-comparison.md
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

// ============================================================================
// CONSTANTS ET HELPERS
// ============================================================================

/**
 * Validation et normalisation d'une tuile cible
 * @param {Object} tile - Tuile à valider
 * @returns {Object} - Tuile validée
 * @throws {Error} - Si la tuile est invalide
 */
const validateTargetTile = (tile) => {
  if (!tile) {
    throw new Error('Target tile is required');
  }
  
  if (!tile.position || !tile.coord) {
    throw new Error('Invalid target tile: missing position or coord');
  }
  
  // Validation basique du format de coordonnée
  if (typeof tile.coord !== 'string' || !tile.coord.includes(',')) {
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

// ============================================================================
// ACTIONS PRINCIPALES
// ============================================================================

/**
 * Actions de mouvement pures - Compatible Bot et Player
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
      const validatedTile = validateTargetTile(event.targetTile);
      
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
    const progress = clamp(event.progress || 0, 0, 100);
    
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
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec newCoord
   * @returns {Object} - Nouveau contexte avec position mise à jour
   */
  updatePosition: (context, event) => {
    if (!event.newCoord) {
      return context;
    }

    return {
      ...context,
      vehicle: {
        ...context.vehicle,
        coord: event.newCoord,
        lastUpdate: Date.now()
      }
    };
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
  })
};

// ============================================================================
// SELECTORS ET UTILITAIRES
// ============================================================================

/**
 * Sélecteurs pour extraire des informations de mouvement
 */
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
  }
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
    if (movementSelectors.isMoving(vehicle)) return false;
    
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
  }
};

// ============================================================================
// EVENTS ET TRANSFORMATIONS
// ============================================================================

/**
 * Générateurs d'événements pour le système de mouvement
 */
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
  })
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
    clamp
  }
};
