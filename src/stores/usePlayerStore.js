import { create } from 'zustand';
import { calculatePathData } from '../utils/utils'; // Import utility functions

const usePlayerStore = create((set, get) => ({
  players: {
    player1: {
      id: 'player1',
      vehicles: {
        ship: {
          id: 'ship1', // Unique ID for player 1's ship
          fuel: 100,
          damage: 0,
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
          },
          {
            id: 'drone2', // Add another drone with an ID
            position: null,
            coord: null,
            isMoving: false,
            progress: 0,
          },
        ],
        selectedVehicle: 'ship', // Default selected vehicle is the ship
      },
      score: {
        resources: { food: 0, debris: 0, special: 0 },
      },
      memory: {
        knownResources: [],
        knownDangers: [],
      },
      messages: [],
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
      },
      score: {
        resources: { food: 0, debris: 0, special: 0 },
      },
      memory: {
        knownResources: [],
        knownDangers: [],
      },
      messages: [],
    },
  },
  initializePlayer: (tiles) => {
    // Find starting tiles for both players
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
  calculatePath: (tiles, selectedTile) => {
    const playerVehicle = get().players.player1.vehicles.ship; // Access player vehicle

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
          player1: {
            ...state.players.player1,
            vehicles: {
              ...state.players.player1.vehicles,
              ship: {
                ...state.players.player1.vehicles.ship,
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
  updateShip: (updates) => {
    set((state) => {
      const updatedShip = {
        ...state.players.player1.vehicles.ship,
        ...updates,
      };

      // Check if the ship is on the starting tile
      if (
        updatedShip.coord &&
        updatedShip.coord === state.players.player1.vehicles.ship.startCoord &&
        !updatedShip.isMoving
      ) {
        const updatedScore = { ...state.players.player1.score.resources };
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
            player1: {
              ...state.players.player1,
              vehicles: {
                ...state.players.player1.vehicles,
                ship: updatedShip,
              },
              score: {
                ...state.players.player1.score,
                resources: updatedScore,
              },
            },
          },
        };
      }

      return {
        players: {
          ...state.players,
          player1: {
            ...state.players.player1,
            vehicles: {
              ...state.players.player1.vehicles,
              ship: updatedShip,
            },
          },
        },
      };
    });
  },
  selectVehicle: (vehicleId) => {
    set((state) => ({
      players: {
        ...state.players,
        player1: {
          ...state.players.player1,
          vehicles: {
            ...state.players.player1.vehicles,
            selectedVehicle: vehicleId, // Update the selected vehicle
          },
        },
      },
    }));
  },
}));

export default usePlayerStore;


