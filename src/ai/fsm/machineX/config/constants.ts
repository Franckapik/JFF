/**
 * ============================================================================
 * FSM TYPES & CONSTANTS - Version moderne avec Types Union (TypeScript)
 * ============================================================================
 * 
 * Transformation complète vers les types union pour une meilleure expérience TypeScript.
 * Plus simple, plus sûr, et meilleure auto-complétion.
 * 
 * @author Migration TypeScript - Types Union
 * @version 4.0.0 - Modern TypeScript Types
 */

// ============================================================================
// IMPORTS DES TYPES DRONES (déjà unifiés)
// ============================================================================

export type {
  DroneFSMState, DroneType,
  DroneVisualState
} from '../../../../types/drone.d.ts';

// ============================================================================
// TYPES UNION POUR LES ÉTATS FSM
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

// ============================================================================
// TYPES UNION POUR LES TILES ET RESSOURCES
// ============================================================================

/**
 * Types de tiles - Version union
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
 * Biomes des tiles - Version union
 */
export type TileBiome = 
  | 'space'
  | 'asteroid'
  | 'nebula'
  | 'station'
  | 'grassland';

/**
 * Types de ressources - Version union
 */
export type ResourceType = 'food' | 'debris' | 'special';

/**
 * Niveaux de carburant - Version union
 */
export type FuelLevel = 'full' | 'normal' | 'low' | 'critical';

// ============================================================================
// CONFIGURATIONS NUMÉRIQUES (gardées en constantes)
// ============================================================================

/**
 * Seuils pour les décisions de l'état EVALUATING
 */
export const EVALUATION_THRESHOLDS = {
  // Seuils de maintenance (priorité 1)
  CRITICAL_FUEL: 30,
  CRITICAL_DAMAGE: 50,
  
  // Seuils d'exploration (priorité 2)
  EXPLORATION_FUEL_MIN: 50,
  EXPLORATION_RADIUS: 3,
  
  // Seuils de collecte (priorité 3)
  COLLECTION_FUEL_MIN: 40,
  COLLECTION_CAPACITY_MAX: 80,
  COLLECTION_EFFICIENCY: 0.7
} as const;

// ============================================================================
// CONFIGURATION D'EXPLORATION
// ============================================================================

/**
 * Configuration pour l'état EXPLORING
 * ✅ Utilisé directement dans exploringState.js et initialContext.ts
 */
export const EXPLORATION_CYCLE_CONFIG = {
  // Timings des cycles d'exploration
  FULL_CYCLE_DURATION: 15000,        // 15 secondes
  DRONE_DEPLOYMENT_DURATION: 3000,   // 3 secondes
  DRONE_RETURN_DURATION: 2000,       // 2 secondes

  // Configuration des drones
  SIMULTANEOUS_DRONES: 2,             // Nombre de drones en simultané
  EXPLORATION_RADIUS: 3,              // Rayon d'exploration

  // Gestion des resources
  FUEL_CONSUMPTION_RATE: 0.1,        // Consommation par cycle
  DISCOVERY_BONUS: 10,                // Bonus de découverte

  // Ajout pour guards/all : nombre de tuiles à explorer avant collecte
  TILES_BEFORE_COLLECTION: 10         // Valeur par défaut, à ajuster selon besoin
} as const;

// ============================================================================
// CONFIGURATION DE COLLECTE
// ============================================================================

/**
 * Configuration pour l'état COLLECTING
 * ✅ Utilisé dans collectingState.js
 */
export const COLLECTION_CONFIG = {
  // Capacité et efficacité
  MAX_CAPACITY: 100,
  COLLECTION_RATE: 5,                 // Unités par seconde
  EFFICIENCY_BONUS: 1.2,              // Multiplicateur d'efficacité
  
  // Timings
  COLLECTION_DURATION: 5000,          // 5 secondes par collecte
  TRAVEL_TIME_MULTIPLIER: 1.5,        // Multiplicateur pour temps de voyage
  
  // Ressources
  FUEL_CONSUMPTION_RATE: 0.15,        // Plus élevé que l'exploration
  CRITICAL_FUEL_RETURN: 25            // Retour forcé si carburant < 25
} as const;

// ============================================================================
// CONFIGURATION DE MAINTENANCE
// ============================================================================

/**
 * Configuration pour l'état MAINTAINING (ex-IDLE_AT_BASE)
 * ✅ Utilisé dans idleAtBaseState.js
 */
export const MAINTENANCE_CONFIG = {
  // Taux de réparation
  FUEL_REPAIR_RATE: 2,                // Unités par seconde
  DAMAGE_REPAIR_RATE: 1,              // Points par seconde
  
  // Seuils de réparation complète
  FULL_FUEL_THRESHOLD: 95,            // % de carburant pour considérer plein
  FULL_HEALTH_THRESHOLD: 95,          // % de santé pour considérer réparé
  
  // Durée minimum de maintenance
  MIN_MAINTENANCE_TIME: 2000,         // 2 secondes minimum
  
  // Coût de la maintenance
  RESOURCE_COST_MULTIPLIER: 0.1       // Coût en ressources de la réparation
} as const;

// ============================================================================
// TYPES D'ENTITÉS (supprimé - utiliser le type EntityType directement)
// ============================================================================

// ============================================================================
// CONFIGURATION DES ÉVÉNEMENTS
// ============================================================================

/**
 * Configuration des événements XState
 * ✅ Utilisé pour le debouncing et la gestion d'événements
 */
