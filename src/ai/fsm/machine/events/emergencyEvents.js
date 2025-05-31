/**
 * ============================================================================
 * ÉVÉNEMENTS D'URGENCE - Événements prioritaires
 * ============================================================================
 * 
 * Les événements d'urgence sont déclenchés pour les situations critiques 
 * nécessitant une action immédiate et ont priorité sur les autres événements.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// ============================================================================
// ÉVÉNEMENTS DE SÉCURITÉ
// ============================================================================

/**
 * Événement d'urgence détectée
 * Déclenché lorsqu'une condition d'urgence est détectée
 */
const EMERGENCY_DETECTED = 'EMERGENCY_DETECTED';

/**
 * Créateur d'événement: EMERGENCY_DETECTED
 * @param {string} condition - Type de condition d'urgence
 * @param {object} details - Détails supplémentaires sur l'urgence
 * @returns {object} Event payload
 */
const createEmergencyDetectedEvent = (condition, details = {}) => ({
  type: EMERGENCY_DETECTED,
  condition,
  details,
  timestamp: Date.now()
});

/**
 * Événement d'urgence résolue
 * Déclenché lorsqu'une condition d'urgence a été résolue
 */
const EMERGENCY_RESOLVED = 'EMERGENCY_RESOLVED';

/**
 * Créateur d'événement: EMERGENCY_RESOLVED
 * @param {string} condition - Type de condition d'urgence résolue
 * @param {object} details - Détails supplémentaires sur la résolution
 * @returns {object} Event payload
 */
const createEmergencyResolvedEvent = (condition, details = {}) => ({
  type: EMERGENCY_RESOLVED,
  condition,
  details,
  timestamp: Date.now()
});

/**
 * Événement de détection de carburant bas
 * Déclenché lorsque le niveau de carburant passe en dessous du seuil critique
 */
const LOW_FUEL_DETECTED = 'LOW_FUEL_DETECTED';

/**
 * Créateur d'événement: LOW_FUEL_DETECTED
 * @param {number} fuelLevel - Niveau de carburant actuel
 * @param {number} threshold - Seuil de carburant bas
 * @returns {object} Event payload
 */
const createLowFuelDetectedEvent = (fuelLevel, threshold = 20) => ({
  type: LOW_FUEL_DETECTED,
  fuelLevel,
  threshold,
  timestamp: Date.now()
});

/**
 * Événement de carburant critique
 * Déclenché lorsque le niveau de carburant est extrêmement bas
 */
const CRITICAL_FUEL = 'CRITICAL_FUEL';

/**
 * Créateur d'événement: CRITICAL_FUEL
 * @param {number} fuelLevel - Niveau de carburant actuel
 * @param {number} threshold - Seuil de carburant critique
 * @returns {object} Event payload
 */
const createCriticalFuelEvent = (fuelLevel, threshold = 10) => ({
  type: CRITICAL_FUEL,
  fuelLevel,
  threshold,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS D'ÉCHEC
// ============================================================================

/**
 * Événement d'échec de déploiement de drone
 * Déclenché lorsque le déploiement d'un drone échoue
 */
const DRONE_DEPLOYMENT_FAILED = 'DRONE_DEPLOYMENT_FAILED';

/**
 * Créateur d'événement: DRONE_DEPLOYMENT_FAILED
 * @param {string} reason - Raison de l'échec du déploiement
 * @param {object} details - Détails supplémentaires sur l'échec
 * @returns {object} Event payload
 */
const createDroneDeploymentFailedEvent = (reason, details = {}) => ({
  type: DRONE_DEPLOYMENT_FAILED,
  reason,
  details,
  timestamp: Date.now()
});

/**
 * Événement d'échec de navigation
 * Déclenché lorsque la navigation vers une destination échoue
 */
const NAVIGATION_FAILED = 'NAVIGATION_FAILED';

/**
 * Créateur d'événement: NAVIGATION_FAILED
 * @param {string} reason - Raison de l'échec de navigation
 * @param {object} targetCoord - Coordonnée de destination
 * @param {object} currentCoord - Coordonnée actuelle
 * @returns {object} Event payload
 */
const createNavigationFailedEvent = (reason, targetCoord, currentCoord) => ({
  type: NAVIGATION_FAILED,
  reason,
  targetCoord,
  currentCoord,
  timestamp: Date.now()
});

/**
 * Événement d'indisponibilité de ressource
 * Déclenché lorsqu'une ressource ciblée n'est plus disponible
 */
const RESOURCE_UNAVAILABLE = 'RESOURCE_UNAVAILABLE';

/**
 * Créateur d'événement: RESOURCE_UNAVAILABLE
 * @param {string} resourceId - ID de la ressource indisponible
 * @param {string} reason - Raison de l'indisponibilité
 * @returns {object} Event payload
 */
const createResourceUnavailableEvent = (resourceId, reason) => ({
  type: RESOURCE_UNAVAILABLE,
  resourceId,
  reason,
  timestamp: Date.now()
});

// Export des types d'événements (constants)
export const EMERGENCY_EVENT_TYPES = {
  EMERGENCY_DETECTED,
  EMERGENCY_RESOLVED,
  LOW_FUEL_DETECTED,
  CRITICAL_FUEL,
  DRONE_DEPLOYMENT_FAILED,
  NAVIGATION_FAILED,
  RESOURCE_UNAVAILABLE
};

// Export des créateurs d'événements
export const emergencyEvents = {
  createEmergencyDetectedEvent,
  createEmergencyResolvedEvent,
  createLowFuelDetectedEvent,
  createCriticalFuelEvent,
  createDroneDeploymentFailedEvent,
  createNavigationFailedEvent,
  createResourceUnavailableEvent
};
