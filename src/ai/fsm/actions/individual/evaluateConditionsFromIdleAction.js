// src/ai/fsm/actions/individual/evaluateConditionsFromIdleAction.js
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Évalue les conditions depuis l'état IDLE pour déterminer l'action suivante
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles 
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const evaluateConditionsFromIdleAction = (playerStore, tileStore, addAction, changeState) => {
  fsmLogger.action(`Evaluating conditions from IDLE state using centralized conditions`);
  
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found, cannot evaluate conditions');
    return false;
  }
  
  // Utiliser la fonction centralisée pour évaluer l'état suivant
  const nextStateEvaluation = BotConditions.evaluateNextStateFromIdle(botVehicle);
  
  if (nextStateEvaluation.result) {
    const { state, action } = nextStateEvaluation;
    
    fsmLogger.condition(`Condition centrale satisfaite: transition vers ${state}`);
    
    // Changer d'état selon l'évaluation
    changeState(state);
    
    // Ajouter l'action associée
    if (action) {
      addAction(action.type, action.priority);
    }
    
    return true;
  }
  
  fsmLogger.condition("No actions taken in IDLE evaluation");
  return false;
};