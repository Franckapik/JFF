import  useXFSMStore  from '../stores/useXFSMStore';
import { useCallback, useMemo, useEffect } from 'react';
import { getBotId } from '../ai/fsm/machine/constants/constants';

/**
 * Hook complet pour interagir avec une machine d'état XState via Zustand.
 * Version unifiée qui encapsule toute la logique pour éviter les boucles infinies.
 * @param {string} botId - L'ID du bot à contrôler (par défaut: 'bot-0').
 */
export function useXFSM(botId = getBotId(0)) {
  // 1. Sélecteur optimisé pour l'état du bot - Utilise directement botStates
  const botState = useXFSMStore((store) => {
    if (!store?.botStates) {
      console.warn(`[useXFSM] Store botStates is missing for ${botId}`);
      return null;
    }
    const state = store.botStates[botId];
    console.log(`[useXFSM] Selector receiving state for ${botId}:`, {
      hasState: !!state,
      stateValue: state?.value,
      contextSize: state?.context ? Object.keys(state.context).length : 0,
      fullState: state,
      allBotIds: Object.keys(store.botStates || {})
    });
    return state;
  });

  // 2. Sélecteurs stables pour les propriétés globales
  const activeBots = useXFSMStore((store) => store.activeBots);
  const addBot = useXFSMStore((store) => store.addBot);
  const removeBot = useXFSMStore((store) => store.removeBot);
  const send = useXFSMStore((store) => store.send);

  // 3. Extraction de l'état FSM et du contexte avec sécurité
  const fsmState = botState || { value: 'uninitialized', context: {} };
  const context = fsmState.context || {};

  // 4. Log du contexte lors des changements
  useEffect(() => {
    console.log(`[useXFSM] Context for ${botId} updated:`, {
      contextKeys: Object.keys(context),
      contextSize: Object.keys(context).length,
      entityId: context?.entityId || "missing",
      entityType: context?.entityType || "missing"
    });
  }, [context, botId]);

  // 5. Mémorisation de la fonction send spécifique au bot
  const sendToBots = useCallback(
    (event) => {
      console.log(`[useXFSM] Sending event via hook to ${botId}:`, event);
      send(event, botId);
    },
    [send, botId]
  );

  // 6. Mémorisation de la fonction isIn
  const isIn = useCallback(
    (stateValue) => {
      return fsmState?.value === stateValue || fsmState?.matches?.(stateValue) || false;
    },
    [fsmState]
  );

  // 7. Retourner une API complète et stable
  return { 
    // État FSM
    fsmState, 
    context, 
    send: sendToBots, 
    isIn,
    
    // Propriétés globales
    botIds: activeBots || [],
    botCount: activeBots?.length || 0,
    
    // Actions
    addBot,
    removeBot
  };
}
