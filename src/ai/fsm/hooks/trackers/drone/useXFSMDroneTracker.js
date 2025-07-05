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

import { useRef, useCallback, useEffect } from 'react';
import { useEventDebounce } from '../../useEventDebounce';
import { POSITION_TRACKER_CONFIG } from '../../../machineX/config/constants';
import { useTileStore } from '../../../../../stores/useTileStore';
import { processDronePosition } from './droneTrackerEngine';
import fsmLogger from '../../../../../logger/fsmLogger';

/**
 * Hook spécialisé pour le tracking des drones (XState)
 * @param {Object} context - Contexte XState/FSM
 * @param {Function} send - Fonction d'envoi d'événements XState/FSM
 * @param {string} botId - ID du bot
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {Function} - Fonction pour mettre à jour les positions depuis R3F
 */
export const useXFSMDroneTracker = (context, send, botId, droneType = 'explorer') => {
  // Références pour la position visuelle et les flags d'initialisation
  const currentVisualPosition = useRef(null);
  const initialPositionSent = useRef(false);

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
  const updateDroneVisualPosition = useCallback((position) => {
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

  return updateDroneVisualPosition;
};

export default useXFSMDroneTracker;
