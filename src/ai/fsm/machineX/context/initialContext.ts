/**
 * ============================================================================
 * CONTEXTE FSM INITIAL - Store unifié pour Bots et futur Player (TypeScript)
 * ============================================================================
 * 
 * Version TypeScript du contexte FSM avec types stricts et sécurisés.
 * Équivalent de initialContext.js avec validation de types compile-time.
 * 
 * @author Migration TypeScript Phase 1
 * @version 2.0.0
 */

import { FSM_STATES, ENTITY_TYPES, DRONE_VISUAL_STATES, EXPLORATION_CYCLE_CONFIG } from '../config/constants.js';

// ============================================================================
// TYPES ET INTERFACES STANDARDISÉES
// ============================================================================

/**
 * Format de coordonnée grid standardisé : "x,z"
 */
export type GridCoordinate = string;

/**
 * Position 3D dans l'espace Three.js
 */
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * Coordonnée objet {x, z} pour les tuiles
 */
export interface TileCoordinate {
  x: number;
  z: number;
}

/**
 * Structure de ressources
 */
export interface Resources {
  food: number;
  debris: number;
  special: number;
}

/**
 * Cible de mouvement avec coordonnées et position
 */
export interface MovementTarget {
  position: WorldPosition | null;
  coord: TileCoordinate | null;
}

/**
 * Données d'une tuile connue en mémoire
 */
export interface KnownTileData {
  coord: GridCoordinate;
  explored: boolean;
  collected: boolean;
  exploredAt: number | null;
  hasResources: boolean;
  resources: Resources;
  collectedAt: number | null;
  collectedBy: string | null;
}

/**
 * Danger connu sur la carte
 */
export interface KnownDanger {
  x: number;
  z: number;
  type: 'enemy' | 'trap' | 'hazard';
}

/**
 * Exploration récente
 */
export interface ExplorationRecord {
  coord: TileCoordinate;
  timestamp: number;
  hasResources: boolean;
}

/**
 * Collecte récente
 */
export interface CollectionRecord {
  coord: TileCoordinate;
  timestamp: number;
  shipId: string;
}

/**
 * Statistiques de l'entité
 */
export interface EntityStats {
  tilesExplored: number;
  tilesCollected: number;
  totalResourcesFound: number;
  lastExploration: ExplorationRecord | null;
  lastCollection: CollectionRecord | null;
  explorationCycles: number;
  currentCycleStartTime: number | null;
  tilesExploredInCycle: number;
  bestTileInCycle: KnownTileData | null;
}

/**
 * Transition d'état FSM
 */
export interface StateTransition {
  from: string;
  to: string;
  timestamp: number;
}

/**
 * Mémoire de l'entité
 */
export interface EntityMemory {
  knownTiles: Map<GridCoordinate, KnownTileData>;
  knownDangers: KnownDanger[];
  stats: EntityStats;
  stateHistory: string[];
  transitionHistory: StateTransition[];
}

/**
 * Timestamps du contexte
 */
export interface ContextTimestamps {
  stateChange: number;
  lastMovement: number | null;
  lastCollection: number | null;
}

/**
 * Cible avec type pour exploration/collecte
 */
export interface TypedTarget {
  x: number;
  z: number;
  type: 'food' | 'debris' | 'special' | 'explore';
}

/**
 * Tuile explorée dans un cycle
 */
export interface ExploredTile {
  coord: TileCoordinate;
  resources: Resources;
  value: number;
  exploredAt: number;
}

/**
 * Cycle d'exploration multi-tuiles
 */
export interface ExplorationCycle {
  isActive: boolean;
  targetTilesCount: number;
  exploredTiles: ExploredTile[];
  bestTileFound: ExploredTile | null;
  startTime: number | null;
  phase: 'idle' | 'exploring' | 'evaluating' | 'collecting';
}

/**
 * Tuile sélectionnée pour collecte
 */
export interface SelectedTile {
  coord: TileCoordinate;
  resources: Resources;
  value: number;
}

/**
 * Configuration FSM
 */
