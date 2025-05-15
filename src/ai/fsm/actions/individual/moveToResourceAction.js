// src/ai/fsm/actions/individual/moveToResourceAction.js
/**
 * IMPORTANT: Cette action ne doit pas contenir de logique de décision d'état.
 * - Ne pas vérifier les conditions (niveau carburant, capacité max)
 * - Ne pas décider du prochain état basé sur des conditions
 * - Toujours retourner à IDLE pour la prise de décision
 * 
 * Le seul changement d'état autorisé est vers IDLE avec evaluateIdle.
 */
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { BOT_PLAYER_ID, getBotMainVehicleId } from '../../../constants/playerConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';
import { findPath } from '../../../../utils/utils';

/**
 * Déplace le vaisseau vers la meilleure ressource connue
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean|undefined} - True si l'action est terminée, false si échec, undefined si en cours
 */
export const moveToResourceAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicleId = getBotMainVehicleId();
  const botVehicle = playerStore.players?.[BOT_PLAYER_ID]?.vehicles?.[botVehicleId];
  const botMemory = playerStore.players?.[BOT_PLAYER_ID]?.memory;
  
  if (!botVehicle || !botMemory) {
    fsmLogger.error('Bot vehicle or memory not found');
    return false;
  }
  
  // Suppression des vérifications de niveau de carburant et de capacité maximale
  // Ces vérifications doivent être centralisées dans l'état IDLE
  
  // PHASE 1: Initialisation de l'action - Premier appel
  if (!moveToResourceAction.started) {
    // Vérifier si des ressources sont connues
    const knownResources = botMemory.knownResources || [];
    if (knownResources.length === 0) {
      fsmLogger.condition('No resources in memory, returning to IDLE for reevaluation');
      changeState(BOT_STATES.IDLE);
      addAction('evaluateIdle', PRIORITY.HIGH);
      return true; // Action terminée - passage à IDLE pour réévaluation
    }
    
    // Amélioration: Trier les ressources par valeur/distance pour optimiser la collecte
    const rankedResources = knownResources.map(resource => {
      // Ne pas utiliser getTileAtCoord qui n'existe pas
      if (!resource.coord) return null;
      
      // Utiliser la fonction de calcul de distance du fichier utils.js
      const path = findPath(botVehicle.coord, resource.coord, tileStore.tiles);
      const distance = path.length > 0 ? path.length - 1 : Infinity; // Distance = nombre de déplacements dans le chemin
      
      // Calculer la valeur totale des ressources
      const resourceValues = resource.resources || {};
      const value = (resourceValues.food || 0) * 1 + 
                   (resourceValues.debris || 0) * 2 + 
                   (resourceValues.special || 0) * 10;
      
      // Score = valeur / distance (plus c'est loin, moins c'est intéressant)
      // Ajouter un petit facteur aléatoire pour éviter de toujours cibler la même ressource
      const randomFactor = 0.9 + Math.random() * 0.2; // Entre 0.9 et 1.1
      const score = (value / (distance || 1)) * randomFactor;
      
      return {
        ...resource,
        distance,
        value,
        score
      };
    }).filter(Boolean).sort((a, b) => b.score - a.score);
    
    // Choisir la meilleure ressource
    if (rankedResources.length > 0) {
      const bestResource = rankedResources[0];
      
      // Vérifier si la tuile existe dans le store de tuiles
      const targetTile = tileStore.tiles[bestResource.coord];
      
      if (targetTile) {
        // MODIFICATION: Vérifier si le bot est déjà à la position cible
        if (botVehicle.coord === bestResource.coord) {
          fsmLogger.action(`Bot already at resource location ${bestResource.coord}, action complete`);
          
          // Enregistrer la cible actuelle dans la mémoire du bot
          playerStore.updatePlayerMemory(BOT_PLAYER_ID, {
            currentTargetResource: bestResource
          });
          
          // Terminer cette action avec succès au lieu d'ajouter collectResource directement
          // L'état COLLECTING va ensuite automatiquement ajouter l'action collectResource
          // depuis son action par défaut
          return true; // Action terminée immédiatement
        }

        fsmLogger.action(`Moving to resource at ${bestResource.coord}, value: ${bestResource.value}, distance: ${bestResource.distance.toFixed(2)}`);
        
        // Enregistrer la cible actuelle dans la mémoire du bot
        playerStore.updatePlayerMemory(BOT_PLAYER_ID, {
          currentTargetResource: bestResource
        });
        
        // Déplacer le bot vers la ressource
        playerStore.moveToTile(BOT_PLAYER_ID, botVehicleId, targetTile);
        
        // Initialisation des variables de suivi d'état
        moveToResourceAction.started = true;
        moveToResourceAction.startTime = Date.now();
        moveToResourceAction.targetCoord = bestResource.coord;
        
        return undefined; // Action en cours, reste bloquante
      }
    }
    
    fsmLogger.error('Could not find valid resource to move to');
    changeState(BOT_STATES.IDLE); // Revenir à IDLE si aucune action possible
    return false; // Action échouée
  }
  
  // PHASE 2: Suivi de l'action en cours
  // Calculer le temps écoulé depuis le début de l'action
  const elapsedTime = Date.now() - moveToResourceAction.startTime;
  
  // Afficher un message de progression toutes les secondes environ
  if (elapsedTime % 1000 < 100) { 
    fsmLogger.action(`Moving to resource in progress: ${(elapsedTime/1000).toFixed(1)}s elapsed`);
  }
  
  // Utiliser la condition pour vérifier si le bot est toujours en mouvement
  const isMovingCheck = BotConditions.isShipMoving();
  
  // Timeout de sécurité - si l'action prend trop de temps
  if (elapsedTime > 30000) { // 30 secondes max
    fsmLogger.action(`Resource movement timed out after ${(elapsedTime/1000).toFixed(1)}s`);
    moveToResourceAction.reset();
    return false; // Action échouée (timeout)
  }
  
  // Si le bot a atteint sa destination ou n'est plus en mouvement
  if (!isMovingCheck.result) {
    // Vérifier si le bot est arrivé à la ressource cible
    if (botVehicle.coord === moveToResourceAction.targetCoord) {
      fsmLogger.action(`Bot has reached resource at ${botVehicle.coord} after ${(elapsedTime/1000).toFixed(1)}s`);
      
      // Réinitialiser les variables d'état
      moveToResourceAction.reset();
      
      // Action terminée avec succès - l'état COLLECTING ajoutera collectResource dans le prochain cycle
      return true;
    } else {
      // Si le bot s'est arrêté mais n'est pas à la bonne destination
      fsmLogger.action(`Bot stopped but hasn't reached target resource. Current: ${botVehicle.coord}, Target: ${moveToResourceAction.targetCoord}`);
      
      // CORRECTION: Vérifier si le bot est à une position différente de la cible avant de réessayer
      if (botVehicle.coord !== moveToResourceAction.targetCoord) {
        // Essayer à nouveau de se déplacer vers la cible
        const targetTile = tileStore.tiles[moveToResourceAction.targetCoord];
        if (targetTile) {
          playerStore.moveToTile(BOT_PLAYER_ID, botVehicleId, targetTile);
          fsmLogger.action('Retrying movement to resource');
          return undefined; // Action toujours en cours
        }
      } else {
        // Si le bot est à la cible mais qu'on ne l'a pas détecté avant
        fsmLogger.action('Bot is actually at the target, action complete');
        moveToResourceAction.reset();
        
        // Action terminée avec succès
        return true;
      }
      
      // Si la cible n'est plus valide
      fsmLogger.action('Target tile no longer valid, abandoning movement');
      moveToResourceAction.reset();
      return false; // Action échouée
    }
  }
  
  // Le bot est toujours en mouvement
  return undefined; // Action en cours, reste bloquante
};

// Propriétés statiques pour suivre l'état de l'action
moveToResourceAction.started = false;
moveToResourceAction.startTime = null;
moveToResourceAction.targetCoord = null;

// Méthode pour réinitialiser les variables statiques
moveToResourceAction.reset = function() {
  this.started = false;
  this.startTime = null;
  this.targetCoord = null;
};