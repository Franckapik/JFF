/**
 * ============================================================================
 * RESOURCE SLICE - Gestion des ressources des véhicules
 * ============================================================================
 * 
 * Ce slice gère exclusivement les ressources transportées par les véhicules :
 * - Dépôt automatique des ressources à la base
 * - Vérification de capacité
 * - Transfert de ressources
 * 
 * @author Votre nom
 * @version 1.0.0
 */

import { isMainShipId } from '../../../ai/constants/playerConstants';
import fsmLogger from '../../../utils/fsmLogger';
import { 
  checkVehicleCapacity, 
  calculateUpdatedResources, 
  canDepositResources,
  calculateUpdatedScore,
  createEmptyVehicle
} from '../utils';

// ============================================================================
// CREATION DU SLICE
// ============================================================================

const createResourceSlice = (set, get) => {
  return {
    
    // ========================================================================
    // GESTION DES RESSOURCES - DEPOT ET TRANSFERT
    // ========================================================================
    
    /**
     * Vérifie et effectue le dépôt automatique des ressources à la base
     * 
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @returns {boolean} True si un dépôt a été effectué
     */
    processResourceDeposit: (playerId, vehicleId) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        const vehicle = player.vehicles[vehicleId];
        if (!vehicle) return state;

        // Vérifier si c'est un vaisseau principal qui revient à sa base
        if (canDepositResources(vehicle, vehicleId)) {
          
          // Transfert des ressources du vaisseau vers le score du joueur
          const updatedScore = calculateUpdatedScore(player.score.resources, vehicle.resources);
          
          // Vidange de la soute du vaisseau après transfert
          const updatedVehicle = createEmptyVehicle(vehicle);
          
          fsmLogger.action(`Resources deposited at base: ${JSON.stringify(vehicle.resources)}`);
          
          return {
            players: {
              ...state.players,
              [playerId]: {
                ...player,
                vehicles: {
                  ...player.vehicles,
                  [vehicleId]: updatedVehicle
                },
                score: {
                  ...player.score,
                  resources: updatedScore
                }
              }
            }
          };
        }
        
        return state;
      });
    },

    /**
     * Vérifie si un véhicule est à capacité maximale
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @returns {boolean} True si à capacité maximale
     */
    isAtCapacity: (playerId, vehicleId) => {
      const { players } = get();
      const vehicle = players[playerId]?.vehicles?.[vehicleId];
      
      return checkVehicleCapacity(vehicle);
    },

    /**
     * Ajoute des ressources à un véhicule
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @param {Object} resources - Ressources à ajouter
     */
    addResources: (playerId, vehicleId, resources) => {
      const { updateVehicle, players } = get();
      const vehicle = players[playerId]?.vehicles?.[vehicleId];
      if (!vehicle) return;

      const updated = calculateUpdatedResources(vehicle.resources, resources);
      updateVehicle(playerId, vehicleId, { resources: updated });
    },

    /**
     * Transfère toutes les ressources d'un véhicule vers le score du joueur
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     */
    transferResourcesToScore: (playerId, vehicleId) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        const vehicle = player.vehicles[vehicleId];
        if (!vehicle) return state;

        const shipResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
        const updatedScore = calculateUpdatedScore(player.score.resources, shipResources);

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              vehicles: {
                ...player.vehicles,
                [vehicleId]: createEmptyVehicle(vehicle)
              },
              score: {
                ...player.score,
                resources: updatedScore
              }
            }
          }
        };
      });
    },
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default createResourceSlice;