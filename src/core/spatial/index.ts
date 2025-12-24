/**
 * ============================================================================
 * CORE SPATIAL MODULE - Public API
 * ============================================================================
 * 
 * Module central pour toutes les opérations spatiales pures du jeu.
 * Ce module ne doit avoir AUCUNE dépendance sur Zustand, R3F, ou l'environnement browser.
 * 
 * @module core/spatial
 * @pure All exported functions are pure
 * @testable Can be tested in Node.js environment
 * @author Spatial Migration Team
 * @version 1.0.0
 * 
 * @example
 * // Import des utilitaires de distance
 * import { calculateDistance, hasReachedTarget } from '@/core/spatial';
 * 
 * // Import des utilitaires de coordonnées
 * import { gridToWorld, worldToGrid, isValidGridCoord } from '@/core/spatial';
 */

// ============================================================================
// DISTANCE UTILITIES
// ============================================================================

export {
  calculateDistance,
  hasReachedTarget,
  getDirectionVector,
  calculateDistance2D,
} from './distance';

// ============================================================================
// COORDINATE UTILITIES
// ============================================================================

export {
  isValidGridCoord,
  isValidWorldPosition,
  encodeHexCoord,
  gridToWorld,
  worldToGrid,
  parseGridCoord,
  createGridCoord,
} from './coordinates';

// ============================================================================
// HEX GRID GENERATION
// ============================================================================

export {
  initializeGameGrid,
  placeGameStations,
  placeDangerTiles,
  placeStartingTiles,
  assignStartingTilesToBots,
  calculateHexNeighbors,
  calculateHexPosition,
  generateTileResources,
  generateRandomColor,
  getStationCount,
} from './hexGrid';

// ============================================================================
// PATHFINDING ALGORITHMS
// ============================================================================

export {
  findPath,
  calculatePathDistance,
  findTileAtPosition,
  findTilesInRadius,
  selectRandomTile,
  calculateDroneDistance,
} from './pathfinding';

// ============================================================================
// TYPE RE-EXPORTS
// ============================================================================

export type {
  DistanceOptions,
  ReachedTargetOptions,
  DistanceResult,
  CoordinateConversionConfig,
  HexCoordEncodeOptions,
  CoordinateValidationResult,
  HexGridConfig,
  StationPlacementConfig,
} from '../../types/spatial';
