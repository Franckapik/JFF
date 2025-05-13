// src/ai/fsm/actions/individual/collectResourceAction.js
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
  
  // DEBUGGAGE - Afficher les informations actuelles pour le diagnostic
  if (!collectResourceAction.started) {
    fsmLogger.action(`Debug: collectResource called at position ${botVehicle.coord}, state: ${collectResourceAction.started}`);
    
    if (botMemory?.currentTargetResource) {
      fsmLogger.action(`Debug: Target resource coord: ${botMemory.currentTargetResource.coord}, Bot coord: ${botVehicle.coord}`);
    }
  }
  
  // PHASE 1: Initialisation de l'action - Premier appel
  if (!collectResourceAction.started) {
    // Récupérer la tuile actuelle directement à partir de la position actuelle du bot
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
    
    // Réserver les ressources pour éviter que d'autres actions les ciblent
    playerStore.updatePlayerMemory('player2', {
      isCollecting: true,
      collectionTile: botVehicle.coord
    });
    
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
    
    if (currentTile) {
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
      
      // Créer un nouvel objet de ressource collectée
      const collectedResource = {
        coord: collectResourceAction.tileCoord,
        resources: { ...resources },
        collectedAt: new Date().toISOString()
      };
      
      // Supprimer cette ressource de la liste des ressources connues et réinitialiser l'état de collecte
      if (botMemory.knownResources) {
        const updatedResources = botMemory.knownResources.filter(r => r.coord !== collectResourceAction.tileCoord);
        
        // Ajouter la ressource collectée à la liste des ressources collectées
        const collectedResources = botMemory.collectedResources || [];
        
        playerStore.updatePlayerMemory('player2', {
          knownResources: updatedResources,
          currentTargetResource: null,
          isCollecting: false,
          collectionTile: null,
          collectedResources: [...collectedResources, collectedResource]
        });
      }
      
      // Au lieu de prendre des décisions ici, retourner à l'état IDLE pour centraliser les décisions
      fsmLogger.action('Collection completed. Returning to IDLE for next action decision.');
      changeState(BOT_STATES.IDLE);
      addAction('evaluateIdle', PRIORITY.HIGH);
      
      // Réinitialiser les variables d'état
      collectResourceAction.reset();
      
      return true; // Action terminée avec succès
    } else {
      fsmLogger.error(`Bot is no longer at the collection tile. Expected: ${collectResourceAction.tileCoord}, Current: ${botVehicle.coord}`);
      collectResourceAction.reset();
      
      // Réinitialiser l'état de collecte
      playerStore.updatePlayerMemory('player2', {
        isCollecting: false,
        collectionTile: null
      });
      
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