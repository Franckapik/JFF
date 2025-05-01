// src/stores/useSimpleBotStore.js
// Un store simplifié pour une machine à états finis (FSM) avec trois états
import { create } from 'zustand';
import usePlayerStore from './usePlayerStore';
import { useTileStore } from './useNewTileStore';

// Les états possibles du bot - Ajout de RETURNING aux états existants
const BOT_STATES = {
  IDLE: 'idle',         // En attente, ne fait rien
  EXPLORING: 'exploring', // Exploration de la carte
  RETURNING: 'returning'  // Retour à la base/tuile de départ
};

// Store bot ultra simplifié
const useSimpleBotStore = create((set, get) => ({
  // État initial du bot
  botState: BOT_STATES.IDLE,
  isRunning: false,
  
  // Fonction d'initialisation - démarre le bot
  initializeBot: () => {
    console.log("[SimpleBotStore] Initializing bot");
    set({
      botState: BOT_STATES.EXPLORING,
      isRunning: true
    });
  },
  
  // Change l'état du bot
  changeState: (newState) => {
    if (!Object.values(BOT_STATES).includes(newState)) {
      console.warn(`[SimpleBotStore] Invalid state: ${newState}`);
      return;
    }
    
    console.log(`[SimpleBotStore] Changing state from ${get().botState} to ${newState}`);
    set({ botState: newState });
  },
  
  // Exécute une action simple basée sur l'état actuel
  performAction: () => {
    const currentState = get().botState;
    const playerStore = usePlayerStore.getState();
    const tileStore = useTileStore.getState();
    
    console.log(`[SimpleBotStore] Performing action in state: ${currentState}`);
    
    // Récupérer le véhicule du bot et sa base de départ
    const botVehicle = playerStore.players.player2?.vehicles?.ship;
    
    if (!botVehicle) {
      console.error("[SimpleBotStore] Bot vehicle not found");
      return;
    }
    
    switch (currentState) {
      case BOT_STATES.IDLE:
        // Dans l'état IDLE, on ne fait rien
        console.log("[SimpleBotStore] Bot is idle, doing nothing");
        break;
        
      case BOT_STATES.EXPLORING:
        // Dans l'état EXPLORING, on fait un mouvement aléatoire
        console.log("[SimpleBotStore] Bot is exploring, moving randomly");
        
        // Récupère une tuile walkable aléatoire
        const randomTile = tileStore.selectRandomWalkableTile();
        if (randomTile) {
          // Déplace le vaisseau vers cette tuile
          playerStore.moveToTile('player2', 'ship', randomTile);
        }
        break;
        
      case BOT_STATES.RETURNING:
        // Dans l'état RETURNING, on retourne à la base de départ
        console.log("[SimpleBotStore] Bot is returning to home base");
        
        // Si le bot n'est pas déjà à la base et n'est pas en mouvement
        if (botVehicle.coord !== botVehicle.startCoord && !botVehicle.isMoving) {
          // Trouve la tuile de départ
          const baseTile = tileStore.tiles[botVehicle.startCoord];
          
          if (baseTile) {
            console.log(`[SimpleBotStore] Moving bot back to base tile: ${baseTile.coord}`);
            
            // Déplace le bot vers sa base
            playerStore.moveToTile('player2', 'ship', {
              coord: baseTile.coord,
              position: baseTile.position
            });
          }
        }
        
        // Si le bot est arrivé à la base
        if (botVehicle.coord === botVehicle.startCoord && !botVehicle.isMoving) {
          console.log("[SimpleBotStore] Bot has reached home base, returning to exploring state");
          
          // Transférer les ressources au score (si API disponible)
          if (playerStore.transferResourcesToScore) {
            playerStore.transferResourcesToScore('player2', 'ship');
          }
          
          // Revenir à l'état d'exploration
          get().changeState(BOT_STATES.EXPLORING);
        }
        break;
    }
  },
  
  // Traite l'état du bot (à appeler périodiquement)
  processBot: () => {
    if (!get().isRunning) return;
    
    // Exécute l'action appropriée selon l'état actuel
    get().performAction();
  },
  
  // Active/désactive le traitement du bot
  toggleBotProcessing: () => {
    const currentlyRunning = get().isRunning;
    set({ isRunning: !currentlyRunning });
    console.log(`[SimpleBotStore] Bot processing ${!currentlyRunning ? "started" : "stopped"}`);
  }
}));

export default useSimpleBotStore;