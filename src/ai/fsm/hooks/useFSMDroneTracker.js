/**
 * ============================================================================
 * FSM DRONE TRACKER - Spécialisé pour les drones
 * ============================================================================
 * 
 * Hook spécialisé pour le tracking des drones et leurs événements FSM.
 * Refactorisé depuis useFSMPositionTracker pour une séparation claire.
 * 
 * 📡 ÉVÉNEMENTS FSM ENVOYÉS DEPUIS CE HOOK:
 * ==========================================
 * 
 * 🛸 INITIALISATION:
 * - movementEvents.createDronePositionUpdateEvent() → 'DRONE_POSITION_UPDATE'
 * 
 * 🚀 DÉPLOIEMENT (deploying):
 * - movementEvents.createDroneDeployedEvent() → 'DRONE_DEPLOYED'
 * - movementEvents.createDroneReachedTargetEvent() → 'DRONE_REACHED_TARGET'
 * 
 * 🔍 PROSPECTION (prospecting):
 * - movementEvents.createProspectingCompleteEvent() → 'PROSPECTING_COMPLETE'
 * 
 * 🏠 RETOUR (returning):
 * - movementEvents.createDroneReturnedEvent() → 'DRONE_RETURNED'
 * 
 * 🎯 EXPLORATION (tous états):
 * - Marquage automatique des tuiles comme explorées/prospectées via useTileStore
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MOVEMENT_EVENT_TYPES } from '../machine/events/movementEvents.js';
import { POSITION_TRACKER_CONFIG } from '../machine/constants/constants.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import { useEventDebounce } from './useEventDebounce.js';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook spécialisé pour le tracking des drones
 * @param {Object} context - Contexte FSM
 * @param {Function} send - Fonction d'envoi d'événements FSM
 * @param {string} botId - ID du bot  
 * @param {string} droneType - Type de drone ('explorer', 'combat', 'special')
 * @returns {Function} - Fonction pour mettre à jour les positions depuis R3F
 */
