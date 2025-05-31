/**
 * ============================================================================
 * ÉVÉNEMENTS SYSTÈME - Événements générés par le système
 * ============================================================================
 * 
 * Les événements système sont déclenchés automatiquement par la machine FSM 
 * lors de l'exécution normale du programme sans intervention utilisateur.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// ============================================================================
// ÉVÉNEMENTS D'ÉVALUATION
// ============================================================================

/**
 * Événement de fin d'évaluation de la situation
 * Déclenché lorsque l'évaluation de l'état actuel est terminée
 */
const ASSESSMENT_COMPLETE = 'ASSESSMENT_COMPLETE';

/**
 * Créateur d'événement: ASSESSMENT_COMPLETE
 * @param {string} nextState - État suggéré après évaluation
 * @param {string} reason - Raison de la suggestion d'état
 * @returns {object} Event payload
 */
const createAssessmentCompleteEvent = (nextState, reason = 'normal_assessment') => ({
  type: ASSESSMENT_COMPLETE,
  nextState,
  reason,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE BASE
// ============================================================================

/**
 * Événement de ravitaillement terminé
 * Déclenché lorsque le ravitaillement à la base est terminé
 */
const REFUEL_COMPLETE = 'REFUEL_COMPLETE';

/**
 * Créateur d'événement: REFUEL_COMPLETE
 * @param {number} fuelLevel - Nouveau niveau de carburant
 * @returns {object} Event payload
 */
const createRefuelCompleteEvent = (fuelLevel = 100) => ({
  type: REFUEL_COMPLETE,
  fuelLevel,
  timestamp: Date.now()
});

/**
 * Événement de déchargement terminé
 * Déclenché lorsque les ressources ont été déchargées à la base
 */
const UNLOAD_COMPLETE = 'UNLOAD_COMPLETE'; 

/**
 * Créateur d'événement: UNLOAD_COMPLETE
 * @param {object} resources - Ressources transférées à la base
 * @returns {object} Event payload
 */
const createUnloadCompleteEvent = (resources = {}) => ({
  type: UNLOAD_COMPLETE,
  resources,
  timestamp: Date.now()
});

/**
 * Événement de réparation terminée
 * Déclenché lorsque les réparations du véhicule sont terminées
 */
const REPAIR_COMPLETE = 'REPAIR_COMPLETE';

/**
 * Créateur d'événement: REPAIR_COMPLETE
 * @param {number} health - Nouveau niveau de santé du véhicule
 * @returns {object} Event payload
 */
const createRepairCompleteEvent = (health = 100) => ({
  type: REPAIR_COMPLETE,
  health,
  timestamp: Date.now()
});

/**
 * Événement de maintenance complétée
 * Déclenché après la fin de la maintenance à la base
 */
const MAINTENANCE_COMPLETE = 'MAINTENANCE_COMPLETE';

/**
 * Créateur d'événement: MAINTENANCE_COMPLETE
 * @returns {object} Event payload
 */
const createMaintenanceCompleteEvent = () => ({
  type: MAINTENANCE_COMPLETE,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE TIMEOUT
// ============================================================================

/**
 * Événement de timeout d'exploration
 * Déclenché lorsque le temps maximum d'exploration est écoulé
 */
const EXPLORATION_TIMEOUT = 'EXPLORATION_TIMEOUT';

/**
 * Créateur d'événement: EXPLORATION_TIMEOUT
 * @param {number} duration - Durée d'exploration en ms
 * @returns {object} Event payload
 */
const createExplorationTimeoutEvent = (duration) => ({
  type: EXPLORATION_TIMEOUT,
  duration,
  timestamp: Date.now()
});

/**
 * Événement de timeout de navigation
 * Déclenché lorsque le temps maximum de navigation est écoulé
 */
const NAVIGATION_TIMEOUT = 'NAVIGATION_TIMEOUT';

/**
 * Créateur d'événement: NAVIGATION_TIMEOUT
 * @param {number} duration - Durée de navigation en ms
 * @returns {object} Event payload
 */
const createNavigationTimeoutEvent = (duration) => ({
  type: NAVIGATION_TIMEOUT,
  duration,
  timestamp: Date.now()
});

/**
 * Événement de timeout d'inactivité
 * Déclenché lorsque le temps maximum d'inactivité à la base est écoulé
 */
const IDLE_TIMEOUT = 'IDLE_TIMEOUT';

/**
 * Créateur d'événement: IDLE_TIMEOUT
 * @param {number} duration - Durée d'inactivité en ms
 * @returns {object} Event payload
 */
const createIdleTimeoutEvent = (duration) => ({
  type: IDLE_TIMEOUT,
  duration,
  timestamp: Date.now()
});

/**
 * Événement de timeout de ravitaillement
 * Déclenché lorsque le temps maximum de ravitaillement est écoulé
 */
const REFUEL_TIMEOUT = 'REFUEL_TIMEOUT';

/**
 * Créateur d'événement: REFUEL_TIMEOUT
 * @param {number} duration - Durée de ravitaillement en ms
 * @returns {object} Event payload
 */
const createRefuelTimeoutEvent = (duration) => ({
  type: REFUEL_TIMEOUT,
  duration,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE VÉRIFICATION AUTOMATIQUE
// ============================================================================

/**
 * Événement de vérification de ravitaillement automatique
 * Déclenché périodiquement pour vérifier l'état du ravitaillement
 */
const AUTO_REFUEL_CHECK = 'AUTO_REFUEL_CHECK';

/**
 * Créateur d'événement: AUTO_REFUEL_CHECK
 * @returns {object} Event payload
 */
const createAutoRefuelCheckEvent = () => ({
  type: AUTO_REFUEL_CHECK,
  timestamp: Date.now()
});

/**
 * Événement de vérification de déchargement automatique
 * Déclenché périodiquement pour vérifier l'état du déchargement
 */
const AUTO_UNLOAD_CHECK = 'AUTO_UNLOAD_CHECK';

/**
 * Créateur d'événement: AUTO_UNLOAD_CHECK
 * @returns {object} Event payload
 */
const createAutoUnloadCheckEvent = () => ({
  type: AUTO_UNLOAD_CHECK,
  timestamp: Date.now()
});

// Export des types d'événements (constants)
export const SYSTEM_EVENT_TYPES = {
  ASSESSMENT_COMPLETE,
  REFUEL_COMPLETE,
  UNLOAD_COMPLETE,
  REPAIR_COMPLETE,
  MAINTENANCE_COMPLETE,
  EXPLORATION_TIMEOUT,
  NAVIGATION_TIMEOUT,
  IDLE_TIMEOUT,
  REFUEL_TIMEOUT,
  AUTO_REFUEL_CHECK,
  AUTO_UNLOAD_CHECK
};

// Export des créateurs d'événements
export const systemEvents = {
  createAssessmentCompleteEvent,
  createRefuelCompleteEvent,
  createUnloadCompleteEvent,
  createRepairCompleteEvent,
  createMaintenanceCompleteEvent,
  createExplorationTimeoutEvent,
  createNavigationTimeoutEvent,
  createIdleTimeoutEvent,
  createRefuelTimeoutEvent,
  createAutoRefuelCheckEvent,
  createAutoUnloadCheckEvent
};
