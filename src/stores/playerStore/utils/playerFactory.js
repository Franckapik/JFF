/**
 * Utilitaires pour la création et la configuration des joueurs
 */
import { createVehicle } from './vehicleFactory';

/**
 * Crée un nouveau joueur avec ses propriétés initiales
 * @param {string} playerId - Identifiant du joueur (ex: 'player1')
 * @returns {Object} - Objet joueur
 */
export const createPlayer = (playerId) => {
  const playerNum = playerId.slice(-1); // Extraire le numéro du joueur (ex: 'player1' -> '1')
  const droneStartIdx = (parseInt(playerNum) - 1) * 2 + 1; // Calcule l'index de départ des drones
  
  return {
    id: playerId,
    exploringRadius: 3,
    vehicles: {
      ship: createVehicle(`ship${playerNum}`, true),
      [`drone${droneStartIdx}`]: createVehicle(`drone${droneStartIdx}`),
      [`drone${droneStartIdx + 1}`]: createVehicle(`drone${droneStartIdx + 1}`),
    },
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