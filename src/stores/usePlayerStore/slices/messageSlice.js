/**
 * Slice pour la gestion des messages des joueurs
 */

const createMessageSlice = (set) => {
  return {
    /**
     * Ajoute un message au journal du joueur
     * @param {string} playerId - ID du joueur
     * @param {Object} message - Message à ajouter
     */
    addPlayerMessage: (playerId, message) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          console.error(`Player with ID '${playerId}' does not exist.`);
          return state; // Return the current state without changes
        }

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              messages: [...player.messages, message],
            },
          },
        };
      });
    },

    /**
     * Marque tous les messages d'un joueur comme lus
     * @param {string} playerId - ID du joueur
     */
    markMessagesAsRead: (playerId) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          console.error(`Player with ID '${playerId}' does not exist.`);
          return state; // Return the current state without changes
        }

        const updatedMessages = player.messages.map((message) => ({
          ...message,
          isRead: true, // Mark all messages as read
        }));

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              messages: updatedMessages,
            },
          },
        };
      });
    },
  };
};

export default createMessageSlice;