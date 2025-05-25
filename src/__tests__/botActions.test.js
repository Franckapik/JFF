
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exploreWithDroneAction } from '../ai/fsm/actions/individual/exploreWithDroneAction';
import { moveToResourceAction } from '../ai/fsm/actions/individual/moveToResourceAction';
import { collectResourceAction } from '../ai/fsm/actions/individual/collectResourceAction';
import { returnToBaseAction } from '../ai/fsm/actions/individual/returnToBaseAction';
import { refuelAtBaseAction } from '../ai/fsm/actions/individual/refuelAtBaseAction';
import { BOT_STATES, PRIORITY } from '../ai/constants/botConstants';
import { VEHICLE_TYPES } from '../ai/constants/playerConstants';

// Mock external dependencies
vi.mock('../utils/fsmLogger', () => ({
  default: {
    info: vi.fn(),
    state: vi.fn(),
    action: vi.fn(),
    condition: vi.fn(),
    mouvement: vi.fn(),
    error: vi.fn(),
    stateTransition: vi.fn()
  }
}));

vi.mock('../utils/utils', () => ({
  findPath: vi.fn(() => ['A0', 'B0', 'C0']),
  calculatePathDistance: vi.fn(() => 2)
}));

// Mock useDroneState store
const mockDroneStore = {
  getDroneState: vi.fn(() => ({ currentState: 'DOCKED_WITH_SHIP' })),
  initializeDrone: vi.fn(),
  transitionDroneState: vi.fn(),
  isDroneInState: vi.fn(),
  isDroneDocked: vi.fn().mockReturnValue(true)
};

// Mock the useDroneState Zustand store
vi.mock('../hooks/useDroneState', () => ({
  __esModule: true, 
  default: {
    getState: vi.fn(() => mockDroneStore)
  },
  DRONE_STATES: {
    DOCKED_WITH_SHIP: 'DOCKED_WITH_SHIP',
    MOVING_TO_TARGET: 'MOVING_TO_TARGET',
    AT_TARGET: 'AT_TARGET',
    RETURNING_TO_SHIP: 'RETURNING_TO_SHIP'
  }
}));

vi.mock('../ai/constants/playerConstants', () => ({
  getBotPlayerId: vi.fn(() => 'player2'),
  getMainShipId: vi.fn(() => 'ship'),
  getDroneId: vi.fn(() => 'drone1'),
  VEHICLE_TYPES: {
    EXPLORER_DRONE: 'explorerDrone',
    COMBAT_DRONE: 'combatDrone',
    SPECIAL_DRONE: 'specialDrone'
  }
}));

// Import the mocked BotConditions
import { BotConditions } from '../ai/fsm/conditions/botConditions';

// Mock the BotConditions module
vi.mock('../ai/fsm/conditions/botConditions', () => ({
  BotConditions: {
    getCurrentBotId: vi.fn(() => 'player2'),
    isShipMoving: vi.fn().mockReturnValue({ result: false }),
    isAtBase: vi.fn().mockReturnValue({ result: false }),
    isFullyRefueled: vi.fn().mockReturnValue({ result: false }),
    isDroneMoving: vi.fn().mockReturnValue({ result: false }),
    isDroneAtShip: vi.fn().mockReturnValue({ result: true })
  }
}));

