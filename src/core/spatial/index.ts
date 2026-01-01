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
    calculateDistance, calculateDistance2D, getDirectionVector, hasReachedTarget
} from './distance.ts';

// ============================================================================
// COORDINATE UTILITIES
// ============================================================================

export {
    createGridCoord, encodeHexCoord,
    gridToWorld, isValidGridCoord,
    isValidWorldPosition, parseGridCoord, worldToGrid
} from './coordinates.ts';

// ============================================================================
// COLROW COORDINATE SYSTEM (Human-Readable Format: A1, B2, ...)
// ============================================================================

export {
    colRowListToGrid,
    colRowToGrid,
    getColRowLabel,
    gridListToColRow,
    gridToColRow,
    parseColRow
} from './colRowCoordinate.ts';

// ============================================================================
// HEX GRID GENERATION
// ============================================================================

export {
    assignStartingTilesToBots,
    calculateHexNeighbors,
    calculateHexPosition, generateRandomColor, generateTileResources, getStationCount, initializeGameGrid, placeDangerTiles, placeGameStations, placeStartingTiles
} from './hexGrid.ts';

// ============================================================================
// PATHFINDING ALGORITHMS
// ============================================================================

export {
    calculateDroneDistance, calculatePathDistance, findPath, findTileAtPosition,
    findTilesInRadius,
    selectRandomTile
} from './pathfinding.ts';

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

export {
    calculateDistance3D, calculateLerpFactor, calculateRelativePosition, calculateVelocity, calculateWorldPosition, interpolatePosition,
    interpolateWithSpeed, shouldSyncPosition,
    shouldSyncTime
} from './animation.ts';

export type { LerpOptions, SyncOptions, VelocityOptions } from './animation';

// ============================================================================
// TYPE RE-EXPORTS
// ============================================================================

export type {
    CoordinateConversionConfig, CoordinateValidationResult, DistanceOptions, DistanceResult, HexCoordEncodeOptions, HexGridConfig, ReachedTargetOptions, StationPlacementConfig
} from '../../types/spatial';

