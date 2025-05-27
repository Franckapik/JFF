/**
 * Slice pour les calculs et analyses des tuiles
 * Responsable de : calcul de distance, pathfinding, analyses spatiales
 */
import { findPath } from '../../../utils/utils';

const createTileCalculationSlice = (set, get) => ({

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
});

export default createTileCalculationSlice;
