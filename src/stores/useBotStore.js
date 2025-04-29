import { create } from 'zustand';
import usePlayerStore from './usePlayerStore';
import { useTileStore } from './useNewTileStore'; // Utilisation de TileStore au lieu de GameStore

// Bot states
const BOT_STATES = {
  IDLE: 'idle',
  EXPLORING: 'exploring',
  COLLECTING: 'collecting',
  RETURNING: 'returning',
  AVOIDING: 'avoiding',
  REPAIRING: 'repairing',
  REFUELING: 'refueling',
};

// Bot priority levels
const PRIORITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const useBotStore = create((set, get) => ({
  // Bot state configuration
  bots: {
    player2: {
      ship: {
        currentState: BOT_STATES.IDLE,
        previousState: null,
        // Suppression de targetTile ici, nous utiliserons uniquement celle de playerStore
        memory: {
          exploredTiles: [], // Coordinates of explored tiles
          knownResources: [], // Resource locations
          knownDangers: [], // Danger locations
          availableMoves: [], // Current available moves
        },
        actionQueue: [], // Queue of planned actions
        lastActionTime: 0, // Timestamp of last action for real-time control
      },
      // Autres véhicules désactivés pour l'instant
    },
  },
  
  isRunning: false, // Flag to control real-time bot processing
  
  // Initialize bot with game data
  initializeBot: () => {
    const playerStore = usePlayerStore.getState();
    const player2 = playerStore.players.player2;

    // Set bot ships to starting positions
    set((state) => ({
      bots: {
        ...state.bots,
        player2: {
          ...state.bots.player2,
          ship: {
            ...state.bots.player2.ship,
            currentState: BOT_STATES.EXPLORING, // Start with exploration
            lastActionTime: Date.now(),
          },
        },
      },
      isRunning: true, // Auto-start the bot
    }));
  },

  // Change bot state with transition logic
  changeState: (playerId, vehicleId, newState) => {
    set((state) => {
      const botVehicle = state.bots[playerId][vehicleId];
      if (!botVehicle) return state;

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              previousState: botVehicle.currentState,
              currentState: newState,
            },
          },
        },
      };
    });
  },

  // Add action to the bot's queue
  queueAction: (playerId, vehicleId, action) => {
    set((state) => {
      const botVehicle = state.bots[playerId][vehicleId];
      if (!botVehicle) return state;

      const updatedQueue = [...botVehicle.actionQueue, {
        ...action,
        timestamp: Date.now(),
      }];

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              actionQueue: updatedQueue,
            },
          },
        },
      };
    });
  },

  // Clear action queue
  clearActionQueue: (playerId, vehicleId) => {
    set((state) => {
      const botVehicle = state.bots[playerId][vehicleId];
      if (!botVehicle) return state;

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              actionQueue: [],
            },
          },
        },
      };
    });
  },

  // Execute the next action in queue - adapted for real-time
  executeNextAction: (playerId, vehicleId) => {
    const botVehicle = get().bots[playerId][vehicleId];
    if (!botVehicle || botVehicle.actionQueue.length === 0) return false;

    // Check if sufficient time has passed since last action (cooldown)
    const now = Date.now();
    const cooldownTime = 1000; // 1 second cooldown between actions
    if (now - botVehicle.lastActionTime < cooldownTime) {
      return false; // Still on cooldown
    }

    const nextAction = botVehicle.actionQueue[0];
    const playerStore = usePlayerStore.getState();
    
    // Execute the action based on type
    switch (nextAction.type) {
      case 'move':
        playerStore.moveToTile(playerId, vehicleId, nextAction.targetTile);
        break;
      case 'collect':
        playerStore.collectResources(playerId, vehicleId, nextAction.tile);
        break;
      case 'repair':
        playerStore.repairVehicle(playerId);
        break;
      case 'refuel':
        playerStore.refuelVehicle(playerId);
        break;
      case 'transferResources':
        playerStore.transferResourcesToScore(playerId, vehicleId);
        break;
      default:
        console.warn(`Unknown action type: ${nextAction.type}`);
        break;
    }

    // Remove the executed action from queue and update last action time
    set((state) => {
      const botVehicle = state.bots[playerId][vehicleId];
      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              actionQueue: botVehicle.actionQueue.slice(1),
              lastActionTime: now,
            },
          },
        },
      };
    });

    return true;
  },

  // Find nearby resources for exploration
  findNearbyResources: (playerId, vehicleId, radius = 3) => {
    const tiles = useTileStore.getState().tiles; // Utiliser TileStore
    const playerStore = usePlayerStore.getState();
    const vehicle = playerStore.players[playerId].vehicles[vehicleId];
    
    if (!vehicle || !vehicle.coord) return [];
    
    const [vX, vY] = vehicle.coord.split(',').map(Number);
    const resources = [];
    
    // Scan surrounding tiles for resources
    for (let x = vX - radius; x <= vX + radius; x++) {
      for (let y = vY - radius; y <= vY + radius; y++) {
        const coord = `${x},${y}`;
        const tile = tiles[coord];
        
        if (tile && !tile.collected && tile.resources && 
            (tile.resources.food > 0 || tile.resources.debris > 0 || tile.resources.special > 0)) {
          resources.push({
            coord,
            position: tile.position,
            resources: tile.resources,
            distance: Math.sqrt(Math.pow(x - vX, 2) + Math.pow(y - vY, 2)),
          });
        }
      }
    }
    
    return resources.sort((a, b) => a.distance - b.distance);
  },

  // Update memory with new information
  updateMemory: (playerId, vehicleId, memoryUpdates) => {
    set((state) => {
      const botVehicle = state.bots[playerId][vehicleId];
      if (!botVehicle) return state;

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              memory: {
                ...botVehicle.memory,
                ...memoryUpdates,
              },
            },
          },
        },
      };
    });
  },

  /**
   * Fait déplacer un bot vers une tuile choisie au hasard
   * @param {string} playerId - ID du joueur (bot)
   * @param {string} vehicleId - ID du véhicule
   * @returns {boolean} - true si le déplacement a été initié, false sinon
   */
  moveToRandomTile: (playerId, vehicleId) => {
    // Obtenir une tuile walkable aléatoire
    const randomTile = useTileStore.getState().selectRandomWalkableTile();
    if (!randomTile) {
      console.warn("Pas de tuile walkable disponible pour le déplacement aléatoire");
      return false;
    }

    console.log(`Bot ${playerId}/${vehicleId} moving to random tile:`, randomTile.coord);

    // Initialiser le mouvement via PlayerStore - c'est le seul endroit où la cible est définie
    usePlayerStore.getState().moveToTile(playerId, vehicleId, {
      position: randomTile.position,
      coord: randomTile.coord
    });

    // Mettre à jour l'état du bot SANS stocker targetTile en double
    set((state) => {
      const botVehicle = state.bots[playerId][vehicleId];
      if (!botVehicle) return state;

      return {
        bots: {
          ...state.bots,
          [playerId]: {
            ...state.bots[playerId],
            [vehicleId]: {
              ...botVehicle,
              currentState: BOT_STATES.EXPLORING,
              lastActionTime: Date.now(),
            },
          },
        },
      };
    });

    return true;
  },

  // Make decisions based on current state and environment - focus on exploration
  makeDecision: (playerId, vehicleId) => {
    const botVehicle = get().bots[playerId][vehicleId];
    const playerStore = usePlayerStore.getState();
    const vehicle = playerStore.players[playerId].vehicles[vehicleId];
    const tiles = useTileStore.getState().tiles; // Utiliser TileStore
    
    if (!botVehicle || !vehicle) {
      console.log("Missing bot or vehicle data in makeDecision");
      return;
    }

    // Clear action queue if we need to recalculate
    get().clearActionQueue(playerId, vehicleId);
    
    console.log(`Bot ${playerId}/${vehicleId} making decision in state: ${botVehicle.currentState}`);
    
    // Selon l'état actuel du bot, effectuez différentes actions
    switch (botVehicle.currentState) {
      case BOT_STATES.IDLE:
        // Si inactif, commencer à explorer
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        break;
        
      case BOT_STATES.EXPLORING:
        // Si en phase d'exploration et pas de déplacement en cours, choisir une tuile au hasard
        if (!vehicle.isMoving) {
          console.log("Bot is not moving, selecting random tile");
          get().moveToRandomTile(playerId, vehicleId);
        } else {
          console.log("Bot is already moving, no new decision needed");
        }
        break;
        
      case BOT_STATES.COLLECTING:
        // Logique de collecte - à implémenter plus tard
        break;
        
      case BOT_STATES.RETURNING:
        // Logique de retour à la base - à implémenter plus tard
        break;
        
      case BOT_STATES.AVOIDING:
        // Logique d'évitement de danger - à implémenter plus tard
        break;
        
      case BOT_STATES.REPAIRING:
        // Logique de réparation - à implémenter plus tard
        break;
        
      case BOT_STATES.REFUELING:
        // Logique de ravitaillement - à implémenter plus tard
        break;
        
      default:
        // État inconnu, revenir à l'exploration
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
    }
  },

  // Process bot in real-time
  processBot: () => {
    if (!get().isRunning) return;
    
    const playerId = 'player2';
    const vehicleId = 'ship'; // Focus on ship only
    
    // Make a decision if the action queue is empty
    const bot = get().bots[playerId][vehicleId];
    if (!bot) return;
    
    if (bot.actionQueue.length === 0) {
      get().makeDecision(playerId, vehicleId);
    }
    
    // Execute next action with cooldown handling
    get().executeNextAction(playerId, vehicleId);
  },
  
  // Start/stop bot processing
  toggleBotProcessing: () => {
    set(state => ({ isRunning: !state.isRunning }));
  }
}));

export default useBotStore;

