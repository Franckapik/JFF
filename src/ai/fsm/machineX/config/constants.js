/**
 * ============================================================================
 * XSTATE FSM CONSTANTS - Constantes pour Machine XState
 * ============================================================================
 * 
 * Constantes essentielles pour l'état EVALUATING migré depuis Robot3.
 * Analysées depuis evaluatingState.js - UNIQUEMENT les constantes utilisées.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// ÉTATS FSM XSTATE (Mappés depuis BOT_STATES utilisés dans evaluatingState.js)
// ============================================================================

/**
 * États possibles de la machine XState
 * ✅ Utilisés dans evaluatingState.js pour les transitions EVALUATION_COMPLETE
 */
export const XSTATE_STATES = {
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring', 
  COLLECTING: 'collecting',
  MAINTAINING: 'maintaining'  // Renommé depuis IDLE_AT_BASE pour clarté XState
};

/**
 * Sous-états pour EXPLORING (mappés depuis BOT_STATES.EXPLORING_DEPLOYING, etc.)
 * ✅ Utilisés dans les transitions evaluatingState.js
 */
export const EXPLORING_SUBSTATES = {
  DRONE_DEPLOYING: 'drone_deploying',        // depuis BOT_STATES.EXPLORING_DEPLOYING
  DRONE_SCANNING: 'drone_scanning', 
  DRONE_RETURNING: 'drone_returning'         // depuis BOT_STATES.EXPLORING_RETURNING
};

/**
 * Sous-états pour COLLECTING (mappés depuis BOT_STATES.COLLECTING_*, etc.)
 * ✅ Utilisés dans les transitions evaluatingState.js
 */
export const COLLECTING_SUBSTATES = {
  SHIP_MOVING_TO_TILE: 'ship_moving_to_tile',      // depuis BOT_STATES.COLLECTING_MOVING_TO_TARGET
  SHIP_COLLECTING: 'ship_collecting',
  SHIP_RETURNING: 'ship_returning'                  // depuis BOT_STATES.COLLECTING_RETURNING_TO_BASE
};

/**
 * Sous-états pour MAINTAINING (mappé depuis BOT_STATES.IDLE_AT_BASE)
 * ✅ Utilisé dans les transitions evaluatingState.js
 */
export const MAINTAINING_SUBSTATES = {
  SHIP_ON_BASE: 'ship_on_base',
  DEPOSITING: 'depositing',
  REPAIRING: 'repairing',
  REFUELING: 'refueling'
};

// ============================================================================
// CONFIGURATION D'ÉVALUATION (Inspirées des seuils utilisés dans evaluatingState.js)
// ============================================================================

/**
 * Seuils pour les décisions de l'état EVALUATING
 * ✅ Basés sur les conditions de evaluatingState.js
 */
export const EVALUATION_THRESHOLDS = {
  // Seuils de maintenance (priorité 1) - ligne 34-35 evaluatingState.js
  CRITICAL_FUEL: 30,          // fuel < 30 → maintenance
  CRITICAL_DAMAGE: 50,        // damage > 50 → maintenance
  
  // Seuils de capacité du vaisseau (priorité 2) - ligne 188 evaluatingState.js
  SHIP_CAPACITY_THRESHOLD: 0.9,  // 90% plein pour isShipNotFull
  
  // Seuils d'exploration (priorité 3) - ligne 180 evaluatingState.js
  MIN_TILES_EXPLORED: 3,      // EXPLORATION_CYCLE_CONFIG?.MIN_TILES_BEFORE_COLLECTION || 3
  
  // Seuils d'efficacité pour earned rest - lignes 70-74 evaluatingState.js
  LOW_FUEL_REST: 50,               // isLowEnergy
  HIGH_DAMAGE_REST: 30,            // needsRepair
  TILES_FOR_REST: 2                // hasWorkedEnough
};

/**
 * Configuration du cycle d'exploration
 * ✅ Utilisé ligne 180 evaluatingState.js : EXPLORATION_CYCLE_CONFIG?.MIN_TILES_BEFORE_COLLECTION
 */
export const EXPLORATION_CONFIG = {
  MIN_TILES_BEFORE_COLLECTION: 3,  // ✅ Utilisé dans evaluatingState.js ligne 180
  TILES_BEFORE_COLLECTION: 5,      // Pour compatibilité avec ancien système
  MAX_EXPLORATION_RADIUS: 5,       // Rayon maximum d'exploration
  MIN_RESOURCE_VALUE: 1             // Valeur minimum de ressource à collecter
};

