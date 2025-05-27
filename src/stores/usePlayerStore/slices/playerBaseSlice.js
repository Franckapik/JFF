/**
 * Slice pour la gestion de base des joueurs
 */
import useGameStore from '../../useGameStore/';
import { createPlayer } from '../utils/playerFactory';
import { HUMAN_PLAYER_ID, getBotId, getMainShipId, VEHICLE_TYPES } from '../../../ai/constants/playerConstants';

const createPlayerBaseSlice = (set, get) => {
  // Récupérer la configuration depuis gameStore
  const { playerCount, botCount } = useGameStore.getState();
  
  // Générer les joueurs dynamiquement
  const initialPlayers = {
    [HUMAN_PLAYER_ID]: createPlayer(HUMAN_PLAYER_ID)
  };

  // Créer les bots
  for (let i = 0; i < botCount; i++) {
    const botId = getBotId(i);
    initialPlayers[botId] = createPlayer(botId);
  }

  return {
    // === ÉTAT INITIAL ===
    selectedVehicle: { playerId: HUMAN_PLAYER_ID, vehicleId: getMainShipId(HUMAN_PLAYER_ID) },
    movementSpeeds: {
      [VEHICLE_TYPES.SHIP]: {
        speed: 2,
        rotationSpeed: 2.0
      },
      drone: {
        speed: 3,
        rotationSpeed: 2.5
      }
    },
    players: initialPlayers,

    // === ACTIONS ===
    /**
     * Initialise les positions des joueurs sur les tuiles de départ
     * @param {Object} tiles - Les tuiles du jeu
     */
    initializePlayer: (tiles) => {
      const 수요players = get().players;
      const numberOfPlayers = Object.keys(수요players).length;
      const startingTiles = Object.values(tiles).filter((tile) => tile.type === "depart");

      if (startingTiles.length < numberOfPlayers) {
        // Message d'erreur amélioré
        const errorMessage = `Not enough starting tiles of type 'depart' found. Need ${numberOfPlayers} (for ${playerCount} human players and ${botCount} bots), but found only ${startingTiles.length}. Check tile generation or player/bot count in useGameStore.`;
        console.error(errorMessage, {
          needed: numberOfPlayers,
          found: startingTiles.length,
          playerCountFromGameStore: playerCount,
          botCountFromGameStore: botCount,
          playersToInitialize: 수요players,
          availableStartingTiles: startingTiles
        });
        throw new Error(errorMessage);
      }

      set((state) => {
        const updatedPlayers = { ...state.players };
        
        Object.keys(updatedPlayers).forEach((playerId, index) => {
          if (index < startingTiles.length) {
            const shipId = getMainShipId(playerId);
            updatedPlayers[playerId] = {
              ...updatedPlayers[playerId],
              vehicles: {
                ...updatedPlayers[playerId].vehicles,
                [shipId]: {
                  ...updatedPlayers[playerId].vehicles[shipId],
                  position: startingTiles[index].position,
                  coord: startingTiles[index].coord,
                  startCoord: startingTiles[index].coord,
                },
              },
            };
          }
        });
        
        return { players: updatedPlayers };
      });
    },

    /**
     * Sélectionne le véhicule actif pour un joueur
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     */
    selectVehicle: (playerId, vehicleId) => {
      set(() => ({
        selectedVehicle: { playerId, vehicleId },
      }));
    },
  };
};

export default createPlayerBaseSlice;