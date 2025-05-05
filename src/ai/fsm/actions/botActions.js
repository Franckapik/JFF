// src/ai/fsm/actions/botActions.js
// Actions que le bot peut exécuter dans la FSM

import { PRIORITY } from '../../constants/botConstants';

/**
 * Registre des actions du bot
 * Chaque fonction prend le store du joueur et le store des tuiles
 * et effectue une action spécifique
 */
export const BotActions = {
  // Se déplace vers une tuile aléatoire
  moveToRandomTile: (playerStore, tileStore) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle || botVehicle.isMoving) {
      return false;
    }
    
    const randomTile = tileStore.selectRandomWalkableTile();
    if (randomTile) {
      console.log(`[BotActions] Moving to random tile: ${randomTile.coord}`);
      playerStore.moveToTile('player2', 'ship', randomTile);
      return true;
    }
    
    return false;
  },
  
  // NOUVELLE ACTION: Se déplace vers une ressource connue et la collecte
  moveToKnownResource: (playerStore, tileStore) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    const botMemory = playerStore.players?.player2?.memory;
    
    if (!botVehicle || botVehicle.isMoving || !botMemory) {
      return false;
    }
    
    // Si le bot est déjà sur une tuile avec des ressources, collecter d'abord
    if (botVehicle.coord) {
      const currentTile = tileStore.tiles[botVehicle.coord];
      if (currentTile && currentTile.resources && 
          (currentTile.resources.food > 0 || 
           currentTile.resources.debris > 0 || 
           currentTile.resources.special > 0)) {
        console.log(`[BotActions] Collecting resources at current tile: ${botVehicle.coord}`);
        playerStore.collectResources('player2', 'ship', currentTile);
        return true;
      }
    }
    
    // Vérifier s'il y a des ressources connues
    if (!botMemory.knownResources || botMemory.knownResources.length === 0) {
      console.log(`[BotActions] No known resources to collect`);
      return false;
    }
    
    // Trouver la ressource la plus proche
    let nearestResource = null;
    let shortestDistance = Infinity;
    
    if (botVehicle.coord) {
      const [shipX, shipY] = botVehicle.coord.split(',').map(Number);
      
      botMemory.knownResources.forEach(resource => {
        const [resX, resY] = resource.coord.split(',').map(Number);
        const distance = Math.sqrt(Math.pow(resX - shipX, 2) + Math.pow(resY - shipY, 2));
        
        // Vérifier si la ressource existe toujours (n'a pas été collectée)
        const tile = tileStore.tiles[resource.coord];
        if (tile && tile.resources && 
            (tile.resources.food > 0 || tile.resources.debris > 0 || tile.resources.special > 0) && 
            !tile.collected) {
          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestResource = resource;
          }
        }
      });
    }
    
    // Si une ressource valide a été trouvée, s'y déplacer
    if (nearestResource) {
      console.log(`[BotActions] Moving to known resource at: ${nearestResource.coord}`);
      const targetTile = tileStore.tiles[nearestResource.coord];
      if (targetTile) {
        playerStore.moveToTile('player2', 'ship', {
          coord: nearestResource.coord,
          position: targetTile.position
        });
        return true;
      }
    } else {
      // Si toutes les ressources connues ont été collectées, les supprimer de la mémoire
      console.log(`[BotActions] Clearing collected resources from memory`);
      playerStore.setState((state) => ({
        players: {
          ...state.players,
          player2: {
            ...state.players.player2,
            memory: {
              ...state.players.player2.memory,
              knownResources: []
            }
          }
        }
      }));
    }
    
    return false;
  },
  
  // Se déplace vers une tuile aléatoire et collecte automatiquement les ressources à l'arrivée
  moveAndCollect: (playerStore, tileStore) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle || botVehicle.isMoving) {
      return false;
    }
    
    // Si le bot vient d'arriver sur une tuile avec des ressources, collecter d'abord
    if (botVehicle.coord) {
      const currentTile = tileStore.tiles[botVehicle.coord];
      if (currentTile && currentTile.resources && 
          (currentTile.resources.food > 0 || 
           currentTile.resources.debris > 0 || 
           currentTile.resources.special > 0)) {
        console.log(`[BotActions] Collecting resources at tile: ${botVehicle.coord}`);
        playerStore.collectResources('player2', 'ship', currentTile);
      }
    }
    
    // Puis se déplacer vers une nouvelle tuile aléatoire
    const randomTile = tileStore.selectRandomWalkableTile();
    if (randomTile) {
      console.log(`[BotActions] Moving to random tile: ${randomTile.coord}`);
      playerStore.moveToTile('player2', 'ship', randomTile);
      return true;
    }
    
    return false;
  },
  
  // Retourne à la base/tuile de départ
  returnToBase: (playerStore, tileStore, addAction) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle || botVehicle.isMoving) {
      return false;
    }
    
    // Si déjà à la base
    if (botVehicle.coord === botVehicle.startCoord) {
      console.log(`[BotActions] Already at base`);
      addAction('refuel', PRIORITY.MEDIUM);
      return true;
    }
    
    // Trouve la tuile de départ
    const baseTile = tileStore.tiles[botVehicle.startCoord];
    
    if (baseTile) {
      console.log(`[BotActions] Moving back to base tile: ${baseTile.coord}`);
      playerStore.moveToTile('player2', 'ship', {
        coord: baseTile.coord,
        position: baseTile.position
      });
      return true;
    }
    
    return false;
  },
  
  // Ravitaille le véhicule en carburant
  refuelAtBase: (playerStore, changeState, addAction) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    
    if (!botVehicle) return false;
    
    // Vérifier si le bot est à sa base
    if (botVehicle.coord !== botVehicle.startCoord) {
      console.log(`[BotActions] Not at base, cannot refuel`);
      addAction('returnToBase', PRIORITY.HIGH);
      return false;
    }
    
    console.log(`[BotActions] Refueling at base`);
    playerStore.refuelVehicle('player2');
    
    // La vérification du carburant plein sera faite par les conditions
    return true;
  },
  
  // Envoie un drone explorer une tuile à distance
  explorerWithDrone: (playerStore, tileStore) => {
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    const botDrone = playerStore.players?.player2?.vehicles?.drone3;
    const playerState = playerStore.players?.player2;
    
    // Vérifie si le drone est déjà en mouvement
    if (!botDrone || botDrone.isMoving) {
      console.log(`[BotActions] Drone is already moving or not available`);
      return false;
    }
    
    // Si le vaisseau n'a pas de position ou de coordonnées
    if (!botVehicle || !botVehicle.coord) {
      console.log(`[BotActions] Bot vehicle not initialized properly`);
      return false;
    }
    
    console.log(`[BotActions] Attempting to find a tile to explore`);
    
    // Utiliser la nouvelle fonction getWalkableTilesInRadius avec le rayon d'exploration du joueur
    const exploringRadius = playerState?.exploringRadius || 3;
    console.log(`[BotActions] Using exploring radius: ${exploringRadius}`);
    
    const walkableTilesInRadius = tileStore.getWalkableTilesInRadius(
      botVehicle, // Passe le véhicule directement (il contient la propriété coord)
      exploringRadius,
      true, // onlyUnexplored = true, ne récupère que les tuiles non explorées
      true  // excludeDanger = true, exclut les tuiles de type danger
    );
    
    console.log(`[BotActions] Found ${walkableTilesInRadius.length} walkable unexplored tiles in radius`);
    
    // Si des tuiles sont trouvées à proximité
    if (walkableTilesInRadius.length > 0) {
      // La première tuile est déjà la plus proche grâce au tri dans getWalkableTilesInRadius
      const targetTileInfo = walkableTilesInRadius[0];
      
      console.log(`[BotActions] Sending drone to explore tile: ${targetTileInfo.coord}, distance: ${targetTileInfo.distance.toFixed(2)}`);
      
      playerStore.moveToTile('player2', 'drone3', {
        coord: targetTileInfo.coord,
        position: targetTileInfo.position
      });
      
      // Ne pas marquer la tuile comme explorée ici
      // Le composant UnifiedDroneMovement s'en chargera quand le drone atteindra la tuile
      
      return true;
    } else {
      // Si aucune tuile non-explorée n'est trouvée à proximité, chercher une tuile aléatoire
      const randomTile = tileStore.selectRandomWalkableTile();
      if (randomTile) {
        console.log(`[BotActions] No unexplored tiles nearby, sending drone to random tile: ${randomTile.coord}`);
        playerStore.moveToTile('player2', 'drone3', randomTile);
        
        // Ne pas marquer la tuile comme explorée ici
        // Le composant UnifiedDroneMovement s'en chargera quand le drone atteindra la tuile
        
        return true;
      }
    }
    
    console.log(`[BotActions] Could not find any tile to explore`);
    return false;
  },
  
  // Map des types d'actions aux fonctions d'exécution
  actionMap: {
    'move': 'moveToRandomTile',
    'collect': 'moveToKnownResource', // Changé pour utiliser la nouvelle action
    'returnToBase': 'returnToBase',
    'refuel': 'refuelAtBase',
    'exploreDrone': 'explorerWithDrone'
  }
};