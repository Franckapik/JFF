/**
 * ============================================================================
 * ÉVÉNEMENTS DE MOUVEMENT - Déplacements et navigation
 * ============================================================================
 * 
 * Les événements de mouvement sont liés aux déplacements des entités 
 * dans l'environnement du jeu.
 * 
 * Structure des entités supportées :
 * - ENTITY : Événements génériques pouvant s'appliquer à ship ou drone
 * - SHIP   : Événements spécifiques au vaisseau
 * - DRONE  : Événements spécifiques aux drones
 * 
 * @author FSM Optimization
 * @version 2.0.0 - Réorganisation avec sections claires
 */

// ============================================================================
// ÉVÉNEMENTS D'ENTITÉ GÉNÉRIQUE
// ============================================================================
// Ces événements concernent n'importe quelle entité (vaisseau ou drone)
// Ils sont utilisés pour des actions communes aux deux types d'entités
// ============================================================================

/**
 * Événement de début de mouvement générique
 * Déclenché lorsqu'un mouvement commence pour n'importe quelle entité
 */
const ENTITY_MOVEMENT_STARTED = 'ENTITY_MOVEMENT_STARTED';

/**
 * Créateur d'événement: ENTITY_MOVEMENT_STARTED
 * @param {object} startCoord - Coordonnée de départ
 * @param {object} targetCoord - Coordonnée de destination
 * @param {number} estimatedDuration - Durée estimée du déplacement
 * @param {string} entityType - Type d'entité ('ship', 'drone')
 * @returns {object} Event payload
 */
const createEntityMovementStartedEvent = (startCoord, targetCoord, estimatedDuration, entityType = 'ship') => ({
  type: ENTITY_MOVEMENT_STARTED,
  startCoord,
  targetCoord,
  estimatedDuration,
  entityType,
  timestamp: Date.now()
});

/**
 * Événement de progression de mouvement générique
 * Déclenché périodiquement pendant un déplacement
 */
const ENTITY_MOVEMENT_PROGRESS = 'ENTITY_MOVEMENT_PROGRESS';

/**
 * Créateur d'événement: ENTITY_MOVEMENT_PROGRESS
 * @param {object} currentCoord - Coordonnée actuelle
 * @param {object} targetCoord - Coordonnée de destination
 * @param {number} progress - Progression (0-1)
 * @param {string} entityType - Type d'entité ('ship', 'drone')
 * @returns {object} Event payload
 */
const createEntityMovementProgressEvent = (currentCoord, targetCoord, progress, entityType = 'ship') => ({
  type: ENTITY_MOVEMENT_PROGRESS,
  currentCoord,
  targetCoord,
  progress,
  entityType,
  timestamp: Date.now()
});

/**
 * Événement de mise à jour de position générique
 * Déclenché pour mettre à jour la position d'une entité
 */
const ENTITY_POSITION_UPDATE = 'ENTITY_POSITION_UPDATE';

/**
 * Créateur d'événement: ENTITY_POSITION_UPDATE
 * @param {object} position - Nouvelle position de l'entité
 * @param {string} entityType - Type d'entité ('ship', 'drone')
 * @param {string} coord - Coordonnée de tuile (optionnel)
 * @param {string} newCoord - Nouvelle coordonnée de tuile (optionnel)
 * @returns {object} Event payload
 */
const createEntityPositionUpdateEvent = (position, entityType = 'ship', coord = null, newCoord = null) => ({
  type: ENTITY_POSITION_UPDATE,
  position,
  entityType,
  coord,
  newCoord,
  timestamp: Date.now()
});

/**
 * Événement d'annulation de mouvement générique
 * Déclenché lorsqu'un mouvement est annulé
 */
const ENTITY_MOVEMENT_CANCELLED = 'ENTITY_MOVEMENT_CANCELLED';

/**
 * Créateur d'événement: ENTITY_MOVEMENT_CANCELLED
 * @param {object} currentCoord - Coordonnée actuelle au moment de l'annulation
 * @param {object} position - Position 3D de l'entité
 * @param {string} entityType - Type d'entité ('ship', 'drone')
 * @param {string} reason - Raison de l'annulation
 * @returns {object} Event payload
 */
