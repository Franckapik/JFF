/**
 * ==========================================================================
 * XSTATE SHIP TRACKER - Tracker intégré XState/Fleet pour les vaisseaux
 * ==========================================================================
 *
 * Ce hook sert de pont entre la machine XState et le composant Fleet pour les vaisseaux.
 * Il surveille la position des vaisseaux et envoie des mises à jour de position simplifiées.
 *
 * 🚀 FONCTIONNALITÉS :
 * - Suivi de position pour mise à jour du contexte FSM
 * - Détection des changements de position significatifs
 * - Intégration avec le système de debounce
 */

import { useEffect, useRef, useCallback } from "react";
import { useEventDebounce } from '../useEventDebounce';
import { POSITION_TRACKER_CONFIG } from '../../machine/constants/constants';
import fsmLogger from '../../../../logger/fsmLogger';

/**
 * useXFSMShipTracker
 * Tracker XState adapté pour le vaisseau principal (ship).
 * Surveille la position du ship et déclenche des événements FSM XState selon la logique ship.
 * @param {Object} context - Contexte FSM du bot
 * @param {Function} fsmSend - Fonction pour envoyer des events FSM
 * @param {string} botId - ID du bot
 * @param {string} [shipType='ship'] - Type de ship (par défaut 'ship')
 * @returns {Function} updateShipVisualPosition - Callback pour MAJ la position visuelle
 */
export function useXFSMShipTracker(context, fsmSend, botId, shipType = 'ship') {
  const lastPosition = useRef(null);
  const initialPositionSent = useRef(false);

  // Hook de debounce pour éviter les mises à jour trop fréquentes
  const { canSendEvent, markEventSent } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );

  /**
   * Détection et envoi de la position initiale du vaisseau
   */
  const handleInitialShipPosition = useCallback((position) => {
    if (!initialPositionSent.current && position) {
      fsmLogger.context(`🚢 [${botId}] Setting initial ship position`, {
        position,
        shipType
      });
      
      // Événement de mise à jour de position pour initialiser le vaisseau
      fsmSend({ 
        type: 'SHIP_POSITION_UPDATE', 
        position, 
        botId, 
        shipType,
        timestamp: Date.now()
      });
      
      initialPositionSent.current = true;
      return true;
    }
    return false;
  }, [fsmSend, botId, shipType]);

  /**
   * Surveillance de la position du vaisseau avec debounce
   */
  const updateShipVisualPosition = useCallback((newPosition) => {
    if (!newPosition) return;

    // 1. Gérer la position initiale en priorité
    const initialHandled = handleInitialShipPosition(newPosition);
    
    // 2. Vérifier les changements significatifs de position
    if (!initialHandled && lastPosition.current) {
      const distance = Math.sqrt(
        Math.pow(lastPosition.current.x - newPosition.x, 2) +
        Math.pow(lastPosition.current.y - newPosition.y, 2) +
        Math.pow(lastPosition.current.z - newPosition.z, 2)
      );
      
      // Seulement envoyer des mises à jour pour des mouvements significatifs
      const eventKey = `ship_position_update_${botId}`;
      if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.MIN_MOVEMENT && canSendEvent(eventKey)) {
        fsmLogger.mouvement(`🚢 [${botId}] Ship position updated - distance moved: ${distance.toFixed(2)}`);
        
        fsmSend({ 
          type: 'SHIP_POSITION_UPDATE', 
          position: newPosition, 
          botId, 
          shipType,
          distance,
          timestamp: Date.now()
        });
        
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.MOVEMENT_RESET);
      }
    }
    
    lastPosition.current = { ...newPosition };
  }, [handleInitialShipPosition, fsmSend, botId, shipType, canSendEvent, markEventSent]);

  // Reset lors du changement de botId
  useEffect(() => {
    lastPosition.current = null;
    initialPositionSent.current = false;
  }, [botId]);

  return updateShipVisualPosition;
}
