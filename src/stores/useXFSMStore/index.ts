/*
 * XFSM Zustand Store (TypeScript)
 * --------------------------------
 * Gère la création, la synchronisation et le contrôle des bots XState.
 * Fournit :
 *   - addBot, removeBot, send, getBotState
 *   - Synchronisation automatique des snapshots XState
 */
import { createBrowserInspector } from '@statelyai/inspect';
import { createActor, type Actor } from 'xstate';
import { create } from 'zustand';

import { createBroadcastChannel } from '../../ai/fsm/broadcast.ts';
import { createMachineContext } from '../../ai/fsm/machineX/context/initialContext.ts';
import type { MachineEvents } from '../../ai/fsm/machineX/events.pure.v5';
import { machineXV5Pure } from '../../ai/fsm/machineX/machine.pure.v5';
import { config } from '../../config.ts';
import fsmLogger from '../../logger/fsmLogger.ts';
// ✅ Phase 2: Import TileStore for grid sync
import { useTileStore } from '../useTileStore/index.ts';
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

const inspector = config.enableXStateInspection ? createBrowserInspector() : null;

// Log du statut de l'inspection
if (config.enableXStateInspection) {
  fsmLogger.game('[XFSMStore] XState inspection activée');
} else {
  fsmLogger.game('[XFSMStore] XState inspection désactivée');
}

// Store principal Zustand pour la gestion des bots XState
const useXFSMStore = create<XFSMStore>((set, get) => {
  // Map interne des acteurs XState par botId (now using v5 pure)
  const actors = new Map<BotId, Actor<typeof machineXV5Pure>>();
  // Cache des derniers snapshots XState par botId
  const snapshotCache = new Map<BotId, BotSnapshot>();
  // Track des acteurs démarrés (XState v5 fix)
  const startedActors = new Set<BotId>();
  
  // Broadcast channel pour diffuser les états XState
  const broadcast = createBroadcastChannel();

  /**
   * Crée et enregistre un nouvel acteur XState pour un bot donné
   * (ou retourne l'acteur existant si déjà créé)
   * ✅ Phase 7 (Option C): Pre-initialize context with valid positions from depart tile
   */
  const createBotActor = (botId: BotId): Actor<typeof machineXV5Pure> => {
    if (actors.has(botId)) return actors.get(botId)!;
    
    // ✅ Get depart tile BEFORE creating context to avoid race condition
    const tileStore = useTileStore.getState();
    const { tiles, spacing, radius } = tileStore;
    
    let departTile = null;
    let initialPosition = { x: 0, y: 0.5, z: 0, coord: '0,0' };
    
    if (tiles && Object.keys(tiles).length > 0) {
      departTile = Object.values(tiles).find(
        tile => tile.type === 'depart' && tile.assignedToBot === botId
      );
      
      if (departTile) {
        initialPosition = {
          x: departTile.position.x,
          y: 0.5,
          z: departTile.position.z,
          coord: departTile.position.coord
        };
        fsmLogger.game(`[XFSMStore] Pre-initializing ${botId} at depart tile ${departTile.position.coord}`);
      }
    }
    
    // ✅ Create context with positions already set (fixes areAllEntitiesInitialized guard)
    const baseContext = createMachineContext(botId, 'auto');
    const botContext = {
      ...baseContext,
      vehicle: {
        ...baseContext.vehicle,
        position: initialPosition,
        basePosition: initialPosition,
      },
      droneFleet: {
        ...baseContext.droneFleet,
        drones: {
          explorer: {
            ...baseContext.droneFleet.drones.explorer,
            position: initialPosition,
          }
        }
      },
      // ✅ Inject grid info immediately
      gridInfo: tiles ? {
        tiles,
        spacing: spacing ?? 1.2,
        radius: radius ?? 3,
        departTileCoord: departTile?.position?.coord,
        syncedAt: Date.now(),
      } : baseContext.gridInfo
    };
    
    // Configuration conditionnelle de l'inspection
    const actorConfig = { 
      input: botContext,
      ...(inspector && { inspect: inspector.inspect })
    };
    
    const actor = createActor(machineXV5Pure, actorConfig);
    
    // Vérifier le statut et l'état initial de l'acteur
    const initialSnapshot = actor.getSnapshot();
    
    // Debug: afficher le type et le contenu de value
    const stateValue = initialSnapshot.value;
    const stateDisplay = typeof stateValue === 'string' ? stateValue : JSON.stringify(stateValue);
    fsmLogger.game(`[XFSMStore] Creation ${botId} - Status: ${initialSnapshot.status}, State: ${stateDisplay}, Context has positions: vehicle=${!!initialSnapshot.context.vehicle?.position}, drone=${!!initialSnapshot.context.droneFleet?.drones?.explorer?.position}`);
    
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

    // Vérifier si l'acteur n'est pas déjà démarré (XState v5 fix)
    if (!startedActors.has(botId)) {
      startedActors.add(botId);
      
      // S'abonner aux changements avant de démarrer l'acteur
      actor.subscribe((snapshot: BotSnapshot) => {
        const previousSnapshot = snapshotCache.get(botId);
        if (snapshot === previousSnapshot) return;
        snapshotCache.set(botId, snapshot);
        
        // Mise à jour du store Zustand
        set((state) => ({
          botStates: {
            ...(state?.botStates ?? {}),
            [botId]: snapshot,
          },
        }));

        // Broadcast du snapshot pour le viewer
        const snapshotData = snapshot as { value?: unknown; context?: Record<string, unknown> };
        broadcast?.post({
          type: 'STATE_UPDATE',
          botId,
          snapshot: {
            value: snapshotData.value ?? 'unknown',
            context: snapshotData.context ?? {},
            status: snapshot.status
          }
        });
      });
      
      try {
        actor.start();
        const initialSnapshot = actor.getSnapshot();
        snapshotCache.set(botId, initialSnapshot);
        
        // Debug: afficher le type et le contenu de value après démarrage
        const stateValue = initialSnapshot.value;
        const stateDisplay = typeof stateValue === 'string' ? stateValue : JSON.stringify(stateValue);
        fsmLogger.game(`[XFSMStore] Demarrage ${botId} - New Status: ${initialSnapshot.status}, State: ${stateDisplay}, StateType: ${typeof stateValue}`);
      } catch (error) {
        fsmLogger.game(`[XFSMStore] Failed to start actor for ${botId}: ${error}`);
      }
    } else {
      fsmLogger.game(`[XFSMStore] Actor ${botId} already started`);
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
     * ✅ Phase 7: Simplified - positions and gridInfo already injected in createBotActor()
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
        
        fsmLogger.game(`[XFSMStore] Bot ${botId} started with pre-initialized context`);
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
      startedActors.delete(botId); // Nettoyer le flag de démarrage
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

  // Gestionnaire pour les requêtes du viewer (REQUEST_SYNC)
  if (broadcast?.channel) {
    broadcast.channel.onmessage = (ev: MessageEvent) => {
      const data = ev.data;
      if (!data || data.type !== 'REQUEST_SYNC') return;
      
      const targetBot = data.botId ?? 'bot-0';
      const snapshot = snapshotCache.get(targetBot);
      
      if (snapshot) {
        const snapshotData = snapshot as { value?: unknown; context?: Record<string, unknown> };
        broadcast.post({
          type: 'STATE_UPDATE',
          botId: targetBot,
          snapshot: {
            value: snapshotData.value ?? 'unknown',
            context: snapshotData.context ?? {},
            status: snapshot.status
          }
        });
      }
    };
  }

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
