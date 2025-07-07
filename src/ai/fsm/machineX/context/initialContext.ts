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

import { DRONE_VISUAL_STATES, ENTITY_TYPES, EXPLORATION_CYCLE_CONFIG, FSM_STATES } from '../config/constants.js';

// Import des types partagés
import type {
  DroneState,
  FormationOffsets,
  FSMConfig,
  FSMContext,
  ResourceStats,
  TileCoordinate,
  TypedTarget,
  VehicleState,
  WorldPosition
} from '../../../../types/index.js';

// Alias pour compatibilité avec le code existant
type Resources = ResourceStats;

// ============================================================================
// FONCTION DE CRÉATION DU CONTEXTE TYPÉE
// ============================================================================

/**
 * Crée le contexte FSM initial pour une entité avec types stricts
 */
export const createMachineContext = (
  entityId: string, 
  entityType: string = ENTITY_TYPES.auto
): FSMContext => {
  const currentTimestamp = Date.now();
  
  // Valeurs par défaut
  const defaultPosition: WorldPosition = { x: 0, y: 0.5, z: 0 };
  const defaultTileCoord: TileCoordinate = { x: 0, z: 0 };
  const emptyResources: Resources = { food: 0, debris: 0, special: 0, total: 0 };
  const maxResources: Resources = { food: 200, debris: 1800, special: 3, total: 2003 };
  
  const defaultTypedTarget: TypedTarget = { x: 0, z: 0, type: 'explore' };
  
  // Configuration et offsets
  const formationOffsets: FormationOffsets = {
    explorer: { x: 0.5, z: 0.5, y: 0.3 },
    combat: { x: -0.5, z: 0.5, y: 0.3 },
    special: { x: 0, z: -0.7, y: 0.3 }
  };
  
  const fsmConfig: FSMConfig = {
    exploringRadius: 3,
    fuelThreshold: 20,
    capacityThreshold: 80,
    movementSpeed: entityType === ENTITY_TYPES.auto ? 8 : 4,
    explorationInterval: 1000,
    enableLogging: true,
    logLevel: 'info'
  };
  
  // Création des drones
  const createDrone = (type: 'explorer' | 'combat' | 'special'): DroneState => ({
    id: `${entityId}-drone-${type}`,
    type,
    state: DRONE_VISUAL_STATES.docked,
    position: { ...defaultPosition },
    targetPosition: { ...defaultPosition },
    missionTarget: { ...defaultTypedTarget },
    isActive: false,
    lastUpdate: currentTimestamp
  });

  return {
    entityId,
    entityType,
    autonomousMode: true,
    
    vehicle: {
      id: `${entityId}-ship`,
      type: 'main_ship',
      position: { ...defaultPosition },
      basePosition: { ...defaultPosition },
      coord: { ...defaultTileCoord },
      isMoving: false,
      progress: 0,
      resources: { ...emptyResources },
      targetTile: { position: null, coord: null },
      fuel: 100,
      damage: 0,
      totalDistance: 0,
      path: [],
      startCoord: null,
      isAtCapacity: false,
      maxSpeed: 1,
      currentSpeed: 0,
      maxCapacity: { ...maxResources }
    },
    
    currentState: FSM_STATES.EVALUATING,
    currentTarget: null,
    explorationQueue: [],
    lastAction: null,
    error: null,
    timestamps: {
      stateChange: currentTimestamp,
      lastMovement: null,
      lastCollection: null
    },
    
    score: { resources: { ...emptyResources } },
    
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
      stateHistory: [FSM_STATES.EVALUATING],
      transitionHistory: []
    },
    
    explorationCycle: {
      isActive: false,
      targetTilesCount: EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION,
      exploredTiles: [],
      bestTileFound: null,
      startTime: null,
      phase: 'idle'
    },
    
    selectedTileForCollection: null,
    config: fsmConfig,
    
    droneFleet: {
      drones: {
        explorer: createDrone('explorer'),
        combat: createDrone('combat'),
        special: createDrone('special')
      },
      formationOffsets,
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

// Import des validateurs de types partagés
import { isValidResources, isValidTileCoordinate, isValidWorldPosition } from '../../../../types/index.js';

// Re-export des constantes pour faciliter l'accès
export { ENTITY_TYPES } from '../config/constants.js';

// Export par défaut
export default {
  createMachineContext,
  updateStateHistory,
  isValidWorldPosition,
  isValidTileCoordinate,
  isValidResources,
  canManualControl,
  getMainVehicle,
  isAutonomous,
  isMoving
};
