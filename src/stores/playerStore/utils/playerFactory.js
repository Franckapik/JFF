import { createVehicle } from './vehicleFactory';
import { getMainShipId, getAllDroneIds } from '../../../ai/constants/playerConstants';

/**
 * Crée un nouveau joueur avec ses propriétés initiales
 * @param {string} playerId - Identifiant du joueur (ex: 'player1')
 * @returns {Object} - Objet joueur
 */
export const createPlayer = (playerId) => {
  const vehicles = {
    [getMainShipId()]: createVehicle(`${getMainShipId()}`, true),
  };

  // Ajouter les drones
  getAllDroneIds(playerId).forEach(droneId => {
    vehicles[droneId] = createVehicle(droneId);
  });
  
  return {
    id: playerId,
    exploringRadius: 3,
    vehicles: vehicles,
    score: {
      resources: { food: 0, debris: 0, special: 0 },
    },
    memory: {
      knownResources: [],
      knownDangers: [],
      explorationCount: 0,
      collectedResources: [],
    },
    messages: [],
  };
};