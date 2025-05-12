// src/ai/fsm/actions/individual/moveToResourceAction.js
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Déplace le vaisseau vers la meilleure ressource connue
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const moveToResourceAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  const botMemory = playerStore.players?.player2?.memory;
  
  if (!botVehicle || !botMemory) {
    fsmLogger.error('Bot vehicle or memory not found');
    return false;
  }
  
  // Utiliser la condition centralisée pour vérifier le niveau de carburant
  const fuelCheck = BotConditions.isLowFuel(botVehicle);
  if (fuelCheck.result) {
    fsmLogger.condition('Low fuel detected, abandoning resource collection');
    changeState(BOT_STATES.RETURNING);
    addAction('returnToBase', PRIORITY.HIGH);
    return true;
  }
  
  // Utiliser la condition centralisée pour vérifier la capacité maximale
  const capacityCheck = BotConditions.isAtMaxCapacity(botVehicle);
  if (capacityCheck.result) {
    fsmLogger.condition('Bot is at max capacity, returning to base');
    changeState(BOT_STATES.RETURNING);
    addAction('returnToBase', PRIORITY.HIGH);
    return true;
  }
  
  // Utiliser la condition pour vérifier si le bot est en mouvement
  const isMovingCheck = BotConditions.isShipMoving();
  if (isMovingCheck.result) {
    fsmLogger.action('Bot is already moving to resource, waiting for it to arrive');
    return true;
  }
  
  // Si le bot est arrivé à la ressource cible, lancer la collecte
  if (botMemory.currentTargetResource && botVehicle.coord === botMemory.currentTargetResource.coord) {
    fsmLogger.action('Bot has reached resource, starting collection');
    addAction('collectResource', PRIORITY.HIGH);
    return true;
  }
  
  // Vérifier si des ressources sont connues
  const resourcesCheck = BotConditions.allKnownResourcesCollected();
  if (resourcesCheck.result) {
    fsmLogger.condition('No resources to collect, returning to exploration');
    changeState(BOT_STATES.EXPLORING);
    addAction('exploreDrone', PRIORITY.MEDIUM);
    return true;
  }
  
  // Trouver la meilleure ressource à collecter
  const knownResources = botMemory.knownResources || [];
  if (knownResources.length === 0) {
    fsmLogger.condition('No resources in memory, returning to exploration');
    changeState(BOT_STATES.EXPLORING);
    addAction('exploreDrone', PRIORITY.MEDIUM);
    return true;
  }
  
  // Amélioration: Trier les ressources par valeur/distance pour optimiser la collecte
  const rankedResources = knownResources.map(resource => {
    // Obtenir la tuile correspondant à la ressource
    const tile = tileStore.getTileAtCoord(resource.coord);
    if (!tile) return null;
    
    const distance = tileStore.calculateDistance(botVehicle.coord, resource.coord);
    const value = resource.value || 1;
    
    // Score = valeur / distance (plus c'est loin, moins c'est intéressant)
    // Ajouter un petit facteur aléatoire pour éviter de toujours cibler la même ressource
    const randomFactor = 0.9 + Math.random() * 0.2; // Entre 0.9 et 1.1
    const score = (value / (distance || 1)) * randomFactor;
    
    return {
      ...resource,
      distance,
      score
    };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
  
  // Choisir la meilleure ressource
  if (rankedResources.length > 0) {
    const bestResource = rankedResources[0];
    const targetTile = tileStore.getTileAtCoord(bestResource.coord);
    
    if (targetTile) {
      fsmLogger.action(`Moving to resource at ${bestResource.coord}, value: ${bestResource.value}, distance: ${bestResource.distance.toFixed(2)}`);
      
      // Enregistrer la cible actuelle dans la mémoire du bot
      playerStore.updatePlayerMemory('player2', {
        currentTargetResource: bestResource
      });
      
      // Déplacer le bot vers la ressource
      playerStore.moveToTile('player2', 'ship', targetTile);
      return true;
    }
  }
  
  fsmLogger.error('Could not find valid resource to move to');
  changeState(BOT_STATES.IDLE); // Revenir à IDLE si aucune action possible
  return false;
};