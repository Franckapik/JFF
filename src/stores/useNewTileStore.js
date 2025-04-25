import { create } from 'zustand';
import { generateHexPositions } from '../utils/utils'; // Import the utility function

export const useTileStore = create((set, get) => ({
    tiles: {},
    selectedTile: null,
    setTiles: (tiles) => set({ tiles }),
    setSelectedTile: (tileCoord) => set({ selectedTile: tileCoord }),
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

    // New method to initialize tiles
    initializeTiles: (radius, spacing) => {
        const hexPositions = generateHexPositions(radius, spacing);
        const tiles = hexPositions.reduce((acc, tile) => ({ ...acc, [tile.coord]: tile }), {});
        set({ tiles });
    },
}));

