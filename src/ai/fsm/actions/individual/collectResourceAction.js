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
import { getBotPlayerId, getMainShipId } from '../../../constants/playerConstants';
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
  // Récupérer l'ID du bot actif via BotConditions
  const botId = BotConditions.getCurrentBotId();
  const botVehicleId = getMainShipId();
  const botVehicle = playerStore.players?.[botId]?.vehicles?.[botVehicleId];
  const botMemory = playerStore.players?.[botId]?.memory;
  
  if (!botVehicle) {
    fsmLogger.error(`Bot vehicle not found for ${botId}`);
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
        playerStore.updatePlayerMemory(botId, {
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
    // Version plus rapide
    const collectionTime = Math.min(2000, Math.max(1000, totalResourceAmount / 2000 * 1000));
    
    collectResourceAction.started = true;
    collectResourceAction.startTime = Date.now();
    collectResourceAction.collectionTime = collectionTime;
    collectResourceAction.tileCoord = botVehicle.coord;
    collectResourceAction.resources = { ...resources };
    
    // Réserver les ressources pour éviter que d'autres actions les ciblent
    playerStore.updatePlayerMemory(botId, {
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
      
      // Récupérer dynamiquement les ressources actuelles et capacités maximales du vaisseau depuis le store
      const currentResources = botVehicle.resources || { food: 0, debris: 0, special: 0 };
      const maxCapacity = botVehicle.maxCapacity || { food: 100, debris: 1000, special: 2 };
      
      // Log pour débogage des capacités
      fsmLogger.action(`Current resources: ${JSON.stringify(currentResources)}, Max capacity: ${JSON.stringify(maxCapacity)}`);
      
      // Calculer combien on peut effectivement collecter (limité par la capacité)
      const collectableResources = {
        food: Math.min(resources.food || 0, maxCapacity.food - currentResources.food),
        debris: Math.min(resources.debris || 0, maxCapacity.debris - currentResources.debris),
        special: Math.min(resources.special || 0, maxCapacity.special - currentResources.special)
      };
      
      // Mettre à jour les ressources du vaisseau
      const updatedResources = {
        food: currentResources.food + collectableResources.food,
        debris: currentResources.debris + collectableResources.debris,
        special: currentResources.special + collectableResources.special
      };
      
      // Mettre à jour le véhicule avec les nouvelles ressources
      playerStore.updateVehicle(botId, botVehicleId, {
        resources: updatedResources
      });

      // Vérifier si le bot est à capacité maximale
      const isAtCapacity = playerStore.checkResourceCapacity(botId, botVehicleId);
      
      fsmLogger.action(`Resource capacity status: ${isAtCapacity ? 'At max capacity' : 'Space available'}`);
      
      // Déduire seulement les ressources collectées de la tuile
      const remainingResources = {
        food: Math.max(0, (resources.food || 0) - collectableResources.food),
        debris: Math.max(0, (resources.debris || 0) - collectableResources.debris),
        special: Math.max(0, (resources.special || 0) - collectableResources.special)
      };
      
      // Vérifier si la tuile est complètement épuisée
      const isEmpty = 
        remainingResources.food === 0 && 
        remainingResources.debris === 0 && 
        remainingResources.special === 0;
      
      // Mettre à jour la tuile en utilisant la fonction dédiée du tileStore
      if (isEmpty) {
        tileStore.markTileAsCollected(collectResourceAction.tileCoord);
      } else {
        // Utiliser la fonction deductTileResources pour appliquer les changements partiels
        tileStore.deductTileResources(collectResourceAction.tileCoord, collectableResources);
      }
      
      fsmLogger.action(`Resources collected: ${JSON.stringify(collectableResources)}, remaining: ${JSON.stringify(remainingResources)}`);
      
      // Créer un nouvel objet de ressource collectée
      const collectedResource = {
        coord: collectResourceAction.tileCoord,
        resources: { ...collectableResources }, // Utiliser les ressources effectivement collectées
        collectedAt: new Date().toISOString()
      };
      
      // Si la tuile est vide OU si nous sommes à capacité maximale,
      // retirer cette ressource de la liste des ressources connues
      const shouldRemoveResource = isEmpty || isAtCapacity;
      
      // Supprimer cette ressource de la liste des ressources connues seulement si nécessaire
      if (botMemory.knownResources) {
        let updatedKnownResources = botMemory.knownResources;
        
        if (shouldRemoveResource) {
          updatedKnownResources = botMemory.knownResources.filter(r => 
            r.coord !== collectResourceAction.tileCoord);
        } else {
          // Sinon, mettre à jour les ressources restantes dans la liste
          updatedKnownResources = botMemory.knownResources.map(r => {
            if (r.coord === collectResourceAction.tileCoord) {
              return { ...r, resources: remainingResources };
            }
            return r;
          });
        }
        
        // Ajouter la ressource collectée à la liste des ressources collectées
        const collectedResources = botMemory.collectedResources || [];
        
        playerStore.updatePlayerMemory(botId, {
          knownResources: updatedKnownResources,
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
      playerStore.updatePlayerMemory(botId, {
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