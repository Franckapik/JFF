import { useCallback } from 'react';

// === Store Imports ===
import { useTileStore } from '../../../../../stores/useTileStore/index';

// === Logger Import ===
import fsmLogger from '../../../../../logger/fsmLogger.ts';

// === Type Imports ===
import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { TileStoreType } from '../../../../../types/stores.d';
import type { DroneTrackerParams, HandlerParams } from '../../../../../types/tracker.d.ts';

// === Handlers ===
import { createDroneHandlers } from './handlers';

export const useDroneTracker = ({
    context,
    send,
    botId,
    droneType = 'explorer'
}: DroneTrackerParams): ((position: WorldPosition) => void) => {
    // Suppression de currentVisualPosition : non utilisée

    const { calculateDroneDistance } = useTileStore() as TileStoreType;

    // Fonction pour mettre à jour la position depuis l'animation
    const updatePosition = useCallback((position: WorldPosition) => {
    // Suppression de l'affectation à currentVisualPosition
        
        if (context?.droneFleet?.drones?.[droneType]?.visualState === 'deploying') {
        // ...
        }
        
        const handlers = createDroneHandlers({
            botId,
            droneType,
            send
        } as HandlerParams);

        const drone = context?.droneFleet?.drones?.[droneType];
        
        // Si le drone n'existe pas dans le contexte, attendre la prochaine mise à jour
        if (!drone) return;

        const distance = calculateDroneDistance(
            position,
            drone.visualState,
            drone.targetDroneTile ?? null,
            context?.vehicle?.position || context?.vehicle?.basePosition
        );

        // Switch unifié pour tous les états du drone avec interface unifiée
        switch (drone.visualState) {
            case 'uninitialized':
                handlers.init.process(); 
                break;
                
            case 'deploying':
                if (distance !== Infinity) {
                    handlers.deploying.process(distance, position);
                }
                break;
                
            case 'scanning':
                if (distance !== Infinity) {
                    handlers.scanning.process(distance, position);
                }
                break;
                
            case 'returning':
                if (distance !== Infinity) {
                    handlers.returning.process(distance, position);
                }
                break;
                
            case 'docked':
                // Le drone est au repos, pas d'action nécessaire
                break;
                
            case 'failed':
                // Gérer les échecs de mission si nécessaire
                fsmLogger.error(`🛸 [${botId}] ${droneType} drone in failed state`, { position, distance });
                break;
                
            default:
            // ...
        }
    }, [context, send, botId, droneType, calculateDroneDistance]);

    return updatePosition;
};
