import { create } from 'zustand';
import { generateHexPositions } from '../utils/utils'; // Import the utility function

export const useTileStore = create((set, get) => ({
    tiles: {},
    selectedTile: null,
    radius: 3, // Default radius
    spacing: 0.1, // Default spacing
    setTiles: (tiles) => set({ tiles }),
    setSelectedTile: (tileCoord) => {
        console.log("Setting selected tile:", tileCoord); // Log the selected tile coordinate
        set({ selectedTile: tileCoord });
    },
    clearSelectedTile: () => {
        console.log("Clearing selected tile"); // Log the action
        set({ selectedTile: null });
    },
    getTile: (coord) => get().tiles[coord],
    getNeighbors: (coord) => {
        const tile = get().tiles[coord];
        return tile ? tile.neighbors.map((neighbor) => get().tiles[neighbor]) : [];
    },
    updateTile: (coord, updates) => {
        set((state) => {
            const updatedTiles = { ...state.tiles };
            if (updatedTiles[coord]) {
                updatedTiles[coord] = { ...updatedTiles[coord], ...updates };
            }
            return { tiles: updatedTiles };
        });
    },
    clearTiles: () => set({ tiles: {} }),

    // Initialize tiles using radius and spacing from the store
    initializeTiles: (radius = 3, spacing = 0.1) => {
        const hexPositions = generateHexPositions(radius, spacing);
        const tiles = hexPositions.reduce((acc, tile) => ({ ...acc, [tile.coord]: { ...tile, collected: false } }), {});
        set({ tiles });
    },
}));

