/**
 * Slice pour la gestion de la mémoire du joueur (ressources connues, dangers, etc.)
 */

const createMemorySlice = (set) => {
  return {
    /**
     * Met à jour la mémoire d'un joueur
     * @param {string} playerId - ID du joueur (ex: 'player-1', 'player-2')
     * @param {Object} updates - Propriétés à mettre à jour dans la mémoire
     */
    updatePlayerMemory: (playerId, updates) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          console.error(`Player with ID '${playerId}' does not exist.`);
          return state;
        }

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                ...updates, // Applique les mises à jour à la mémoire existante
              },
            },
          },
        };
      });
    },
    
    /**
     * Ajoute une ressource à la liste des ressources connues du joueur
     * @param {string} playerId - ID du joueur
     * @param {Object} resource - Ressource à ajouter à la mémoire
     */
    addKnownResource: (playerId, resource) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        // Vérifier si la ressource existe déjà pour éviter les doublons
        const resourceExists = player.memory.knownResources.some(
          r => r.coord === resource.coord
        );
        
        if (resourceExists) return state;
        
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                knownResources: [...player.memory.knownResources, resource],
              },
            },
          },
        };
      });
    },
    
    /**
     * Ajoute un danger à la liste des dangers connus du joueur
     * @param {string} playerId - ID du joueur
     * @param {Object} danger - Danger à ajouter à la mémoire
     */
    addKnownDanger: (playerId, danger) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        // Vérifier si le danger existe déjà pour éviter les doublons
        const dangerExists = player.memory.knownDangers.some(
          d => d.coord === danger.coord
        );
        
        if (dangerExists) return state;
        
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                knownDangers: [...player.memory.knownDangers, danger],
              },
            },
          },
        };
      });
    },
    
    /**
     * Incrémente le compteur d'exploration du joueur
     * @param {string} playerId - ID du joueur
     */
    incrementExplorationCount: (playerId) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                explorationCount: player.memory.explorationCount + 1,
              },
            },
          },
        };
      });
    },
  };
};

export default createMemorySlice;