/**
 * ============================================================================
 * FSM TYPES - Version moderne avec Types Union (TypeScript)
 * ============================================================================
 * 
 * Transformation des constantes en types union pour une meilleure expérience TypeScript.
 * Plus simple, plus sûr, et meilleure auto-complétion.
 * 
 * @author Migration TypeScript - Types Union
 * @version 4.0.0 - Modern TypeScript Types
 */

// ============================================================================
// TYPES UNION POUR LES ÉTATS ET ENTITÉS
// ============================================================================

/**
 * États FSM principaux - Version types union
 * ✅ Auto-complétion automatique
 * ✅ Type safety strict
 * ✅ Plus simple à utiliser
 */
export type FSMState = 
  | 'evaluating'
  | 'exploring' 
  | 'collecting'
  | 'maintaining'
  | 'exploring_deploying'
  | 'exploring_returning'
  | 'collecting_moving_to_target'
  | 'collecting_returning_to_base'
  | 'idleAtBase';

/**
 * Types d'entités dans le système FSM
 */
export type EntityType = 'auto' | 'player';

/**
 * Types de tiles
 */
export type TileType = 
  | 'empty'
  | 'resource'
  | 'obstacle'
  | 'explored'
  | 'scanning'
  | 'danger'
  | 'food'
  | 'fuel'
  | 'repair'
  | 'depart';

/**
 * Biomes des tiles
 */
export type TileBiome = 
  | 'space'
  | 'asteroid'
  | 'nebula'
  | 'station'
  | 'grassland';

/**
 * Types de ressources
 */
export type ResourceType = 'food' | 'debris' | 'special';

/**
 * Niveaux de carburant
 */
export type FuelLevel = 'full' | 'normal' | 'low' | 'critical';

// ============================================================================
// CONFIGURATIONS NUMÉRIQUES (gardées en constantes)
// ============================================================================

/**
 * Seuils pour les décisions de l'état EVALUATING
 */
export const EVALUATION_THRESHOLDS = {
  CRITICAL_FUEL: 30,
  CRITICAL_DAMAGE: 50,
  EXPLORATION_FUEL_MIN: 50,
  EXPLORATION_RADIUS: 3,
  COLLECTION_FUEL_MIN: 40,
  COLLECTION_CAPACITY_MAX: 80,
  COLLECTION_EFFICIENCY: 0.7
} as const;

/**
 * Configuration pour l'état EXPLORING
 */
export const EXPLORATION_CYCLE_CONFIG = {
  FULL_CYCLE_DURATION: 15000,
  DRONE_DEPLOYMENT_DURATION: 3000,
  DRONE_RETURN_DURATION: 2000,
  SIMULTANEOUS_DRONES: 2,
  EXPLORATION_RADIUS: 3,
  FUEL_CONSUMPTION_RATE: 0.1,
  DISCOVERY_BONUS: 10
} as const;

/**
 * Configuration pour l'état COLLECTING
 */
export const COLLECTION_CONFIG = {
  MAX_CAPACITY: 100,
  COLLECTION_RATE: 5,
  EFFICIENCY_BONUS: 1.2,
  COLLECTION_DURATION: 5000,
  TRAVEL_TIME_MULTIPLIER: 1.5,
  FUEL_CONSUMPTION_RATE: 0.15,
  CRITICAL_FUEL_RETURN: 25
} as const;

/**
 * Configuration de maintenance
 */
export const MAINTENANCE_CONFIG = {
  FUEL_REPAIR_RATE: 2,
  DAMAGE_REPAIR_RATE: 1,
  FULL_FUEL_THRESHOLD: 95,
  FULL_HEALTH_THRESHOLD: 95,
  MIN_MAINTENANCE_TIME: 2000,
  RESOURCE_COST_MULTIPLIER: 0.1
} as const;

/**
 * Configuration des événements XState
 */
export const EVENT_CONFIG = {
  POSITION_UPDATE_DEBOUNCE: 100,
  RESOURCE_UPDATE_DEBOUNCE: 500,
  STATE_CHANGE_DEBOUNCE: 200,
  EMERGENCY_EVENT_TIMEOUT: 1000,
  USER_EVENT_TIMEOUT: 5000,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_BACKOFF_MS: 1000
} as const;

