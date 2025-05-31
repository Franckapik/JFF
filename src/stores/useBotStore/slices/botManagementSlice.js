// src/stores/useBotStore/slices/botManagementSlice.js
import { BOT_STATES, PRIORITY } from '../../../oldfsm/constants/botConstants';
import { BotStateConfig } from '../../../oldfsm/states/botStates';
import { getBotId } from '../../../shared/constants/playerConstants';
import usePlayerStore from '../../usePlayerStore';
import fsmLogger from '../../../logger/fsmLogger';

export const createBotManagementSlice = (set, get) => ({
  // État initial du bot
  isRunning: false,
  currentBotIndex: 0,
  currentBotId: getBotId(0),
  
  // Stockage des états de chaque bot
  botStates: {},
  
  // Fonction pour changer le bot actif
  switchActiveBot: (botIndex) => {
    const { currentBotIndex } = get();
    
    // ✅ GARDE SIMPLE : Ne rien faire si déjà actif
    if (currentBotIndex === botIndex) {
      return getBotId(botIndex); // Retourner le botId sans processing
    }
    
    const botId = getBotId(botIndex);
    fsmLogger.info(`Switching active bot to Bot ${botIndex} (${botId})`, null, botId);
    
    // Préserver l'état isRunning actuel
    const currentRunningState = get().isRunning;
    
    // Sauvegarder l'état actuel du bot actif (plus besoin car tout est dans botStates)
    
    // Récupérer ou initialiser l'état du nouveau bot
    const nextBotState = get().botStates[botIndex] || {
      botState: BOT_STATES.IDLE,
      actionQueue: []
    };
    
    // ← CORRECTION : Créer updatedBotStates ici
    const updatedBotStates = { ...get().botStates };
    if (!updatedBotStates[botIndex]) {
      updatedBotStates[botIndex] = nextBotState;
    }
    
    // Mettre à jour seulement les indices du bot actif
    set({
      currentBotIndex: botIndex,
      currentBotId: botId,
      botStates: updatedBotStates,
      isRunning: currentRunningState
    });
    
    // ❌ COMMENTÉ : Cette ligne force IDLE à chaque switch
    // get()._initializeBotState(botId);
    
    return botId;
  },
  
  // Fonction d'initialisation
  initializeBot: (botIndex = 0) => {
    const botId = getBotId(botIndex);
    fsmLogger.info(`Initializing bot FSM for Bot ${botIndex} (${botId})`, null, botId);
    
    // Sauvegarder l'état actuel si nécessaire (plus besoin car tout est dans botStates)
    const currentBotIndex = get().currentBotIndex;
    
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
      botStates: updatedBotStates
    });
    
    get()._initializeBotState(botId);
    
    fsmLogger.state(`Bot ${botIndex} (${botId}) initialized in IDLE state`, null, botId);
    
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
  
  // PHASE 3.2: Validation and debugging methods
  
  /**
   * Validates the current bot state for consistency
   * @returns {Object} Validation result with any issues found
   */
  validateBotState: () => {
    const { currentBotIndex, currentBotId, botStates } = get();
    const issues = [];
    
    // Check if current bot exists
    if (!botStates[currentBotIndex]) {
      issues.push(`Missing bot state for index ${currentBotIndex}`);
    }
    
    // Check for action queue consistency
    const actionQueue = get().getActionQueue();
    const duplicateEvaluateIdle = actionQueue.filter(action => action.type === 'evaluateIdle');
    if (duplicateEvaluateIdle.length > 1) {
      issues.push(`Found ${duplicateEvaluateIdle.length} evaluateIdle actions in queue`);
    }
    
    // Check for stuck actions (in progress for too long)
    const stuckActions = actionQueue.filter(action => 
      action.status === 'in_progress' && 
      Date.now() - action.timestamp > 60000 // 60 seconds
    );
    if (stuckActions.length > 0) {
      issues.push(`Found ${stuckActions.length} stuck actions (>60s in progress)`);
    }
    
    return {
      valid: issues.length === 0,
      issues,
      botId: currentBotId,
      botIndex: currentBotIndex,
      queueLength: actionQueue.length
    };
  },
  
  /**
   * Returns debug information about the current bot state
   * @returns {Object} Debug information
   */
  debugBotState: () => {
    const { currentBotIndex, currentBotId, botStates, isRunning } = get();
    const actionQueue = get().getActionQueue();
    const currentState = get().getBotState();
    
    return {
      // Basic info
      currentBotIndex,
      currentBotId,
      isRunning,
      currentState,
      
      // Queue info
      actionQueue: actionQueue.map(action => ({
        type: action.type,
        status: action.status,
        priority: action.priority,
        age: Date.now() - action.timestamp
      })),
      
      // Bot states summary
      botStatesSummary: Object.keys(botStates).map(index => ({
        index: parseInt(index),
        state: botStates[index]?.botState || 'unknown',
        queueLength: botStates[index]?.actionQueue?.length || 0,
        activeActions: botStates[index]?.actionQueue?.filter(a => a.status === 'in_progress')?.length || 0
      })),
      
      // Validation
      validation: get().validateBotState()
    };
  },
});
