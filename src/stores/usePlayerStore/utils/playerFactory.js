

/**
 * Crée un nouveau joueur avec ses propriétés initiales
 * @param {string} playerId - Identifiant du joueur (ex: 'player-1')
 * @returns {Object} - Objet joueur
 */
export const createPlayer = (playerId) => {
  const vehicles = 0
  
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