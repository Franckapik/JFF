import { create } from "zustand"; // Use named import for create

export const useTileStore = create((set, get) => ({
  tiles: {}, // Centralized tile data
  setTiles: (newTiles) => set({ tiles: newTiles }),
  getTile: (coord) => get().tiles[coord], // Return the tile directly
  getNeighbors: (coord) => {
    const tile = get().tiles[coord];
    return tile ? tile.neighbors.map((neighbor) => get().tiles[neighbor]) : [];
  },
}));
