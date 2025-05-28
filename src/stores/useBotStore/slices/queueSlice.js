// src/stores/useBotStore/slices/queueSlice.js
import { BOT_STATES, PRIORITY } from '../../../ai/constants/botConstants';
import { BotActions } from '../../../ai/fsm/actions/botActions';
import fsmLogger from '../../../utils/fsmLogger';

// Statuts d'action
const ACTION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const createQueueSlice = (set, get) => ({
  // Historique des actions pour débogage
  actionHistory: [],

  // Getter pour accéder à la file du bot actif
  getActionQueue: () => {
    const { currentBotIndex, botStates } = get();
    return botStates[currentBotIndex]?.actionQueue || [];
  },
  
  // Ajoute une action à la file d'attente
  addAction: (actionType, priority = PRIORITY.MEDIUM, params = {}) => {
    if (!BotActions.actionMap[actionType]) {
      const currentBotId = get().currentBotId;
      fsmLogger.error(`Unknown action type: ${actionType}`, null, currentBotId);
      return;
    }
    
    // DUPLICATION PREVENTION: Check for duplicate evaluateIdle actions
    if (actionType === 'evaluateIdle') {
      const currentQueue = get().getActionQueue();
      const hasEvaluateIdle = currentQueue.some(action => 
        action.type === 'evaluateIdle' && 
        (action.status === ACTION_STATUS.PENDING || action.status === ACTION_STATUS.IN_PROGRESS)
      );
      
      if (hasEvaluateIdle) {
        const currentBotId = get().currentBotId;
        fsmLogger.action(`Skipping duplicate evaluateIdle action for bot ${currentBotId}`, null, currentBotId);
        return; // Don't add duplicate evaluateIdle
      }
    }
    
    const newAction = {
      type: actionType,
      priority,
      params,
      timestamp: Date.now(),
      status: ACTION_STATUS.PENDING
    };
    
    const currentBotId = get().currentBotId;
    fsmLogger.action(`Adding action to queue: ${actionType}`, { priority }, currentBotId);
    
    set((state) => {
      const { currentBotIndex, botStates } = state;
      if (!botStates[currentBotIndex]) return state;
      
      const currentBotQueue = [...(botStates[currentBotIndex].actionQueue || []), newAction]
        .sort((a, b) => {
          if (b.priority !== a.priority) return b.priority - a.priority;
          return a.timestamp - b.timestamp;
        });
      
      const updatedBotStates = { ...botStates };
      updatedBotStates[currentBotIndex] = {
        ...updatedBotStates[currentBotIndex],
        actionQueue: currentBotQueue
      };
      
      return { botStates: updatedBotStates };
    });
  },
  
  // Met à jour le statut d'une action
  updateActionStatus: (index, status, result = null) => {
    const actionQueue = get().getActionQueue();
    
    set((state) => {
      if (index < 0 || index >= actionQueue.length) return state;
      
      const { currentBotIndex, botStates } = state;
      if (!botStates[currentBotIndex]) return state;
      
      const updatedQueue = [...actionQueue];
      updatedQueue[index] = {
        ...updatedQueue[index],
        status,
        result
      };
      
      const updatedBotStates = { ...botStates };
      updatedBotStates[currentBotIndex] = {
        ...updatedBotStates[currentBotIndex],
        actionQueue: updatedQueue
      };
      
      return { botStates: updatedBotStates };
    });
    
    if (status === ACTION_STATUS.COMPLETED || status === ACTION_STATUS.FAILED) {
      const action = actionQueue[index];
      
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
        
        set((state) => {
          const { currentBotIndex, botStates } = state;
          if (!botStates[currentBotIndex]) return state;
          
          const updatedQueue = [...(botStates[currentBotIndex].actionQueue || [])];
          updatedQueue.splice(index, 1);
          
          const updatedBotStates = { ...botStates };
          updatedBotStates[currentBotIndex] = {
            ...updatedBotStates[currentBotIndex],
            actionQueue: updatedQueue
          };
          
          return { botStates: updatedBotStates };
        });
        
        const currentBotId = get().currentBotId;
        fsmLogger.action(`${status} action: ${action.type}`, { 
          elapsed: Date.now() - action.timestamp 
        }, currentBotId);
      }
    }
  },
  
  // Expose les constantes
  ACTION_STATUS,
});
