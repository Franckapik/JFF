// src/ai/fsm/actions/individual/returnToBaseAction.js
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
 * Déplace le bot vers sa base/tuile de départ
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean|undefined} - True si l'action est terminée, false si elle a échoué, undefined si elle est en cours
 */
export const returnToBaseAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false; // Action échouée
  }
  
  // Utiliser la condition centralisée pour vérifier si le bot est déjà à la base
  const atBaseCheck = BotConditions.isAtBase(botVehicle);
  if (atBaseCheck.result) {
    fsmLogger.condition('Bot is already at base, transitioning to IDLE for reevaluation');
    changeState(BOT_STATES.IDLE);
    addAction('evaluateIdle', PRIORITY.HIGH);
    return true; // Action terminée avec succès
  }
  
  // Si l'action vient d'être lancée, initialiser le mouvement
  if (!returnToBaseAction.initiated) {
    // Utiliser la condition centralisée pour vérifier si le bot est en mouvement
    const isMovingCheck = BotConditions.isShipMoving();
    if (isMovingCheck.result) {
      // Le bot est déjà en mouvement vers la base
      fsmLogger.action('Bot is currently moving to base, waiting for it to arrive');
      returnToBaseAction.initiated = true;
      return undefined; // Action en cours
    }
    
    // Récupérer la tuile de départ (base) du bot
    const baseCoord = botVehicle.startCoord;
    if (!baseCoord) {
      fsmLogger.error('Bot has no start coordinate defined');
      return false; // Action échouée
    }
    
    // Trouver la tuile correspondant à la base
    const baseTile = tileStore.getTileAtCoord(baseCoord);
    if (!baseTile) {
      fsmLogger.error(`Base tile not found at coordinate ${baseCoord}`);
      return false; // Action échouée
    }
    
    fsmLogger.action(`Moving bot to base at ${baseCoord}`);
    
    // Déplacer le bot vers sa base
    playerStore.moveToTile('player2', 'ship', baseTile);
    returnToBaseAction.initiated = true;
    return undefined; // Action en cours
  }
  
  // Vérifier si le bot est arrivé à destination
  const updatedAtBaseCheck = BotConditions.isAtBase(botVehicle);
  if (updatedAtBaseCheck.result) {
    fsmLogger.action('Bot has reached the base');
    returnToBaseAction.initiated = false; // Réinitialiser pour la prochaine utilisation
    return true; // Action terminée avec succès
  }
  
  // Vérifier si le bot est toujours en mouvement
  const isStillMovingCheck = BotConditions.isShipMoving();
  if (isStillMovingCheck.result) {
    return undefined; // Action toujours en cours
  }
  
  // Si le bot n'est plus en mouvement mais n'est pas à la base,
  // quelque chose a mal fonctionné
  if (!isStillMovingCheck.result && !updatedAtBaseCheck.result) {
    fsmLogger.error('Bot stopped moving but did not reach the base');
    returnToBaseAction.initiated = false; // Réinitialiser pour la prochaine utilisation
    return false; // Action échouée
  }
  
  return undefined; // Action toujours en cours par défaut
};

// Propriété statique pour suivre l'état d'exécution
returnToBaseAction.initiated = false;