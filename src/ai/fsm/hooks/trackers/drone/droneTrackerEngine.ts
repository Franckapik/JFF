/**
 * ==========================================================================
 * DRONE TRACKER ENGINE - Version Simplifiée
 * ==========================================================================
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore/index';
import type { DroneTrackerParams } from '../../../../../types';
import type { WorldPosition } from '../../../../../types/coordinates';
import { convertVisualToFSM } from '../../../../../types/drone';
import {
    createDeployingHandler,
    createInitializationHandler,
    createReturningHandler,
    createScanningHandler
} from './handlers';

// Cache des dernières positions rapportées
const lastReportedPositions = new Map<string, WorldPosition>();

/**
 * Vérifie si la position a suffisamment changé
 */
const hasSignificantChange = (
  newPos: WorldPosition, 
  lastPos?: WorldPosition, 
  threshold: number = 0.1
): boolean => {
  if (!lastPos) return true;
  
  const dx = newPos.x - lastPos.x;
  const dy = newPos.y - lastPos.y;
  const dz = newPos.z - lastPos.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  return distance > threshold;
};

/**
 * Crée tous les handlers nécessaires pour un drone
 */
const createAllHandlers = (params: DroneTrackerParams) => {
  const { botId, droneType, send, canSendEvent, markEventSent, gridToHexCoord, worldToGrid, useTileStore } = params;
  
  return {
    init: createInitializationHandler({ 
      botId, droneType, send, canSendEvent, markEventSent 
    }),
    deploying: createDeployingHandler({ 
      botId, droneType, send, canSendEvent, markEventSent 
    }),
    scanning: createScanningHandler({ 
      botId, droneType, send, canSendEvent, markEventSent, 
      gridToHexCoord, worldToGrid, useTileStore 
    }),
    returning: createReturningHandler({ 
      botId, droneType, send, canSendEvent, markEventSent 
    })
  };
};

/**
 * Traitement principal des positions du drone - VERSION SIMPLIFIÉE
 */
export const processDronePosition = (params: DroneTrackerParams): void => {
  const { position, context, droneType, send, botId } = params;
  
  if (!position || !context) return;
  
  // 1. Créer les handlers
  const handlers = createAllHandlers(params);
  
  // 2. Gestion de la mise à jour de position
  const droneKey = `${botId}-${droneType}`;
  const isFirstPosition = !lastReportedPositions.has(droneKey);
  const lastPosition = lastReportedPositions.get(droneKey);
  
  if (isFirstPosition || hasSignificantChange(position, lastPosition)) {
    // Envoyer l'événement de mise à jour
    send({
      type: 'DRONE_POSITION_UPDATE',
      position,
      droneType,
      timestamp: Date.now(),
      isInitial: isFirstPosition
    });
    
    lastReportedPositions.set(droneKey, { ...position });
    
    // Log simple
    if (isFirstPosition) {
      fsmLogger.context(`🛸 [${botId}] Initial ${droneType} position set`);
    }
  }
  
  // 3. Gestion de l'initialisation
  handlers.init.handleInitialPosition(position);
  
  // 4. Traitement selon l'état du drone
  const drone = context?.droneFleet?.drones?.[droneType];
  if (!drone?.isActive || !drone?.state) return;
  
  // 5. Conversion de l'état visuel vers état FSM avec fonction unifiée
  const fsmState = convertVisualToFSM(drone.state);
  if (!fsmState) {
    // États comme 'docked' ou 'failed' ne nécessitent pas de tracking
    return;
  }
  
  // 6. Calculer la distance via le tileStore
  const tileStore = useTileStore.getState();
  const distance = tileStore.calculateDroneDistance(
    position, 
    fsmState, 
    drone.targetPosition, 
    context?.vehicle?.position || context?.vehicle?.basePosition
  );
  
  if (distance === Infinity) return;
  
  // 6. Dispatcher vers le bon handler
  switch (fsmState) {
    case 'drone_deploying':
      handlers.deploying.process(distance, position);
      break;
    case 'drone_scanning':
      handlers.scanning.process(distance, position);
      break;
    case 'drone_returning':
      handlers.returning.process(distance, position);
      break;
  }
};
