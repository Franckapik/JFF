// src/ai/fsm/actions/individual/moveToRandomTileAction.js
import { BOT_STATES } from '../../../constants/botConstants';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Se déplace vers une tuile aléatoire
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const moveToRandomTileAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  
  if (!botVehicle || botVehicle.isMoving) {
    return false;
  }
  
  const randomTile = tileStore.selectRandomWalkableTile();
  if (randomTile) {
    fsmLogger.action(`Moving to random tile: ${randomTile.coord}`);
    playerStore.moveToTile('player2', 'ship', randomTile);
    
    // Toujours retourner à IDLE après un déplacement aléatoire pour réévaluation
    fsmLogger.condition(`Random movement complete, returning to IDLE for re-evaluation`);
    changeState(BOT_STATES.IDLE);
    
    return true;
  }
  
  return false;
};