/**
 * Slice pour la gestion de base des joueurs
 */
import useGameStore from '../../useGameStore';
import { createPlayer } from '../utils/playerFactory';
import { HUMAN_PLAYER_ID, getBotPlayerId } from '../../../ai/constants/playerConstants';

const createPlayerBaseSlice = (set, get) => {
  // Récupérer la configuration depuis gameStore
  const { playerCount, botCount } = useGameStore.getState();
  
  // Générer les joueurs dynamiquement
  const initialPlayers = {
    [HUMAN_PLAYER_ID]: createPlayer(HUMAN_PLAYER_ID)
  };

  // Créer les bots
  for (let i = 0; i < botCount; i++) {
    const botId = getBotPlayerId(i);
    initialPlayers[botId] = createPlayer(botId);
  }

  return {
    // === ÉTAT INITIAL ===
    selectedVehicle: { playerId: HUMAN_PLAYER_ID, vehicleId: 'ship' },
    movementSpeeds: {
      ship: {
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
      const startingTiles = Object.values(tiles).filter((tile) => tile.type === "depart");
      if (startingTiles.length < Object.keys(get().players).length) {
        throw new Error(`Not enough starting tiles of type 'depart' found. Need ${Object.keys(get().players).length}.`);
      }

      set((state) => {
        const updatedPlayers = { ...state.players };
        
        Object.keys(updatedPlayers).forEach((playerId, index) => {
          if (index < startingTiles.length) {
            updatedPlayers[playerId] = {
              ...updatedPlayers[playerId],
              vehicles: {
                ...updatedPlayers[playerId].vehicles,
                ship: {
                  ...updatedPlayers[playerId].vehicles.ship,
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