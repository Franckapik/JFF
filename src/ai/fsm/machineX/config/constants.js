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
// CONFIGURATION DU CYCLE D'EXPLORATION (utilisée dans les guards de découverte)
// ============================================================================

/**
 * Configuration du cycle d'exploration (utilisé dans discovery.guards.js)
 */
export const EXPLORATION_CYCLE_CONFIG = {
  TILES_BEFORE_COLLECTION: 5,
  MIN_TILES_BEFORE_COLLECTION: 3
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
// CAPACITÉS PAR DÉFAUT DES VÉHICULES (utilisées dans les guards d'efficacité)
// ============================================================================

/**
 * Capacités par défaut des véhicules (utilisé dans efficiency.guards.js)
 */
export const DEFAULT_CAPACITIES = {
  [VEHICLE_TYPES.MAIN_SHIP]: {
    food: 200,
    debris: 1800,
    special: 3
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
// SEUILS DE CARBURANT (utilisés dans les guards de sécurité/efficacité)
// ============================================================================

/**
 * Seuils de carburant pour la logique de sécurité et d'efficacité
 * Utilisé dans safety.guards.js et efficiency.guards.js
 */
export const FUEL_THRESHOLDS = {
  CRITICAL: 10, // Critique : nécessite retour urgent
  LOW: 30,     // Bas : nécessite attention
  FULL: 100    // Plein : réservoir rempli
};

// ============================================================================
// CONSTANTES DE MOUVEMENT (utilisées dans les guards de sécurité)
// ============================================================================

/**
 * Constantes de mouvement pour la logique de sécurité
 * Utilisé dans safety.guards.js
 */
export const MOVEMENT_CONSTANTS = {
  CRITICAL_DAMAGE: 90, // Seuil de dégâts critiques
  MAX_DAMAGE: 100,     // Dégâts maximum
  MIN_SPEED: 1         // Vitesse minimale considérée comme opérationnelle
};

// ============================================================================
// CONSTANTES DE RESSOURCES (utilisées dans les guards d'efficacité)
// ============================================================================

/**
 * Constantes de ressources pour la logique d'efficacité
 * Utilisé dans efficiency.guards.js et actions
 */
export const RESOURCE_CONSTANTS = {
  FOOD: 'food',
  DEBRIS: 'debris',
  SPECIAL: 'special',
  MIN_COLLECTION: 1,        // Collecte minimale
  RETURN_TO_BASE_THRESHOLD: 0.8, // Seuil de retour à la base (80% d'un type de ressource)
  RESOURCE_TYPES: {
    FOOD: 'food',
    DEBRIS: 'debris', 
    SPECIAL: 'special',
  }
};

// ============================================================================
// CONFIGURATION POSITION TRACKER (Utilisée dans les trackers)
// ============================================================================

/**
 * Configuration pour le Position Tracker FSM
 * ✅ Utilisé dans les trackers de drone et ship
 */
export const POSITION_TRACKER_CONFIG = {
  THRESHOLDS: {
    // === SEUILS COMMUNS ===
    TARGET_REACH: 0.6,         // Distance pour considérer la cible atteinte (ajusté à 0.6 pour équilibrer précision/tolérance)
    TARGET_REACH_CLOSE: 0.4,   // Distance pour tuiles très proches (< 1.0 unité)
    TARGET_REACH_FAR: 0.8,     // Distance pour tuiles éloignées (> 2.0 unités)
    RESET_MOVEMENT: 4.0,       // Distance pour nettoyer les flags (TARGET_REACH * 5)
    
    // === SEUILS DRONES ===
    DEPLOYMENT_START: 0.5,     // Distance pour déclencher le déploiement de drone (était 0.1 - trop strict)
    DRONE_APPROACHING_SHIP: 0.6, // Distance pour détecter que le drone s'approche du vaisseau
    
    // === SEUILS VAISSEAUX ===
    SHIP_MOVEMENT_START: 0.1,  // Distance pour déclencher le mouvement du vaisseau
    STATION_REACH: 0.3,        // Distance pour atteindre une station (fuel/repair)
  },
  TIMINGS: {
    // === TIMINGS COMMUNS 🚀 ACCÉLÉRÉS ===
    EVENT_COOLDOWN: 300,       // Cooldown entre événements identiques (était 1000)
    DEBUG_LOG_INTERVAL: 1000,  // Intervalle des logs de debug (était 2000)
    
    // === TIMINGS DRONES 🚀 ACCÉLÉRÉS ===
    DEPLOYMENT_RESET: 1500,    // Reset du flag de déploiement (était 5000)
    EXPLORATION_RESET: 1000,   // Reset du flag d'exploration (était 3000)
    RETURN_RESET: 1500,        // Reset du flag de retour (était 5000)
    
    // === TIMINGS VAISSEAUX 🚀 ACCÉLÉRÉS ===
    SHIP_MOVEMENT_RESET: 600,  // Reset du flag de mouvement vaisseau (était 2000)
    SHIP_ARRIVAL_RESET: 1000,  // Reset du flag d'arrivée vaisseau (était 3000)
    COLLECTION_DURATION: 600,  // Durée de collecte des ressources (était 2000)
    COLLECTION_RESET: 4000,    // Reset du flag de collecte
    REFUEL_DURATION: 3000,     // Durée du refuel
    REFUEL_RESET: 5000,        // Reset du flag de refuel
  }
};

// ============================================================================
// ÉTATS FSM LEGACY (Compatibilité avec l'ancien système)
// ============================================================================

/**
 * États possibles du bot FSM (états principaux de la machine d'état)
 * ✅ Utilisé dans initialContext.js pour compatibilité
 */
export const BOT_STATES = {
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring',                          // ⚠️ LEGACY: Use specific sub-states instead
  EXPLORING_DEPLOYING: 'exploring_deploying',
  EXPLORING_RETURNING: 'exploring_returning',      // Retour DRONE vers VAISSEAU
  COLLECTING: 'collecting',                        // ⚠️ LEGACY: Use specific sub-states instead
  COLLECTING_MOVING_TO_TARGET: 'collecting_moving_to_target',    // Déplacement VAISSEAU vers tuile cible
  COLLECTING_RETURNING_TO_BASE: 'collecting_returning_to_base',  // Retour VAISSEAU vers BASE après collecte
  IDLE_AT_BASE: 'idleAtBase'
};

/**
 * États visuels des drones pour l'animation R3F
 * ✅ Utilisé dans initialContext.js
 */
export const DRONE_VISUAL_STATES = {
  docked: 'docked',           // En formation autour du vaisseau
  deploying: 'deploying',     // En mouvement vers la cible
  exploring: 'exploring',     // À la cible, en exploration
  returning: 'returning',     // En retour vers le vaisseau
  failed: 'failed'           // En erreur
};

// ============================================================================
// CONFIGURATION DES DRONES (Utilisée dans les actions d'exploration)
// ============================================================================

/**
 * États de déploiement des drones
 * ✅ Utilisé dans droneExploringActions.js
 */
export const DRONE_DEPLOYMENT_STATES = {
  docked: 'docked',
  deploying: 'deploying',
  active: 'active',
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
 * Configuration des drones par type 🚀 VITESSES ACCÉLÉRÉES
 * ✅ Utilisé dans droneExploringActions.js
 */
export const DRONE_CONFIG = {
  explorer: {
    speed: 8.0,   // x4 plus rapide (était 2.0)
    range: 5,
    scanRadius: 2,
    fuelConsumption: 1
  },
  combat: {
    speed: 6.0,   // x4 plus rapide (était 1.5)
    range: 3,
    scanRadius: 1,
    fuelConsumption: 2
  },
  special: {
    speed: 7.2,   // x4 plus rapide (était 1.8)
    range: 4,
    scanRadius: 3,
    fuelConsumption: 1.5
  }
};

// ============================================================================
// CONSTANTES ADDITIONNELLES DES VÉHICULES
// ============================================================================

/**
 * États de véhicule par défaut 🚀 VITESSE ACCÉLÉRÉE
 * ✅ Utilisé potentiellement dans les actions
 */
export const DEFAULT_VEHICLE_STATE = {
  isMoving: false,
  speed: 4,      // x4 plus rapide (était 1)
  health: 100,
  shield: 0,
  active: true
};

/**
 * Constantes pour la gestion du carburant
 * ✅ Utilisé potentiellement dans les actions
 */
export const FUEL_CONSTANTS = {
  MAX_FUEL: 100,
  MIN_FUEL: 0,
  DEFAULT_CONSUMPTION: 5,
  LOW_FUEL_THRESHOLD: 20,
  CRITICAL_FUEL_THRESHOLD: 10,
  CONSUMPTION_PER_DISTANCE: 2
};

// ============================================================================
// CONSTANTES D'EXPLORATION AVANCÉES
// ============================================================================

/**
 * Constantes d'exploration 🚀 TIMINGS ACCÉLÉRÉS
 * ✅ Utilisé potentiellement dans les actions d'exploration
 */
export const EXPLORATION_CONSTANTS = {
  EXPLORATION_TIMEOUT: 60000,       // 1 minute d'expiration (était 5 min)
  MAX_EXPLORED_TILES: 100,          // Maximum de tuiles explorées
  MIN_EXPLORATION_DISTANCE: 2,      // Distance minimale pour explorer
  DISCOVERY_COOLDOWN: 5000,         // 5 secondes entre découvertes (était 30s)
  EXPLORATION_RADIUS: 5             // Rayon d'exploration
};

/**
 * États d'exploration internes (sous-états pendant l'exploration)
 * ✅ Utilisé potentiellement dans les actions
 */
export const EXPLORATION_STATES = {
  IDLE: 'idle',
  SEARCHING_TARGET: 'searching_target',
  EXPLORING: 'exploring',
  COMPLETED: 'completed'
};

/**
 * Types de découvertes
 * ✅ Utilisé potentiellement dans les actions
 */
export const DISCOVERY_TYPES = {
  RESOURCE: 'resource',
  EMPTY_TILE: 'empty_tile',
  OBSTACLE: 'obstacle',
  SPECIAL: 'special'
};

// ============================================================================
// UTILITAIRES ID ADDITIONNELS
// ============================================================================

/**
 * Générateur d'ID de vaisseau principal
 * ✅ Utilisé potentiellement dans les actions
 */
export const getMainShipId = (botId = 'bot-0') => `${botId}-main-ship`;

// ============================================================================
// UTILITAIRES DE BOT ID (Utilisées dans les hooks)
// ============================================================================

/**
 * Générateur d'ID pour les bots
 * ✅ Utilisé dans useXFSM.js
 */
export const getBotId = (index = 0) => `bot-${index}`;

// ============================================================================
// EXPORTS PAR DÉFAUT (Mise à jour)
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
  MOVEMENT_EVENTS,
  POSITION_TRACKER_CONFIG,
  getBotId,
  BOT_STATES,
  DRONE_VISUAL_STATES,
  DRONE_DEPLOYMENT_STATES,
  DRONE_TYPES,
  DRONE_CONFIG,
  DEFAULT_VEHICLE_STATE,
  FUEL_CONSTANTS,
  EXPLORATION_CONSTANTS,
  EXPLORATION_STATES,
  DISCOVERY_TYPES,
  getMainShipId
};
