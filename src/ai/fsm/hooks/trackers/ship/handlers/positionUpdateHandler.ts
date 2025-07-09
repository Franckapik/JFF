/**
 * ==========================================================================
 * POSITION UPDATE HANDLER - Handler pour les mises à jour de position du vaisseau
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import { useTileStore } from '../../../../../../stores/useTileStore/index';
import type { ShipType, XStateSend } from '../../../../../../types';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants.ts';

interface PositionUpdateHandlerParams {
  fsmSend: XStateSend;
  botId: string;
  shipType: ShipType;
  canSendEvent: (eventType: string) => boolean;
  markEventSent: (eventType: string, timeout?: number) => void;
}

/**
 * Création d'un handler pour les mises à jour de position du vaisseau
 * @param params - Les paramètres nécessaires
 * @returns L'objet handler avec les méthodes
 */
export const createPositionUpdateHandler = ({ fsmSend, botId, shipType, canSendEvent, markEventSent }: PositionUpdateHandlerParams) => {
  return {
    /**
     * Traite une mise à jour de position du vaisseau
     * @param newPosition - Nouvelle position du vaisseau
     * @param lastPosition - Dernière position connue
     * @returns True si un événement a été envoyé
     */
    process(newPosition: WorldPosition, lastPosition: WorldPosition): boolean {
      if (!lastPosition) return false;
      
      // Utilise calculate3DDistance depuis le TileStore
      const calculate3DDistance = useTileStore.getState().calculate3DDistance;
      const distance = calculate3DDistance(lastPosition, newPosition);
      
      // Seulement envoyer des mises à jour pour des mouvements significatifs
      const eventKey = `ship_position_update_${botId}`;
      if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.MIN_MOVEMENT && canSendEvent(eventKey)) {
        fsmLogger.mouvement(`🚢 [${botId}] Ship position updated - distance moved: ${distance.toFixed(2)}`);
        
        fsmSend({ 
          type: 'SHIP_POSITION_UPDATE', 
          position: newPosition, 
          botId, 
          shipType,
          distance,
          timestamp: Date.now()
        });
        
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.MOVEMENT_RESET);
        return true;
      }
      
      return false;
    }
  };
};

export default createPositionUpdateHandler;
