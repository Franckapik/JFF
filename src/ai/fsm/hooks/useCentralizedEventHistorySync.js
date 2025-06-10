/**
 * ============================================================================
 * CENTRALIZED EVENT HISTORY HOOK - Version avec synchronisation FSM
 * ============================================================================
 * 
 * Hook qui utilise le système de synchronisation FSM pour détecter 
 * les changements d'état de manière plus fiable.
 * 
 * @version 2.0.0
 */

import { useCallback, useEffect, useRef } from 'react';
import { useBotMachine } from "./useBotMachine.js";
import { useFSMSync } from '../contexts/FSMSyncContext.jsx';
import useFSMStore from '../../../stores/useFSMStore/index.js';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook centralisé pour l'historique des événements FSM avec synchronisation
 */
export const useCentralizedEventHistorySync = (botId) => {
  const { send: originalSend, current } = useBotMachine(botId);
  const { registerSyncCallback } = useFSMSync();
  const addEventToHistory = useFSMStore(state => state.addEventToHistory);
  const getEventHistory = useFSMStore(state => state.getEventHistory);
  const clearEventHistory = useFSMStore(state => state.clearEventHistory);
  
  const lastStateRef = useRef(current?.name);
  const lastContextRef = useRef(current?.context);

  // Enregistrer pour recevoir les événements synchronisés
  useEffect(() => {
    const cleanup = registerSyncCallback(botId, (eventName, eventData) => {
      const eventToAdd = {
        type: 'SYNC',
        eventName,
        eventData,
        fromState: current?.name || 'unknown',
        context: current?.context ? JSON.stringify(current.context, null, 2) : 'N/A'
      };

      fsmLogger.history(`Received sync event: ${eventName} for bot ${botId}`);
      addEventToHistory(botId, eventToAdd);
    });
    
    return cleanup;
  }, [botId, registerSyncCallback, addEventToHistory, current?.name, current?.context]);

  // Wrapper pour capturer les événements envoyés manuellement
  const send = useCallback((eventName, eventData = {}) => {
    const eventToAdd = {
      type: 'SENT',
      eventName,
      eventData,
      fromState: current?.name || 'unknown',
      context: current?.context ? JSON.stringify(current.context, null, 2) : 'N/A'
    };

    fsmLogger.history(`Capturing sent event: ${eventName} for bot ${botId}`);
    addEventToHistory(botId, eventToAdd);
    
    // Appeler la fonction send originale (qui va synchroniser automatiquement)
    return originalSend(eventName, eventData);
  }, [originalSend, current?.name, current?.context, botId, addEventToHistory]);

  // Capturer les changements d'état (transitions automatiques)
  useEffect(() => {
    if (current?.name && current.name !== lastStateRef.current) {
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

      fsmLogger.history(`State transition detected: ${lastStateRef.current} → ${current.name} for bot ${botId}`);
      addEventToHistory(botId, eventToAdd);
      lastStateRef.current = current.name;
    }
  }, [current?.name, botId, addEventToHistory]);

  // Capturer les changements de contexte significatifs avec meilleure détection
  useEffect(() => {
    if (current?.context) {
      const currentContextString = JSON.stringify(current.context);
      const lastContextString = lastContextRef.current ? JSON.stringify(lastContextRef.current) : null;
      
      // Détection spécifique pour les changements d'état de drone
      const currentDroneState = current.context.droneFleet?.drones?.explorer?.state;
      const currentLastUpdate = current.context.droneFleet?.drones?.explorer?.lastUpdate;
      const lastDroneState = lastContextRef.current?.droneFleet?.drones?.explorer?.state;
      const lastLastUpdate = lastContextRef.current?.droneFleet?.drones?.explorer?.lastUpdate;
      
      fsmLogger.history(`Context effect triggered for bot ${botId}:`, {
        hasContext: !!current.context,
        hasLastContext: !!lastContextRef.current,
        currentDroneState,
        lastDroneState,
        droneStateChanged: currentDroneState !== lastDroneState,
        lastUpdateChanged: currentLastUpdate !== lastLastUpdate,
        stringifyMatch: currentContextString === lastContextString
      });
      
      // Détecter les changements significatifs
      const hasSignificantChange = (
        !lastContextRef.current || 
        currentDroneState !== lastDroneState ||
        currentLastUpdate !== lastLastUpdate ||
        currentContextString !== lastContextString
      );
      
      if (hasSignificantChange) {
        const eventToAdd = {
          type: 'CONTEXT_UPDATE',
          eventName: 'CONTEXT_CHANGED',
          eventData: {
            droneStateChange: currentDroneState !== lastDroneState ? {
              from: lastDroneState,
              to: currentDroneState
            } : null,
            timestamp: Date.now()
          },
          fromState: current.name || 'unknown',
          context: currentContextString
        };

        fsmLogger.history(`Context change detected for bot ${botId}:`, {
          droneStateChange: currentDroneState !== lastDroneState ? `${lastDroneState} → ${currentDroneState}` : 'none',
          reason: hasSignificantChange ? 'significant change detected' : 'no change'
        });
        
        addEventToHistory(botId, eventToAdd);
      } else {
        fsmLogger.history(`NO context change detected for bot ${botId}`);
      }
      
      lastContextRef.current = current.context;
    }
  }, [current?.context, botId, addEventToHistory]);

  return {
    send,
    current,
    eventHistory: getEventHistory(botId),
    clearHistory: () => clearEventHistory(botId)
  };
};

export default useCentralizedEventHistorySync;
