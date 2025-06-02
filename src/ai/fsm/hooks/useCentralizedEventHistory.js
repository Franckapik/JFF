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
      // Si changement de 'evaluating' vers 'exploring', c'est probablement ASSESSMENT_COMPLETE
      let eventName = 'STATE_CHANGE';
      if (lastStateRef.current === 'evaluating' && current.name === 'exploring') {
        eventName = 'ASSESSMENT_COMPLETE';
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
    if (current?.context && JSON.stringify(current.context) !== JSON.stringify(lastContextRef.current)) {
      const eventToAdd = {
        type: 'CONTEXT_UPDATE',
        eventName: 'CONTEXT_CHANGED',
        eventData: current.context,
        fromState: current?.name || 'unknown',
        context: JSON.stringify(current.context, null, 2)
      };

      // Anti-spam : vérifier si le dernier événement était aussi un update de contexte récent
      const recentEvents = getEventHistory(botId);
      const shouldSkip = recentEvents.length > 0 && 
        recentEvents[0].type === 'CONTEXT_UPDATE' && 
        (Date.now() - recentEvents[0].id) < 1000;

      if (!shouldSkip) {
        console.log(`[CentralizedEventHistory] Context update detected for bot ${botId}`);
        addEventToHistory(botId, eventToAdd);
      }
      
      lastContextRef.current = current.context;
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
