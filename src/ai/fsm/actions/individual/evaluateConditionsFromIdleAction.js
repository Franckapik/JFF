// src/ai/fsm/actions/individual/evaluateConditionsFromIdleAction.js
// Action qui évalue les conditions depuis l'état IDLE et décide de la transition

import { BotConditions } from '../../conditions/botConditions';
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Évalue les conditions depuis l'état IDLE et décide du prochain état
 * Utilise la fonction centralisée evaluateStateTransition
 * @param {Object} playerStore - Store du joueur
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer d'état
 * @returns {boolean} - true si une transition a été effectuée, false sinon
 */
export const evaluateConditionsFromIdleAction = (playerStore, tileStore, addAction, changeState) => {
  fsmLogger.action("Evaluating conditions from IDLE state");
  
  // 1. Récupérer le véhicule du bot
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  if (!botVehicle) {
    fsmLogger.error("Bot vehicle not found in evaluateConditionsFromIdleAction");
    return false;
  }
  
  // 2. Utiliser la nouvelle fonction centralisée pour évaluer les transitions
  const transitionResult = BotConditions.evaluateStateTransition(BOT_STATES.IDLE, botVehicle);
  
  // 3. Si une transition est recommandée, l'effectuer
  if (transitionResult.result && transitionResult.state) {
    fsmLogger.condition(`Transition from IDLE to ${transitionResult.state} (${transitionResult.reason || 'condition met'})`);
    
    // Si une action est définie, l'ajouter à la file
    if (transitionResult.action) {
      addAction(
        transitionResult.action.type,
        transitionResult.action.priority || PRIORITY.MEDIUM
      );
    }
    
    // Effectuer la transition
    changeState(transitionResult.state);
    return true;
  }
  
  // 4. Si aucune transition n'est nécessaire, rester en IDLE
  fsmLogger.condition("No condition met, staying in IDLE");
  return true; // Action terminée, mais sans transition
};