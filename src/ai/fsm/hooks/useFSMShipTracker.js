/**
 * ============================================================================
 * FSM SHIP TRACKER - Spécialisé pour les vaisseaux
 * ============================================================================
 * 
 * Hook spécialisé pour le tracking des vaisseaux et leurs événements FSM.
 * Gère les déplacements, collecte, refuel, etc.
 * 
 * 📡 ÉVÉNEMENTS FSM ENVOYÉS DEPUIS CE HOOK:
 * ==========================================
 * 
 * 🏠 INITIALISATION:
 * - movementEvents.createUpdatePositionEvent() → 'SHIP_UPDATE_POSITION'
 * 
 * 🚢 DÉPLACEMENT (moving_to_tile):
 * - movementEvents.createShipMovementStartedEvent() → 'SHIP_MOVEMENT_STARTED'
 * - movementEvents.createShipArrivedAtTileEvent() → 'SHIP_ARRIVED_AT_TILE'
 * 
 * 📦 COLLECTE (collecting):
 * - movementEvents.createShipCollectionCompletedEvent() → 'SHIP_COLLECTION_COMPLETED'
 * 
 * ⛽ RAVITAILLEMENT (refueling):
 * - movementEvents.createShipRefuelCompletedEvent() → 'SHIP_REFUEL_COMPLETED'
 * 
 * 🎯 UTILISE LES ÉVÉNEMENTS FSM STANDARD pour mise à jour du contexte
 * Solution simple et compatible avec l'architecture existante.
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MOVEMENT_EVENT_TYPES, movementEvents } from '../machine/events/movementEvents.js'; // ✅ CORRECTION: Retour vers movementEvents.js
import { POSITION_TRACKER_CONFIG } from '../machine/constants/constants.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import { useEventDebounce } from './useEventDebounce.js';
import { useFSMSync } from '../contexts/FSMSyncContext.jsx';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook spécialisé pour le tracking des vaisseaux
 * @param {Object} context - Contexte FSM
 * @param {Function} send - Fonction d'envoi d'événements FSM
 * @param {string} botId - ID du bot
 * @returns {Function} - Fonction pour mettre à jour les positions depuis R3F
 */
