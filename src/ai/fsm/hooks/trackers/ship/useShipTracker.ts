import { useCallback, useRef } from 'react';

// === Type Imports ===
import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { XStateSend } from '../../../../../types/tracker.d.ts';

// === Handlers ===
import { createShipHandlers } from './handlers';

interface ShipTrackerParams {
  context: FSMContext;
  send: XStateSend;
  botId: string;
  shipType?: 'ship' | 'main-ship';
}

export const useShipTracker = ({
    context,
    send,
    botId,
    shipType = 'main-ship'
}: ShipTrackerParams): ((position: WorldPosition) => void) => {
    const currentVisualPosition = useRef<WorldPosition | null>(null);

    // Fonction pour mettre à jour la position depuis l'animation
    const updatePosition = useCallback((position: WorldPosition) => {
        currentVisualPosition.current = position;
        
        // Toujours envoyer la mise à jour de position pour le vaisseau
        send({
            type: 'SHIP_POSITION_UPDATE',
            botId,
            shipType,
            position
        });
        
        const handlers = createShipHandlers({
            fsmSend: send,
            botId,
            shipType
        });

        const currentState = context?.currentState;
        const vehicle = context?.vehicle;
        
        // Si le véhicule n'existe pas dans le contexte, attendre la prochaine mise à jour
        if (!vehicle) return;

        // Switch unifié pour tous les sous-états de collecting avec interface unifiée
        switch (currentState) {
            case 'collecting_ship_moving_to_tile':
                if (context?.selectedTileForCollection?.coord) {
                    // Pour l'instant, utiliser une position simplifiée pour le test
                    const targetPosition = { x: 0, y: 0.5, z: 0 };
                    handlers.movingToTile.handleTileReached(position, targetPosition);
                }
                break;
                
            case 'collecting_ship_collecting':
                handlers.collecting.processResourceCollection(position);
                break;
                
            case 'collecting_ship_returning':
                if (vehicle?.basePosition) {
                    handlers.returning.handleBaseReached(position, vehicle.basePosition);
                }
                break;
                
            default:
                // Pour les autres états, utiliser le handler d'initialisation
                handlers.init.handleInitialPosition(position);
                break;
        }
    }, [context, send, botId, shipType]);

    return updatePosition;
};
