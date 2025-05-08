// src/ai/fsm/actions/botActions.js
// Actions que le bot peut exécuter dans la FSM

import { BOT_STATES, PRIORITY, IDLE_EVALUATION } from '../../constants/botConstants';
import fsmLogger from '../../../utils/fsmLogger';

/**
 * Registre des actions du bot
 * Chaque fonction prend le store du joueur et le store des tuiles
 * et effectue une action spécifique
 */
export const BotActions = {
  // NOUVELLE ACTION: Évaluation des conditions depuis l'état IDLE
  evaluateConditionsFromIdle: (playerStore, tileStore, addAction, changeState) => {
    fsmLogger.action(`Evaluating conditions from IDLE state`);
    
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    if (!botVehicle) {
      fsmLogger.error('Bot vehicle not found, cannot evaluate conditions');
      return false;
    }
    
    // Récupérer la mémoire du bot
    const botMemory = playerStore.players?.player2?.memory;
    
    // 1. SAFETY - Vérifier le niveau de carburant (PRIORITÉ LA PLUS HAUTE)
    if (botVehicle.fuel < 50) {
      fsmLogger.condition("Low fuel detected in IDLE evaluation, returning to base");
      changeState(BOT_STATES.RETURNING);
      addAction('returnToBase', PRIORITY.HIGH);
      return true;
    }
    
    // 2. CAPACITY - Vérifier si capacité maximale atteinte
    if (botVehicle.isAtCapacity) {
      fsmLogger.condition("Maximum capacity reached in IDLE evaluation, returning to base");
      changeState(BOT_STATES.RETURNING);
      addAction('returnToBase', PRIORITY.HIGH);
      return true;
    }
    
    // 3. EFFICIENCY - Vérifier s'il y a des ressources à collecter
    const hasKnownResources = botMemory?.knownResources && 
                             botMemory.knownResources.length > 0;
    
    if (hasKnownResources && botVehicle.fuel >= 50) {
      fsmLogger.condition(`${botMemory.knownResources.length} resources available, changing to COLLECTING state`);
      changeState(BOT_STATES.COLLECTING);
      addAction('collect', PRIORITY.MEDIUM);
      return true;
    }
    
    // 4. DISCOVERY - Par défaut, explorer si carburant suffisant
    if (botVehicle.fuel >= 50) {
      fsmLogger.condition("No specific conditions met in IDLE evaluation, changing to EXPLORING state");
      changeState(BOT_STATES.EXPLORING);
      addAction('exploreDrone', PRIORITY.MEDIUM);
      return true;
    }
    
    fsmLogger.condition("No actions taken in IDLE evaluation");
    return false;
  },

  // Se déplace vers une tuile aléatoire
  moveToRandomTile: (playerStore, tileStore, addAction, changeState) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle || botVehicle.isMoving) {
      return false;
    }
    
    const randomTile = tileStore.selectRandomWalkableTile();
    if (randomTile) {
      fsmLogger.action(`Moving to random tile: ${randomTile.coord}`);
      playerStore.moveToTile('player2', 'ship', randomTile);
      
      // Vérifier les conditions de retour à IDLE après l'action
      if (botVehicle.fuel < 50) {
        fsmLogger.condition(`Low fuel after movement, returning to IDLE`);
        changeState(BOT_STATES.IDLE);
      }
      
      return true;
    }
    
    return false;
  },
  
  // Action de collecte de ressources
  moveToKnownResource: (playerStore, tileStore, addAction, changeState) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    const botMemory = playerStore.players?.player2?.memory;

    if (!botVehicle || botVehicle.isMoving) {
      fsmLogger.action(`Bot vehicle is ${!botVehicle ? 'undefined' : 'moving'}, cannot proceed with collection`);
      return false;
    }

    fsmLogger.action(`Starting moveToKnownResource with vehicle at ${botVehicle.coord}, moving: ${botVehicle.isMoving}`);

    // Si le bot est déjà sur une tuile avec des ressources, collecter d'abord
    if (botVehicle.coord) {
      const currentTile = tileStore.tiles[botVehicle.coord];
      if (currentTile && currentTile.resources && 
          (currentTile.resources.food > 0 || 
           currentTile.resources.debris > 0 || 
           currentTile.resources.special > 0)) {
        fsmLogger.action(`Collecting resources at current tile: ${botVehicle.coord}`);
        
        // Stocker les ressources avant de les collecter pour l'historique
        const resourcesBeforeCollection = { ...currentTile.resources };
        
        // Collecter les ressources
        playerStore.collectResources('player2', 'ship', currentTile);
        
        // Ajouter la tuile à la liste des tuiles collectées dans la mémoire du bot
        const collectedEntry = {
          coord: botVehicle.coord,
          resources: resourcesBeforeCollection,
          collectedAt: new Date().toISOString()
        };
        
        // Récupérer la liste actuelle des ressources collectées
        const currentCollected = botMemory.collectedResources || [];
        
        // Mettre à jour la mémoire du bot avec la nouvelle entrée
        playerStore.updatePlayerMemory('player2', {
          collectedResources: [...currentCollected, collectedEntry]
        });
        
        fsmLogger.info(`Added collected resource at ${botVehicle.coord} to memory`);
        
        // Vérifier si à capacité maximale après la collecte
        if (botVehicle.isAtCapacity) {
          fsmLogger.condition(`Maximum capacity reached after collection, returning to IDLE`);
          changeState(BOT_STATES.IDLE);
        }
        
        return true;
      }
    }

    // Vérifier s'il y a des ressources connues
    if (!botMemory.knownResources || botMemory.knownResources.length === 0) {
      fsmLogger.action(`No known resources to collect`);
      
      fsmLogger.condition(`No resources to collect, returning to IDLE`);
      changeState(BOT_STATES.IDLE);
      return true;
    }

    // LOGIQUE AMÉLIORÉE : Trouver la ressource avec la PLUS grande quantité de ressources
    let bestResource = null;
    let maxResourceValue = -1;

    // Debug: Afficher toutes les ressources connues
    fsmLogger.info(`Examining ${botMemory.knownResources.length} known resources`);

    const validResources = botMemory.knownResources.filter(resource => {
      const tile = tileStore.tiles[resource.coord];
      const isValid = tile && 
                     tile.resources && 
                     (tile.resources.food > 0 || tile.resources.debris > 0 || tile.resources.special > 0) && 
                     !tile.collected;
                     
      if (!isValid) {
        fsmLogger.info(`Resource at ${resource.coord} is not valid`);
      }
      return isValid;
    });

    fsmLogger.info(`Found ${validResources.length} valid resources`);

    validResources.forEach(resource => {
      const tile = tileStore.tiles[resource.coord];
      if (tile && tile.resources) {
        const resourceValue = 
          (tile.resources.food || 0) + 
          (tile.resources.debris || 0) * 1.2 + 
          (tile.resources.special || 0) * 5;

        fsmLogger.info(`Resource at ${resource.coord} has value: ${resourceValue.toFixed(2)}`);

        if (resourceValue > maxResourceValue) {
          maxResourceValue = resourceValue;
          bestResource = resource;
        }
      }
    });

    // Vérifier le carburant avant de se déplacer
    if (botVehicle.fuel < 50) {
      fsmLogger.condition(`Low fuel before movement, returning to IDLE`);
      changeState(BOT_STATES.IDLE);
      return true;
    }

    if (bestResource) {
      fsmLogger.action(`Moving to best resource at: ${bestResource.coord} with value: ${maxResourceValue.toFixed(2)}`);
      const targetTile = tileStore.tiles[bestResource.coord];
      if (targetTile) {
        fsmLogger.info(`Calling moveToTile with target: ${bestResource.coord}`);
        
        // Force l'arrêt de tout mouvement en cours avant de démarrer un nouveau mouvement
        playerStore.updateVehicle('player2', 'ship', {
          isMoving: false,
          targetTile: { position: null, coord: null }
        });
        
        // Après un court délai, lancer le nouveau mouvement
        setTimeout(() => {
          fsmLogger.action(`Now executing delayed moveToTile to ${bestResource.coord}`);
          playerStore.moveToTile('player2', 'ship', {
            coord: bestResource.coord,
            position: targetTile.position
          });
        }, 100);
        
        return true;
      }
    } else {
      fsmLogger.action(`No best resource found, filtering invalid resources from memory`);

      // Mise à jour de la mémoire avec uniquement les ressources valides
      playerStore.updatePlayerMemory('player2', {
        knownResources: validResources
      });

      if (validResources.length === 0) {
        fsmLogger.condition(`No valid resources left, returning to IDLE`);
        changeState(BOT_STATES.IDLE);
        return true;
      } else {
        fsmLogger.action(`Still ${validResources.length} valid resources, retrying collection`);
        addAction('collect', PRIORITY.MEDIUM);
      }

      return true;
    }

    return false;
  },
  
  // Retourne à la base/tuile de départ
  returnToBase: (playerStore, tileStore, addAction, changeState) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle || botVehicle.isMoving) {
      return false;
    }
    
    // Si déjà à la base
    if (botVehicle.coord === botVehicle.startCoord) {
      fsmLogger.action(`Already at base`);
      addAction('refuel', PRIORITY.MEDIUM);
      return true;
    }
    
    // Trouve la tuile de départ
    const baseTile = tileStore.tiles[botVehicle.startCoord];
    
    if (baseTile) {
      fsmLogger.action(`Moving back to base tile: ${baseTile.coord}`);
      playerStore.moveToTile('player2', 'ship', {
        coord: baseTile.coord,
        position: baseTile.position
      });
      return true;
    }
    
    return false;
  },
  
  // Ravitaille le véhicule en carburant
  refuelAtBase: (playerStore, tileStore, addAction, changeState) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle) return false;
    
    // Vérifier si le bot est à sa base
    if (botVehicle.coord !== botVehicle.startCoord) {
      fsmLogger.condition(`Not at base, cannot refuel`);
      addAction('returnToBase', PRIORITY.HIGH);
      return false;
    }
    
    fsmLogger.action(`Refueling at base`);
    playerStore.refuelVehicle('player2');
    
    // Transfert des ressources si nécessaire
    if (botVehicle.resources && (
        botVehicle.resources.food > 0 || 
        botVehicle.resources.debris > 0 || 
        botVehicle.resources.special > 0)) {
      fsmLogger.action(`Transferring resources to score`);
      playerStore.transferResourcesToScore('player2', 'ship');
    }
    
    // Retourner à IDLE après le ravitaillement
    fsmLogger.condition(`Refueling complete, returning to IDLE`);
    changeState(BOT_STATES.IDLE);
    
    return true;
  },
  
  // Envoie un drone explorer une tuile à distance
  explorerWithDrone: (playerStore, tileStore, addAction, changeState) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    const botDrone = playerStore.players?.player2?.vehicles?.drone3;
    const playerState = playerStore.players?.player2;
    
    // Vérifie si le drone est déjà en mouvement
    if (!botDrone || botDrone.isMoving) {
      fsmLogger.action(`Drone is already moving or not available`);
      return false;
    }
    
    // Si le vaisseau n'a pas de position ou de coordonnées
    if (!botVehicle || !botVehicle.coord) {
      fsmLogger.error(`Bot vehicle not initialized properly`);
      return false;
    }
    
    // Vérifier le carburant avant d'explorer
    if (botVehicle.fuel < 50) {
      fsmLogger.condition(`Low fuel before exploration, returning to IDLE`);
      changeState(BOT_STATES.IDLE);
      return true;
    }
    
    fsmLogger.action(`Attempting to find a tile to explore`);
    
    // Utiliser la nouvelle fonction getWalkableTilesInRadius avec le rayon d'exploration du joueur
    const exploringRadius = playerState?.exploringRadius || 3;
    fsmLogger.info(`Using exploring radius: ${exploringRadius}`);
    
    const walkableTilesInRadius = tileStore.getWalkableTilesInRadius(
      botVehicle, // Passe le véhicule directement (il contient la propriété coord)
      exploringRadius,
      true, // onlyUnexplored = true, ne récupère que les tuiles non explorées
      true  // excludeDanger = true, exclut les tuiles de type danger
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
      
      // Ne pas marquer la tuile comme explorée ici
      // Le composant UnifiedDroneMovement s'en chargera quand le drone atteindra la tuile
      
      // Incrémenter le compteur d'explorations
      const currentExplorationCount = playerState.memory.explorationCount || 0;
      playerStore.updatePlayerMemory('player2', {
        explorationCount: currentExplorationCount + 1
      });
      
      // Si le nombre d'explorations atteint 3 et qu'il y a des ressources connues, changer d'état
      const hasKnownResources = playerState.memory.knownResources && 
                               playerState.memory.knownResources.length > 0;
      
      if ((currentExplorationCount + 1) >= 3 && hasKnownResources) {
        fsmLogger.condition(`Exploration count reached threshold and resources found, returning to IDLE`);
        changeState(BOT_STATES.IDLE);
        return true;
      }
      
      // CORRECTIF: Force un retour à IDLE pour permettre la réévaluation
      // après chaque action d'exploration réussie
      fsmLogger.action(`Exploration action complete, returning to IDLE for re-evaluation`);
      changeState(BOT_STATES.IDLE);
      return true;
    } else {
      // Si aucune tuile non-explorée n'est trouvée à proximité, chercher une tuile aléatoire
      const randomTile = tileStore.selectRandomWalkableTile();
      if (randomTile) {
        fsmLogger.action(`No unexplored tiles nearby, sending drone to random tile: ${randomTile.coord}`);
        playerStore.moveToTile('player2', 'drone3', randomTile);
        
        // Ne pas marquer la tuile comme explorée ici
        // Le composant UnifiedDroneMovement s'en chargera quand le drone atteindra la tuile
        
        // CORRECTIF: Force un retour à IDLE pour permettre la réévaluation
        fsmLogger.action(`Random exploration action complete, returning to IDLE for re-evaluation`);
        changeState(BOT_STATES.IDLE);
        return true;
      }
    }
    
    // Si aucune action d'exploration n'a pu être effectuée, retourner à IDLE
    fsmLogger.action(`Could not find any tile to explore, returning to IDLE`);
    changeState(BOT_STATES.IDLE);
    return true;
  },
  
  // Map des types d'actions aux fonctions d'exécution
  actionMap: {
    'evaluateIdle': 'evaluateConditionsFromIdle', // Nouvelle action d'évaluation
    'move': 'moveToRandomTile',
    'collect': 'moveToKnownResource',
    'returnToBase': 'returnToBase',
    'refuel': 'refuelAtBase',
    'exploreDrone': 'explorerWithDrone'
  }
};