export const useFSMShipTracker = (context, send, botId) => {
  const currentVisualPosition = useRef(null);
  const initialPositionSent = useRef(false); // 🆕 Flag pour éviter les envois multiples
  
  // Hook de debounce personnalisé
  const { canSendEvent, markEventSent, clearAllEvents } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );
  
  // Access to tile store for coordinate conversion
  const { gridToHexCoord, worldToGrid } = useTileStore();
  
  /**
   * 🆕 Fonction simple pour détecter et transmettre la position initiale
   * Utilise les événements FSM standard au lieu d'un système complexe
   */
  const handleInitialPositionSetup = useCallback((visualPosition) => {
    // Vérifier si on doit mettre à jour la position initiale
    if (!initialPositionSent.current && 
        visualPosition && 
        (!context?.vehicle?.position || context.vehicle.position === null)) {
      
      fsmLogger.context(`🏠 [${botId}] Setting initial ship position via FSM event`, {
        position: visualPosition,
        hasVehicle: !!context?.vehicle,
        currentPosition: context?.vehicle?.position
      });
      
      // Convertir en coordonnées de tuile avec validation
      const gridCoord = worldToGrid(visualPosition);
      const tileCoord = gridToHexCoord(gridCoord);
      
      // Si les coordonnées ne peuvent pas être calculées, utiliser une valeur par défaut
      const safeTileCoord = tileCoord || "0,0";
      
      // ✅ CORRECTION: Maintenant importé depuis le bon fichier
      const initialPositionEvent = movementEvents.createShipUpdatePositionEvent(
        visualPosition,
        'ship',
        safeTileCoord,
        safeTileCoord
      );
      
      // Envoyer l'objet événement complet
      send(initialPositionEvent);
      
      fsmLogger.context(`✅ [${botId}] Initial ship position sent via FSM event`, {
        tileCoord: safeTileCoord,
        worldPosition: visualPosition,
        eventType: initialPositionEvent.type
      });
      
      // Marquer comme envoyé pour éviter les doublons
      initialPositionSent.current = true;
      
      return true; // Position initiale mise à jour
    }
    
    return false; // Pas de position initiale mise à jour
  }, [context?.vehicle?.position, send, botId, worldToGrid, gridToHexCoord]);

  /**
   * Handlers spécialisés pour les vaisseaux par état/action
   */
  const shipStateHandlers = useMemo(() => ({
    moving_to_tile: {
      onMovementStart: (distance, visualPosition, now) => {
        const eventKey = `ship_movement_start_${botId}`;
        if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.SHIP_MOVEMENT_START && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🚢 [${botId}] Ship movement started - distance: ${distance.toFixed(2)}`);
          
          // ✅ CORRECTION: Utiliser un événement simple
          const shipMovementEvent = {
            type: 'SHIP_MOVEMENT_STARTED',
            position: visualPosition,
            timestamp: Date.now()
          };
          send(shipMovementEvent);
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.SHIP_MOVEMENT_RESET);
          return true;
        }
        return false;
      },
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `ship_target_reached_${botId}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          fsmLogger.mouvement(`🎯 [${botId}] Ship reached target - distance: ${distance.toFixed(2)}`);
          
          // Convertir en coordonnées de tuile
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          
          // ✅ CORRECTION: Utiliser un événement simple
          const shipArrivedEvent = {
            type: 'SHIP_ARRIVED_AT_TILE',
            position: visualPosition,
            tileCoord,
            timestamp: Date.now()
          };
          send(shipArrivedEvent);
          
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
          fsmLogger.mouvement(`📦 [${botId}] Ship started collecting resources`);
          
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          
          // Simuler un délai de collecte
          setTimeout(() => {
            const collectionEventKey = `ship_collection_complete_${botId}`;
            if (canSendEvent(collectionEventKey)) {
              fsmLogger.mouvement(`✅ [${botId}] Ship completed resource collection`);
              
              try {
                const { getTileData } = useTileStore.getState();
                const tileData = getTileData(tileCoord);
                
                // Simuler la collecte de ressources
                const collectedResources = {
                  food: tileData?.resources?.food || 0,
                  debris: tileData?.resources?.debris || 0,
                  special: tileData?.resources?.special || 0
                };
                
                // ✅ CORRECTION: Utiliser un événement simple
                const shipCollectionEvent = {
                  type: 'SHIP_COLLECTION_COMPLETED',
                  position: visualPosition,
                  tileCoord,
                  collectedResources,
                  timestamp: Date.now()
                };
                send(shipCollectionEvent);
                
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
          fsmLogger.mouvement(`⛽ [${botId}] Ship started refueling`);
          
          // Simuler le processus de refuel
          setTimeout(() => {
            const refuelEventKey = `ship_refuel_complete_${botId}`;
            if (canSendEvent(refuelEventKey)) {
              fsmLogger.mouvement(`✅ [${botId}] Ship refueling completed`);
              
              // ✅ CORRECTION: Utiliser un événement simple
              const shipRefuelEvent = {
                type: 'SHIP_REFUEL_COMPLETED',
                position: visualPosition,
                fuelLevel: 100,
                timestamp: Date.now()
              };
              send(shipRefuelEvent);
              
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
      // 🆕 PRIORITÉ 1: Gérer la position initiale en premier
      const initialPositionHandled = handleInitialPositionSetup(position);
      
      // 🆕 PRIORITÉ 2: Ne faire le tracking normal que si la position initiale est déjà envoyée
      if (initialPositionSent.current && !initialPositionHandled) {
        checkShipPositionAndSendEvents(position);
      }
    }
  }, [handleInitialPositionSetup, checkShipPositionAndSendEvents]);
  
  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      clearAllEvents();
      currentVisualPosition.current = null;
      initialPositionSent.current = false; // 🆕 Reset du flag lors du cleanup
    };
  }, [clearAllEvents]);
  
  return updateShipVisualPosition;
};

export default useFSMShipTracker;
