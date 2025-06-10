/**
 * ============================================================================
 * FSM DRONE TRACKER - Spécialisé pour les drones
 * ============================================================================
 * 
 * Hook spécialisé pour le tracking des drones et leurs événements FSM.
 * Refactorisé depuis useFSMPositionTracker pour une séparation claire.
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MOVEMENT_EVENT_TYPES, movementEvents } from '../machine/events/movementEvents.js';
import { POSITION_TRACKER_CONFIG } from '../machine/constants/constants.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import { useEventDebounce } from './useEventDebounce.js';

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
  
  // Hook de debounce personnalisé
  const { canSendEvent, markEventSent, clearAllEvents } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );
  
  // Access to tile store for coordinate conversion
  const { gridToHexCoord, worldToGrid } = useTileStore();
  
  /**
   * Handlers spécialisés pour les drones par état
   */
  const droneStateHandlers = useMemo(() => ({
    deploying: {
      onMovementStart: (distance, visualPosition, now) => {
        const eventKey = `drone_deploying_start_${botId}_${droneType}`;
        if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.DEPLOYMENT_START && canSendEvent(eventKey)) {
          console.log(`🚀 [${botId}] ${droneType} drone deployed - distance: ${distance.toFixed(2)}`);
          send(movementEvents.createDroneDeployedEvent(
            'auto',
            5,
            droneType,
            visualPosition
          ));
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.DEPLOYMENT_RESET);
          return true;
        }
        return false;
      },
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `drone_deploying_reached_${botId}_${droneType}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          console.log(`🔍 [${botId}] ${droneType} target reached - distance: ${distance.toFixed(2)}`);
          
          // Logique de marquage des tuiles
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          try {
            const { markTileAsExplored } = useTileStore.getState();
            markTileAsExplored(tileCoord);
            console.log(`✅ [${botId}] Tile explored by ${droneType}: ${JSON.stringify(tileCoord)}`);
          } catch (error) {
            console.error(`❌ [${botId}] Failed to mark tile: ${error.message}`);
          }
          
          send(movementEvents.createDroneReachedTargetEvent(
            visualPosition,
            tileCoord,
            droneType
          ));
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
          console.log(`🔍 [${botId}] ${droneType} starting prospecting phase`);
          
          // Capturer les valeurs pour éviter les problèmes de closure
          const capturedPosition = { ...visualPosition };
          const capturedGridCoord = worldToGrid(visualPosition);
          const capturedTileCoord = gridToHexCoord(capturedGridCoord);
          
          // Timer pour la prospection
          setTimeout(() => {
            const prospectingEventKey = `drone_prospecting_complete_${botId}_${droneType}`;
            if (canSendEvent(prospectingEventKey)) {
              console.log(`💎 [${botId}] ${droneType} prospecting completed`);
              
              try {
                const { markTileAsProspected } = useTileStore.getState();
                
                // Simuler la découverte de ressources
                const resourcesFound = {
                  food: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
                  debris: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0,
                  special: Math.random() > 0.9 ? 1 : 0
                };
                
                markTileAsProspected(capturedTileCoord, resourcesFound);
                console.log(`🔍 [${botId}] ${droneType} prospecting results: ${JSON.stringify(resourcesFound)}`);
                
                send(movementEvents.createProspectingCompleteEvent(
                  capturedPosition,
                  capturedTileCoord,
                  resourcesFound,
                  droneType
                ));
                
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
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `drone_returning_reached_${botId}_${droneType}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          console.log(`🏠 [${botId}] ${droneType} drone returned - distance: ${distance.toFixed(2)}`);
          send(movementEvents.createDroneReturnedEvent(
            visualPosition,
            droneType
          ));
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
    
    if (!visualPosition || !targetPosition || !drone.isActive) return;
    
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
      checkDronePositionAndSendEvents(position);
    }
  }, [checkDronePositionAndSendEvents]);
  
  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      clearAllEvents();
      currentVisualPosition.current = null;
    };
  }, [clearAllEvents]);
  
  return updateDroneVisualPosition;
};

export default useFSMDroneTracker;
