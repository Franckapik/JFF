/**
 * ============================================================================
 * ÉVÉNEMENTS DE MOUVEMENT - Déplacements et navigation
 * ============================================================================
 * 
 * Les événements de mouvement sont liés aux déplacements des entités 
 * dans l'environnement du jeu.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// ============================================================================
// ÉVÉNEMENTS DE NAVIGATION
// ============================================================================

/**
 * Événement de début de mouvement
 * Déclenché lorsqu'un mouvement commence
 */
const MOVEMENT_STARTED = 'MOVEMENT_STARTED';

/**
 * Créateur d'événement: MOVEMENT_STARTED
 * @param {object} startCoord - Coordonnée de départ
 * @param {object} targetCoord - Coordonnée de destination
 * @param {number} estimatedDuration - Durée estimée du déplacement
 * @returns {object} Event payload
 */
const createMovementStartedEvent = (startCoord, targetCoord, estimatedDuration) => ({
  type: MOVEMENT_STARTED,
  startCoord,
  targetCoord,
  estimatedDuration,
  timestamp: Date.now()
});

/**
 * Événement de progression de mouvement
 * Déclenché périodiquement pendant un déplacement
 */
const MOVEMENT_PROGRESS = 'MOVEMENT_PROGRESS';

/**
 * Créateur d'événement: MOVEMENT_PROGRESS
 * @param {object} currentCoord - Coordonnée actuelle
 * @param {object} targetCoord - Coordonnée de destination
 * @param {number} progress - Progression (0-1)
 * @returns {object} Event payload
 */
const createMovementProgressEvent = (currentCoord, targetCoord, progress) => ({
  type: MOVEMENT_PROGRESS,
  currentCoord,
  targetCoord,
  progress,
  timestamp: Date.now()
});

/**
 * Événement d'arrivée à la base
 * Déclenché lorsque l'entité atteint sa base
 */
const BASE_REACHED = 'BASE_REACHED';

/**
 * Créateur d'événement: BASE_REACHED
 * @param {object} coord - Coordonnée de la base
 * @returns {object} Event payload
 */
const createBaseReachedEvent = (coord) => ({
  type: BASE_REACHED,
  coord,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE DRONE
// ============================================================================

/**
 * Événement de déploiement de drone
 * Déclenché lorsqu'un drone est déployé
 */
const DRONE_DEPLOYED = 'DRONE_DEPLOYED';

/**
 * Créateur d'événement: DRONE_DEPLOYED
 * @param {object} targetArea - Zone cible pour le drone
 * @param {number} range - Portée du drone
 * @returns {object} Event payload
 */
const createDroneDeployedEvent = (targetArea, range = 5) => ({
  type: DRONE_DEPLOYED,
  targetArea,
  range,
  timestamp: Date.now()
});

// Export des types d'événements (constants)
export const MOVEMENT_EVENT_TYPES = {
  MOVEMENT_STARTED,
  MOVEMENT_PROGRESS,
  BASE_REACHED,
  DRONE_DEPLOYED
};

// Export des créateurs d'événements
export const movementEvents = {
  createMovementStartedEvent,
  createMovementProgressEvent,
  createBaseReachedEvent,
  createDroneDeployedEvent
};
