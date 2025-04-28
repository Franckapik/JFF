import { create } from 'zustand';
import { generateHexPositions } from '../utils/utils'; // Import the utility function

export const useTileStore = create((set, get) => ({
    tiles: {},
    radius: 3, // Default radius
    spacing: 0.1, // Default spacing
    setTiles: (tiles) => set({ tiles }),
    clearTiles: () => set({ tiles: {} }),

    // Initialize tiles using radius and spacing from the store
    initializeTiles: (radius = 3, spacing = 0.1) => {
        const hexPositions = generateHexPositions(radius, spacing);
        const tiles = hexPositions.reduce((acc, tile) => ({ ...acc, [tile.coord]: { ...tile, collected: false } }), {});
        set({ tiles });
    },
}));