export const useFSMDroneTracker = (context, send, botId, droneType = 'explorer') => {
  const currentVisualPosition = useRef(null);
  const initialPositionSent = useRef(false); // 🆕 Flag pour éviter les envois multiples de position initiale
  
  // Hook de debounce personnalisé
  const { canSendEvent, markEventSent, clearAllEvents } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );
  
  // Access to tile store for coordinate conversion
  const { gridToHexCoord, worldToGrid } = useTileStore();
  
  /**
   * 🆕 Fonction pour gérer la position initiale du drone
   * Les drones ancrés héritent de la position du vaisseau automatiquement
   */
  const handleDroneInitialPosition = useCallback((visualPosition) => {
    const drone = context?.droneFleet?.drones?.[droneType];
    
    // Seulement pour les drones actifs qui n'ont pas encore de position
    if (!initialPositionSent.current && 
        visualPosition && 
        drone?.isActive && 
        !drone?.position) {
      
      fsmLogger.context(`🛸 [${botId}] Setting initial ${droneType} drone position`, {
        position: visualPosition,
        droneState: drone.state,
        droneActive: drone.isActive
      });
      
      // ✅ CORRECTION: Utiliser l'événement simple qui existe
      const dronePositionEvent = {
        type: 'DRONE_POSITION_UPDATE',
        position: visualPosition,
        droneType,
        state: drone.state,
        timestamp: Date.now()
      };
      send(dronePositionEvent);
      
      fsmLogger.context(`✅ [${botId}] Initial ${droneType} drone position sent to FSM`, {
        eventType: dronePositionEvent.type,
        droneType,
        droneState: drone.state
      });
      
      initialPositionSent.current = true;
      
      return true;
    }
    
    return false;
  }, [context?.droneFleet?.drones?.[droneType], send, botId, droneType]);

  /**
   * Handlers spécialisés pour les drones par état
   */
  const droneStateHandlers = useMemo(() => ({
    deploying: {
      onMovementStart: (distance, visualPosition, now) => {
        const eventKey = `drone_deploying_start_${botId}_${droneType}`;
        if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.DEPLOYMENT_START && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🚀 [${botId}] ${droneType} drone deployed - distance: ${distance.toFixed(2)}`);
          
          // ✅ CORRECTION: Utiliser un événement simple
          const droneDeployedEvent = {
            type: 'DRONE_DEPLOYED',
            targetArea: 'auto',
            range: 5,
            droneType,
            position: visualPosition,
            timestamp: Date.now()
          };
          send(droneDeployedEvent);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.DEPLOYMENT_RESET);
          return true;
        }
        return false;
      },
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `drone_deploying_reached_${botId}_${droneType}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🔍 [${botId}] ${droneType} target reached - distance: ${distance.toFixed(2)}`);
          
          // Logique de marquage des tuiles
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          try {
            const { markTileAsExplored } = useTileStore.getState();
            markTileAsExplored(tileCoord);
            fsmLogger.mouvement(`✅ [${botId}] Tile explored by ${droneType}: ${JSON.stringify(tileCoord)}`);
          } catch (error) {
            console.error(`❌ [${botId}] Failed to mark tile: ${error.message}`);
          }
          
          // ✅ CORRECTION: Utiliser l'événement simple qui existe
          const droneReachedEvent = {
            type: 'DRONE_REACHED_TARGET',
            position: visualPosition,
            tileCoord,
            droneType,
            timestamp: Date.now()
          };
          send(droneReachedEvent);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
          return true;
        }
        return false;
      }
    },
    prospecting: {
      onProspectingStart: (distance, visualPosition, now) => {
        const eventKey = `drone_prospecting_start_${botId}_${droneType}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🔍 [${botId}] ${droneType} starting prospecting phase`);
          
          // Capturer les valeurs pour éviter les problèmes de closure
          const capturedPosition = { ...visualPosition };
          const capturedGridCoord = worldToGrid(visualPosition);
          const capturedTileCoord = gridToHexCoord(capturedGridCoord);
          
          // Timer pour la prospection
          setTimeout(() => {
            const prospectingEventKey = `drone_prospecting_complete_${botId}_${droneType}`;
            if (canSendEvent(prospectingEventKey)) {
              fsmLogger.mouvement(`💎 [${botId}] ${droneType} prospecting completed`);
              
              try {
                const { markTileAsProspected } = useTileStore.getState();
                
                // Simuler la découverte de ressources
                const resourcesFound = {
                  food: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
                  debris: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0,
                  special: Math.random() > 0.9 ? 1 : 0
                };
                
                markTileAsProspected(capturedTileCoord, resourcesFound);
                fsmLogger.mouvement(`🔍 [${botId}] ${droneType} prospecting results: ${JSON.stringify(resourcesFound)}`);
                
                // ✅ CORRECTION: Utiliser l'événement simple qui existe
                const prospectingCompleteEvent = {
                  type: 'PROSPECTING_COMPLETE',
                  position: capturedPosition,
                  tileCoord: capturedTileCoord,
                  resourcesFound,
                  droneType,
                  timestamp: Date.now()
                };
                send(prospectingCompleteEvent);
                
                markEventSent(prospectingEventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
              } catch (error) {
                console.error(`❌ [${botId}] Failed to complete ${droneType} prospecting: ${error.message}`);
              }
            }
          }, POSITION_TRACKER_CONFIG.TIMINGS.PROSPECTING_DURATION || 3000);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
          return true;
        }
        return false;
      }
    },
    returning: {
      onApproachingShip: (distance, visualPosition, now) => {
        // Utiliser la constante définie pour l'approche du vaisseau
        const eventKey = `drone_returning_approaching_${botId}_${droneType}`;
        
        // On vérifie si le drone est dans la zone d'approche (entre TARGET_REACH et DRONE_APPROACHING_SHIP)
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.DRONE_APPROACHING_SHIP && 
            distance > POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && 
            canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🏠 [${botId}] ${droneType} drone approaching ship - distance: ${distance.toFixed(2)}`);
          
          fsmLogger.context(`🔍 [DEBUG] Sending DRONE_RETURNED event with isApproaching=true`, {
            botId,
            droneType,
            hookInstanceId: `${botId}-${droneType}`,
            eventKey,
            distance
          });
          
          // Envoyer événement DRONE_RETURNED pour passer à l'état evaluating
          const droneApproachingEvent = {
            type: 'DRONE_RETURNED',
            position: visualPosition,
            droneType,
            timestamp: Date.now(),
            isApproaching: true // Indicateur supplémentaire pour le guard
          };
          send(droneApproachingEvent);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.RETURN_RESET);
          return true;
        }
        return false;
      },
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `drone_returning_reached_${botId}_${droneType}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🏠 [${botId}] ${droneType} drone returned - distance: ${distance.toFixed(2)}`);
          
          // ✅ CORRECTION: Utiliser l'événement simple qui existe
          const droneReturnedEvent = {
            type: 'DRONE_RETURNED',
            position: visualPosition,
            droneType,
            timestamp: Date.now()
          };
          send(droneReturnedEvent);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.RETURN_RESET);
          return true;
        }
        return false;
      }
    }
  }), [botId, droneType, send, gridToHexCoord, worldToGrid, canSendEvent, markEventSent]);

  /**
   * Logique principale de surveillance spécialisée pour les drones
   */
  const checkDronePositionAndSendEvents = useCallback((visualPosition) => {
    if (!send || !context?.droneFleet?.drones?.[droneType]) return;
    
    const drone = context.droneFleet.drones[droneType];
    const droneState = drone.state;
    const targetPosition = drone.targetPosition;
    
    if (!visualPosition || !targetPosition || !drone.isActive) {
      return;
    }
    
    // Calculer la distance entre position visuelle et cible FSM
    const distance = Math.sqrt(
      Math.pow(targetPosition.x - visualPosition.x, 2) +
      Math.pow(targetPosition.y - visualPosition.y, 2) +
      Math.pow(targetPosition.z - visualPosition.z, 2)
    );
    
    const now = Date.now();
    
    // Utiliser les handlers spécialisés par état
    const handler = droneStateHandlers[droneState];
    if (handler) {
      let eventSent = false;
      
      if (handler.onMovementStart) {
        eventSent = handler.onMovementStart(distance, visualPosition, now);
      }
      
      // Vérifier si le drone est en approche du vaisseau (pour le retour)
      if (!eventSent && handler.onApproachingShip) {
        eventSent = handler.onApproachingShip(distance, visualPosition, now);
      }
      
      if (!eventSent && handler.onTargetReached) {
        eventSent = handler.onTargetReached(distance, visualPosition, now);
      }
      
      if (!eventSent && handler.onProspectingStart) {
        eventSent = handler.onProspectingStart(distance, visualPosition, now);
      }
    }
    
    // Nettoyer les flags si la distance augmente
    if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.RESET_MOVEMENT) {
      clearAllEvents();
    }
    
  }, [context?.droneFleet?.drones?.[droneType], send, botId, droneType, droneStateHandlers]);

  /**
   * Fonction pour que Fleet.jsx envoie les positions du drone
   */
  const updateDroneVisualPosition = useCallback((position) => {
    currentVisualPosition.current = position;
    
    if (position) {
      // 🆕 PRIORITÉ 1: Gérer la position initiale du drone en premier
      const initialPositionHandled = handleDroneInitialPosition(position);
      
      // 🆕 PRIORITÉ 2: Faire le tracking dès que le drone est actif
      const currentDrone = context?.droneFleet?.drones?.[droneType];
      const shouldTrack = currentDrone?.isActive || (initialPositionSent.current && !initialPositionHandled);
      
      if (shouldTrack) {
        checkDronePositionAndSendEvents(position);
      }
    }
  }, [handleDroneInitialPosition, checkDronePositionAndSendEvents, context?.droneFleet?.drones?.[droneType], botId, droneType]);
  
  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      clearAllEvents();
      currentVisualPosition.current = null;
      initialPositionSent.current = false; // 🆕 Reset du flag lors du cleanup
    };
  }, [clearAllEvents]);
  
  return updateDroneVisualPosition;
};

export default useFSMDroneTracker;
