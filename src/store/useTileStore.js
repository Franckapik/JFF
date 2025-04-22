import { create } from "zustand"; // Use named import for create

export const useTileStore = create((set, get) => ({
  tiles: {}, // Centralized tile data
  selectedTile: null, // Currently selected tile
  randomVehicle: null, // Combined position and coord for the random vehicle
  targetVehicle: null, // Combined position and coord for the target vehicle
  randomVehicleTargetTile: null, // Tile coord of the random vehicle's target
  targetVehicleTargetTile: null, // Tile coord of the target vehicle's destination
  randomVehicleIsMoving: false, // Movement status for the random vehicle
  targetVehicleIsMoving: false, // Movement status for the target vehicle
  targetVehicleProgress: 0, // Progress of the target vehicle
  randomVehicleStartCoord: null, // Starting coord for the random vehicle
  targetVehicleStartCoord: null, // Starting coord for the target vehicle

  setTiles: (newTiles) => set({ tiles: newTiles }),
  setSelectedTile: (tile) => set({ selectedTile: tile }), // Setter for selectedTile
  setRandomVehicle: (vehicle) => set({ randomVehicle: vehicle }), // Setter for random vehicle
  setTargetVehicle: (vehicle) => set({ targetVehicle: vehicle }), // Setter for target vehicle
  setRandomVehicleTargetTile: (tileCoord) => set({ randomVehicleTargetTile: tileCoord }), // Setter for target tile
  setTargetVehicleTargetTile: (tileCoord) => set({ targetVehicleTargetTile: tileCoord }), // Setter for target tile
  setRandomVehicleIsMoving: (isMoving) => set({ randomVehicleIsMoving: isMoving }), // Setter for random vehicle movement
  setTargetVehicleIsMoving: (isMoving) => set({ targetVehicleIsMoving: isMoving }), // Setter for target vehicle movement
  setTargetVehicleProgress: (progress) => set({ targetVehicleProgress: progress }), // Setter for progress
  setRandomVehicleStartCoord: (coord) => set({ randomVehicleStartCoord: coord }), // Setter for random vehicle start coord
  setTargetVehicleStartCoord: (coord) => set({ targetVehicleStartCoord: coord }), // Setter for target vehicle start coord

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
