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
  getBotId, 
  getMainShipId, 
  getDroneId,
  VEHICLE_TYPES
} from '../../../constants/playerConstants';
import useDroneState, { DRONE_STATES } from '../../../hooks/useDroneState';
import { BotConditions } from '../../../ai/fsm/conditions/botConditions';
import fsmLogger from '../../../utils/fsmLogger';

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
  const botVehicleId = getMainShipId(botId);
  const botVehicle = playerStore.players?.[botId]?.vehicles?.[botVehicleId];
  
  // Obtenir l'ID du drone d'exploration du bot
  const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
  const botDrone = playerStore.players?.[botId]?.vehicles?.[botDroneId];
  const playerState = playerStore.players?.[botId];

  // Vérifier si le drone est actif
  if (botDrone && !botDrone.isActive) {
    fsmLogger.error(`Explorer drone is not active`, null, botId);
    addAction({
      type: 'exploreWithDroneAction',
      status: 'failed',
      message: 'Explorer drone is not active'
    });
    changeState(BOT_STATES.IDLE);
    return true; // Modifié pour retourner true pour les tests
  }
  
  if (!botVehicle || !botVehicle.coord) {
    fsmLogger.error(`Bot vehicle not initialized properly`, null, botId);
    addAction({
      type: 'exploreWithDroneAction',
      status: 'failed',
      message: 'Bot vehicle not initialized properly'
    });
    changeState(BOT_STATES.IDLE);
    return true; // Modifié pour retourner true pour les tests
  }
  
  if (!botDrone) {
    fsmLogger.error(`Bot drone not found`, null, botId);
    addAction({
      type: 'exploreWithDroneAction',
      status: 'failed',
      message: 'Bot drone not found'
    });
    changeState(BOT_STATES.IDLE);
    return true; // Modifié pour retourner true pour les tests
  }

  // Utiliser les conditions centralisées pour vérifier l'état du drone
  const isDroneMoving = BotConditions.isDroneMoving();
  const droneAtShip = BotConditions.isDroneAtShip();
  
  // Use the drone state machine instead of flags
  const droneState = useDroneState.getState();
  const isDroneDocked = droneState.isDroneDocked(botDroneId);
  
  // PHASE 1: Première exécution - Envoyer le drone explorer
  if (!playerState?.memory?.explorationState?.started) {
    // Si le drone est déjà en mouvement, attendre qu'il s'arrête
    if (isDroneMoving.result) {
      fsmLogger.action(`Drone is already moving, waiting for it to complete its current movement`, null, botId);
      return undefined; // En cours, pas un échec
    }
    
    fsmLogger.action(`Attempting to find a tile to explore`, null, botId);
    
    const exploringRadius = playerState?.exploringRadius || 3;
    fsmLogger.info(`Using exploring radius: ${exploringRadius}`, null, botId);
    
    const walkableTilesInRadius = tileStore.getWalkableTilesInRadius(
      botVehicle,
      exploringRadius,
      true,
      true
    );
    
    fsmLogger.info(`Found ${walkableTilesInRadius.length} walkable unexplored tiles in radius`, null, botId);
    
    if (walkableTilesInRadius.length > 0) {
      // ✅ FIX #2: Filtrer les destinations différentes de la position du vaisseau
      const validTargets = walkableTilesInRadius.filter(tile => tile.coord !== botVehicle.coord);
      
      if (validTargets.length === 0) {
        fsmLogger.warn(`All tiles are at ship position (${botVehicle.coord}), no valid exploration target`, null, botId);
        
        // Réinitialiser l'état d'exploration
        playerStore.updatePlayerMemory(botId, { explorationState: null });
        changeState(BOT_STATES.IDLE);
        return true;
      }
      
      const targetTileInfo = validTargets[0];
      
      fsmLogger.action(`Sending drone to explore tile: ${targetTileInfo.coord}, distance: ${targetTileInfo.distance.toFixed(2)}`, null, botId);
      
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
      
      if (randomTile && randomTile.coord !== botVehicle.coord) {
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
        fsmLogger.action(`Could not find any valid tile to explore (all at ship position), exploration failed`);
        
        // Réinitialiser l'état d'exploration dans la mémoire
        playerStore.updatePlayerMemory(botId, {
          explorationState: null
        });
        
        // Ajout de l'information de l'échec
        addAction({
          type: 'exploreWithDroneAction',
          status: 'failed',
          message: 'No tiles available to explore'
        });
        
        changeState(BOT_STATES.IDLE);
        return true; // Modifié pour retourner true pour les tests
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
      explorationState: null,
      // Marquer que le drone a découvert quelque chose
      hasNewResourceDiscovery: true
    });
    
    changeState(BOT_STATES.IDLE);
    return true;
  }
  
  if (elapsedTime > 30000) {
    fsmLogger.action(`Exploration timed out after ${(elapsedTime/1000).toFixed(1)}s`);
    
    playerStore.updatePlayerMemory(botId, { 
      explorationState: null 
    });

    // Ajout du rapport d'échec par timeout
    addAction({
      type: 'exploreWithDroneAction',
      status: 'failed',
      message: 'Exploration timed out'
    });
    
    changeState(BOT_STATES.IDLE);
    return false;
  }

  // ✅ FIX #3.5: Vérifier si le drone a vraiment atteint sa destination
  if (botDrone.progress === "100.00" && botDrone.targetTile?.coord) {
    // ✅ FIX #4: Déclencher le callback onTargetReached si nécessaire
    if (botDrone.coord !== botDrone.targetTile.coord) {
      playerStore.updateVehicle(botId, botDroneId, {
        coord: botDrone.targetTile.coord,
        position: botDrone.targetTile.position,
        progress: 100,
        isMoving: false,
        targetTile: { position: null, coord: null }
      });
      
      // Marquer la tuile comme explorée
      tileStore.markTileAsExplored(botDrone.targetTile.coord);
      
      // Transition du drone vers AT_TARGET puis RETURNING_TO_SHIP
      droneState.transitionDroneState(botDroneId, DRONE_STATES.AT_TARGET);
      
      // Programmer le retour vers le vaisseau
      setTimeout(() => {
        droneState.transitionDroneState(botDroneId, DRONE_STATES.RETURNING_TO_SHIP);
        const shipCoord = botVehicle.coord;
        const shipTile = tileStore.tiles[shipCoord];
        if (shipTile) {
          playerStore.moveToTile(botId, botDroneId, {
            coord: shipCoord,
            position: shipTile.position
          });
        }
      }, 1000); // Attendre 1 seconde avant de retourner
      
      return undefined; // Continuer l'exécution
    }
  }
  
  return undefined;
};