describe('Section 6: Bot Actions', () => {
  // Common mocks
  const addAction = vi.fn();
  const changeState = vi.fn();
  
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the drone store mock functions
    mockDroneStore.getDroneState.mockReturnValue({ currentState: 'DOCKED_WITH_SHIP' });
    mockDroneStore.initializeDrone.mockReset();
    mockDroneStore.transitionDroneState.mockReset();
    mockDroneStore.isDroneInState.mockReset();
    mockDroneStore.isDroneDocked.mockReturnValue(true);
  });

  describe('exploreWithDroneAction', () => {
    // Setup mocks for exploreWithDroneAction tests
    const mockPlayerStore = {
      players: {
        player2: {
          vehicles: {
            ship: { coord: 'A0', isMoving: false },
            drone1: { coord: 'A0', isMoving: false, isActive: true }
          },
          memory: {
            explorationCount: 0
          },
          exploringRadius: 3
        }
      },
      updatePlayerMemory: vi.fn(),
      moveToTile: vi.fn()
    };
    
    const mockTileStore = {
      tiles: {
        'A0': { coord: 'A0', position: { x: 0, y: 0, z: 0 }, walkable: true },
        'B0': { coord: 'B0', position: { x: 1, y: 0, z: 0 }, walkable: true, explored: false },
        'C0': { coord: 'C0', position: { x: 2, y: 0, z: 0 }, walkable: true, explored: false }
      },
      getWalkableTilesInRadius: vi.fn().mockReturnValue([
        { coord: 'B0', position: { x: 1, y: 0, z: 0 }, tile: { walkable: true }, distance: 1 }
      ]),
      selectRandomWalkableTile: vi.fn().mockReturnValue({ 
        coord: 'C0', position: { x: 2, y: 0, z: 0 } 
      })
    };

    it('should initialize exploration and send drone to an unexplored tile', () => {
      const result = exploreWithDroneAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBeUndefined(); // Action is in progress
      expect(mockTileStore.getWalkableTilesInRadius).toHaveBeenCalled();
      expect(mockPlayerStore.moveToTile).toHaveBeenCalledWith('player2', 'drone1', expect.objectContaining({ coord: 'B0' }));
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', expect.objectContaining({
        explorationCount: 1,
        explorationState: expect.objectContaining({ started: true })
      }));
    });

    it('should select a random tile if no unexplored tile is available', () => {
      mockTileStore.getWalkableTilesInRadius.mockReturnValueOnce([]);
      
      const result = exploreWithDroneAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBeUndefined();
      expect(mockTileStore.selectRandomWalkableTile).toHaveBeenCalled();
      expect(mockPlayerStore.moveToTile).toHaveBeenCalledWith('player2', 'drone1', expect.objectContaining({ coord: 'C0' }));
    });

    it('should return true when drone has returned to ship', () => {
      // Set up for a completed exploration (drone already at ship)
      const updatedPlayerStore = {
        ...mockPlayerStore,
        players: {
          ...mockPlayerStore.players,
          player2: {
            ...mockPlayerStore.players.player2,
            memory: {
              ...mockPlayerStore.players.player2.memory,
              explorationState: {
                started: true,
                startTime: Date.now() - 5000, // Started 5 seconds ago
                targetCoord: 'B0'
              }
            }
          }
        }
      };
      
      const result = exploreWithDroneAction(updatedPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true); // Action completed successfully
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', 
        expect.objectContaining({ explorationState: null })
      );
      expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
    });

    it('should return false if exploration times out', () => {
      // Set up for a timed-out exploration
      const updatedPlayerStore = {
        ...mockPlayerStore,
        players: {
          ...mockPlayerStore.players,
          player2: {
            ...mockPlayerStore.players.player2,
            memory: {
              ...mockPlayerStore.players.player2.memory,
              explorationState: {
                started: true,
                startTime: Date.now() - 40000, // Started 40 seconds ago (timeout is 30s)
                targetCoord: 'B0'
              }
            }
          }
        }
      };

      const result = exploreWithDroneAction(updatedPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(false); // Action failed due to timeout
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', 
        expect.objectContaining({ explorationState: null })
      );
      expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
    });
  });

  describe('moveToResourceAction', () => {
    const mockPlayerStore = {
      players: {
        player2: {
          vehicles: {
            ship: { 
              coord: 'A0', 
              isMoving: false,
              resources: { food: 10, debris: 20, special: 0 }
            }
          },
          memory: {
            knownResources: [
              { coord: 'B0', resources: { food: 50, debris: 100, special: 0 } },
              { coord: 'C0', resources: { food: 20, debris: 30, special: 1 } }
            ]
          }
        }
      },
      updatePlayerMemory: vi.fn(),
      moveToTile: vi.fn()
    };
    
    const mockTileStore = {
      tiles: {
        'A0': { coord: 'A0', position: { x: 0, y: 0, z: 0 }, walkable: true },
        'B0': { 
          coord: 'B0', 
          position: { x: 1, y: 0, z: 0 }, 
          walkable: true, 
          resources: { food: 50, debris: 100, special: 0 } 
        },
        'C0': { 
          coord: 'C0', 
          position: { x: 2, y: 0, z: 0 }, 
          walkable: true, 
          resources: { food: 20, debris: 30, special: 1 } 
        }
      }
    };

    it('should select a target resource and move to it', () => {
      const result = moveToResourceAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBeUndefined(); // Action is in progress
      expect(mockPlayerStore.moveToTile).toHaveBeenCalled();
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', expect.objectContaining({
        currentTargetResource: expect.anything(),
        movementState: expect.objectContaining({ started: true })
      }));
    });

    it('should return true if bot is already at the target resource', () => {
      // Update known resources to include current position
      const updatedPlayerStore = {
        ...mockPlayerStore,
        players: {
          ...mockPlayerStore.players,
          player2: {
            ...mockPlayerStore.players.player2,
            memory: {
              knownResources: [
                { coord: 'A0', resources: { food: 50, debris: 100, special: 0 } }
              ]
            }
          }
        }
      };
      
      const result = moveToResourceAction(updatedPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true); // Action completed immediately
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', expect.objectContaining({
        currentTargetResource: expect.anything(),
        movementState: null
      }));
    });

    it('should return true when bot reaches the target resource', () => {
      // Set up for a completed movement
      BotConditions.isShipMoving.mockReturnValueOnce({ result: false });

      const updatedPlayerStore = {
        ...mockPlayerStore,
        players: {
          ...mockPlayerStore.players,
          player2: {
            ...mockPlayerStore.players.player2,
            vehicles: {
              ship: { coord: 'B0', isMoving: false } // Bot has reached target B0
            },
            memory: {
              ...mockPlayerStore.players.player2.memory,
              movementState: {
                started: true,
                startTime: Date.now() - 5000,
                targetCoord: 'B0'
              }
            }
          }
        }
      };
      
      const result = moveToResourceAction(updatedPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true); // Action completed successfully
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', 
        expect.objectContaining({ movementState: null })
      );
    });
  });

  describe('collectResourceAction', () => {
    const mockPlayerStore = {
      players: {
        player2: {
          vehicles: {
            ship: { 
              coord: 'B0', 
              isMoving: false,
              resources: { food: 10, debris: 20, special: 0 },
              maxCapacity: { food: 100, debris: 1000, special: 2 }
            }
          },
          memory: {
            currentTargetResource: { coord: 'B0' },
            knownResources: [
              { coord: 'B0', resources: { food: 50, debris: 100, special: 0 } }
            ],
            collectedResources: []
          }
        }
      },
      updatePlayerMemory: vi.fn(),
      updateVehicle: vi.fn(),
      checkResourceCapacity: vi.fn().mockReturnValue(false)
    };
    
    const mockTileStore = {
      tiles: {
        'B0': { 
          coord: 'B0', 
          position: { x: 1, y: 0, z: 0 }, 
          walkable: true, 
          resources: { food: 50, debris: 100, special: 0 } 
        }
      },
      markTileAsCollected: vi.fn(),
      deductTileResources: vi.fn()
    };

    it('should initialize collection when bot is at resource tile', () => {
      const result = collectResourceAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBeUndefined(); // Action is in progress (collection started)
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', expect.objectContaining({
        collectionState: expect.objectContaining({ 
          started: true,
          tileCoord: 'B0',
          resources: expect.objectContaining({ food: 50, debris: 100 })
        }),
        isCollecting: true
      }));
    });

    it('should complete collection after sufficient time has passed', () => {
      // Set up for a completed collection
      const updatedPlayerStore = {
        ...mockPlayerStore,
        players: {
          ...mockPlayerStore.players,
          player2: {
            ...mockPlayerStore.players.player2,
            memory: {
              ...mockPlayerStore.players.player2.memory,
              collectionState: {
                started: true,
                startTime: Date.now() - 3000, // Started 3 seconds ago (more than collection time)
                collectionTime: 2000,
                tileCoord: 'B0',
                resources: { food: 50, debris: 100, special: 0 }
              },
              isCollecting: true,
              collectionTile: 'B0'
            }
          }
        }
      };
      
      const result = collectResourceAction(updatedPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true); // Action completed successfully
      expect(mockPlayerStore.updateVehicle).toHaveBeenCalledWith('player2', 'ship', expect.objectContaining({
        resources: expect.anything()
      }));
      expect(mockTileStore.deductTileResources).toHaveBeenCalledWith('B0', expect.anything());
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', expect.objectContaining({
        isCollecting: false,
        collectionState: null
      }));
      expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
      expect(addAction).toHaveBeenCalledWith('evaluateIdle', PRIORITY.HIGH);
    });

    it('should mark tile as collected if resources are depleted', () => {
      // Set up for a completed collection where all resources are taken
      const updatedPlayerStore = {
        ...mockPlayerStore,
        players: {
          ...mockPlayerStore.players,
          player2: {
            ...mockPlayerStore.players.player2,
            vehicles: {
              ship: { 
                coord: 'B0', 
                resources: { food: 0, debris: 0, special: 0 }, // Empty to allow collecting all
                maxCapacity: { food: 100, debris: 1000, special: 2 }
              }
            },
            memory: {
              ...mockPlayerStore.players.player2.memory,
              collectionState: {
                started: true,
                startTime: Date.now() - 3000, // Started 3 seconds ago
                collectionTime: 2000,
                tileCoord: 'B0',
                resources: { food: 5, debris: 10, special: 0 } // Small amount to be fully collected
              },
              isCollecting: true,
              collectionTile: 'B0'
            }
          }
        }
      };
      
      const result = collectResourceAction(updatedPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true);
      expect(mockTileStore.markTileAsCollected).toHaveBeenCalledWith('B0');
    });
  });

  describe('returnToBaseAction', () => {
    const mockPlayerStore = {
      players: {
        player2: {
          vehicles: {
            ship: { 
              coord: 'B0', 
              isMoving: false,
              startCoord: 'A0'
            }
          },
          memory: {
            returnState: null  // This prevents the botMemory?.returnState?.started check from failing
          }
        }
      },
      updatePlayerMemory: vi.fn(),
      moveToTile: vi.fn()
    };
    
    const mockTileStore = {
      tiles: {
        'A0': { 
          coord: 'A0', 
          position: { x: 0, y: 0, z: 0 }, 
          walkable: true,
          type: 'depart'
        },
        'B0': { 
          coord: 'B0', 
          position: { x: 1, y: 0, z: 0 }, 
          walkable: true
        }
      },
      getTile: vi.fn(coord => mockTileStore.tiles[coord])
    };

    beforeEach(() => {
      // Reset mocks for isAtBase
      BotConditions.isAtBase.mockReturnValue({ result: false });
    });

    it('should initialize movement to base', () => {
      const result = returnToBaseAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBeUndefined(); // Action is in progress
      expect(mockTileStore.getTile).toHaveBeenCalledWith('A0');
      expect(mockPlayerStore.moveToTile).toHaveBeenCalled();
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', expect.objectContaining({
        returnState: expect.objectContaining({ started: true })
      }));
    });

    it('should return true if bot is already at base', () => {
      // Mock the bot already being at base
      BotConditions.isAtBase.mockReturnValueOnce({ result: true });
      
      const result = returnToBaseAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true);
      expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
      expect(addAction).toHaveBeenCalledWith('evaluateIdle', PRIORITY.HIGH);
    });

    it('should return true when bot reaches the base', () => {
      // Setup for a completed return to base
      const updatedPlayerStore = {
        ...mockPlayerStore,
        players: {
          ...mockPlayerStore.players,
          player2: {
            ...mockPlayerStore.players.player2,
            vehicles: {
              ship: { 
                coord: 'A0',  // Bot has reached base
                isMoving: false,
                startCoord: 'A0'
              }
            },
            memory: {
              returnState: {
                started: true,
                startTime: Date.now() - 5000
              }
            }
          }
        }
      };
      
      // Now the bot is at base
      BotConditions.isAtBase.mockReturnValueOnce({ result: true });
      
      const result = returnToBaseAction(updatedPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true);
      expect(mockPlayerStore.updatePlayerMemory).toHaveBeenCalledWith('player2', { returnState: null });
      expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
      expect(addAction).toHaveBeenCalledWith('evaluateIdle', PRIORITY.HIGH);
    });
  });

  describe('refuelAtBaseAction', () => {
    const mockPlayerStore = {
      players: {
        player2: {
          vehicles: {
            ship: { 
              coord: 'A0', 
              isMoving: false,
              fuel: 50,
              resources: { food: 30, debris: 50, special: 1 }
            }
          }
        }
      },
      updateVehicle: vi.fn(),
      refuelVehicle: vi.fn().mockReturnValue(true),
      transferResourcesToScore: vi.fn()
    };
    
    const mockTileStore = {
      tiles: {
        'A0': { 
          coord: 'A0', 
          position: { x: 0, y: 0, z: 0 }, 
          walkable: true,
          type: 'depart'
        }
      }
    };

    it('should refuel the bot when at base', () => {
      // Set up for bot at base but not fully refueled
      BotConditions.isAtBase.mockReturnValueOnce({ result: true });
      BotConditions.isFullyRefueled.mockReturnValueOnce({ result: false });
      
      const result = refuelAtBaseAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true);
      expect(mockPlayerStore.refuelVehicle).toHaveBeenCalled();
      expect(mockPlayerStore.transferResourcesToScore).toHaveBeenCalled();
      expect(mockPlayerStore.updateVehicle).toHaveBeenCalledWith('player2', 'ship', { isAtCapacity: false });
    });

    it('should return true when bot is fully refueled', () => {
      // Set up for bot at base and fully refueled
      BotConditions.isAtBase.mockReturnValueOnce({ result: true });
      BotConditions.isFullyRefueled.mockReturnValueOnce({ result: true });
      
      const result = refuelAtBaseAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(true);
      expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
      expect(addAction).toHaveBeenCalledWith('evaluateIdle', PRIORITY.HIGH);
    });

    it('should return false if bot is not at base', () => {
      // Set up for bot not at base
      BotConditions.isAtBase.mockReturnValueOnce({ result: false });
      
      const result = refuelAtBaseAction(mockPlayerStore, mockTileStore, addAction, changeState);
      
      expect(result).toBe(false);
      expect(changeState).toHaveBeenCalledWith(BOT_STATES.IDLE);
      expect(addAction).toHaveBeenCalledWith('evaluateIdle', PRIORITY.HIGH);
    });
  });
});