// ============================================================================
// CAPACITÉS DES VÉHICULES (Utilisées dans evaluatingState.js)
// ============================================================================

/**
 * Types de véhicules supportés
 * ✅ Utilisé ligne 186 evaluatingState.js : DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP]
 */
export const VEHICLE_TYPES = {
  MAIN_SHIP: 'main-ship'  // ✅ Utilisé dans evaluatingState.js
};

/**
 * Capacités par défaut des véhicules
 * ✅ Utilisé ligne 186 evaluatingState.js : DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP]
 */
export const VEHICLE_CAPACITIES = {
  [VEHICLE_TYPES.MAIN_SHIP]: {
    food: 200,    // ✅ Utilisé pour calcul isShipNotFull
    debris: 1800, // ✅ Utilisé pour calcul isShipNotFull  
    special: 3    // ✅ Utilisé pour calcul isShipNotFull
  }
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
// STRUCTURE DE DONNÉES (Utilisées dans la logique d'évaluation)
// ============================================================================

/**
 * Structure vide pour les ressources
 * ✅ Utilisée pour initialisation dans la logique d'évaluation
 */
export const EMPTY_RESOURCES = {
  food: 0,
  debris: 0,
  special: 0
};

/**
 * Priorités de décision pour l'état EVALUATING
 * ✅ Basées sur l'ordre des transitions dans evaluatingState.js
 */
export const DECISION_PRIORITIES = {
  MAINTENANCE: 1,      // Priorité 1 : lignes 32-57 evaluatingState.js
  COLLECTING: 2,       // Priorité 2 : lignes 169-262 evaluatingState.js
  EXPLORING: 3,        // Priorité 3 : lignes 263-309 evaluatingState.js
  IDLE: 4             // Priorité 4 : ligne 326 evaluatingState.js (par défaut)
};

// ============================================================================
// ÉVÉNEMENTS XSTATE (Générés par evaluatingState.js)
// ============================================================================

/**
 * Événements générés par l'état EVALUATING pour les transitions XState
 * ✅ Adaptés depuis les événements custom de Robot3 vers syntaxe XState
 */
export const EVALUATING_EVENTS = {
  NEED_EXPLORING: 'needExploring',      // Transition vers exploring
  NEED_COLLECTING: 'needCollecting',    // Transition vers collecting
  NEED_MAINTENANCE: 'needMaintenance'   // Transition vers maintaining
};

/**
 * Raisons des transitions (pour debugging et logs)
 * ✅ Inspirées des contextes dans evaluatingState.js
 */
export const TRANSITION_REASONS = {
  // Maintenance
  CRITICAL_CONDITION: 'critical_condition',                    // fuel/damage critiques
  MAINTENANCE_AFTER_COLLECTION: 'maintenance_required_after_collection',
  EARNED_REST: 'earned_rest_after_collection',
  
  // Collection
  RESOURCES_AVAILABLE: 'resources_available',                  // ressources disponibles
  SMART_COLLECTION: 'smart_collection_ship_not_full',
  BEST_TILE_AFTER_EXPLORATION: 'best_tile_after_exploration_cycle',
  
  // Exploration  
  INSUFFICIENT_EXPLORATION: 'insufficient_exploration',        // pas assez exploré
  NEW_CYCLE_AFTER_COLLECTION: 'new_cycle_after_collection',
  
  // Idle
  IDLE_TIME: 'idle_time',                                      // rien à faire
  NOTHING_TO_DO: 'nothing_to_do'
};

// ============================================================================
// ÉVÉNEMENTS DE MOUVEMENT (Utilisés dans evaluatingState.js)
// ============================================================================

/**
 * Événements de mouvement utilisés dans les transitions evaluatingState.js
 * ✅ Lignes 349-362 evaluatingState.js
 */
export const MOVEMENT_EVENTS = {
  SHIP_UPDATE_POSITION: 'SHIP_UPDATE_POSITION',        // ✅ ligne 349
  DRONE_POSITION_UPDATE: 'DRONE_POSITION_UPDATE'       // ✅ ligne 356
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
  TRANSITION_REASONS,
  MOVEMENT_EVENTS
};
