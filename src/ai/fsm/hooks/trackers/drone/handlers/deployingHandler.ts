/**
 * ==========================================================================
 * DEPLOYING HANDLER - Handler pour l'état drone_deploying
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';
import type { DroneType, XStateSend } from '../../../../../../types';
import type { WorldPosition } from '../../../../../../types/coordinates';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants.ts';

interface DeployingHandlerParams {
  botId: string;
  droneType: DroneType;
  send: XStateSend;
  canSendEvent: (eventType: string) => boolean;
  markEventSent: (eventType: string, timeout?: number) => void;
}

/**
 * Création d'un handler pour l'état drone_deploying
 * @param params - Les paramètres nécessaires
 * @returns L'objet handler avec les méthodes
 */
export const createDeployingHandler = ({ botId, droneType, send, canSendEvent, markEventSent }: DeployingHandlerParams) => {

  return {
    /**
     * Traite une position lors de l'état de déploiement
     * @param distance - Distance à la cible
     * @param position - Position actuelle du drone
     * @returns True si un événement a été envoyé
     */
    process(distance: number, position: WorldPosition): boolean {
      const eventKey = `drone_deploying_reached_${botId}_${droneType}`;
      
      // Vérifier si le drone a atteint sa cible
      const isCloseEnough = distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH;
      const canSendEventNow = canSendEvent(eventKey);
      
      // Si les conditions sont remplies, effectuer la transition
      if (isCloseEnough && canSendEventNow) {
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
