import { useFSMStore } from '../stores/useFSMStoreXState';
import { useCallback, useMemo } from 'react';

/**
 * Hook complet pour interagir avec une machine d'état XState via Zustand.
 * Cette version encapsule toute la logique Zustand pour éviter les boucles infinies
 * et fournit une API stable pour les composants.
 * @param {string} botId - L'ID du bot à contrôler (par défaut: 'main').
 */
export function useFSM(botId = 'main') {
  // Log pour tracer les rendus du hook. Si ce message apparaît en boucle,
  // le problème se situe en amont (store) ou en aval (composant).
  // console.log(`[useFSM] Hook rendering for botId: ${botId}`); // Debug log désactivé

  // 1. Sélecteur mémorisé pour l'état du bot.
  const botStateSelector = useCallback(
    (store) => store.getBotState(botId),
    [botId]
  );

  const botState = useFSMStore(botStateSelector);

  // 2. Sélecteur mémorisé pour les actions globales du store
  const actionsSelector = useCallback((store) => ({
    addBot: store.addBot,
    removeBot: store.removeBot,
    startSystem: store.startSystem,
    stopSystem: store.stopSystem,
    toggleSystem: store.toggleSystem,
    getBotCount: store.getBotCount,
    updateBotStatesSnapshot: store.updateBotStatesSnapshot,
    activeBots: store.activeBots,
    isSystemRunning: store.isSystemRunning
  }), []);

  const actions = useFSMStore(actionsSelector);

  // 3. Extraction de l'état FSM et du contexte avec sécurité
  const fsmState = botState?.actor?.getSnapshot() || null;
  const context = fsmState?.context || {};

  // 4. Mémorisation de la fonction send
  const send = useCallback(
    (event) => {
      if (botState?.actor) {
        botState.actor.send(event);
      }
    },
    [botState?.actor]
  );

  // 5. Mémorisation de la fonction isIn
  const isIn = useCallback(
    (stateValue) => {
      return fsmState?.matches(stateValue) ?? false;
    },
    [fsmState]
  );

  // 6. Retourner une API complète et stable
  return { 
    // État FSM
    fsmState, 
    context, 
    send, 
    isIn,
    
    // Propriétés globales
    botIds: actions.activeBots || [],
    isSystemRunning: actions.isSystemRunning || false,
    botCount: actions.getBotCount ? actions.getBotCount() : 0,
    
    // Actions
    addBot: actions.addBot,
    removeBot: actions.removeBot,
    startSystem: actions.startSystem,
    stopSystem: actions.stopSystem,
    toggleSystem: actions.toggleSystem,
    getBotCount: actions.getBotCount,
    updateBotStatesSnapshot: actions.updateBotStatesSnapshot
  };
}
