import { create } from 'zustand';
import { createActor } from 'xstate';
import { machine } from '../../ai/fsm/machine/machine.xstate';
import { createMachineContext } from '../../ai/fsm/machine/context/initialContext';
import zukeeper from 'zukeeper';

// Constante pour un état vide et stable, évite les undefined.
const EMPTY_BOT_STATE = { value: 'uninitialized', context: {} };

const useXFSMStore = create(zukeeper((set, get) => {
  // Map pour stocker les acteurs XState par botId
  const actors = new Map();
  // Map pour mettre en cache la dernière référence de snapshot connue par botId
  const snapshotCache = new Map();

  const createBotActor = (botId) => {
    if (actors.has(botId)) {
      return actors.get(botId);
    }

    const botContext = createMachineContext(botId, 'auto');
    console.log(`[useXFSMStore] Creating actor for ${botId} with initial context:`, botContext);
    
    const actor = createActor(machine, { input: botContext });

    actor.subscribe((snapshot) => {
      const previousSnapshot = snapshotCache.get(botId);
      if (snapshot === previousSnapshot) {
        return; // La référence est identique, aucune mise à jour nécessaire.
      }

      console.log(`[useXFSMStore] Actor update for ${botId}:`, {
        state: snapshot.value,
        contextProps: Object.keys(snapshot.context),
        contextSize: Object.keys(snapshot.context).length
      });

      // Mettre à jour le cache avec la nouvelle référence de snapshot
      snapshotCache.set(botId, snapshot);

      // Mettre à jour l'état Zustand de manière sécurisée.
      set((state) => ({
        botStates: {
          ...(state?.botStates ?? {}), // Si state ou state.botStates est undefined, on part d'un objet vide
          [botId]: snapshot,
        },
      }));
    });

    actors.set(botId, actor);
    actor.start();
    
    // Initialiser le cache avec le premier snapshot
    const initialSnapshot = actor.getSnapshot();
    snapshotCache.set(botId, initialSnapshot);
    console.log(`[useXFSMStore] Initial snapshot for ${botId}:`, {
      state: initialSnapshot.value,
      contextProps: Object.keys(initialSnapshot.context),
      contextSize: Object.keys(initialSnapshot.context).length
    });

    return actor;
  };

  // Créer l'acteur principal au démarrage (bot-0 par défaut)
  // FORCE RECREATION après correctif de la machine pour s'assurer que bot-0 utilise la nouvelle configuration
  
  // Nettoyer les anciens acteurs et cache pour forcer la recréation
  if (actors.has('bot-0')) {
    const oldActor = actors.get('bot-0');
    oldActor.stop();
    actors.delete('bot-0');
    snapshotCache.delete('bot-0');
  }
  
  const mainActor = createBotActor('bot-0');

  // État initial avec les snapshots synchronisés
  const initialBotStates = {
    'bot-0': mainActor.getSnapshot(),
  };

  return {
    // État initial synchronisé avec le cache
    botStates: initialBotStates,
    
    // Liste des IDs de bots actifs
    activeBots: ['bot-0'],

    // Action pour envoyer un événement à un bot
    send: (event, botId = 'bot-0') => {
      console.log(`[useXFSMStore] Sending event to ${botId}:`, event);
      const actor = actors.get(botId);
      if (actor) {
        actor.send(event);
      } else {
        console.warn(`[useXFSMStore] Attempted to send event to non-existent bot: ${botId}`);
      }
    },

    // Action pour ajouter un nouveau bot
    addBot: (botId) => {
      if (!botId || actors.has(botId)) return;
      const newActor = createBotActor(botId);
      // Utiliser get() pour la mise à jour afin de garantir la cohérence
      const currentState = get();
      const newActiveBots = currentState.activeBots.includes(botId) 
        ? currentState.activeBots 
        : [...currentState.activeBots, botId];
      
      set({
        botStates: {
          ...currentState.botStates,
          [botId]: newActor.getSnapshot(),
        },
        activeBots: newActiveBots,
      });
    },

    // Action pour supprimer un bot
    removeBot: (botId) => {
      if (botId === 'bot-0' || !actors.has(botId)) return;
      
      const actor = actors.get(botId);
      actor.stop();
      actors.delete(botId);
      snapshotCache.delete(botId);

      // Utiliser get() pour la mise à jour
      const currentState = get();
      const { [botId]: _, ...rest } = currentState.botStates;
      const newActiveBots = currentState.activeBots.filter(id => id !== botId);
      
      set({ 
        botStates: rest,
        activeBots: newActiveBots,
      });
    },

    // Fonction helper pour récupérer un état depuis le store Zustand
    // Utilise les botStates du store au lieu du cache interne
    getBotState: (botId = 'bot-0') => {
      const currentState = get();
      const botState = currentState.botStates[botId];
      
      console.log(`[getBotState] Requesting state for ${botId}:`, {
        hasStateInStore: !!botState,
        storeKeys: Object.keys(currentState.botStates),
        storeSize: Object.keys(currentState.botStates).length,
        contextSize: botState?.context ? Object.keys(botState.context).length : 0,
        fallbackUsed: !botState
      });
      
      const result = botState || EMPTY_BOT_STATE;
      
      console.log(`[getBotState] Returning for ${botId}:`, {
        hasResult: !!result,
        resultType: typeof result,
        resultValue: result?.value,
        resultContextSize: result?.context ? Object.keys(result.context).length : 0
      });
      
      return result;
    },
  };
}));

window.store = useXFSMStore; // Exposer le store globalement pour un accès facile

export default useXFSMStore;