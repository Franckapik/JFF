/**
 * =========================================================================
 * TILE RESOURCE SLICE
 * =========================================================================
 * 
 * Ce slice gère la logique des ressources des tuiles dans le jeu :
 * - Collecte et déduction des ressources
 * - Marquage des tuiles comme collectées
 * - Calcul des pourcentages de ressources restantes
 * - Analyse des ressources à proximité d'une position
 * - Reset et réinitialisation des ressources
 * - Utilitaires pour déterminer l'état de collecte des tuiles
 * 
 * Types de ressources gérées :
 * - food : nourriture pour les équipages
 * - debris : matériaux de construction et réparation
 * - special : ressources rares et précieuses
 * 
 * État géré :
 * - resourcePercentage : pourcentage de ressources restantes (0-100%)
 * - originalResources : copie des ressources initiales pour référence
 * 
 * Source de vérité unique : resourcePercentage (0-100%)
 * - 0% = tuile complètement collectée (plus de ressources)
 * - 1-99% = tuile partiellement collectée (ressources restantes)
 * - 100% = tuile non collectée (ressources intactes)
 * - undefined/null = tuile non explorée ou sans ressources
 */

import fsmLogger from '../../../logger/fsmLogger.js';

// =========================================================================
// UTILITAIRES DE COLLECTE DES TUILES
// =========================================================================

/**
 * Détermine si une tuile est complètement collectée
 * Une tuile est considérée comme complètement collectée si son pourcentage de ressources est exactement 0%
 * 
 * @param {Object} tile - Objet tuile
 * @param {number} tile.resourcePercentage - Pourcentage de ressources restantes (0-100)
 * @returns {boolean} - true si la tuile est complètement collectée
 */
export const isTileCompletelyCollected = (tile) => {
  if (!tile || tile.resourcePercentage === undefined || tile.resourcePercentage === null) {
    return false;
  }
  return tile.resourcePercentage === 0;
};

/**
 * Détermine si une tuile est partiellement collectée
 * Une tuile est considérée comme partiellement collectée si son pourcentage est entre 1% et 99%
 * 
 * @param {Object} tile - Objet tuile
 * @param {number} tile.resourcePercentage - Pourcentage de ressources restantes (0-100)
 * @returns {boolean} - true si la tuile est partiellement collectée
 */
export const isTilePartiallyCollected = (tile) => {
  if (!tile || tile.resourcePercentage === undefined || tile.resourcePercentage === null) {
    return false;
  }
  return tile.resourcePercentage > 0 && tile.resourcePercentage < 100;
};

/**
 * Détermine si une tuile a été collectée (complètement ou partiellement)
 * Une tuile est considérée comme ayant été collectée si son pourcentage est inférieur à 100%
 * 
 * @param {Object} tile - Objet tuile
 * @param {number} tile.resourcePercentage - Pourcentage de ressources restantes (0-100)
 * @returns {boolean} - true si la tuile a été collectée (même partiellement)
 */
export const isTileCollected = (tile) => {
  if (!tile || tile.resourcePercentage === undefined || tile.resourcePercentage === null) {
    return false;
  }
  return tile.resourcePercentage < 100;
};

/**
 * Détermine si une tuile est disponible pour la collecte
 * Une tuile est disponible si elle est explorée, a des ressources, et n'est pas complètement collectée
 * 
 * @param {Object} tile - Objet tuile
 * @param {boolean} tile.explored - Si la tuile a été explorée
 * @param {boolean} tile.hasResources - Si la tuile contient des ressources
 * @param {number} tile.resourcePercentage - Pourcentage de ressources restantes (0-100)
 * @returns {boolean} - true si la tuile est disponible pour la collecte
 */
export const isTileAvailableForCollection = (tile) => {
  if (!tile || !tile.explored || !tile.hasResources) {
    return false;
  }
  // Une tuile est disponible si elle n'est pas complètement collectée
  return !isTileCompletelyCollected(tile);
};

/**
 * Retourne un label descriptif de l'état de collecte d'une tuile
 * 
 * @param {Object} tile - Objet tuile
 * @returns {string} - Label décrivant l'état de la tuile
 */
export const getTileCollectionStateLabel = (tile) => {
  if (!tile) return "Inconnue";
  if (!tile.explored) return "Non explorée";
  if (!tile.hasResources) return "Sans ressources";
  
  if (isTileCompletelyCollected(tile)) return "Collectée";
  if (isTilePartiallyCollected(tile)) return "Partiellement collectée";
  return "Disponible";
};

/**
 * Filtre les tuiles disponibles pour la collecte
 * 
 * @param {Array} tiles - Array de tuiles
 * @returns {Array} - Array des tuiles disponibles pour la collecte
 */
