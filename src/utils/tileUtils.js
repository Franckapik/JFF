/**
 * =========================================================================
 * TILE UTILITIES
 * =========================================================================
 * 
 * Utilitaires pour la gestion des tuiles et de leur état.
 * Ces fonctions centralisent la logique de détermination de l'état des tuiles
 * basée uniquement sur le pourcentage de ressources restantes.
 * 
 * Source de vérité unique : resourcePercentage (0-100%)
 * - 0% = tuile complètement collectée (plus de ressources)
 * - 1-99% = tuile partiellement collectée (ressources restantes)
 * - 100% = tuile non collectée (ressources intactes)
 * - undefined/null = tuile non explorée ou sans ressources
 */

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
