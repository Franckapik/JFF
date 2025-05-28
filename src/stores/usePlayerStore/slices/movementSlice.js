/**
 * ============================================================================
 * MOVEMENT SLICE - Gestion du système de mouvement
 * ============================================================================
 * 
 * Ce slice gère exclusivement le système de mouvement des véhicules :
 * - Initiation et suivi des mouvements
 * - Validation des déplacements
 * - Gestion des cibles et trajectoires
 * 
 * @author Votre nom
 * @version 1.0.0
 */

import fsmLogger from '../../../utils/fsmLogger';

// ============================================================================
// CREATION DU SLICE
// ============================================================================

const createMovementSlice = (set, get) => {
  return {
    
    // ========================================================================
    // SYSTEME DE MOUVEMENT ET NAVIGATION
    // ========================================================================

    /**
     * Initie le mouvement d'un véhicule vers une tuile cible
     * 
     * Configure le véhicule pour se diriger vers une position spécifique
     * sur la grille de jeu. Valide les données de la tuile cible avant
     * de lancer le mouvement pour éviter les erreurs de navigation.
     * 
     * @param {string} playerId - ID unique du joueur
     * @param {string} vehicleId - ID du véhicule à déplacer
     * @param {Object} targetTile - Tuile de destination
     */
    moveToTile: (playerId, vehicleId, targetTile) => {
      fsmLogger.mouvement(`[PlayerStore] Moving ${playerId}/${vehicleId} to tile:`, targetTile.coord, playerId);
      
      // Validation des données de la tuile cible
      if (!targetTile || !targetTile.position || !targetTile.coord) {
        fsmLogger.error("Invalid target tile data:", targetTile, playerId);
        return;
      }
      
      // Utiliser le slice vehicle pour la mise à jour
      const { updateVehicle } = get();
      updateVehicle(playerId, vehicleId, {
        targetTile: {
          position: targetTile.position,
          coord: targetTile.coord,
        },
        isMoving: true
      });
    },

    /**
     * Arrête le mouvement d'un véhicule
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     */
    stopMovement: (playerId, vehicleId) => {
      const { updateVehicle } = get();
      updateVehicle(playerId, vehicleId, {
        isMoving: false,
        targetTile: { position: null, coord: null }
      });
    },

    /**
     * Met à jour la progression d'un mouvement
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @param {number} progress - Progression (0-100)
     */
    updateMovementProgress: (playerId, vehicleId, progress) => {
      const { updateVehicle } = get();
      updateVehicle(playerId, vehicleId, { progress });
    },
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default createMovementSlice;
