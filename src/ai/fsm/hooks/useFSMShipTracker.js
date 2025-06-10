/**
 * ============================================================================
 * FSM SHIP TRACKER - Spécialisé pour les vaisseaux
 * ============================================================================
 * 
 * Hook spécialisé pour le tracking des vaisseaux et leurs événements FSM.
 * Gère les déplacements, collecte, refuel, etc.
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MOVEMENT_EVENT_TYPES, movementEvents } from '../machine/events/movementEvents.js';
import { POSITION_TRACKER_CONFIG } from '../machine/constants/constants.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import { useEventDebounce } from './useEventDebounce.js';

/**
 * Hook spécialisé pour le tracking des vaisseaux
 * @param {Object} context - Contexte FSM
 * @param {Function} send - Fonction d'envoi d'événements FSM
 * @param {string} botId - ID du bot
 * @returns {Function} - Fonction pour mettre à jour les positions depuis R3F
 */
export const useFSMShipTracker = (context, send, botId) => {
  const currentVisualPosition = useRef(null);
  
  // Hook de debounce personnalisé
  const { canSendEvent, markEventSent, clearAllEvents } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );
  
  // Access to tile store for coordinate conversion
  const { gridToHexCoord, worldToGrid } = useTileStore();
  
  /**
   * Handlers spécialisés pour les vaisseaux par état/action
   */
  const shipStateHandlers = useMemo(() => ({
    moving_to_tile: {
      onMovementStart: (distance, visualPosition, now) => {
        const eventKey = `ship_movement_start_${botId}`;
        if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.SHIP_MOVEMENT_START && canSendEvent(eventKey)) {
          console.log(`🚢 [${botId}] Ship movement started - distance: ${distance.toFixed(2)}`);
          
          // Créer un événement de démarrage de mouvement du vaisseau
          const shipMovementEvent = movementEvents.createShipMovementStartedEvent(
            visualPosition,
            null // targetPosition optionnel
          );
          send(shipMovementEvent.type, shipMovementEvent);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.SHIP_MOVEMENT_RESET);
          return true;
        }
        return false;
      },
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `ship_target_reached_${botId}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          console.log(`🎯 [${botId}] Ship reached target - distance: ${distance.toFixed(2)}`);
          
          // Convertir en coordonnées de tuile
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          
          // Événement d'arrivée du vaisseau
          const shipArrivedEvent = movementEvents.createShipArrivedAtTileEvent(
            visualPosition,
            tileCoord
          );
          send(shipArrivedEvent.type, shipArrivedEvent);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.SHIP_ARRIVAL_RESET);
          return true;
        }
        return false;
      }
    },
    collecting: {
      onCollectionStart: (distance, visualPosition, now) => {
        const eventKey = `ship_collection_start_${botId}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          console.log(`📦 [${botId}] Ship started collecting resources`);
          
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          
          // Simuler un délai de collecte
          setTimeout(() => {
            const collectionEventKey = `ship_collection_complete_${botId}`;
            if (canSendEvent(collectionEventKey)) {
              console.log(`✅ [${botId}] Ship completed resource collection`);
              
              try {
                const { getTileData } = useTileStore.getState();
                const tileData = getTileData(tileCoord);
                
                // Simuler la collecte de ressources
                const collectedResources = {
                  food: tileData?.resources?.food || 0,
                  debris: tileData?.resources?.debris || 0,
                  special: tileData?.resources?.special || 0
                };
                
                const shipCollectionEvent = movementEvents.createShipCollectionCompletedEvent(
                  visualPosition,
                  tileCoord,
                  collectedResources
                );
                send(shipCollectionEvent.type, shipCollectionEvent);
                
                markEventSent(collectionEventKey, POSITION_TRACKER_CONFIG.TIMINGS.COLLECTION_RESET);
              } catch (error) {
                console.error(`❌ [${botId}] Failed to complete ship collection: ${error.message}`);
              }
            }
          }, POSITION_TRACKER_CONFIG.TIMINGS.COLLECTION_DURATION || 2000);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.COLLECTION_RESET);
          return true;
        }
        return false;
      }
    },
    refueling: {
      onRefuelStart: (distance, visualPosition, now) => {
        const eventKey = `ship_refuel_start_${botId}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.STATION_REACH && canSendEvent(eventKey)) {
          console.log(`⛽ [${botId}] Ship started refueling`);
          
          // Simuler le processus de refuel
          setTimeout(() => {
            const refuelEventKey = `ship_refuel_complete_${botId}`;
            if (canSendEvent(refuelEventKey)) {
              console.log(`✅ [${botId}] Ship refueling completed`);
              
              const shipRefuelEvent = movementEvents.createShipRefuelCompletedEvent(
                visualPosition,
                100 // Plein fait
              );
              send(shipRefuelEvent.type, shipRefuelEvent);
              
              markEventSent(refuelEventKey, POSITION_TRACKER_CONFIG.TIMINGS.REFUEL_RESET);
            }
          }, POSITION_TRACKER_CONFIG.TIMINGS.REFUEL_DURATION || 3000);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.REFUEL_RESET);
          return true;
        }
        return false;
      }
    }
  }), [botId, send, gridToHexCoord, worldToGrid, canSendEvent, markEventSent]);

  /**
   * Logique principale de surveillance spécialisée pour les vaisseaux
   */
  const checkShipPositionAndSendEvents = useCallback((visualPosition) => {
    if (!send || !context?.vehicle) return;
    
    const ship = context.vehicle;
    const targetPosition = ship.targetPosition || context.targetPosition;
    const currentAction = context.currentAction;
    
    if (!visualPosition || !targetPosition) return;
    
    // Calculer la distance entre position visuelle et cible FSM
    const distance = Math.sqrt(
      Math.pow(targetPosition.x - visualPosition.x, 2) +
      Math.pow(targetPosition.y - visualPosition.y, 2) +
      Math.pow(targetPosition.z - visualPosition.z, 2)
    );
    
    const now = Date.now();
    
    // Déterminer le handler basé sur l'action actuelle
    let handlerCategory = 'moving_to_tile'; // Par défaut
    
    if (currentAction === 'collecting' || currentAction === 'resource_collection') {
      handlerCategory = 'collecting';
    } else if (currentAction === 'refueling' || currentAction === 'fuel_maintenance') {
      handlerCategory = 'refueling';
    }
    
    const handlers = shipStateHandlers[handlerCategory];
    if (handlers) {
      let eventSent = false;
      
      if (handlers.onMovementStart) {
        eventSent = handlers.onMovementStart(distance, visualPosition, now);
      }
      
      if (!eventSent && handlers.onTargetReached) {
        eventSent = handlers.onTargetReached(distance, visualPosition, now);
      }
      
      if (!eventSent && handlers.onCollectionStart) {
        eventSent = handlers.onCollectionStart(distance, visualPosition, now);
      }
      
      if (!eventSent && handlers.onRefuelStart) {
        eventSent = handlers.onRefuelStart(distance, visualPosition, now);
      }
    }
    
    // Nettoyer les flags si la distance augmente
    if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.RESET_MOVEMENT) {
      clearAllEvents();
    }
    
  }, [context?.vehicle, context?.currentAction, context?.targetPosition, send, botId, shipStateHandlers]);

  /**
   * Fonction pour que Fleet.jsx envoie les positions du vaisseau
   */
  const updateShipVisualPosition = useCallback((position) => {
    currentVisualPosition.current = position;
    
    if (position) {
      checkShipPositionAndSendEvents(position);
    }
  }, [checkShipPositionAndSendEvents]);
  
  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      clearAllEvents();
      currentVisualPosition.current = null;
    };
  }, [clearAllEvents]);
  
  return updateShipVisualPosition;
};

export default useFSMShipTracker;
