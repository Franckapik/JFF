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
  targetFuel: 100, // Initial fuel level for the target vehicle
  targetDamage: 0, // Initial damage level for the target vehicle
  targetVehicleResources: { food: 0, debris: 0, special: 0 }, // Initial resources for the target vehicle
  playerResources: { food: 0, debris: 0, special: 0 }, // Initial resources for the player

  setTiles: (newTiles) => set({ tiles: newTiles }),
  setSelectedTile: (tileCoord) => set({ selectedTile: tileCoord }), // Ensure selectedTile is a coordinate
  setRandomVehicle: (vehicle) => set({ randomVehicle: vehicle }), // Setter for random vehicle
  setTargetVehicle: (vehicle) => set({ targetVehicle: vehicle }), // Setter for target vehicle
  setRandomVehicleTargetTile: (tileCoord) => set({ randomVehicleTargetTile: tileCoord }), // Setter for target tile
  setTargetVehicleTargetTile: (tileCoord) => set({ targetVehicleTargetTile: tileCoord }), // Setter for target tile
  setRandomVehicleIsMoving: (isMoving) => set({ randomVehicleIsMoving: isMoving }), // Setter for random vehicle movement
  setTargetVehicleIsMoving: (isMoving) => set({ targetVehicleIsMoving: isMoving }), // Setter for target vehicle movement
  setTargetVehicleProgress: (progress) => set({ targetVehicleProgress: progress }), // Setter for progress
  setRandomVehicleStartCoord: (coord) => set({ randomVehicleStartCoord: coord }), // Setter for random vehicle start coord
  setTargetVehicleStartCoord: (coord) => set({ targetVehicleStartCoord: coord }), // Setter for target vehicle start coord
  setTargetFuel: (fuel) => set({ targetFuel: fuel }), // Setter for targetFuel
  setTargetDamage: (damage) => set({ targetDamage: damage }), // Setter for targetDamage
  setTargetVehicleResources: (resources) =>
    set((state) => ({
      targetVehicleResources: {
        food: state.targetVehicleResources.food + (resources.food || 0),
        debris: state.targetVehicleResources.debris + (resources.debris || 0),
        special: state.targetVehicleResources.special + (resources.special || 0),
      },
    })),
  setPlayerResources: (resources) =>
    set((state) => ({
      playerResources: {
        food: state.playerResources.food + (resources.food || 0),
        debris: state.playerResources.debris + (resources.debris || 0),
        special: state.playerResources.special + (resources.special || 0),
      },
    })),
  resetTargetVehicleResources: () =>
    set(() => ({
      targetVehicleResources: { food: 0, debris: 0, special: 0 },
    })),

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
  checkVehicleOverlap: () => {
    const { randomVehicle, targetVehicle, setTargetDamage, targetDamage } = get();
    if (randomVehicle?.coord && targetVehicle?.coord && randomVehicle.coord === targetVehicle.coord) {
      setTargetDamage(Math.min(targetDamage + 10, 100)); // Increase damage by 10%, max 100%
    }
  },
  markTileAsCollected: (coord) =>
    set((state) => {
      const updatedTiles = { ...state.tiles };
      if (updatedTiles[coord]) {
        updatedTiles[coord].collected = true; // Mark the tile as collected
      }
      return { tiles: updatedTiles };
    }),
}));
