/**
 * ============================================================================
 * VEHICLE SLICE - Gestion de base des véhicules
 * ============================================================================
 * 
 * Ce slice se concentre uniquement sur la gestion de base des véhicules :
 * - État et propriétés des véhicules (CRUD simple)
 * - Mise à jour générique des propriétés
 * 
 * RESPONSABILITÉS DÉPLACÉES :
 * - Logique de dépôt de ressources → resourceSlice
 * - Gestion du carburant → fuelSlice
 * - Système de mouvement → movementSlice
 * 
 * @author Votre nom
 * @version 2.0.0
 */

import { isMainShipId } from '../../../ai/constants/playerConstants';
import fsmLogger from '../../../utils/fsmLogger';
import { createUpdatedVehicleState } from '../utils';

// ============================================================================
// CREATION DU SLICE
// ============================================================================

const createVehicleSlice = (set, get) => {
  return {
    
    // ========================================================================
    // GESTION DE BASE DES VEHICULES - CRUD ET PROPRIETES
    // ========================================================================
    
    /**
     * Met à jour l'état d'un véhicule avec de nouvelles propriétés
     * 
     * Version simplifiée qui se contente de mettre à jour les propriétés
     * sans logique métier complexe. Les logiques spécialisées sont déléguées
     * aux autres slices.
     * 
     * @param {string} playerId - ID unique du joueur propriétaire
     * @param {string} vehicleId - ID du véhicule
     * @param {Object} updates - Propriétés à mettre à jour
     */
    updateVehicle: (playerId, vehicleId, updates) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        const vehicle = player.vehicles[vehicleId];
        if (!vehicle) {
          fsmLogger.player(`Vehicle '${vehicleId}' not found for player '${playerId}'.`, null, playerId);
          return state;
        }
        
        // Mise à jour simple sans logique métier
        return createUpdatedVehicleState(state, playerId, vehicleId, updates);
      });
    },

    // ========================================================================
    // ACCESSEURS ET UTILITAIRES DE BASE
    // ========================================================================
    
    /**
     * Récupère un véhicule spécifique
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @returns {Object|null} Le véhicule ou null
     */
    getVehicle: (playerId, vehicleId) => {
      const player = get().players[playerId];
      return player?.vehicles?.[vehicleId] || null;
    },

    /**
     * Récupère tous les véhicules d'un joueur
     * @param {string} playerId - ID du joueur
     * @returns {Object} Tous les véhicules du joueur
     */
    getPlayerVehicles: (playerId) => {
      const player = get().players[playerId];
      return player?.vehicles || {};
    },

    /**
     * Vérifie si un véhicule existe
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @returns {boolean} True si le véhicule existe
     */
    vehicleExists: (playerId, vehicleId) => {
      const player = get().players[playerId];
      return !!(player?.vehicles?.[vehicleId]);
    },
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default createVehicleSlice;