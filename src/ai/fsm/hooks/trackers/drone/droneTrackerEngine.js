/**
 * ==========================================================================
 * DRONE TRACKER ENGINE - Moteur de traitement des positions de drones
 * ==========================================================================
 */

import {
  createInitializationHandler,
  createDeployingHandler,
  createScanningHandler,
  createReturningHandler
} from './handlers';
import { useTileStore } from '../../../../../stores/useTileStore';

/**
 * Traitement principal des positions du drone
 * Ce moteur coordonne les différents handlers selon l'état
 */
export const processDronePosition = (params) => {
  // 1. Récupérer tous les paramètres et créer les handlers
  const handlers = createAllHandlers(params);
  const { position, context, droneType } = params;
  
  // 2. Essayer d'abord le handler d'initialisation
  const wasInitialized = handlers.init.handleInitialPosition(position);
  if (wasInitialized) return;
  
  // 3. Si l'initialisation est déjà faite, passer aux handlers d'état
  const drone = context?.droneFleet?.drones?.[droneType];
  const currentState = context?.value;
  
  // Vérifications de sécurité
  if (!drone?.isActive || !currentState?.exploring) return;
  
  const droneState = currentState.exploring;
  
  // 4. Calculer la distance appropriée selon l'état
  const distance = getDistanceForState(droneState, position, drone, context);
  if (distance === Infinity) return; // Pas de cible valide
  
  // 5. Appeler le handler correspondant à l'état actuel
  switch (droneState) {
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

/**
 * Crée tous les handlers nécessaires
 */
const createAllHandlers = (params) => {
  const {
    context,
    send,
    botId,
    droneType,
    initialPositionSent,
    canSendEvent,
    markEventSent,
    gridToHexCoord,
    worldToGrid
  } = params;
  
  return {
    init: createInitializationHandler({ 
      context, send, botId, droneType, initialPositionSent 
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
 * Calcule la distance appropriée selon l'état du drone
 */
const getDistanceForState = (state, position, drone, context) => {
  // Utilise calculate3DDistance depuis le TileStore
  const calculate3DDistance = useTileStore.getState().calculate3DDistance;
  
  switch (state) {
    case 'drone_deploying':
    case 'drone_scanning': {
      const targetPosition = drone.targetPosition;
      return targetPosition ? calculate3DDistance(position, targetPosition) : Infinity;
    }
    
    case 'drone_returning': {
      const shipPosition = context?.vehicle?.position || context?.vehicle?.basePosition;
      return shipPosition ? calculate3DDistance(position, shipPosition) : Infinity;
    }
    
    default:
      return Infinity;
  }
};
