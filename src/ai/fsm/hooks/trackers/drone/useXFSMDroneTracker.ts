/**
 * ==========================================================================
 * XSTATE DRONE TRACKER - Tracker intégré XState/Fleet
 * ==========================================================================
 *
 * Ce hook sert de pont entre la machine XState et le composant Fleet (react-three-fiber).
 * Il reçoit les positions visuelles des drones et déclenche les événements XState appropriés
 * selon le cycle d'exploration : deploying → scanning → returning → evaluating.
 *
 * 🎯 CYCLE D'EXPLORATION XSTATE :
 * - deploying : Drone se déplace vers la cible → DRONE_REACHES_TILE
 * - scanning : Drone explore la tuile → DRONE_SCANS_TILE  
 * - returning : Drone retourne au vaisseau → DRONE_REACHES_BASE
 */

import { useCallback, useEffect, useRef } from 'react';

import { useTileStore } from '../../../../../stores/useTileStore/index';
import type { DroneType, XStateSend } from '../../../../../types';
import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import { POSITION_TRACKER_CONFIG } from '../../../machineX/config/constants.ts';
import { useEventDebounce } from '../../useEventDebounce';

import { processDronePosition } from './droneTrackerEngine';

/**
 * Hook spécialisé pour le tracking des drones (XState)
 * @param context - Contexte XState/FSM
 * @param send - Fonction d'envoi d'événements XState/FSM
 * @param botId - ID du bot
 * @param droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns Fonction pour mettre à jour les positions depuis R3F
 */
export const useXFSMDroneTracker = (
  context: FSMContext, 
  send: XStateSend, 
  botId: string, 
  droneType: DroneType = 'explorer'
) => {
  // Références pour la position visuelle et les flags d'initialisation
  const currentVisualPosition = useRef<WorldPosition | null>(null);
  const initialPositionSent = useRef<boolean>(false);

  // Hook de debounce personnalisé pour éviter les événements en rafale
  const { canSendEvent, markEventSent, clearAllEvents } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );
  
  // Accès au store des tuiles pour la conversion de coordonnées
  const { gridToHexCoord, worldToGrid } = useTileStore();

  /**
   * Fonction pour que Fleet.jsx envoie les positions du drone
   * Délégation complète au moteur de traitement des positions
   */
  const dronePositionToTracker = useCallback((position: WorldPosition) => {
    if (!position) return;
    
    currentVisualPosition.current = position;
    
    // Gestion de l'initialisation sans log spécifique
    // La position initiale sera loguée par processDronePosition si nécessaire
    
    // Toujours traiter la position via le moteur principal
    processDronePosition({
      position,
      context,
      send,
      botId,
      droneType,
      initialPositionSent,
      canSendEvent,
      markEventSent,
      gridToHexCoord,
      worldToGrid,
      useTileStore
    });
  }, [context, send, botId, droneType, canSendEvent, markEventSent, gridToHexCoord, worldToGrid]);

  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      clearAllEvents();
      currentVisualPosition.current = null;
      initialPositionSent.current = false;
    };
  }, [clearAllEvents]);

  return dronePositionToTracker;
};

export default useXFSMDroneTracker;
