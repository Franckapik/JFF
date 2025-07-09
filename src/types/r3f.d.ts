import type { TileCoordinate } from "./coordinates.d";
import type { FSMContext } from "./fsm.d.ts";
import type { DroneState } from './vehicle.d';

import type { VehicleId, WorldPosition } from "./index";

/**
 * Props interface for Tile component (déplacé depuis tile.ts)
 */
export interface TileProps {
  /** Position [x, y, z] de la tuile dans l'espace 3D */
  position: [number, number, number];
  /** Rayon de la tuile hexagonale */
  radius: number;
  /** Couleur de la tuile */
  color: string;
  /** Coordonnées de la tuile au format "x,z" */
  coord: import("./coordinates").GridCoordinate;
  /** Indique si la tuile est surélevée */
  isHighTile?: boolean;
  /** Gestionnaire d'événement au clic */
  onClick?: () => void;
}

/**
 * Props interface for Fleet component (déplacé depuis Fleet.tsx)
 */
export interface FleetProps {
  /** ID du bot FSM (ex: 'bot-0') */
  botId: VehicleId;
  /** Position mondiale du vaisseau {x,y,z} */
  shipPosition: WorldPosition;
  /** Position mondiale du drone {x,y,z} */
  dronePosition: WorldPosition;
  /** Couleur des véhicules */
  color: string;
  /** Coordonnée de la tuile de départ */
  tileCoord: TileCoordinate;
}

/**
 * Props interface for DroneMesh component
 */
export interface DroneMeshProps {
  /** Couleur du drone */
  color: string;
  /** ID du bot */
  botId?: string;
  /** Contexte FSM pour l'état du drone */
  context?: FSMContext;
  /** État du drone */
  droneState: DroneState;
  /** Type du drone */
  droneType?: string;
}

/**
 * Props interface for ShipMesh component
 */
export interface ShipMeshProps {
  /** Couleur du vaisseau */
  color: string;
  /** ID du bot */
  botId?: string;
  /** Contexte FSM pour l'état du vaisseau */
  context?: FSMContext;
  /** Action actuelle du vaisseau */
  currentAction?: string;
  /** Indique si le vaisseau est en mouvement */
  isMoving?: boolean;
}

/**
 * Type pour les actions du vaisseau
 */
export type ShipAction = 
  | 'moving_to_target'
  | 'collecting'
  | 'resource_collection'
  | 'returning_to_base'
  | 'refueling'
  | 'fuel_maintenance'
  | 'idling';

/**
 * Props interface for TileHelpers component
 */
export interface TileHelpersProps {
  position: [number, number, number];
  tileType: string | null;
  isAssignedDepartTile: boolean;
  baseColor?: string;
  backgroundColor?: string;
  labelText?: string;
  shouldShowPercentage: boolean;
  isCompletelyCollected: boolean;
  resourcePercentage: number;
  isRecentlyCollected: boolean;
  isExplored: boolean;
}

/**
 * Type pour les tuiles utilisées dans Scene.tsx
 */
export interface SceneTileType {
  coord: import("./coordinates").GridCoordinate;
  position: { x: number; z: number };
  radius?: number;
  color?: string;
  type?: string;
  assignedToBot?: string;
}
