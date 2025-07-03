/**
 * ==========================================================================
 * DRONE TRACKER ENGIN      // Vérifier quand le dernier log a été fait pour ce drone
      const now = Date.now();
      const lastLogTime = lastLogTimes.get(droneKey) || 0;
      const timeSinceLastLog = now - lastLogTime;
      
      // Log uniquement à l'initialisation ou si conditions réunies
      if (isFirstPosition) {
        // Toujours logger la position initiale
        fsmLogger.context(`🛸 [${botId}] Initial ${droneType} position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
        lastLogTimes.set(droneKey, now);
      } else {
        // Conditions pour logger : 
        // 1. Changement significatif (> 0.5 unités)
        // 2. ET dernier log il y a plus de X secondes
        const significantMovement = hasSignificantChange(position, lastPosition, 0.5);
        const logThrottleReady = timeSinceLastLog > LOG_THROTTLE_MS;
        
        if (significantMovement && logThrottleReady) {
          fsmLogger.debug(`🛸 [${botId}] ${droneType} position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
          lastLogTimes.set(droneKey, now);
        }
      } de traitement des positions de drones
 * ==========================================================================
 */

import {
  createInitializationHandler,
  createDeployingHandler,
  createScanningHandler,
  createReturningHandler
} from './handlers';
import { useTileStore } from '../../../../../stores/useTileStore';
import fsmLogger from '../../../../../logger/fsmLogger';

// Maps pour stocker les données de traçage
const lastReportedPositions = new Map(); // Dernière position signalée par drone
const lastLogTimes = new Map(); // Horodatage du dernier log par drone

// Constante pour limiter la fréquence des logs (en millisecondes)
const LOG_THROTTLE_MS = 2000; // Maximum un log toutes les 2 secondes

/**
 * Vérifie si la position a suffisamment changé pour être rapportée
 * @param {Object} newPos - Nouvelle position
 * @param {Object} lastPos - Dernière position rapportée
 * @param {number} threshold - Seuil de distance pour considérer un changement significatif
 * @returns {boolean} - Vrai si le changement est significatif
 */
const hasSignificantChange = (newPos, lastPos, threshold = 0.1) => {
  if (!lastPos) return true;
  
  const distance = useTileStore.getState().calculate3DDistance(newPos, lastPos);
  return distance > threshold;
};

/**
 * Crée tous les handlers nécessaires
 * @param {Object} params - Les paramètres pour créer les handlers
 * @returns {Object} - Les handlers créés
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
 * Traitement principal des positions du drone
 * Ce moteur coordonne les différents handlers selon l'état
 */
export const processDronePosition = (params) => {
  // 1. Créer tous les handlers nécessaires
  const handlers = createAllHandlers(params);
  const { position, context, droneType, send, botId } = params;
  
  // Clé unique pour identifier ce drone
  const droneKey = `${botId}-${droneType}`;
  
  // 2. Gestion centralisée de la mise à jour de position
  if (position) {
    const isFirstPosition = !lastReportedPositions.has(droneKey);
    const lastPosition = lastReportedPositions.get(droneKey);
    
    // Vérifier si c'est la première position ou si la position a suffisamment changé
    const shouldUpdate = isFirstPosition || hasSignificantChange(position, lastPosition);
    
    if (shouldUpdate) {
      // Envoyer l'événement de mise à jour de position (centralisé ici)
      send({
        type: 'DRONE_POSITION_UPDATE',
        position,
        droneType,
        timestamp: Date.now(),
        isInitial: isFirstPosition
      });
      
      // Enregistrer cette position comme dernière position rapportée
      lastReportedPositions.set(droneKey, {...position});
      
      // Log uniquement à l'initialisation ou si changement significatif > 0.5
      if (isFirstPosition) {
        fsmLogger.context(`🛸 [${botId}] Initial ${droneType} position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
      } else {
        // Pour les mises à jour normales, réduire fortement la fréquence des logs
        const significantMovement = hasSignificantChange(position, lastPosition, 0.5); // Seuil plus élevé pour les logs
        if (significantMovement) {
          fsmLogger.context(`🛸 [${botId}] ${droneType} position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
        }
      }
    }
  }
  
  // 3. Essayer le handler d'initialisation
  const wasInitialized = handlers.init.handleInitialPosition(position);
  
  // 3. Si l'initialisation est déjà faite, passer aux handlers d'état
  const drone = context?.droneFleet?.drones?.[droneType];
  const currentState = context?.value;
  
  // Vérifications de sécurité
  if (!drone?.isActive || !currentState?.exploring) return;
  
  const droneState = currentState.exploring;
  
  // 4. Calculer la distance appropriée selon l'état
  let distance = getDistanceForState(droneState, position, drone, context);
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
 * Calcule la distance appropriée selon l'état du drone
 * @private
 */
function getDistanceForState(state, position, drone, context) {
  switch (state) {
    case 'drone_deploying':
    case 'drone_scanning': {
      const targetPosition = drone.targetPosition;
      return targetPosition 
        ? useTileStore.getState().calculate3DDistance(position, targetPosition) 
        : Infinity;
    }
    
    case 'drone_returning': {
      const shipPosition = context?.vehicle?.position || context?.vehicle?.basePosition;
      return shipPosition 
        ? useTileStore.getState().calculate3DDistance(position, shipPosition) 
        : Infinity;
    }
    
    default:
      return Infinity;
  }
}
