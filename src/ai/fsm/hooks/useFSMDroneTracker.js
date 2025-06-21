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
 * 🔍 EXPLORATION:
 * - 'TILE_EXPLORED' lors de l'exploration complète d'une tuile (avec ressources)
 * 
 * 🏠 RETOUR (returning):
 * - movementEvents.createDroneApproachingShipEvent() → 'DRONE_APPROACHING_SHIP'
 * - movementEvents.createDroneReachedShipEvent() → 'DRONE_REACHED_SHIP'
 * 
 * 🎯 EXPLORATION (déploiement):
 * - Marquage automatique des tuiles comme explorées via useTileStore
 * - Découverte et stockage des ressources en une fois
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
          
          // Logique de marquage des tuiles et découverte de ressources
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          
          try {
            const { markTileAsExplored, getTile } = useTileStore.getState();
            markTileAsExplored(tileCoord);
            fsmLogger.mouvement(`✅ [${botId}] Tile explored by ${droneType}: ${JSON.stringify(tileCoord)}`);
            
            // Récupérer les vraies ressources de la tuile explorée
            const tile = getTile(tileCoord);
            const resourcesFound = tile?.resources ? {
              food: tile.resources.food || 0,
              debris: tile.resources.debris || 0,
              special: tile.resources.special || 0
            } : {
              food: 0,
              debris: 0,
              special: 0
            };
            
            fsmLogger.resources(`💎 [${botId}] ${droneType} discovered resources from tile: ${JSON.stringify(resourcesFound)}`);

            // Envoyer l'événement d'exploration qui correspond à l'état FSM
            const tileExploredEvent = {
              type: 'TILE_EXPLORED',
              coord: tileCoord,
              resources: resourcesFound,
              position: visualPosition,
              droneType,
              hasResources: Object.values(resourcesFound).some(val => val > 0),
              timestamp: Date.now()
            };
            
            send(tileExploredEvent);
            
          } catch (error) {
            console.error(`❌ [${botId}] Failed to explore tile: ${error.message}`);
          }
          
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
          
          fsmLogger.context(`🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event`, {
            botId,
            droneType,
            hookInstanceId: `${botId}-${droneType}`,
            eventKey,
            distance
          });
          
          // Envoyer événement DRONE_APPROACHING_SHIP pour la transition anticipée
          const droneApproachingEvent = {
            type: 'DRONE_APPROACHING_SHIP',
            position: visualPosition,
            distance,
            droneType,
            timestamp: Date.now()
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
          fsmLogger.mouvement(`🏠 [${botId}] ${droneType} drone reached ship - distance: ${distance.toFixed(2)}`);
          
          // Utiliser l'événement renommé
          const droneReachedShipEvent = {
            type: 'DRONE_REACHED_SHIP',
            position: visualPosition,
            droneType,
            timestamp: Date.now()
          };
          send(droneReachedShipEvent);
          
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
      
      // 🆕 PRIORITÉ 2: Faire le tracking dès que le drone est actif MAIS pas si il est docké OU si le bot est idle
      const currentDrone = context?.droneFleet?.drones?.[droneType];
      const isDocked = currentDrone?.state === 'docked';
      const isBotIdle = context?.currentState === 'idleAtBase';
      const shouldTrack = (currentDrone?.isActive || (initialPositionSent.current && !initialPositionHandled)) && !isDocked && !isBotIdle;
      
      // 🐛 DEBUG: Log pour comprendre pourquoi le tracking continue
      if (currentDrone?.isActive && (isDocked || isBotIdle)) {
        fsmLogger.context(`🚫 [${botId}] ${droneType} tracking stopped`, {
          droneState: currentDrone.state,
          isActive: currentDrone.isActive,
          isDocked,
          isBotIdle,
          botState: context?.currentState,
          shouldTrack
        });
      }
      
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
