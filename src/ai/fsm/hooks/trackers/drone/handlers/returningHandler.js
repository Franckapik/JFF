/**
 * ==========================================================================
 * RETURNING HANDLER - Handler pour l'état drone_returning
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants';

/**
 * Création d'un handler pour l'état drone_returning
 * @param {Object} params - Les paramètres nécessaires
 * @returns {Object} - L'objet handler avec les méthodes
 */
export const createReturningHandler = ({ botId, droneType, send, canSendEvent, markEventSent }) => {
  // Ajouter un compteur pour forcer la transition après un certain temps
  let returnCount = 0;
  let lastCounterReset = Date.now();
  const FORCE_TRANSITION_THRESHOLD = 30; // Forcer après 30 appels sans succès
  const COUNTER_RESET_TIMEOUT = 30000; // 30 secondes
  
  // Garder trace de la meilleure distance pour détecter si le drone est bloqué
  let bestDistance = Infinity;

  return {
    /**
     * Traite une position lors de l'état de retour
     * @param {number} distance - Distance à la base
     * @param {Object} position - Position actuelle du drone
     * @returns {boolean} - True si un événement a été envoyé
     */
    process(distance, position) {
      const eventKey = `drone_returning_base_${botId}_${droneType}`;
      
      // Mise à jour de la meilleure distance observée
      if (distance < bestDistance) {
        bestDistance = distance;
      }
      
      // Évaluation des conditions
      const isCloseEnough = distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH;
      const canSendEventNow = canSendEvent(eventKey);
      
      // Log détaillé pour comprendre pourquoi l'événement n'est pas envoyé
      if (isCloseEnough && !canSendEventNow) {
        fsmLogger.info(`⏳ [${botId}] Distance OK (${distance.toFixed(2)}) mais cooldown actif pour ${eventKey}`);
      }
      
      // Incrémenter le compteur
      returnCount++;
      
      // Reset du compteur si ça fait longtemps
      const now = Date.now();
      if (now - lastCounterReset > COUNTER_RESET_TIMEOUT) {
        returnCount = 0;
        lastCounterReset = now;
      }
      
      // Si conditions normales sont atteintes
      if (isCloseEnough && canSendEventNow) {
        fsmLogger.mouvement(`🏠 [${botId}] ${droneType} reached base - docking complete`, {
          position,
          distance,
          threshold: POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH
        });
        
        // Transition vers evaluating (retour à l'état parent)
        send({
          type: 'DRONE_REACHES_BASE',
          position,
          droneType,
          timestamp: Date.now()
        });
        
        // Reset du compteur après succès
        returnCount = 0;
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.RETURN_RESET);
        return true;
      } 
      // Solution de secours: forcer la transition si le drone reste coincé trop longtemps
      else if ((returnCount >= FORCE_TRANSITION_THRESHOLD || (bestDistance < 1.5 && returnCount >= 15)) && canSendEventNow) {
        const raison = returnCount >= FORCE_TRANSITION_THRESHOLD ? 
          `dépassement du seuil (${returnCount}/${FORCE_TRANSITION_THRESHOLD})` : 
          `proximité suffisante (${bestDistance.toFixed(2)}) et bloqué (${returnCount}/15)`;
          
        fsmLogger.info(`🚨 [${botId}] FORÇAGE du retour - ${raison}. Distance actuelle: ${distance.toFixed(2)}`, {
          position,
          distance,
          bestDistance,
          threshold: POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH
        });
        
        // Force la transition même si distance > seuil
        send({
          type: 'DRONE_REACHES_BASE',
          position,
          droneType,
          forcedTransition: true,
          reason: raison,
          timestamp: Date.now()
        });
        
        // Reset du compteur après forçage
        returnCount = 0;
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.RETURN_RESET);
        return true;
      }
      
      return false;
    }
  };
};

export default createReturningHandler;
