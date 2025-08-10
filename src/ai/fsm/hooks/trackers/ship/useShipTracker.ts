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

        // Switch unifié pour tous les sous-états de collecting avec logique basée sur la distance
        switch (currentState) {
            case 'collecting_ship_moving_to_tile': {
                if (context?.selectedTileForCollection?.coord) {
                    // Pour simplifier, utiliser la position fixe (0,0,0) comme dans les actions.assign.ts
                    const targetPosition = { x: 0, y: 0.5, z: 0 };
                    const distance = Math.sqrt(
                        Math.pow(position.x - targetPosition.x, 2) +
                        Math.pow(position.z - targetPosition.z, 2)
                    );
                    handlers.movingToTileHandler.process(distance, position);
                }
                break;
            }
                
            case 'collecting_ship_collecting': {
                // Pour la collecte, la distance n'est pas pertinente (simulation par timer)
                handlers.collectingHandler.process(0, position);
                break;
            }
                
            case 'collecting_ship_returning': {
                if (vehicle?.basePosition) {
                    const basePosition = vehicle.basePosition;
                    const distance = Math.sqrt(
                        Math.pow(position.x - basePosition.x, 2) +
                        Math.pow(position.z - basePosition.z, 2)
                    );
                    handlers.returningHandler.process(distance, position);
                }
                break;
            }
                
            default:
                // Pour les autres états, pas de traitement spécifique
                break;
        }
    }, [context, send, botId, shipType]);

    return updatePosition;
};
