/**
 * ============================================================================
 * FUEL SLICE - Gestion du système de carburant
 * ============================================================================
 * 
 * Ce slice gère exclusivement le système de carburant des véhicules :
 * - Consommation de carburant
 * - Ravitaillement
 * - Vérifications de niveau
 * 
 * @author Votre nom
 * @version 1.0.0
 */

import fsmLogger from '../../../utils/fsmLogger';

// ============================================================================
// CREATION DU SLICE
// ============================================================================

const createFuelSlice = (set, get) => {
  return {
    
    // ========================================================================
    // GESTION DU CARBURANT ET ENERGIE
    // ========================================================================
    
    /**
     * Consomme du carburant lors des déplacements
     * 
     * @param {string} playerId - ID unique du joueur
     * @param {string} vehicleId - ID du véhicule consommateur
     * @param {number} amount - Quantité de carburant à consommer (défaut: 5)
     * @returns {boolean} true si le véhicule peut continuer, false sinon
     */
    consumeFuel: (playerId, vehicleId, amount = 5) => {
      const { players, updateVehicle } = get();
      const vehicle = players[playerId]?.vehicles?.[vehicleId];
      
      if (!vehicle) return false;
      
      // Vérification du niveau de carburant disponible
      if (vehicle.fuel <= 0) {
        updateVehicle(playerId, vehicleId, { isMoving: false });
        return false;
      }
      
      // Consommation avec limite minimale à zéro
      const newFuelLevel = Math.max(vehicle.fuel - amount, 0);
      updateVehicle(playerId, vehicleId, { fuel: newFuelLevel });
      
      return newFuelLevel > 0;
    },
    
    /**
     * Ravitaille complètement un véhicule principal
     * @param {string} playerId - ID unique du joueur
     */
    refuelVehicle: (playerId) => {
      const { updateVehicle } = get();
      const shipId = "player-1-ship";
      updateVehicle(playerId, shipId, { fuel: 100 });
    },

    /**
     * Vérifie le niveau de carburant d'un véhicule
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @returns {number} Niveau de carburant actuel
     */
    getFuelLevel: (playerId, vehicleId) => {
      const { players } = get();
      return players[playerId]?.vehicles?.[vehicleId]?.fuel || 0;
    },

    /**
     * Vérifie si un véhicule a besoin de carburant
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @param {number} threshold - Seuil minimum (défaut: 20)
     * @returns {boolean} True si le véhicule a besoin de carburant
     */
    needsFuel: (playerId, vehicleId, threshold = 20) => {
      return get().getFuelLevel(playerId, vehicleId) <= threshold;
    },
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default createFuelSlice;
