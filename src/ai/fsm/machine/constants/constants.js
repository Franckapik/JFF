/**
 * ============================================================================
 * FSM Constants - Constantes globales pour la FSM
 * ============================================================================
 * 
 * Définition des constantes communes pour la machine FSM.
 * Ce fichier contient uniquement les constantes activement utilisées.
 * 
 * @author FSM Migration
 * @version 2.0.0 - Nettoyage et simplification exploration
 */

// ============================================================================
// ÉTATS FSM
// ============================================================================

/**
 * États possibles du bot FSM (états principaux de la machine d'état)
 * Ces états définissent le comportement global du bot, différents des sous-états internes
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
 * Types d'entités supportés
 */
export const ENTITY_TYPES = {
  auto: 'auto',        // Bot autonome
  manual: 'manual',    // Bot contrôlé manuellement (debug)
  human: 'human'       // Player humain (Phase 6)
};

// ============================================================================
// ÉTATS VISUELS DES DRONES
// ============================================================================

/**
 * États visuels des drones pour l'animation R3F
 */
export const DRONE_VISUAL_STATES = {
  docked: 'docked',           // En formation autour du vaisseau
  deploying: 'deploying',     // En mouvement vers la cible
  exploring: 'exploring',     // À la cible, en exploration
  returning: 'returning',     // En retour vers le vaisseau
  failed: 'failed'           // En erreur
};

// ============================================================================
// CONFIGURATION POSITION TRACKER
// ============================================================================

/**
 * Configuration pour le Position Tracker FSM
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
 * Capacités par défaut des véhicules
 */
export const DEFAULT_CAPACITY = {
  food: 100,
  debris: 1000,
  special: 2
};

/**
 * États de déploiement des drones
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
 */
export const DRONE_TYPES = {
  explorer: 'explorer',
  combat: 'combat', 
  special: 'special'
};

/**
 * Configuration des drones par type 🚀 VITESSES ACCÉLÉRÉES
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

/**
 * Types de véhicules supportés
 */
export const VEHICLE_TYPES = {
  MAIN_SHIP: 'main-ship',
  DRONE: 'drone',
  SCOUT: 'scout',
  HARVESTER: 'harvester'
};

/**
 * États de véhicule par défaut 🚀 VITESSE ACCÉLÉRÉE
 */
export const DEFAULT_VEHICLE_STATE = {
  isMoving: false,
  speed: 4,      // x4 plus rapide (était 1)
  health: 100,
  shield: 0,
  active: true
};

/**
 * Configuration par défaut des capacités par type de véhicule
 */
export const DEFAULT_CAPACITIES = {
  'main-ship': { food: 100, debris: 1000, special: 2 },
  'drone': { food: 20, debris: 50, special: 1 },
  'scout': { food: 10, debris: 20, special: 0 },
  'harvester': { food: 50, debris: 500, special: 1 }
};

/**
 * Constantes pour la gestion du carburant
 */
export const FUEL_CONSTANTS = {
  MAX_FUEL: 100,
  MIN_FUEL: 0,
  DEFAULT_CONSUMPTION: 5,
  LOW_FUEL_THRESHOLD: 20,
  CRITICAL_FUEL_THRESHOLD: 10,
  CONSUMPTION_PER_DISTANCE: 2
};

/**
 * Seuils de carburant (déplacé de fuelGuard.js)
 */
export const FUEL_THRESHOLDS = {
  CRITICAL: 10,     // Niveau critique (urgence)
  LOW: 20,          // Niveau bas (attention)
  NORMAL: 50,       // Niveau normal
  FULL: 100         // Réservoir plein
};

/**
 * Constantes de ressources (déplacé de resourcesGuard.js)
 */
export const RESOURCE_CONSTANTS = {
  DEFAULT_CAPACITY: 100,    // Capacité par défaut
  MIN_COLLECTION: 1,        // Collecte minimale
  RESOURCE_TYPES: {
    FOOD: 'food',
    DEBRIS: 'debris', 
    SPECIAL: 'special',
  }
};

/**
 * Constantes de mouvement (déplacé de movementGuard.js)
 */
export const MOVEMENT_CONSTANTS = {
  MAX_DAMAGE: 100,          // Dommage maximal (véhicule détruit)
  CRITICAL_DAMAGE: 75,      // Niveau de dommage critique
  HIGH_DAMAGE: 50,          // Niveau de dommage élevé
  SAFE_DAMAGE: 25,          // Niveau de dommage acceptable
  MIN_SPEED: 0.1,           // Vitesse minimale
  TARGET_TOLERANCE: 0.5     // Tolérance pour atteindre une cible
};

/**
 * Constantes d'exploration (déplacé de explorationGuard.js) 🚀 TIMINGS ACCÉLÉRÉS
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
 * Ces états sont différents des états FSM principaux (BOT_STATES)
 */
export const EXPLORATION_STATES = {
  IDLE: 'idle',
  SEARCHING_TARGET: 'searching_target',
  EXPLORING: 'exploring',
  COMPLETED: 'completed'
};

/**
 * Types de découvertes
 */
export const DISCOVERY_TYPES = {
  RESOURCE: 'resource',
  EMPTY_TILE: 'empty_tile',
  OBSTACLE: 'obstacle',
  SPECIAL: 'special'
};

/**
 * Configuration par défaut pour l'exploration
 */
export const EXPLORATION_CONFIG = {
  DEFAULT_RADIUS: 3,
  MAX_EXPLORATION_TIME: 30000, // 30 secondes
  MIN_EXPLORATION_DISTANCE: 1,
  MAX_EXPLORATION_DISTANCE: 10
};

/**
 * Configuration du cycle d'exploration multi-tuiles
 */
export const EXPLORATION_CYCLE_CONFIG = {
  TILES_BEFORE_COLLECTION: 2,           // Nombre de tuiles à explorer avant collecte (réduit pour tests)
  MIN_TILES_BEFORE_COLLECTION: 1,       // Minimum de tuiles avant d'autoriser la collecte (réduit pour tests)
  MAX_EXPLORATION_CYCLES: 5,             // Maximum de cycles d'exploration par session
  CYCLE_TIMEOUT: 600000,                 // 10 minutes maximum par cycle
  
  // Priorités des ressources pour sélection de meilleure tuile
  RESOURCE_PRIORITIES: {
    special: 10,     // Ressources spéciales = priorité max
    food: 2,         // Nourriture = priorité moyenne
    debris: 1        // Débris = priorité basse
  }
};
