/**
 * ============================================================================
 * CENTRALIZED EVENT HISTORY HOOK - Version de compatibilité
 * ============================================================================
 * 
 * Version adaptée pour utiliser le store centralisé XState/Zustand.
 * Ce hook permet de suivre l'historique des événements et facilite la synchronisation
 * entre les différentes instances pour le même bot.
 * 
 * @version 2.0.0
 * @deprecated Utilisez directement le hook useFSM qui donne accès à l'état complet
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useFSM } from '../../../hooks/useFSM';
import { useFSMStore } from '../../../stores/useFSMStoreXState';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook centralisé pour l'historique des événements FSM avec synchronisation
 * Version adaptée pour utiliser le store centralisé
 */
export const useCentralizedEventHistorySync = (botId) => {
  // Obtenir les fonctions et l'état directement depuis useFSM (centralisé)
  const { send: originalSend, fsmState: current } = useFSM(botId);
  
  // État local pour l'historique des événements
  const [eventHistory, setEventHistory] = useState([]);
  
  // Références pour le suivi des changements d'état
  const lastStateRef = useRef(current?.name);
  const lastContextRef = useRef(current?.context);

  // Fonction pour ajouter un événement à l'historique local
  const addEventToHistory = useCallback((event) => {
    setEventHistory(prev => [...prev.slice(-99), { 
      ...event, 
      timestamp: Date.now(),
      botId
    }]);
  }, [botId]);
  
  // Fonction pour obtenir l'historique des événements
  const getEventHistory = useCallback(() => eventHistory, [eventHistory]);
  
  // Fonction pour effacer l'historique des événements
  const clearEventHistory = useCallback(() => setEventHistory([]), []);

  // Memoized state name and context string for effect dependencies
  const currentStateName = current?.name;
  const currentContextString = useMemo(() => JSON.stringify(current?.context), [current?.context]);

  // Effet pour suivre les changements d'état
  useEffect(() => {
    console.log('[useCentralizedEventHistorySync] effect fired', { currentStateName, currentContextString, lastState: lastStateRef.current, lastContext: lastContextRef.current });
    // Only proceed if all values are defined
    if (!current || currentStateName === undefined || currentContextString === undefined) return;
    // Only proceed if previous refs are also defined (avoid running on initial undefined)
    if ((lastStateRef.current === undefined && lastContextRef.current === undefined) &&
        (currentStateName === undefined && currentContextString === undefined)) {
      // Both previous and current are undefined, never update
      return;
    }
    // Guard strict : ne rien faire si rien n'a changé
    if (lastStateRef.current === currentStateName && JSON.stringify(lastContextRef.current) === currentContextString) {
      return;
    }
    // Vérifier si l'état a changé
    if (lastStateRef.current !== currentStateName) {
      fsmLogger.info(`[History] State changed for bot ${botId}: ${lastStateRef.current} -> ${currentStateName}`);
      addEventToHistory({
        type: 'STATE_CHANGE',
        fromState: lastStateRef.current || 'unknown',
        toState: currentStateName,
        context: currentContextString
      });
      lastStateRef.current = currentStateName;
    }
    // Vérifier si le contexte a changé
    const lastContextString = JSON.stringify(lastContextRef.current);
    if (currentContextString !== lastContextString) {
      fsmLogger.info(`[History] Context changed for bot ${botId}`);
      addEventToHistory({
        type: 'CONTEXT_UPDATE',
        details: `Context changed`,
        context: currentContextString
      });
      lastContextRef.current = current?.context;
    }
  }, [currentStateName, currentContextString, botId, addEventToHistory]);

  // Wrapper la fonction send pour enregistrer les événements envoyés
  const send = useCallback((eventType, payload = {}) => {
    // Compatible avec le format d'événement de XState v5
    const event = typeof eventType === 'string' 
      ? { type: eventType, ...payload }
      : eventType;
    
    // Ajouter à l'historique
    addEventToHistory({
      type: 'SENT',
      eventName: event.type,
      payload: payload,
      fromState: current?.name || 'unknown'
    });
    
    // Envoyer l'événement via le hook original
    originalSend(event);
  }, [originalSend, addEventToHistory, current]);

  return { send, current, eventHistory, clearHistory: clearEventHistory };
};
