import { create } from 'zustand';
import { createActor } from 'xstate';
import { machine } from '../../ai/fsm/machine/machine.xstate';
import { createEntityContext } from '../../ai/fsm/machine/context/initialContext';

// Constante pour un état vide et stable, évite les undefined.
const EMPTY_BOT_STATE = { value: 'uninitialized', context: {} };

export const useXFSMStore = create((set, get) => {
  // Map pour stocker les acteurs XState par botId
  const actors = new Map();
  // Map pour mettre en cache la dernière référence de snapshot connue par botId
  const snapshotCache = new Map();

  const createBotActor = (botId) => {
    if (actors.has(botId)) {
      return actors.get(botId);
    }

    const botContext = createEntityContext(botId, 'auto');
    const actor = createActor(machine, { input: botContext });

    actor.subscribe((snapshot) => {
      const previousSnapshot = snapshotCache.get(botId);
      if (snapshot === previousSnapshot) {
        return; // La référence est identique, aucune mise à jour nécessaire.
      }

      // Mettre à jour le cache avec la nouvelle référence de snapshot
      snapshotCache.set(botId, snapshot);

      // Mettre à jour l'état Zustand de manière sécurisée.
      // On utilise la forme fonctionnelle de `set` car l'état (`state`)
      // peut être `undefined` lors du tout premier appel synchrone
      // pendant l'initialisation du store.
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

    return actor;
  };

  // Créer l'acteur principal au démarrage (bot-0 par défaut)
  const mainActor = createBotActor('bot-0');

  return {
    // État initial
    botStates: {
      'bot-0': mainActor.getSnapshot(),
    },
    
    // Liste des IDs de bots actifs
    activeBots: ['bot-0'],

    // Action pour envoyer un événement à un bot
    send: (event, botId = 'bot-0') => {
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

    // Sélecteur interne pour obtenir l'état d'un bot.
    // C'est la fonction la plus critique pour la stabilité.
    getBotState: (botId = 'bot-0') => {
      // On retourne TOUJOURS depuis le cache pour garantir une référence stable.
      return snapshotCache.get(botId) || EMPTY_BOT_STATE;
    },
  };
});
