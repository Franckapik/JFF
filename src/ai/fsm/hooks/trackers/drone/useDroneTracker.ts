import { useEffect, useRef } from 'react';

// === Store Imports ===
import { useTileStore } from '../../../../../stores/useTileStore/index';

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
}: DroneTrackerParams): WorldPosition | null => {
    const currentVisualPosition = useRef<WorldPosition | null>(null);

    const { calculateDroneDistance } = useTileStore() as TileStoreType;

    useEffect(() => {
        const handlers = createDroneHandlers({
            botId,
            droneType,
            send
        } as HandlerParams);

        const drone = context?.droneFleet?.drones?.[droneType];
        if (!drone?.isActive || !drone?.state) return;

        const position = currentVisualPosition.current;
        if (!position) return;

        const distance = calculateDroneDistance(
            position,
            drone.state,
            drone.targetPosition,
            context?.vehicle?.position || context?.vehicle?.basePosition
        );

        if (distance !== Infinity) {
            switch (drone.state) {
                case 'deploying':
                    handlers.deploying.process(distance, position);
                    break;
                case 'scanning':
                    handlers.scanning.process(distance, position);
                    break;
                case 'returning':
                    handlers.returning.process(distance, position);
                    break;
            }
        }
    }, [context, send, botId, droneType, calculateDroneDistance]);

    return currentVisualPosition.current;
};
