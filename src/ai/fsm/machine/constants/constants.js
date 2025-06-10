/**
 * ============================================================================
 * FSM Constants - Constantes globales pour la FSM
 * ============================================================================
 * 
 * Définition des constantes communes pour la machine FSM.
 * Ce fichier contient uniquement les constantes activement utilisées.
 * 
 * @author FSM Migration
 * @version 2.0.0 - Nettoyage et ajout exploring_prospecting
 */

// ============================================================================
// ÉTATS FSM
// ============================================================================

/**
 * États possibles du bot FSM
 */
export const BOT_STATES = {
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring', 
  EXPLORING_DEPLOYING: 'exploring_deploying',
  EXPLORING_PROSPECTING: 'exploring_prospecting',  // Nouveau sous-état pour la prospection
  EXPLORING_RETURNING: 'exploring_returning',
  COLLECTING: 'collecting',
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
  prospecting: 'prospecting', // En phase de prospection détaillée
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
    TARGET_REACH: 0.25,        // Distance pour considérer la cible atteinte
    RESET_MOVEMENT: 0.5,       // Distance pour nettoyer les flags (TARGET_REACH * 2)
    
    // === SEUILS DRONES ===
    DEPLOYMENT_START: 0.1,     // Distance pour déclencher le déploiement de drone
    
    // === SEUILS VAISSEAUX ===
    SHIP_MOVEMENT_START: 0.1,  // Distance pour déclencher le mouvement du vaisseau
    STATION_REACH: 0.3,        // Distance pour atteindre une station (fuel/repair)
  },
  TIMINGS: {
    // === TIMINGS COMMUNS ===
    EVENT_COOLDOWN: 1000,      // Cooldown entre événements identiques
    DEBUG_LOG_INTERVAL: 2000,  // Intervalle des logs de debug
    
    // === TIMINGS DRONES ===
    DEPLOYMENT_RESET: 5000,    // Reset du flag de déploiement
    EXPLORATION_RESET: 3000,   // Reset du flag d'exploration
    RETURN_RESET: 5000,        // Reset du flag de retour
    PROSPECTING_DURATION: 3000, // Durée de la phase de prospection
    
    // === TIMINGS VAISSEAUX ===
    SHIP_MOVEMENT_RESET: 2000, // Reset du flag de mouvement vaisseau
    SHIP_ARRIVAL_RESET: 3000,  // Reset du flag d'arrivée vaisseau
    COLLECTION_DURATION: 2000, // Durée de collecte des ressources
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
 * Configuration des drones par type
 */
export const DRONE_CONFIG = {
  explorer: {
    speed: 2.0,
    range: 5,
    scanRadius: 2,
    fuelConsumption: 1
  },
  combat: {
    speed: 1.5,
    range: 3,
    scanRadius: 1,
    fuelConsumption: 2
  },
  special: {
    speed: 1.8,
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
 * États de véhicule par défaut
 */
export const DEFAULT_VEHICLE_STATE = {
  isMoving: false,
  speed: 1,
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
 * États d'exploration possibles
 */
export const EXPLORATION_STATES = {
  IDLE: 'idle',
  SEARCHING_TARGET: 'searching_target',
  EXPLORING: 'exploring',
  RETURNING: 'returning',
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
