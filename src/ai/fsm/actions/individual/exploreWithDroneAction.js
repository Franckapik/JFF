// src/ai/fsm/actions/individual/exploreWithDroneAction.js
import { BOT_STATES } from '../../../constants/botConstants';
import { BotConditions } from '../../conditions/botConditions';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Envoie le drone explorer une tuile non découverte à proximité
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const exploreWithDroneAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  const botDrone = playerStore.players?.player2?.vehicles?.drone3;
  const playerState = playerStore.players?.player2;
  
  // Utiliser la condition centralisée pour vérifier si le drone est en mouvement
  const isDroneMoving = BotConditions.isDroneMoving();
  if (!botDrone || isDroneMoving.result) {
    fsmLogger.action(`Drone is already moving or not available, skipping exploration`);
    
    // Si le drone est en mouvement, on retourne true pour indiquer que l'action
    // a été "traitée" même si on n'a rien fait, pour éviter qu'elle soit réajoutée
    if (botDrone && isDroneMoving.result) {
      fsmLogger.action(`Drone is currently moving, waiting for it to reach target`);
      return true;
    }
    
    return false;
  }
  
  // Utiliser la condition centralisée pour vérifier si le drone est au même endroit que le vaisseau
  const droneAtShip = BotConditions.isDroneAtShip();
  const hasExplored = playerState.memory.explorationCount > 0;
  
  if (droneAtShip.result && hasExplored) {
    // Le drone est revenu au vaisseau après une exploration
    fsmLogger.action(`Drone has returned to ship after exploration, returning to IDLE for re-evaluation`);
    changeState(BOT_STATES.IDLE);
    return true;
  }
  
  // Vérifier que le vaisseau existe
  if (!botVehicle || !botVehicle.coord) {
    fsmLogger.error(`Bot vehicle not initialized properly`);
    return false;
  }
  
  // Utiliser la condition centralisée pour vérifier le niveau de carburant
  const fuelCheck = BotConditions.hasEnoughFuel(botVehicle);
  if (!fuelCheck.result) {
    fsmLogger.condition(`Low fuel before exploration, returning to IDLE`);
    changeState(BOT_STATES.IDLE);
    return true;
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
    
    playerStore.moveToTile('player2', 'drone3', {
      coord: targetTileInfo.coord,
      position: targetTileInfo.position
    });
    
    // Incrémenter le compteur d'explorations
    const currentExplorationCount = playerState.memory.explorationCount || 0;
    playerStore.updatePlayerMemory('player2', {
      explorationCount: currentExplorationCount + 1
    });
    
    // IMPORTANT: NE PAS changer d'état après avoir lancé le mouvement du drone
    // Le drone reste dans l'état EXPLORING pendant qu'il se déplace
    
    return true;
  } else {
    // Si aucune tuile non-explorée n'est trouvée à proximité, chercher une tuile aléatoire
    const randomTile = tileStore.selectRandomWalkableTile();
    if (randomTile) {
      fsmLogger.action(`No unexplored tiles nearby, sending drone to random tile: ${randomTile.coord}`);
      playerStore.moveToTile('player2', 'drone3', randomTile);
      
      // IMPORTANT: NE PAS changer d'état après avoir lancé le mouvement du drone
      
      return true;
    }
  }
  
  // Si aucune action d'exploration n'a pu être effectuée, retourner à IDLE
  fsmLogger.action(`Could not find any tile to explore, returning to IDLE`);
  changeState(BOT_STATES.IDLE);
  return true;
};