/**
 * Slice pour la gestion de base des tuiles
 * Responsable de : initialisation, état de base, hover, getters/setters basiques
 */
import { generateHexPositions } from '../../../utils/utils';

const createTileBaseSlice = (set, get) => ({
  // === ÉTAT INITIAL ===
  tiles: {},
  radius: 3, // Default radius
  spacing: 0.1, // Default spacing
  hoveredTile: null, // Track the currently hovered tile

  // === ACTIONS DE BASE ===
  
  /**
   * Met à jour la tuile actuellement survolée
   * @param {string} coord - Coordonnée de la tuile survolée
   */
  updateHoveredTile: (coord) => {
    set({ hoveredTile: coord });
  },

  /**
   * Définit toutes les tuiles
   * @param {Object} tiles - Objet contenant toutes les tuiles
   */
  setTiles: (tiles) => set({ tiles }),

  /**
   * Récupère une tuile par ses coordonnées
   * @param {string} coord - Coordonnée de la tuile
   * @returns {Object|undefined} - La tuile correspondante
   */
  getTile: (coord) => get().tiles[coord],

  /**
   * Récupère les tuiles voisines d'une tuile
   * @param {string} coord - Coordonnée de la tuile
   * @returns {Array} - Liste des tuiles voisines
   */
  getNeighbors: (coord) => {
    const tile = get().tiles[coord];
    return tile ? tile.neighbors.map((neighbor) => get().tiles[neighbor]) : [];
  },

  /**
   * Met à jour une tuile avec de nouvelles propriétés
   * @param {string} coord - Coordonnée de la tuile
   * @param {Object} updates - Propriétés à mettre à jour
   */
  updateTile: (coord, updates) => {
    set((state) => {
      const updatedTiles = { ...state.tiles };
      if (updatedTiles[coord]) {
        updatedTiles[coord] = { ...updatedTiles[coord], ...updates };
      }
      return { tiles: updatedTiles };
    });
  },

  /**
   * Efface toutes les tuiles
   */
  clearTiles: () => set({ tiles: {} }),

  /**
   * Initialise les tuiles en utilisant le rayon et l'espacement du store
   * @param {number} radius - Rayon de génération des tuiles (défaut: 3)
   * @param {number} spacing - Espacement entre les tuiles (défaut: 0.1)
   */
  initializeTiles: (radius = 3, spacing = 0.1) => {
    const hexPositions = generateHexPositions(radius, spacing);
    const tiles = hexPositions.reduce((acc, tile) => {
      // Ajouter originalResources comme copie des ressources initiales
      const tileWithOriginal = { 
        ...tile, 
        collected: false,
        // Initialiser resourcePercentage à 100% (toutes les ressources présentes)
        resourcePercentage: 100,
        // Stocker les ressources originales pour référence
        originalResources: tile.resources ? { ...tile.resources } : { food: 0, debris: 0, special: 0 }
      };
      return { ...acc, [tile.coord]: tileWithOriginal };
    }, {});
    
    set({ tiles });
  },
});

export default createTileBaseSlice;
