/**
 * Slice pour la gestion de l'exploration des tuiles
 * Responsable de : marquage des tuiles comme explorées, suivi du statut d'exploration
 */

const createTileExplorationSlice = (set, get) => ({

  /**
   * Marque une tuile comme explorée
   * @param {string} coord - Coordonnée de la tuile à marquer comme explorée
   */
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
});

export default createTileExplorationSlice;
