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

/**
 * Événement de progression de navigation
 */
const NAVIGATION_PROGRESS = 'NAVIGATION_PROGRESS';

/**
 * Créateur d'événement: NAVIGATION_PROGRESS
 * @param {object} currentPosition - Position actuelle
 * @param {object} targetPosition - Position cible
 * @param {number} progress - Progression (0-1)
 * @returns {object} Event payload
 */
const createNavigationProgressEvent = (currentPosition, targetPosition, progress) => ({
  type: NAVIGATION_PROGRESS,
  currentPosition,
  targetPosition,
  progress,
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
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @param {object} position - Position de déploiement
 * @returns {object} Event payload
 */
const createDroneDeployedEvent = (targetArea, range = 5, droneType = 'explorer', position = null) => ({
  type: DRONE_DEPLOYED,
  targetArea,
  range,
  droneType,
  position,
  timestamp: Date.now()
});

/**
 * Événement de mise à jour de position de drone
 * Déclenché lorsqu'un drone change de position en temps réel
 */
const DRONE_POSITION_UPDATE = 'DRONE_POSITION_UPDATE';

/**
 * Créateur d'événement: DRONE_POSITION_UPDATE
 * @param {object} position - Nouvelle position du drone {x, y, z}
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @param {string} state - État du drone ('exploring', 'returning', 'docked')
 * @returns {object} Event payload
 */
const createDronePositionUpdateEvent = (position, droneType = 'explorer', state = 'exploring') => ({
  type: DRONE_POSITION_UPDATE,
  position,
  droneType,
  state,
  timestamp: Date.now()
});

/**
 * Événement d'arrivée du drone à sa cible d'exploration
 * Déclenché lorsqu'un drone atteint sa position cible et doit marquer la tuile comme explorée
 */
const DRONE_REACHED_TARGET = 'DRONE_REACHED_TARGET';

/**
 * Créateur d'événement: DRONE_REACHED_TARGET
 * @param {object} position - Position atteinte {x, y, z}
 * @param {string} tileCoord - Coordonnée de la tuile explorée (format "x,y")
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {object} Event payload
 */
const createDroneReachedTargetEvent = (position, tileCoord, droneType = 'explorer') => ({
  type: DRONE_REACHED_TARGET,
  position,
  tileCoord,
  droneType,
  timestamp: Date.now()
});

/**
 * Événement de retour du drone terminé
 * Déclenché lorsqu'un drone est revenu au vaisseau et peut être ancré
 */
const DRONE_RETURNED = 'DRONE_RETURNED';

/**
 * Créateur d'événement: DRONE_RETURNED
 * @param {object} position - Position du vaisseau où le drone est revenu
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {object} Event payload
 */
const createDroneReturnedEvent = (position, droneType = 'explorer') => ({
  type: DRONE_RETURNED,
  position,
  droneType,
  timestamp: Date.now()
});

/**
 * Événement d'annulation de mouvement
 * Déclenché lorsqu'un mouvement est annulé
 */
const MOVEMENT_CANCELLED = 'MOVEMENT_CANCELLED';

/**
 * Créateur d'événement: MOVEMENT_CANCELLED
 * @param {object} currentCoord - Coordonnée actuelle au moment de l'annulation
 * @returns {object} Event payload
 */
const createMovementCancelledEvent = (currentCoord) => ({
  type: MOVEMENT_CANCELLED,
  currentCoord,
  timestamp: Date.now()
});

/**
 * Événement de prospection terminée
 * Déclenché lorsqu'un drone termine sa phase de prospection détaillée
 */
const PROSPECTING_COMPLETE = 'PROSPECTING_COMPLETE';

/**
 * Créateur d'événement: PROSPECTING_COMPLETE
 * @param {object} position - Position où la prospection a été effectuée
 * @param {object} tileCoord - Coordonnées de la tuile prospectée
 * @param {object} resourcesFound - Ressources découvertes lors de la prospection
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {object} Event payload
 */
const createProspectingCompleteEvent = (position, tileCoord, resourcesFound, droneType = 'explorer') => ({
  type: PROSPECTING_COMPLETE,
  position,
  tileCoord,
  resourcesFound,
  droneType,
  timestamp: Date.now()
});

/**
 * Événement de mise à jour de position
 * Déclenché pour mettre à jour la position d'une entité
 */
const UPDATE_POSITION = 'UPDATE_POSITION';

/**
 * Créateur d'événement: UPDATE_POSITION
 * @param {object} position - Nouvelle position de l'entité
 * @param {string} entityType - Type d'entité ('ship', 'drone', 'bot')
 * @returns {object} Event payload
 */
const createUpdatePositionEvent = (position, entityType = 'ship') => ({
  type: UPDATE_POSITION,
  position,
  entityType,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE VAISSEAU
// ============================================================================

/**
 * Événement de démarrage de mouvement de vaisseau
 * Déclenché lorsqu'un vaisseau commence à se déplacer
 */
const SHIP_MOVEMENT_STARTED = 'SHIP_MOVEMENT_STARTED';

/**
 * Créateur d'événement: SHIP_MOVEMENT_STARTED
 * @param {object} position - Position de départ du vaisseau
 * @param {object} targetPosition - Position cible du vaisseau
 * @returns {object} Event payload
 */
const createShipMovementStartedEvent = (position, targetPosition = null) => ({
  type: SHIP_MOVEMENT_STARTED,
  position,
  targetPosition,
  timestamp: Date.now()
});

/**
 * Événement d'arrivée de vaisseau à une tuile
 * Déclenché lorsqu'un vaisseau atteint sa destination
 */
const SHIP_ARRIVED_AT_TILE = 'SHIP_ARRIVED_AT_TILE';

/**
 * Créateur d'événement: SHIP_ARRIVED_AT_TILE
 * @param {object} position - Position d'arrivée du vaisseau
 * @param {object} tileCoord - Coordonnées de la tuile atteinte
 * @returns {object} Event payload
 */
const createShipArrivedAtTileEvent = (position, tileCoord) => ({
  type: SHIP_ARRIVED_AT_TILE,
  position,
  tileCoord,
  timestamp: Date.now()
});

/**
 * Événement de collecte terminée par vaisseau
 * Déclenché lorsqu'un vaisseau termine la collecte de ressources
 */
const SHIP_COLLECTION_COMPLETED = 'SHIP_COLLECTION_COMPLETED';

/**
 * Créateur d'événement: SHIP_COLLECTION_COMPLETED
 * @param {object} position - Position où la collecte a eu lieu
 * @param {object} tileCoord - Coordonnées de la tuile collectée
 * @param {object} collectedResources - Ressources collectées
 * @returns {object} Event payload
 */
const createShipCollectionCompletedEvent = (position, tileCoord, collectedResources) => ({
  type: SHIP_COLLECTION_COMPLETED,
  position,
  tileCoord,
  collectedResources,
  timestamp: Date.now()
});

/**
 * Événement de ravitaillement terminé
 * Déclenché lorsqu'un vaisseau termine son ravitaillement
 */
const SHIP_REFUEL_COMPLETED = 'SHIP_REFUEL_COMPLETED';

/**
 * Créateur d'événement: SHIP_REFUEL_COMPLETED
 * @param {object} position - Position où le ravitaillement a eu lieu
 * @param {number} fuelAdded - Quantité de carburant ajoutée
 * @returns {object} Event payload
 */
const createShipRefuelCompletedEvent = (position, fuelAdded) => ({
  type: SHIP_REFUEL_COMPLETED,
  position,
  fuelAdded,
  timestamp: Date.now()
});

// Export des types d'événements (constants)
export const MOVEMENT_EVENT_TYPES = {
  MOVEMENT_STARTED,
  MOVEMENT_PROGRESS,
  BASE_REACHED,
  NAVIGATION_PROGRESS,
  DRONE_DEPLOYED,
  DRONE_POSITION_UPDATE,
  DRONE_REACHED_TARGET,
  DRONE_RETURNED,
  MOVEMENT_CANCELLED,
  PROSPECTING_COMPLETE,
  UPDATE_POSITION,
  SHIP_MOVEMENT_STARTED,
  SHIP_ARRIVED_AT_TILE,
  SHIP_COLLECTION_COMPLETED,
  SHIP_REFUEL_COMPLETED
};

// Export des créateurs d'événements
export const movementEvents = {
  createMovementStartedEvent,
  createMovementProgressEvent,
  createBaseReachedEvent,
  createDroneDeployedEvent,
  createDronePositionUpdateEvent,
  createNavigationProgressEvent,
  createMovementCancelledEvent,
  createDroneReachedTargetEvent,
  createDroneReturnedEvent,
  createProspectingCompleteEvent,
  createUpdatePositionEvent,
  createShipMovementStartedEvent,
  createShipArrivedAtTileEvent,
  createShipCollectionCompletedEvent,
  createShipRefuelCompletedEvent
};
