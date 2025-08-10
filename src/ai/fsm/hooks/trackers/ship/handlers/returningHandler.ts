/**
 * ==========================================================================
 * RETURNING HANDLER - Handler pour le retour du vaisseau à la base
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import { TILE_DETECTION_THRESHOLD } from '../../../../machineX/config/constants';

interface ShipHandlerParams {
  botId: string;
  shipType: 'ship' | 'main-ship';
  send: (event: Record<string, unknown>) => void;
}

/**
 * Création d'un handler pour le retour du vaisseau à la base
 * Suit la même logique que les handlers de drone
 */
export const createShipReturningHandler = ({ botId, shipType, send }: ShipHandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utilise le même seuil de détection que les drones
      const isCloseEnough = distance < TILE_DETECTION_THRESHOLD;
      
      if (isCloseEnough) {
        fsmLogger.mouvement(`🏠 [${botId}] Ship reached base (threshold: ${TILE_DETECTION_THRESHOLD})`, { 
          position, 
          distance, 
          TILE_DETECTION_THRESHOLD,
          shipType
        });
        
        send({ 
          type: 'SHIP_REACHES_BASE', 
          botId, 
          shipType 
        });
        
        return true;
      }
      
      return false;
    }
  };
};

export default createShipReturningHandler;
