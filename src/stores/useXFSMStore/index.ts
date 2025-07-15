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
import machineXV5 from '../../ai/fsm/machineX/machine.xstate.v5.ts';
import fsmLogger from '../../logger/fsmLogger.ts';
import type { MachineEvents } from '../../types/events.d.ts';
import type {
  BotId,
  BotSnapshot,
  BotStatesMap,
  EmptyBotState,
  XFSMStore,
  XFSMStoreActions,
  XFSMStoreState
} from '../../types/fsm.d.ts';

// État vide par défaut pour un bot non initialisé
const EMPTY_BOT_STATE: EmptyBotState = { 
  value: 'uninitialized', 
  context: {} 
};

// Store principal Zustand pour la gestion des bots XState
const useXFSMStore = create<XFSMStore>((set, get) => {
  // Map interne des acteurs XState par botId (now using v5)
  const actors = new Map<BotId, Actor<typeof machineXV5>>();
  // Cache des derniers snapshots XState par botId
  const snapshotCache = new Map<BotId, BotSnapshot>();

  /**
   * Crée et enregistre un nouvel acteur XState pour un bot donné
   * (ou retourne l'acteur existant si déjà créé)
   */
  const createBotActor = (botId: BotId): Actor<typeof machineXV5> => {
    if (actors.has(botId)) return actors.get(botId)!;
    const botContext = createMachineContext(botId, 'auto');
    const actor = createActor(machineXV5, { input: botContext });
    
    // Vérifier le statut et l'état initial de l'acteur
    const initialSnapshot = actor.getSnapshot();
    fsmLogger.game(`[XFSMStore] Creation ${botId} - Status: ${initialSnapshot.status}, State: ${initialSnapshot.value}`);
    
    // Enregistrer l'acteur (créé mais pas démarré)
    actors.set(botId, actor);
    
    return actor;
  };

  /**
   * Démarre un acteur XState et s'abonne aux changements
   */
  const startBotActor = (botId: BotId): void => {
    const actor = actors.get(botId);
    if (!actor) {
      fsmLogger.game(`[XFSMStore] No actor found for ${botId}`);
      return;
    }

    const snapshot = actor.getSnapshot();
    
    // Vérifier si l'acteur n'est pas déjà démarré
    if (snapshot && 'status' in snapshot && snapshot.status !== 'active') {
      
      // S'abonner aux changements avant de démarrer l'acteur
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
      
      try {
        actor.start();
        const initialSnapshot = actor.getSnapshot();
        snapshotCache.set(botId, initialSnapshot);
        fsmLogger.game(`[XFSMStore] Demarrage ${botId} - New Status: ${initialSnapshot.status}, State: ${initialSnapshot.value}`);
      } catch (error) {
        fsmLogger.game(`[XFSMStore] Failed to start actor for ${botId}: ${error}`);
      }
    } else {
      fsmLogger.game(`[XFSMStore] Actor ${botId} already running (status: active)`);
    }
  };

  const initialBotStates: BotStatesMap = {};

  // Actions conformes au type XFSMStoreActions
  const storeActions: XFSMStoreActions = {
    /**
     * Envoie un événement à un bot XState
     */
    send: (event: MachineEvents, botId: BotId = 'bot-0'): void => {
      const actor = actors.get(botId);
      if (actor) {
        const botState = snapshotCache.get(botId) || EMPTY_BOT_STATE;
        const currentStateValue = 'value' in botState ? botState.value : 'unknown';
        fsmLogger.event(event.type, { event, botId, currentState: currentStateValue });
        actor.send(event);
      } else {
        fsmLogger.error(`[XFSMStore.send] Acteur non trouvé pour botId: ${botId}`);
      }
    },

    /**
     * Ajoute un nouveau bot XState au store (sans le démarrer)
     */
    addBot: (botId: BotId): void => {
      if (!botId || actors.has(botId)) return;
      createBotActor(botId); // Créer sans démarrer
      const currentState = get();
      const newActiveBots = currentState.activeBots.includes(botId) 
        ? currentState.activeBots 
        : [...currentState.activeBots, botId];
      
      // Créer un état initial simple sans appeler getSnapshot() sur l'acteur non démarré
      const botContext = createMachineContext(botId, 'auto');
      set({
        botStates: {
          ...currentState.botStates,
          [botId]: { value: 'uninitialized', context: botContext },
        },
        activeBots: newActiveBots,
      });
    },

    /**
     * Démarre un bot XState (après que le jeu soit initialisé)
     */
    startBot: (botId: BotId): void => {
      startBotActor(botId);
      const actor = actors.get(botId);
      if (actor) {
        const currentState = get();
        set({
          botStates: {
            ...currentState.botStates,
            [botId]: actor.getSnapshot(),
          },
        });
      }
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
    },

    /**
     * Récupère l'état actuel d'un bot (ou un état vide par défaut)
     */
    getBotState: (botId: BotId = 'bot-0'): BotSnapshot | EmptyBotState => {
      const currentState = get();
      const botState = currentState.botStates[botId];
      return botState || EMPTY_BOT_STATE;
    },
    
    /**
     * Fonction utilitaire pour vérifier si un bot est actif
     */
    isBotActive: (botId: BotId): boolean => {
      const currentState = get();
      return currentState.activeBots.includes(botId);
    }
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
