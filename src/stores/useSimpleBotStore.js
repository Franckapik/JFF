// src/stores/useSimpleBotStore.js
// Un store simplifié pour une machine à états finis (FSM) avec trois états
// et une file d'actions prioritaires
import { create } from 'zustand';
import usePlayerStore from './usePlayerStore';
import { useTileStore } from './useNewTileStore';

// Les états possibles du bot
const BOT_STATES = {
  IDLE: 'idle',         // En attente, ne fait rien
  EXPLORING: 'exploring', // Exploration de la carte
  RETURNING: 'returning'  // Retour à la base/tuile de départ
};

// Niveaux de priorité des actions
const PRIORITY = {
  LOW: 1,     // Priorité basse
  MEDIUM: 2,  // Priorité moyenne
  HIGH: 3,    // Priorité haute
  URGENT: 4   // Priorité urgente/critique
};

// Store bot avec file d'actions prioritaires
const useSimpleBotStore = create((set, get) => ({
  // État initial du bot
  botState: BOT_STATES.IDLE,
  isRunning: false,
  
  // NOUVELLE PROPRIÉTÉ: File d'actions avec priorités
  actionQueue: [], // [{type, priority, params, timestamp}]
  
  // Fonction d'initialisation - démarre le bot
  initializeBot: () => {
    console.log("[SimpleBotStore] Initializing bot");
    set({
      botState: BOT_STATES.EXPLORING,
      isRunning: true,
      actionQueue: [] // Réinitialise la file d'actions
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
  
  // NOUVELLE MÉTHODE: Ajoute une action à la file d'attente avec priorité
  addAction: (actionType, priority = PRIORITY.MEDIUM, params = {}) => {
    const newAction = {
      type: actionType,
      priority, 
      params,
      timestamp: Date.now()
    };
    
    console.log(`[SimpleBotStore] Adding action to queue: ${actionType} with priority ${priority}`);
    
    // Insérer l'action dans la file et trier par priorité (plus haute en premier)
    set((state) => {
      const updatedQueue = [...state.actionQueue, newAction]
        .sort((a, b) => {
          // D'abord par priorité (ordre décroissant)
          if (b.priority !== a.priority) return b.priority - a.priority;
          // Ensuite par timestamp (FIFO pour même priorité)
          return a.timestamp - b.timestamp;
        });
      
      return { actionQueue: updatedQueue };
    });
  },
  
  // NOUVELLE MÉTHODE: Supprime la première action de la file
  removeFirstAction: () => {
    set((state) => ({
      actionQueue: state.actionQueue.slice(1)
    }));
  },
  
  // NOUVELLE MÉTHODE: Exécute l'action la plus prioritaire de la file
  executeNextAction: () => {
    const actionQueue = get().actionQueue;
    if (actionQueue.length === 0) return false;
    
    const nextAction = actionQueue[0];
    console.log(`[SimpleBotStore] Executing action: ${nextAction.type} with priority ${nextAction.priority}`);
    
    // Exécuter l'action selon son type
    let success = false;
    
    switch (nextAction.type) {
      case 'move':
        success = get().moveToRandomTile();
        break;
      
      case 'returnToBase':
        success = get().returnToBase();
        break;
      
      case 'refuel':
        success = get().refuelAtBase();
        break;
        
      // Ajoutez d'autres types d'actions selon vos besoins
      
      default:
        console.warn(`[SimpleBotStore] Unknown action type: ${nextAction.type}`);
        break;
    }
    
    // Retirer l'action de la file seulement si elle a été exécutée avec succès
    if (success) {
      get().removeFirstAction();
    }
    
    return success;
  },
  
  // Vérifie les conditions et change d'état si nécessaire
  checkConditions: () => {
    const currentState = get().botState;
    const playerStore = usePlayerStore.getState();
    const botVehicle = playerStore.players.player2?.vehicles?.ship;
    
    if (!botVehicle) return;
    
    // Condition: si le carburant est inférieur à 50%, passer en mode RETURNING
    if (currentState === BOT_STATES.EXPLORING && botVehicle.fuel < 50) {
      console.log(`[SimpleBotStore] Fuel level low (${botVehicle.fuel}%), switching to RETURNING state`);
      get().changeState(BOT_STATES.RETURNING);
      
      // Ajouter une action de retour à la base avec priorité haute
      get().addAction('returnToBase', PRIORITY.HIGH);
    }
  },
  
  // MÉTHODES D'ACTION SPÉCIFIQUES
  
  // Se déplace vers une tuile aléatoire
  moveToRandomTile: () => {
    const playerStore = usePlayerStore.getState();
    const tileStore = useTileStore.getState();
    const botVehicle = playerStore.players.player2?.vehicles?.ship;
    
    if (!botVehicle || botVehicle.isMoving) {
      return false;
    }
    
    // Récupère une tuile walkable aléatoire
    const randomTile = tileStore.selectRandomWalkableTile();
    if (randomTile) {
      console.log(`[SimpleBotStore] Moving to random tile: ${randomTile.coord}`);
      
      // Déplace le vaisseau vers cette tuile
      playerStore.moveToTile('player2', 'ship', randomTile);
      return true;
    }
    
    return false;
  },
  
  // Retourne à la base/tuile de départ
  returnToBase: () => {
    const playerStore = usePlayerStore.getState();
    const tileStore = useTileStore.getState();
    const botVehicle = playerStore.players.player2?.vehicles?.ship;
    
    if (!botVehicle || botVehicle.isMoving) {
      return false;
    }
    
    // Si déjà à la base
    if (botVehicle.coord === botVehicle.startCoord) {
      console.log(`[SimpleBotStore] Already at base`);
      
      // Ajouter action de ravitaillement avec priorité moyenne
      get().addAction('refuel', PRIORITY.MEDIUM);
      return true;
    }
    
    // Trouve la tuile de départ
    const baseTile = tileStore.tiles[botVehicle.startCoord];
    
    if (baseTile) {
      console.log(`[SimpleBotStore] Moving back to base tile: ${baseTile.coord}`);
      
      // Déplace le bot vers sa base
      playerStore.moveToTile('player2', 'ship', {
        coord: baseTile.coord,
        position: baseTile.position
      });
      return true;
    }
    
    return false;
  },
  
  // Ravitaille le véhicule en carburant
  refuelAtBase: () => {
    const playerStore = usePlayerStore.getState();
    const botVehicle = playerStore.players.player2?.vehicles?.ship;
    
    if (!botVehicle) return false;
    
    // Vérifier si le bot est à sa base
    if (botVehicle.coord !== botVehicle.startCoord) {
      console.log(`[SimpleBotStore] Not at base, cannot refuel`);
      
      // Ajouter action de retour à la base avec priorité haute
      get().addAction('returnToBase', PRIORITY.HIGH);
      return false;
    }
    
    console.log(`[SimpleBotStore] Refueling at base`);
    playerStore.refuelVehicle('player2');
    
    // Si plein, revenir en mode exploration
    if (botVehicle.fuel >= 100) {
      console.log("[SimpleBotStore] Fuel full, returning to exploring state");
      
      // Transférer les ressources au score (si API disponible)
      if (playerStore.transferResourcesToScore) {
        playerStore.transferResourcesToScore('player2', 'ship');
      }
      
      // Revenir à l'état d'exploration
      get().changeState(BOT_STATES.EXPLORING);
      
      // Ajouter action d'exploration
      get().addAction('move', PRIORITY.MEDIUM);
    }
    
    return true;
  },
  
  // Traite l'état du bot (à appeler périodiquement)
  processBot: () => {
    if (!get().isRunning) return;
    
    // 1. Vérifier les conditions avant tout
    get().checkConditions();
    
    // 2. Si la file d'actions est vide, ajouter des actions selon l'état
    if (get().actionQueue.length === 0) {
      const currentState = get().botState;
      
      switch (currentState) {
        case BOT_STATES.IDLE:
          // Ne rien faire en IDLE
          break;
          
        case BOT_STATES.EXPLORING:
          // Ajouter une action de mouvement aléatoire
          get().addAction('move', PRIORITY.LOW);
          break;
          
        case BOT_STATES.RETURNING:
          // Ajouter une action de retour à la base
          get().addAction('returnToBase', PRIORITY.HIGH);
          break;
      }
    }
    
    // 3. Exécuter l'action la plus prioritaire de la file
    get().executeNextAction();
  },
  
  // Active/désactive le traitement du bot
  toggleBotProcessing: () => {
    const currentlyRunning = get().isRunning;
    set({ isRunning: !currentlyRunning });
    console.log(`[SimpleBotStore] Bot processing ${!currentlyRunning ? "started" : "stopped"}`);
  },
  
  // Expose les constantes pour usage externe
  PRIORITY
}));

export default useSimpleBotStore;