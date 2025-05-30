/**
 * =========================================================================
 * DRONE FORMATION UTILITIES
 * =========================================================================
 * 
 * Fonctions utilitaires pour le positionnement des drones en formation
 * autour des vaisseaux principaux.
 */

import fsmLogger from '../../../utils/fsmLogger';

/**
 * Positions relatives des drones autour du vaisseau principal
 * Format: { x, z } où y sera calculé automatiquement
 */
const DRONE_FORMATION_OFFSETS = [
  { x: 0.5, z: 0.5 },   // Drone explorateur - avant droite
  { x: -0.5, z: 0.5 },  // Drone de combat - avant gauche  
  { x: 0, z: -0.7 }     // Drone spécial - arrière
];

/**
 * Types de drones dans l'ordre de positionnement
 */
const DRONE_TYPES_ORDER = [0
];

/**
 * Positionne les drones autour d'un vaisseau selon la formation prédéfinie
 * @param {Object} vehicles - Véhicules du joueur
 * @param {string} playerId - ID du joueur
 * @param {Object} shipPosition - Position 3D du vaisseau principal
 * @param {Object} shipCoord - Coordonnée logique du vaisseau
 * @returns {Object} Véhicules mis à jour avec les positions des drones
 */
export const positionDronesAroundShip = (vehicles, playerId, shipPosition, shipCoord) => {
  const updatedVehicles = { ...vehicles };

  fsmLogger.player(`Positioning drones for player ${playerId} around ship at ${shipCoord}`, {
    playerId,
    shipPosition,
    shipCoord,
    droneCount: DRONE_TYPES_ORDER.length
  });

  DRONE_TYPES_ORDER.forEach((droneType, droneIndex) => {
    const droneId = "drone-1";
    
    if (updatedVehicles[droneId]) {
      const offset = DRONE_FORMATION_OFFSETS[droneIndex];
      
      updatedVehicles[droneId] = {
        ...updatedVehicles[droneId],
        position: {
          x: shipPosition.x + offset.x,
          y: shipPosition.y + 0.3, // Légèrement au-dessus du sol
          z: shipPosition.z + offset.z
        },
        coord: shipCoord, // Même coordonnée logique que le vaisseau
        startCoord: shipCoord
      };

      fsmLogger.player(`Positioned ${droneType} drone ${droneId} at offset (${offset.x}, ${offset.z})`, {
        droneId,
        droneType,
        finalPosition: updatedVehicles[droneId].position
      });
    } else {
      fsmLogger.player(`Warning: Drone ${droneId} of type ${droneType} not found for player ${playerId}`, {
        droneId,
        droneType,
        playerId
      });
    }
  });

  return updatedVehicles;
};