export const filterAvailableTiles = (tiles) => {
  return tiles.filter(isTileAvailableForCollection);
};

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileResourceSlice = (set, get) => {
  return {

    // =====================================================================
    // ACTIONS PUBLIQUES - MARQUAGE ET COLLECTE
    // =====================================================================



    // =====================================================================
    // ACTIONS PUBLIQUES - GESTION DES RESSOURCES
    // =====================================================================

    /**
     * Déduit les ressources d'une tuile en fonction des ressources collectées
     * 
     * Cette fonction :
     * 1. Calcule les ressources restantes après collecte
     * 2. Met à jour le pourcentage de ressources restantes
     * 3. Marque la tuile comme collectée si toutes les ressources sont épuisées
     * 4. Préserve les ressources originales pour référence
     * 
     * @param {string} coord - Coordonnée de la tuile
     * @param {Object} collectedResources - Ressources collectées de la tuile
     * @param {number} collectedResources.food - Quantité de nourriture collectée
     * @param {number} collectedResources.debris - Quantité de débris collectés
     * @param {number} collectedResources.special - Quantité de ressources spéciales collectées
     * @returns {boolean} - true si la déduction a été effectuée, false sinon
     */
    deductTileResources: (coord, collectedResources) => {
      const tile = get().tiles[coord];
      
      // 🔍 DEBUG: Log de la fonction deductTileResources
      fsmLogger.resources(`🔍 DEBUG: deductTileResources called`, {
        coord,
        collectedResources,
        tileExists: !!tile,
        tileHasResources: !!tile?.resources,
        currentResources: tile?.resources
      });
      
      if (!tile || !tile.resources) {
        fsmLogger.resources(`🔍 DEBUG: deductTileResources failed - no tile or resources`, {
          coord,
          tileExists: !!tile,
          hasResources: !!tile?.resources
        });
        return false;
      }
      
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
      
      // 🔍 DEBUG: Log du calcul du pourcentage
      fsmLogger.resources(`🔍 DEBUG: Resource percentage calculated`, {
        coord,
        originalResources,
        remainingResources,
        totalOriginal,
        totalRemaining,
        percentageRemaining,
        isEmpty
      });
      
      set((state) => {
        const updatedTiles = { ...state.tiles };
        updatedTiles[coord] = {
          ...updatedTiles[coord],
          resources: remainingResources,
          originalResources: originalResources,  // Stocker les ressources originales pour référence
          resourcePercentage: percentageRemaining // Pourcentage de ressources restantes (0-100)
        };
        return { tiles: updatedTiles };
      });
      
      // 🔍 DEBUG: Log de la mise à jour réussie
      fsmLogger.resources(`🔍 DEBUG: TileStore updated successfully`, {
        coord,
        newPercentage: percentageRemaining,
        isCompletelyCollected: isEmpty,
        finalResources: remainingResources
      });
      
      return true;
    },

    /**
     * Remet à zéro les ressources d'une tuile
     * 
     * Cette fonction :
     * 1. Vide complètement toutes les ressources de la tuile
     * 2. Marque la tuile comme collectée
     * 3. Met le pourcentage de ressources à 0%
     * 
     * @param {string} coord - Coordonnée de la tuile à réinitialiser
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
          resourcePercentage: 0
        };
        return { tiles: updatedTiles };
      });

      return true;
    },

    // =====================================================================
    // ACTIONS PUBLIQUES - ANALYSE ET RECHERCHE
    // =====================================================================

    /**
     * Analyse les ressources à proximité d'une position ou d'un véhicule
     * 
     * Cette fonction :
     * 1. Accepte soit des coordonnées soit un objet véhicule avec propriété coord
     * 2. Parcourt les tuiles dans un rayon donné autour de la position
     * 3. Filtre les tuiles contenant des ressources non collectées
     * 4. Calcule la distance euclidienne pour chaque tuile trouvée
     * 5. Retourne les résultats triés par proximité
     * 
     * @param {string|Object} source - Coordonnée (format "x,y") ou objet avec propriété coord
     * @param {number} radius - Rayon de recherche autour de la position (défaut: 3)
     * @returns {Array} - Liste des ressources trouvées avec métadonnées, triées par distance
     */
    analyzeResourcesNearPosition: (source, radius = 3) => {
      // Conversion flexible de la source en coordonnées
      let coord;
      if (typeof source === 'string') {
        coord = source;
      } else if (source && source.coord) {
        coord = source.coord;
      } else {
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
          if (tile && !isTileCompletelyCollected(tile) && tile.resources && 
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
  };
};

export default createTileResourceSlice;
