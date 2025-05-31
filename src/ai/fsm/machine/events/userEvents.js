/**
 * ============================================================================
 * ÉVÉNEMENTS UTILISATEUR - Actions initiées par l'utilisateur
 * ============================================================================
 * 
 * Les événements utilisateur sont déclenchés par des actions directes de 
 * l'utilisateur ou via l'interface utilisateur.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// ============================================================================
// ÉVÉNEMENTS DE COMMANDE UTILISATEUR
// ============================================================================

/**
 * Événement de dérogation manuelle
 * Déclenché lorsque l'utilisateur prend le contrôle manuel du bot
 */
const MANUAL_OVERRIDE = 'MANUAL_OVERRIDE';

/**
 * Créateur d'événement: MANUAL_OVERRIDE
 * @param {string} command - Commande manuelle à exécuter
 * @param {object} params - Paramètres de la commande
 * @returns {object} Event payload
 */
const createManualOverrideEvent = (command, params = {}) => ({
  type: MANUAL_OVERRIDE,
  command,
  params,
  timestamp: Date.now()
});

/**
 * Événement de demande d'exploration
 * Déclenché lorsque l'utilisateur demande une exploration
 */
const EXPLORATION_REQUESTED = 'EXPLORATION_REQUESTED';

/**
 * Créateur d'événement: EXPLORATION_REQUESTED
 * @param {object} targetArea - Zone cible pour l'exploration
 * @returns {object} Event payload
 */
const createExplorationRequestedEvent = (targetArea = null) => ({
  type: EXPLORATION_REQUESTED,
  targetArea,
  timestamp: Date.now()
});

/**
 * Événement de déplacement vers une destination
 * Déclenché lorsque l'utilisateur demande un déplacement
 */
const MOVE_TO = 'MOVE_TO';

/**
 * Créateur d'événement: MOVE_TO
 * @param {object} targetTile - Tuile de destination
 * @param {boolean} useEfficiency - Utiliser le chemin le plus efficace
 * @returns {object} Event payload
 */
const createMoveToEvent = (targetTile, useEfficiency = true) => ({
  type: MOVE_TO,
  targetTile,
  useEfficiency,
  timestamp: Date.now()
});

/**
 * Événement d'arrêt de mouvement
 * Déclenché lorsque l'utilisateur demande l'arrêt du mouvement
 */
const STOP = 'STOP';

/**
 * Créateur d'événement: STOP
 * @param {string} reason - Raison de l'arrêt
 * @returns {object} Event payload
 */
const createStopEvent = (reason = 'user_request') => ({
  type: STOP,
  reason,
  timestamp: Date.now()
});

/**
 * Événement de démarrage de réparation
 * Déclenché lorsque l'utilisateur demande une réparation
 */
const REPAIR_STARTED = 'REPAIR_STARTED';

/**
 * Créateur d'événement: REPAIR_STARTED
 * @param {number} targetHealth - Niveau de santé cible
 * @returns {object} Event payload
 */
const createRepairStartedEvent = (targetHealth = 100) => ({
  type: REPAIR_STARTED,
  targetHealth,
  timestamp: Date.now()
});

// Export des types d'événements (constants)
export const USER_EVENT_TYPES = {
  MANUAL_OVERRIDE,
  EXPLORATION_REQUESTED,
  MOVE_TO,
  STOP,
  REPAIR_STARTED
};

// Export des créateurs d'événements
export const userEvents = {
  createManualOverrideEvent,
  createExplorationRequestedEvent,
  createMoveToEvent,
  createStopEvent,
  createRepairStartedEvent
};
