/**
 * =========================================================================
 * TILE MARK SLICE
 * =========================================================================
 * 
 * Ce slice gère le marquage et le suivi de l'état d'exploration des tuiles :
 * - Marquage des tuiles comme explorées
 * - Suivi du statut d'exploration pour la logique de jeu
 * - Gestion des états de visite et de découverte
 * - Support pour la logique d'exploration des bots et joueurs
 * 
 * États de marquage gérés :
 * - explored : indique si une tuile a été visitée/explorée
 * - Extensible pour d'autres types de marquage (visited, scanned, etc.)
 * 
 * Utilisé par :
 * - Logique d'exploration automatique des bots
 * - Système de brouillard de guerre
 * - Calculs de territoire et de contrôle
 */

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileMarkSlice = (set, get) => {
  return {

    // =====================================================================
    // ACTIONS PUBLIQUES - MARQUAGE D'EXPLORATION
    // =====================================================================

    /**
     * Marque une tuile comme explorée
     * 
     * Cette fonction :
     * 1. Vérifie que la tuile existe dans l'état global
     * 2. Met à jour la propriété 'explored' à true
     * 3. Préserve toutes les autres propriétés de la tuile
     * 
     * Utilisé principalement par :
     * - Les systèmes de mouvement des véhicules
     * - La logique d'exploration automatique des bots
     * - Les mécaniques de découverte de territoire
     * 
     * @param {string} coord - Coordonnée de la tuile à marquer comme explorée (format "x,y")
     */
    markTileAsExplored: (coord) => {
      const currentTile = get().tiles[coord];
      
      if (!currentTile) {
        console.warn('❌ [TileMarkSlice] Tile not found for coord:', coord);
        return;
      }
      
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
     * Marque une tuile comme ayant eu ses ressources collectées
     * 
     * Cette fonction :
     * 1. Vérifie que la tuile existe et n'est pas déjà collectée
     * 2. Marque la tuile comme collectée
     * 3. Met le pourcentage de ressources à 0%
     * 4. Vide toutes les ressources de la tuile
     * 
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
          resourcePercentage: 0, // Mettre à 0% car la tuile est complètement collectée
          resources: { food: 0, debris: 0, special: 0 }
        };
        return { tiles: updatedTiles };
      });
      
      return true;
    },

    /**
     * Marque une tuile comme prospectée avec détection des ressources
     * 
     * Cette fonction :
     * 1. Vérifie que la tuile existe dans l'état global
     * 2. Met à jour la propriété 'prospected' à true
     * 3. Stocke les ressources détectées lors de la prospection
     * 4. Met à jour le timestamp de la prospection
     * 
     * Utilisé principalement par :
     * - La phase de prospection détaillée des drones
     * - L'analyse des ressources avant collecte
     * - Le système d'intelligence artificielle d'exploration
     * 
     * @param {string} coord - Coordonnée de la tuile à marquer comme prospectée (format "x,y")
     * @param {object} resourcesFound - Ressources détectées lors de la prospection
     * @returns {boolean} - true si la tuile a été marquée, false en cas d'erreur
     */
    markTileAsProspected: (coord, resourcesFound = {}) => {
      const tile = get().tiles[coord];
      if (!tile) return false;
      
      set((state) => ({
        tiles: {
          ...state.tiles,
          [coord]: {
            ...state.tiles[coord],
            prospected: true,
            prospectionResults: resourcesFound,
            prospectionTimestamp: Date.now(),
          },
        },
      }));
      
      return true;
    },
  };
};

export default createTileMarkSlice;
