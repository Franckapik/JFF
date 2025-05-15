/**
 * Slice pour la gestion de base des joueurs
 */
import useGameStore from '../../useGameStore';
import { createPlayer } from '../utils/playerFactory';

const createPlayerBaseSlice = (set, get) => {
  // Récupérer le nombre de joueurs depuis gameStore
  const { playerCount } = useGameStore.getState();
  
  // Générer les joueurs dynamiquement
  const initialPlayers = {};
  for (let i = 1; i <= playerCount; i++) {
    initialPlayers[`player${i}`] = createPlayer(`player${i}`);
  }

  // Personnaliser le joueur 1 si nécessaire
  if (initialPlayers.player1) {
    initialPlayers.player1.vehicles.ship.damage = 20;
  }

  return {
    // === ÉTAT INITIAL ===
    selectedVehicle: { playerId: 'player1', vehicleId: 'ship' },
    movementSpeeds: {
      ship: {
        speed: 2,
        rotationSpeed: 2.0
      },
      drone: {
        speed: 2,
        rotationSpeed: 2.0
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