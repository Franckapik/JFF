/**
 * ==========================================================================
 * SHIP HANDLERS - Handlers pour le tracker de vaisseaux
 * ==========================================================================
 */

import { createShipCollectingHandler } from './collectingHandler';
import { createShipInitializationHandler } from './initializationHandler';
import { createShipMovingToTileHandler } from './movingToTileHandler';
import { createPositionUpdateHandler } from './positionUpdateHandler';
import { createShipReturningHandler } from './returningHandler';

export {

    // Handler legacy (à supprimer)
    createPositionUpdateHandler, createShipCollectingHandler,
    // Handler d'initialisation (conservé)
    createShipInitializationHandler,

    // Nouveaux handlers basés sur les sous-états de collecting
    createShipMovingToTileHandler, createShipReturningHandler
};

/**
 * Crée tous les handlers nécessaires pour le vaisseau
 * Suit la même logique que createDroneHandlers
 */
export const createShipHandlers = (params: {
    fsmSend: (event: Record<string, unknown>) => void;
    botId: string;
    shipType: 'ship' | 'main-ship';
}) => {
    const { fsmSend, botId, shipType } = params;
    
    return {
        init: createShipInitializationHandler({ 
            fsmSend, 
            botId, 
            shipType,
            initialPositionSent: { current: false }
        }),
        movingToTile: createShipMovingToTileHandler({ fsmSend, botId, shipType }),
        collecting: createShipCollectingHandler({ fsmSend, botId, shipType }),
        returning: createShipReturningHandler({ fsmSend, botId, shipType })
    };
};