export interface FSMConfig {
  exploringRadius: number;
  fuelThreshold: number;
  capacityThreshold: number;
  movementSpeed: number;
  explorationInterval: number;
  enableLogging: boolean;
  logLevel: 'info' | 'debug' | 'warn' | 'error';
}

/**
 * État d'un drone individuel
 */
export interface DroneState {
  id: string;
  type: 'explorer' | 'combat' | 'special';
  state: string; // DRONE_VISUAL_STATES
  position: WorldPosition;
  targetPosition: WorldPosition;
  missionTarget: TypedTarget;
  isActive: boolean;
  lastUpdate: number;
}

/**
 * Offsets de formation des drones
 */
export interface FormationOffsets {
  explorer: WorldPosition;
  combat: WorldPosition;
  special: WorldPosition;
}

/**
 * Mission active pour les drones
 */
export interface DroneMission {
  type: 'explore' | 'collect' | 'defend' | 'special';
  target: TileCoordinate;
  drones: ('explorer' | 'combat' | 'special')[];
}

/**
 * Flotte de drones
 */
export interface DroneFleet {
  drones: {
    explorer: DroneState;
    combat: DroneState;
    special: DroneState;
  };
  formationOffsets: FormationOffsets;
  currentMission: DroneMission | null;
  missionStartTime: number | null;
}

/**
 * État du véhicule principal
 */
export interface VehicleState {
  id: string;
  type: 'main_ship';
  position: WorldPosition;
  basePosition: WorldPosition;
  coord: TileCoordinate;
  isMoving: boolean;
  progress: number;
  resources: Resources;
  targetTile: MovementTarget;
  fuel: number;
  damage: number;
  totalDistance: number;
  path: TileCoordinate[];
  startCoord: TileCoordinate | null;
  isAtCapacity: boolean;
  maxSpeed: number;
  currentSpeed: number;
  maxCapacity: Resources;
}

/**
 * Score de l'entité
 */
export interface EntityScore {
  resources: Resources;
}

/**
 * Contexte FSM complet
 */
export interface FSMContext {
  // Identité
  entityId: string;
  entityType: string; // ENTITY_TYPES
  autonomousMode: boolean;
  
  // Véhicule principal
  vehicle: VehicleState;
  
  // État FSM
  currentState: string; // FSM_STATES
  currentTarget: TypedTarget | null;
  explorationQueue: TileCoordinate[];
  lastAction: string | null;
  error: string | null;
  timestamps: ContextTimestamps;
  
  // Score et ressources
  score: EntityScore;
  
  // Mémoire
  memory: EntityMemory;
  
  // Cycle d'exploration
  explorationCycle: ExplorationCycle;
  selectedTileForCollection: SelectedTile | null;
  
  // Configuration
  config: FSMConfig;
  
  // Système de drones
  droneFleet: DroneFleet;
}

// ============================================================================
// FONCTION DE CRÉATION DU CONTEXTE TYPÉE
// ============================================================================

/**
 * Crée le contexte FSM initial pour une entité avec types stricts
 * ✅ UTILISE TOUS LES TYPES DÉFINIS
 */
