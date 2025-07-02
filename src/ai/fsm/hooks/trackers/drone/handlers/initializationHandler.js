/**
 * ==========================================================================
 * INITIALIZATION HANDLER - Handler pour l'initialisation du drone
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';

/**
 * Création d'un handler pour l'initialisation du drone
 * @param {Object} params - Les paramètres nécessaires
 * @returns {Object} - L'objet handler avec les méthodes
 */
export const createInitializationHandler = ({ context, send, botId, droneType, initialPositionSent }) => {
  return {
    /**
     * Gère l'initialisation de la position du drone
     * @param {Object} position - La position visuelle actuelle
     * @returns {boolean} - True si l'initialisation a été effectuée
     */
    handleInitialPosition(position) {
      if (!initialPositionSent.current && position) {
        const drone = context?.droneFleet?.drones?.[droneType];
        
        // Seulement pour les drones actifs qui n'ont pas encore de position
        if (drone?.isActive && !drone?.position) {
          fsmLogger.context(`🛸 [${botId}] Setting initial ${droneType} drone position`, {
            position,
            droneState: drone.state,
            droneActive: drone.isActive
          });
          
          // Événement de mise à jour de position pour initialiser le drone
          send({
            type: 'DRONE_POSITION_UPDATE',
            position,
            droneType,
            timestamp: Date.now()
          });
          
          initialPositionSent.current = true;
          return true;
        }
      }
      return false;
    }
  };
};

export default createInitializationHandler;
