import { create } from 'zustand';
import { calculatePathData } from '../utils/utils'; // Import utility functions

const usePlayerStore = create((set, get) => ({
  selectedVehicle: { playerId: 'player1', vehicleId: 'ship' }, // Default to player 1's ship
  players: {
    player1: {
      id: 'player1',
      vehicles: {
        ship: {
          id: 'ship1', // Unique ID for player 1's ship
          fuel: 100,
          damage: 20,
          position: null, // Initialize as null until tiles are available
          coord: null,
          isMoving: false,
          progress: 0,
          totalDistance: 0, // Total distance for the current path
          path: [], // Store the calculated path
          resources: { food: 0, debris: 0, special: 0 },
          startCoord: null, // Initialize as null until tiles are available
        },
        drones: [
          {
            id: 'drone1', // Add an ID for the drone
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
          },
          {
            id: 'drone2', // Add another drone with an ID
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
          },
        ],
      },
      score: {
        resources: { food: 0, debris: 0, special: 0 },
      },
      memory: {
        knownResources: [],
        knownDangers: [],
      },
      messages: [], // Ensure messages array is initialized
    },
    player2: {
      id: 'player2',
      vehicles: {
        ship: {
          id: 'ship2', // Unique ID for player 2's ship
          fuel: 100,
          damage: 0,
          position: null,
          coord: null,
          isMoving: false,
          progress: 0,
          totalDistance: 0,
          path: [],
          resources: { food: 0, debris: 0, special: 0 },
          startCoord: null,
        },
        drones: [
          {
            id: 'drone3', // Add an ID for player 2's first drone
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
          },
          {
            id: 'drone4', // Add another drone for player 2
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
            resources: { food: 0, debris: 0, special: 0 }, // Add resources for drones
          },
        ],
      },
      score: {
        resources: { food: 0, debris: 0, special: 0 },
      },
      memory: {
        knownResources: [],
        knownDangers: [],
      },
      messages: [], // Ensure messages array is initialized
    },
  },
  initializePlayer: (tiles) => {
    const startingTiles = Object.values(tiles).filter((tile) => tile.type === "depart");
    if (startingTiles.length < 2) {
      throw new Error("Not enough starting tiles of type 'depart' found.");
    }

    set((state) => ({
      players: {
        ...state.players,
        player1: {
          ...state.players.player1,
          vehicles: {
            ...state.players.player1.vehicles,
            ship: {
              ...state.players.player1.vehicles.ship,
              position: startingTiles[0].position,
              coord: startingTiles[0].coord,
              startCoord: startingTiles[0].coord,
            },
          },
        },
        player2: {
          ...state.players.player2,
          vehicles: {
            ...state.players.player2.vehicles,
            ship: {
              ...state.players.player2.vehicles.ship,
              position: startingTiles[1].position,
              coord: startingTiles[1].coord,
              startCoord: startingTiles[1].coord,
            },
          },
        },
      },
    }));
  },
  calculatePath: (tiles, selectedTile, playerId) => {
    const playerVehicle = get().players[playerId].vehicles.ship; // Access player-specific vehicle

    if (!playerVehicle || !selectedTile) return { path: [], totalDistance: 0 };

    const currentTile = Object.values(tiles).find(
      (tile) =>
        Math.abs(tile.position.x - playerVehicle.position.x) < 0.1 &&
        Math.abs(tile.position.z - playerVehicle.position.z) < 0.1
    );
    const targetTile = tiles[selectedTile];

    if (currentTile && targetTile) {
      const { path, totalDistance } = calculatePathData(currentTile, targetTile, tiles);
      set((state) => ({
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: {
                path, // Store the calculated path
                totalDistance, // Set total distance
                progress: 0, // Reset progress
              },
            },
          },
        },
      }));
      return { path, totalDistance };
    }

    return { path: [], totalDistance: 0 };
  },
  updateShip: (playerId, updates) => {
    set((state) => {
      const updatedShip = {
        ...state.players[playerId].vehicles.ship,
        ...updates,
      };

      // Check if the ship is on the starting tile
      if (
        updatedShip.coord &&
        updatedShip.coord === state.players[playerId].vehicles.ship.startCoord &&
        !updatedShip.isMoving
      ) {
        const updatedScore = { ...state.players[playerId].score.resources };
        const shipResources = updatedShip.resources;

        // Add ship resources to the player's score
        updatedScore.food += shipResources.food;
        updatedScore.debris += shipResources.debris;
        updatedScore.special += shipResources.special;

        // Reset ship resources
        updatedShip.resources = { food: 0, debris: 0, special: 0 };

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...state.players[playerId],
              vehicles: {
                ...state.players[playerId].vehicles,
                ship: updatedShip,
              },
              score: {
                ...state.players[playerId].score,
                resources: updatedScore,
              },
            },
          },
        };
      }

      return {
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            vehicles: {
              ...state.players[playerId].vehicles,
              ship: updatedShip,
            },
          },
        },
      };
    });
  },
  selectVehicle: (playerId, vehicleId) => {
    set(() => ({
      selectedVehicle: { playerId, vehicleId }, // Update the globally selected vehicle
    }));
  },
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
}));

export default usePlayerStore;


