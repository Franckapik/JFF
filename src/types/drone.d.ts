/**
 * ============================================================================
 * TYPES DE DRONES - VERSION SIMPLIFIÉE AVEC TYPES UNION
 * ============================================================================
 * 
 * Source unique de vérité pour tous les états et types des drones.
 * Version simplifiée avec des types union pour une meilleure lisibilité.
 */

// ============================================================================
// TYPES UNION PRINCIPAUX
// ============================================================================

/** États visuels des drones pour R3F et animations */
export type DroneVisualState = 'uninitialized' | 'docked' | 'deploying' | 'scanning' | 'returning' | 'failed';

/** États FSM des drones pour la logique XState */
export type DroneFSMState = 'drone_deploying' | 'drone_scanning' | 'drone_returning';

/** Types de drones supportés par le système */
export type DroneType = 'explorer' | 'combat' | 'special';

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

/** Vérifie si un état FSM est valide */
export declare function isValidFSMState(state: string): state is DroneFSMState;

/** Vérifie si un type de drone est valide */
export declare function isValidDroneType(type: string): type is DroneType;