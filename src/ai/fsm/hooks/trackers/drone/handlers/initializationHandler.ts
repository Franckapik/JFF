/**
 * ==========================================================================
 * INITIALIZATION HANDLER - Handler pour l'initialisation du drone
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { DroneType, XStateSend } from '../../../../../../types';
import type { WorldPosition } from '../../../../../../types/coordinates';

interface InitHandlerParams {
  botId: string;
  droneType: DroneType;
  send: XStateSend;
  canSendEvent: (eventType: string) => boolean;
  markEventSent: (eventType: string, timeout?: number) => void;
}

/**
 * Création d'un handler pour l'initialisation du drone
 * @param params - Les paramètres nécessaires
 * @returns L'objet handler avec les méthodes
 */
export const createInitializationHandler = ({ botId, droneType, send: _send, canSendEvent: _canSendEvent, markEventSent: _markEventSent }: InitHandlerParams) => {
  return {
    /**
     * Gère l'initialisation de la position du drone
     * @param position - La position visuelle actuelle
     * @returns True si l'initialisation a été effectuée
     */
    handleInitialPosition(position: WorldPosition): boolean {
      if (position) {
        fsmLogger.context(`🛸 [${botId}] Setting initial ${droneType} drone position`, {
          position,
          droneType
        });
        
        // L'initialisation est maintenant gérée par le droneTrackerEngine
        // qui envoie l'événement de position
        return true;
      }
      return false;
    }
  };
};

export default createInitializationHandler;
