// src/ai/fsm/actions/individual/collectResourceAction.js
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Collecte les ressources d'une tuile une fois que le bot est arrivé à destination
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean|undefined} - True si l'action est terminée, false si échouée, undefined si en cours
 */
export const collectResourceAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  const botMemory = playerStore.players?.player2?.memory;
  
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false;
  }
  
  // Utiliser la condition pour vérifier si le bot est à capacité maximale
  const capacityCheck = BotConditions.isAtMaxCapacity(botVehicle);
  if (capacityCheck.result) {
    fsmLogger.condition('Bot is at max capacity while attempting to collect resources, returning to base');
    changeState(BOT_STATES.RETURNING);
    addAction('returnToBase', PRIORITY.HIGH);
    return true; // Action terminée (capacité atteinte)
  }
  
  // PHASE 1: Initialisation de l'action - Premier appel
  if (!collectResourceAction.started) {
    // Vérifier si la cible actuelle existe dans la mémoire
    const currentTarget = botMemory?.currentTargetResource;
    
    if (!currentTarget || currentTarget.coord !== botVehicle.coord) {
      fsmLogger.error('Bot is not at the target resource tile or no target defined');
      return false;
    }
    
    const currentTile = tileStore.tiles[botVehicle.coord];
    if (!currentTile) {
      fsmLogger.error(`Cannot find tile at ${botVehicle.coord}`);
      return false;
    }
    
    // Vérifier s'il y a des ressources à collecter sur la tuile
    const resources = currentTile.resources || { food: 0, debris: 0, special: 0 };
    const hasResources = resources.food > 0 || resources.debris > 0 || resources.special > 0;
    
    if (!hasResources) {
      fsmLogger.action(`No resources to collect at ${botVehicle.coord}`);
      
      // Supprimer cette ressource de la liste des ressources connues
      if (botMemory.knownResources) {
        const updatedResources = botMemory.knownResources.filter(r => r.coord !== botVehicle.coord);
        playerStore.updatePlayerMemory('player2', {
          knownResources: updatedResources,
          currentTargetResource: null
        });
      }
      
      return false;
    }
    
    // Commencer la collecte des ressources
    fsmLogger.action(`Starting resource collection at ${botVehicle.coord}: ${JSON.stringify(resources)}`);
    
    // Temps de collecte proportionnel à la quantité de ressources
    const totalResourceAmount = resources.food + resources.debris + resources.special;
    const collectionTime = Math.min(5000, Math.max(2000, totalResourceAmount / 1000 * 1000));
    
    collectResourceAction.started = true;
    collectResourceAction.startTime = Date.now();
    collectResourceAction.collectionTime = collectionTime;
    collectResourceAction.tileCoord = botVehicle.coord;
    collectResourceAction.resources = { ...resources };
    
    return undefined; // Action en cours, reste bloquante
  }
  
  // PHASE 2: Suivi de la collecte en cours
  const elapsedTime = Date.now() - collectResourceAction.startTime;
  
  // Afficher un message de progression toutes les secondes environ
  if (elapsedTime % 1000 < 100) { 
    const percentComplete = Math.min(100, Math.round((elapsedTime / collectResourceAction.collectionTime) * 100));
    fsmLogger.action(`Resource collection in progress: ${percentComplete}% (${(elapsedTime/1000).toFixed(1)}s/${(collectResourceAction.collectionTime/1000).toFixed(1)}s)`);
  }
  
  // Si le temps de collecte est écoulé
  if (elapsedTime >= collectResourceAction.collectionTime) {
    // Récupérer la tuile actuelle
    const currentTile = tileStore.tiles[collectResourceAction.tileCoord];
    
    if (currentTile && botVehicle.coord === collectResourceAction.tileCoord) {
      // Collecter les ressources
      const resources = collectResourceAction.resources;
      
      // Ajouter les ressources au vaisseau
      const currentResources = botVehicle.resources || { food: 0, debris: 0, special: 0 };
      const updatedResources = {
        food: currentResources.food + (resources.food || 0),
        debris: currentResources.debris + (resources.debris || 0),
        special: currentResources.special + (resources.special || 0)
      };
      
      // Mettre à jour les ressources du vaisseau
      playerStore.updateVehicle('player2', 'ship', {
        resources: updatedResources
      });
      
      // Retirer les ressources de la tuile
      const updatedTile = {
        ...currentTile,
        resources: { food: 0, debris: 0, special: 0 }
      };
      tileStore.updateTile(collectResourceAction.tileCoord, updatedTile);
      
      fsmLogger.action(`Resources collected successfully: ${JSON.stringify(resources)}`);
      
      // Supprimer cette ressource de la liste des ressources connues
      if (botMemory.knownResources) {
        const updatedResources = botMemory.knownResources.filter(r => r.coord !== collectResourceAction.tileCoord);
        playerStore.updatePlayerMemory('player2', {
          knownResources: updatedResources,
          currentTargetResource: null
        });
      }
      
      // Vérifier si on est à capacité maximale après la collecte
      const newCapacityCheck = BotConditions.isAtMaxCapacity(botVehicle);
      if (newCapacityCheck.result) {
        fsmLogger.condition('Max capacity reached after collection, returning to base');
        changeState(BOT_STATES.RETURNING);
        addAction('returnToBase', PRIORITY.HIGH);
      } else {
        // Sinon chercher une autre ressource à collecter
        if (botMemory.knownResources && botMemory.knownResources.length > 0) {
          fsmLogger.action('More resources available, continuing collection');
          addAction('moveToResource', PRIORITY.MEDIUM);
        } else {
          fsmLogger.action('No more resources in memory, returning to exploration');
          changeState(BOT_STATES.EXPLORING);
          addAction('exploreDrone', PRIORITY.MEDIUM);
        }
      }
      
      // Réinitialiser les variables d'état
      collectResourceAction.reset();
      
      return true; // Action terminée avec succès
    } else {
      fsmLogger.error(`Bot is no longer at the collection tile. Expected: ${collectResourceAction.tileCoord}, Current: ${botVehicle.coord}`);
      collectResourceAction.reset();
      return false; // La collecte a échoué
    }
  }
  
  return undefined; // La collecte est toujours en cours
};

// Propriétés statiques pour suivre l'état de l'action
collectResourceAction.started = false;
collectResourceAction.startTime = null;
collectResourceAction.collectionTime = null;
collectResourceAction.tileCoord = null;
collectResourceAction.resources = null;

// Méthode pour réinitialiser les variables statiques
collectResourceAction.reset = function() {
  this.started = false;
  this.startTime = null;
  this.collectionTime = null;
  this.tileCoord = null;
  this.resources = null;
};