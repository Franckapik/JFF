/**
 * ============================================================================
 * FSM SYNC CONTEXT - Système de synchronisation pour instances FSM multiples
 * ============================================================================
 * 
 * Solution alternative : au lieu de partager une instance unique,
 * synchronise les états entre toutes les instances FSM pour le même bot.
 * 
 * @version 1.0.0
 */

import React, { createContext, useContext, useRef, useCallback } from 'react';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Contexte pour synchroniser les états FSM
 */
const FSMSyncContext = createContext(null);

/**
 * Provider pour synchroniser les machines FSM
 */
export const FSMSyncProvider = ({ children }) => {
  // Map pour stocker les callbacks de synchronisation par botId
  const syncCallbacksRef = useRef(new Map());
  
  /**
   * Enregistre un callback de synchronisation pour un bot
   */
  const registerSyncCallback = useCallback((botId, callback) => {
    if (!syncCallbacksRef.current.has(botId)) {
      syncCallbacksRef.current.set(botId, new Set());
    }
    
    syncCallbacksRef.current.get(botId).add(callback);
    
    fsmLogger.info(`[FSMSync] Registered sync callback for bot: ${botId} (total: ${syncCallbacksRef.current.get(botId).size})`);
    
    // Retourner une fonction de nettoyage
    return () => {
      if (syncCallbacksRef.current.has(botId)) {
        syncCallbacksRef.current.get(botId).delete(callback);
        if (syncCallbacksRef.current.get(botId).size === 0) {
          syncCallbacksRef.current.delete(botId);
        }
      }
    };
  }, []);
  
  /**
   * Synchronise un événement vers toutes les instances d'un bot
   */
  const syncEvent = useCallback((botId, eventName, eventData) => {
    const callbacks = syncCallbacksRef.current.get(botId);
    if (callbacks) {
      fsmLogger.info(`[FSMSync] Syncing event ${eventName} to ${callbacks.size} instances of bot ${botId}`);
      callbacks.forEach(callback => {
        try {
          callback(eventName, eventData);
        } catch (error) {
          fsmLogger.error(`[FSMSync] Error syncing event to bot ${botId}:`, error);
        }
      });
    }
  }, []);
  
  /**
   * Synchronise un changement de contexte vers toutes les instances d'un bot
   */
  const syncContextUpdate = useCallback((botId, contextUpdate) => {
    const callbacks = syncCallbacksRef.current.get(botId);
    if (callbacks) {
      fsmLogger.info(`[FSMSync] Syncing context update to ${callbacks.size} instances of bot ${botId}`);
      callbacks.forEach(callback => {
        try {
          callback('CONTEXT_UPDATE', contextUpdate);
        } catch (error) {
          fsmLogger.error(`[FSMSync] Error syncing context to bot ${botId}:`, error);
        }
      });
    }
  }, []);
  
  const value = {
    registerSyncCallback,
    syncEvent,
    syncContextUpdate,
    getInstanceCount: (botId) => syncCallbacksRef.current.get(botId)?.size || 0
  };
  
  return (
    <FSMSyncContext.Provider value={value}>
      {children}
    </FSMSyncContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de synchronisation FSM
 */
export const useFSMSync = () => {
  const context = useContext(FSMSyncContext);
  if (!context) {
    throw new Error('useFSMSync must be used within an FSMSyncProvider');
  }
  return context;
};

export default FSMSyncContext;
