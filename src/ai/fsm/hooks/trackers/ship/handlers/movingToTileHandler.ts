/**
 * ==========================================================================
 * MOVING TO TILE HANDLER - Handler pour le déplacement du vaisseau vers une tuile
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';

// FIX: utiliser le même seuil que le collectingRadius FSM (3) et useShipTracker
const DEBUG_TILE_DETECTION_THRESHOLD = 3;

interface ShipHandlerParams {
  botId: string;
  shipType: 'ship' | 'main-ship';
  send: (event: Record<string, unknown>) => void;
}

/**
 * Création d'un handler pour le déplacement du vaisseau vers une tuile
 * Suit la même logique que les handlers de drone
 */
export const createShipMovingToTileHandler = ({ botId, shipType, send }: ShipHandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utilise le seuil de détection temporaire pour debug
      const isCloseEnough = distance < DEBUG_TILE_DETECTION_THRESHOLD;
      
      if (isCloseEnough) {
        fsmLogger.mouvement(`🚢 [${botId}] Ship reached target tile (threshold: ${DEBUG_TILE_DETECTION_THRESHOLD})`, { 
          position, 
          distance, 
          threshold: DEBUG_TILE_DETECTION_THRESHOLD,
          shipType
        });
        
        send({ 
          type: 'SHIP_REACHES_TILE', 
          botId, 
          shipType 
        });
        
        return true;
      }
      
      return false;
    }
  };
};

export default createShipMovingToTileHandler;
