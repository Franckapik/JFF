import { create } from 'zustand';
import { generateHexPositions } from '../utils/utils'; // Import the utility function

export const useTileStore = create((set, get) => ({
    tiles: {},
    radius: 3, // Default radius
    spacing: 0.1, // Default spacing
    hoveredTile: null, // Track the currently hovered tile
    
    // Update the currently hovered tile
    updateHoveredTile: (coord) => {
        set({ hoveredTile: coord });
    },
    
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

    /**
     * Sélectionne une tuile walkable au hasard parmi toutes les tuiles
     * Utilisé principalement pour les actions automatisées des bots
     * @returns {Object|null} - La tuile walkable sélectionnée ou null si aucune tuile disponible
     */
    selectRandomWalkableTile: () => {
        const tiles = get().tiles;
        
        // Filtrer uniquement les tuiles walkable
        const walkableTiles = Object.values(tiles).filter(tile => 
            tile && tile.walkable !== false && tile.type !== 'danger'
        );
        
        if (walkableTiles.length === 0) {
            console.warn("Aucune tuile walkable disponible pour la sélection aléatoire");
            return null;
        }
        
        // Sélection d'une tuile au hasard dans le tableau
        const randomIndex = Math.floor(Math.random() * walkableTiles.length);
        return walkableTiles[randomIndex];
    },

    /**
     * Déduit les ressources d'une tuile en fonction des ressources collectées
     * Marque la tuile comme collectée uniquement si toutes les ressources sont épuisées
     * @param {string} coord - Coordonnée de la tuile
     * @param {Object} collectedResources - Ressources collectées de la tuile
     * @returns {boolean} - true si la déduction a été effectuée, false sinon
     */
    deductTileResources: (coord, collectedResources) => {
        const tile = get().tiles[coord];
        if (!tile || !tile.resources) return false;
        
        // Calcul des ressources restantes sur la tuile
        const remainingResources = {
            food: Math.max(0, (tile.resources.food || 0) - (collectedResources.food || 0)),
            debris: Math.max(0, (tile.resources.debris || 0) - (collectedResources.debris || 0)),
            special: Math.max(0, (tile.resources.special || 0) - (collectedResources.special || 0))
        };
        
        // Vérifier si toutes les ressources ont été collectées
        const isEmpty = remainingResources.food === 0 && 
                       remainingResources.debris === 0 && 
                       remainingResources.special === 0;
        
        set((state) => {
            const updatedTiles = { ...state.tiles };
            updatedTiles[coord] = {
                ...updatedTiles[coord],
                resources: remainingResources,
                collected: isEmpty // Marquer comme collectée uniquement si vide
            };
            return { tiles: updatedTiles };
        });
        
        return true;
    },
    
    resetTileResources: (coord) => {
        const tile = get().tiles[coord];
        if (!tile) return false;

        set((state) => {
            const updatedTiles = { ...state.tiles };
            updatedTiles[coord] = {
                ...updatedTiles[coord],
                resources: { food: 0, debris: 0, special: 0 },
            };
            return { tiles: updatedTiles };
        });

        return true;
    },
    markTileAsExplored: (coord) => {
        set((state) => ({
          tiles: {
            ...state.tiles,
            [coord]: {
              ...state.tiles[coord],
              explored: true,
            },
          },
        }));
      },

    /**
     * Analyse les ressources à proximité d'une position ou d'un véhicule
     * @param {string|Object} source - Coordonnée (format "x,y") ou objet avec propriété coord
     * @param {number} radius - Rayon de recherche autour de la position
     * @returns {Array} - Liste des ressources trouvées, triées par distance
     */
    analyzeResourcesNearPosition: (source, radius = 3) => {
        // On peut maintenant passer soit des coordonnées soit un véhicule
        let coord;
        if (typeof source === 'string') {
            coord = source;
        } else if (source && source.coord) {
            coord = source.coord;
        } else {
            console.warn("Source invalide pour analyzeResourcesNearPosition");
            return [];
        }
        
        if (!coord) return [];
        
        const tiles = get().tiles;
        const [vX, vY] = coord.split(',').map(Number); // Convertit les coordonnées en nombres
        const resources = [];
        
        // Parcourt les tuiles dans un rayon donné
        for (let x = vX - radius; x <= vX + radius; x++) {
            for (let y = vY - radius; y <= vY + radius; y++) {
                const tileCoord = `${x},${y}`;
                const tile = tiles[tileCoord];
                
                // Vérifie si la tuile contient des ressources non collectées
                if (tile && !tile.collected && tile.resources && 
                    (tile.resources.food > 0 || tile.resources.debris > 0 || tile.resources.special > 0)) {
                    resources.push({
                        coord: tileCoord,
                        position: tile.position,
                        resources: tile.resources,
                        // Calcule la distance euclidienne pour le tri
                        distance: Math.sqrt(Math.pow(x - vX, 2) + Math.pow(y - vY, 2)),
                    });
                }
            }
        }
        
        // Retourne les ressources triées par proximité
        return resources.sort((a, b) => a.distance - b.distance);
    },
}));

