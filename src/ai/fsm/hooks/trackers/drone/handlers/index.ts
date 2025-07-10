/**
 * ==========================================================================
 * DRONE HANDLERS - Handlers pour le tracker de drones
 * ==========================================================================
 */

import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

import { createDeployingHandler } from './deployingHandler';
import { createInitializationHandler } from './initializationHandler';
import { createReturningHandler } from './returningHandler';
import { createScanningHandler } from './scanningHandler';


export const createDroneHandlers = ({ botId, droneType, send }: HandlerParams) => {
  return {
    init: createInitializationHandler({ botId, droneType, send }),
    deploying: createDeployingHandler({ botId, droneType, send }),
    scanning: createScanningHandler({ botId, droneType, send }),
    returning: createReturningHandler({ botId, droneType, send })
  };
};


