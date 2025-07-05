/**
 * ==========================================================================
 * DEPLOYING HANDLER - Handler pour l'état drone_deploying
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants';

/**
 * Création d'un handler pour l'état drone_deploying
 * @param {Object} params - Les paramètres nécessaires
 * @returns {Object} - L'objet handler avec les méthodes
 */
export const createDeployingHandler = ({ botId, droneType, send, canSendEvent, markEventSent }) => {
  // Ajouter un compteur pour forcer la transition après un certain temps
  // Ce compteur est spécifique à cette instance du handler
  let deploymentCount = 0;
  let lastCounterReset = Date.now();
  const FORCE_TRANSITION_THRESHOLD = 30; // Réduit à 30 appels au handler sans succès (était 50)
  const COUNTER_RESET_TIMEOUT = 30000; // 30 secondes
  
  // Garder trace de la meilleure distance pour détecter si le drone est bloqué
  let bestDistance = Infinity;

  return {
    /**
     * Traite une position lors de l'état de déploiement
     * @param {number} distance - Distance à la cible
     * @param {Object} position - Position actuelle du drone
     * @returns {boolean} - True si un événement a été envoyé
     */
    process(distance, position) {
      const eventKey = `drone_deploying_reached_${botId}_${droneType}`;
      
      // Mise à jour de la meilleure distance observée
      if (distance < bestDistance) {
        bestDistance = distance;
      }
      
      // Évaluation séparée des conditions pour info
      // Seuil de distance plus généreux pour faciliter la transition
      const isCloseEnough = distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH;
      const canSendEventNow = canSendEvent(eventKey);
      
      // Log détaillé pour comprendre pourquoi l'événement n'est pas envoyé
      if (isCloseEnough && !canSendEventNow) {
        fsmLogger.info(`⏳ [${botId}] Distance OK (${distance.toFixed(2)}) mais cooldown actif pour ${eventKey}`);
      }
      
      // ENHANCED LOGGING: Track potential stuck situations
      if (!isCloseEnough && deploymentCount > 5) {
        fsmLogger.warn(`🚨 [${botId}] Drone potentially stuck in deployment`, {
          distance: distance.toFixed(3),
          threshold: POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH,
          bestDistance: bestDistance.toFixed(3),
          deploymentCount,
          position,
          targetPosition: null // Will be filled by context if available
        });
      }
      
      // Incrémenter le compteur
      deploymentCount++;
      
      // Reset du compteur si ça fait longtemps
      const now = Date.now();
      if (now - lastCounterReset > COUNTER_RESET_TIMEOUT) {
        fsmLogger.info(`🔄 [${botId}] Resetting deployment counter after timeout`, {
          previousCount: deploymentCount,
          timeoutMs: COUNTER_RESET_TIMEOUT
        });
        deploymentCount = 0;
        lastCounterReset = now;
      }
      
      // Si conditions normales sont atteintes
      if (isCloseEnough && canSendEventNow) {
        fsmLogger.mouvement(`🎯 [${botId}] ${droneType} reached target tile for scanning`, {
          position,
          distance,
          threshold: POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH
        });
        
        // Transition vers drone_scanning
        send({
          type: 'DRONE_REACHES_TILE',
          position,
          droneType,
          timestamp: Date.now()
        });
        
        // Reset du compteur après succès
        deploymentCount = 0;
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
        return true;
      } 
      // Solution de secours: forcer la transition si le drone reste coincé trop longtemps
      else if ((deploymentCount >= FORCE_TRANSITION_THRESHOLD || (bestDistance < 1.5 && deploymentCount >= 15)) && canSendEventNow) {
        // Condition élargie: soit on a dépassé le seuil complet, soit on est assez proche et bloqué pendant au moins 15 cycles
        
        // Log détaillé pour expliquer la raison du forçage
        const raison = deploymentCount >= FORCE_TRANSITION_THRESHOLD ? 
          `dépassement du seuil (${deploymentCount}/${FORCE_TRANSITION_THRESHOLD})` : 
          `proximité suffisante (${bestDistance.toFixed(2)}) et bloqué (${deploymentCount}/15)`;
          
        fsmLogger.info(`🚨 [${botId}] FORÇAGE de la transition - ${raison}. Distance actuelle: ${distance.toFixed(2)}`, {
          position,
          distance,
          bestDistance,
          threshold: POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH
        });
        
        // Force la transition même si distance > seuil
        send({
          type: 'DRONE_REACHES_TILE',
          position,
          droneType,
          forcedTransition: true,
          reason: raison,
          timestamp: Date.now()
        });
        
        // Reset du compteur après forçage
        deploymentCount = 0;
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
        return true;
      }
      
      return false;
    }
  };
};

export default createDeployingHandler;
