/**
 * ==========================================================================
 * MOVING TO TILE HANDLER - Handler pour le déplacement du vaisseau vers une tuile
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';

interface ShipMovingToTileHandlerParams {
  fsmSend: (event: Record<string, unknown>) => void;
  botId: string;
  shipType: 'ship' | 'main-ship';
}

/**
 * Création d'un handler pour le déplacement du vaisseau vers une tuile
 * @param params - Les paramètres nécessaires
 * @returns L'objet handler avec les méthodes
 */
export const createShipMovingToTileHandler = ({ fsmSend, botId, shipType }: ShipMovingToTileHandlerParams) => {
  return {
    /**
     * Gère l'arrivée du vaisseau sur la tuile cible
     * @param position - La position visuelle actuelle
     * @param targetPosition - La position cible
     * @returns True si le vaisseau est arrivé
     */
    handleTileReached(position: WorldPosition, targetPosition: WorldPosition): boolean {
      const distance = Math.sqrt(
        Math.pow(position.x - targetPosition.x, 2) +
        Math.pow(position.z - targetPosition.z, 2)
      );
      
      // Tolérance pour considérer que le vaisseau est arrivé
      const tolerance = 0.2;
      
      if (distance <= tolerance) {
        fsmLogger.info(`🚢 [${botId}] Ship reached target tile`, {
          currentPosition: position,
          targetPosition,
          distance
        });
        
        fsmSend({
          type: 'SHIP_REACHES_TILE',
          botId,
          shipType,
          position
        });
        
        return true;
      }
      
      return false;
    },

    /**
     * Met à jour la position du vaisseau en mouvement
     * @param position - La position visuelle actuelle
     */
    updateMovingPosition(position: WorldPosition): void {
      fsmLogger.debug(`🚢 [${botId}] Ship moving to tile position update`, {
        position,
        shipType
      });
      
      fsmSend({
        type: 'SHIP_POSITION_UPDATE',
        botId,
        shipType,
        position
      });
    }
  };
};

export default createShipMovingToTileHandler;
