/**
 * Utilitaires pour la création et la gestion des véhicules
 */

/**
 * Crée un nouveau véhicule avec les propriétés de base
 * @param {string} id - Identifiant du véhicule
 * @param {boolean} isShip - Si true, crée un vaisseau avec propriétés supplémentaires
 * @returns {Object} - Objet véhicule
 */
export const createVehicle = (id, isShip = false) => {
  const baseVehicle = {
    id,
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
  
  if (isShip) {
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
  
  return baseVehicle;
};