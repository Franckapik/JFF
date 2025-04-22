import { create } from "zustand"; // Use named import for create

export const useTileStore = create((set, get) => ({
  tiles: {}, // Centralized tile data
  randomVehicle: null, // Combined position and coord for the random vehicle
  targetVehicle: null, // Combined position and coord for the target vehicle
  setTiles: (newTiles) => set({ tiles: newTiles }),
  setRandomVehicle: (vehicle) => set({ randomVehicle: vehicle }), // Setter for random vehicle
  setTargetVehicle: (vehicle) => set({ targetVehicle: vehicle }), // Setter for target vehicle
  getTile: (coord) => get().tiles[coord], // Return the tile directly
  getNeighbors: (coord) => {
    const tile = get().tiles[coord];
    return tile ? tile.neighbors.map((neighbor) => get().tiles[neighbor]) : [];
  },
  updateTileColor: (coord, color) => {
    set((state) => {
      const updatedTiles = { ...state.tiles };
      if (updatedTiles[coord]) {
        updatedTiles[coord] = { ...updatedTiles[coord], color };
      }
      return { tiles: updatedTiles };
    });
  },
}));
