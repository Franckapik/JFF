// src/stores/useBotStore/slices/executionSlice.js
import { BotActions } from '../../../ai/fsm/actions/botActions';
import { BotStateConfig } from '../../../ai/fsm/states/botStates';
import usePlayerStore from '../../usePlayerStore';
import { useTileStore } from '../../useTileStore';
import useGameStore from '../../useGameStore/';
import { getBotId } from '../../../ai/constants/playerConstants';
import fsmLogger from '../../../utils/fsmLogger';

const ACTION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const createExecutionSlice = (set, get) => ({
  // Exécute l'action la plus prioritaire de la file
  executeNextAction: () => {
    const actionQueue = get().getActionQueue();
    if (actionQueue.length === 0) return false;
    
    const nextAction = actionQueue[0];
    const currentBotId = get().currentBotId;
    
    if (nextAction.status === ACTION_STATUS.IN_PROGRESS) {
      fsmLogger.actionExecution(`Continue: ${nextAction.type} (priority: ${nextAction.priority})`, null, currentBotId);
    } else {
      get().updateActionStatus(0, ACTION_STATUS.IN_PROGRESS);
      fsmLogger.actionExecution(`Start: ${nextAction.type} (priority: ${nextAction.priority})`, null, currentBotId);
    }
    
    const playerStore = usePlayerStore.getState();
    const tileStore = useTileStore.getState();
    const actionFunction = BotActions[BotActions.actionMap[nextAction.type]];
    
    if (actionFunction) {
      try {
        const result = actionFunction(
          playerStore,
          tileStore,
          get().addAction,
          get().changeState
        );
        
        if (result === true) {
          get().updateActionStatus(0, ACTION_STATUS.COMPLETED, result);
          return true;
        } else if (result === false) {
          get().updateActionStatus(0, ACTION_STATUS.FAILED, result);
          return false;
        }
        return true;
      } catch (error) {
        fsmLogger.error(`Error in action ${nextAction.type}:`, error, currentBotId);
        get().updateActionStatus(0, ACTION_STATUS.FAILED, { error: error.message });
        return false;
      }
    } else {
      fsmLogger.error(`Action function not found for type: ${nextAction.type}`, null, currentBotId);
      get().updateActionStatus(0, ACTION_STATUS.FAILED, { error: "Action not found" });
      return false;
    }
  },
  
  // Traite un cycle pour tous les bots
  processAllBots: () => {
    const { botCount } = useGameStore.getState();
    fsmLogger.info(`Processing all ${botCount} bots in parallel`);
    
    const currentBotIndex = get().currentBotIndex;
    
    for (let i = 0; i < botCount; i++) {
      get().switchActiveBot(i);
      get().processBot();
      
      const botId = getBotId(i);
      fsmLogger.info(`Processed Bot ${i} (${botId})`, null, botId);
    }
    
    get().switchActiveBot(currentBotIndex);
    
    return botCount;
  },
  
  // Gestion principale du bot
  processBot: () => {
    if (!get().isRunning) return;
    
    const exitConditionMet = get().checkStateExitConditions();
    if (exitConditionMet) return;
    
    if (get().getActionQueue().length === 0) {
      const currentState = get().getBotState();
      const stateConfig = BotStateConfig[currentState];
      
      if (stateConfig) {
        let defaultAction;
        
        if (typeof stateConfig.getDefaultAction === 'function') {
          const playerStore = usePlayerStore.getState();
          const tileStore = useTileStore.getState();
          defaultAction = stateConfig.getDefaultAction(playerStore, tileStore, get().addAction);
          const currentBotId = get().currentBotId;
          fsmLogger.action(`Using dynamic default action for state ${currentState}: ${defaultAction.type} (priority: ${defaultAction.priority})`, null, currentBotId);
        } else if (stateConfig.defaultAction) {
          defaultAction = stateConfig.defaultAction;
        }
        
        if (defaultAction) {
          get().addAction(
            defaultAction.type, 
            defaultAction.priority
          );
        }
      }
    }
    
    get().executeNextAction();
  },
  
  // Fonctions pour les tests et le débogage
  _test: {
    resetState: () => {
      const currentBotId = get().currentBotId;
      fsmLogger.info("Resetting bot state for testing", null, currentBotId);
      set((state) => {
        const { currentBotIndex, botStates } = state;
        if (!botStates[currentBotIndex]) return state;
        
        const updatedBotStates = { ...botStates };
        updatedBotStates[currentBotIndex] = {
          ...updatedBotStates[currentBotIndex],
          botState: get().BOT_STATES?.IDLE || 'idle',
          actionQueue: []
        };
        
        return { 
          botStates: updatedBotStates,
          isRunning: false,
          actionHistory: []
        };
      });
      return true;
    },
    
    getLogBuffer: (count = null, type = null) => {
      return fsmLogger.getLogBuffer(count, type);
    }
  },
});
