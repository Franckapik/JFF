import { useCallback } from 'react';

import { useTileStore } from '../../../../../stores/useTileStore/index';

import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { TileStoreType } from '../../../../../types/stores.d.ts';
import type { XStateSend } from '../../../../../types/tracker.d.ts';

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
    // Suppression de currentVisualPosition : non utilisée
    const { calculateDistance, gridToWorld } = useTileStore() as TileStoreType;

    const updatePosition = useCallback((position: WorldPosition) => {
    // Suppression de l'affectation à currentVisualPosition
        
        const handlers = createShipHandlers({ fsmSend: send, botId, shipType });
        const vehicle = context?.vehicle;
        const vehicleVisualState = vehicle?.visualState;
        if (!vehicle) return;

        let distance = Infinity;
        switch (vehicleVisualState) {
            case 'uninitialized':
                // Utiliser le handler d'initialisation au début du jeu
                handlers.initializeHandler.process(position);
                break;
            case 'moving_to_tile':
                // Envoyer la position au FSM pour les autres états
                send({ 
                    type: 'SHIP_POSITION_UPDATE', 
                    position,
                    shipType
                });
                
                if (vehicle.targetTile) {
                    distance = calculateDistance(position, gridToWorld(vehicle.targetTile));
                    if (distance !== Infinity) {
                        handlers.movingToTileHandler.process(distance, position);
                    }
                }
                break;
            case 'collecting':
                send({ 
                    type: 'SHIP_POSITION_UPDATE', 
                    position,
                    shipType
                });
                handlers.collectingHandler.process(0, position);
                break;
            case 'returning':
                send({ 
                    type: 'SHIP_POSITION_UPDATE', 
                    position,
                    shipType
                });
                if (vehicle.basePosition) {
                    distance = calculateDistance(position, vehicle.basePosition);
                    if (distance !== Infinity) {
                        handlers.returningHandler.process(distance, position);
                    }
                }
                break;
            case 'idle':
            case 'docked':
            case 'maintenance':
                // Envoyer la position au FSM même pour les états au repos
                send({ 
                    type: 'SHIP_POSITION_UPDATE', 
                    position,
                    shipType
                });
                break;
            default:
                // État non géré
                break;
        }
    }, [context, send, botId, shipType, calculateDistance, gridToWorld]);

    return updatePosition;
};


