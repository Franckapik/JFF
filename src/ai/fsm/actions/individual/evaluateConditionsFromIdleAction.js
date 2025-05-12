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
  const botMemory = playerStore.players?.player2?.memory;
  
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found, cannot evaluate conditions');
    return false;
  }
  
  // NOUVELLE LOGIQUE: Vérifier si le bot est déjà sur une tuile avec des ressources
  // avant d'utiliser l'évaluation de condition standard qui passerait à l'état COLLECTING
  const currentBotCoord = botVehicle.coord;
  
  // Vérifier si la tuile actuelle est une ressource connue ou une cible actuelle
  const isCurrentTargetResource = botMemory?.currentTargetResource && 
                                botMemory.currentTargetResource.coord === currentBotCoord;
  
  const isKnownResource = botMemory?.knownResources?.some(res => res.coord === currentBotCoord);
  
  if (isCurrentTargetResource || isKnownResource) {
    // Vérifier si la tuile contient encore des ressources
    const currentTile = tileStore.tiles[currentBotCoord];
    const hasResources = currentTile?.resources && (
      currentTile.resources.food > 0 || 
      currentTile.resources.debris > 0 || 
      currentTile.resources.special > 0
    );
    
    if (hasResources) {
      fsmLogger.condition(`Bot est déjà sur une tuile ressource à ${currentBotCoord}, collecte directe sans changer d'état`);
      
      // Lancer directement l'action de collecte sans passer par l'état COLLECTING
      addAction('collectResource', PRIORITY.HIGH);
      
      return true; // Action ajoutée avec succès
    } else {
      fsmLogger.condition(`Bot est sur une tuile ressource à ${currentBotCoord}, mais aucune ressource restante`);
      
      // Si aucune ressource n'est présente, mettre à jour la mémoire du bot
      if (isKnownResource && botMemory.knownResources) {
        const updatedResources = botMemory.knownResources.filter(r => r.coord !== currentBotCoord);
        playerStore.updatePlayerMemory('player2', {
          knownResources: updatedResources,
          currentTargetResource: null
        });
        
        fsmLogger.action(`Ressource épuisée supprimée de la mémoire: ${currentBotCoord}`);
      }
    }
  }
  
  // Continuer avec la logique standard d'évaluation des conditions
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