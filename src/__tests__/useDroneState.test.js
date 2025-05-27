import { test, expect, beforeEach, vi } from 'vitest';
import useDroneState, { DRONE_STATES } from '../hooks/useDroneState';
import { getHumanPlayerId, getDroneId } from '../ai/constants/playerConstants';

// Mocking fsmLogger
vi.mock('../utils/fsmLogger', () => ({
  default: {
    state: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}));

// Reset the store before each test
beforeEach(() => {
  // Reset the store (clear all drone states)
  useDroneState.setState({ droneStates: {} });
});

test('initializeDrone should initialize a drone with DOCKED_WITH_SHIP state', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'explorer');

  // Initialize the drone
  store.initializeDrone(droneId);

  // Check that the drone is properly initialized
  const droneState = store.getDroneState(droneId);
  expect(droneState).not.toBeNull();
  expect(droneState.currentState).toBe(DRONE_STATES.DOCKED_WITH_SHIP);
  expect(droneState.previousState).toBeNull();
});

test('initializeDrone should not re-initialize a drone if it already has a state', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'explorer');

  // Initialize the drone
  store.initializeDrone(droneId);

  // Change the state to test re-initialization
  useDroneState.setState({
    droneStates: {
      [droneId]: {
        currentState: DRONE_STATES.MOVING_TO_TARGET,
        previousState: DRONE_STATES.DOCKED_WITH_SHIP
      }
    }
  });

  // Try to initialize again
  store.initializeDrone(droneId);

  // Check that the state wasn't changed back to DOCKED_WITH_SHIP
  const droneState = store.getDroneState(droneId);
  expect(droneState.currentState).toBe(DRONE_STATES.MOVING_TO_TARGET);
});

test('transitionDroneState should transition a drone state if the transition is valid', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId('player-2', 'explorer');

  // Initialize drone
  store.initializeDrone(droneId);

  // Transition state (DOCKED_WITH_SHIP -> MOVING_TO_TARGET is valid)
  const result = store.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);

  // Check result
  expect(result).toBe(true);
  
  // Check new state
  const droneState = store.getDroneState(droneId);
  expect(droneState.currentState).toBe(DRONE_STATES.MOVING_TO_TARGET);
  expect(droneState.previousState).toBe(DRONE_STATES.DOCKED_WITH_SHIP);
});

test('transitionDroneState should not transition if the drone state is uninitialized', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId('player-3', 'explorer');

  // Try to transition state of an uninitialized drone
  const result = store.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);

  // Check result
  expect(result).toBe(false);
  
  // Check that the drone state is still null
  const droneState = store.getDroneState(droneId);
  expect(droneState).toBeNull();
});

test('transitionDroneState should not allow invalid transitions', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'combat');

  // Initialize drone
  store.initializeDrone(droneId);

  // Try an invalid transition (DOCKED_WITH_SHIP -> AT_TARGET is invalid)
  const result = store.transitionDroneState(droneId, DRONE_STATES.AT_TARGET);

  // Check result
  expect(result).toBe(false);
  
  // Check that state didn't change
  const droneState = store.getDroneState(droneId);
  expect(droneState.currentState).toBe(DRONE_STATES.DOCKED_WITH_SHIP);
  expect(droneState.previousState).toBeNull();
});

test('transitionDroneState should handle a complete valid transition sequence', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'special');

  // Initialize drone
  store.initializeDrone(droneId);

  // Transition 1: DOCKED_WITH_SHIP -> MOVING_TO_TARGET
  let result = store.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);
  expect(result).toBe(true);
  let droneState = store.getDroneState(droneId);
  expect(droneState.currentState).toBe(DRONE_STATES.MOVING_TO_TARGET);

  // Transition 2: MOVING_TO_TARGET -> AT_TARGET
  result = store.transitionDroneState(droneId, DRONE_STATES.AT_TARGET);
  expect(result).toBe(true);
  droneState = store.getDroneState(droneId);
  expect(droneState.currentState).toBe(DRONE_STATES.AT_TARGET);

  // Transition 3: AT_TARGET -> RETURNING_TO_SHIP
  result = store.transitionDroneState(droneId, DRONE_STATES.RETURNING_TO_SHIP);
  expect(result).toBe(true);
  droneState = store.getDroneState(droneId);
  expect(droneState.currentState).toBe(DRONE_STATES.RETURNING_TO_SHIP);

  // Transition 4: RETURNING_TO_SHIP -> DOCKED_WITH_SHIP
  result = store.transitionDroneState(droneId, DRONE_STATES.DOCKED_WITH_SHIP);
  expect(result).toBe(true);
  droneState = store.getDroneState(droneId);
  expect(droneState.currentState).toBe(DRONE_STATES.DOCKED_WITH_SHIP);
});

test('isDroneInState should correctly check if a drone is in a specific state', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'explorer');

  // Initialize drone
  store.initializeDrone(droneId);

  // Check initial state
  expect(store.isDroneInState(droneId, DRONE_STATES.DOCKED_WITH_SHIP)).toBe(true);
  expect(store.isDroneInState(droneId, DRONE_STATES.MOVING_TO_TARGET)).toBe(false);

  // Change state
  store.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);

  // Check new state
  expect(store.isDroneInState(droneId, DRONE_STATES.DOCKED_WITH_SHIP)).toBe(false);
  expect(store.isDroneInState(droneId, DRONE_STATES.MOVING_TO_TARGET)).toBe(true);
});

test('isDroneInState should return false for uninitialized drones', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId('player-3', 'combat');

  // Check state of uninitialized drone
  expect(store.isDroneInState(droneId, DRONE_STATES.DOCKED_WITH_SHIP)).toBe(false);
});

test('getDroneState should return the current state for an initialized drone', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'explorer');

  // Initialize drone
  store.initializeDrone(droneId);

  // Get state
  const state = store.getDroneState(droneId);
  expect(state).toEqual({
    currentState: DRONE_STATES.DOCKED_WITH_SHIP,
    previousState: null
  });
});

test('getDroneState should return null for an uninitialized drone', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId('player-3', 'special');

  // Get state of uninitialized drone
  const state = store.getDroneState(droneId);
  expect(state).toBeNull();
});

test('isDroneDocked should return true when a drone is in DOCKED_WITH_SHIP state', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'explorer');

  // Initialize drone
  store.initializeDrone(droneId);

  // Check if docked
  expect(store.isDroneDocked(droneId)).toBe(true);
});

test('isDroneDocked should return false when a drone is not in DOCKED_WITH_SHIP state', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = getDroneId(getHumanPlayerId(1), 'explorer');

  // Initialize drone
  store.initializeDrone(droneId);

  // Transition to another state
  store.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);

  // Check if docked
  expect(store.isDroneDocked(droneId)).toBe(false);
});

test('isDroneDocked should return false for an uninitialized drone', () => {
  // Get the store
  const store = useDroneState.getState();
  const droneId = 'nonexistent_drone';

  // Check if docked for an uninitialized drone
  expect(store.isDroneDocked(droneId)).toBe(false);
});
