/**
 * ============================================================================
 * FSM EVENT HISTORY HOOK - Hook pour accéder à l'historique centralisé
 * ============================================================================
 * 
 * Hook utilitaire qui expose les fonctionnalités d'historique des événements
 * du FSM Store de manière ergonomique.
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { useCallback } from 'react';
import useFSMStore from './index.js';

/**
 * Hook pour accéder à l'historique des événements FSM centralisé
 * 
 * @returns {Object} Interface pour gérer l'historique des événements
 */
export const useFSMEventHistory = () => {
  const addEventToHistory = useFSMStore(state => state.addEventToHistory);
  const getEventHistory = useFSMStore(state => state.getEventHistory);
  const clearEventHistory = useFSMStore(state => state.clearEventHistory);
  const eventHistory = useFSMStore(state => state.metrics.eventHistory);

  // Actions avec callbacks optimisés
  const addEvent = useCallback((botId, eventData) => {
    addEventToHistory(botId, eventData);
  }, [addEventToHistory]);

  const getHistory = useCallback((botId = null) => {
    return getEventHistory(botId);
  }, [getEventHistory]);

  const clearHistory = useCallback((botId = null) => {
    clearEventHistory(botId);
  }, [clearEventHistory]);

  const getGlobalStats = useCallback(() => {
    return {
      totalEvents: eventHistory.events.length,
      eventsByBot: Object.keys(eventHistory.byBot).reduce((acc, botId) => {
        acc[botId] = eventHistory.byBot[botId].length;
        return acc;
      }, {}),
      maxEvents: eventHistory.maxEvents,
      activeBots: Object.keys(eventHistory.byBot).length
    };
  }, [eventHistory]);

  return {
    // Actions principales
    addEvent,
    getHistory,
    clearHistory,
    
    // Accès direct aux données
    eventHistory: eventHistory.events,
    eventsByBot: eventHistory.byBot,
    maxEvents: eventHistory.maxEvents,
    
    // Utilitaires
    getGlobalStats,
    
    // Fonctions de convenance
    getBotHistory: (botId) => getHistory(botId),
    clearBotHistory: (botId) => clearHistory(botId),
    clearAllHistory: () => clearHistory()
  };
};

export default useFSMEventHistory;
