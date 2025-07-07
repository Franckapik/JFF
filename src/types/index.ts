/**
 * ============================================================================
 * INDEX DES TYPES PARTAGÉS (simplifiés)
 * ============================================================================
 * 
 * Point d'entrée unique pour tous les types TypeScript du projet.
 * Extrait directement de initialContext.ts sans ajouts supplémentaires.
 * 
 * @author TypeScript Migration
 * @version 2.0.0 (simplifié)
 */

// ============================================================================
// COORDONNÉES ET POSITIONS
// ============================================================================
export type {
  GridCoordinate, MovementTarget, TileCoordinate, TypedTarget, WorldPosition
} from './coordinates';

export {
  gridToTile, isValidTileCoordinate, isValidWorldPosition, tileToGrid
} from './coordinates';

// ============================================================================
// RESSOURCES
// ============================================================================
export type {
  Resources, ResourceStats, ResourceType
} from './resources';

export {
  isResourceType,
  isValidResources
} from './resources';

// ============================================================================
// VÉHICULES ET DRONES
// ============================================================================
export type {
  DroneFleet, DroneMission, DroneState,
  FormationOffsets, VehicleId,
  VehicleState
} from './vehicle';

export {
  isVehicleId
} from './vehicle';

// ============================================================================
// FSM ET MACHINE À ÉTATS
// ============================================================================
export type {
  CollectionRecord, ContextTimestamps, EntityMemory, EntityScore, EntityStats, ExplorationCycle, ExplorationRecord, ExploredTile, FSMConfig, FSMContext, KnownDanger, KnownTileData, SelectedTile, StateTransition
} from './fsm';

export {
  isValidStateTransition
} from './fsm';

// ============================================================================
// TUILES ET SYSTÈME DE GRILLE
// ============================================================================
export type {
  DistanceResult, HexPosition, PathNode, Tile, TileBiome, TileGenerationConfig, TileMap, TileSearchOptions, TileStore, TileStoreActions, TileStoreState, TileType, TileWithDistance
} from './tile';

export {
  isTile, isTileBiome, isTileType
} from './tile';
