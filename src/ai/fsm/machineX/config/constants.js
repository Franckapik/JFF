/**
 * ============================================================================
 * FSM CONSTANTS SIMPLIFIED - Version finale unifiée
 * ============================================================================
 * 
 * Constantes essentielles pour l'architecture XState FSM.
 * Élimination des doublons et constantes legacy non utilisées.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 2.0.0 - Simplified Unified Constants
 */

// ============================================================================
// ÉTATS FSM UNIFIÉS (Fusion XSTATE_STATES + BOT_STATES)
// ============================================================================

/**
 * États principaux de la machine FSM - Version unifiée
 * ✅ Remplace XSTATE_STATES et BOT_STATES pour éviter la duplication
 * ✅ Utilisé dans XState pour les transitions et la définition de machine
 * ✅ Utilisé dans initialContext.ts pour la compatibilité
 */
export const FSM_STATES = {
  // États principaux XState
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring', 
  COLLECTING: 'collecting',
  MAINTAINING: 'maintaining',  // Renommé depuis IDLE_AT_BASE pour clarté XState
  
  // États legacy spécialisés (conservés pour compatibilité)
  EXPLORING_DEPLOYING: 'exploring_deploying',
  EXPLORING_RETURNING: 'exploring_returning',
  COLLECTING_MOVING_TO_TARGET: 'collecting_moving_to_target',
  COLLECTING_RETURNING_TO_BASE: 'collecting_returning_to_base',
  IDLE_AT_BASE: 'idleAtBase'  // Alias legacy pour MAINTAINING
};

// ============================================================================
// CONFIGURATION D'ÉVALUATION
// ============================================================================

/**
 * Seuils pour les décisions de l'état EVALUATING
 * ✅ Basés sur les conditions de evaluatingState.js
 * ❌ Non utilisé directement mais gardé pour cohérence de l'architecture
 */
export const EVALUATION_THRESHOLDS = {
  // Seuils de maintenance (priorité 1)
  CRITICAL_FUEL: 30,
  CRITICAL_DAMAGE: 50,
  
  // Seuils de capacité du vaisseau (priorité 2)
  SHIP_CAPACITY_THRESHOLD: 0.9,
  
  // Seuils d'exploration (priorité 3)
  MIN_TILES_EXPLORED: 3,
  
  // Seuils d'efficacité pour earned rest
  LOW_FUEL_REST: 50,
  HIGH_DAMAGE_REST: 30,
  TILES_FOR_REST: 2
};

// ============================================================================
// CONFIGURATION DU CYCLE D'EXPLORATION
// ============================================================================

/**
 * Configuration du cycle d'exploration
 * ✅ Utilisé dans guards.all.js et initialContext.ts
 */
export const EXPLORATION_CYCLE_CONFIG = {
  TILES_BEFORE_COLLECTION: 5,
  MIN_TILES_BEFORE_COLLECTION: 3
};

/**
 * Configuration de l'exploration par drone
 * ✅ Utilisé dans droneExploringActions.js et tileFilterSlice.js
 */
export const DRONE_EXPLORATION_CONFIG = {
  MAX_EXPLORATION_RADIUS: 2  // Rayon maximum pour l'exploration des drones (en tuiles)
};

// ============================================================================
// TYPES ET CAPACITÉS DES VÉHICULES
// ============================================================================

/**
 * Types de véhicules supportés
 * ✅ Utilisé dans guards.all.js, resourcesActions.js, shipCollectingActions.js
 */
export const VEHICLE_TYPES = {
  MAIN_SHIP: 'main-ship'
};

/**
 * Capacités par défaut des véhicules
 * ✅ Utilisé dans guards.all.js, resourcesActions.js, shipCollectingActions.js
 */
export const DEFAULT_CAPACITIES = {
  [VEHICLE_TYPES.MAIN_SHIP]: {
    food: 200,
    debris: 1800,
    special: 3
  }
};

/**
 * État de véhicule par défaut
 * ✅ Utilisé dans shipCollectingActions.js
 */
export const DEFAULT_VEHICLE_STATE = {
  isMoving: false,
  speed: 4,
  health: 100,
  shield: 0,
  active: true
};

// ============================================================================
// TYPES D'ENTITÉS
// ============================================================================

/**
 * Types d'entités supportés par XState
 * ✅ Utilisé dans initialContext.ts
 */
export const ENTITY_TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
  HUMAN: 'human'
};

// ============================================================================
// STRUCTURE DE DONNÉES
// ============================================================================

/**
 * Structure vide pour les ressources
 * ✅ Utilisée dans resourcesActions.js pour initialisation
 */
export const EMPTY_RESOURCES = {
  food: 0,
  debris: 0,
  special: 0
};

// ============================================================================
// CONSTANTES DE CARBURANT UNIFIÉES (Fusion FUEL_THRESHOLDS + FUEL_CONSTANTS)
// ============================================================================

/**
 * Configuration unifiée du système carburant
 * ✅ Fusion de FUEL_THRESHOLDS (utilisé dans guards.all.js) et FUEL_CONSTANTS (utilisé dans fuelActions.js)
 * ✅ Élimine la duplication entre les deux constantes
 */
