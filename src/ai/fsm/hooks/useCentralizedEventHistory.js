/**
 * ============================================================================
 * CENTRALIZED EVENT HISTORY HOOK - Hook centralisé pour l'historique FSM
 * ============================================================================
 * 
 * Hook qui remplace useEventHistory local pour utiliser le FSM Store centralisé.
 * Capture les événements et les stocke de manière centralisée.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { useCallback, useEffect, useRef } from 'react';
import { useBotMachineFixed } from "./useBotMachineFixed.js";
import useFSMStore from '../../../stores/useFSMStore/index.js';

/**
 * Hook centralisé pour l'historique des événements FSM
 * Remplace l'ancien useEventHistory local
 * 
 * @param {string} botId - ID du bot
 * @returns {Object} Interface pour envoyer des événements et accéder à l'historique
 */
export const useCentralizedEventHistory = (botId) => {
  const { send: originalSend, current } = useBotMachineFixed(botId);
  const addEventToHistory = useFSMStore(state => state.addEventToHistory);
  const getEventHistory = useFSMStore(state => state.getEventHistory);
  const clearEventHistory = useFSMStore(state => state.clearEventHistory);
  
  const lastStateRef = useRef(current?.name);
  const lastContextRef = useRef(current?.context);

  // Wrapper pour capturer les événements envoyés manuellement
  const send = useCallback((eventName, eventData = {}) => {
    const eventToAdd = {
      type: 'SENT',
      eventName,
      eventData,
      fromState: current?.name || 'unknown',
      context: current?.context ? JSON.stringify(current.context, null, 2) : 'N/A'
    };

    console.log(`[CentralizedEventHistory] Capturing sent event: ${eventName} for bot ${botId}`);
    addEventToHistory(botId, eventToAdd);
    
    // Appeler la fonction send originale
    return originalSend(eventName, eventData);
  }, [originalSend, current?.name, current?.context, botId, addEventToHistory]);

  // Capturer les changements d'état (transitions automatiques)
  useEffect(() => {
    if (current?.name && current.name !== lastStateRef.current) {
      // Si changement de 'evaluating' vers 'exploring', c'est probablement EVALUATION_COMPLETE
      let eventName = 'STATE_CHANGE';
      if (lastStateRef.current === 'evaluating' && current.name === 'exploring') {
        eventName = 'EVALUATION_COMPLETE';
      }
      
      const eventToAdd = {
        type: 'TRANSITION',
        eventName,
        eventData: { 
          from: lastStateRef.current, 
          to: current.name 
        },
        fromState: lastStateRef.current || 'unknown',
        toState: current.name,
        context: current?.context ? JSON.stringify(current.context, null, 2) : 'N/A'
      };

      console.log(`[CentralizedEventHistory] State transition detected: ${lastStateRef.current} → ${current.name} for bot ${botId}`);
      addEventToHistory(botId, eventToAdd);
      lastStateRef.current = current.name;
    }
  }, [current?.name, botId, addEventToHistory]);

  // Capturer les changements de contexte significatifs
  useEffect(() => {
    // DEBUG: Log de tous les appels de useEffect avec plus de détails
    console.log(`[CentralizedEventHistory] useEffect triggered for bot ${botId}:`, {
      hasContext: !!current?.context,
      contextRef: current?.context ? `ref-${JSON.stringify(current.context).slice(0, 50)}...` : 'null',
      currentDroneState: current?.context?.droneFleet?.drones?.explorer?.state,
      currentLastUpdate: current?.context?.droneFleet?.drones?.explorer?.lastUpdate,
      lastDroneState: lastContextRef.current?.droneFleet?.drones?.explorer?.state,
      lastLastUpdate: lastContextRef.current?.droneFleet?.drones?.explorer?.lastUpdate,
      refsEqual: current?.context === lastContextRef.current,
      stringifyEqual: current?.context ? JSON.stringify(current.context) === JSON.stringify(lastContextRef.current) : 'no context'
    });

    if (current?.context && JSON.stringify(current.context) !== JSON.stringify(lastContextRef.current)) {
      const eventToAdd = {
        type: 'CONTEXT_UPDATE',
        eventName: 'CONTEXT_CHANGED',
        eventData: current.context,
        fromState: current?.name || 'unknown',
        context: JSON.stringify(current.context, null, 2)
      };

      // Anti-spam intelligent : permettre les changements d'état de drone significatifs
      const recentEvents = getEventHistory(botId);
      const lastEvent = recentEvents[0];
      
      // Vérifier si c'est un changement d'état de drone significatif
      const currentDroneState = current.context?.droneFleet?.drones?.explorer?.state;
      const lastContextDroneState = lastContextRef.current?.droneFleet?.drones?.explorer?.state;
      const isDroneStateChange = currentDroneState !== lastContextDroneState;
      
      const shouldSkip = !isDroneStateChange && 
        recentEvents.length > 0 && 
        lastEvent.type === 'CONTEXT_UPDATE' && 
        (Date.now() - lastEvent.id) < 1000;

      // DEBUG: Log tous les changements de contexte, même ceux filtrés
      console.log(`[CentralizedEventHistory] Context change detected for bot ${botId}:`, {
        shouldSkip,
        isDroneStateChange,
        currentDroneState,
        lastContextDroneState,
        droneState: current.context?.droneFleet?.drones?.explorer?.state,
        lastUpdate: current.context?.droneFleet?.drones?.explorer?.lastUpdate,
        recentEventsCount: recentEvents.length,
        lastEventType: lastEvent?.type,
        timeSinceLastEvent: recentEvents.length > 0 ? (Date.now() - lastEvent.id) : 'N/A'
      });

      if (!shouldSkip) {
        console.log(`[CentralizedEventHistory] Context update ACCEPTED for bot ${botId}`);
        addEventToHistory(botId, eventToAdd);
      } else {
        console.log(`[CentralizedEventHistory] Context update FILTERED (anti-spam) for bot ${botId}`);
      }
      
      lastContextRef.current = current.context;
    } else {
      // DEBUG: Log quand aucun changement n'est détecté
      console.log(`[CentralizedEventHistory] NO context change detected for bot ${botId}:`, {
        hasContext: !!current?.context,
        hasLastContext: !!lastContextRef.current,
        stringifyMatch: current?.context ? JSON.stringify(current.context) === JSON.stringify(lastContextRef.current) : 'no current context'
      });
    }
  }, [current?.context, current?.name, botId, addEventToHistory, getEventHistory]);

  // Interface de retour
  return {
    // Envoi d'événements avec capture
    send,
    
    // Accès aux données actuelles
    current,
    
    // Accès à l'historique
    eventHistory: getEventHistory(botId),
    globalEventHistory: getEventHistory(),
    
    // Utilitaires
    clearHistory: () => clearEventHistory(botId),
    clearGlobalHistory: () => clearEventHistory()
  };
};

export default useCentralizedEventHistory;
