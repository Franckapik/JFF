import { create } from "zustand"; // Use named import for create

export const useTileStore = create((set) => ({
  tiles: {}, // Centralized tile data
  setTiles: (newTiles) => set({ tiles: newTiles }),
  getTile: (coord) => (state) => state.tiles[coord], // Get a tile by its coordinate
  getNeighbors: (coord) => (state) => {
    const tile = state.tiles[coord];
    return tile ? tile.neighbors.map((neighbor) => state.tiles[neighbor]) : [];
  },
}));
