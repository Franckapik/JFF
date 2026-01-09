/**
 * ==========================================================================
 * FSM WORKER CONTEXT - Contexte initial pour le SharedWorker
 * ==========================================================================
 * 
 * Version "worker-safe" du contexte FSM initial.
 * Pas de dépendance à React ou aux hooks Zustand.
 */

import type { DroneType, DroneVisualState } from '../../../../types/drone.d.ts';
import type { FSMContext, FSMState } from '../../../../types/fsm.d.ts';
import type { VehicleVisualState } from '../../../../types/vehicle.d.ts';

// Constante de rayon d'exploration initial
const INITIAL_EXPLORATION_RADIUS = 2;

/**
 * Crée le contexte FSM initial pour le SharedWorker
 * Version sans dépendance React/Zustand
 */
export function createWorkerContext(entityId: string, entityType: 'auto' | 'player' = 'auto'): FSMContext {
  const currentTimestamp = Date.now();
  
  return {
    entityId,
    entityType,
    autonomousMode: true,
    vehicle: {
      id: `${entityId}-ship`,
      type: 'main-ship',
      coord: null,
      baseCoord: null,
      isMoving: false,
      progress: 0,
      resources: { food: 0, debris: 0, special: 0, total: 0 },
      targetVehicleTile: null,
      fuel: 100,
      damage: 0,
      totalDistance: 0,
      path: [],
      isAtCapacity: false,
      maxSpeed: 1,
      currentSpeed: 0,
      maxCapacity: { food: 200, debris: 1800, special: 3, total: 2003 },
      visualState: 'uninitialized' as VehicleVisualState,
      currentPath: [],
      pathIndex: 0,
    },
    fsmState: 'evaluating' as FSMState,
    explorationQueue: [],
    lastAction: null,
    error: null,
    timestamps: {
      stateChange: currentTimestamp,
      lastMovement: null,
      lastCollection: null,
    },
    score: { resources: { food: 0, debris: 0, special: 0, total: 0 } },
    memory: {
      knownTiles: [],
      knownDangers: [],
      stats: {
        tilesExplored: 0,
        tilesCollected: 0,
        totalResourcesFound: 0,
        lastExploration: null,
        lastCollection: null,
        explorationCycles: 0,
        currentCycleStartTime: null,
        tilesExploredInCycle: 0,
        bestTileInCycle: null,
        dronesDestroyed: 0,
      },
      stateHistory: ['uninitialized' as FSMState],
      transitionHistory: [],
    },
    explorationCycle: {
      isActive: false,
      targetTilesCount: 15,
      exploredTiles: [],
      bestTileFound: null,
      startTime: null,
      phase: 'idle',
    },
    config: {
      exploringRadius: INITIAL_EXPLORATION_RADIUS,
      collectingRadius: 3,
      fuelThreshold: 20,
      capacityThreshold: 80,
      movementSpeed: entityType === 'auto' ? 8 : 4,
      explorationInterval: 1000,
      enableLogging: true,
    },
    droneFleet: {
      drones: {
        explorer: {
          id: `${entityId}-drone-explorer`,
          type: 'explorer' as DroneType,
          visualState: 'uninitialized' as DroneVisualState,
          coord: undefined,
          targetDroneTile: null,
          isMoving: false,
          isActive: false,
          lastUpdate: currentTimestamp,
        },
        combat: {
          id: `${entityId}-drone-combat`,
          type: 'combat' as DroneType,
          visualState: 'uninitialized' as DroneVisualState,
          coord: undefined,
          targetDroneTile: null,
          isMoving: false,
          isActive: false,
          lastUpdate: currentTimestamp,
        },
        special: {
          id: `${entityId}-drone-special`,
          type: 'special' as DroneType,
          visualState: 'uninitialized' as DroneVisualState,
          coord: undefined,
          targetDroneTile: null,
          isMoving: false,
          isActive: false,
          lastUpdate: currentTimestamp,
        },
      },
      formationOffsets: {
        explorer: { x: 0.5, z: 0.5, y: 0.3 },
        combat: { x: -0.5, z: 0.5, y: 0.3 },
        special: { x: 0, z: -0.7, y: 0.3 },
      },
      currentMission: null,
      missionStartTime: null,
      stats: {
        explorerDeployed: 0,
        explorerDestroyed: 0,
        combatDeployed: 0,
        combatDestroyed: 0,
        specialDeployed: 0,
        specialDestroyed: 0,
      },
    },
    // ✅ Phase 1 Migration: Game config (replaces Zustand stores)
    gameConfig: {
      isClockRunning: false,
      playerCount: 1,
      botCount: 2,
      mapSeed: null,
      botColors: ['red', 'orange', 'green', 'purple', 'teal', 'brown', 'magenta', 'cyan'],
      humanPlayerColor: 'blue',
      playersInitialized: false,
      botsInitialized: false,
      tilesInitialized: false,
      startingTilesAssigned: false,
      fleetPositionsInitialized: {},
      selectedView: 'both',
    },
  };
}