const createEntityMovementCancelledEvent = (currentCoord, position = null, entityType = 'ship', reason = null) => ({
  type: ENTITY_MOVEMENT_CANCELLED,
  currentCoord,
  position,
  entityType,
  reason,
  timestamp: Date.now()
});

/**
 * Événement de progression de navigation générique
 * Utilisé pour le système de navigation globale
 */
const ENTITY_NAVIGATION_PROGRESS = 'ENTITY_NAVIGATION_PROGRESS';

/**
 * Créateur d'événement: ENTITY_NAVIGATION_PROGRESS
 * @param {object} currentPosition - Position actuelle
 * @param {object} targetPosition - Position cible
 * @param {number} progress - Progression (0-1)
 * @param {string} entityType - Type d'entité ('ship', 'drone')
 * @returns {object} Event payload
 */
const createEntityNavigationProgressEvent = (currentPosition, targetPosition, progress, entityType = 'ship') => ({
  type: ENTITY_NAVIGATION_PROGRESS,
  currentPosition,
  targetPosition,
  progress,
  entityType,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE VAISSEAU (SHIP)
// ============================================================================
// Ces événements sont spécifiques au vaisseau principal
// Le vaisseau peut se déplacer, collecter des ressources, se ravitailler
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
  entityType: 'ship',
  timestamp: Date.now()
});

/**
 * Événement d'arrivée du vaisseau à la base
 * Déclenché lorsque le vaisseau atteint sa base
 */
const SHIP_REACHED_BASE = 'SHIP_REACHED_BASE';

/**
 * Créateur d'événement: SHIP_REACHED_BASE
 * @param {object} coord - Coordonnée de la base
 * @param {object} position - Position 3D du vaisseau
 * @returns {object} Event payload
 */
const createShipReachedBaseEvent = (coord, position) => ({
  type: SHIP_REACHED_BASE,
  coord,
  position,
  entityType: 'ship',
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
  entityType: 'ship',
  timestamp: Date.now()
});

/**
 * Événement de mise à jour de position du vaisseau
 * Déclenché pour mettre à jour la position du vaisseau
 */
const SHIP_UPDATE_POSITION = 'SHIP_UPDATE_POSITION';

/**
 * Créateur d'événement: SHIP_UPDATE_POSITION
 * @param {object} position - Position 3D du vaisseau
 * @param {string} tileCoord - Coordonnée de tuile
 * @param {string} newCoord - Nouvelle coordonnée
 * @returns {object} Event payload
 */
