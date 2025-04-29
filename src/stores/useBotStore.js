import { create } from 'zustand';
import usePlayerStore from './usePlayerStore';
import useGameStore from './useGameStore'; // Assuming you have a game store with tile information

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
        targetTile: null,
        memory: {
          exploredTiles: [], // Coordinates of explored tiles
          knownResources: [], // Resource locations
          knownDangers: [], // Danger locations
          availableMoves: [], // Current available moves
        },
        actionQueue: [], // Queue of planned actions
      },
      drone3: {
        currentState: BOT_STATES.IDLE,
        previousState: null,
        targetTile: null,
        memory: {
          exploredTiles: [],
          knownResources: [],
          knownDangers: [],
          availableMoves: [],
        },
        actionQueue: [],
      },
      drone4: {
        currentState: BOT_STATES.IDLE,
        previousState: null,
        targetTile: null,
        memory: {
          exploredTiles: [],
          knownResources: [],
          knownDangers: [],
          availableMoves: [],
        },
        actionQueue: [],
      },
    },
  },

  // Initialize bot with game data
  initializeBot: () => {
    const playerStore = usePlayerStore.getState();
    const player2 = playerStore.players.player2;

    // Set bot vehicles to starting positions
    set((state) => ({
      bots: {
        ...state.bots,
        player2: {
          ...state.bots.player2,
          ship: {
            ...state.bots.player2.ship,
            currentState: BOT_STATES.IDLE,
          },
          drone3: {
            ...state.bots.player2.drone3,
            currentState: BOT_STATES.IDLE,
          },
          drone4: {
            ...state.bots.player2.drone4,
            currentState: BOT_STATES.IDLE,
          }
        },
      },
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

  // Execute the next action in queue
  executeNextAction: (playerId, vehicleId) => {
    const botVehicle = get().bots[playerId][vehicleId];
    if (!botVehicle || botVehicle.actionQueue.length === 0) return false;

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

    // Remove the executed action from queue
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
            },
          },
        },
      };
    });

    return true;
  },

  // Find nearby resources for exploration
  findNearbyResources: (playerId, vehicleId, radius = 3) => {
    const gameStore = useGameStore.getState();
    const playerStore = usePlayerStore.getState();
    const vehicle = playerStore.players[playerId].vehicles[vehicleId];
    const tiles = gameStore.tiles;
    
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

  // Make decisions based on current state and environment
  makeDecision: (playerId, vehicleId) => {
    const botVehicle = get().bots[playerId][vehicleId];
    const playerStore = usePlayerStore.getState();
    const vehicle = playerStore.players[playerId].vehicles[vehicleId];
    const gameStore = useGameStore.getState();
    
    if (!botVehicle || !vehicle) return;

    // Clear action queue if we need to recalculate
    get().clearActionQueue(playerId, vehicleId);
    
    // Basic bot decision making based on state
    switch (botVehicle.currentState) {
      case BOT_STATES.IDLE: {
        // Check if we need repairs or fuel
        if (vehicle.damage > 50) {
          get().changeState(playerId, vehicleId, BOT_STATES.REPAIRING);
          return get().makeDecision(playerId, vehicleId);
        }
        
        if (vehicle.fuel < 30) {
          get().changeState(playerId, vehicleId, BOT_STATES.REFUELING);
          return get().makeDecision(playerId, vehicleId);
        }
        
        // Check for resources to collect
        const nearbyResources = get().findNearbyResources(playerId, vehicleId);
        if (nearbyResources.length > 0) {
          get().changeState(playerId, vehicleId, BOT_STATES.COLLECTING);
          return get().makeDecision(playerId, vehicleId);
        }
        
        // Default to exploring
        get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        return get().makeDecision(playerId, vehicleId);
      }
      
      case BOT_STATES.EXPLORING: {
        // Find unexplored tiles with potential
        // Simple example: just move to a random adjacent tile
        const [vX, vY] = vehicle.coord.split(',').map(Number);
        const possibleMoves = [
          { x: vX + 1, y: vY },
          { x: vX - 1, y: vY },
          { x: vX, y: vY + 1 },
          { x: vX, y: vY - 1 },
        ];
        
        const validMoves = possibleMoves.filter(move => {
          const coord = `${move.x},${move.y}`;
          const tile = gameStore.tiles[coord];
          return tile && tile.type !== 'obstacle';
        });
        
        if (validMoves.length > 0) {
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          const targetCoord = `${randomMove.x},${randomMove.y}`;
          const targetTile = gameStore.tiles[targetCoord];
          
          if (targetTile) {
            get().queueAction(playerId, vehicleId, {
              type: 'move',
              targetTile: {
                position: targetTile.position,
                coord: targetCoord,
              },
              priority: PRIORITY.MEDIUM,
            });
          }
        }
        break;
      }
      
      case BOT_STATES.COLLECTING: {
        const nearbyResources = get().findNearbyResources(playerId, vehicleId);
        if (nearbyResources.length > 0) {
          const target = nearbyResources[0];
          const targetTile = gameStore.tiles[target.coord];
          
          // Move to resource
          get().queueAction(playerId, vehicleId, {
            type: 'move',
            targetTile: {
              position: targetTile.position,
              coord: target.coord,
            },
            priority: PRIORITY.HIGH,
          });
          
          // Collect resource
          get().queueAction(playerId, vehicleId, {
            type: 'collect',
            tile: targetTile,
            priority: PRIORITY.HIGH,
          });
          
          // Check if inventory is getting full
          const resources = vehicle.resources;
          const totalResources = resources.food + resources.debris + resources.special;
          
          if (totalResources > 8) { // Arbitrary threshold
            get().changeState(playerId, vehicleId, BOT_STATES.RETURNING);
          }
        } else {
          get().changeState(playerId, vehicleId, BOT_STATES.EXPLORING);
        }
        break;
      }
      
      case BOT_STATES.RETURNING: {
        // Head back to base
        if (vehicle.startCoord) {
          const baseTile = gameStore.tiles[vehicle.startCoord];
          if (baseTile) {
            get().queueAction(playerId, vehicleId, {
              type: 'move',
              targetTile: {
                position: baseTile.position,
                coord: vehicle.startCoord,
              },
              priority: PRIORITY.HIGH,
            });
            
            // Transfer resources once we arrive
            get().queueAction(playerId, vehicleId, {
              type: 'transferResources',
              priority: PRIORITY.HIGH,
            });
            
            // Return to exploring after transferring
            get().changeState(playerId, vehicleId, BOT_STATES.IDLE);
          }
        }
        break;
      }
      
      case BOT_STATES.REPAIRING: {
        // Head to base for repairs
        if (vehicle.startCoord) {
          const baseTile = gameStore.tiles[vehicle.startCoord];
          if (baseTile) {
            get().queueAction(playerId, vehicleId, {
              type: 'move',
              targetTile: {
                position: baseTile.position,
                coord: vehicle.startCoord,
              },
              priority: PRIORITY.CRITICAL,
            });
            
            get().queueAction(playerId, vehicleId, {
              type: 'repair',
              priority: PRIORITY.CRITICAL,
            });
            
            get().changeState(playerId, vehicleId, BOT_STATES.IDLE);
          }
        }
        break;
      }
      
      case BOT_STATES.REFUELING: {
        // Head to base for refueling
        if (vehicle.startCoord) {
          const baseTile = gameStore.tiles[vehicle.startCoord];
          if (baseTile) {
            get().queueAction(playerId, vehicleId, {
              type: 'move',
              targetTile: {
                position: baseTile.position,
                coord: vehicle.startCoord,
              },
              priority: PRIORITY.HIGH,
            });
            
            get().queueAction(playerId, vehicleId, {
              type: 'refuel',
              priority: PRIORITY.HIGH,
            });
            
            get().changeState(playerId, vehicleId, BOT_STATES.IDLE);
          }
        }
        break;
      }
      
      default:
        // If in an unknown state, revert to idle
        get().changeState(playerId, vehicleId, BOT_STATES.IDLE);
    }
  },

  // Process bot turn
  processBotTurn: () => {
    const playerId = 'player2';
    const botVehicles = ['ship', 'drone3', 'drone4'];
    
    botVehicles.forEach(vehicleId => {
      // Make a decision if the action queue is empty
      const bot = get().bots[playerId][vehicleId];
      if (!bot || bot.actionQueue.length === 0) {
        get().makeDecision(playerId, vehicleId);
      }
      
      // Execute the next action
      get().executeNextAction(playerId, vehicleId);
    });
  },
}));

export default useBotStore;

