/**
 * ==========================================================================
 * SHIP INITIALIZE HANDLER - Handler pour l'initialisation du vaisseau
 * ==========================================================================
 * 
 * Ce handler gère l'initialisation du vaisseau en plaçant le vaisseau
 * à sa position de base et en envoyant SHIP_POSITION_UPDATE uniquement
 * lors de l'initialisation pour éviter les boucles d'animation.
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';

interface ShipHandlerParams {
  botId: string;
  shipType: 'ship' | 'main-ship';
  send: (event: Record<string, unknown>) => void;
}

/**
 * Création d'un handler pour l'initialisation du vaisseau
 * Envoie SHIP_POSITION_UPDATE uniquement lors de l'initialisation
 */
export const createShipInitializeHandler = ({ botId, shipType, send }: ShipHandlerParams) => {
  return {
    /**
     * Traite l'initialisation du vaisseau à sa position de base
     * @param basePosition - Position de base du vaisseau
     */
    process(basePosition: WorldPosition): void {
      fsmLogger.mouvement(`🚢 [${botId}] Ship initialized at base`, { 
        basePosition,
        shipType,
        botId
      });
      
      // Envoi de SHIP_POSITION_UPDATE uniquement à l'initialisation
      send({
        type: 'SHIP_POSITION_UPDATE',
        botId,
        shipType,
        position: basePosition
      });
      
      fsmLogger.info(`🚢 [${botId}] SHIP_POSITION_UPDATE sent for initialization`, {
        shipType,
        position: basePosition
      });
    }
  };
};

export default createShipInitializeHandler;