const createShipUpdatePositionEvent = (position, tileCoord, newCoord) => ({
  type: SHIP_UPDATE_POSITION,
  position,
  entityType: 'ship',
  tileCoord,
  newCoord,
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
  entityType: 'ship',
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
  entityType: 'ship',
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE DRONE
// ============================================================================
// Ces événements sont spécifiques aux drones
// Les drones peuvent être déployés, explorer et revenir au vaisseau
// ============================================================================

/**
 * Événement de déploiement de drone
 * Déclenché lorsqu'un drone est déployé pour une mission
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
  entityType: 'drone',
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
  entityType: 'drone',
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
  entityType: 'drone',
  timestamp: Date.now()
});

/**
 * Événement d'approche du drone vers le vaisseau
 * Déclenché lorsqu'un drone s'approche du vaisseau en phase de retour
 */
const DRONE_APPROACHING_SHIP = 'DRONE_APPROACHING_SHIP';

/**
 * Créateur d'événement: DRONE_APPROACHING_SHIP
 * @param {object} position - Position actuelle du drone
 * @param {number} distance - Distance entre le drone et le vaisseau
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {object} Event payload
 */
const createDroneApproachingShipEvent = (position, distance, droneType = 'explorer') => ({
  type: DRONE_APPROACHING_SHIP,
  position,
  distance,
  droneType,
  entityType: 'drone',
  timestamp: Date.now()
});

/**
 * Événement de retour du drone terminé
 * Déclenché lorsqu'un drone est revenu au vaisseau et peut être ancré
 */
const DRONE_REACHED_SHIP = 'DRONE_REACHED_SHIP';

/**
 * Créateur d'événement: DRONE_REACHED_SHIP
 * @param {object} position - Position du vaisseau où le drone est revenu
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {object} Event payload
 */
const createDroneReachedShipEvent = (position, droneType = 'explorer') => ({
  type: DRONE_REACHED_SHIP,
  position,
  droneType,
  entityType: 'drone',
  timestamp: Date.now()
});

// ============================================================================
// EXPORTS - Types d'événements et créateurs
// ============================================================================

// Export des types d'événements (constants)
export const MOVEMENT_EVENT_TYPES = {
  // === ÉVÉNEMENTS ENTITY (GÉNÉRIQUES) ===
  ENTITY_MOVEMENT_STARTED,
  ENTITY_MOVEMENT_PROGRESS,
  ENTITY_POSITION_UPDATE,
  ENTITY_MOVEMENT_CANCELLED,
  ENTITY_NAVIGATION_PROGRESS,
  
  // === ÉVÉNEMENTS SHIP (VAISSEAU) ===
  SHIP_MOVEMENT_STARTED,
  SHIP_REACHED_BASE,
  SHIP_ARRIVED_AT_TILE,
  SHIP_UPDATE_POSITION,
  SHIP_COLLECTION_COMPLETED,
  SHIP_REFUEL_COMPLETED,
  
  // === ÉVÉNEMENTS DRONE ===
  DRONE_DEPLOYED,
  DRONE_POSITION_UPDATE,
  DRONE_REACHED_TARGET,
  DRONE_APPROACHING_SHIP,
  DRONE_REACHED_SHIP,
  
  // === RÉTROCOMPATIBILITÉ ===
  // Anciens noms redirigés vers les nouveaux événements standardisés
  DRONE_RETURNED: DRONE_REACHED_SHIP,
  MOVEMENT_STARTED: ENTITY_MOVEMENT_STARTED,
  MOVEMENT_PROGRESS: ENTITY_MOVEMENT_PROGRESS,
  BASE_REACHED: SHIP_REACHED_BASE,
  MOVEMENT_CANCELLED: ENTITY_MOVEMENT_CANCELLED,
  UPDATE_POSITION: ENTITY_POSITION_UPDATE,
  NAVIGATION_PROGRESS: ENTITY_NAVIGATION_PROGRESS
};

// Export des créateurs d'événements
export const movementEvents = {
  // === CRÉATEURS ENTITY (GÉNÉRIQUES) ===
  createEntityMovementStartedEvent,
  createEntityMovementProgressEvent,
  createEntityPositionUpdateEvent,
  createEntityMovementCancelledEvent,
  createEntityNavigationProgressEvent,
  
  // === CRÉATEURS SHIP (VAISSEAU) ===
  createShipMovementStartedEvent,
  createShipReachedBaseEvent,
  createShipArrivedAtTileEvent,
  createShipUpdatePositionEvent,
  createShipCollectionCompletedEvent,
  createShipRefuelCompletedEvent,
  
  // === CRÉATEURS DRONE ===
  createDroneDeployedEvent,
  createDronePositionUpdateEvent,
  createDroneReachedTargetEvent,
  createDroneApproachingShipEvent,
  createDroneReachedShipEvent,
  
  // === RÉTROCOMPATIBILITÉ ===
  // Anciens noms redirigés vers les nouvelles fonctions standardisées
  createDroneReturnedEvent: createDroneReachedShipEvent,
  createMovementStartedEvent: createEntityMovementStartedEvent,
  createMovementProgressEvent: createEntityMovementProgressEvent,
  createBaseReachedEvent: createShipReachedBaseEvent,
  createMovementCancelledEvent: createEntityMovementCancelledEvent,
  createUpdatePositionEvent: createEntityPositionUpdateEvent,
  createNavigationProgressEvent: createEntityNavigationProgressEvent
};
