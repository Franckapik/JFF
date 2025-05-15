import { create } from 'zustand';
import { generateHexPositions, findPath } from '../utils/utils'; // Import des fonctions utiles

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

    /**
     * Récupère les tuiles 'walkable' dans un rayon donné autour d'une position
     * @param {string|Object} source - Coordonnée (format "x,y") ou objet avec propriété coord
     * @param {number} exploringRadius - Rayon de recherche autour de la position (défaut: 3)
     * @param {boolean} onlyUnexplored - Si true, retourne uniquement les tuiles non explorées
     * @param {boolean} excludeDanger - Si true, exclut les tuiles de type 'danger'
     * @returns {Array} - Liste des tuiles walkable trouvées, triées par distance
     */
    getWalkableTilesInRadius: (source, exploringRadius = 3, onlyUnexplored = false, excludeDanger = true) => {
        // Convertir la source en coordonnées (accepte soit des coordonnées, soit un véhicule)
        let coord;
        if (typeof source === 'string') {
            coord = source;
        } else if (source && source.coord) {
            coord = source.coord;
        } else {
            console.warn("Source invalide pour getWalkableTilesInRadius");
            return [];
        }
        
        if (!coord) return [];
        
        const tiles = get().tiles;
        const walkableTiles = [];
        const calculateDistanceFn = get().calculateDistance;
        
        // Parcours de toutes les tuiles pour chercher celles dans le rayon
        Object.entries(tiles).forEach(([tileCoord, tile]) => {
            // Utiliser calculateDistance pour obtenir la distance en nombre de tuiles
            const distance = calculateDistanceFn(coord, tileCoord, false, true);
            
            // Vérifier si la tuile est dans le rayon d'exploration
            if (distance <= exploringRadius) {
                // Vérifier les autres conditions (walkable, non danger, non explorée)
                if (tile && 
                    tile.walkable !== false && 
                    (!excludeDanger || tile.type !== 'danger') &&
                    (!onlyUnexplored || !tile.explored)) {
                    
                    walkableTiles.push({
                        coord: tileCoord,
                        position: tile.position,
                        tile: tile,
                        distance: distance
                    });
                }
            }
        });
        
        // Retourne les tuiles walkable triées par proximité
        return walkableTiles.sort((a, b) => a.distance - b.distance);
    },

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
                collected: true,
                partiallyCollected: false, // Quand la tuile est complètement collectée, elle n'est plus partiellement collectée
                resources: { food: 0, debris: 0, special: 0 }
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
                collected: isEmpty, // Marquer comme complètement collectée seulement si vide
                partiallyCollected: !isEmpty && (collectedResources.food > 0 || collectedResources.debris > 0 || collectedResources.special > 0) // Partiellement collectée si des ressources ont été prises mais qu'il en reste
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
                collected: true,
                partiallyCollected: false
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

    /**
     * Calcule la distance entre deux coordonnées sur la grille
     * @param {string} coord1 - Première coordonnée au format "x,y"
     * @param {string} coord2 - Seconde coordonnée au format "x,y"
     * @param {boolean} formatted - Si true, retourne un nombre formaté avec 1 décimale, sinon retourne le nombre brut
     * @param {boolean} usePathfinding - Si true, calcule la distance en nombre de tuiles via pathfinding (chemin le plus court)
     * @returns {number|string} - Distance entre les deux coordonnées (nombre ou chaîne formatée)
     */
    calculateDistance: (coord1, coord2, formatted = true, usePathfinding = true) => {
        // Vérifier si les coordonnées sont valides
        if (!coord1 || !coord2 || typeof coord1 !== 'string' || typeof coord2 !== 'string') {
            return formatted ? "N/A" : 0;
        }
        
        try {
            // Si on veut calculer la distance en nombre de tuiles via pathfinding
            if (usePathfinding) {
                const tiles = get().tiles;
                
                // Utilise la fonction findPath pour trouver le chemin le plus court
                const path = findPath(coord1, coord2, tiles);
                
                // La longueur du chemin - 1 donne le nombre de tuiles à traverser
                // Retourne 0 si les coordonnées sont les mêmes
                const distance = path.length > 0 ? path.length - 1 : 0;
                return formatted ? distance.toString() : distance;
            } 
            // Sinon, calcule la distance euclidienne (en ligne droite)
            else {
                const [x1, y1] = coord1.split(',').map(Number);
                const [x2, y2] = coord2.split(',').map(Number);
                
                // Vérifier si les coordonnées sont des nombres valides
                if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
                    return formatted ? "N/A" : 0;
                }
                
                const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                return formatted ? distance.toFixed(1) : distance;
            }
        } catch (error) {
            console.error("Error calculating distance:", error);
            return formatted ? "N/A" : 0;
        }
    },
}));

