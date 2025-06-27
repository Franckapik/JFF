/**
 * ============================================================================
 * XSTATE FSM CONSTANTS - Constantes pour Machine XState
 * ============================================================================
 * 
 * Constantes essentielles pour l'état EVALUATING migré depuis Robot3.
 * Uniquement les constantes activement utilisées par la nouvelle architecture.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// ÉTATS FSM XSTATE
// ============================================================================

/**
 * États possibles de la machine XState
 * Mappés depuis BOT_STATES de Robot3 mais adaptés à XState
 */
export const XSTATE_STATES = {
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring', 
  COLLECTING: 'collecting',
  MAINTAINING: 'maintaining'  // Renommé depuis IDLE_AT_BASE pour clarté
};

/**
 * Sous-états pour EXPLORING
 */
export const EXPLORING_SUBSTATES = {
  DRONE_DEPLOYING: 'drone_deploying',
  DRONE_SCANNING: 'drone_scanning', 
  DRONE_RETURNING: 'drone_returning'
};

/**
 * Sous-états pour COLLECTING
 */
export const COLLECTING_SUBSTATES = {
  SHIP_MOVING_TO_TILE: 'ship_moving_to_tile',
  SHIP_COLLECTING: 'ship_collecting',
  SHIP_RETURNING: 'ship_returning'
};

/**
 * Sous-états pour MAINTAINING
 */
export const MAINTAINING_SUBSTATES = {
  SHIP_ON_BASE: 'ship_on_base',
  DEPOSITING: 'depositing',
  REPAIRING: 'repairing',
  REFUELING: 'refueling'
};

// ============================================================================
// CONFIGURATION D'ÉVALUATION
// ============================================================================

/**
 * Seuils pour les décisions de l'état EVALUATING
 * Inspirés de l'ancien système Robot3 mais simplifiés
 */
export const EVALUATION_THRESHOLDS = {
  // Seuils de maintenance (priorité 1)
  CRITICAL_FUEL: 30,          // Carburant critique (%)
  CRITICAL_DAMAGE: 50,        // Dégâts critiques (%)
  
  // Seuils de capacité du vaisseau (priorité 2)
  SHIP_CAPACITY_THRESHOLD: 0.8,  // 80% plein
  
  // Seuils d'exploration (priorité 3)
  MIN_TILES_EXPLORED: 3,      // Minimum de tuiles à explorer
  
  // Seuils d'efficacité
  LOW_FUEL: 50,               // Carburant faible (%)
  HIGH_DAMAGE: 30             // Dégâts élevés (%)
};

/**
 * Configuration du cycle d'exploration
 * Simplifiée depuis EXPLORATION_CYCLE_CONFIG
 */
export const EXPLORATION_CONFIG = {
  TILES_BEFORE_COLLECTION: 3,  // Tuiles à explorer avant collecte
  MAX_EXPLORATION_RADIUS: 5,   // Rayon maximum d'exploration
  MIN_RESOURCE_VALUE: 1        // Valeur minimum de ressource à collecter
};

// ============================================================================
// CAPACITÉS DES VÉHICULES
// ============================================================================

/**
 * Capacités par défaut des véhicules
 * Inspirées de DEFAULT_CAPACITIES mais simplifiées
 */
export const VEHICLE_CAPACITIES = {
  main_ship: {
    food: 200,
    debris: 1800, 
    special: 3
  }
};

/**
 * Types de véhicules supportés
 */
export const VEHICLE_TYPES = {
  MAIN_SHIP: 'main_ship'
};

// ============================================================================
// TYPES D'ENTITÉS
// ============================================================================

/**
 * Types d'entités supportés par XState
 */
export const ENTITY_TYPES = {
  AUTO: 'auto',        // Bot autonome
  MANUAL: 'manual',    // Bot contrôlé manuellement  
  HUMAN: 'human'       // Player humain
};

// ============================================================================
// STRUCTURE DE DONNÉES
// ============================================================================

/**
 * Structure vide pour les ressources
 */
export const EMPTY_RESOURCES = {
  food: 0,
  debris: 0,
  special: 0
};

/**
 * Priorités de décision pour l'état EVALUATING
 */
export const DECISION_PRIORITIES = {
  MAINTENANCE: 1,      // Priorité maximale
  COLLECTING: 2,       // Priorité moyenne
  EXPLORING: 3,        // Priorité basse
  IDLE: 4             // Priorité minimum
};

// ============================================================================
// ÉVÉNEMENTS XSTATE
// ============================================================================

/**
 * Événements générés par l'état EVALUATING
 * Utilisés pour les transitions XState
 */
export const EVALUATING_EVENTS = {
  NEED_EXPLORING: 'needExploring',
  NEED_COLLECTING: 'needCollecting', 
  NEED_MAINTENANCE: 'needMaintenance'
};

/**
 * Raisons des transitions (pour debugging)
 */
export const TRANSITION_REASONS = {
  CRITICAL_CONDITION: 'critical_condition',
  RESOURCES_AVAILABLE: 'resources_available',
  INSUFFICIENT_EXPLORATION: 'insufficient_exploration',
  IDLE_TIME: 'idle_time'
};

// ============================================================================
// EXPORTS PAR DÉFAUT
// ============================================================================

export default {
  XSTATE_STATES,
  EXPLORING_SUBSTATES,
  COLLECTING_SUBSTATES,
  MAINTAINING_SUBSTATES,
  EVALUATION_THRESHOLDS,
  EXPLORATION_CONFIG,
  VEHICLE_CAPACITIES,
  VEHICLE_TYPES,
  ENTITY_TYPES,
  EMPTY_RESOURCES,
  DECISION_PRIORITIES,
  EVALUATING_EVENTS,
  TRANSITION_REASONS
};
