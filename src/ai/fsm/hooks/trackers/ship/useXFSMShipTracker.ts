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

import { useCallback, useEffect, useRef } from "react";

import type { ShipType, XStateSend } from '../../../../../types';
import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import { POSITION_TRACKER_CONFIG } from '../../../machineX/config/constants.ts';
import { useEventDebounce } from '../../useEventDebounce';

import { processShipPosition } from './shipTrackerEngine';

/**
 * useXFSMShipTracker
 * Tracker XState adapté pour le vaisseau principal (ship).
 * Surveille la position du ship et déclenche des événements FSM XState selon la logique ship.
 * @param context - Contexte FSM du bot
 * @param fsmSend - Fonction pour envoyer des events FSM
 * @param botId - ID du bot
 * @param shipType - Type de ship (par défaut 'ship')
 * @returns updateShipVisualPosition - Callback pour MAJ la position visuelle
 */
export function useXFSMShipTracker(
  context: FSMContext, 
  fsmSend: XStateSend, 
  botId: string, 
  shipType: ShipType = 'ship'
) {
  const lastPosition = useRef<WorldPosition | null>(null);
  const initialPositionSent = useRef<boolean>(false);

  // Hook de debounce pour éviter les mises à jour trop fréquentes
  const { canSendEvent, markEventSent } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );

  /**
   * Surveillance de la position du vaisseau avec debounce
   * Délégation complète au moteur de traitement des positions
   */
  const updateShipVisualPosition = useCallback((newPosition: WorldPosition) => {
    if (!newPosition) return;

    processShipPosition({
      position: newPosition,
      context,
      send: fsmSend,
      botId,
      shipType,
      lastPosition: lastPosition.current,
      initialPositionSent,
      canSendEvent,
      markEventSent
    });
    
    lastPosition.current = { ...newPosition };
  }, [fsmSend, botId, shipType, canSendEvent, markEventSent, context]);

  // Reset lors du changement de botId
  useEffect(() => {
    lastPosition.current = null;
    initialPositionSent.current = false;
  }, [botId]);

  return updateShipVisualPosition;
}
