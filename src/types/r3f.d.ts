// Types pour le hook d'animation des drones


import type { MutableRefObject } from 'react';
import type * as THREE from 'three';

import type { DroneType, DroneVisualState } from './drone.d';

// import type { FSMContext } from './fsm.d.ts';
import type { TileCoordinate } from "./coordinates.d";

import type { FSMContext } from "./fsm.d.ts";

import type { VehicleId, WorldPosition } from './index';

export interface DroneAnimationReturn {
  droneRef: MutableRefObject<THREE.Mesh | undefined>;
  droneState: DroneVisualState;
  initialPosition: WorldPosition;
}

export interface DroneAnimationProps {
  context: FSMContext | null;
  fleetPosition: WorldPosition | null;
  updateVisualPosition: (position: WorldPosition) => void;
  droneType?: DroneType;
  isActive?: boolean;
  isMoving?: boolean;
}


/**
 * Props interface for Tile component (déplacé depuis tile.ts)
 */
export interface TileProps {
  /** Coordonnées de la tuile au format "x,z" */
  coord: import("./coordinates").GridCoordinate;
  /** Position de la tuile dans l'espace 3D */
  position: [number, number, number] | { x: number; z: number };
  /** Rayon de la tuile hexagonale */
  radius?: number;
  /** Couleur de la tuile */
  color?: string;
  /** Type de la tuile (ex: 'depart', 'normal', etc.) */
  type?: string;
  /** Bot assigné à la tuile */
  assignedToBot?: string;
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
  /** Position mondiale de la flotte (vaisseau + drone) */
  fleetPosition: WorldPosition;
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
  /** État visuel du drone (pour l'affichage/animation) */
  droneVisualState: import('./drone').DroneVisualState;
  /** Type du drone */
  droneType?: string;
  /** Référence mesh pour animation/position */
  meshRef?: import('react').Ref<import('three').Mesh>;
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
  /** Référence mesh pour animation/position */
  meshRef?: import('react').Ref<import('three').Mesh>;
  /** Valeur d'état XState du bot */
  botStateValue?: string;
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

