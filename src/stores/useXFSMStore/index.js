import { create } from 'zustand';
import { createActor } from 'xstate';
import { machineX } from '../../ai/fsm/machineX/machine.xstate';
import { createMachineContext } from '../../ai/fsm/machineX/context/initialContext';
import zukeeper from 'zukeeper';
import fsmLogger from '../../logger/fsmLogger';

// Constante pour un état vide et stable, évite les undefined.
const EMPTY_BOT_STATE = { value: 'uninitialized', context: {} };

const useXFSMStore = create((set, get) => {
  // Map pour stocker les acteurs XState par botId
  const actors = new Map();
  // Map pour mettre en cache la dernière référence de snapshot connue par botId
  const snapshotCache = new Map();

  const createBotActor = (botId) => {
    if (actors.has(botId)) {
      return actors.get(botId);
    }

    const botContext = createMachineContext(botId, 'auto');
    
    const actor = createActor(machineX, { input: botContext });

    actor.subscribe((snapshot) => {
      const previousSnapshot = snapshotCache.get(botId);
      if (snapshot === previousSnapshot) {
        return; // La référence est identique, aucune mise à jour nécessaire.
      }

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

    return actor;
  };

  // --- SUPPRESSION DE LA CRÉATION AUTOMATIQUE DE bot-0 ---
  // Aucun bot n'est créé au démarrage

  // État initial vide
  const initialBotStates = {};

  return {
    // État initial synchronisé avec le cache
    botStates: initialBotStates,
    
    // Liste des IDs de bots actifs
    activeBots: [],

    // Action pour envoyer un événement à un bot
    send: (event, botId = 'bot-0') => {
      const actor = actors.get(botId);
      if (actor) {
        const botState = snapshotCache.get(botId) || EMPTY_BOT_STATE;
        fsmLogger.event(event.type, { event, botId, currentState: botState.value });
        actor.send(event);
      } else {
        console.warn('📨 [XFSMStore.send] No actor found for botId:', botId);
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

      fsmLogger.game('[XFSMStore.addBot]', { botId, activeBots: newActiveBots.length });
    },

    // Action pour supprimer un bot
    removeBot: (botId) => {
      if (!actors.has(botId)) return;
      
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
      
      const result = botState || EMPTY_BOT_STATE;
      
      return result;
    },
  };
});


export default useXFSMStore;