import { create } from 'zustand';
import { generateHexPositions } from '../utils/utils'; // Import the utility function

export const useTileStore = create((set, get) => ({
    tiles: {},
    radius: 3, // Default radius
    spacing: 0.1, // Default spacing
    setTiles: (tiles) => set({ tiles }),
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

    /**
     * Marque une tuile comme ayant eu ses ressources collectées
     * @param {string} coord - Coordonnée de la tuile à marquer
     * @returns {boolean} - true si la tuile a été marquée, false si déjà collectée
     */
    markTileAsCollected: (coord) => {
        const tile = get().tiles[coord];
        if (!tile) return false;
        
        // Si la tuile est déjà collectée, ne rien faire
        if (tile.collected) return false;
        
        set((state) => {
            const updatedTiles = { ...state.tiles };
            updatedTiles[coord] = { 
                ...updatedTiles[coord], 
                collected: true 
            };
            return { tiles: updatedTiles };
        });
        
        return true;
    },
}));

