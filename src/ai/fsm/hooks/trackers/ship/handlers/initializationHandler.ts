/**
 * =========================================================================
 * SHIP INITIALIZATION HANDLER 
 * =========================================================================
 * 
 * Handler d'initialisation pour le vaisseau principal.
 * Envoie SHIP_INITIALIZE_REQUEST lors de la première initialisation 
 * pour établir la position de base du vaisseau dans le contexte FSM.
 * 
 * Similaire au handler d'initialisation des drones mais pour le vaisseau.
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition, XStateSend } from '../../../../../../types/index.ts';

interface ShipInitHandlerParams {
  botId: string;
  shipType: string;
  send: XStateSend;
}

export const createShipInitializationHandler = ({ botId, shipType, send }: ShipInitHandlerParams) => {

  return {
    /**
     * Traite l'initialisation du vaisseau
     * Envoie SHIP_INITIALIZE_REQUEST avec la position initiale
     * 
     * @param position - Position initiale du vaisseau
     * @returns true si l'événement a été envoyé
     */
    process(position: WorldPosition): boolean {
      fsmLogger.context(`🚢 [${botId}] [Handler] Processing ship initialization`, {
        position,
        shipType
      });
      
      // Envoyer l'événement d'initialisation qui établira la basePosition dans le contexte
      send({ 
        type: 'SHIP_INITIALIZE_REQUEST', 
        shipType,
        initialPosition: position
      });
            
      return true;
    }
  };
};

export default createShipInitializationHandler;