export const createMachineContext = (
  entityId: string, 
  entityType: string = ENTITY_TYPES.auto
): FSMContext => {
  const mainVehicleId = `${entityId}-ship`;
  
  // 🎯 Positions par défaut typées strictement
  const defaultWorldPosition: WorldPosition = { x: 0, y: 0.5, z: 0 };
  const defaultTileCoordinate: TileCoordinate = { x: 0, z: 0 };
  const defaultResources: Resources = { food: 0, debris: 0, special: 0 };
  const maxCapacityResources: Resources = { food: 200, debris: 1800, special: 3 };
  
  // 🎯 Cibles par défaut typées
  const defaultMovementTarget: MovementTarget = {
    position: null,
    coord: null
  };
  
  const defaultTypedTarget: TypedTarget = { 
    x: 0, 
    z: 0, 
    type: 'explore' 
  };
  
  // 🎯 Timestamps par défaut typés
  const currentTimestamp = Date.now();
  const defaultTimestamps: ContextTimestamps = {
    stateChange: currentTimestamp,
    lastMovement: null,
    lastCollection: null
  };
  
  // 🎯 Stats par défaut typées
  const defaultEntityStats: EntityStats = {
    tilesExplored: 0,
    tilesCollected: 0,
    totalResourcesFound: 0,
    lastExploration: null,
    lastCollection: null,
    explorationCycles: 0,
    currentCycleStartTime: null,
    tilesExploredInCycle: 0,
    bestTileInCycle: null
  };
  
  // 🎯 Mémoire par défaut typée
  const defaultEntityMemory: EntityMemory = {
    knownTiles: new Map<GridCoordinate, KnownTileData>(),
    knownDangers: [] as KnownDanger[],
    stats: defaultEntityStats,
    stateHistory: [FSM_STATES.EVALUATING],
    transitionHistory: [] as StateTransition[]
  };
  
  // 🎯 Cycle d'exploration par défaut typé
  const defaultExplorationCycle: ExplorationCycle = {
    isActive: false,
    targetTilesCount: EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION,
    exploredTiles: [] as ExploredTile[],
    bestTileFound: null,
    startTime: null,
    phase: 'idle'
  };
  
  // 🎯 Configuration par défaut typée
  const defaultFSMConfig: FSMConfig = {
    exploringRadius: 3,
    fuelThreshold: 20,
    capacityThreshold: 80,
    movementSpeed: entityType === ENTITY_TYPES.auto ? 8 : 4,
    explorationInterval: 1000,
    enableLogging: true,
    logLevel: 'info'
  };
  
  // 🎯 Offsets de formation typés
  const defaultFormationOffsets: FormationOffsets = {
    explorer: { x: 0.5, z: 0.5, y: 0.3 },
    combat: { x: -0.5, z: 0.5, y: 0.3 },
    special: { x: 0, z: -0.7, y: 0.3 }
  };
  
  // 🎯 États de drones par défaut typés
  const defaultExplorerDrone: DroneState = {
    id: `${entityId}-drone-explorer`,
    type: 'explorer',
    state: DRONE_VISUAL_STATES.docked,
    position: { ...defaultWorldPosition },
    targetPosition: { ...defaultWorldPosition },
    missionTarget: { ...defaultTypedTarget },
    isActive: false,
    lastUpdate: currentTimestamp
  };
  
  const defaultCombatDrone: DroneState = {
    id: `${entityId}-drone-combat`,
    type: 'combat',
    state: DRONE_VISUAL_STATES.docked,
    position: { ...defaultWorldPosition },
    targetPosition: { ...defaultWorldPosition },
    missionTarget: { ...defaultTypedTarget },
    isActive: false,
    lastUpdate: currentTimestamp
  };
  
  const defaultSpecialDrone: DroneState = {
    id: `${entityId}-drone-special`,
    type: 'special',
    state: DRONE_VISUAL_STATES.docked,
    position: { ...defaultWorldPosition },
    targetPosition: { ...defaultWorldPosition },
    missionTarget: { ...defaultTypedTarget },
    isActive: false,
    lastUpdate: currentTimestamp
  };
  
  // 🎯 Flotte de drones par défaut typée
  const defaultDroneFleet: DroneFleet = {
    drones: {
      explorer: defaultExplorerDrone,
      combat: defaultCombatDrone,
      special: defaultSpecialDrone
    },
    formationOffsets: defaultFormationOffsets,
    currentMission: null,
    missionStartTime: null
  };
  
  // 🎯 État du véhicule par défaut typé
  const defaultVehicleState: VehicleState = {
    id: mainVehicleId,
    type: 'main_ship',
    position: { ...defaultWorldPosition },
    basePosition: { ...defaultWorldPosition },
    coord: { ...defaultTileCoordinate },
    isMoving: false,
    progress: 0,
    resources: { ...defaultResources },
    targetTile: defaultMovementTarget,
    fuel: 100,
    damage: 0,
    totalDistance: 0,
    path: [] as TileCoordinate[],
    startCoord: null,
    isAtCapacity: false,
    maxSpeed: 1,
    currentSpeed: 0,
    maxCapacity: { ...maxCapacityResources }
  };
  
  // 🎯 Score par défaut typé
  const defaultEntityScore: EntityScore = {
    resources: { ...defaultResources }
  };
  
  // 🎯 RETOUR DU CONTEXTE COMPLET AVEC TOUS LES TYPES UTILISÉS
  return {
    // Identité et type d'entité
    entityId,
    entityType,
    autonomousMode: true,
    
    // Véhicule principal (utilise VehicleState)
    vehicle: defaultVehicleState,
    
    // Propriétés FSM spécifiques
    currentState: FSM_STATES.EVALUATING,
    currentTarget: null,
    explorationQueue: [] as TileCoordinate[],
    lastAction: null,
    error: null,
    timestamps: defaultTimestamps,
    
    // Score et ressources (utilise EntityScore)
    score: defaultEntityScore,
    
    // Mémoire de l'entité (utilise EntityMemory)
    memory: defaultEntityMemory,
    
    // Cycle d'exploration multi-tuiles (utilise ExplorationCycle)
    explorationCycle: defaultExplorationCycle,
    
    // Tuile sélectionnée pour collecte (utilise SelectedTile)
    selectedTileForCollection: null,
    
    // Configuration FSM (utilise FSMConfig)
    config: defaultFSMConfig,
    
    // Système de drones intégré (utilise DroneFleet)
    droneFleet: defaultDroneFleet
  };
};

