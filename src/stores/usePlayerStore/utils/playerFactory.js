

/**
 * Crée un nouveau bot avec ses propriétés initiales (système bot-only)
 * @param {string} playerId - Identifiant du bot (ex: 'bot-0', 'bot-1')
 * @returns {Object} - Objet bot
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