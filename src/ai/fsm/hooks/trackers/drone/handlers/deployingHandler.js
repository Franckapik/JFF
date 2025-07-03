/**
 * ==========================================================================
 * DEPLOYING HANDLER - Handler pour l'état drone_deploying
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants';

/**
 * Création d'un handler pour l'état drone_deploying
 * @param {Object} params - Les paramètres nécessaires
 * @returns {Object} - L'objet handler avec les méthodes
 */
export const createDeployingHandler = ({ botId, droneType, send, canSendEvent, markEventSent }) => {
  return {
    /**
     * Traite une position lors de l'état de déploiement
     * @param {number} distance - Distance à la cible
     * @param {Object} position - Position actuelle du drone
     * @returns {boolean} - True si un événement a été envoyé
     */
    process(distance, position) {
      const eventKey = `drone_deploying_reached_${botId}_${droneType}`;
      
      // 🚨 DIAGNOSTIC: Loguer les données de distance pour debug
      if (position) {
        fsmLogger.mouvement(`📏 [${botId}] ${droneType} distance to target: ${distance.toFixed(2)}`);
      }
      
      if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
        fsmLogger.mouvement(`🎯 [${botId}] ${droneType} reached target tile for scanning`, {
          position,
          distance,
          threshold: POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH
        });
        
        // Transition vers drone_scanning
        send({
          type: 'DRONE_REACHES_TILE',
          position,
          droneType,
          timestamp: Date.now()
        });
        
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
        return true;
      }
      
      return false;
    }
  };
};

export default createDeployingHandler;
