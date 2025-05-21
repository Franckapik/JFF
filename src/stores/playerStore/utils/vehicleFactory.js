/**
 * Utilitaires pour la création et la gestion des véhicules
 */

import { VEHICLE_TYPES, isDroneActiveByDefault, isDroneId } from '../../../ai/constants/playerConstants';

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
    progress: 0,
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
      maxCapacity: { food: 100, debris: 1000, special: 2 },
    };
  }
  
  if (isDroneId(id)) {
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
          maxCapacity: { food: 0, debris: 0, special: 0 },  // Can't carry resources
          explorationBonus: 1.5  // Better at exploring
        };
      case VEHICLE_TYPES.COMBAT_DRONE:
        return {
          ...droneBase,
          maxCapacity: { food: 20, debris: 50, special: 1 },  // Can carry some resources
          damage: 5,  // Base damage for combat
          attackRange: 2,  // Combat range
          mineLayingCapacity: 3  // Can lay mines
        };
      case VEHICLE_TYPES.SPECIAL_DRONE:
        return {
          ...droneBase,
          maxCapacity: { food: 0, debris: 0, special: 0 },  // Can't carry resources
          specialScanRange: 5,  // Better at finding special objects
          specialDetection: true  // Can detect special items
        };
      default:
        return droneBase;
    }
  }
  
  return baseVehicle;
};