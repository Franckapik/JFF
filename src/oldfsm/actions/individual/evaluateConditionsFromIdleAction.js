// src/ai/fsm/actions/individual/evaluateConditionsFromIdleAction.js
/**
 * IMPORTANT: Cette action est la SEULE autorisée à contenir de la logique de décision d'état.
 * - Cette action centralise toutes les vérifications de conditions
 * - Cette action est responsable de décider du prochain état du bot
 * - Toutes les autres actions doivent revenir à IDLE pour la prise de décision
 * 
 * Cette action utilise BotConditions.evaluateStateTransition qui centralise la logique de transition.
 */

import { BotConditions } from '../../../ai/fsm/conditions/botConditions';
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { getMainShipId } from '../../../constants/playerConstants';
import fsmLogger from '../../../utils/fsmLogger';

// Throttling constants to prevent infinite loops
const EVALUATE_IDLE_THROTTLE_MS = 2000; // Minimum 2 seconds between evaluateIdle actions

/**
 * Évalue les conditions depuis l'état IDLE et décide du prochain état
 * Utilise la fonction centralisée evaluateStateTransition ou evaluateFromIdle
 * @param {Object} playerStore - Store du joueur
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer d'état
 * @returns {boolean} - true si une transition a été effectuée, false sinon
 */
export const evaluateConditionsFromIdleAction = (playerStore, tileStore, addAction, changeState) => {
  // Récupérer l'ID du bot actif
  const botId = BotConditions.getCurrentBotId();
  
  // PHASE 0: Throttling to prevent infinite loops
  const botMemory = playerStore.players?.[botId]?.memory;
  const lastEvaluateTime = botMemory?.lastEvaluateIdleTime || 0;
  const currentTime = Date.now();
  
  if (currentTime - lastEvaluateTime < EVALUATE_IDLE_THROTTLE_MS) {
    fsmLogger.action(`evaluateIdle throttled for bot ${botId} (last execution ${((currentTime - lastEvaluateTime)/1000).toFixed(1)}s ago)`, null, botId);
    return true; // Action completed (throttled)
  }
  
  // Update last evaluation time to prevent immediate re-execution
  try {
    playerStore.updatePlayerMemory(botId, {
      lastEvaluateIdleTime: currentTime
    });
  } catch (error) {
    fsmLogger.error(`Failed to update lastEvaluateIdleTime: ${error.message}`, null, botId);
  }
  
  fsmLogger.action(`Evaluating conditions from IDLE state for bot ${botId}`, null, botId);
  
  // 1. Récupérer le véhicule du bot actif
  const botVehicleId = getMainShipId(botId);
  const botVehicle = playerStore.players?.[botId]?.vehicles?.[botVehicleId];
  if (!botVehicle) {
    fsmLogger.error(`Bot vehicle not found for ${botId} in evaluateConditionsFromIdleAction`, null, botId);
    return false;
  }
  
  // 2. D'abord essayer la fonction plus spécifique evaluateFromIdle
  const idleResult = BotConditions.evaluateFromIdle();
  if (idleResult.result) {
    // Si une transition est recommandée par evaluateFromIdle, l'effectuer
    const targetState = idleResult.state || BOT_STATES.IDLE;
    fsmLogger.condition(`Transition from IDLE to ${targetState} (${idleResult.reason || 'condition met from evaluateFromIdle'})`, null, botId);
    
    // Si une action est définie, l'ajouter à la file
    if (idleResult.action) {
      addAction(
        idleResult.action.type,
        idleResult.action.priority || PRIORITY.MEDIUM
      );
    }
    
    // Si l'état cible est différent de l'état actuel, effectuer la transition
    if (targetState !== BOT_STATES.IDLE) {
      changeState(targetState);
    }
    
    return true;
  }
  
  // 3. Si evaluateFromIdle n'a pas donné de résultat, essayer la fonction générique
  const transitionResult = BotConditions.evaluateStateTransition(BOT_STATES.IDLE, botVehicle);
  
  // 4. Si une transition est recommandée par evaluateStateTransition, l'effectuer
  if (transitionResult.result && transitionResult.state) {
    fsmLogger.condition(`Transition from IDLE to ${transitionResult.state} (${transitionResult.reason || 'condition met'})`, null, botId);
    
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
  
  // 5. Si aucune transition n'est recommandée, forcer l'exploration si le bot est à la base et a du carburant
  if (botVehicle.coord === botVehicle.startCoord && botVehicle.fuel >= 100) {
    fsmLogger.condition(`Forcing transition from IDLE to EXPLORING (preventing idle loop)`, null, botId);
    addAction('exploreDrone', PRIORITY.MEDIUM);
    changeState(BOT_STATES.EXPLORING);
    return true;
  }
  
  // 6. Si aucune transition n'est nécessaire, rester en IDLE
  fsmLogger.condition("No condition met, staying in IDLE");
  return true; // Action terminée, mais sans transition
};