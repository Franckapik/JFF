/**
 * ============================================================================
 * CONTEXTE FSM INITIAL - Store unifié pour Bots et futur Player (TypeScript)
 * ============================================================================
 * 
 * Version TypeScript du contexte FSM avec types stricts et sécurisés.
 * Utilise les types partagés du dossier src/types/ pour la cohérence.
 * 
 * @author Migration TypeScript Phase 2
 * @version 3.0.0
 */


import type { DroneType, DroneVisualState } from '../../../../types/drone.d.ts';
import type { EntityType, FSMState } from '../../../../types/fsm.d.ts';

import type { FSMContext } from '@/types/fsm.ts';

import type { VehicleState } from '@/types/vehicle.js';


// ============================================================================
// FONCTION DE CRÉATION DU CONTEXTE TYPÉE
// ============================================================================

/**
 * Crée le contexte FSM initial pour une entité avec types stricts
 */
export const createMachineContext = (
  entityId: string, 
  entityType: EntityType = 'auto'
): FSMContext => {
  const currentTimestamp = Date.now();
  return {
    entityId,
    entityType,
    autonomousMode: true,
    vehicle: {
      id: `${entityId}-ship`,
      type: 'main-ship',
      position: { x: 0, y: 0.5, z: 0 },
      basePosition: { x: 0, y: 0.5, z: 0 },
  coord: '0,0',
      isMoving: false,
      progress: 0,
      resources: { food: 0, debris: 0, special: 0, total: 0 },
  targetTile: '0,0',
      fuel: 100,
      damage: 0,
      totalDistance: 0,
      path: [],
      startCoord: null,
      isAtCapacity: false,
      maxSpeed: 1,
      currentSpeed: 0,
      maxCapacity: { food: 200, debris: 1800, special: 3, total: 2003 }
    },
    currentState: 'evaluating' as FSMState,
    currentTarget: null,
    explorationQueue: [],
    lastAction: null,
    error: null,
    timestamps: {
      stateChange: currentTimestamp,
      lastMovement: null,
      lastCollection: null
    },
    score: { resources: { food: 0, debris: 0, special: 0, total: 0 } },
    memory: {
      knownTiles: new Map(),
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
        bestTileInCycle: null
      },
      stateHistory: ['evaluating' as FSMState],
      transitionHistory: []
    },
    explorationCycle: {
      isActive: false,
      targetTilesCount: 15,
      exploredTiles: [],
      bestTileFound: null,
      startTime: null,
      phase: 'idle'
    },
  // selectedTileForCollection supprimé
    config: {
      exploringRadius: 2,
      fuelThreshold: 20,
      capacityThreshold: 80,
      movementSpeed: entityType === 'auto' ? 8 : 4,
      explorationInterval: 1000,
      enableLogging: true,
      logLevel: 'info'
    },
    droneFleet: {
      drones: {
        explorer: {
          id: `${entityId}-drone-explorer`,
          type: 'explorer' as DroneType,
          state: 'uninitialized' as DroneVisualState,
          position: { x: 0, y: 0.5, z: 0 },
          targetPosition: { x: 0, y: 0.5, z: 0 },
          isMoving: false,
          isActive: false,
          lastUpdate: currentTimestamp
        },
        combat: {
          id: `${entityId}-drone-combat`,
          type: 'combat' as DroneType,
          state: 'uninitialized' as DroneVisualState,
          position: { x: 0, y: 0.5, z: 0 },
          targetPosition: { x: 0, y: 0.5, z: 0 },
          isMoving: false,
          isActive: false,
          lastUpdate: currentTimestamp
        },
        special: {
          id: `${entityId}-drone-special`,
          type: 'special' as DroneType,
          state: 'uninitialized' as DroneVisualState,
          position: { x: 0, y: 0.5, z: 0 },
          targetPosition: { x: 0, y: 0.5, z: 0 },
          isMoving: false,
          isActive: false,
          lastUpdate: currentTimestamp
        }
      },
      formationOffsets: {
        explorer: { x: 0.5, z: 0.5, y: 0.3 },
        combat: { x: -0.5, z: 0.5, y: 0.3 },
        special: { x: 0, z: -0.7, y: 0.3 }
      },
      currentMission: null,
      missionStartTime: null
    }
  };
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Met à jour l'historique des états avec types stricts
 */
export const updateStateHistory = (context: FSMContext, newState: string): FSMContext => {
  const now = Date.now();
  const maxHistory = 10;
  
  return {
    ...context,
    currentState: newState,
    timestamps: { ...context.timestamps, stateChange: now },
    memory: {
      ...context.memory,
      stateHistory: [newState, ...context.memory.stateHistory.slice(0, maxHistory - 1)],
      transitionHistory: [
        { from: context.currentState, to: newState, timestamp: now },
        ...context.memory.transitionHistory.slice(0, maxHistory - 1)
      ]
    }
  };
};

// ============================================================================
// FONCTIONS UTILITAIRES POUR LA COMPATIBILITÉ
// ============================================================================

/**
 * Vérifie si un véhicule peut être contrôlé manuellement
 */
export const canManualControl = (context: FSMContext): boolean => {
  return context && !context.autonomousMode;
};

/**
 * Récupère le véhicule principal d'un contexte
 */
export const getMainVehicle = (context: FSMContext): VehicleState | null => {
  return context?.vehicle || null;
};

/**
 * Vérifie si le contexte est en mode autonome
 */
export const isAutonomous = (context: FSMContext): boolean => {
  return context?.autonomousMode ?? true;
};

/**
 * Vérifie si le véhicule principal est en mouvement
 */
export const isMoving = (context: FSMContext): boolean => {
  return context?.vehicle?.isMoving ?? false;
};

// Export par défaut
export default {
  createMachineContext,
  updateStateHistory,
  canManualControl,
  getMainVehicle,
  isAutonomous,
  isMoving
};
