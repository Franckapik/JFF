/**
 * ==========================================================================
 * COLLECTING HANDLER - Handler pour la collecte de ressources du vaisseau
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';

interface ShipHandlerParams {
  botId: string;
  shipType: 'ship' | 'main-ship';
  send: (event: Record<string, unknown>) => void;
}

/**
 * Création d'un handler pour la collecte de ressources du vaisseau
 * Suit la même logique que les handlers de drone pour le scanning
 */
export const createShipCollectingHandler = ({ botId, shipType, send }: ShipHandlerParams) => {
  let collectionStarted = false;
  
  return {
    process(_distance: number, position: WorldPosition): boolean {
      // Pour la collecte, on démarre le timer une seule fois quand on entre dans cet état
      if (!collectionStarted) {
        collectionStarted = true;
        
        fsmLogger.info(`📦 [${botId}] Starting resource collection`, {
          position,
          shipType
        });
        
        // Simulation de la collecte de ressources (comme dans les actions.effects.ts)
        setTimeout(() => {
          fsmLogger.action(`📦 [${botId}] Collection completed, sending SHIP_LOAD_RESOURCES`);
          send({ 
            type: 'SHIP_LOAD_RESOURCES', 
            botId, 
            shipType 
          });
        }, 2000); // 2 secondes de collecte simulée
      }
      
      // Pour la collecte, la logique de fin est gérée par le timer, pas par la position
      return false;
    }
  };
};

export default createShipCollectingHandler;