export const FUEL_CONFIG = {
  // Valeurs de carburant
  MAX_FUEL: 100,
  MIN_FUEL: 0,
  
  // Seuils décisionnels
  CRITICAL: 10,    // Ex-FUEL_THRESHOLDS.CRITICAL et FUEL_CONSTANTS.CRITICAL_FUEL_THRESHOLD
  LOW: 30,         // Ex-FUEL_THRESHOLDS.LOW (30) - priorité sur FUEL_CONSTANTS.LOW_FUEL_THRESHOLD (20)
  FULL: 100,       // Ex-FUEL_THRESHOLDS.FULL et FUEL_CONSTANTS.MAX_FUEL
  
  // Consommation
  DEFAULT_CONSUMPTION: 5,
  CONSUMPTION_PER_DISTANCE: 2
};

// ============================================================================
// CONSTANTES DE RESSOURCES
// ============================================================================

/**
 * Constantes de ressources pour la logique d'efficacité
 * ✅ Utilisé dans guards.all.js et shipCollectingActions.js
 */
export const RESOURCE_CONSTANTS = {
  FOOD: 'food',
  DEBRIS: 'debris',
  SPECIAL: 'special',
  MIN_COLLECTION: 1,
  RETURN_TO_BASE_THRESHOLD: 0.8,
  RESOURCE_TYPES: {
    FOOD: 'food',
    DEBRIS: 'debris', 
    SPECIAL: 'special',
  }
};

// ============================================================================
// CONFIGURATION POSITION TRACKER
// ============================================================================

/**
 * Configuration pour le Position Tracker FSM
 * ✅ Largement utilisé dans tous les trackers (drone/ship handlers)
 */
export const POSITION_TRACKER_CONFIG = {
  THRESHOLDS: {
    // Seuils communs
    TARGET_REACH: 1,
    TARGET_REACH_CLOSE: 1.2,
    TARGET_REACH_FAR: 2.0,
    RESET_MOVEMENT: 6.0,
    
    // Seuils drones
    DEPLOYMENT_START: 0.8,
    DRONE_APPROACHING_SHIP: 1.0,
    
    // Seuils vaisseaux
    SHIP_MOVEMENT_START: 0.1,
    STATION_REACH: 0.3,
  },
  TIMINGS: {
    // Timings communs
    EVENT_COOLDOWN: 300,
    DEBUG_LOG_INTERVAL: 1000,
    
    // Timings drones
    DEPLOYMENT_RESET: 1500,
    EXPLORATION_RESET: 1000,
    RETURN_RESET: 1500,
    
    // Timings vaisseaux
    SHIP_MOVEMENT_RESET: 600,
    SHIP_ARRIVAL_RESET: 1000,
    COLLECTION_DURATION: 600,
    COLLECTION_RESET: 4000,
    REFUEL_DURATION: 3000,
    REFUEL_RESET: 5000,
  }
};

// ============================================================================
// CONFIGURATION DES DRONES
// ============================================================================

/**
 * États visuels des drones pour l'animation R3F
 * ✅ Utilisé dans initialContext.ts et droneExploringActions.js
 */
export const DRONE_VISUAL_STATES = {
  docked: 'docked',
  deploying: 'deploying',
  exploring: 'exploring',
  returning: 'returning',
  failed: 'failed'
};

/**
 * Types de drones
 * ✅ Utilisé dans droneExploringActions.js
 */
export const DRONE_TYPES = {
  explorer: 'explorer',
  combat: 'combat', 
  special: 'special'
};

/**
 * Configuration des drones par type
 * ✅ Utilisé dans droneExploringActions.js
 */
export const DRONE_CONFIG = {
  explorer: {
    speed: 8.0,
    range: 5,
    scanRadius: 2,
    fuelConsumption: 1
  },
  combat: {
    speed: 6.0,
    range: 3,
    scanRadius: 1,
    fuelConsumption: 2
  },
  special: {
    speed: 7.2,
    range: 4,
    scanRadius: 3,
    fuelConsumption: 1.5
  }
};

// ============================================================================
// UTILITAIRES ID
// ============================================================================

/**
 * Générateur d'ID pour les bots
 * ✅ Utilisé dans useXFSM.js
 */
export const getBotId = (index = 0) => `bot-${index}`;

/**
 * Générateur d'ID de vaisseau principal
 * ✅ Utilisé potentiellement dans les actions
 */
export const getMainShipId = (botId = 'bot-0') => `${botId}-main-ship`;

// ============================================================================
// EXPORTS PAR DÉFAUT ET ALIASES LEGACY
// ============================================================================

export default {
  FSM_STATES,
  EVALUATION_THRESHOLDS,
  EXPLORATION_CYCLE_CONFIG,
  DRONE_EXPLORATION_CONFIG,
  VEHICLE_TYPES,
  DEFAULT_CAPACITIES,
  DEFAULT_VEHICLE_STATE,
  ENTITY_TYPES,
  EMPTY_RESOURCES,
  FUEL_CONFIG,
  RESOURCE_CONSTANTS,
  POSITION_TRACKER_CONFIG,
  DRONE_VISUAL_STATES,
  DRONE_TYPES,
  DRONE_CONFIG,
  getBotId,
  getMainShipId,
};