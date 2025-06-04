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

import { useEffect, useRef, useCallback } from 'react';
import { MOVEMENT_EVENT_TYPES } from '../machine/events/movementEvents.js';
import { useTileStore } from '../../../stores/useTileStore/index.js';
import fsmLogger from '../../../logger/fsmLogger.js';

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
  const lastEventTime = useRef({});
  const debugState = useRef({
    lastDistanceLog: 0,
    reachEventsSent: new Set()
  });
  
  // Access to tile store for coordinate conversion
  const { worldToGrid } = useTileStore();
  
  /**
   * Logique de surveillance des positions et envoi d'événements
   * Cette fonction est appelée par Fleet.jsx avec les positions visuelles R3F
   */
  const checkPositionAndSendEvents = useCallback((visualPosition, droneState) => {
    if (!send || !context?.droneFleet?.drones?.explorer) return;
    
    const drone = context.droneFleet.drones.explorer;
    const targetPosition = drone.targetPosition;
    
    if (!visualPosition || !targetPosition || !drone.isActive) return;
    
    // Calculer la distance entre position visuelle et cible FSM
    const distance = Math.sqrt(
      Math.pow(targetPosition.x - visualPosition.x, 2) +
      Math.pow(targetPosition.y - visualPosition.y, 2) +
      Math.pow(targetPosition.z - visualPosition.z, 2)
    );
    
    const reachThreshold = 0.25;
    const now = Date.now();
    
    // Log de debug réduit
    if (now - debugState.current.lastDistanceLog > 2000) {
      fsmLogger.info(`🎯 [FSMPositionTracker] Drone ${droneState}: distance ${distance.toFixed(3)} (seuil: ${reachThreshold}) (visual: true)`, { botId, droneState });
      debugState.current.lastDistanceLog = now;
    }
    
    // Éviter les événements en double avec un système de cooldown
    const eventKey = `${droneState}_${botId}`;
    const lastEvent = lastEventTime.current[eventKey] || 0;
    const cooldown = 1000; // 1 seconde de cooldown
    
    if (now - lastEvent < cooldown) {
      return;
    }
    
    // 🎯 DÉPLOIEMENT TERMINÉ (utilise la position visuelle R3F)
    if (droneState === 'deploying' && distance < reachThreshold) {
      if (!debugState.current.reachEventsSent.has('deploying')) {
        fsmLogger.info(`🚀 [FSMPositionTracker] Auto-sending DRONE_DEPLOYED for ${botId} (visual position)`);
        send({
          type: MOVEMENT_EVENT_TYPES.DRONE_DEPLOYED,
          targetArea: 'auto',
          droneType: 'explorer',
          position: visualPosition,
          timestamp: now
        });
        lastEventTime.current[eventKey] = now;
        debugState.current.reachEventsSent.add('deploying');
        
        // Reset après un délai pour permettre de nouveaux déploiements
        setTimeout(() => {
          debugState.current.reachEventsSent.delete('deploying');
        }, 5000);
      }
    }
    
    // 🔍 EXPLORATION EN COURS - Marquer la tuile et envoyer l'événement
    else if (droneState === 'exploring' && distance < reachThreshold) {
      if (!debugState.current.reachEventsSent.has('exploring')) {
        fsmLogger.info(`🔍 [FSMPositionTracker] Drone reached exploration target for ${botId} (visual position)`);
        
        // Convert 3D position to tile coordinates
        const tileCoord = worldToGrid(visualPosition);
        
        // Mark tile as explored in the store
        try {
          const { markTileAsExplored } = useTileStore.getState();
          markTileAsExplored(tileCoord);
          fsmLogger.info(`✅ [FSMPositionTracker] Tile marked as explored: ${JSON.stringify(tileCoord)} for ${botId}`);
        } catch (error) {
          fsmLogger.error(`❌ [FSMPositionTracker] Failed to mark tile as explored: ${error.message}`);
        }
        
        // Send DRONE_REACHED_TARGET event with tile coordinates
        send({
          type: MOVEMENT_EVENT_TYPES.DRONE_REACHED_TARGET,
          position: visualPosition,
          tileCoord: tileCoord,
          droneType: 'explorer',
          timestamp: now
        });
        
        lastEventTime.current[eventKey] = now;
        debugState.current.reachEventsSent.add('exploring');
        
        // Reset après un délai
        setTimeout(() => {
          debugState.current.reachEventsSent.delete('exploring');
        }, 3000);
      }
    }
    
    // 🏠 RETOUR TERMINÉ
    else if (droneState === 'returning' && distance < reachThreshold) {
      if (!debugState.current.reachEventsSent.has('returning')) {
        fsmLogger.info(`🏠 [FSMPositionTracker] Auto-sending DRONE_RETURNED for ${botId} (visual position)`);
        send({
          type: MOVEMENT_EVENT_TYPES.DRONE_RETURNED,
          droneType: 'explorer',
          position: visualPosition,
          timestamp: now
        });
        lastEventTime.current[eventKey] = now;
        debugState.current.reachEventsSent.add('returning');
        
        // Reset après un délai
        setTimeout(() => {
          debugState.current.reachEventsSent.delete('returning');
        }, 5000);
      }
    }
    
    // Nettoyer les flags si la distance augmente (nouveau mouvement)
    if (distance > reachThreshold * 2) {
      debugState.current.reachEventsSent.clear();
    }
    
  }, [context?.droneFleet?.drones?.explorer, send, botId, worldToGrid]);

  /**
   * Fonction pour que Fleet.jsx envoie ses positions visuelles
   * @param {Object} position - Position actuelle du drone en coordonnées monde
   * @param {string} droneState - État actuel du drone
   */
  const updateVisualPosition = useCallback((position, droneState) => {
    currentVisualPosition.current = { ...position, state: droneState };
    
    // Déclencher immédiatement la logique de surveillance
    if (position && droneState) {
      checkPositionAndSendEvents(position, droneState);
    }
  }, [checkPositionAndSendEvents]);
  
  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      debugState.current.reachEventsSent.clear();
      lastEventTime.current = {};
      currentVisualPosition.current = null;
    };
  }, []);
  
  return updateVisualPosition;
};

export default useFSMPositionTracker;
