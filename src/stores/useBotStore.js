// src/stores/useBotStore.js
// Machine à états finis simplifiée avec file d'actions bloquantes
import { create } from 'zustand';
import usePlayerStore from './usePlayerStore';
import { useTileStore } from './useNewTileStore';

// Importations des modules FSM
import { BOT_STATES, PRIORITY } from '../ai/constants/botConstants';
import { BotActions } from '../ai/fsm/actions/botActions';
import { BotConditions } from '../ai/fsm/conditions/botConditions';
import { BotStateConfig } from '../ai/fsm/states/botStates';
import fsmLogger from '../utils/fsmLogger';

// Statuts d'action
const ACTION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Store bot avec file d'actions bloquantes
const useBotStore = create((set, get) => ({
  // État initial du bot
  botState: BOT_STATES.IDLE,
  isRunning: false,
  
  // File d'actions avec priorités et statuts
  actionQueue: [], // [{type, priority, params, timestamp, status}]
  
  // Historique des actions pour débogage
  actionHistory: [], // [{type, status, timestamp, completedAt}]
  
  // Fonction d'initialisation - démarre le bot
  initializeBot: () => {
    fsmLogger.info("Initializing bot FSM");
    set({
      botState: BOT_STATES.IDLE,
      isRunning: true,
      actionQueue: [],
      actionHistory: []
    });
    
    // Exécute l'action onEnterState de l'état initial
    const playerStore = usePlayerStore.getState();
    if (BotStateConfig[BOT_STATES.IDLE]?.onEnterState) {
      BotStateConfig[BOT_STATES.IDLE].onEnterState(playerStore);
    }
    
    // Ajouter l'action de test en premier avec priorité URGENT
    get().addAction('testQueue', PRIORITY.URGENT);
    
    // Ajouter l'action d'exploration après le test
    get().addAction('exploreDrone', PRIORITY.HIGH);
    
    // Finalement ajouter l'action d'évaluation avec priorité normale
    get().addAction('evaluateIdle', PRIORITY.MEDIUM);
    
    fsmLogger.state("Bot initialized in IDLE state with testQueue action");
  },
  
  // Change l'état du bot
  changeState: (newState) => {
    const currentState = get().botState;
    
    // Si on est déjà dans l'état demandé, ne rien faire
    if (currentState === newState) return;
    
    // Récupérer les configurations pour les états actuel et nouveau
    const currentStateConfig = BotStateConfig[currentState];
    const newStateConfig = BotStateConfig[newState];
    
    fsmLogger.state(`Transition: ${currentState} → ${newState}`);
    
    // Exécuter la fonction de sortie d'état si définie
    if (currentStateConfig?.onExitState) {
      try {
        const playerStore = usePlayerStore.getState();
        currentStateConfig.onExitState(playerStore, get().changeState, newState);
      } catch (error) {
        fsmLogger.error(`Error in exit handler for state ${currentState}:`, error);
      }
    }
    
    // Définir le nouvel état et vider la file d'actions
    set({ 
      botState: newState,
      actionQueue: [] // Vider la file d'action à chaque changement d'état
    });
    
    // Exécuter la fonction d'entrée dans le nouvel état si définie
    if (newStateConfig?.onEnterState) {
      try {
        const playerStore = usePlayerStore.getState();
        newStateConfig.onEnterState(playerStore);
      } catch (error) {
        fsmLogger.error(`Error in entry handler for state ${newState}:`, error);
      }
    }
  },
  
  // Retourner à l'état IDLE avec une raison
  returnToIdle: (reason) => {
    fsmLogger.state(`Returning to IDLE state: ${reason}`);
    get().changeState(BOT_STATES.IDLE);
  },
  
  // Ajoute une action à la file d'attente avec priorité et statut
  addAction: (actionType, priority = PRIORITY.MEDIUM, params = {}) => {
    // Vérifie si l'action existe dans le registre
    if (!BotActions.actionMap[actionType]) {
      fsmLogger.error(`Unknown action type: ${actionType}`);
      return;
    }
    
    const newAction = {
      type: actionType,
      priority,
      params,
      timestamp: Date.now(),
      status: ACTION_STATUS.PENDING
    };
    
    fsmLogger.action(`Adding action to queue: ${actionType}`, { priority });
    
    // Insérer l'action dans la file et trier par priorité
    set((state) => {
      const updatedQueue = [...state.actionQueue, newAction]
        .sort((a, b) => {
          // D'abord par priorité (ordre décroissant)
          if (b.priority !== a.priority) return b.priority - a.priority;
          // Ensuite par timestamp (FIFO pour même priorité)
          return a.timestamp - b.timestamp;
        });
      
      return { actionQueue: updatedQueue };
    });
  },
  
  // Met à jour le statut d'une action dans la file
  updateActionStatus: (index, status, result = null) => {
    set((state) => {
      if (index < 0 || index >= state.actionQueue.length) return state;
      
      const updatedQueue = [...state.actionQueue];
      updatedQueue[index] = {
        ...updatedQueue[index],
        status,
        result
      };
      
      return { actionQueue: updatedQueue };
    });
    
    // Si l'action est terminée ou a échoué, l'ajouter à l'historique
    if (status === ACTION_STATUS.COMPLETED || status === ACTION_STATUS.FAILED) {
      const action = get().actionQueue[index];
      
      if (action) {
        const historyEntry = {
          type: action.type,
          status,
          timestamp: action.timestamp,
          completedAt: Date.now(),
          result
        };
        
        set((state) => {
          const updatedHistory = [...state.actionHistory, historyEntry].slice(-20);
          return { actionHistory: updatedHistory };
        });
        
        // Retirer l'action de la file
        set((state) => {
          const updatedQueue = [...state.actionQueue];
          updatedQueue.splice(index, 1);
          return { actionQueue: updatedQueue };
        });
        
        fsmLogger.action(`${status} action: ${action.type}`, { 
          elapsed: Date.now() - action.timestamp 
        });
      }
    }
  },
  
  // Exécute l'action la plus prioritaire de la file
  executeNextAction: () => {
    const actionQueue = get().actionQueue;
    if (actionQueue.length === 0) return false;
    
    // On ne traite que l'action en tête de file
    const nextAction = actionQueue[0];
    
    // Vérifier si l'action est déjà en cours d'exécution
    if (nextAction.status === ACTION_STATUS.IN_PROGRESS) {
      // Si l'action est déjà en cours, on continue son exécution
      fsmLogger.actionExecution(`Continue: ${nextAction.type} (priority: ${nextAction.priority})`);
    } else {
      // Sinon, on marque l'action comme en cours
      get().updateActionStatus(0, ACTION_STATUS.IN_PROGRESS);
      fsmLogger.actionExecution(`Start: ${nextAction.type} (priority: ${nextAction.priority})`);
    }
    
    // Récupère les stores nécessaires
    const playerStore = usePlayerStore.getState();
    const tileStore = useTileStore.getState();
    
    // Récupère la référence de la fonction d'action
    const actionFunction = BotActions[BotActions.actionMap[nextAction.type]];
    
    // Exécute l'action avec les paramètres appropriés
    if (actionFunction) {
      try {
        // Exécuter l'action et récupérer le résultat
        const result = actionFunction(
          playerStore,
          tileStore,
          get().addAction,
          get().changeState
        );
        
        // Mettre à jour le statut de l'action selon le résultat
        if (result === true) {
          get().updateActionStatus(0, ACTION_STATUS.COMPLETED, result);
          return true;
        } else if (result === false) {
          get().updateActionStatus(0, ACTION_STATUS.FAILED, result);
          return false;
        }
        // Si undefined ou autre valeur, l'action reste bloquante (IN_PROGRESS)
        return true;
      } catch (error) {
        fsmLogger.error(`Error in action ${nextAction.type}:`, error);
        get().updateActionStatus(0, ACTION_STATUS.FAILED, { error: error.message });
        return false;
      }
    } else {
      fsmLogger.error(`Action function not found for type: ${nextAction.type}`);
      get().updateActionStatus(0, ACTION_STATUS.FAILED, { error: "Action not found" });
      return false;
    }
  },
  
  // Vérifie les conditions de sortie d'état
  checkStateExitConditions: () => {
    const currentState = get().botState;
    
    // Pas besoin de vérifier pour IDLE, c'est l'état central
    if (currentState === BOT_STATES.IDLE) return;
    
    const playerStore = usePlayerStore.getState();
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle) return;
    
    // Vérifier les conditions qui déclenchent une transition d'état
    const conditionResult = BotConditions.checkAllConditions(currentState, botVehicle);
    
    if (conditionResult.result && conditionResult.state) {
      fsmLogger.condition(`Exit condition met in state ${currentState}: transitioning to ${conditionResult.state}`);
      get().changeState(conditionResult.state);
      return true;
    }
    
    return false;
  },
  
  // Gestion principale du bot (à appeler dans useFrame)
  processBot: () => {
    if (!get().isRunning) return;
    
    // 1. Vérifier les conditions de sortie d'état
    const exitConditionMet = get().checkStateExitConditions();
    if (exitConditionMet) return; // Si une transition a eu lieu, attendre le prochain cycle
    
    // 2. Si la file est vide, ajouter l'action par défaut selon l'état
    if (get().actionQueue.length === 0) {
      const currentState = get().botState;
      const stateConfig = BotStateConfig[currentState];
      
      if (stateConfig?.defaultAction) {
        get().addAction(
          stateConfig.defaultAction.type, 
          stateConfig.defaultAction.priority
        );
      }
    }
    
    // 3. Exécuter l'action en tête de file
    get().executeNextAction();
  },
  
  // Active/désactive le traitement du bot
  toggleBotProcessing: () => {
    const currentlyRunning = get().isRunning;
    
    set({ isRunning: !currentlyRunning });
    
    if (!currentlyRunning) {
      fsmLogger.info("Starting bot processing");
      // Réinitialiser l'état à IDLE au démarrage
      get().changeState(BOT_STATES.IDLE);
      
      // Ajouter d'abord l'action de test
      get().addAction('testQueue', PRIORITY.URGENT);
      
      // Puis ajouter une action d'exploration
      get().addAction('exploreDrone', PRIORITY.HIGH);
      
      // Ensuite ajouter l'action d'évaluation initiale
      get().addAction('evaluateIdle', PRIORITY.MEDIUM);
    } else {
      fsmLogger.info("Stopping bot processing");
    }
  },
  
  // Fonctions pour les tests et le débogage
  _test: {
    resetState: () => {
      fsmLogger.info("Resetting bot state for testing");
      set({
        botState: BOT_STATES.IDLE,
        isRunning: false,
        actionQueue: [],
        actionHistory: []
      });
      return true;
    },
    
    getLogBuffer: (count = null, type = null) => {
      return fsmLogger.getLogBuffer(count, type);
    }
  },
  
  // Expose les constantes et statuts pour usage externe
  BOT_STATES,
  PRIORITY,
  ACTION_STATUS
}));

export default useBotStore;