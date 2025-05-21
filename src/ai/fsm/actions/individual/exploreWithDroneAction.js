// src/ai/fsm/actions/individual/exploreWithDroneAction.js
/**
 * IMPORTANT: Cette action ne doit pas contenir de logique de décision d'état.
 * - Ne pas vérifier les conditions (niveau carburant, capacité max)
 * - Ne pas décider du prochain état basé sur des conditions
 * - Toujours retourner à IDLE pour la prise de décision
 * 
 * Le seul changement d'état autorisé est vers IDLE avec evaluateIdle.
 */
import { BOT_STATES, PRIORITY } from '../../../constants/botConstants';
import { 
  getBotPlayerId, 
  getMainShipId, 
  getDroneId,
  VEHICLE_TYPES
} from '../../../constants/playerConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Envoie le drone explorer une tuile non découverte à proximité
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean|undefined} - True si l'action est terminée, false si elle a échoué, undefined si elle est en cours
 */
export const exploreWithDroneAction = (playerStore, tileStore, addAction, changeState) => {
  const botId = getBotPlayerId(0);
  const botVehicleId = getMainShipId();
  const botVehicle = playerStore.players?.[botId]?.vehicles?.[botVehicleId];
  
  // Obtenir l'ID du drone d'exploration du bot
  const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
  
  const botDrone = playerStore.players?.[botId]?.vehicles?.[botDroneId];
  
  // Vérifier si le drone est actif
  if (botDrone && !botDrone.isActive) {
    fsmLogger.error(`Explorer drone is not active`);
    return false;
  }
  const playerState = playerStore.players?.[botId];
  
  // Vérifier que le vaisseau existe
  if (!botVehicle || !botVehicle.coord) {
    fsmLogger.error(`Bot vehicle not initialized properly`);
    return false;
  }
  
  // Vérifier que le drone existe
  if (!botDrone) {
    fsmLogger.error(`Bot drone not found`);
    return false;
  }
  
  // Suppression de la vérification du carburant ici, cette vérification sera faite dans l'état IDLE
  
  // Utiliser les conditions centralisées pour vérifier l'état du drone
  const isDroneMoving = BotConditions.isDroneMoving();
  const droneAtShip = BotConditions.isDroneAtShip();
  const droneReturnedToShip = playerState?.memory?.droneReturnedToShip === true;
  
  // PHASE 1: Première exécution - Envoyer le drone explorer
  if (!exploreWithDroneAction.explorationStarted) {
    // Si le drone est déjà en mouvement, attendre qu'il s'arrête
    if (isDroneMoving.result) {
      fsmLogger.action(`Drone is already moving, waiting for it to complete its current movement`);
      return undefined; // Action en cours, reste bloquante
    }
    
    // Réinitialiser le flag de retour au vaisseau s'il existe
    if (droneReturnedToShip) {
      playerStore.updatePlayerMemory(botId, { droneReturnedToShip: false });
    }
    
    fsmLogger.action(`Attempting to find a tile to explore`);
    
    // Utiliser la nouvelle fonction getWalkableTilesInRadius avec le rayon d'exploration du joueur
    const exploringRadius = playerState?.exploringRadius || 3;
    fsmLogger.info(`Using exploring radius: ${exploringRadius}`);
    
    const walkableTilesInRadius = tileStore.getWalkableTilesInRadius(
      botVehicle,
      exploringRadius,
      true,
      true
    );
    
    fsmLogger.info(`Found ${walkableTilesInRadius.length} walkable unexplored tiles in radius`);
    
    // Si des tuiles sont trouvées à proximité
    if (walkableTilesInRadius.length > 0) {
      // La première tuile est déjà la plus proche grâce au tri dans getWalkableTilesInRadius
      const targetTileInfo = walkableTilesInRadius[0];
      
      fsmLogger.action(`Sending drone to explore tile: ${targetTileInfo.coord}, distance: ${targetTileInfo.distance.toFixed(2)}`);
      
      playerStore.moveToTile(botId, botDroneId, {
        coord: targetTileInfo.coord,
        position: targetTileInfo.position
      });
      
      // Incrémenter le compteur d'explorations
      const currentExplorationCount = playerState.memory.explorationCount || 0;
      playerStore.updatePlayerMemory(botId, {
        explorationCount: currentExplorationCount + 1
      });
      
      // Marquer que l'exploration a démarré et sauvegarder la tuile cible
      exploreWithDroneAction.explorationStarted = true;
      exploreWithDroneAction.startTime = Date.now();
      exploreWithDroneAction.targetCoord = targetTileInfo.coord;
      
      fsmLogger.action(`Exploration started at ${new Date(exploreWithDroneAction.startTime).toLocaleTimeString()}`);
      
      return undefined; // Action en cours, reste bloquante
    } else {
      // Si aucune tuile non-explorée n'est trouvée à proximité, chercher une tuile aléatoire
      const randomTile = tileStore.selectRandomWalkableTile();
      if (randomTile) {
        fsmLogger.action(`No unexplored tiles nearby, sending drone to random tile: ${randomTile.coord}`);
        playerStore.moveToTile(botId, botDroneId, randomTile);
        
        // Marquer que l'exploration a démarré et sauvegarder la tuile cible
        exploreWithDroneAction.explorationStarted = true;
        exploreWithDroneAction.startTime = Date.now();
        exploreWithDroneAction.targetCoord = randomTile.coord;
        
        fsmLogger.action(`Random exploration started at ${new Date(exploreWithDroneAction.startTime).toLocaleTimeString()}`);
        
        return undefined; // Action en cours, reste bloquante
      } else {
        // Si aucune action d'exploration n'a pu être effectuée
        fsmLogger.action(`Could not find any tile to explore, exploration failed`);
        
        // Réinitialiser les variables statiques
        exploreWithDroneAction.reset();
        
        changeState(BOT_STATES.IDLE);
        return false; // Action échouée
      }
    }
  }
  
  // PHASE 2: Suivi de l'exploration en cours
  // Calculer le temps écoulé depuis le début de l'exploration
  const elapsedTime = Date.now() - exploreWithDroneAction.startTime;
  
  // Afficher un message de progression toutes les secondes environ
  if (elapsedTime % 1000 < 100) {
    fsmLogger.action(`Exploration in progress: ${(elapsedTime/1000).toFixed(1)}s elapsed`);
  }
  
  // Vérifier si le drone est revenu au vaisseau après l'exploration
  if (droneReturnedToShip || (droneAtShip.result && !isDroneMoving.result && exploreWithDroneAction.explorationStarted)) {
    fsmLogger.action(`Drone has returned to ship, exploration sequence fully complete after ${(elapsedTime/1000).toFixed(1)}s`);
    
    // Réinitialiser le flag dans la mémoire du bot
    playerStore.updatePlayerMemory(botId, { droneReturnedToShip: false });
    
    // Réinitialiser les variables statiques
    exploreWithDroneAction.reset();
    
    changeState(BOT_STATES.IDLE);
    return true; // Action terminée avec succès
  }
  
  // Si trop de temps s'est écoulé, on considère l'exploration comme échouée
  if (elapsedTime > 30000) { // 30 secondes max
    fsmLogger.action(`Exploration timed out after ${(elapsedTime/1000).toFixed(1)}s`);
    
    // Réinitialiser les variables statiques
    exploreWithDroneAction.reset();
    
    changeState(BOT_STATES.IDLE);
    return false; // Action échouée (timeout)
  }
  
  // L'exploration est toujours en cours
  return undefined;
};

// Propriétés statiques pour suivre l'état de l'exploration
exploreWithDroneAction.explorationStarted = false;
exploreWithDroneAction.startTime = null;
exploreWithDroneAction.targetCoord = null;

// Méthode pour réinitialiser les variables statiques
exploreWithDroneAction.reset = function() {
  this.explorationStarted = false;
  this.startTime = null;
  this.targetCoord = null;
};