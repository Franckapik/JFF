/**
 * Slice pour la gestion des ressources, des scores et des capacités
 */
import { updateVehicle as updateVehicleUtil } from '../../../utils/utils';
import fsmLogger from '../../../utils/fsmLogger';
import { getMainShipId } from '../../../ai/constants/playerConstants';

const createResourceSlice = (set, get) => {
  return {
    /**
     * Transfère les ressources d'un véhicule vers le score du joueur
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule (par défaut: l'ID du vaisseau principal du joueur)
     * @returns {boolean} - true si le transfert a réussi, false sinon
     */
     transferResourcesToScore: (playerId, vehicleId = null) => {
      const mainShipId = vehicleId || getMainShipId(playerId);
      const player = get().players[playerId];
      if (!player) return false;
      
      const vehicle = player.vehicles[mainShipId];
      if (!vehicle) return false;
      
      // Vérifier si le véhicule est à sa base
      if (vehicle.coord !== vehicle.startCoord) {
        return false;
      }
      
      // Transférer les ressources au score
      const resources = vehicle.resources;
      
      set((state) => {
        // 1. Mettre à jour le score du joueur
        const updatedScore = {
          ...state.players[playerId].score,
          resources: {
            food: state.players[playerId].score.resources.food + resources.food,
            debris: state.players[playerId].score.resources.debris + resources.debris,
            special: state.players[playerId].score.resources.special + resources.special,
          }
        };
        
        // 2. Réinitialiser les ressources du véhicule
        const updatedVehicle = {
          ...vehicle,
          resources: { food: 0, debris: 0, special: 0 }
        };
        
        // 3. Mettre à jour l'état
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...state.players[playerId],
              vehicles: {
                ...state.players[playerId].vehicles,
                [mainShipId]: updatedVehicle
              },
              score: updatedScore
            }
          }
        };
      });
      
      return true;
    },

    /**
     * Vérifie si un véhicule a atteint sa capacité maximale de ressources
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @returns {boolean} - true si le véhicule est à capacité maximale
     */
    checkResourceCapacity: (playerId, vehicleId) => {
      const player = get().players[playerId];
      const vehicle = player.vehicles[vehicleId];

      if (!vehicle.maxCapacity) return; // Skip if the vehicle has no maxCapacity (e.g., drones)

      const { food, debris, special } = vehicle.resources;
      const { food: maxFood, debris: maxDebris, special: maxSpecial } = vehicle.maxCapacity;

      // NOTE: On considère qu'une seule ressource pleine suffit pour déclencher la capacité maximale
      const isAtMaxCapacity = food >= maxFood || debris >= maxDebris || special >= maxSpecial;  
      
      // Si à capacité max, marquer seulement le vaisseau avec isAtCapacity = true
      if (isAtMaxCapacity) {
        fsmLogger.info(`${playerId}/${vehicleId} est à sa capacité maximale.`, null, playerId);
        
        // Mettre à jour le vaisseau avec la nouvelle propriété
        set((state) => updateVehicleUtil(state, playerId, vehicleId, { 
          isAtCapacity: true 
        }));
      }
      
      return isAtMaxCapacity;
    },
  };
};

export default createResourceSlice;