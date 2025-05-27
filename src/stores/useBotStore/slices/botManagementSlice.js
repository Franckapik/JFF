// src/stores/useBotStore/slices/botManagementSlice.js
import { BOT_STATES, PRIORITY } from '../../../ai/constants/botConstants';
import { BotStateConfig } from '../../../ai/fsm/states/botStates';
import { getBotPlayerId } from '../../../ai/constants/playerConstants';
import usePlayerStore from '../../usePlayerStore';
import fsmLogger from '../../../utils/fsmLogger';

export const createBotManagementSlice = (set, get) => ({
  // État initial du bot
  isRunning: false,
  currentBotIndex: 0,
  currentBotId: getBotPlayerId(0),
  
  // Stockage des états de chaque bot
  botStates: {},
  
  // Fonction pour changer le bot actif
  switchActiveBot: (botIndex) => {
    const botId = getBotPlayerId(botIndex);
    fsmLogger.info(`Switching active bot to Bot ${botIndex + 1} (${botId})`, null, botId);
    
    // Préserver l'état isRunning actuel
    const currentRunningState = get().isRunning;
    
    // Sauvegarder l'état actuel du bot actif
    const currentBotIndex = get().currentBotIndex;
    const currentState = {
      botState: get().botState,
      actionQueue: [...get().actionQueue],
    };
    
    // Récupérer ou initialiser l'état du nouveau bot
    const nextBotState = get().botStates[botIndex] || {
      botState: BOT_STATES.IDLE,
      actionQueue: []
    };
    
    // Mettre à jour le stockage des états des bots
    const updatedBotStates = { ...get().botStates };
    updatedBotStates[currentBotIndex] = currentState;
    
    set({
      currentBotIndex: botIndex,
      currentBotId: botId,
      botState: nextBotState.botState,
      actionQueue: [...nextBotState.actionQueue],
      botStates: updatedBotStates,
      isRunning: currentRunningState
    });
    
    // Exécuter les actions d'initialisation
    get()._initializeBotState(botId);
    
    return botId;
  },
  
  // Fonction d'initialisation
  initializeBot: (botIndex = 0) => {
    const botId = getBotPlayerId(botIndex);
    fsmLogger.info(`Initializing bot FSM for Bot ${botIndex + 1} (${botId})`, null, botId);
    
    // Sauvegarder l'état actuel si nécessaire
    const currentBotIndex = get().currentBotIndex;
    if (currentBotIndex !== botIndex) {
      const currentState = {
        botState: get().botState,
        actionQueue: [...get().actionQueue],
      };
      
      const updatedBotStates = { ...get().botStates };
      updatedBotStates[currentBotIndex] = currentState;
      set({ botStates: updatedBotStates });
    }
    
    // Initialiser l'état pour ce bot
    const initialBotState = {
      botState: BOT_STATES.IDLE,
      actionQueue: []
    };
    
    const updatedBotStates = { ...get().botStates };
    updatedBotStates[botIndex] = initialBotState;
    
    set({
      currentBotIndex: botIndex,
      currentBotId: botId,
      botState: BOT_STATES.IDLE,
      actionQueue: [],
      botStates: updatedBotStates
    });
    
    get()._initializeBotState(botId);
    
    fsmLogger.state(`Bot ${botIndex + 1} (${botId}) initialized in IDLE state`, null, botId);
    
    return botId;
  },
  
  // Active/désactive le traitement du bot
  toggleBotProcessing: () => {
    const currentlyRunning = get().isRunning;
    
    set({ isRunning: !currentlyRunning });
    
    if (!currentlyRunning) {
      const currentBotId = get().currentBotId;
      fsmLogger.info("Starting bot processing", null, currentBotId);
      get().changeState(BOT_STATES.IDLE);
      get().addAction('evaluateIdle', PRIORITY.MEDIUM);
    } else {
      const currentBotId = get().currentBotId;
      fsmLogger.info("Stopping bot processing", null, currentBotId);
    }
  },
  
  // Fonction utilitaire privée pour l'initialisation
  _initializeBotState: (botId) => {
    const playerStore = usePlayerStore.getState();
    if (BotStateConfig[BOT_STATES.IDLE]?.onEnterState) {
      BotStateConfig[BOT_STATES.IDLE].onEnterState(playerStore, botId);
    }
    
    get().addAction('evaluateIdle', PRIORITY.MEDIUM, { botId });
  },
});