// ============================================================================
// HELPER UTILITAIRE TYPÉ
// ============================================================================

/**
 * Met à jour l'historique des états avec types stricts
 */
export const updateStateHistory = (context: FSMContext, newState: string): FSMContext => {
  const maxHistoryLength = 10;
  
  return {
    ...context,
    currentState: newState,
    timestamps: {
      ...context.timestamps,
      stateChange: Date.now()
    },
    memory: {
      ...context.memory,
      stateHistory: [
        newState,
        ...context.memory.stateHistory.slice(0, maxHistoryLength - 1)
      ],
      transitionHistory: [
        {
          from: context.currentState,
          to: newState,
          timestamp: Date.now()
        },
        ...context.memory.transitionHistory.slice(0, maxHistoryLength - 1)
      ]
    }
  };
};

// ============================================================================
// FONCTIONS UTILITAIRES POUR LA VALIDATION DES TYPES
// ============================================================================

/**
 * Valide qu'un objet respecte l'interface WorldPosition
 */
export const isValidWorldPosition = (position: any): position is WorldPosition => {
  return (
    position &&
    typeof position === 'object' &&
    typeof position.x === 'number' &&
    typeof position.y === 'number' &&
    typeof position.z === 'number' &&
    !isNaN(position.x) &&
    !isNaN(position.y) &&
    !isNaN(position.z)
  );
};

/**
 * Valide qu'un objet respecte l'interface TileCoordinate
 */
export const isValidTileCoordinate = (coord: any): coord is TileCoordinate => {
  return (
    coord &&
    typeof coord === 'object' &&
    typeof coord.x === 'number' &&
    typeof coord.z === 'number' &&
    !isNaN(coord.x) &&
    !isNaN(coord.z)
  );
};

/**
 * Valide qu'un objet respecte l'interface Resources
 */
export const isValidResources = (resources: any): resources is Resources => {
  return (
    resources &&
    typeof resources === 'object' &&
    typeof resources.food === 'number' &&
    typeof resources.debris === 'number' &&
    typeof resources.special === 'number' &&
    !isNaN(resources.food) &&
    !isNaN(resources.debris) &&
    !isNaN(resources.special)
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  createMachineContext,
  updateStateHistory,
  isValidWorldPosition,
  isValidTileCoordinate,
  isValidResources
};

// Les types sont déjà exportés individuellement avec 'export interface' et 'export type'