/**
 * Configuration du tracker de position
 */
export const POSITION_TRACKER_CONFIG = {
  THRESHOLD_CLOSE: 1.0,
  THRESHOLD_MEDIUM: 3.0,
  THRESHOLD_FAR: 8.0,
  POSITION_UPDATE_DELAY: 100,
  MOVEMENT_SPEED_FACTOR: 1.0,
  DRONE_SPEED_FACTOR: 1.5,
  SHIP_SPEED_FACTOR: 0.8,
  THRESHOLDS: {
    TARGET_REACH: 1.5,
    MIN_MOVEMENT: 0.5
  },
  TIMINGS: {
    EVENT_COOLDOWN: 200,
    EXPLORATION_RESET: 3000,
    RETURN_RESET: 2000,
    MOVEMENT_RESET: 1000
  }
} as const;

/**
 * Constantes de ressources
 */
export const RESOURCE_CONSTANTS = {
  BASE_QUANTITY: 50,
  MAX_QUANTITY: 100,
  RARITY_FACTOR: 0.3,
  DISCOVERY_BONUS: 10
} as const;

/**
 * Configuration d'exploration des drones
 */
export const DRONE_EXPLORATION_CONFIG = {
  SCAN_RADIUS: 2,
  SCAN_DURATION: 3000,
  DISCOVERY_PROBABILITY: 0.7,
  RESOURCE_DISCOVERY_BONUS: 1.5,
  MAX_EXPLORATION_RADIUS: 10
} as const;

/**
 * Configuration des seuils de carburant
 */
export const FUEL_CONFIG = {
  FULL: 100,
  LOW: 30,
  CRITICAL: 10
} as const;

// ============================================================================
// FONCTIONS UTILITAIRES DE VALIDATION
// ============================================================================

/**
 * Vérifie si une valeur est un état FSM valide
 */
export function isValidFSMState(state: string): state is FSMState {
  const validStates: FSMState[] = [
    'evaluating', 'exploring', 'collecting', 'maintaining',
    'exploring_deploying', 'exploring_returning', 
    'collecting_moving_to_target', 'collecting_returning_to_base', 'idleAtBase'
  ];
  return validStates.includes(state as FSMState);
}

/**
 * Vérifie si une valeur est un type de tile valide
 */
export function isValidTileType(type: string): type is TileType {
  const validTypes: TileType[] = [
    'empty', 'resource', 'obstacle', 'explored', 'scanning',
    'danger', 'food', 'fuel', 'repair', 'depart'
  ];
  return validTypes.includes(type as TileType);
}

/**
 * Vérifie si une valeur est un type de ressource valide
 */
export function isValidResourceType(type: string): type is ResourceType {
  const validTypes: ResourceType[] = ['food', 'debris', 'special'];
  return validTypes.includes(type as ResourceType);
}

/**
 * Détermine le niveau de carburant selon la quantité
 */
export function getFuelLevel(fuelAmount: number): FuelLevel {
  if (fuelAmount >= FUEL_CONFIG.FULL) return 'full';
  if (fuelAmount >= FUEL_CONFIG.LOW) return 'normal';
  if (fuelAmount >= FUEL_CONFIG.CRITICAL) return 'low';
  return 'critical';
}

// ============================================================================
// COMPARAISON AVANT/APRÈS
// ============================================================================

/*
AVANT (avec constantes) :
========================

// Usage verbeux et complexe
if (state === FSM_STATES.EXPLORING) { ... }
if (tileType === TILE_TYPES.FOOD) { ... }
if (fuel <= FUEL_CONFIG.LOW) { ... }

// Import lourd
import { FSM_STATES, TILE_TYPES, FUEL_CONFIG } from './constants';


APRÈS (avec types union) :
=========================

// Usage simple et direct
if (state === 'exploring') { ... }        // ← Auto-complétion automatique !
if (tileType === 'food') { ... }          // ← Type safety strict !
if (fuelLevel === 'low') { ... }          // ← Plus lisible !

// Import léger et spécifique
import type { FSMState, TileType, FuelLevel } from './types';
import { getFuelLevel } from './types';

*/
