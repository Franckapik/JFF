import type { Path } from './coordinates';
import type { ResourceStats } from './resources';
import type { ShipType } from './tracker';

export type VehicleId = string;

// ============================================================================
// TYPES VISUELS VÉHICULE
// ============================================================================

/** États visuels du véhicule principal pour R3F et animations */
export type VehicleVisualState = 
  | 'uninitialized'
  | 'moving_to_tile'
  | 'collecting' 
  | 'returning'
  | 'docked' 
  | 'damaged' 
  | 'maintenance';

// ============================================================================
// INTERFACES VÉHICULE
// ============================================================================

/** État du véhicule principal */
export interface VehicleState {
  id: string;
  type: ShipType;
  coord: import('./coordinates').GridCoordinate;          // Position en coordonnée de grille
  baseCoord: import('./coordinates').GridCoordinate;      // Position de base en coordonnée de grille
  isMoving: boolean;
  progress: number;
  resources: ResourceStats;
  targetVehicleTile: import('./tile').Tile | null;
  fuel: number;
  damage: number;
  totalDistance: number;
  path: Path;
  isAtCapacity: boolean;
  maxSpeed: number;
  currentSpeed: number;
  maxCapacity: ResourceStats;
  visualState: VehicleVisualState;
  
  // ========================================================================
  // PATHFINDING - Ship moves through intermediate tiles
  // ========================================================================
  /** Current path from ship coord to target tile (BFS result) */
  currentPath: import('./coordinates').GridCoordinate[];
  /** Current index in the path (0 = start, path.length-1 = target) */
  pathIndex: number;
  
  // ========================================================================
  // STATION SUPPORT - Ship can navigate to maintenance stations
  // ========================================================================
  /** Flag indicating if ship is moving to a maintenance station */
  isMovingToStation?: boolean;
  /** Type of station being targeted ('fuel' or 'repair') */
  stationType?: 'fuel' | 'repair';
}

