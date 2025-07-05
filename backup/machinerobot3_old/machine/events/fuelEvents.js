/**
 * ============================================================================
 * ÉVÉNEMENTS DE CARBURANT - Gestion du carburant des véhicules
 * ============================================================================
 * 
 * Les événements liés à la gestion du carburant des véhicules.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// Import des constantes issues du module fuel.js
const FUEL_CONSTANTS = {
  MAX_FUEL: 100,
  MIN_FUEL: 0,
  DEFAULT_CONSUMPTION: 5,
  LOW_FUEL_THRESHOLD: 20,
  CRITICAL_FUEL_THRESHOLD: 10,
  CONSUMPTION_PER_DISTANCE: 2
};

// ============================================================================
// ÉVÉNEMENTS DE GESTION DU CARBURANT
// ============================================================================

/**
 * Événement de consommation de carburant
 * Déclenché lors de la consommation de carburant
 */
const FUEL_CONSUMED = 'FUEL_CONSUMED';

/**
 * Créateur d'événement: FUEL_CONSUMED
 * @param {number} amount - Quantité de carburant consommée
 * @param {number} newLevel - Nouveau niveau de carburant
 * @returns {object} Event payload
 */
const createFuelConsumedEvent = (amount, newLevel) => ({
  type: FUEL_CONSUMED,
  amount,
  newLevel,
  timestamp: Date.now()
});

/**
 * Événement d'ajout de carburant
 * Déclenché lors de l'ajout de carburant
 */
const FUEL_ADDED = 'FUEL_ADDED';

/**
 * Créateur d'événement: FUEL_ADDED
 * @param {number} amount - Quantité de carburant ajoutée
 * @param {number} newLevel - Nouveau niveau de carburant
 * @returns {object} Event payload
 */
const createFuelAddedEvent = (amount, newLevel) => ({
  type: FUEL_ADDED,
  amount,
  newLevel,
  timestamp: Date.now()
});

/**
 * Événement de niveau de carburant modifié
 * Déclenché lorsque le niveau de carburant est défini
 */
const FUEL_LEVEL_SET = 'FUEL_LEVEL_SET';

/**
 * Créateur d'événement: FUEL_LEVEL_SET
 * @param {number} newLevel - Nouveau niveau de carburant
 * @param {number} oldLevel - Ancien niveau de carburant
 * @returns {object} Event payload
 */
const createFuelLevelSetEvent = (newLevel, oldLevel) => ({
  type: FUEL_LEVEL_SET,
  newLevel,
  oldLevel,
  timestamp: Date.now()
});

/**
 * Événement de carburant critique notifié
 * Déclenché lorsque le niveau de carburant est critique et notification nécessaire
 */
const FUEL_CRITICAL_NOTIFICATION = 'FUEL_CRITICAL_NOTIFICATION';

/**
 * Créateur d'événement: FUEL_CRITICAL_NOTIFICATION
 * @param {number} fuelLevel - Niveau de carburant actuel
 * @param {number} threshold - Seuil critique
 * @returns {object} Event payload
 */
const createFuelCriticalNotificationEvent = (fuelLevel, threshold = FUEL_CONSTANTS.CRITICAL_FUEL_THRESHOLD) => ({
  type: FUEL_CRITICAL_NOTIFICATION,
  fuel: fuelLevel,
  threshold,
  timestamp: Date.now()
});

/**
 * Événement de consommation pour distance
 * Déclenché lors de la consommation de carburant pour une distance
 */
const FUEL_CONSUMED_FOR_DISTANCE = 'FUEL_CONSUMED_FOR_DISTANCE';

/**
 * Créateur d'événement: FUEL_CONSUMED_FOR_DISTANCE
 * @param {number} distance - Distance parcourue
 * @param {number} amount - Quantité de carburant consommée
 * @param {number} newLevel - Nouveau niveau de carburant
 * @returns {object} Event payload
 */
const createFuelConsumedForDistanceEvent = (distance, amount, newLevel) => ({
  type: FUEL_CONSUMED_FOR_DISTANCE,
  distance,
  amount,
  newLevel,
  timestamp: Date.now()
});

// Export des types d'événements (constants)
export const FUEL_EVENT_TYPES = {
  FUEL_CONSUMED,
  FUEL_ADDED,
  FUEL_LEVEL_SET,
  FUEL_CRITICAL_NOTIFICATION,
  FUEL_CONSUMED_FOR_DISTANCE
};

// Export des créateurs d'événements
export const fuelEvents = {
  createFuelConsumedEvent,
  createFuelAddedEvent,
  createFuelLevelSetEvent,
  createFuelCriticalNotificationEvent,
  createFuelConsumedForDistanceEvent
};
