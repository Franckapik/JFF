// src/ai/fsm/actions/individual/moveToRandomTileAction.js
/**
 * IMPORTANT: Cette action ne doit pas contenir de logique de décision d'état.
 * - Ne pas vérifier les conditions (niveau carburant, capacité max)
 * - Ne pas décider du prochain état basé sur des conditions
 * - Toujours retourner à IDLE pour la prise de décision
 * 
 * Le seul changement d'état autorisé est vers IDLE avec evaluateIdle.
 */
import { BOT_STATES } from '../../../constants/botConstants';
import fsmLogger from '../../../utils/fsmLogger';
import { BotConditions } from '../../../ai/fsm/conditions/botConditions';
import { getMainShipId } from '../../../constants/playerConstants';

/**
 * Se déplace vers une tuile aléatoire
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const moveToRandomTileAction = (playerStore, tileStore, addAction, changeState) => {
  // Récupérer l'ID du bot actif depuis BotConditions
  const botId = BotConditions.getCurrentBotId();
  const botVehicleId = getMainShipId(botId);
  const botVehicle = playerStore.players?.[botId]?.vehicles?.[botVehicleId];
  
  if (!botVehicle || botVehicle.isMoving) {
    return false;
  }
  
  const randomTile = tileStore.selectRandomWalkableTile();
  if (randomTile) {
    fsmLogger.action(`Moving bot ${botId} to random tile: ${randomTile.coord}`);
    playerStore.moveToTile(botId, botVehicleId, randomTile);
    
    // Toujours retourner à IDLE après un déplacement aléatoire pour réévaluation
    fsmLogger.condition(`Random movement complete, returning to IDLE for re-evaluation`);
    changeState(BOT_STATES.IDLE);
    
    return true;
  }
  
  return false;
};