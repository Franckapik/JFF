// src/ai/fsm/actions/individual/collectResourceAction.js
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Collecte une ressource une fois arrivé sur la tuile
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const collectResourceAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  const botMemory = playerStore.players?.player2?.memory;
  
  if (!botVehicle || !botMemory) {
    fsmLogger.error('Bot vehicle or memory not found');
    return false;
  }
  
  // Utiliser la condition centralisée pour vérifier si carburant faible
  const fuelCheck = BotConditions.isLowFuel(botVehicle);
  if (fuelCheck.result) {
    fsmLogger.condition('Low fuel detected, abandoning resource collection');
    changeState(BOT_STATES.RETURNING);
    addAction('returnToBase', PRIORITY.HIGH);
    return true;
  }
  
  // Utiliser la condition centralisée pour vérifier capacité max
  const capacityCheck = BotConditions.isAtMaxCapacity(botVehicle);
  if (capacityCheck.result) {
    fsmLogger.condition('Bot is at max capacity, returning to base');
    changeState(BOT_STATES.RETURNING);
    addAction('returnToBase', PRIORITY.HIGH);
    return true;
  }
  
  // Vérifier que le bot est bien à l'emplacement de la ressource cible
  const targetResource = botMemory.currentTargetResource;
  if (!targetResource) {
    fsmLogger.error('No target resource in memory');
    changeState(BOT_STATES.IDLE);
    return false;
  }
  
  if (botVehicle.coord !== targetResource.coord) {
    fsmLogger.action('Bot is not at target resource location, moving there first');
    addAction('moveToResource', PRIORITY.HIGH);
    return true;
  }
  
  // Collecter la ressource
  const collected = playerStore.collectResource('player2', 'ship');
  if (collected) {
    fsmLogger.action(`Collected ${collected.value} resources`);
    
    // Retirer la ressource de la mémoire des ressources connues
    if (botMemory.knownResources) {
      const updatedResources = botMemory.knownResources.filter(
        r => r.coord !== targetResource.coord
      );
      
      playerStore.updatePlayerMemory('player2', {
        knownResources: updatedResources,
        currentTargetResource: null // Effacer la cible actuelle
      });
    }
    
    // Utiliser la condition pour vérifier s'il faut retourner à la base ou continuer la collecte
    if (capacityCheck.result) {
      changeState(BOT_STATES.RETURNING);
      addAction('returnToBase', PRIORITY.HIGH);
    } else {
      // Utiliser la condition pour vérifier s'il reste des ressources connues
      const noResourcesLeft = BotConditions.allKnownResourcesCollected();
      if (noResourcesLeft.result) {
        changeState(BOT_STATES.EXPLORING);
        addAction('exploreDrone', PRIORITY.MEDIUM);
      } else {
        // S'il reste des ressources à collecter, continuer avec l'état COLLECTING
        // et chercher la ressource suivante
        addAction('moveToResource', PRIORITY.MEDIUM);
      }
    }
    
    return true;
  } else {
    fsmLogger.error('Failed to collect resource');
    
    // Si la collecte a échoué (peut-être que la ressource n'existe plus),
    // supprimer cette ressource de la mémoire
    if (botMemory.knownResources) {
      const updatedResources = botMemory.knownResources.filter(
        r => r.coord !== targetResource.coord
      );
      
      playerStore.updatePlayerMemory('player2', {
        knownResources: updatedResources,
        currentTargetResource: null
      });
    }
    
    // Revenir à l'état IDLE pour réévaluer les priorités
    changeState(BOT_STATES.IDLE);
    return false;
  }
};