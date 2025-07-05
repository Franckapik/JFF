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
import { processShipPosition } from './ship/shipTrackerEngine';

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
   * Surveillance de la position du vaisseau avec debounce
   * Délégation complète au moteur de traitement des positions
   */
  const updateShipVisualPosition = useCallback((newPosition) => {
    if (!newPosition) return;

    processShipPosition({
      newPosition,
      lastPosition: lastPosition.current,
      fsmSend,
      botId,
      shipType,
      initialPositionSent,
      canSendEvent,
      markEventSent
    });
    
    lastPosition.current = { ...newPosition };
  }, [fsmSend, botId, shipType, canSendEvent, markEventSent]);

  // Reset lors du changement de botId
  useEffect(() => {
    lastPosition.current = null;
    initialPositionSent.current = false;
  }, [botId]);

  return updateShipVisualPosition;
}
