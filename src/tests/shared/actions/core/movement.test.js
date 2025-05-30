/**
 * ============================================================================
 * MOVEMENT ACTIONS CORE - Tests unitaires
 * ============================================================================
 * 
 * Tests pour valider la pureté des fonctions de mouvement, la gestion d'erreurs
 * et les transformations d'état correctes.
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import movementCore from '../../../../shared/actions/core/movement.js';

// Destructurer les exports du module
const { actions, guards, selectors, events, utils } = movementCore;
const {
  moveVehicleTo,
  startMovement,
  stopMovement,
  updatePosition
} = actions;
const {
  isVehicleMoving,
  canMoveToTile,
  isAtDestination
} = guards;
const {
  getCurrentPosition,
  getMovementInfo,
  getDistanceToTarget
} = selectors;
const {
  movementStartedEvent,
  movementCompletedEvent,
  movementFailedEvent
} = events;
const {
  calculateDistance,
  isValidCoordinate
} = utils;

describe('Movement Actions Core', () => {
  let mockVehicle;
  let mockTile;

  beforeEach(() => {
    mockVehicle = {
      id: 'test-vehicle',
      type: 'drone',
      coord: '0,0',
      position: { x: 0, y: 0, z: 0 },
      isMoving: false,
      speed: 1
    };

    mockTile = {
      coord: '1,1',
      position: { x: 1, y: 0, z: 1 },
      walkable: true
    };
  });

  describe('Actions principales', () => {
    describe('moveVehicleTo', () => {
      it('should move vehicle to valid tile', () => {
        const result = moveVehicleTo(mockVehicle, mockTile);

        expect(result).toEqual({
          ...mockVehicle,
          targetCoord: '1,1',
          targetPosition: { x: 1, y: 0, z: 1 },
          isMoving: true
        });
      });

      it('should throw error for invalid tile', () => {
        const invalidTile = { coord: null };
        
        expect(() => moveVehicleTo(mockVehicle, invalidTile))
          .toThrow('Invalid target tile: missing position or coord');
      });

      it('should throw error for unwalkable tile', () => {
        const unwalkableTile = { ...mockTile, walkable: false };
        
        expect(() => moveVehicleTo(mockVehicle, unwalkableTile))
          .toThrow('Target tile is not walkable');
      });

      it('should not mutate original vehicle', () => {
        const originalVehicle = { ...mockVehicle };
        moveVehicleTo(mockVehicle, mockTile);

        expect(mockVehicle).toEqual(originalVehicle);
      });
    });

    describe('startMovement', () => {
      it('should start movement correctly', () => {
        const result = startMovement(mockVehicle);

        expect(result).toEqual({
          ...mockVehicle,
          isMoving: true
        });
      });

      it('should not mutate original vehicle', () => {
        const originalVehicle = { ...mockVehicle };
        startMovement(mockVehicle);

        expect(mockVehicle).toEqual(originalVehicle);
      });
    });

    describe('stopMovement', () => {
      it('should stop movement correctly', () => {
        const movingVehicle = { ...mockVehicle, isMoving: true };
        const result = stopMovement(movingVehicle);

        expect(result).toEqual({
          ...movingVehicle,
          isMoving: false
        });
      });

      it('should not mutate original vehicle', () => {
        const movingVehicle = { ...mockVehicle, isMoving: true };
        const originalVehicle = { ...movingVehicle };
        stopMovement(movingVehicle);

        expect(movingVehicle).toEqual(originalVehicle);
      });
    });

    describe('updatePosition', () => {
      it('should update position correctly', () => {
        const newPosition = { x: 2, y: 0, z: 2 };
        const result = updatePosition(mockVehicle, newPosition, '2,2');

        expect(result).toEqual({
          ...mockVehicle,
          position: newPosition,
          coord: '2,2'
        });
      });

      it('should not mutate original vehicle', () => {
        const originalVehicle = { ...mockVehicle };
        const newPosition = { x: 2, y: 0, z: 2 };
        updatePosition(mockVehicle, newPosition, '2,2');

        expect(mockVehicle).toEqual(originalVehicle);
      });
    });
  });

  describe('Guards', () => {
    describe('isVehicleMoving', () => {
      it('should return true for moving vehicle', () => {
        const movingVehicle = { ...mockVehicle, isMoving: true };
        expect(isVehicleMoving(movingVehicle)).toBe(true);
      });

      it('should return false for stationary vehicle', () => {
        expect(isVehicleMoving(mockVehicle)).toBe(false);
      });

      it('should handle null/undefined vehicle', () => {
        expect(isVehicleMoving(null)).toBe(false);
        expect(isVehicleMoving(undefined)).toBe(false);
      });
    });

    describe('canMoveToTile', () => {
      it('should return true for walkable tile', () => {
        expect(canMoveToTile(mockTile)).toBe(true);
      });

      it('should return false for unwalkable tile', () => {
        const unwalkableTile = { ...mockTile, walkable: false };
        expect(canMoveToTile(unwalkableTile)).toBe(false);
      });

      it('should return false for invalid tile', () => {
        expect(canMoveToTile(null)).toBe(false);
        expect(canMoveToTile({})).toBe(false);
      });
    });

    describe('isAtDestination', () => {
      it('should return true when at destination', () => {
        const vehicleAtDestination = {
          ...mockVehicle,
          coord: '1,1',
          targetCoord: '1,1'
        };
        expect(isAtDestination(vehicleAtDestination)).toBe(true);
      });

      it('should return false when not at destination', () => {
        const vehicleInTransit = {
          ...mockVehicle,
          coord: '0,0',
          targetCoord: '1,1'
        };
        expect(isAtDestination(vehicleInTransit)).toBe(false);
      });

      it('should return false when no target', () => {
        expect(isAtDestination(mockVehicle)).toBe(false);
      });
    });
  });

  describe('Selectors', () => {
    describe('getCurrentPosition', () => {
      it('should return current position', () => {
        const result = getCurrentPosition(mockVehicle);
        expect(result).toEqual({
          coord: '0,0',
          position: { x: 0, y: 0, z: 0 }
        });
      });

      it('should handle vehicle without position', () => {
        const vehicleWithoutPosition = { ...mockVehicle, position: undefined };
        const result = getCurrentPosition(vehicleWithoutPosition);
        expect(result.position).toEqual({ x: 0, y: 0, z: 0 });
      });
    });

    describe('getMovementInfo', () => {
      it('should return complete movement info', () => {
        const movingVehicle = {
          ...mockVehicle,
          isMoving: true,
          targetCoord: '1,1',
          targetPosition: { x: 1, y: 0, z: 1 }
        };

        const result = getMovementInfo(movingVehicle);
        expect(result).toEqual({
          isMoving: true,
          currentCoord: '0,0',
          targetCoord: '1,1',
          currentPosition: { x: 0, y: 0, z: 0 },
          targetPosition: { x: 1, y: 0, z: 1 }
        });
      });
    });

    describe('getDistanceToTarget', () => {
      it('should calculate distance to target', () => {
        const vehicleWithTarget = {
          ...mockVehicle,
          targetPosition: { x: 3, y: 0, z: 4 }
        };

        const result = getDistanceToTarget(vehicleWithTarget);
        expect(result).toBe(5); // Distance from (0,0,0) to (3,0,4) = 5
      });

      it('should return 0 when no target', () => {
        const result = getDistanceToTarget(mockVehicle);
        expect(result).toBe(0);
      });
    });
  });

  describe('Events', () => {
    describe('movementStartedEvent', () => {
      it('should create correct event structure', () => {
        const event = movementStartedEvent(mockVehicle, '1,1');

        expect(event).toMatchObject({
          type: 'MOVEMENT_STARTED',
          payload: {
            vehicleId: 'test-vehicle',
            fromCoord: '0,0',
            targetCoord: '1,1'
          }
        });

        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });

    describe('movementCompletedEvent', () => {
      it('should create correct event structure', () => {
        const event = movementCompletedEvent(mockVehicle, '1,1');

        expect(event).toMatchObject({
          type: 'MOVEMENT_COMPLETED',
          payload: {
            vehicleId: 'test-vehicle',
            coord: '1,1'
          }
        });

        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });

    describe('movementFailedEvent', () => {
      it('should create correct event structure', () => {
        const error = 'Target not reachable';
        const event = movementFailedEvent(mockVehicle, error);

        expect(event).toMatchObject({
          type: 'MOVEMENT_FAILED',
          payload: {
            vehicleId: 'test-vehicle',
            error: 'Target not reachable'
          }
        });

        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });
  });

  describe('Utils', () => {
    describe('calculateDistance', () => {
      it('should calculate correct distance', () => {
        const pos1 = { x: 0, y: 0, z: 0 };
        const pos2 = { x: 3, y: 0, z: 4 };
        const distance = calculateDistance(pos1, pos2);
        expect(distance).toBe(5);
      });

      it('should handle same position', () => {
        const pos = { x: 1, y: 1, z: 1 };
        const distance = calculateDistance(pos, pos);
        expect(distance).toBe(0);
      });

      it('should handle invalid positions', () => {
        expect(() => calculateDistance(null, { x: 0, y: 0, z: 0 }))
          .toThrow();
      });
    });

    describe('isValidCoordinate', () => {
      it('should validate correct coordinates', () => {
        expect(isValidCoordinate('0,0')).toBe(true);
        expect(isValidCoordinate('10,-5')).toBe(true);
        expect(isValidCoordinate('-10,15')).toBe(true);
      });

      it('should reject invalid coordinates', () => {
        expect(isValidCoordinate('abc')).toBe(false);
        expect(isValidCoordinate('1,2,3')).toBe(false);
        expect(isValidCoordinate('1')).toBe(false);
        expect(isValidCoordinate('')).toBe(false);
        expect(isValidCoordinate(null)).toBe(false);
      });
    });
  });

  describe('Purity tests', () => {
    it('should not modify input objects in any action', () => {
      const originalVehicle = JSON.stringify(mockVehicle);
      const originalTile = JSON.stringify(mockTile);

      // Test all actions
      moveVehicleTo(mockVehicle, mockTile);
      startMovement(mockVehicle);
      stopMovement(mockVehicle);
      updatePosition(mockVehicle, { x: 1, y: 0, z: 1 }, '1,1');

      expect(JSON.stringify(mockVehicle)).toBe(originalVehicle);
      expect(JSON.stringify(mockTile)).toBe(originalTile);
    });

    it('should always return new objects for state changes', () => {
      const result1 = moveVehicleTo(mockVehicle, mockTile);
      const result2 = startMovement(mockVehicle);

      expect(result1).not.toBe(mockVehicle);
      expect(result2).not.toBe(mockVehicle);
    });
  });

  describe('Export structure', () => {
    it('should export correct structure', () => {
      expect(movementCore).toHaveProperty('actions');
      expect(movementCore).toHaveProperty('guards');
      expect(movementCore).toHaveProperty('selectors');
      expect(movementCore).toHaveProperty('events');
      expect(movementCore).toHaveProperty('utils');
    });

    it('should have all expected actions', () => {
      const { actions } = movementCore;
      expect(actions).toHaveProperty('moveVehicleTo');
      expect(actions).toHaveProperty('startMovement');
      expect(actions).toHaveProperty('stopMovement');
      expect(actions).toHaveProperty('updatePosition');
    });

    it('should have all expected guards', () => {
      const { guards } = movementCore;
      expect(guards).toHaveProperty('isVehicleMoving');
      expect(guards).toHaveProperty('canMoveToTile');
      expect(guards).toHaveProperty('isAtDestination');
    });
  });
});
