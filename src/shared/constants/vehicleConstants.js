/**
 * ============================================================================
 * VEHICLE CONSTANTS - Constantes unifiées pour les véhicules
 * ============================================================================
 * 
 * Définition unifiée de tous les types de véhicules et leurs capacités.
 * Remplace les anciennes constantes dispersées.
 */

// ============================================================================
// TYPES DE VÉHICULES
// ============================================================================

export const VEHICLE_TYPES = {
  SHIP: 'ship',                    // Vaisseau principal (compatible avec vehicleFactory)
  MAIN_SHIP: 'main-ship',          // Alias pour compatibility FSM
  EXPLORER_DRONE: 'explorer_drone',
  COMBAT_DRONE: 'combat_drone', 
  SPECIAL_DRONE: 'special_drone'
};

// ============================================================================
// CAPACITÉS PAR VÉHICULE
// ============================================================================

export const VEHICLE_CAPACITIES = {
  [VEHICLE_TYPES.SHIP]: { food: 200, debris: 1800, special: 3 },          // Capacité optimisée
  [VEHICLE_TYPES.MAIN_SHIP]: { food: 200, debris: 1800, special: 3 },     // Même capacité
  [VEHICLE_TYPES.EXPLORER_DRONE]: { food: 0, debris: 0, special: 0 },     // Pas de collecte
  [VEHICLE_TYPES.COMBAT_DRONE]: { food: 20, debris: 50, special: 1 },     // Collecte limitée
  [VEHICLE_TYPES.SPECIAL_DRONE]: { food: 0, debris: 0, special: 0 }       // Pas de collecte
};

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Vérifie si un ID correspond à un drone
 */
export const isDroneId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return id.includes('drone') || id.includes('explorer') || id.includes('combat') || id.includes('special');
};

/**
 * Vérifie si un drone est actif par défaut selon son type
 */
export const isDroneActiveByDefault = (droneType) => {
  switch(droneType) {
    case VEHICLE_TYPES.EXPLORER_DRONE:
      return true;  // Explorer drones sont actifs par défaut
    case VEHICLE_TYPES.COMBAT_DRONE:
    case VEHICLE_TYPES.SPECIAL_DRONE:
      return false; // Combat et special drones sont inactifs par défaut
    default:
      return false;
  }
};

/**
 * Génère un ID de bot
 */
export const getBotId = (index = 0) => `bot-${index}`;

/**
 * Génère un ID de vaisseau principal
 */
export const getMainShipId = (botId = 'bot-0') => `${botId}-main-ship`;
