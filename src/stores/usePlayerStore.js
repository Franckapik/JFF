import { create } from 'zustand';
import { calculatePathData } from '../utils/utils'; // Import utility functions

const usePlayerStore = create((set, get) => ({
  players: {
    player1: {
      id: 'player1',
      vehicles: {
        ship: {
          id: 'ship', // Add an ID for the ship
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
  },
  initializePlayer: (tiles) => {
    // Find a random starting tile of type "depart"
    const startingTile = Object.values(tiles).find((tile) => tile.type === "depart");
    if (!startingTile) {
      throw new Error("No starting tile of type 'depart' found.");
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
              position: startingTile.position,
              coord: startingTile.coord,
              startCoord: startingTile.coord,
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
    set((state) => ({
      players: {
        ...state.players,
        player1: {
          ...state.players.player1,
          vehicles: {
            ...state.players.player1.vehicles,
            ship: {
              ...state.players.player1.vehicles.ship,
              ...updates, // Apply updates to the ship
            },
          },
        },
      },
    }));
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


