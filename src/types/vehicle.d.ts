import type { TileCoordinate, WorldPosition } from './coordinates';
import type { DroneType, DroneVisualState } from './drone';
import type { ResourceStats } from './resources';
import type { ShipType } from './tracker';

export type VehicleId = string;

/** État du véhicule principal (extrait de initialContext.ts) */
export interface VehicleState {
  id: string;
  type: ShipType;
  position: WorldPosition;
  basePosition: WorldPosition;
  coord: TileCoordinate;
  isMoving: boolean;
  progress: number;
  resources: ResourceStats;
  targetTile: TileCoordinate;
  fuel: number;
  damage: number;
  totalDistance: number;
  path: TileCoordinate[];
  startCoord: TileCoordinate | null;
  isAtCapacity: boolean;
  maxSpeed: number;
  currentSpeed: number;
  maxCapacity: ResourceStats;
}

/** État d'un drone individuel (extrait de initialContext.ts) */
export interface DroneState {
  id: string;
  type: DroneType;
  state: DroneVisualState;
  position: WorldPosition;
  targetPosition: WorldPosition;
  missionTarget: TileCoordinate;
  isActive: boolean;
  lastUpdate: number;
}

/** Offsets de formation des drones (extrait de initialContext.ts) */
export interface FormationOffsets {
  explorer: WorldPosition;
  combat: WorldPosition;
  special: WorldPosition;
}

/** Mission active pour les drones (extrait de initialContext.ts) */
export interface DroneMission {
  type: 'explore' | 'collect' | 'defend' | 'special';
  target: TileCoordinate;
  drones: DroneType[];
}

/** Flotte de drones (extrait de initialContext.ts) */
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