export const EVENT_CONFIG = {
  // Délais de debouncing (en ms)
  POSITION_UPDATE_DEBOUNCE: 100,      // Mises à jour de position
  RESOURCE_UPDATE_DEBOUNCE: 500,      // Mises à jour de ressources
  STATE_CHANGE_DEBOUNCE: 200,         // Changements d'état
  
  // Timeouts d'événements
  EMERGENCY_EVENT_TIMEOUT: 1000,      // Événements d'urgence
  USER_EVENT_TIMEOUT: 5000,           // Événements utilisateur
  
  // Retry et backoff
  MAX_RETRY_ATTEMPTS: 3,              // Tentatives maximum
  RETRY_BACKOFF_MS: 1000              // Délai entre tentatives
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
 * Vérifie si une valeur est un type d'entité valide
 */
export function isValidEntityType(type: string): type is EntityType {
  return type === 'auto' || type === 'player';
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
 * Vérifie si une valeur est un biome de tile valide
 */
export function isValidTileBiome(biome: string): biome is TileBiome {
  const validBiomes: TileBiome[] = ['space', 'asteroid', 'nebula', 'station', 'grassland'];
  return validBiomes.includes(biome as TileBiome);
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

/**
 * Vérifie si le carburant est critique
 */
export function isCriticalFuel(fuelAmount: number): boolean {
  return fuelAmount <= FUEL_CONFIG.CRITICAL;
}

/**
 * Vérifie si le carburant est bas
 */
export function isLowFuel(fuelAmount: number): boolean {
  return fuelAmount <= FUEL_CONFIG.LOW;
}

// ============================================================================
// COMPATIBILITÉ AVEC L'ANCIEN SYSTÈME (SUPPRIMÉ - utiliser types union)
// ============================================================================

// ============================================================================
// CONFIGURATION DU TRACKER DE POSITION
// ============================================================================

/**
 * Configuration pour le système de tracking de position
 * ✅ Utilisé dans les handlers et trackers
 */
export const POSITION_TRACKER_CONFIG = {
  // Seuils de distance pour le tracking
  THRESHOLD_CLOSE: 1.0,               // Distance considérée comme "proche"
  THRESHOLD_MEDIUM: 3.0,              // Distance moyenne
  THRESHOLD_FAR: 8.0,                 // Distance lointaine
  
  // Délais de debouncing
  POSITION_UPDATE_DELAY: 100,         // ms entre les mises à jour
  
  // Facteurs de vitesse
  MOVEMENT_SPEED_FACTOR: 1.0,         // Multiplicateur de vitesse
  DRONE_SPEED_FACTOR: 1.5,           // Vitesse spécifique aux drones
  SHIP_SPEED_FACTOR: 0.8,            // Vitesse spécifique aux vaisseaux
  
  // Seuils structurés
  THRESHOLDS: {
    TARGET_REACH: 1.5,               // Distance pour considérer une cible atteinte
    MIN_MOVEMENT: 0.5                // Mouvement minimum pour déclencher un événement
  },
  
  // Configuration des timings
  TIMINGS: {
    EVENT_COOLDOWN: 200,             // Délai de cooldown pour les événements
    EXPLORATION_RESET: 3000,         // Reset pour l'exploration
    RETURN_RESET: 2000,              // Reset pour le retour
    MOVEMENT_RESET: 1000             // Reset pour les mouvements
  }
} as const;

// ============================================================================
// CONFIGURATION DES TILES ET RESSOURCES (NETTOYÉ)
// ============================================================================

/**
 * Constantes de ressources - version numérique
 * ✅ Utilisé dans la génération de tiles
 */
export const RESOURCE_CONSTANTS = {
  BASE_QUANTITY: 50,
  MAX_QUANTITY: 100,
  RARITY_FACTOR: 0.3,
  DISCOVERY_BONUS: 10
} as const;

/**
 * Configuration d'exploration des drones - version numérique
 * ✅ Utilisé dans les filtres de tiles
 */
export const DRONE_EXPLORATION_CONFIG = {
  SCAN_RADIUS: 2,
  SCAN_DURATION: 3000,
  DISCOVERY_PROBABILITY: 0.7,
  RESOURCE_DISCOVERY_BONUS: 1.5,
  MAX_EXPLORATION_RADIUS: 10
} as const;

// ============================================================================
// CONFIGURATION DU CARBURANT - Version avec Types Union
// ============================================================================

/**
 * Configuration des seuils de carburant avec types union
 * ✅ Utilisé dans les guards pour les vérifications de carburant
 * ✅ Type safety avec les FuelLevel union types
 */
export const FUEL_CONFIG = {
  FULL: 100,        // Réservoir plein
  LOW: 30,          // Carburant bas
  CRITICAL: 10      // Carburant critique
} as const;

/**
 * Type pour la configuration du carburant
 */
export type FuelConfigType = typeof FUEL_CONFIG;

/**
 * Mapping entre les valeurs numériques et les types union FuelLevel
 */
export const FUEL_LEVEL_MAPPING: Record<FuelLevel, number> = {
  full: FUEL_CONFIG.FULL,
  normal: 50, // Entre FULL et LOW
  low: FUEL_CONFIG.LOW,
  critical: FUEL_CONFIG.CRITICAL
} as const;

// ============================================================================
// EXPORTS FINAUX - VERSION CLEAN
// ============================================================================

/**
 * Export groupé des configurations numériques uniquement
 * ✅ Plus de constantes d'objets - uniquement types union et configs numériques
 */
export const CONFIGURATIONS = {
  EVALUATION_THRESHOLDS,
  EXPLORATION_CYCLE_CONFIG,
  COLLECTION_CONFIG,
  MAINTENANCE_CONFIG,
  EVENT_CONFIG,
  POSITION_TRACKER_CONFIG,
  RESOURCE_CONSTANTS,
  DRONE_EXPLORATION_CONFIG,
  FUEL_CONFIG
} as const;
