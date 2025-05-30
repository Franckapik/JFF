// src/stores/useBotStore/slices/stateTransitionSlice.js
import { BOT_STATES } from '../../../oldfsm/constants/botConstants';
import { BotStateConfig } from '../../../oldfsm/states/botStates';
import { BotConditions } from '../../../oldfsm/conditions/botConditions';
import usePlayerStore from '../../usePlayerStore';
import fsmLogger from '../../../utils/fsmLogger';
import { getMainShipId } from '../../../shared/constants/playerConstants';

export const createStateTransitionSlice = (set, get) => ({
  // Getter pour accéder à l'état du bot actif
  getBotState: () => {
    const { currentBotIndex, botStates } = get();
    return botStates[currentBotIndex]?.botState || BOT_STATES.IDLE;
  },
  
  // Change l'état du bot
  changeState: (newState) => {
    const currentState = get().getBotState();
    
    if (currentState === newState) return;
    
    const currentStateConfig = BotStateConfig[currentState];
    const newStateConfig = BotStateConfig[newState];
    
    const currentBotId = get().currentBotId;
    fsmLogger.state(`Transition: ${currentState} → ${newState}`, null, currentBotId);
    
    // Exécuter la fonction de sortie d'état
    if (currentStateConfig?.onExitState) {
      try {
        const playerStore = usePlayerStore.getState();
        currentStateConfig.onExitState(playerStore, get().changeState, newState);
      } catch (error) {
        fsmLogger.error(`Error in exit handler for state ${currentState}:`, error, currentBotId);
      }
    }
    
    set((state) => {
      const { currentBotIndex, botStates } = state;
      if (!botStates[currentBotIndex]) return state;
      
      const updatedBotStates = { ...botStates };
      updatedBotStates[currentBotIndex] = {
        ...updatedBotStates[currentBotIndex],
        botState: newState,
        actionQueue: [] // Vider la queue lors du changement d'état
      };
      
      return { botStates: updatedBotStates };
    });
    
    // Exécuter la fonction d'entrée dans le nouvel état
    if (newStateConfig?.onEnterState) {
      try {
        const playerStore = usePlayerStore.getState();
        newStateConfig.onEnterState(playerStore);
      } catch (error) {
        fsmLogger.error(`Error in entry handler for state ${newState}:`, error, currentBotId);
      }
    }
  },
  
  // Retourner à l'état IDLE
  returnToIdle: (reason) => {
    const currentBotId = get().currentBotId;
    fsmLogger.state(`Returning to IDLE state: ${reason}`, null, currentBotId);
    get().changeState(BOT_STATES.IDLE);
  },
  
  // Vérifie les conditions de sortie d'état
  checkStateExitConditions: () => {
    const currentState = get().getBotState();
    
    if (currentState === BOT_STATES.IDLE) return;
    
    const playerStore = usePlayerStore.getState();
    const currentBotId = get().currentBotId;
    const botVehicleId = getMainShipId(currentBotId);
    const botVehicle = playerStore.players?.[currentBotId]?.vehicles?.[botVehicleId];
    
    if (!botVehicle) return;
    
    const transitionResult = BotConditions.evaluateStateTransition(currentState, botVehicle);
    
    if (transitionResult.result && transitionResult.state) {
      fsmLogger.condition(`Exit condition met in state ${currentState}: transitioning to ${transitionResult.state} (${transitionResult.reason || 'condition met'})`, null, currentBotId);
      
      if (transitionResult.action) {
        get().addAction(
          transitionResult.action.type,
          transitionResult.action.priority
        );
      }
      
      get().changeState(transitionResult.state);
      return true;
    }
    
    return false;
  },
});
