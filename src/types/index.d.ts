/**
 * INDEX DES TYPES PARTAGÉS (d.ts)
 * Point d'entrée unique pour tous les types TypeScript du projet (déclarations uniquement).
 */

// ============================================================================
// TYPES DE COORDONNÉES ET POSITIONS
// ============================================================================
export type { GridCoordinate, WorldPosition } from './coordinates.d';

// ============================================================================
// TYPES DE RESSOURCES
// ============================================================================
export type { ResourceStats, ResourceType } from './resources.d';

// ============================================================================
// TYPES DE VÉHICULES
// ============================================================================
export type {
    DroneFleet, DroneMission, DroneState,
    FormationOffsets, VehicleId, VehicleState
} from './vehicle.d';

// ============================================================================
// TYPES DE DRONES (SIMPLIFIÉS AVEC TYPES UNION)
// ============================================================================
export type {
    DroneFSMState,
    DroneType,
    DroneVisualState, NonTrackableDroneVisualState, TrackableDroneVisualState
} from './drone.d';

export {
    isDroneMoving, isTrackableDroneState, isValidDroneType, isValidFSMState, isValidVisualState
} from './drone.d';

// ============================================================================
// TYPES FSM ET MACHINE À ÉTATS
// ============================================================================
export type {
    BotId, BotSnapshot, BotStatesMap, CollectionRecord, ContextTimestamps, EmptyBotState, EntityMemory, EntityScore, EntityStats,
    ExplorationCycle, ExplorationRecord, ExploredTile, FSMConfig, FSMContext, FSMEvent, KnownDanger, KnownTileData, SelectedTile, StateTransition, XFSMStore, XFSMStoreActions, XFSMStoreState
} from './fsm.d';

// ============================================================================
// TYPES DES STORES ZUSTAND
// ============================================================================
export type {
    GameStoreType, Tile, TileMap, TileStoreType, XFSMStoreType
} from './stores.d';

// ============================================================================
// TYPES DE TUILES (DÉTAILLÉS)
// ============================================================================
export type { DistanceResult, HexPosition, PathNode, TileBiome, TileGenerationConfig, TileSearchOptions, TileStore, TileStoreActions, TileStoreState, TileType, TileWithDistance } from './tile.d';

// ============================================================================
// TYPES POUR REACT THREE FIBER (PROPS)
// ============================================================================
export type { DroneMeshProps, FleetProps, TileProps } from './r3f.d';

// ============================================================================
// TYPES POUR LES TRACKERS FSM
// ============================================================================
export type { BaseTrackerParams, CanSendEventFn, DroneProcessorFunction, DroneTrackerParams, GridToHexCoordFn, InitializationHandler, MarkEventSentFn, PositionHandler, ShipProcessorFunction, ShipTrackerParams, ShipType, WorldToGridFn, XStateSend } from './tracker.d';

