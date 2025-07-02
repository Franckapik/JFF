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

import { useRef, useCallback, useEffect, useMemo } from 'react';
import { useEventDebounce } from '../useEventDebounce';
import { POSITION_TRACKER_CONFIG } from '../../../../src/ai/fsm/machine/constants/constants';
import { useTileStore } from '../../../../stores/useTileStore';
import fsmLogger from '../../../../logger/fsmLogger';

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
   * Détection et envoi de la position initiale du drone à la machine XState
   */
  const handleInitialDronePosition = useCallback((visualPosition) => {
    if (!initialPositionSent.current && visualPosition) {
      const drone = context?.droneFleet?.drones?.[droneType];
      
      // Seulement pour les drones actifs qui n'ont pas encore de position
      if (drone?.isActive && !drone?.position) {
        fsmLogger.context(`🛸 [${botId}] Setting initial ${droneType} drone position`, {
          position: visualPosition,
          droneState: drone.state,
          droneActive: drone.isActive
        });
        
        // Événement de mise à jour de position pour initialiser le drone
        send({
          type: 'DRONE_POSITION_UPDATE',
          position: visualPosition,
          droneType,
          timestamp: Date.now()
        });
        
        initialPositionSent.current = true;
        return true;
      }
    }
    return false;
  }, [send, droneType, botId, context?.droneFleet?.drones?.[droneType]]);

  /**
   * Handlers spécialisés par état du cycle d'exploration XState
   */
  const droneStateHandlers = useMemo(() => ({
    // État drone_deploying : Drone se déplace vers la cible
    deploying: {
      onTargetReached: (distance, visualPosition) => {
        const eventKey = `drone_deploying_reached_${botId}_${droneType}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🎯 [${botId}] ${droneType} reached target tile for scanning`);
          
          // Transition vers drone_scanning
          send({
            type: 'DRONE_REACHES_TILE',
            position: visualPosition,
            droneType,
            timestamp: Date.now()
          });
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
          return true;
        }
        return false;
      }
    },
    
    // État drone_scanning : Drone explore la tuile
    exploring: {
      onScanComplete: (distance, visualPosition) => {
        const eventKey = `drone_scanning_complete_${botId}_${droneType}`;
        
        // Simuler le temps de scan (2 secondes après avoir atteint la cible)
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          
          // Délai pour simuler le scan de la tuile
          setTimeout(() => {
            fsmLogger.mouvement(`🔍 [${botId}] ${droneType} completed tile scanning`);
            
            // Marquer la tuile comme explorée et découvrir les ressources
            try {
              const gridCoord = worldToGrid(visualPosition);
              const tileCoord = gridToHexCoord(gridCoord);
              
              const { markTileAsExplored, getTile } = useTileStore.getState();
              markTileAsExplored(tileCoord);
              
              // Récupérer les vraies ressources de la tuile
              const tile = getTile(tileCoord);
              const resourcesFound = tile?.resources ? {
                food: tile.resources.food || 0,
                debris: tile.resources.debris || 0,
                special: tile.resources.special || 0
              } : { food: 0, debris: 0, special: 0 };
              
              fsmLogger.resources(`💎 [${botId}] ${droneType} discovered resources:`, resourcesFound);
              
              // Transition vers drone_returning
              send({
                type: 'DRONE_SCANS_TILE',
                position: visualPosition,
                coord: tileCoord,
                resources: resourcesFound,
                droneType,
                hasResources: Object.values(resourcesFound).some(val => val > 0),
                timestamp: Date.now()
              });
              
            } catch (error) {
              fsmLogger.error(`❌ [${botId}] Failed to scan tile: ${error.message}`);
            }
          }, 2000); // 2 secondes de scan
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
          return true;
        }
        return false;
      }
    },
    
    // État drone_returning : Drone retourne au vaisseau
    returning: {
      onReachedBase: (distance, visualPosition) => {
        const eventKey = `drone_returning_base_${botId}_${droneType}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🏠 [${botId}] ${droneType} reached base - docking complete`);
          
          // Transition vers evaluating (retour à l'état parent)
          send({
            type: 'DRONE_REACHES_BASE',
            position: visualPosition,
            droneType,
            timestamp: Date.now()
          });
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.RETURN_RESET);
          return true;
        }
        return false;
      }
    }
  }), [botId, droneType, send, canSendEvent, markEventSent, gridToHexCoord, worldToGrid]);

  /**
   * Logique principale de tracking selon l'état XState du drone
   */
  const checkDroneStateAndSendEvents = useCallback((visualPosition) => {
    if (!send || !context?.value || !visualPosition) return;
    
    const drone = context?.droneFleet?.drones?.[droneType];
    if (!drone?.isActive) return;
    
    const currentState = context.value;
    const targetPosition = drone.targetPosition;
    
    // Si le bot n'est pas en état exploring, pas de tracking
    if (!currentState.exploring) return;
    
    const droneState = currentState.exploring; // 'drone_deploying', 'drone_scanning', 'drone_returning'
    
    // Calculer la distance selon l'état
    let distance = 0;
    
    if (droneState === 'drone_deploying' || droneState === 'drone_scanning') {
      // Distance vers la cible d'exploration
      if (targetPosition) {
        distance = Math.sqrt(
          Math.pow(targetPosition.x - visualPosition.x, 2) +
          Math.pow(targetPosition.y - visualPosition.y, 2) +
          Math.pow(targetPosition.z - visualPosition.z, 2)
        );
      }
    } else if (droneState === 'drone_returning') {
      // Distance vers le vaisseau (position de base)
      const shipPosition = context?.vehicle?.position || context?.vehicle?.basePosition;
      if (shipPosition) {
        distance = Math.sqrt(
          Math.pow(shipPosition.x - visualPosition.x, 2) +
          Math.pow(shipPosition.y - visualPosition.y, 2) +
          Math.pow(shipPosition.z - visualPosition.z, 2)
        );
      }
    }
    
    // Utiliser les handlers appropriés selon l'état
    if (droneState === 'drone_deploying') {
      const handler = droneStateHandlers.deploying;
      handler?.onTargetReached?.(distance, visualPosition);
    } else if (droneState === 'drone_scanning') {
      const handler = droneStateHandlers.exploring;
      handler?.onScanComplete?.(distance, visualPosition);
    } else if (droneState === 'drone_returning') {
      const handler = droneStateHandlers.returning;
      handler?.onReachedBase?.(distance, visualPosition);
    }
    
  }, [context, send, droneType, droneStateHandlers]);

  /**
   * Logique XState : envoi d'événements selon l'état courant de la machine
   */
  const handleDroneState = useCallback((visualPosition) => {
    const drone = context?.droneFleet?.drones?.[droneType];
    
    // Seulement si le drone est actif et que le bot est en état exploring
    if (drone?.isActive && context?.value?.exploring) {
      checkDroneStateAndSendEvents(visualPosition);
    }
  }, [context, droneType, checkDroneStateAndSendEvents]);

  /**
   * Fonction pour que Fleet.jsx envoie les positions du drone
   */
  const updateDroneVisualPosition = useCallback((position) => {
    currentVisualPosition.current = position;
    
    if (position) {
      // 1. Gérer la position initiale du drone en premier
      const initialHandled = handleInitialDronePosition(position);
      
      // 2. Gérer la logique XState selon l'état (seulement si pas d'initialisation)
      if (!initialHandled) {
        handleDroneState(position);
      }
    }
  }, [handleInitialDronePosition, handleDroneState]);

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
