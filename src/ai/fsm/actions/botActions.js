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
  
  // Map des types d'actions aux fonctions d'exécution
  actionMap: {
    'move': 'moveToRandomTile',
    'collect': 'moveAndCollect',
    'returnToBase': 'returnToBase',
    'refuel': 'refuelAtBase'
  }
};