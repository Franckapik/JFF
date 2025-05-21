/**
 * Slice pour la gestion des véhicules et leurs mouvements
 */
import { updateVehicle as updateVehicleUtil } from '../../../utils/utils';
import { isMainShipId } from '../../../ai/constants/playerConstants';

const createVehicleSlice = (set, get) => {
  return {
    /**
     * Met à jour l'état d'un véhicule avec de nouvelles propriétés
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule (ship, drone1, drone2, etc.)
     * @param {Object} updates - Propriétés à mettre à jour
     */
    updateVehicle: (playerId, vehicleId, updates) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        const vehicle = player.vehicles[vehicleId];
        if (!vehicle) {
          console.warn(`Vehicle '${vehicleId}' not found for player '${playerId}'.`);
          return state;
        }
        
        const updatedVehicle = { ...vehicle, ...updates };
        
        // Logique spécifique pour les vaisseaux à la base (dépôt des ressources)
        if (isMainShipId(vehicleId) && 
            updatedVehicle.coord &&
            updatedVehicle.coord === updatedVehicle.startCoord &&
            !updatedVehicle.isMoving) {
          // Mise à jour du score avec les ressources du vaisseau
          const updatedScore = { ...player.score.resources };
          const shipResources = updatedVehicle.resources;
          
          updatedScore.food += shipResources.food;
          updatedScore.debris += shipResources.debris;
          updatedScore.special += shipResources.special;
          
          // Réinitialiser les ressources du vaisseau
          updatedVehicle.resources = { food: 0, debris: 0, special: 0 };
          
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
        
        // Mise à jour standard du véhicule
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              vehicles: {
                ...player.vehicles,
                [vehicleId]: updatedVehicle
              }
            }
          }
        };
      });
    },

    /**
     * Met à jour la tuile cible d'un véhicule et initie un mouvement
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @param {Object} targetTile - Tuile cible
     */
    moveToTile: (playerId, vehicleId, targetTile) => {
      console.log(`[PlayerStore] Moving ${playerId}/${vehicleId} to tile:`, targetTile.coord);
      
      // Vérifier que les données sont valides
      if (!targetTile || !targetTile.position || !targetTile.coord) {
        console.error("Invalid target tile data:", targetTile);
        return;
      }
      
      set((state) => updateVehicleUtil(state, playerId, vehicleId, {
        targetTile: {
          position: targetTile.position,
          coord: targetTile.coord,
        },
        isMoving: true
      }));
    },
    
    /**
     * Consomme du carburant pour un véhicule spécifique
     * @param {string} playerId - ID du joueur
     * @param {string} vehicleId - ID du véhicule
     * @param {number} amount - Quantité de carburant à consommer (par défaut: 5)
     * @returns {boolean} - true si suffisamment de carburant, false sinon
     */
    consumeFuel: (playerId, vehicleId, amount = 5) => {
      const player = get().players[playerId];
      if (!player) return false;
      
      const vehicle = player.vehicles[vehicleId];
      if (!vehicle) return false;
      
      // Vérifier s'il y a suffisamment de carburant
      if (vehicle.fuel <= 0) {
        set((state) => updateVehicleUtil(state, playerId, vehicleId, { isMoving: false }));
        return false;
      }
      
      // Consommer le carburant et mettre à jour le véhicule
      const newFuelLevel = Math.max(vehicle.fuel - amount, 0);
      set((state) => updateVehicleUtil(state, playerId, vehicleId, { fuel: newFuelLevel }));
      
      // Retourner true si le nouveau niveau est > 0, false sinon
      return newFuelLevel > 0;
    },
    
    /**
     * Ravitaille un véhicule en carburant (remise à 100)
     * @param {string} playerId - ID du joueur
     */
    refuelVehicle: (playerId) => {
      set((state) => updateVehicleUtil(state, playerId, "ship", { fuel: 100 }));
    },
  };
};

export default createVehicleSlice;