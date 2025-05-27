/**
 * Slice pour la gestion des ressources des tuiles
 * Responsable de : collecte de ressources, déduction, reset, marquage comme collecté
 */

const createTileResourceSlice = (set, get) => ({

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
        resourcePercentage: 0, // Mettre à 0% car la tuile est complètement collectée
        resources: { food: 0, debris: 0, special: 0 }
      };
      return { tiles: updatedTiles };
    });
    
    return true;
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
    
    // Ressources initiales (si originalResources n'existe pas, on utilise les ressources actuelles)
    const originalResources = tile.originalResources || { ...tile.resources };
    
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
    
    // Calculer le pourcentage de ressources restantes (moyenne pondérée)
    const totalOriginal = originalResources.food + originalResources.debris + originalResources.special;
    const totalRemaining = remainingResources.food + remainingResources.debris + remainingResources.special;
    
    // Calculer le pourcentage, avec protection contre la division par zéro
    const percentageRemaining = totalOriginal > 0 
      ? Math.round((totalRemaining / totalOriginal) * 100) 
      : 0;
    
    set((state) => {
      const updatedTiles = { ...state.tiles };
      updatedTiles[coord] = {
        ...updatedTiles[coord],
        resources: remainingResources,
        originalResources: originalResources,  // Stocker les ressources originales pour référence
        collected: isEmpty, // Marquer comme complètement collectée seulement si vide
        resourcePercentage: percentageRemaining // Pourcentage de ressources restantes (0-100)
      };
      return { tiles: updatedTiles };
    });
    
    return true;
  },

  /**
   * Remet à zéro les ressources d'une tuile
   * @param {string} coord - Coordonnée de la tuile
   * @returns {boolean} - true si la réinitialisation a été effectuée, false sinon
   */
  resetTileResources: (coord) => {
    const tile = get().tiles[coord];
    if (!tile) return false;

    set((state) => {
      const updatedTiles = { ...state.tiles };
      updatedTiles[coord] = {
        ...updatedTiles[coord],
        resources: { food: 0, debris: 0, special: 0 },
        collected: true,
        resourcePercentage: 0
      };
      return { tiles: updatedTiles };
    });

    return true;
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
});

export default createTileResourceSlice;
