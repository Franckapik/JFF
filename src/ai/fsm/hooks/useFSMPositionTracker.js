/**
 * ============================================================================
 * FSM DRONE POSITION TRACKER - Intermédiaire intelligent FSM ↔ R3F
 * ============================================================================
 * 
 * Architecture Hybride Intelligente :
 * 1. Fleet.jsx calcule les positions visuelles R3F
 * 2. useFSMPositionTracker reçoit ces positions et surveille les distances
 * 3. Le tracker déclenche automatiquement les événements FSM appropriés
 * 
 * ✅ Avantages:
 * - Pas de `send` dans Fleet.jsx (séparation des responsabilités)
 * - Le tracker agit comme un pont intelligent
 * - FSM réagit aux événements selon sa logique interne
 * - Positions R3F utilisées pour la détection d'événements
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MOVEMENT_EVENT_TYPES, movementEvents } from '../machine/events/movementEvents.js';
import { POSITION_TRACKER_CONFIG } from '../machine/constants/constants.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import { useEventDebounce } from './useEventDebounce.js';

/**
 * Hook qui surveille les positions des drones et déclenche automatiquement
 * les événements FSM appropriés 
 * @param {Object} context - Contexte FSM
 * @param {Function} send - Fonction d'envoi d'événements FSM
 * @param {string} botId - ID du bot  
 * @returns {Function} - Fonction pour mettre à jour les positions depuis R3F
 */
