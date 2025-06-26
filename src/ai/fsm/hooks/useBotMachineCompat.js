/**
 * ============================================================================
 * COMPATIBILITY BOT MACHINE HOOK - Hook de compatibilité pour l'ancien système FSM
 * ============================================================================
 * 
 * ATTENTION: Ce hook est prévu pour la compatibilité uniquement. 
 * Pour tout nouveau code, utilisez directement useFSM.
 * 
 * @version 2.0.0
 * @deprecated Utilisez directement le hook useFSM du dossier hooks/
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useCentralFSMStore } from '../../../stores/useCentralFSMStore';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Hook de compatibilité avec le hook useBotMachine mais qui utilise le store centralisé
 * Cette version élimine la dépendance sur FSMSyncContext pour éviter les erreurs.
 * 
 * @param {string} botId - ID du bot
 * @param {string} entityType - Type d'entité (ignoré, maintenant géré par le store central)
 * @param {Object} options - Options de configuration (ignorées)
 */
export const useBotMachine = (botId = 'main', entityType = 'auto', options = {}) => {
  // Log de dépréciation
  useEffect(() => {
    fsmLogger.info(`[useBotMachine] Ce hook est déprécié, utilisez useFSM pour le bot ${botId}`);
  }, [botId]);
  
  // État local pour suivre l'état du bot
  const [current, setCurrent] = useState(() => useCentralFSMStore.getState().getBotState(botId));
  
  // Références pour simuler les fonctions de synchronisation
  const syncCallbacks = useRef(new Map());
  
  // Fonctions simulées de synchronisation pour la compatibilité
  const registerSyncCallback = useCallback((botId, callback) => {
    if (!syncCallbacks.current.has(botId)) {
      syncCallbacks.current.set(botId, new Set());
    }
    syncCallbacks.current.get(botId).add(callback);
    
    // Fonction de nettoyage
    return () => {
      if (syncCallbacks.current.has(botId)) {
        syncCallbacks.current.get(botId).delete(callback);
      }
    };
  }, []);
  
  // Fonction simulée pour syncEvent
  const syncEvent = useCallback((botId, eventName, eventData) => {
    // Simplement envoyer au store centralisé
    const event = { type: eventName, ...eventData };
    useCentralFSMStore.getState().send(event, botId);
  }, []);
  
  // S'abonner aux changements du store centralisé
  useEffect(() => {
    // S'assurer que le bot existe
    const store = useCentralFSMStore.getState();
    if (!store.botStates || !store.botStates[botId]) {
      store.addBot(botId);
    }
    
    // S'abonner aux changements
    const unsubscribe = useCentralFSMStore.subscribe((state) => {
      if (state.botStates && state.botStates[botId]) {
        setCurrent(state.botStates[botId]);
        
        // Notifier tous les callbacks enregistrés
        if (syncCallbacks.current.has(botId)) {
          syncCallbacks.current.get(botId).forEach(callback => {
            callback('STATE_UPDATED', { state: state.botStates[botId] });
          });
        }
      }
    });
    
    return () => unsubscribe();
  }, [botId]);
  
  // Fonction d'envoi qui propage vers le store central
  const send = useCallback((eventType, eventData = {}) => {
    // Format de l'événement adapté à XState v5
    const event = typeof eventType === 'string' 
      ? { type: eventType, ...eventData }
      : eventType;
      
    // Envoyer au store central
    useCentralFSMStore.getState().send(event, botId);
  }, [botId]);
  
  // Exposer également les fonctions de synchronisation simulées pour compatibilité
  return { 
    current, 
    send,
    // Exposer les fonctions de synchronisation pour que useCentralizedEventHistorySync puisse les utiliser
    registerSyncCallback,
    syncEvent
  };
};

/**
 * Version fixe du hook useBotMachine (alias pour compatibilité)
 */
export const useBotMachineFixed = useBotMachine;

/**
 * Version partagée du hook useBotMachine (alias pour compatibilité)
 */
export const useBotMachineSharedInstance = (botId, entityType) => {
  return useBotMachine(botId, entityType, { useSharedInstance: true });
};
