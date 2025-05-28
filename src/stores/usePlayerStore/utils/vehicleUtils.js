/**
 * ============================================================================
 * VEHICLE UTILITIES
 * ============================================================================
 * 
 * Utilitaires pour la manipulation et les transformations des véhicules :
 * - Création d'états de véhicules mis à jour
 * - Opérations sur les collections de véhicules
 * - Transformations de données
 * 
 * @author Votre nom
 * @version 1.0.0
 */

// ============================================================================
// CREATION D'ETATS VEHICULES
// ============================================================================

/**
 * Crée un état de véhicule mis à jour pour Zustand
 * @param {Object} state - État global actuel
 * @param {string} playerId - ID du joueur
 * @param {string} vehicleId - ID du véhicule
 * @param {Object} updates - Mises à jour à appliquer
 * @returns {Object} Nouvel état avec véhicule mis à jour
 */
export const createUpdatedVehicleState = (state, playerId, vehicleId, updates) => {
  return {
    players: {
      ...state.players,
      [playerId]: {
        ...state.players[playerId],
        vehicles: {
          ...state.players[playerId].vehicles,
          [vehicleId]: { 
            ...state.players[playerId].vehicles[vehicleId], 
            ...updates 
          }
        }
      }
    }
  };
};

/**
 * Crée un état de joueur avec plusieurs véhicules mis à jour
 * @param {Object} state - État global actuel
 * @param {string} playerId - ID du joueur
 * @param {Object} vehicleUpdates - Map des mises à jour par véhicule
 * @returns {Object} Nouvel état avec véhicules mis à jour
 */
export const createUpdatedVehiclesState = (state, playerId, vehicleUpdates) => {
  const currentPlayer = state.players[playerId];
  const updatedVehicles = { ...currentPlayer.vehicles };

  Object.entries(vehicleUpdates).forEach(([vehicleId, updates]) => {
    if (updatedVehicles[vehicleId]) {
      updatedVehicles[vehicleId] = {
        ...updatedVehicles[vehicleId],
        ...updates
      };
    }
  });

  return {
    players: {
      ...state.players,
      [playerId]: {
        ...currentPlayer,
        vehicles: updatedVehicles
      }
    }
  };
};

// ============================================================================
// OPERATIONS SUR LES COLLECTIONS
// ============================================================================

/**
 * Filtre les véhicules par type
 * @param {Object} vehicles - Dictionnaire des véhicules
 * @param {string} type - Type de véhicule à filtrer
 * @returns {Object} Véhicules filtrés par type
 */
export const filterVehiclesByType = (vehicles, type) => {
  return Object.entries(vehicles)
    .filter(([_, vehicle]) => vehicle.type === type)
    .reduce((filtered, [id, vehicle]) => {
      filtered[id] = vehicle;
      return filtered;
    }, {});
};

/**
 * Récupère tous les véhicules en mouvement
 * @param {Object} vehicles - Dictionnaire des véhicules
 * @returns {Object} Véhicules actuellement en mouvement
 */
export const getMovingVehicles = (vehicles) => {
  return Object.entries(vehicles)
    .filter(([_, vehicle]) => vehicle.isMoving)
    .reduce((moving, [id, vehicle]) => {
      moving[id] = vehicle;
      return moving;
    }, {});
};

/**
 * Récupère tous les véhicules à une position donnée
 * @param {Object} vehicles - Dictionnaire des véhicules
 * @param {string} coord - Coordonnées à vérifier
 * @returns {Object} Véhicules à cette position
 */
export const getVehiclesAtPosition = (vehicles, coord) => {
  return Object.entries(vehicles)
    .filter(([_, vehicle]) => vehicle.coord === coord)
    .reduce((atPosition, [id, vehicle]) => {
      atPosition[id] = vehicle;
      return atPosition;
    }, {});
};

// ============================================================================
// TRANSFORMATIONS DE DONNEES
// ============================================================================

/**
 * Extrait les informations essentielles d'un véhicule
 * @param {Object} vehicle - Véhicule complet
 * @returns {Object} Informations essentielles seulement
 */
export const extractVehicleEssentials = (vehicle) => {
  return {
    id: vehicle.id,
    type: vehicle.type,
    coord: vehicle.coord,
    position: vehicle.position,
    isMoving: vehicle.isMoving,
    resources: vehicle.resources
  };
};

/**
 * Crée un résumé des véhicules d'un joueur
 * @param {Object} vehicles - Dictionnaire des véhicules
 * @returns {Object} Résumé avec compteurs et états
 */
export const createVehiclesSummary = (vehicles) => {
  const vehicleList = Object.values(vehicles);
  
  return {
    total: vehicleList.length,
    moving: vehicleList.filter(v => v.isMoving).length,
    byType: vehicleList.reduce((counts, vehicle) => {
      counts[vehicle.type] = (counts[vehicle.type] || 0) + 1;
      return counts;
    }, {})
  };
};
