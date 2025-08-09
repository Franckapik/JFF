/**
 * ==========================================================================
 * COLLECTING HANDLER - Handler pour la collecte de ressources du vaisseau
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';

interface ShipCollectingHandlerParams {
  fsmSend: (event: Record<string, unknown>) => void;
  botId: string;
  shipType: 'ship' | 'main-ship';
}

/**
 * Création d'un handler pour la collecte de ressources du vaisseau
 * @param params - Les paramètres nécessaires
 * @returns L'objet handler avec les méthodes
 */
export const createShipCollectingHandler = ({ fsmSend, botId, shipType }: ShipCollectingHandlerParams) => {
  return {
    /**
     * Traite la collecte de ressources sur la tuile
     * @param position - La position visuelle actuelle
     */
    processResourceCollection(position: WorldPosition): void {
      fsmLogger.info(`📦 [${botId}] Ship collecting resources`, {
        position,
        shipType
      });
      
      // Met à jour la position pendant la collecte
      fsmSend({
        type: 'SHIP_POSITION_UPDATE',
        botId,
        shipType,
        position
      });
    },

    /**
     * Déclenche la fin de la collecte
     * @param position - La position visuelle actuelle
     */
    triggerCollectionComplete(position: WorldPosition): void {
      fsmLogger.info(`✅ [${botId}] Ship collection complete, loading resources`, {
        position,
        shipType
      });
      
      fsmSend({
        type: 'SHIP_LOAD_RESOURCES',
        botId,
        shipType,
        position
      });
    },

    /**
     * Gère l'épuisement des ressources sur la tuile
     * @param position - La position visuelle actuelle
     */
    handleResourceDepletion(position: WorldPosition): void {
      fsmLogger.info(`⚠️ [${botId}] Resources depleted on tile`, {
        position,
        shipType
      });
      
      fsmSend({
        type: 'RESOURCE_DEPLETED',
        botId,
        shipType,
        position
      });
    }
  };
};

export default createShipCollectingHandler;
