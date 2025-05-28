/**
 * =========================================================================
 * TILE CALCULATION SLICE
 * =========================================================================
 * 
 * Ce slice gère les calculs et analyses spatiales des tuiles dans le jeu :
 * - Calcul de distances entre tuiles (euclidienne et pathfinding)
 * - Algorithmes de recherche de chemin
 * - Analyses géométriques et spatiales
 * - Optimisations pour les calculs de proximité
 * 
 * Types de calculs disponibles :
 * - Distance euclidienne : distance en ligne droite entre deux points
 * - Distance pathfinding : nombre de tuiles dans le chemin le plus court
 * - Analyses de voisinage et de proximité
 * 
 * Dépendances :
 * - utils/utils : pour les algorithmes de pathfinding
 */

// =========================================================================
// IMPORTS
// =========================================================================
import { findPath } from '../../../utils/utils';

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileCalculationSlice = (set, get) => {
  return {

    // =====================================================================
    // ACTIONS PUBLIQUES - CALCULS DE DISTANCE
    // =====================================================================

    /**
     * Calcule la distance entre deux coordonnées sur la grille
     * 
     * Cette fonction offre deux modes de calcul :
     * 1. Pathfinding : utilise l'algorithme de recherche de chemin pour calculer
     *    la distance réelle en nombre de tuiles traversées
     * 2. Euclidienne : calcule la distance en ligne droite entre les deux points
     * 
     * Le mode pathfinding est plus précis pour la logique de jeu car il tient compte
     * des obstacles et de la topologie de la grille, tandis que le mode euclidien
     * est plus rapide pour les calculs de proximité approximatifs.
     * 
     * @param {string} coord1 - Première coordonnée au format "x,y"
     * @param {string} coord2 - Seconde coordonnée au format "x,y"
     * @param {boolean} formatted - Si true, retourne un nombre formaté avec 1 décimale, sinon retourne le nombre brut
     * @param {boolean} usePathfinding - Si true, calcule la distance en nombre de tuiles via pathfinding (chemin le plus court)
     * @returns {number|string} - Distance entre les deux coordonnées (nombre ou chaîne formatée)
     */
    calculateDistance: (coord1, coord2, formatted = true, usePathfinding = true) => {
      // Validation des paramètres d'entrée
      if (!coord1 || !coord2 || typeof coord1 !== 'string' || typeof coord2 !== 'string') {
        return formatted ? "N/A" : 0;
      }
      
      try {
        // Mode pathfinding : calcul de la distance réelle via algorithme de recherche
        if (usePathfinding) {
          const tiles = get().tiles;
          
          // Utilise la fonction findPath pour trouver le chemin le plus court
          const path = findPath(coord1, coord2, tiles);
          
          // La longueur du chemin - 1 donne le nombre de tuiles à traverser
          // Retourne 0 si les coordonnées sont identiques
          const distance = path.length > 0 ? path.length - 1 : 0;
          return formatted ? distance.toString() : distance;
        } 
        // Mode euclidien : calcul de la distance en ligne droite
        else {
          const [x1, y1] = coord1.split(',').map(Number);
          const [x2, y2] = coord2.split(',').map(Number);
          
          // Vérification de la validité des coordonnées numériques
          if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            return formatted ? "N/A" : 0;
          }
          
          // Calcul de la distance euclidienne classique
          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          return formatted ? distance.toFixed(1) : distance;
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
        return formatted ? "N/A" : 0;
      }
    },
  };
};

export default createTileCalculationSlice;
