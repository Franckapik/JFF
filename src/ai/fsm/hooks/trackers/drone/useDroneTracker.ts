import { useCallback, useEffect, useRef } from 'react';

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
}: DroneTrackerParams): ((position: WorldPosition) => void) => {
    // === Constants ===
    const currentVisualPosition = useRef<WorldPosition | null>(null);
    const initialPositionSent = useRef<boolean>(false);

    const tileStore = useTileStore() as TileStoreType;
    const { calculateDroneDistance } = tileStore;

    // === Core Logic ===
    const updateDroneVisualPosition = useCallback((position: WorldPosition) => {
        if (!position) return;
        currentVisualPosition.current = position;

        const handlers = createDroneHandlers({
            botId,
            droneType,
            send
        } as HandlerParams);
        handlers.init.handleInitialPosition(position);

        const drone = context?.droneFleet?.drones?.[droneType];
        if (!drone?.isActive || !drone?.state) return;

        if (['docked', 'failed'].includes(drone.state)) return;

        const distance = calculateDroneDistance(
            position,
            drone.state,
            drone.targetPosition,
            context?.vehicle?.position || context?.vehicle?.basePosition
        );

        if (distance === Infinity) return;

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
    }, [context, send, botId, droneType, calculateDroneDistance]);

    // === Cleanup ===
    useEffect(() => {
        return () => {
            currentVisualPosition.current = null;
            initialPositionSent.current = false;
        };
    }, []);

    return updateDroneVisualPosition;
};
