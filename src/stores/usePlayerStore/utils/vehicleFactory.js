/**
 * Utilitaires pour la création et la gestion des véhicules
 */

import { VEHICLE_TYPES, DEFAULT_CAPACITIES } from '../../../ai/fsm/machine/constants/constants.js';

/**
 * Vérifie si un ID correspond à un drone
 */
const isDroneId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return id.includes('drone') || id.includes('explorer') || id.includes('combat') || id.includes('special');
};

/**
 * Vérifie si un drone est actif par défaut selon son type
 */
const isDroneActiveByDefault = (droneType) => {
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
 * Crée un nouveau véhicule avec les propriétés de base
 * @param {string} id - Identifiant du véhicule
 * @param {string} type - Type de véhicule (ship, explorer_drone, etc.)
 * @returns {Object} - Objet véhicule
 */
export const createVehicle = (id, type) => {
  const baseVehicle = {
    id,
    type,
    position: null,
    coord: null,
    isMoving: false,
    progress: 0, // ✅ FIX #3.5: Progress commence à 0 par défaut
    resources: { food: 0, debris: 0, special: 0 },
    targetTile: {
      position: null,
      coord: null,
    },
  };
  
  if (type === VEHICLE_TYPES.SHIP) {
    return {
      ...baseVehicle,
      fuel: 100,
      damage: 0,
      totalDistance: 0,
      path: [],
      startCoord: null,
      isAtCapacity: false,
      maxCapacity: DEFAULT_CAPACITIES[VEHICLE_TYPES.SHIP],
    };
  }
  
  // Sécuriser l'appel à isDroneId contre les valeurs null/undefined
  if (id && isDroneId(id)) {
    const droneType = type;
    const droneBase = {
      ...baseVehicle,
      isActive: isDroneActiveByDefault(droneType),
      fuel: 50,
      damage: 0,
    };

    switch(droneType) {
      case VEHICLE_TYPES.EXPLORER_DRONE:
        return {
          ...droneBase,
          maxCapacity: DEFAULT_CAPACITIES[VEHICLE_TYPES.EXPLORER_DRONE],
          explorationBonus: 1.5  // Better at exploring
        };
      case VEHICLE_TYPES.COMBAT_DRONE:
        return {
          ...droneBase,
          maxCapacity: DEFAULT_CAPACITIES[VEHICLE_TYPES.COMBAT_DRONE],
          damage: 5,  // Base damage for combat
          attackRange: 2,  // Combat range
          mineLayingCapacity: 3  // Can lay mines
        };
      case VEHICLE_TYPES.SPECIAL_DRONE:
        return {
          ...droneBase,
          maxCapacity: DEFAULT_CAPACITIES[VEHICLE_TYPES.SPECIAL_DRONE],
          specialScanRange: 5,  // Better at finding special objects
          specialDetection: true,  // Can detect special items
          specialAbilityCharge: 100  // Special ability charge at 100%
        };
      default:
        return droneBase;
    }
  }
  
  return baseVehicle;
};