import { create } from "zustand"; // Use named import for create

export const useTileStore = create((set, get) => ({
  tiles: {}, // Centralized tile data
  selectedTile: null, // Currently selected tile
  setTiles: (newTiles) => set({ tiles: newTiles }),
  setSelectedTile: (tile) => set({ selectedTile: tile }), // Setter for selectedTile
  randomVehicle: null, // Combined position and coord for the random vehicle
  targetVehicle: null, // Combined position and coord for the target vehicle
  randomVehicleTargetTile: null, // Tile coord of the random vehicle's target
  targetVehicleTargetTile: null, // Tile coord of the target vehicle's destination
  setTiles: (newTiles) => set({ tiles: newTiles }),
  setRandomVehicle: (vehicle) => set({ randomVehicle: vehicle }), // Setter for random vehicle
  setTargetVehicle: (vehicle) => set({ targetVehicle: vehicle }), // Setter for target vehicle
  setRandomVehicleTargetTile: (tileCoord) => set({ randomVehicleTargetTile: tileCoord }), // Setter for target tile
  setTargetVehicleTargetTile: (tileCoord) => set({ targetVehicleTargetTile: tileCoord }), // Setter for target tile
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
