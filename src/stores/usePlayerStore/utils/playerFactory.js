import { createVehicle } from './vehicleFactory';
import { 
  getMainShipId, 
  getAllDroneIds, 
  VEHICLE_TYPES,
  getDroneId
} from '../../../ai/constants/playerConstants';

/**
 * Crée un nouveau joueur avec ses propriétés initiales
 * @param {string} playerId - Identifiant du joueur (ex: 'player-1')
 * @returns {Object} - Objet joueur
 */
export const createPlayer = (playerId) => {
  const vehicles = {
    [getMainShipId(playerId)]: createVehicle(getMainShipId(playerId), VEHICLE_TYPES.SHIP),
  };

  // Ajouter les drones avec leurs types spécifiques
  vehicles[getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE)] = createVehicle(
    getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE),
    VEHICLE_TYPES.EXPLORER_DRONE
  );
  vehicles[getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE)] = createVehicle(
    getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE),
    VEHICLE_TYPES.COMBAT_DRONE
  );
  vehicles[getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE)] = createVehicle(
    getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE),
    VEHICLE_TYPES.SPECIAL_DRONE
  );
  
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