export const useFSMPositionTracker = (context, send, botId) => {
  const currentVisualPosition = useRef(null); // Position visuelle R3F
  
  // Hook de debounce personnalisé pour la gestion des événements
  const { canSendEvent, markEventSent, clearAllEvents } = useEventDebounce(
    POSITION_TRACKER_CONFIG.TIMINGS.EVENT_COOLDOWN
  );
  
  // Access to tile store for coordinate conversion
  const { gridToHexCoord, worldToGrid } = useTileStore();
  
  /**
   * Handlers par état pour une logique plus claire et maintenable
   */
  const stateHandlers = useMemo(() => ({
    deploying: {
      onMovementStart: (distance, visualPosition, now) => {
        const eventKey = `deploying_start_${botId}`;
        if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.DEPLOYMENT_START && canSendEvent(eventKey)) {
          console.log(`🚀 [${botId}] Drone deployed - distance: ${distance.toFixed(2)}`);
          send(movementEvents.createDroneDeployedEvent(
            'auto', // targetArea
            5, // range
            'explorer', // droneType
            visualPosition // position
          ));
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.DEPLOYMENT_RESET);
          return true;
        }
        return false;
      },
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `deploying_reached_${botId}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          console.log(`🔍 [${botId}] Target reached - distance: ${distance.toFixed(2)}`);
          
          // Logique de marquage des tuiles (conservée comme dans le code original)
          const gridCoord = worldToGrid(visualPosition);
          const tileCoord = gridToHexCoord(gridCoord);
          try {
            const { markTileAsExplored } = useTileStore.getState();
            markTileAsExplored(tileCoord);
            console.log(`✅ [${botId}] Tile explored: ${JSON.stringify(tileCoord)}`);
          } catch (error) {
            console.error(`❌ [${botId}] Failed to mark tile: ${error.message}`);
          }
          
          send(movementEvents.createDroneReachedTargetEvent(
            visualPosition, // position
            tileCoord, // tileCoord
            'explorer' // droneType
          ));
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
          return true;
        }
        return false;
      }
    },
    prospecting: {
      onProspectingStart: (distance, visualPosition, now) => {
        const eventKey = `prospecting_start_${botId}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          console.log(`🔍 [${botId}] Starting prospecting phase at target position`);
          
          // ⚠️ CRITICAL FIX: Capturer les valeurs nécessaires MAINTENANT pour éviter les problèmes de closure
          const capturedPosition = { ...visualPosition }; // Copie profonde de la position
          const capturedGridCoord = worldToGrid(visualPosition); // Convertir d'abord en coordonnées de grille
          const capturedTileCoord = gridToHexCoord(capturedGridCoord); // Puis en coordonnées hex
          
          console.log(`🔍 [${botId}] Captured prospecting data:`, {
            position: capturedPosition,
            tileCoord: capturedTileCoord
          });
          
          // Démarrer un timer pour simuler la phase de prospection
          setTimeout(() => {
            // Après le délai de prospection, déclencher l'événement de completion
            const prospectingEventKey = `prospecting_complete_${botId}`;
            if (canSendEvent(prospectingEventKey)) {
              console.log(`💎 [${botId}] Prospecting phase completed - analyzing resources`);
              
              try {
                const { getTileData, markTileAsProspected } = useTileStore.getState();
                
                // Simuler la découverte de ressources (à adapter selon votre logique)
                const resourcesFound = {
                  food: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
                  debris: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0,
                  special: Math.random() > 0.9 ? 1 : 0
                };
                
                // Marquer la tuile comme prospectée en utilisant les valeurs capturées
                markTileAsProspected(capturedTileCoord, resourcesFound);
                console.log(`🔍 [${botId}] Prospecting results: ${JSON.stringify(resourcesFound)}`);
                
                // ✅ UTILISEZ LES VALEURS CAPTURÉES au lieu des variables de closure
                send(movementEvents.createProspectingCompleteEvent(
                  capturedPosition, // position
                  capturedTileCoord, // tileCoord
                  resourcesFound, // resourcesFound
                  'explorer' // droneType
                ));
                
                markEventSent(prospectingEventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
              } catch (error) {
                console.error(`❌ [${botId}] Failed to complete prospecting: ${error.message}`);
              }
            }
          }, POSITION_TRACKER_CONFIG.TIMINGS.PROSPECTING_DURATION || 3000); // 3 secondes par défaut
          
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
          return true;
        }
        return false;
      }
    },
    returning: {
      onTargetReached: (distance, visualPosition, now) => {
        const eventKey = `returning_reached_${botId}`;
        if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
          console.log(`🏠 [${botId}] Drone returned - distance: ${distance.toFixed(2)}`);
          send(movementEvents.createDroneReturnedEvent(
            visualPosition, // position
            'explorer' // droneType
          ));
          markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.RETURN_RESET);
          return true;
        }
        return false;
      }
    }
  }), [botId, send, gridToHexCoord, worldToGrid, canSendEvent, markEventSent]);
  /**
   * Logique principale de surveillance des positions - refactorisée pour plus de clarté
   */
  const checkPositionAndSendEvents = useCallback((visualPosition) => {
    if (!send || !context?.droneFleet?.drones?.explorer) return;
    
    const drone = context.droneFleet.drones.explorer;
    const droneState = drone.state;
    const targetPosition = drone.targetPosition;

    console.log(droneState);
    
    
    if (!visualPosition || !targetPosition || !drone.isActive) return;
    
    // Calculer la distance entre position visuelle et cible FSM
    const distance = Math.sqrt(
      Math.pow(targetPosition.x - visualPosition.x, 2) +
      Math.pow(targetPosition.y - visualPosition.y, 2) +
      Math.pow(targetPosition.z - visualPosition.z, 2)
    );
    
    const now = Date.now();
    
    // Utiliser les handlers par état pour une logique plus claire
    const handler = stateHandlers[droneState];
    if (handler) {
      let eventSent = false;
      
      // Vérifier le démarrage de mouvement (pour deploying)
      if (handler.onMovementStart) {
        eventSent = handler.onMovementStart(distance, visualPosition, now);
      }
      
      // Vérifier l'arrivée à la cible (si pas d'événement de démarrage envoyé)
      if (!eventSent && handler.onTargetReached) {
        eventSent = handler.onTargetReached(distance, visualPosition, now);
      }
      
      // Vérifier le démarrage de la prospection (pour prospecting)
      if (!eventSent && handler.onProspectingStart) {
        eventSent = handler.onProspectingStart(distance, visualPosition, now);
      }
    }
    
    // Nettoyer les flags si la distance augmente (nouveau mouvement)
    if (distance > POSITION_TRACKER_CONFIG.THRESHOLDS.RESET_MOVEMENT) {
      clearAllEvents();
    }
    
  }, [context?.droneFleet?.drones?.explorer, send, botId, stateHandlers]);

  /**
   * Fonction pour que Fleet.jsx envoie ses positions visuelles
   * @param {Object} position - Position actuelle du drone en coordonnées monde
   */
  const updateVisualPosition = useCallback((position) => {
    currentVisualPosition.current = position;
    
    // Déclencher immédiatement la logique de surveillance
    if (position) {
      checkPositionAndSendEvents(position);
    }
  }, [checkPositionAndSendEvents]);
  
  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      clearAllEvents();
      currentVisualPosition.current = null;
    };
  }, [clearAllEvents]);
  
  return updateVisualPosition;
};

export default useFSMPositionTracker;
