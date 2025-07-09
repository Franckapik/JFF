/**
 * ==========================================================================
 * RETURNING HANDLER - Handler pour l'état drone_returning
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';
import type { DroneType, XStateSend } from '../../../../../../types';
import type { WorldPosition } from '../../../../../../types/coordinates';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants.ts';

interface ReturningHandlerParams {
  botId: string;
  droneType: DroneType;
  send: XStateSend;
  canSendEvent: (eventType: string) => boolean;
  markEventSent: (eventType: string, timeout?: number) => void;
}

/**
 * Création d'un handler pour l'état drone_returning
 * @param params - Les paramètres nécessaires
 * @returns L'objet handler avec les méthodes
 */
export const createReturningHandler = ({ botId, droneType, send, canSendEvent, markEventSent }: ReturningHandlerParams) => {

  return {
    /**
     * Traite une position lors de l'état de retour
     * @param distance - Distance à la base
     * @param position - Position actuelle du drone
     * @returns True si un événement a été envoyé
     */
    process(distance: number, position: WorldPosition): boolean {
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
