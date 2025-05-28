/**
 * =========================================================================
 * TILE BASE SLICE
 * =========================================================================
 * 
 * Ce slice gère la logique de base des tuiles dans le jeu :
 * - Initialisation et génération des tuiles hexagonales
 * - Gestion de l'état de base (hover, sélection)
 * - Opérations CRUD de base sur les tuiles
 * - Configuration du rayon et de l'espacement
 * 
 * Dépendances :
 * - utils/utils : pour la génération des positions hexagonales
 * 
 * État géré :
 * - tiles : dictionnaire de toutes les tuiles du jeu
 * - radius : rayon de génération de la grille hexagonale
 * - spacing : espacement entre les tuiles
 * - hoveredTile : tuile actuellement survolée
 */

// =========================================================================
// IMPORTS
// =========================================================================
import { generateHexPositions } from '../../../utils/utils';

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileBaseSlice = (set, get) => {
  return {
    
    // =====================================================================
    // ÉTAT INITIAL
    // =====================================================================
    
    /**
     * Dictionnaire de toutes les tuiles du jeu indexées par coordonnées
     */
    tiles: {},
    
    /**
     * Rayon de génération de la grille hexagonale
     */
    radius: 3,
    
    /**
     * Espacement entre les tuiles hexagonales
     */
    spacing: 0.1,
    
    /**
     * Coordonnée de la tuile actuellement survolée
     */
    hoveredTile: null,

    // =====================================================================
    // ACTIONS PUBLIQUES - GESTION DE L'ÉTAT
    // =====================================================================
    
    /**
     * Met à jour la tuile actuellement survolée
     * Utilisé pour les interactions UI et les effets visuels
     * 
     * @param {string} coord - Coordonnée de la tuile survolée
     */
    updateHoveredTile: (coord) => {
      set({ hoveredTile: coord });
    },

    // =====================================================================
    // ACTIONS PUBLIQUES - OPÉRATIONS CRUD
    // =====================================================================

    /**
     * Définit toutes les tuiles du jeu
     * Remplace complètement l'état existant des tuiles
     * 
     * @param {Object} tiles - Objet contenant toutes les tuiles indexées par coordonnées
     */
    setTiles: (tiles) => set({ tiles }),

    /**
     * Récupère une tuile par ses coordonnées
     * 
     * @param {string} coord - Coordonnée de la tuile au format "x,y"
     * @returns {Object|undefined} - La tuile correspondante ou undefined si non trouvée
     */
    getTile: (coord) => get().tiles[coord],

    /**
     * Récupère les tuiles voisines d'une tuile donnée
     * Utilise la liste des voisins pré-calculée de la tuile
     * 
     * @param {string} coord - Coordonnée de la tuile centrale
     * @returns {Array} - Liste des tuiles voisines (objets complets)
     */
    getNeighbors: (coord) => {
      const tile = get().tiles[coord];
      return tile ? tile.neighbors.map((neighbor) => get().tiles[neighbor]) : [];
    },

    /**
     * Met à jour une tuile avec de nouvelles propriétés
     * Effectue une fusion des propriétés existantes avec les nouvelles
     * 
     * @param {string} coord - Coordonnée de la tuile à mettre à jour
     * @param {Object} updates - Propriétés à mettre à jour ou ajouter
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
     * Efface toutes les tuiles du jeu
     * Remet l'état des tuiles à un objet vide
     */
    clearTiles: () => set({ tiles: {} }),

    // =====================================================================
    // ACTIONS PUBLIQUES - INITIALISATION
    // =====================================================================

    /**
     * Initialise les tuiles en générant une grille hexagonale
     * 
     * Cette fonction :
     * 1. Génère les positions hexagonales selon le rayon et l'espacement
     * 2. Initialise chaque tuile avec ses propriétés de base
     * 3. Configure les ressources originales et les pourcentages
     * 4. Met à jour l'état global des tuiles
     * 
     * @param {number} radius - Rayon de génération des tuiles (défaut: 3)
     * @param {number} spacing - Espacement entre les tuiles (défaut: 0.1)
     */
    initializeTiles: (radius = 3, spacing = 0.1) => {
      const hexPositions = generateHexPositions(radius, spacing);
      const tiles = hexPositions.reduce((acc, tile) => {
        // Initialiser la tuile avec les propriétés de base
        const tileWithOriginal = { 
          ...tile, 
          collected: false,
          // Initialiser le pourcentage de ressources à 100% (toutes présentes)
          resourcePercentage: 100,
          // Stocker les ressources originales pour référence future
          originalResources: tile.resources ? { ...tile.resources } : { food: 0, debris: 0, special: 0 }
        };
        return { ...acc, [tile.coord]: tileWithOriginal };
      }, {});
      
      set({ tiles });
    },
  };
};

export default createTileBaseSlice;
