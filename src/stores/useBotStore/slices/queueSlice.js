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
  // File d'actions avec priorités et statuts
  actionQueue: [],
  
  // Historique des actions pour débogage
  actionHistory: [],
  
  // Ajoute une action à la file d'attente
  addAction: (actionType, priority = PRIORITY.MEDIUM, params = {}) => {
    if (!BotActions.actionMap[actionType]) {
      const currentBotId = get().currentBotId;
      fsmLogger.error(`Unknown action type: ${actionType}`, null, currentBotId);
      return;
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
      const updatedQueue = [...state.actionQueue, newAction]
        .sort((a, b) => {
          if (b.priority !== a.priority) return b.priority - a.priority;
          return a.timestamp - b.timestamp;
        });
      
      return { actionQueue: updatedQueue };
    });
  },
  
  // Met à jour le statut d'une action
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
        
        set((state) => {
          const updatedQueue = [...state.actionQueue];
          updatedQueue.splice(index, 1);
          return { actionQueue: updatedQueue };
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
