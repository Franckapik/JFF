/**
 * ============================================================================
 * TYPES DE DRONES - VERSION SIMPLIFIÉE AVEC TYPES UNION
 * ============================================================================
 * 
 * Source unique de vérité pour tous les états et types des drones.
 * Version simplifiée avec des types union pour une meilleure lisibilité.
 */

import type { GridCoordinate, WorldPosition } from './coordinates';

// ============================================================================
// TYPES UNION PRINCIPAUX
// ============================================================================

/** États visuels des drones pour R3F et animations */
export type DroneVisualState = 'uninitialized' | 'docked' | 'deploying' | 'scanning' | 'returning' | 'failed' | 'destroyed';

/** États FSM des drones pour la logique XState */
export type DroneFSMState = 'drone_deploying' | 'drone_scanning' | 'drone_returning' | 'drone_docked';

/** Types de drones supportés par le système */
export type DroneType = 'explorer' | 'combat' | 'special';

// ============================================================================
// INTERFACES DRONES
// ============================================================================

/** État d'un drone individuel */
export interface DroneState {
  id: string;
  type: DroneType;
  visualState: DroneVisualState;
  coord?: GridCoordinate;                       // Position en coordonnée de grille (optional car drones peuvent être docked)
  targetDroneTile: import('./tile').Tile | null;
  targetTileType?: import('./tile').TileType;  // Type de tuile ciblée
  isActive: boolean;
  isMoving: boolean;
  isDestroyed?: boolean;                        // Flag destruction
  health?: number;                               // Santé du drone (0-100)
  lastUpdate: number;
}

/** Offsets de formation des drones */
export interface FormationOffsets {
  explorer: WorldPosition;
  combat: WorldPosition;
  special: WorldPosition;
}

/** Mission active pour les drones */
export interface DroneMission {
  type: 'explore' | 'collect' | 'defend' | 'special';
  target: GridCoordinate;
  drones: DroneType[];
}

/** Flotte de drones */
export interface DroneFleet {
  drones: {
    explorer: DroneState;
    combat: DroneState;
    special: DroneState;
  };
  formationOffsets: FormationOffsets;
  currentMission: DroneMission | null;
  missionStartTime: number | null;
  stats: {                                      // Compteurs par type de drone
    explorerDeployed: number;
    explorerDestroyed: number;
    combatDeployed: number;
    combatDestroyed: number;
    specialDeployed: number;
    specialDestroyed: number;
  };
}

// ============================================================================
// TYPES UTILITAIRES
// ============================================================================

/** États visuels qui correspondent à des états FSM (nécessitent un tracking) */
export type TrackableDroneVisualState = 'deploying' | 'scanning' | 'returning';

/** États visuels qui ne correspondent pas à des états FSM (pas de tracking) */
export type NonTrackableDroneVisualState = 'docked' | 'failed';

// ============================================================================
// FONCTIONS DE VALIDATION
// ============================================================================

/** Vérifie si un état visuel nécessite un tracking FSM */
export declare function isTrackableDroneState(state: DroneVisualState): state is TrackableDroneVisualState;

/** Vérifie si un drone est en mouvement */
export declare function isDroneMoving(state: DroneVisualState): boolean;

/** Vérifie si un état visuel est valide */
export declare function isValidVisualState(state: string): state is DroneVisualState;

/** Vérifie si un type de drone est valide */
export declare function isValidDroneType(type: string): type is DroneType;