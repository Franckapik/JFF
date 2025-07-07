/**
 * =========================================================================
 * TILE BASE SLICE (TypeScript)
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

import type {
  GridCoordinate,
  Tile,
  TileMap
} from '../../../types/index.js';

// =========================================================================
// TYPES LOCAUX
// =========================================================================

/** Actions du slice de base */
interface TileBaseSliceState {
  tiles: TileMap;
  radius: number;
  spacing: number;
  hoveredTile: GridCoordinate | null;
}

interface TileBaseSliceActions {
  updateHoveredTile: (coord: GridCoordinate | null) => void;
  setTiles: (tiles: TileMap) => void;
  getTile: (coord: GridCoordinate) => Tile | undefined;
  getNeighbors: (coord: GridCoordinate) => Tile[];
  updateTile: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  updateTileState: (coord: GridCoordinate, updates: Partial<Tile>) => void;
  clearTiles: () => void;
}

type TileBaseSlice = TileBaseSliceState & TileBaseSliceActions;

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileBaseSlice = (set: any, get: any): TileBaseSlice => {
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
     * @param coord - Coordonnée de la tuile survolée
     */
    updateHoveredTile: (coord: GridCoordinate | null): void => {
      set({ hoveredTile: coord });
    },

    // =====================================================================
    // ACTIONS PUBLIQUES - OPÉRATIONS CRUD
    // =====================================================================

    /**
     * Définit toutes les tuiles du jeu
     * Remplace complètement l'état existant des tuiles
     * 
     * @param tiles - Objet contenant toutes les tuiles indexées par coordonnées
     */
    setTiles: (tiles: TileMap): void => set({ tiles }),

    /**
     * Récupère une tuile par ses coordonnées
     * 
     * @param coord - Coordonnée de la tuile au format "x,y"
     * @returns La tuile correspondante ou undefined si non trouvée
     */
    getTile: (coord: GridCoordinate): Tile | undefined => get().tiles[coord],

    /**
     * Récupère les tuiles voisines d'une tuile donnée
     * Utilise la liste des voisins pré-calculée de la tuile
     * 
     * @param coord - Coordonnée de la tuile centrale
     * @returns Liste des tuiles voisines (objets complets)
     */
    getNeighbors: (coord: GridCoordinate): Tile[] => {
      const tile = get().tiles[coord];
      return tile && (tile as any).neighbors 
        ? (tile as any).neighbors.map((neighbor: GridCoordinate) => get().tiles[neighbor]).filter(Boolean)
        : [];
    },

    /**
     * Met à jour une tuile avec de nouvelles propriétés
     * Effectue une fusion des propriétés existantes avec les nouvelles
     * 
     * @param coord - Coordonnée de la tuile à mettre à jour
     * @param updates - Propriétés à mettre à jour ou ajouter
     */
    updateTile: (coord: GridCoordinate, updates: Partial<Tile>): void => {
      set((state: any) => {
        const updatedTiles = { ...state.tiles };
        if (updatedTiles[coord]) {
          updatedTiles[coord] = { ...updatedTiles[coord], ...updates };
        }
        return { tiles: updatedTiles };
      });
    },

    /**
     * Met à jour l'état d'une tuile pour les collectes
     * Méthode spécialisée pour gérer les timestamps et statistiques de collecte
     * 
     * @param coord - Coordonnée de la tuile
     * @param updates - Mises à jour spécifiques aux collectes
     */
    updateTileState: (coord: GridCoordinate, updates: Partial<Tile>): void => {
      set((state: any) => {
        const updatedTiles = { ...state.tiles };
        if (updatedTiles[coord]) {
          const currentTile = updatedTiles[coord];
          updatedTiles[coord] = { 
            ...currentTile, 
            ...updates,
            // Assurer que les timestamps sont correctement gérés
            lastUpdate: updates.lastUpdate || Date.now()
          };
        }
        return { tiles: updatedTiles };
      });
    },

    /**
     * Efface toutes les tuiles du jeu
     * Remet l'état des tuiles à un objet vide
     */
    clearTiles: (): void => set({ tiles: {} }),

  } as TileBaseSlice;
};

export default createTileBaseSlice;
