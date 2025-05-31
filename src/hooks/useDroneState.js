// Drone state machine hook
import { create } from 'zustand';
import fsmLogger from '../logger/fsmLogger';

// Fonction utilitaire pour extraire le playerId à partir d'un droneId
// Format attendu: bot-0-drone-explorer
const extractPlayerId = (droneId) => {
  if (!droneId) return null;
  const parts = droneId.split('-');
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : null;
};

// Drone states enum
export const DRONE_STATES = {
  IDLE: 'IDLE',
  MOVING_TO_TARGET: 'MOVING_TO_TARGET',
  AT_TARGET: 'AT_TARGET',
  RETURNING_TO_SHIP: 'RETURNING_TO_SHIP',
  DOCKED_WITH_SHIP: 'DOCKED_WITH_SHIP'
};

// Create a Zustand store for managing drone state
export const useDroneState = create((set, get) => ({
  // State
  droneStates: {}, // { droneId: { currentState, previousState } }
  
  // State management functions
  initializeDrone: (droneId) => {
    const currentStates = get().droneStates;
    if (!currentStates[droneId]) {
      set({
        droneStates: {
          ...currentStates,
          [droneId]: {
            currentState: DRONE_STATES.DOCKED_WITH_SHIP,
            previousState: null
          }
        }
      });
      fsmLogger.state(`[DroneState] Initialized drone ${droneId} in DOCKED_WITH_SHIP state`, null, extractPlayerId(droneId));
    }
  },

  // Transition function - enforces valid state transitions
  transitionDroneState: (droneId, newState) => {
    const currentStates = get().droneStates;
    const droneState = currentStates[droneId];
    
    if (!droneState) {
      fsmLogger.error(`[DroneState] Attempted to transition uninitialized drone ${droneId}`, null, extractPlayerId(droneId));
      return false;
    }

    // Define valid transitions for each state
    const validTransitions = {
      [DRONE_STATES.DOCKED_WITH_SHIP]: [DRONE_STATES.MOVING_TO_TARGET],
      [DRONE_STATES.MOVING_TO_TARGET]: [DRONE_STATES.AT_TARGET, DRONE_STATES.RETURNING_TO_SHIP],
      [DRONE_STATES.AT_TARGET]: [DRONE_STATES.RETURNING_TO_SHIP],
      [DRONE_STATES.RETURNING_TO_SHIP]: [DRONE_STATES.DOCKED_WITH_SHIP],
      [DRONE_STATES.IDLE]: [DRONE_STATES.MOVING_TO_TARGET, DRONE_STATES.RETURNING_TO_SHIP],
    };

    // Check if transition is valid
    if (!validTransitions[droneState.currentState]?.includes(newState)) {
      fsmLogger.error(`[DroneState] Invalid transition for drone ${droneId}: ${droneState.currentState} -> ${newState}`, null, extractPlayerId(droneId));
      return false;
    }

    // Update state
    set({
      droneStates: {
        ...currentStates,
        [droneId]: {
          currentState: newState,
          previousState: droneState.currentState
        }
      }
    });

    fsmLogger.state(`[DroneState] Transitioned drone ${droneId}: ${droneState.currentState} -> ${newState}`, null, extractPlayerId(droneId));
    return true;
  },

  // Check if drone is in a specific state
  isDroneInState: (droneId, state) => {
    return get().droneStates[droneId]?.currentState === state;
  },

  // Get current state for a drone
  getDroneState: (droneId) => {
    return get().droneStates[droneId] || null;
  },

  // Check if drone is docked with ship
  isDroneDocked: (droneId) => {
    return get().droneStates[droneId]?.currentState === DRONE_STATES.DOCKED_WITH_SHIP;
  }
}));

export default useDroneState;
