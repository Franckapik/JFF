/**
 * ==========================================================================
 * SHIP HANDLERS - Handlers pour le tracker de vaisseaux
 * ==========================================================================
 */

import { createShipCollectingHandler } from './collectingHandler';
import { createShipInitializationHandler } from './initializationHandler';
import { createShipMovingToTileHandler } from './movingToTileHandler';
import { createShipReturningHandler } from './returningHandler';

export {
  createShipCollectingHandler, createShipInitializationHandler, createShipMovingToTileHandler,
  createShipReturningHandler
};

/**
 * Création des handlers pour le vaisseau selon l'état FSM
 * Suit la même logique que les handlers de drone
 */
interface ShipHandlerParams {
  fsmSend: (event: Record<string, unknown>) => void;
  botId: string;
  shipType: 'ship' | 'main-ship';
}

export const createShipHandlers = ({ fsmSend, botId, shipType }: ShipHandlerParams) => {
  // Conversion de fsmSend vers send pour uniformiser l'interface
  const send = fsmSend;
  
  return {
    initializeHandler: createShipInitializationHandler({ botId, shipType, send }),
    movingToTileHandler: createShipMovingToTileHandler({ botId, shipType, send }),
    collectingHandler: createShipCollectingHandler({ botId, shipType, send }),
    returningHandler: createShipReturningHandler({ botId, shipType, send })
  };
};

