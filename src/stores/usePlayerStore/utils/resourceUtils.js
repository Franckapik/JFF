/**
 * ============================================================================
 * RESOURCE UTILITIES
 * ============================================================================
 * 
 * Utilitaires pour la gestion des ressources des véhicules :
 * - Calculs de capacité et transferts
 * - Manipulation d'objets ressources
 * - Vérifications de dépôt
 * 
 * @author Votre nom
 * @version 1.0.0
 */


// ============================================================================
// CALCULS DE RESSOURCES
// ============================================================================

/**
 * Vérifie si un véhicule est à capacité maximale
 * @param {Object} vehicle - Le véhicule à vérifier
 * @returns {boolean} True si à capacité maximale
 */
export const checkVehicleCapacity = (vehicle) => {
  if (!vehicle) return false;
  
  const current = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const max = vehicle.maxCapacity || { food: 100, debris: 1000, special: 2 };

  return current.food >= max.food || 
         current.debris >= max.debris || 
         current.special >= max.special;
};

/**
 * Calcule les nouvelles ressources après ajout
 * @param {Object} currentResources - Ressources actuelles
 * @param {Object} resourcesToAdd - Ressources à ajouter
 * @returns {Object} Nouvelles ressources calculées
 */
export const calculateUpdatedResources = (currentResources, resourcesToAdd) => {
  const current = currentResources || { food: 0, debris: 0, special: 0 };
  
  return {
    food: current.food + (resourcesToAdd.food || 0),
    debris: current.debris + (resourcesToAdd.debris || 0),
    special: current.special + (resourcesToAdd.special || 0)
  };
};

/**
 * Vérifie si un véhicule peut déposer des ressources
 * @param {Object} vehicle - Le véhicule à vérifier
 * @param {string} vehicleId - ID du véhicule
 * @returns {boolean} True si le dépôt est possible
 */
export const canDepositResources = (vehicle, vehicleId) => {
  return 
         vehicle.coord &&
         vehicle.coord === vehicle.startCoord &&
         !vehicle.isMoving;
};

/**
 * Calcule le score de ressources mis à jour après transfert
 * @param {Object} currentScore - Score actuel du joueur
 * @param {Object} shipResources - Ressources du vaisseau
 * @returns {Object} Score mis à jour
 */
export const calculateUpdatedScore = (currentScore, shipResources) => {
  const updatedScore = { ...currentScore };
  
  updatedScore.food += shipResources.food || 0;
  updatedScore.debris += shipResources.debris || 0;
  updatedScore.special += shipResources.special || 0;
  
  return updatedScore;
};

/**
 * Crée un objet véhicule avec ressources vidées
 * @param {Object} vehicle - Le véhicule à vider
 * @returns {Object} Véhicule avec ressources à zéro
 */
export const createEmptyVehicle = (vehicle) => {
  return {
    ...vehicle,
    resources: { food: 0, debris: 0, special: 0 }
  };
};
