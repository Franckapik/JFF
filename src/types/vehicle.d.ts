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
}

