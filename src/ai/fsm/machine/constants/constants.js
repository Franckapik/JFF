/**
 * ============================================================================
 * FSM Constants - Constantes globales pour la FSM
 * ============================================================================
 * 
 * Définition des constantes communes pour la machine FSM
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

// États possibles du bot
export const BOT_STATES = {
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring', 
  COLLECTING: 'collecting',
  RETURNING: 'returning',
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

/**
 * États visuels des drones pour l'animation
 */
export const DRONE_VISUAL_STATES = {
  docked: 'docked',           // En formation autour du vaisseau
  deploying: 'deploying',     // En mouvement vers la cible
  exploring: 'exploring',     // À la cible, en exploration
  returning: 'returning',     // En retour vers le vaisseau
  failed: 'failed'           // En erreur
};

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
