/**
 * ==========================================================================
 * RETURNING HANDLER - Handler pour l'état drone_returning
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants';

/**
 * Création d'un handler pour l'état drone_returning
 * @param {Object} params - Les paramètres nécessaires
 * @returns {Object} - L'objet handler avec les méthodes
 */
export const createReturningHandler = ({ botId, droneType, send, canSendEvent, markEventSent }) => {

  return {
    /**
     * Traite une position lors de l'état de retour
     * @param {number} distance - Distance à la base
     * @param {Object} position - Position actuelle du drone
     * @returns {boolean} - True si un événement a été envoyé
     */
    process(distance, position) {
      const eventKey = `drone_returning_base_${botId}_${droneType}`;
      
      // Vérifier si le drone a atteint la base
      const isCloseEnough = distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH;
      const canSendEventNow = canSendEvent(eventKey);
      
      // Si les conditions sont remplies, effectuer la transition
      if (isCloseEnough && canSendEventNow) {
        fsmLogger.mouvement(`🏠 [${botId}] ${droneType} reached base - docking complete`, {
          position,
          distance,
          threshold: POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH
        });
        
        // Transition vers evaluating (retour à l'état parent)
        send({
          type: 'DRONE_REACHES_BASE',
          position,
          droneType,
          timestamp: Date.now()
        });
        
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.RETURN_RESET);
        return true;
      }
      
      return false;
    }
  };
};

export default createReturningHandler;
