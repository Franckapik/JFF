// src/ai/fsm/actions/individual/refuelAtBaseAction.js
/**
 * IMPORTANT: Cette action ne doit pas contenir de logique de décision d'état.
 * - Ne pas vérifier les conditions (niveau carburant, capacité max)
 * - Ne pas décider du prochain état basé sur des conditions
 * - Toujours retourner à IDLE pour la prise de décision
 * 
 * Le seul changement d'état autorisé est vers IDLE avec evaluateIdle.
 */
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Fait le plein de carburant et décharge les ressources à la base
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const refuelAtBaseAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false;
  }
  
  // Utiliser la condition centralisée pour vérifier si le bot est à la base
  const atBaseCheck = BotConditions.isAtBase(botVehicle);
  if (!atBaseCheck.result) {
    fsmLogger.condition('Bot is not at base, returning to IDLE for reevaluation');
    changeState(BOT_STATES.IDLE);
    addAction('evaluateIdle', PRIORITY.HIGH);
    return false; // Action échouée, retour à l'évaluation centralisée
  }
  
  // Utiliser la condition centralisée pour vérifier si le plein est complet
  const fullyRefueledCheck = BotConditions.isFullyRefueled(botVehicle);
  if (fullyRefueledCheck.result) {
    fsmLogger.action('Bot is fully refueled and resources transferred, returning to IDLE for reevaluation');
    
    // Réinitialiser les marqueurs de ressources dans la mémoire du bot
    playerStore.updatePlayerMemory('player2', {
      hasNewResourceDiscovery: false,
      droneReturnedToShip: false
    });
    
    changeState(BOT_STATES.IDLE);
    addAction('evaluateIdle', PRIORITY.HIGH);
    return true;
  }
  
  // Si le plein n'est pas complet, faire le plein et transférer les ressources
  const fuelRefilled = playerStore.refuelVehicle('player2', 'ship');
  const transferred = playerStore.transferResources('player2', 'ship');
  
  if (fuelRefilled) {
    fsmLogger.action(`Refueled bot, current fuel: ${botVehicle.fuel}`);
  }
  
  if (transferred) {
    fsmLogger.action(`Transferred ${transferred} resources from bot to player score`);
  }
  
  return true;
};