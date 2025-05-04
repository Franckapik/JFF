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
    
    // Obtenir les coordonnées du vaisseau
    const [shipX, shipY] = botVehicle.coord.split(',').map(Number);
    const explorationRadius = 5;
    const tiles = tileStore.tiles;
    const tileCoords = Object.keys(tiles);
    
    // Filtrer pour obtenir toutes les tuiles walkable dans le rayon d'exploration
    const nearbyTiles = tileCoords
      .map(coord => {
        const [x, y] = coord.split(',').map(Number);
        const distance = Math.sqrt(Math.pow(x - shipX, 2) + Math.pow(y - shipY, 2));
        return { 
          coord,
          tile: tiles[coord], 
          distance 
        };
      })
      .filter(item => 
        item.tile.walkable !== false && // Tuile où on peut marcher
        item.distance <= explorationRadius && // Dans le rayon d'exploration
        !item.tile.explored // N'a pas encore été explorée
      )
      .sort((a, b) => a.distance - b.distance); // Trier par distance
    
    console.log(`[BotActions] Found ${nearbyTiles.length} nearby unexplored tiles`);
    
    // Si des tuiles sont trouvées à proximité
    if (nearbyTiles.length > 0) {
      // Prendre la tuile la plus proche
      const targetTileInfo = nearbyTiles[0];
      const targetTile = targetTileInfo.tile;
      
      console.log(`[BotActions] Sending drone to explore tile: ${targetTileInfo.coord}, distance: ${targetTileInfo.distance.toFixed(2)}`);
      
      playerStore.moveToTile('player2', 'drone3', {
        coord: targetTileInfo.coord,
        position: targetTile.position
      });
      
      // Marquer la tuile comme explorée
      tileStore.markTileAsExplored(targetTileInfo.coord);
      return true;
    } else {
      // Si aucune tuile non-explorée n'est trouvée à proximité, chercher une tuile aléatoire
      const randomTile = tileStore.selectRandomWalkableTile();
      if (randomTile) {
        console.log(`[BotActions] No unexplored tiles nearby, sending drone to random tile: ${randomTile.coord}`);
        playerStore.moveToTile('player2', 'drone3', randomTile);
        
        // Marquer la tuile comme explorée
        tileStore.markTileAsExplored(randomTile.coord);
        return true;
      }
    }
    
    console.log(`[BotActions] Could not find any tile to explore`);
    return false;
  },
  
  // Map des types d'actions aux fonctions d'exécution
  actionMap: {
    'move': 'moveToRandomTile',
    'collect': 'moveAndCollect',
    'returnToBase': 'returnToBase',
    'refuel': 'refuelAtBase',
    'exploreDrone': 'explorerWithDrone'
  }
};