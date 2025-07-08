/*
 * XFSM Zustand Store (TypeScript)
 * --------------------------------
 * Gère la création, la synchronisation et le contrôle des bots XState.
 * Fournit :
 *   - addBot, removeBot, send, getBotState
 *   - Synchronisation automatique des snapshots XState
 */
import { createActor, type Actor } from 'xstate';
import { create } from 'zustand';
import { createMachineContext } from '../../ai/fsm/machineX/context/initialContext.ts';
import { machineX } from '../../ai/fsm/machineX/machine.xstate';
import fsmLogger from '../../logger/fsmLogger';
import type {
    BotId,
    BotSnapshot,
    BotStatesMap,
    EmptyBotState,
    XFSMStore,
    XFSMStoreActions,
    XFSMStoreState
} from '../../types/fsm';

// État vide par défaut pour un bot non initialisé
const EMPTY_BOT_STATE: EmptyBotState = { 
  value: 'uninitialized', 
  context: {} 
};

// Store principal Zustand pour la gestion des bots XState
const useXFSMStore = create<XFSMStore>((set, get) => {
  // Map interne des acteurs XState par botId
  const actors = new Map<BotId, Actor<any>>();
  // Cache des derniers snapshots XState par botId
  const snapshotCache = new Map<BotId, BotSnapshot>();

  /**
   * Crée et enregistre un nouvel acteur XState pour un bot donné
   * (ou retourne l'acteur existant si déjà créé)
   */
  const createBotActor = (botId: BotId): Actor<any> => {
    if (actors.has(botId)) return actors.get(botId)!;
    const botContext = createMachineContext(botId, 'auto');
    const actor = createActor(machineX, { input: botContext });
    actor.subscribe((snapshot: BotSnapshot) => {
      const previousSnapshot = snapshotCache.get(botId);
      if (snapshot === previousSnapshot) return;
      snapshotCache.set(botId, snapshot);
      set((state) => ({
        botStates: {
          ...(state?.botStates ?? {}),
          [botId]: snapshot,
        },
      }));
    });
    actors.set(botId, actor);
    actor.start();
    const initialSnapshot = actor.getSnapshot();
    snapshotCache.set(botId, initialSnapshot);
    return actor;
  };

  const initialBotStates: BotStatesMap = {};

  // Actions conformes au type XFSMStoreActions
  const storeActions: XFSMStoreActions = {
    /**
     * Envoie un événement à un bot XState
     */
    send: (event: any, botId: BotId = 'bot-0'): void => {
      const actor = actors.get(botId);
      if (actor) {
        const botState = snapshotCache.get(botId) || EMPTY_BOT_STATE;
        const currentStateValue = 'value' in botState ? botState.value : 'unknown';
        fsmLogger.event(event.type, { event, botId, currentState: currentStateValue });
        actor.send(event);
      } else {
        fsmLogger.warn(`[XFSMStore.send] Acteur non trouvé pour botId: ${botId}`);
      }
    },

    /**
     * Ajoute un nouveau bot XState au store
     */
    addBot: (botId: BotId): void => {
      if (!botId || actors.has(botId)) return;
      const newActor = createBotActor(botId);
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

    /**
     * Supprime un bot XState du store
     */
    removeBot: (botId: BotId): void => {
      if (!actors.has(botId)) return;
      const actor = actors.get(botId);
      if (actor) actor.stop();
      actors.delete(botId);
      snapshotCache.delete(botId);
      const currentState = get();
      const { [botId]: _, ...rest } = currentState.botStates;
      const newActiveBots = currentState.activeBots.filter(id => id !== botId);
      set({ 
        botStates: rest,
        activeBots: newActiveBots,
      });
      fsmLogger.game('[XFSMStore.removeBot]', { botId, remainingBots: newActiveBots.length });
    },

    /**
     * Récupère l'état actuel d'un bot (ou un état vide par défaut)
     */
    getBotState: (botId: BotId = 'bot-0'): BotSnapshot | EmptyBotState => {
      const currentState = get();
      const botState = currentState.botStates[botId];
      return botState || EMPTY_BOT_STATE;
    },
  };

  // État initial conforme au type XFSMStoreState
  const initialState: XFSMStoreState = {
    botStates: initialBotStates,
    activeBots: [] as BotId[],
  };

  // Retourne le store complet (état + actions)
  return {
    ...initialState,
    ...storeActions,
  } as XFSMStore;
});

export default useXFSMStore;
