// src/ai/fsm/actions/individual/returnToBaseAction.js
import { BOT_STATES } from '../../../constants/botConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Déplace le bot vers sa base/tuile de départ
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const returnToBaseAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false;
  }
  
  // Utiliser la condition centralisée pour vérifier si le bot est déjà à la base
  const atBaseCheck = BotConditions.isAtBase(botVehicle);
  if (atBaseCheck.result) {
    fsmLogger.condition('Bot is already at base, transitioning to IDLE');
    changeState(BOT_STATES.IDLE);
    return true;
  }
  
  // Utiliser la condition centralisée pour vérifier si le bot est en mouvement
  const isMovingCheck = BotConditions.isShipMoving();
  if (isMovingCheck.result) {
    fsmLogger.action('Bot is currently moving to base, waiting for it to arrive');
    return true; // L'action est considérée comme traitée même si on attend seulement
  }
  
  // Récupérer la tuile de départ (base) du bot
  const baseCoord = botVehicle.startCoord;
  if (!baseCoord) {
    fsmLogger.error('Bot has no start coordinate defined');
    return false;
  }
  
  // Trouver la tuile correspondant à la base
  const baseTile = tileStore.getTileAtCoord(baseCoord);
  if (!baseTile) {
    fsmLogger.error(`Base tile not found at coordinate ${baseCoord}`);
    return false;
  }
  
  fsmLogger.action(`Moving bot to base at ${baseCoord}`);
  
  // Déplacer le bot vers sa base
  playerStore.moveToTile('player2', 'ship', baseTile);
  
  return true;
};