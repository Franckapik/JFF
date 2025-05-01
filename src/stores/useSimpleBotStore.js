// src/stores/useSimpleBotStore.js
// Un store simplifié pour une machine à états finis (FSM) avec seulement deux états
import { create } from 'zustand';
import usePlayerStore from './usePlayerStore';
import { useTileStore } from './useNewTileStore';

// Les états possibles du bot - commençons avec seulement deux
const BOT_STATES = {
  IDLE: 'idle',         // En attente, ne fait rien
  EXPLORING: 'exploring' // Exploration de la carte
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