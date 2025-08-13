import type { GridCoordinate, Path, WorldGridPosition, WorldPosition } from './coordinates';
import type { ResourceStats } from './resources';
import type { ShipType } from './tracker';

export type VehicleId = string;

// ============================================================================
// TYPES VISUELS VÉHICULE
// ============================================================================

/** États visuels du véhicule principal pour R3F et animations */
export type VehicleVisualState = 
  | 'uninitialized'
  | 'idle' 
  | 'moving' 
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
  position: WorldPosition;
  basePosition: WorldGridPosition;
  isMoving: boolean;
  progress: number;
  resources: ResourceStats;
  targetTile: GridCoordinate;
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

