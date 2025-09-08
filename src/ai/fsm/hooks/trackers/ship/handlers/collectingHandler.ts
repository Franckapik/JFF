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
  let collectionTimer: ReturnType<typeof setTimeout> | null = null;
  
  return {
    process(_distance: number, position: WorldPosition): boolean {
      fsmLogger.action(`📦 [${botId}] CollectingHandler.process called`, {
        collectionStarted,
        position,
        shipType
      });
      
      // Pour la collecte, on démarre le timer une seule fois quand on entre dans cet état
      if (!collectionStarted) {
        collectionStarted = true;
        
        fsmLogger.action(`📦 [${botId}] Starting resource collection`, {
          position,
          shipType
        });
        
        // Collecte de ressources réelles depuis la tuile cible
        collectionTimer = setTimeout(() => {
          fsmLogger.action(`📦 [${botId}] Collection completed, sending SHIP_LOAD_RESOURCES`);
          
          // Les ressources seront calculées depuis la tuile cible dans assignShipLoadResourcesContext
          // L'événement déclenche juste le processus de transfert
          
          send({ 
            type: 'SHIP_LOAD_RESOURCES', 
            botId, 
            shipType
          });
          collectionStarted = false; // Reset pour la prochaine collecte
          collectionTimer = null;
        }, 3000); // 3 secondes de collecte simulée (plus réaliste)
      }
      
      // Pour la collecte, la logique de fin est gérée par le timer, pas par la position
      return false;
    },
    
    // Méthode pour nettoyer le timer en cas d'interruption
    cleanup(): void {
      if (collectionTimer) {
        clearTimeout(collectionTimer);
        collectionTimer = null;
        collectionStarted = false;
        fsmLogger.action(`📦 [${botId}] Collection timer cleared`);
      }
    }
  };
};

export default createShipCollectingHandler;
