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
          fsmLogger.info(`🛸 [${botId}] ${droneType} position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`);
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
import { POSITION_TRACKER_CONFIG } from '../../../machineX/config/constants';

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
  const { position, context, droneType, send, botId } = params;
  
  // 1. Créer tous les handlers nécessaires
  const handlers = createAllHandlers(params);
  
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
  
  // Vérifications de sécurité - Utiliser l'état du drone au lieu de l'état global FSM
  if (!drone?.isActive || !drone?.state) {
    return;
  }
  
  const droneState = drone?.state; // Utiliser l'état du drone directement
  
  // 4. Calculer la distance appropriée selon l'état
  let distance = getDistanceForState(droneState, position, drone, context);
  
  if (distance === Infinity) {
    // ENHANCED LOGGING: Log when distance calculation fails
    fsmLogger.info(`⚠️ [${botId}] Distance calculation returned Infinity for state ${droneState}`, {
      droneType,
      droneState,
      position,
      droneData: {
        isActive: drone?.isActive,
        targetPosition: drone?.targetPosition,
        state: drone?.state
      }
    });
    return; // Pas de cible valide
  }
  
  // ENHANCED LOGGING: Log distance calculation results for stuck drone detection
  const now = Date.now();
  if (now % 5000 < 100) { // Log every 5 seconds to avoid spam
    fsmLogger.info(`📍 [${botId}] Drone ${droneType} tracking update`, {
      state: droneState,
      distance: distance.toFixed(3),
      position,
      targetPosition: drone?.targetPosition
    });
  }
  
  // 5. Vérifier à nouveau l'état du drone avant d'appeler le handler (au cas où il aurait changé)
  const currentDroneState = context?.droneFleet?.drones?.[droneType]?.state;
  if (currentDroneState !== droneState) {
    // L'état a changé entre-temps, ne pas traiter
    return;
  }
  
  // 6. Appeler le handler correspondant à l'état actuel
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
  // Accéder une seule fois au tileStore pour éviter des appels multiples
  const tileStore = useTileStore.getState();
  const calculate3DDistance = tileStore.calculate3DDistance;
  
  // Vérification de validité des données
  if (!position) {
    fsmLogger.info(`⚠️ getDistanceForState: Position du drone manquante`);
    return Infinity;
  }
  
  switch (state) {
    case 'drone_deploying':
    case 'drone_scanning': {
      const targetPosition = drone.targetPosition;
      
      // Détection de problèmes de cible
      if (!targetPosition) {
        fsmLogger.info(`⚠️ getDistanceForState (${state}): Pas de targetPosition définie pour le drone`, { droneData: drone });
        return Infinity;
      }
      
      // Vérifier si la cible est à zéro (valeur par défaut potentiellement problématique)
      if (targetPosition.x === 0 && targetPosition.z === 0) {
        fsmLogger.info(`⚠️ getDistanceForState: La target du drone semble être à l'origine (0,0)`, { 
          targetPosition,
          droneState: state
        });
      }
      
      // Calcul des distances sur chaque axe
      const dx = position.x - targetPosition.x;
      const dz = position.z - targetPosition.z;
      
      // Distance 2D (XZ) uniquement - ignorer hauteur Y pour la détection d'arrivée
      // Utilise le théorème de Pythagore au lieu de calculate3DDistance pour avoir le contrôle exact
      const distance2D = Math.sqrt(dx * dx + dz * dz);
      
      return distance2D;
    }
    
    case 'drone_returning': {
      const shipPosition = context?.vehicle?.position || context?.vehicle?.basePosition;
      
      if (!shipPosition) {
        fsmLogger.info(`⚠️ getDistanceForState (${state}): Pas de position de vaisseau définie`);
        return Infinity;
      }
      
      // 🔍 DIAGNOSTIC: Log pour confirmer l'utilisation de la position absolue
      fsmLogger.info(`🔍 [TRACKER-RETURN-DEBUG] FSM Tracker using absolute ship position:`, {
        shipPosition,
        dronePosition: position,
        calculatingDistanceFor: 'drone_returning',
        note: 'Both animation and tracker should use this same position reference'
      });
      
      // CORRECTIF: Vérifier si la position mesh est corrompue (valeurs infinitésimales)
      const isPositionCorrupted = Math.abs(position.x) < 1e-100 || Math.abs(position.z) < 1e-100;
      
      // ENHANCED LOGGING: Log detailed position information for debugging
      if (position.x === 0 && position.z === 0) {
        fsmLogger.info(`🚨 [drone_returning] Drone position is exactly at origin (0,0) - potential issue`, {
          meshPosition: position,
          shipPosition,
          isCorrupted: isPositionCorrupted
        });
      }
      
      // Additional check for NaN or undefined values
      const hasInvalidValues = isNaN(position.x) || isNaN(position.z) || 
                               position.x === undefined || position.z === undefined;
      
      if (hasInvalidValues) {
        fsmLogger.error(`❌ [drone_returning] Invalid position values detected`, {
          meshPosition: position,
          shipPosition,
          hasNaN: isNaN(position.x) || isNaN(position.z),
          hasUndefined: position.x === undefined || position.z === undefined
        });
        return 0.5; // Force transition
      }
      
      if (isPositionCorrupted) {
        // Position mesh corrompue - utiliser une heuristique pour forcer le retour
        fsmLogger.info(`🔧 [drone_returning] Position du mesh corrompue (${position.x}, ${position.z}) - forçage du retour au base`, {
          meshPosition: position,
          shipPosition,
          threshold: '1e-100',
          actualXAbs: Math.abs(position.x),
          actualZAbs: Math.abs(position.z)
        });
        
        // Retourner une distance qui va déclencher la transition (< 1.5)
        return 0.5;
      }
      
      // ENHANCED LOGGING: Log distance calculation details for debugging stuck drones
      const actualDistance = calculate3DDistance(position, shipPosition);
      const distanceThreshold = 1.5; // From POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH or similar
      
      if (actualDistance > 10) {
        fsmLogger.info(`🎯 [drone_returning] Large distance detected - potential stuck drone`, {
          meshPosition: position,
          shipPosition,
          distance: actualDistance,
          threshold: distanceThreshold
        });
      }
      
      return calculate3DDistance(position, shipPosition);
    }
    
    default:
      return Infinity;
  }
}
