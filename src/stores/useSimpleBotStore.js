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

// Store bot avec file d'actions prioritaires
const useSimpleBotStore = create((set, get) => ({
  // État initial du bot
  botState: BOT_STATES.IDLE,
  isRunning: false,
  
  // File d'actions avec priorités
  actionQueue: [], // [{type, priority, params, timestamp}]
  
  // Fonction d'initialisation - démarre le bot
  initializeBot: () => {
    console.log("[SimpleBotStore] Initializing bot");
    set({
      botState: BOT_STATES.EXPLORING,
      isRunning: true,
      actionQueue: [] // Réinitialise la file d'actions
    });
    
    // Exécute l'action onEnterState de l'état initial
    BotStateConfig[BOT_STATES.EXPLORING].onEnterState();
  },
  
  // Change l'état du bot
  changeState: (newState) => {
    if (!Object.values(BOT_STATES).includes(newState)) {
      console.warn(`[SimpleBotStore] Invalid state: ${newState}`);
      return;
    }
    
    const currentState = get().botState;
    if (currentState === newState) return; // Évite les transitions inutiles
    
    console.log(`[SimpleBotStore] Changing state from ${currentState} to ${newState}`);
    
    // Exécute les hooks de sortie et d'entrée d'état
    const playerStore = usePlayerStore.getState();
    
    if (BotStateConfig[currentState].onExitState) {
      BotStateConfig[currentState].onExitState(playerStore);
    }
    
    if (BotStateConfig[newState].onEnterState) {
      BotStateConfig[newState].onEnterState(playerStore);
    }
    
    set({ botState: newState });
    
    // Ajoute l'action par défaut du nouvel état si nécessaire
    const defaultAction = BotStateConfig[newState].defaultAction;
    if (defaultAction) {
      get().addAction(defaultAction.type, defaultAction.priority);
    }
  },
  
  // Ajoute une action à la file d'attente avec priorité
  addAction: (actionType, priority = PRIORITY.MEDIUM, params = {}) => {
    // Vérifie si l'action existe dans le registre
    if (!BotActions.actionMap[actionType]) {
      console.warn(`[SimpleBotStore] Unknown action type: ${actionType}`);
      return;
    }
    
    const newAction = {
      type: actionType,
      priority, 
      params,
      timestamp: Date.now()
    };
    
    console.log(`[SimpleBotStore] Adding action to queue: ${actionType} with priority ${priority}`);
    
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
  
  // Supprime la première action de la file
  removeFirstAction: () => {
    set((state) => ({
      actionQueue: state.actionQueue.slice(1)
    }));
  },
  
  // Exécute l'action la plus prioritaire de la file
  executeNextAction: () => {
    const actionQueue = get().actionQueue;
    if (actionQueue.length === 0) return false;
    
    const nextAction = actionQueue[0];
    console.log(`[SimpleBotStore] Executing action: ${nextAction.type} with priority ${nextAction.priority}`);
    
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
      console.warn(`[SimpleBotStore] Action function not found for type: ${nextAction.type}`);
    }
    
    // Retirer l'action de la file seulement si elle a été exécutée avec succès
    if (success) {
      get().removeFirstAction();
    }
    
    return success;
  },
  
  // Vérifie les conditions et change d'état si nécessaire
  checkConditions: () => {
    const currentState = get().botState;
    const playerStore = usePlayerStore.getState();
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle) return;
    
    // Utilise le module de conditions pour vérifier toutes les conditions
    const conditionResult = BotConditions.checkAllConditions(currentState, botVehicle);
    
    // Si une condition est remplie, change l'état et/ou ajoute une action
    if (conditionResult.result) {
      // Change l'état si spécifié
      if (conditionResult.state) {
        get().changeState(conditionResult.state);
      }
      
      // Ajoute l'action si spécifiée
      if (conditionResult.action) {
        get().addAction(conditionResult.action.type, conditionResult.action.priority);
      }
    }
  },
  
  // Traite l'état du bot (à appeler périodiquement)
  processBot: () => {
    if (!get().isRunning) return;
    
    // 1. Vérifier les conditions avant tout
    get().checkConditions();
    
    // 2. Si la file d'actions est vide, ajouter l'action par défaut de l'état actuel
    if (get().actionQueue.length === 0) {
      const currentState = get().botState;
      const stateConfig = BotStateConfig[currentState];
      
      if (stateConfig && stateConfig.defaultAction) {
        const action = stateConfig.defaultAction;
        get().addAction(action.type, action.priority);
      }
    }
    
    // 3. Exécuter l'action la plus prioritaire de la file
    get().executeNextAction();
  },
  
  // Active/désactive le traitement du bot
  toggleBotProcessing: () => {
    const currentlyRunning = get().isRunning;
    
    if (!currentlyRunning) {
      // Si on démarre le bot et qu'il est en IDLE, passer en EXPLORING
      if (get().botState === BOT_STATES.IDLE) {
        get().changeState(BOT_STATES.EXPLORING);
      }
    }
    
    set({ isRunning: !currentlyRunning });
    console.log(`[SimpleBotStore] Bot processing ${!currentlyRunning ? "started" : "stopped"}`);
  },
  
  // Expose les constantes pour usage externe
  BOT_STATES,
  PRIORITY
}));

export default useSimpleBotStore;