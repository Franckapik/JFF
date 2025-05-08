// src/stores/useSimpleBotStore.js
// Un store simplifié pour une machine à états finis (FSM) avec trois états
// et une file d'actions prioritaires
import { create } from 'zustand';
import usePlayerStore from './usePlayerStore';
import { useTileStore } from './useNewTileStore';

// Importations des modules FSM
import { BOT_STATES, PRIORITY } from '../ai/constants/botConstants';
import { BotActions } from '../ai/fsm/actions/botActions';
import { BotConditions } from '../ai/fsm/conditions/botConditions';
import { BotStateConfig } from '../ai/fsm/states/botStates';
import fsmLogger from '../utils/fsmLogger';

// Store bot avec file d'actions prioritaires
const useSimpleBotStore = create((set, get) => ({
  // État initial du bot
  botState: BOT_STATES.IDLE,
  isRunning: false,
  
  // File d'actions avec priorités
  actionQueue: [], // [{type, priority, params, timestamp}]
  
  // Nouvelle liste pour stocker les actions terminées
  completedActions: [], // [{type, priority, params, timestamp, completedAt}]
  
  // Fonction d'initialisation - démarre le bot
  initializeBot: () => {
    fsmLogger.info("Initializing bot FSM");
    set({
      botState: BOT_STATES.IDLE, // Commencer avec IDLE comme état central
      isRunning: true,
      actionQueue: [], // Réinitialise la file d'actions
      completedActions: [] // Réinitialise la file des actions terminées
    });
    
    // Exécute l'action onEnterState de l'état initial
    const playerStore = usePlayerStore.getState();
    BotStateConfig[BOT_STATES.IDLE].onEnterState(playerStore);
    
    // Ajouter l'action d'évaluation immédiatement
    get().addAction('evaluateIdle', PRIORITY.HIGH);
    
    fsmLogger.state("Bot initialized in IDLE state");
  },
  
  // Change l'état du bot
  changeState: (newState) => {
    const currentState = get().botState;
    
    // Si on est déjà dans l'état demandé, ne rien faire
    if (currentState === newState) return;
    
    // Récupérer les configurations pour les états actuel et nouveau
    const currentStateConfig = BotStateConfig[currentState];
    const newStateConfig = BotStateConfig[newState];
    
    // Créer un objet de transition pour le logging
    const transition = {
      targetState: newState,
      timestamp: new Date().toISOString()
    };
    
    fsmLogger.state(`Transition: ${currentState} → ${newState}`, transition);
    
    // Exécuter la fonction de sortie d'état si définie
    if (currentStateConfig && currentStateConfig.onExitState) {
      try {
        currentStateConfig.onExitState(newState);
      } catch (error) {
        console.error(`Error in exit handler for state ${currentState}:`, error);
      }
    }
    
    // IMPORTANT: Définir le nouvel état AVANT d'appeler onEnterState
    // Et vider la file d'actions lors d'un changement d'état
    set({ 
      botState: newState,
      actionQueue: [] // Vider la file d'action à chaque changement d'état
    });
    
    // Exécuter la fonction d'entrée dans le nouvel état si définie
    if (newStateConfig && newStateConfig.onEnterState) {
      try {
        newStateConfig.onEnterState(currentState);
      } catch (error) {
        console.error(`Error in entry handler for state ${newState}:`, error);
      }
    }
  },
  
  // Nouvelle fonction pour retourner à l'état IDLE
  returnToIdle: (reason) => {
    fsmLogger.state(`Returning to IDLE state: ${reason}`);
    get().changeState(BOT_STATES.IDLE);
  },
  
  // Ajoute une action à la file d'attente avec priorité
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
      timestamp: Date.now()
    };
    
    fsmLogger.action(`Adding action to queue: ${actionType}`, { priority, params });
    
    // Insérer l'action dans la file et trier par priorité (plus haute en premier)
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
  
  // Supprime la première action de la file et l'ajoute aux actions terminées si completed=true
  removeFirstAction: (completed = false) => {
    const actionQueue = get().actionQueue;
    if (actionQueue.length === 0) return;
    
    const removedAction = actionQueue[0];
    
    set((state) => {
      // Si l'action a été complétée, l'ajouter à la liste des actions terminées
      const updatedCompletedActions = completed 
        ? [...state.completedActions, {
            ...removedAction,
            completedAt: Date.now()
          }].slice(-20) // Limiter à 20 actions terminées (les plus récentes)
        : state.completedActions;
      
      if (completed) {
        fsmLogger.action(`Completed action: ${removedAction.type}`, { 
          priority: removedAction.priority, 
          elapsed: Date.now() - removedAction.timestamp 
        });
      }
      
      return {
        actionQueue: state.actionQueue.slice(1),
        completedActions: updatedCompletedActions
      };
    });
  },
  
  // Vide la liste des actions terminées
  clearCompletedActions: () => {
    set({ completedActions: [] });
    fsmLogger.action("Cleared completed actions history");
  },
  
  // Exécute l'action la plus prioritaire de la file
  executeNextAction: () => {
    const actionQueue = get().actionQueue;
    if (actionQueue.length === 0) return false;
    
    const nextAction = actionQueue[0];
    fsmLogger.actionExecution(nextAction.type, nextAction.priority);
    
    // Récupère les stores nécessaires
    const playerStore = usePlayerStore.getState();
    const tileStore = useTileStore.getState();
    
    // Récupère la référence de la fonction d'action
    const actionFunction = BotActions[BotActions.actionMap[nextAction.type]];
    
    // Exécute l'action avec les paramètres appropriés
    let success = false;
    
    if (actionFunction) {
      // Passe les différents stores et fonctions dont l'action pourrait avoir besoin
      success = actionFunction(
        playerStore, 
        tileStore, 
        get().addAction, 
        get().changeState
      );
    } else {
      fsmLogger.error(`Action function not found for type: ${nextAction.type}`);
    }
    
    // Retirer l'action de la file seulement si elle a été exécutée avec succès
    // et l'ajouter à la liste des actions terminées
    if (success) {
      get().removeFirstAction(true); // true indique que l'action a été complétée
    }
    
    return success;
  },
  
  // Vérifie les conditions et change d'état si nécessaire
  checkConditions: () => {
    const currentState = get().botState;
    const playerStore = usePlayerStore.getState();
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle) return;
    
    // Si nous sommes dans l'état IDLE, l'évaluation des conditions
    // est gérée par l'action evaluateConditionsFromIdle
    if (currentState === BOT_STATES.IDLE) {
      // Si la file d'actions est vide, ajouter une action d'évaluation
      if (get().actionQueue.length === 0) {
        get().addAction('evaluateIdle', PRIORITY.HIGH);
      }
      return;
    }
    
    // Pour les autres états, vérifier les conditions qui déclenchent un retour à IDLE
    fsmLogger.condition(`Checking conditions in state: ${currentState}`);
    const conditionResult = BotConditions.checkAllConditions(currentState, botVehicle);
    
    // Journaliser le résultat de l'évaluation des conditions
    if (conditionResult.result) {
      fsmLogger.conditionEvaluation('checkAllConditions', true, {
        currentState,
        targetState: conditionResult.state,
        botStats: {
          fuel: botVehicle.fuel,
          resources: botVehicle.resources,
          isAtCapacity: botVehicle.isAtCapacity,
          isAtBase: botVehicle.coord === botVehicle.startCoord
        }
      });
    }
    
    // Si une condition est remplie et qu'elle spécifie un retour à IDLE
    if (conditionResult.result && conditionResult.state === BOT_STATES.IDLE) {
      get().returnToIdle(`Condition met: ${JSON.stringify(conditionResult)}`);
    }
  },
  
  // Traite l'état du bot (à appeler périodiquement)
  processBot: () => {
    if (!get().isRunning) return;
    
    // 1. Vérifier les conditions 
    get().checkConditions();
    
    // 2. Si la file d'actions est vide:
    if (get().actionQueue.length === 0) {
      const currentState = get().botState;
      
      // Si dans l'état IDLE, ajouter l'action d'évaluation
      if (currentState === BOT_STATES.IDLE) {
        get().addAction('evaluateIdle', PRIORITY.HIGH);
      }
      // Sinon, ajouter l'action par défaut de l'état actuel
      else {
        const stateConfig = BotStateConfig[currentState];
        if (stateConfig && stateConfig.defaultAction) {
          const action = stateConfig.defaultAction;
          get().addAction(action.type, action.priority);
        }
      }
    }
    
    // 3. Exécuter l'action la plus prioritaire de la file
    get().executeNextAction();
  },
  
  // Active/désactive le traitement du bot
  toggleBotProcessing: () => {
    const currentlyRunning = get().isRunning;
    
    if (!currentlyRunning) {
      fsmLogger.info("Starting bot processing");
      
      // Démarrer toujours le bot dans l'état IDLE pour l'évaluation centrale
      set({ botState: BOT_STATES.IDLE });
      
      // Exécuter le hook d'entrée dans l'état IDLE
      const playerStore = usePlayerStore.getState();
      BotStateConfig[BOT_STATES.IDLE].onEnterState(playerStore);
      
      // Ajouter immédiatement une action d'évaluation
      get().addAction('evaluateIdle', PRIORITY.HIGH);
    } else {
      fsmLogger.info("Stopping bot processing");
    }
    
    set({ isRunning: !currentlyRunning });
  },
  
  // Fonctions pour les tests unitaires et le débogage
  _test: {
    resetState: () => {
      fsmLogger.info("Resetting bot state for testing");
      set({
        botState: BOT_STATES.IDLE,
        isRunning: false,
        actionQueue: [],
        completedActions: []
      });
      return true;
    },
    
    simulateCondition: (conditionName, mockResult = true, mockData = {}) => {
      fsmLogger.info(`Test: Simulating condition ${conditionName} with result ${mockResult}`, mockData);
      
      // Sauvegarde temporaire de la fonction originale
      const originalFn = BotConditions[conditionName];
      if (!originalFn) {
        fsmLogger.error(`Test: Condition ${conditionName} not found`);
        return false;
      }
      
      // Remplacer temporairement par une fonction mockée
      BotConditions[conditionName] = () => ({
        result: mockResult,
        ...mockData
      });
      
      // Exécuter la vérification des conditions
      get().checkConditions();
      
      // Restaurer la fonction originale
      BotConditions[conditionName] = originalFn;
      
      return true;
    },
    
    getLogBuffer: (count = null, type = null) => {
      return fsmLogger.getLogBuffer(count, type);
    }
  },
  
  // Expose les constantes pour usage externe
  BOT_STATES,
  PRIORITY
}));

export default useSimpleBotStore;