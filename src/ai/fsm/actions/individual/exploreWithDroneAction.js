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
import useDroneState, { DRONE_STATES } from '../../../../hooks/useDroneState';
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
  const botId = BotConditions.getCurrentBotId();
  const botVehicleId = getMainShipId();
  const botVehicle = playerStore.players?.[botId]?.vehicles?.[botVehicleId];
  
  // Obtenir l'ID du drone d'exploration du bot
  const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
  const botDrone = playerStore.players?.[botId]?.vehicles?.[botDroneId];
  const playerState = playerStore.players?.[botId];

  // Vérifier si le drone est actif
  if (botDrone && !botDrone.isActive) {
    fsmLogger.error(`Explorer drone is not active`);
    return false;
  }
  
  if (!botVehicle || !botVehicle.coord) {
    fsmLogger.error(`Bot vehicle not initialized properly`);
    return false;
  }
  
  if (!botDrone) {
    fsmLogger.error(`Bot drone not found`);
    return false;
  }

  // Utiliser les conditions centralisées pour vérifier l'état du drone
  const isDroneMoving = BotConditions.isDroneMoving();
  const droneAtShip = BotConditions.isDroneAtShip();
  // Use the drone state machine instead of flags
  const droneState = useDroneState.getState();
  const isDroneDocked = droneState.isDroneDocked(botDroneId); // Renamed for clarity
  
  // PHASE 1: Première exécution - Envoyer le drone explorer
  if (!playerState?.memory?.explorationState?.started) {
    // Si le drone est déjà en mouvement, attendre qu'il s'arrête
    if (isDroneMoving.result) {
      fsmLogger.action(`Drone is already moving, waiting for it to complete its current movement`);
      return undefined;
    }
    
    fsmLogger.action(`Attempting to find a tile to explore`);
    
    const exploringRadius = playerState?.exploringRadius || 3;
    fsmLogger.info(`Using exploring radius: ${exploringRadius}`);
    
    const walkableTilesInRadius = tileStore.getWalkableTilesInRadius(
      botVehicle,
      exploringRadius,
      true,
      true
    );
    
    fsmLogger.info(`Found ${walkableTilesInRadius.length} walkable unexplored tiles in radius`);
    
    if (walkableTilesInRadius.length > 0) {
      const targetTileInfo = walkableTilesInRadius[0];
      
      fsmLogger.action(`Sending drone to explore tile: ${targetTileInfo.coord}, distance: ${targetTileInfo.distance.toFixed(2)}`);
      
      playerStore.moveToTile(botId, botDroneId, {
        coord: targetTileInfo.coord,
        position: targetTileInfo.position
      });

      // Incrémenter le compteur d'explorations
      const currentExplorationCount = playerState.memory.explorationCount || 0;
      
      // Marquer que l'exploration a démarré dans la mémoire du bot
      playerStore.updatePlayerMemory(botId, {
        explorationCount: currentExplorationCount + 1,
        explorationState: {
          started: true,
          startTime: Date.now(),
          targetCoord: targetTileInfo.coord
        }
      });
      
      fsmLogger.action(`Exploration started at ${new Date().toLocaleTimeString()}`);
      
      return undefined;
    } else {
      // Si aucune tuile non-explorée n'est trouvée à proximité, chercher une tuile aléatoire
      const randomTile = tileStore.selectRandomWalkableTile();
      if (randomTile) {
        fsmLogger.action(`No unexplored tiles nearby, sending drone to random tile: ${randomTile.coord}`);
        playerStore.moveToTile(botId, botDroneId, randomTile);
        
        playerStore.updatePlayerMemory(botId, {
          explorationState: {
            started: true,
            startTime: Date.now(),
            targetCoord: randomTile.coord
          }
        });
        
        fsmLogger.action(`Random exploration started at ${new Date().toLocaleTimeString()}`);
        
        return undefined;
      } else {
        fsmLogger.action(`Could not find any tile to explore, exploration failed`);
        
        // Réinitialiser l'état d'exploration dans la mémoire
        playerStore.updatePlayerMemory(botId, {
          explorationState: null
        });
        
        changeState(BOT_STATES.IDLE);
        return false;
      }
    }
  }
  
  // PHASE 2: Suivi de l'exploration en cours
  const explorationState = playerState?.memory?.explorationState;
  const elapsedTime = Date.now() - explorationState.startTime;
  
  if (elapsedTime % 1000 < 100) {
    fsmLogger.action(`Exploration in progress: ${(elapsedTime/1000).toFixed(1)}s elapsed`);
  }
  
  // Use drone state machine to check completion
  if (droneState.isDroneDocked(botDroneId)) {
    fsmLogger.action(`Drone has returned to ship, exploration sequence fully complete after ${(elapsedTime/1000).toFixed(1)}s`);
    
    // Reset exploration state
    playerStore.updatePlayerMemory(botId, { 
      explorationState: null
    });
    
    changeState(BOT_STATES.IDLE);
    return true;
  }
  
  if (elapsedTime > 30000) {
    fsmLogger.action(`Exploration timed out after ${(elapsedTime/1000).toFixed(1)}s`);
    
    playerStore.updatePlayerMemory(botId, { 
      explorationState: null 
    });
    
    changeState(BOT_STATES.IDLE);
    return false;
  }
  
  return undefined;
};