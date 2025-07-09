/**
 * ============================================================================
 * TYPES ET CONSTANTES UNIFIÉS POUR LES DRONES
 * ============================================================================
 * 
 * Source unique de vérité pour tous les états, types et constantes des drones.
 * Remplace les définitions éparpillées et unifie FSM/Visual states.
 * 
 * @author Migration TypeScript - Unified Model
 * @version 1.0.0
 */

// ============================================================================
// CONSTANTES D'ÉTATS UNIFIÉES
// ============================================================================

/**
 * États unifiés des drones - Source unique de vérité
 * ✅ Remplace DRONE_VISUAL_STATES du constants.js
 * ✅ Centralise les états FSM et visuels
 */
export const DRONE_STATES = {
  /** États visuels pour React Three Fiber et animations */
  VISUAL: {
    DOCKED: 'docked',
    DEPLOYING: 'deploying', 
    EXPLORING: 'exploring',
    RETURNING: 'returning',
    FAILED: 'failed'
  },
  /** États FSM pour la logique XState et trackers */
  FSM: {
    DEPLOYING: 'drone_deploying',
    SCANNING: 'drone_scanning',
    RETURNING: 'drone_returning'
  }
} as const;

/**
 * Types de drones supportés
 * ✅ Remplace DRONE_TYPES du constants.js
 */
export const DRONE_TYPES = {
  EXPLORER: 'explorer',
  COMBAT: 'combat',
  SPECIAL: 'special'
} as const;

// ============================================================================
// TYPES TYPESCRIPT DÉRIVÉS
// ============================================================================

/** États visuels des drones pour R3F et animations */
export type DroneVisualState = typeof DRONE_STATES.VISUAL[keyof typeof DRONE_STATES.VISUAL];

/** États FSM des drones pour la logique XState */
export type DroneFSMState = typeof DRONE_STATES.FSM[keyof typeof DRONE_STATES.FSM];

/** Types de drones supportés par le système */
export type DroneType = typeof DRONE_TYPES[keyof typeof DRONE_TYPES];

// ============================================================================
// MAPPINGS DE CONVERSION
// ============================================================================

/**
 * Conversion des états visuels vers états FSM
 * ✅ Centralise la logique de conversion utilisée dans droneTrackerEngine
 */
export const VISUAL_TO_FSM_MAPPING: Record<Exclude<DroneVisualState, 'docked' | 'failed'>, DroneFSMState> = {
  [DRONE_STATES.VISUAL.DEPLOYING]: DRONE_STATES.FSM.DEPLOYING,
  [DRONE_STATES.VISUAL.EXPLORING]: DRONE_STATES.FSM.SCANNING,
  [DRONE_STATES.VISUAL.RETURNING]: DRONE_STATES.FSM.RETURNING
} as const;

/**
 * Conversion des états FSM vers états visuels
 * ✅ Pour la synchronisation FSM → Visual
 */
export const FSM_TO_VISUAL_MAPPING: Record<DroneFSMState, DroneVisualState> = {
  [DRONE_STATES.FSM.DEPLOYING]: DRONE_STATES.VISUAL.DEPLOYING,
  [DRONE_STATES.FSM.SCANNING]: DRONE_STATES.VISUAL.EXPLORING,
  [DRONE_STATES.FSM.RETURNING]: DRONE_STATES.VISUAL.RETURNING
} as const;

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Convertit un état visuel en état FSM
 * @param visual - État visuel du drone
 * @returns État FSM correspondant ou null si non convertible
 */
export function convertVisualToFSM(visual: DroneVisualState): DroneFSMState | null {
  if (visual === DRONE_STATES.VISUAL.DOCKED || visual === DRONE_STATES.VISUAL.FAILED) {
    return null; // Ces états n'ont pas d'équivalent FSM
  }
  return VISUAL_TO_FSM_MAPPING[visual as Exclude<DroneVisualState, 'docked' | 'failed'>];
}

/**
 * Convertit un état FSM en état visuel
 * @param fsm - État FSM du drone
 * @returns État visuel correspondant
 */
export function convertFSMToVisual(fsm: DroneFSMState): DroneVisualState {
  return FSM_TO_VISUAL_MAPPING[fsm];
}

/**
 * Vérifie si un drone est en mouvement
 * @param state - État du drone (visuel ou FSM)
 * @returns true si le drone est en mouvement
 */
export function isDroneMoving(state: DroneVisualState | DroneFSMState): boolean {
  const movingVisualStates: DroneVisualState[] = [
    DRONE_STATES.VISUAL.DEPLOYING,
    DRONE_STATES.VISUAL.EXPLORING,
    DRONE_STATES.VISUAL.RETURNING
  ];
  
  const movingFSMStates: DroneFSMState[] = [
    DRONE_STATES.FSM.DEPLOYING,
    DRONE_STATES.FSM.SCANNING,
    DRONE_STATES.FSM.RETURNING
  ];
  
  return movingVisualStates.includes(state as DroneVisualState) || 
         movingFSMStates.includes(state as DroneFSMState);
}

/**
 * Vérifie si un état visuel est valide
 * @param state - État à vérifier
 * @returns true si l'état est un DroneVisualState valide
 */
export function isValidVisualState(state: string): state is DroneVisualState {
  return Object.values(DRONE_STATES.VISUAL).includes(state as DroneVisualState);
}

/**
 * Vérifie si un état FSM est valide
 * @param state - État à vérifier
 * @returns true si l'état est un DroneFSMState valide
 */
export function isValidFSMState(state: string): state is DroneFSMState {
  return Object.values(DRONE_STATES.FSM).includes(state as DroneFSMState);
}

/**
 * Vérifie si un type de drone est valide
 * @param type - Type à vérifier
 * @returns true si le type est un DroneType valide
 */
export function isValidDroneType(type: string): type is DroneType {
  return Object.values(DRONE_TYPES).includes(type as DroneType);
}
