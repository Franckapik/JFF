import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import fsmLogger from '../../logger/fsmLogger.js';

/**
 * Store Zustand pour gérer l'état global des bots FSM
 * 
 * Ce store centralise la gestion des bots actifs et permet
 * la synchronisation entre tous les composants FSM :
 * - MultiBotManagerFSM
 * - FSMDebugPanel  
 * - Autres composants qui auraient besoin de la liste des bots
 */
const useFSMStore = create(
  subscribeWithSelector((set, get) => ({
    // ====================================================================
    // ÉTAT
    // ====================================================================
    
    /** Liste des IDs de bots actifs */
    activeBots: ['fsm-bot-0'],
    
    /** État global du système FSM (running/stopped) */
    isSystemRunning: false,
    
    /** Métriques de performance et statistiques */
    metrics: {
      totalBotsCreated: 1,
      systemStartTime: null,
      lastActivity: Date.now(),
      botStatesSnapshot: {}
    },
    
    /** Configuration globale */
    config: {
      maxBots: 4,
      minBots: 1,
      defaultBotPrefix: 'fsm-bot'
    },
    
    // ====================================================================
    // ACTIONS - GESTION DES BOTS
    // ====================================================================
    
    /**
     * Ajoute un nouveau bot à la liste active
     */
    addBot: () => {
      const state = get();
      
      if (state.activeBots.length >= state.config.maxBots) {
        fsmLogger.info(`Impossible d'ajouter un bot: limite atteinte (${state.config.maxBots})`);
        return;
      }
      
      const newIndex = state.activeBots.length;
      const newBotId = `${state.config.defaultBotPrefix}-${newIndex}`;
      
      set(state => {
        const newActiveBots = [...state.activeBots, newBotId];
        
        fsmLogger.info(`Bot ajouté: ${newBotId}`, {
          totalBots: newActiveBots.length,
          botIds: newActiveBots
        });
        
        return {
          activeBots: newActiveBots,
          metrics: {
            ...state.metrics,
            totalBotsCreated: state.metrics.totalBotsCreated + 1,
            lastActivity: Date.now()
          }
        };
      });
    },
    
    /**
     * Supprime le dernier bot de la liste active
     */
    removeBot: () => {
      const state = get();
      
      if (state.activeBots.length <= state.config.minBots) {
        fsmLogger.info(`Impossible de supprimer un bot: minimum requis (${state.config.minBots})`);
        return;
      }
      
      set(state => {
        const removedBotId = state.activeBots[state.activeBots.length - 1];
        const newActiveBots = state.activeBots.slice(0, -1);
        
        fsmLogger.info(`Bot supprimé: ${removedBotId}`, {
          totalBots: newActiveBots.length,
          botIds: newActiveBots
        });
        
        return {
          activeBots: newActiveBots
        };
      });
    },
    
    /**
     * Remplace complètement la liste des bots actifs
     * @param {string[]} botIds - Nouvelle liste d'IDs de bots
     */
    setBots: (botIds) => {
      fsmLogger.info('Liste des bots mise à jour', {
        oldBots: get().activeBots,
        newBots: botIds
      });
      
      set({ activeBots: [...botIds] });
    },
    
    /**
     * Supprime un bot spécifique par son ID
     * @param {string} botId - ID du bot à supprimer
     */
    removeBotById: (botId) => {
      set(state => {
        const newActiveBots = state.activeBots.filter(id => id !== botId);
        
        fsmLogger.info(`Bot supprimé par ID: ${botId}`, {
          totalBots: newActiveBots.length,
          botIds: newActiveBots
        });
        
        return {
          activeBots: newActiveBots
        };
      });
    },
    
    // ====================================================================
    // ACTIONS - SYSTÈME GLOBAL
    // ====================================================================
    
    /**
     * Démarre le système FSM global
     */
    startSystem: () => {
      const now = Date.now();
      fsmLogger.info('Système FSM démarré');
      set(state => ({
        isSystemRunning: true,
        metrics: {
          ...state.metrics,
          systemStartTime: state.metrics.systemStartTime || now,
          lastActivity: now
        }
      }));
    },
    
    /**
     * Arrête le système FSM global
     */
    stopSystem: () => {
      fsmLogger.info('Système FSM arrêté');
      set({ isSystemRunning: false });
    },
    
    /**
     * Bascule l'état du système FSM
     */
    toggleSystem: () => {
      const currentState = get().isSystemRunning;
      const newState = !currentState;
      
      fsmLogger.info(`Système FSM ${newState ? 'démarré' : 'arrêté'}`);
      set({ isSystemRunning: newState });
    },
    
    // ====================================================================
    // SÉLECTEURS ET UTILITAIRES
    // ====================================================================
    
    /**
     * Retourne le nombre de bots actifs
     */
    getBotCount: () => get().activeBots.length,
    
    /**
     * Vérifie si un bot existe
     * @param {string} botId - ID du bot à vérifier
     */
    hasBotId: (botId) => get().activeBots.includes(botId),
    
    /**
     * Génère un nouvel ID de bot unique
     */
    generateBotId: () => {
      const state = get();
      let index = 0;
      let botId;
      
      // Trouver le prochain index disponible
      do {
        botId = `${state.config.defaultBotPrefix}-${index}`;
        index++;
      } while (state.activeBots.includes(botId));
      
      return botId;
    },

    // ====================================================================
    // MÉTRIQUES ET MONITORING
    // ====================================================================

    /**
     * Met à jour les métriques de performance
     */
    updateMetrics: () => {
      set(state => ({
        metrics: {
          ...state.metrics,
          lastActivity: Date.now()
        }
      }));
    },

    /**
     * Met à jour le snapshot des états des bots
     * @param {Object} statesSnapshot - Object avec botId -> état
     */
    updateBotStatesSnapshot: (statesSnapshot) => {
      set(state => ({
        metrics: {
          ...state.metrics,
          botStatesSnapshot: { ...statesSnapshot },
          lastActivity: Date.now()
        }
      }));
    },

    /**
     * Retourne les métriques actuelles
     */
    getMetrics: () => get().metrics,

    /**
     * Retourne les statistiques de performance du système
     */
    getSystemStats: () => {
      const state = get();
      const now = Date.now();
      const startTime = state.metrics.systemStartTime;
      
      return {
        activeBots: state.activeBots.length,
        totalCreated: state.metrics.totalBotsCreated,
        uptime: startTime ? now - startTime : 0,
        lastActivity: state.metrics.lastActivity,
        systemRunning: state.isSystemRunning,
        botStates: state.metrics.botStatesSnapshot
      };
    },
    
    /**
     * Réinitialise le store à son état initial
     */
    reset: () => {
      fsmLogger.info('Store FSM réinitialisé');
      set({
        activeBots: ['fsm-bot-0'],
        isSystemRunning: false,
        metrics: {
          totalBotsCreated: 1,
          systemStartTime: null,
          lastActivity: Date.now(),
          botStatesSnapshot: {}
        }
      });
    }
  }))
);

// ====================================================================
// ABONNEMENTS ET LOGS
// ====================================================================

// Logger les changements de bots actifs
useFSMStore.subscribe(
  (state) => state.activeBots,
  (activeBots, previousActiveBots) => {
    if (previousActiveBots && activeBots.length !== previousActiveBots.length) {
      fsmLogger.info('Changement dans la liste des bots actifs', {
        from: previousActiveBots,
        to: activeBots,
        count: activeBots.length
      });
    }
  }
);

// Logger les changements d'état du système
useFSMStore.subscribe(
  (state) => state.isSystemRunning,
  (isRunning, wasRunning) => {
    if (wasRunning !== undefined && isRunning !== wasRunning) {
      fsmLogger.info(`Système FSM: ${isRunning ? 'DÉMARRÉ' : 'ARRÊTÉ'}`);
    }
  }
);

export default useFSMStore;
