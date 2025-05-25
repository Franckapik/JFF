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
import { getBotPlayerId, getMainShipId } from '../../../constants/playerConstants';
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
  const botId = BotConditions.getCurrentBotId();
  const botVehicleId = getMainShipId();
  const botVehicle = playerStore.players?.[botId]?.vehicles?.[botVehicleId];
  if (!botVehicle) {
    fsmLogger.error(`Bot vehicle not found for ${botId}`);
    return false; // Action échouée
  }
  
  // Utiliser la condition centralisée pour vérifier si le bot est déjà à la base
  const atBaseCheck = BotConditions.isAtBase(botVehicle);
  if (atBaseCheck.result) {
    fsmLogger.action('Bot is already at base, transitioning to IDLE for reevaluation');
    changeState(BOT_STATES.IDLE);
    addAction('evaluateIdle', PRIORITY.HIGH);
    returnToBaseAction.initiated = false; // Réinitialiser pour la prochaine utilisation
    return true; // Action terminée avec succès
  }
  
  // Accéder à la mémoire du bot via playerState
  const playerState = playerStore.players?.[botId];
  const botMemory = playerState?.memory;

  // Si l'action vient d'être lancée, initialiser le mouvement
  if (!botMemory?.returnState?.started) {
    // Récupérer la tuile de départ (base) du bot
    const baseCoord = botVehicle.startCoord;
    if (!baseCoord) {
      fsmLogger.error('Bot has no start coordinate defined');
      return false; // Action échouée
    }
    
    // Trouver la tuile correspondant à la base
    // Correction: utiliser getTile au lieu de getTileAtCoord
    const baseTile = tileStore.getTile(baseCoord);
    if (!baseTile) {
      fsmLogger.error(`Base tile not found at coordinate ${baseCoord}`);
      return false; // Action échouée
    }
    
    fsmLogger.action(`Moving bot to base at ${baseCoord}`);
    
    // Déplacer le bot vers sa base
    playerStore.moveToTile(getBotPlayerId(0), botVehicleId, baseTile);
    playerStore.updatePlayerMemory(botId, {
      returnState: {
        started: true,
        startTime: Date.now()
      }
    });
    return undefined; // Action en cours
  }
  
  // Vérifier si le bot est arrivé à destination
  const updatedAtBaseCheck = BotConditions.isAtBase(botVehicle);
  if (updatedAtBaseCheck.result) {
    fsmLogger.action('Bot has reached the base');
    playerStore.updatePlayerMemory(botId, { returnState: null }); // Réinitialiser l'état
    changeState(BOT_STATES.IDLE);
    addAction('evaluateIdle', PRIORITY.HIGH);
    return true; // Action terminée avec succès
  }
  
  // Vérifier si le bot est toujours en mouvement
  const isStillMovingCheck = BotConditions.isShipMoving();
  if (!isStillMovingCheck.result) {
    // Si le bot n'est plus en mouvement mais n'est pas à la base,
    // quelque chose a mal fonctionné
    if (!updatedAtBaseCheck.result) {
      fsmLogger.error('Bot stopped moving but did not reach the base');
      playerStore.updatePlayerMemory(botId, { returnState: null }); // Réinitialiser l'état
      return false; // Action échouée
    }
  }
  
  // L'action est toujours en cours
  return undefined;
};

// L'état est maintenant géré dans la mémoire du bot