import { useEffect, useState } from 'react';

import useXFSMStore from '../stores/useXFSMStore';
import type { FSMContext } from '../types/fsm';
import type { XFSMStoreType } from '../types/stores';

// Type guard pour vérifier si l'état du bot contient un contexte
const hasContext = (botState: unknown): botState is { context: FSMContext } => {
  return botState !== null && typeof botState === 'object' && 'context' in botState;
};

/**
 * Hook personnalisé qui surveille les changements d'état FSM et force les re-renders
 */
export const useFSMState = (botId?: string) => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  // Sélecteurs du store
  const activeBots = useXFSMStore((state: XFSMStoreType) => state.activeBots);
  const botStates = useXFSMStore((state: XFSMStoreType) => state.botStates);
  
  // Détermine quel bot surveiller
  const targetBotId = botId || (activeBots.length > 0 ? activeBots[0] : null);
  const botState = targetBotId ? botStates[targetBotId] : null;
  const context = hasContext(botState) ? botState.context : null;
  
  // Force une mise à jour périodique
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 500); // Mise à jour toutes les 500ms
    
    return () => clearInterval(interval);
  }, []);
  
  // Surveille les changements du bot state
  useEffect(() => {
    setLastUpdate(Date.now());
  }, [botState, context?.fsmState, context?.lastAction]);
  
  return {
    activeBots,
    botId: targetBotId,
    context,
    fsmState: context?.fsmState || 'unknown',
    lastAction: context?.lastAction || 'none',
    entityType: context?.entityType || 'unknown',
    lastUpdate,
    isActive: targetBotId ? activeBots.includes(targetBotId) : false
  };
};
