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
import movementCore, { 
  movementActions, 
  movementGuards, 
  movementSelectors, 
  movementEvents,
  VEHICLE_TYPES,
  DEFAULT_VEHICLE_STATE,
  DEFAULT_CAPACITIES,
  combineVehicleUpdates,
  filterVehicles,
  validateVehicleIntegrity
} from '../../../../shared/actions/core/movement.js';

// Destructurer les exports du module
const { actions, guards, selectors, events, utils } = movementCore;

describe('Movement Actions Core', () => {
  let mockVehicle;
  let mockTile;
  let mockContext;

  beforeEach(() => {
    mockVehicle = {
      id: 'test-vehicle',
      type: 'drone',
      coord: '0,0',
      position: { x: 0, y: 0, z: 0 },
      isMoving: false,
      speed: 1,
      health: 100,
      shield: 0,
      active: true,
      fuel: 100
    };

    mockTile = {
      coord: '1,1',
      position: { x: 1, y: 0, z: 1 }
    };

    mockContext = {
      vehicle: mockVehicle
    };
  });

  describe('Constants', () => {
    it('should export VEHICLE_TYPES', () => {
      expect(VEHICLE_TYPES).toHaveProperty('MAIN_SHIP');
      expect(VEHICLE_TYPES).toHaveProperty('DRONE');
      expect(VEHICLE_TYPES).toHaveProperty('SCOUT');
      expect(VEHICLE_TYPES).toHaveProperty('HARVESTER');
    });

    it('should export DEFAULT_VEHICLE_STATE', () => {
      expect(DEFAULT_VEHICLE_STATE).toHaveProperty('isMoving', false);
      expect(DEFAULT_VEHICLE_STATE).toHaveProperty('speed', 1);
      expect(DEFAULT_VEHICLE_STATE).toHaveProperty('health', 100);
      expect(DEFAULT_VEHICLE_STATE).toHaveProperty('shield', 0);
      expect(DEFAULT_VEHICLE_STATE).toHaveProperty('active', true);
    });

    it('should export DEFAULT_CAPACITIES for all vehicle types', () => {
      expect(DEFAULT_CAPACITIES).toHaveProperty(VEHICLE_TYPES.MAIN_SHIP);
      expect(DEFAULT_CAPACITIES).toHaveProperty(VEHICLE_TYPES.DRONE);
      expect(DEFAULT_CAPACITIES).toHaveProperty(VEHICLE_TYPES.SCOUT);
      expect(DEFAULT_CAPACITIES).toHaveProperty(VEHICLE_TYPES.HARVESTER);
    });
  });

  describe('Movement Actions', () => {
    describe('moveToTile', () => {
      it('should move vehicle to valid tile', () => {
        const event = { targetTile: mockTile };
        const result = actions.moveToTile(mockContext, event);

        expect(result.vehicle.targetTile).toEqual(mockTile);
        expect(result.vehicle.isMoving).toBe(true);
        expect(result.vehicle.progress).toBe(0);
        expect(result.vehicle.movementStartTime).toBeTypeOf('number');
      });

      it('should return error for invalid tile', () => {
        const event = { targetTile: { coord: null } };
        const result = actions.moveToTile(mockContext, event);

        expect(result.error).toBeDefined();
        expect(result.lastAction).toBe('moveToTile_failed');
      });

      it('should return error for insufficient fuel', () => {
        const lowFuelContext = {
          vehicle: { ...mockVehicle, fuel: 1 }
        };
        const event = { targetTile: mockTile };
        const result = actions.moveToTile(lowFuelContext, event);

        expect(result.error).toBeDefined();
        expect(result.lastAction).toBe('moveToTile_failed');
      });

      it('should not move if already moving', () => {
        const movingContext = {
          vehicle: { ...mockVehicle, isMoving: true }
        };
        const event = { targetTile: mockTile };
        const result = actions.moveToTile(movingContext, event);

        expect(result.error).toBeDefined();
        expect(result.lastAction).toBe('moveToTile_failed');
      });
    });

    describe('stopMovement', () => {
      it('should stop movement correctly', () => {
        const movingContext = {
          vehicle: { 
            ...mockVehicle, 
            isMoving: true,
            targetTile: mockTile,
            progress: 50
          }
        };
        const result = actions.stopMovement(movingContext);

        expect(result.vehicle.isMoving).toBe(false);
        expect(result.vehicle.targetTile.position).toBe(null);
        expect(result.vehicle.targetTile.coord).toBe(null);
        expect(result.vehicle.progress).toBe(0);
        expect(result.vehicle.movementStartTime).toBe(null);
      });
    });

    describe('updateProgress', () => {
      it('should update progress correctly', () => {
        const event = { progress: 75 };
        const result = actions.updateProgress(mockContext, event);

        expect(result.vehicle.progress).toBe(75);
      });

      it('should clamp progress to 0-100 range', () => {
        const event1 = { progress: -10 };
        const result1 = actions.updateProgress(mockContext, event1);
        expect(result1.vehicle.progress).toBe(0);

        const event2 = { progress: 150 };
        const result2 = actions.updateProgress(mockContext, event2);
        expect(result2.vehicle.progress).toBe(100);
      });

      it('should handle invalid progress values', () => {
        const event = { progress: 'invalid' };
        const result = actions.updateProgress(mockContext, event);
        expect(result.vehicle.progress).toBe(0);
      });
    });

    describe('updatePosition', () => {
      it('should update position correctly', () => {
        const event = { newCoord: '2,2' };
        const result = actions.updatePosition(mockContext, event);

        expect(result.vehicle.coord).toBe('2,2');
        expect(result.vehicle.lastUpdate).toBeTypeOf('number');
      });

      it('should return unchanged context for missing newCoord', () => {
        const event = {};
        const result = actions.updatePosition(mockContext, event);

        expect(result).toBe(mockContext);
      });
    });

    describe('completeMovement', () => {
      it('should complete movement correctly', () => {
        const movingContext = {
          vehicle: {
            ...mockVehicle,
            isMoving: true,
            targetTile: mockTile,
            progress: 100
          }
        };
        const result = actions.completeMovement(movingContext);

        expect(result.vehicle.isMoving).toBe(false);
        expect(result.vehicle.progress).toBe(100);
        expect(result.vehicle.coord).toBe(mockTile.coord);
        expect(result.vehicle.lastMovementTime).toBeTypeOf('number');
      });
    });

    describe('createVehicleWithCapacities', () => {
      it('should create vehicle with default capacities', () => {
        const event = {
          vehicleData: {
            id: 'new-vehicle',
            type: VEHICLE_TYPES.DRONE
          }
        };
        const result = actions.createVehicleWithCapacities(mockContext, event);

        expect(result.vehicle.id).toBe('new-vehicle');
        expect(result.vehicle.type).toBe(VEHICLE_TYPES.DRONE);
        expect(result.vehicle.maxCapacity).toEqual(DEFAULT_CAPACITIES[VEHICLE_TYPES.DRONE]);
        expect(result.vehicle.resources).toEqual({ food: 0, debris: 0, special: 0 });
      });

      it('should use custom capacities if provided', () => {
        const customCapacity = { food: 200, debris: 2000, special: 5 };
        const event = {
          vehicleData: {
            id: 'new-vehicle',
            type: VEHICLE_TYPES.MAIN_SHIP,
            maxCapacity: customCapacity
          }
        };
        const result = actions.createVehicleWithCapacities(mockContext, event);

        expect(result.vehicle.maxCapacity).toEqual(customCapacity);
      });
    });
  });

  describe('Movement Guards', () => {
    describe('canMoveTo', () => {
      it('should allow movement to valid tile', () => {
        const event = { targetTile: mockTile };
        const result = guards.canMoveTo(mockContext, event);
        expect(result).toBe(true);
      });

      it('should prevent movement when already moving', () => {
        const movingContext = {
          vehicle: { ...mockVehicle, isMoving: true }
        };
        const event = { targetTile: mockTile };
        const result = guards.canMoveTo(movingContext, event);
        expect(result).toBe(false);
      });

      it('should prevent movement to invalid tile', () => {
        const event = { targetTile: { coord: null } };
        const result = guards.canMoveTo(mockContext, event);
        expect(result).toBe(false);
      });
    });

    describe('hasEnoughFuel', () => {
      it('should return true with sufficient fuel', () => {
        const event = { targetTile: mockTile };
        const result = guards.hasEnoughFuel(mockContext, event);
        expect(result).toBe(true);
      });

      it('should return false with insufficient fuel', () => {
        const lowFuelContext = {
          vehicle: { ...mockVehicle, fuel: 1 }
        };
        const event = { targetTile: mockTile };
        const result = guards.hasEnoughFuel(lowFuelContext, event);
        expect(result).toBe(false);
      });

      it('should handle missing data gracefully', () => {
        const result1 = guards.hasEnoughFuel({}, {});
        expect(result1).toBe(false);

        const result2 = guards.hasEnoughFuel(mockContext, {});
        expect(result2).toBe(false);
      });
    });

    describe('isMovementComplete', () => {
      it('should return true when progress is 100', () => {
        const completeContext = {
          vehicle: { ...mockVehicle, progress: 100 }
        };
        const result = guards.isMovementComplete(completeContext);
        expect(result).toBe(true);
      });

      it('should return true when at target coord', () => {
        const atTargetContext = {
          vehicle: {
            ...mockVehicle,
            coord: '1,1',
            targetTile: { coord: '1,1' }
          }
        };
        const result = guards.isMovementComplete(atTargetContext);
        expect(result).toBe(true);
      });

      it('should return false for incomplete movement', () => {
        const incompleteContext = {
          vehicle: { ...mockVehicle, progress: 50 }
        };
        const result = guards.isMovementComplete(incompleteContext);
        expect(result).toBe(false);
      });
    });

    describe('Vehicle Guards', () => {
      describe('isVehicleActive', () => {
        it('should return true for active vehicle', () => {
          const result = guards.isVehicleActive(mockContext);
          expect(result).toBe(true);
        });

        it('should return false for inactive vehicle', () => {
          const inactiveContext = {
            vehicle: { ...mockVehicle, active: false }
          };
          const result = guards.isVehicleActive(inactiveContext);
          expect(result).toBe(false);
        });
      });

      describe('isVehicleOperational', () => {
        it('should return true for operational vehicle', () => {
          const result = guards.isVehicleOperational(mockContext);
          expect(result).toBe(true);
        });

        it('should return false for inactive vehicle', () => {
          const inactiveContext = {
            vehicle: { ...mockVehicle, active: false }
          };
          const result = guards.isVehicleOperational(inactiveContext);
          expect(result).toBe(false);
        });

        it('should return false for zero health vehicle', () => {
          const destroyedContext = {
            vehicle: { ...mockVehicle, health: 0 }
          };
          const result = guards.isVehicleOperational(destroyedContext);
          expect(result).toBe(false);
        });
      });

      describe('isVehicleDamaged', () => {
        it('should return false for full health vehicle', () => {
          const result = guards.isVehicleDamaged(mockContext);
          expect(result).toBe(false);
        });

        it('should return true for damaged vehicle', () => {
          const damagedContext = {
            vehicle: { ...mockVehicle, health: 75 }
          };
          const result = guards.isVehicleDamaged(damagedContext);
          expect(result).toBe(true);
        });
      });

      describe('isVehicleCritical', () => {
        it('should return false for healthy vehicle', () => {
          const result = guards.isVehicleCritical(mockContext);
          expect(result).toBe(false);
        });

        it('should return true for critical vehicle', () => {
          const criticalContext = {
            vehicle: { ...mockVehicle, health: 15 }
          };
          const result = guards.isVehicleCritical(criticalContext);
          expect(result).toBe(true);
        });

        it('should accept custom threshold', () => {
          const context = {
            vehicle: { ...mockVehicle, health: 25 }
          };
          const result = guards.isVehicleCritical(context, 30);
          expect(result).toBe(true);
        });
      });

      describe('canUseVehicle', () => {
        it('should return true for usable vehicle', () => {
          const result = guards.canUseVehicle(mockContext);
          expect(result).toBe(true);
        });

        it('should return false for critical vehicle', () => {
          const criticalContext = {
            vehicle: { ...mockVehicle, health: 10 }
          };
          const result = guards.canUseVehicle(criticalContext);
          expect(result).toBe(false);
        });
      });

      describe('hasShield', () => {
        it('should return false for no shield', () => {
          const result = guards.hasShield(mockContext);
          expect(result).toBe(false);
        });

        it('should return true for active shield', () => {
          const shieldedContext = {
            vehicle: { ...mockVehicle, shield: 50 }
          };
          const result = guards.hasShield(shieldedContext);
          expect(result).toBe(true);
        });
      });
    });
  });

  describe('Movement Selectors', () => {
    describe('isMoving', () => {
      it('should return false for stationary vehicle', () => {
        const result = selectors.isMoving(mockVehicle);
        expect(result).toBe(false);
      });

      it('should return true for moving vehicle', () => {
        const movingVehicle = { ...mockVehicle, isMoving: true };
        const result = selectors.isMoving(movingVehicle);
        expect(result).toBe(true);
      });
    });

    describe('getDestination', () => {
      it('should return null for no destination', () => {
        const result = selectors.getDestination(mockVehicle);
        expect(result).toBe(null);
      });

      it('should return target tile when set', () => {
        const vehicleWithTarget = { ...mockVehicle, targetTile: mockTile };
        const result = selectors.getDestination(vehicleWithTarget);
        expect(result).toEqual(mockTile);
      });
    });

    describe('getProgress', () => {
      it('should return 0 for no progress', () => {
        const result = selectors.getProgress(mockVehicle);
        expect(result).toBe(0);
      });

      it('should return current progress', () => {
        const vehicleWithProgress = { ...mockVehicle, progress: 75 };
        const result = selectors.getProgress(vehicleWithProgress);
        expect(result).toBe(75);
      });
    });

    describe('getMovementDuration', () => {
      it('should return 0 for no movement', () => {
        const result = selectors.getMovementDuration(mockVehicle);
        expect(result).toBe(0);
      });

      it('should calculate duration correctly', () => {
        const startTime = Date.now() - 5000;
        const vehicleInMotion = { ...mockVehicle, movementStartTime: startTime };
        const result = selectors.getMovementDuration(vehicleInMotion);
        expect(result).toBeGreaterThan(4000);
        expect(result).toBeLessThan(6000);
      });
    });

    describe('canStartMovement', () => {
      it('should return true for stationary vehicle', () => {
        const result = selectors.canStartMovement(mockVehicle);
        expect(result).toBe(true);
      });

      it('should return false for moving vehicle', () => {
        const movingVehicle = { ...mockVehicle, isMoving: true };
        const result = selectors.canStartMovement(movingVehicle);
        expect(result).toBe(false);
      });
    });

    describe('getDistanceToTarget', () => {
      it('should return 0 for no target', () => {
        const result = selectors.getDistanceToTarget(mockVehicle);
        expect(result).toBe(0);
      });

      it('should calculate distance correctly', () => {
        const vehicleWithTarget = {
          ...mockVehicle,
          coord: '0,0',
          targetTile: { coord: '3,4' }
        };
        const result = selectors.getDistanceToTarget(vehicleWithTarget);
        expect(result).toBe(7); // Manhattan distance: |3-0| + |4-0| = 7
      });
    });

    describe('Vehicle Selectors', () => {
      describe('getVehicleStatus', () => {
        it('should return complete vehicle status', () => {
          const result = selectors.getVehicleStatus(mockVehicle);
          
          expect(result).toEqual({
            id: 'test-vehicle',
            type: 'drone',
            active: true,
            operational: true,
            moving: false,
            damaged: false,
            critical: false,
            health: 100,
            shield: 0,
            speed: 1
          });
        });

        it('should handle damaged vehicle', () => {
          const damagedVehicle = { ...mockVehicle, health: 30 };
          const result = selectors.getVehicleStatus(damagedVehicle);
          
          expect(result.damaged).toBe(true);
          expect(result.critical).toBe(false);
        });

        it('should handle critical vehicle', () => {
          const criticalVehicle = { ...mockVehicle, health: 15 };
          const result = selectors.getVehicleStatus(criticalVehicle);
          
          expect(result.damaged).toBe(true);
          expect(result.critical).toBe(true);
        });
      });

      describe('getHealthPercentage', () => {
        it('should return correct health percentage', () => {
          const result = selectors.getHealthPercentage(mockVehicle);
          expect(result).toBe(100);
        });

        it('should clamp to valid range', () => {
          const result1 = selectors.getHealthPercentage({ health: -10 });
          expect(result1).toBe(0);

          const result2 = selectors.getHealthPercentage({ health: 150 });
          expect(result2).toBe(100);
        });
      });

      describe('getVehicleEssentials', () => {
        it('should return essential vehicle info', () => {
          const result = selectors.getVehicleEssentials(mockVehicle);
          
          expect(result).toEqual({
            id: 'test-vehicle',
            type: 'drone',
            coord: '0,0',
            position: { x: 0, y: 0, z: 0 },
            isMoving: false,
            active: true,
            health: 100
          });
        });
      });

      describe('hasActiveShield', () => {
        it('should return false for no shield', () => {
          const result = selectors.hasActiveShield(mockVehicle);
          expect(result).toBe(false);
        });

        it('should return true for active shield', () => {
          const shieldedVehicle = { ...mockVehicle, shield: 25 };
          const result = selectors.hasActiveShield(shieldedVehicle);
          expect(result).toBe(true);
        });
      });

      describe('getVehicleCapacities', () => {
        it('should return default capacities for vehicle type', () => {
          const result = selectors.getVehicleCapacities(mockVehicle);
          expect(result).toEqual(DEFAULT_CAPACITIES[VEHICLE_TYPES.DRONE]);
        });

        it('should return custom capacities if set', () => {
          const customCapacity = { food: 200, debris: 2000, special: 5 };
          const vehicleWithCustom = { ...mockVehicle, maxCapacity: customCapacity };
          const result = selectors.getVehicleCapacities(vehicleWithCustom);
          expect(result).toEqual(customCapacity);
        });
      });
    });
  });

  describe('Movement Events', () => {
    describe('moveToTile', () => {
      it('should create correct event structure', () => {
        const event = events.moveToTile(mockTile);
        expect(event).toEqual({
          type: 'MOVE_TO_TILE',
          targetTile: mockTile
        });
      });
    });

    describe('stopMovement', () => {
      it('should create stop movement event', () => {
        const event = events.stopMovement();
        expect(event).toEqual({
          type: 'STOP_MOVEMENT'
        });
      });
    });

    describe('updateProgress', () => {
      it('should create progress update event', () => {
        const event = events.updateProgress(75);
        expect(event).toEqual({
          type: 'UPDATE_MOVEMENT_PROGRESS',
          progress: 75
        });
      });
    });

    describe('completeMovement', () => {
      it('should create movement completion event', () => {
        const event = events.completeMovement();
        expect(event).toEqual({
          type: 'COMPLETE_MOVEMENT'
        });
      });
    });

    describe('createVehicleWithCapacities', () => {
      it('should create vehicle creation event', () => {
        const vehicleData = { id: 'test', type: 'drone' };
        const event = events.createVehicleWithCapacities(vehicleData);
        expect(event).toEqual({
          type: 'CREATE_VEHICLE_WITH_CAPACITIES',
          vehicleData
        });
      });
    });

    describe('Vehicle Events', () => {
      describe('vehicleUpdatedEvent', () => {
        it('should create vehicle updated event', () => {
          const changes = { health: 80 };
          const event = events.vehicleUpdatedEvent(mockVehicle, changes);
          
          expect(event.type).toBe('VEHICLE_UPDATED');
          expect(event.payload.vehicleId).toBe('test-vehicle');
          expect(event.payload.changes).toEqual(changes);
          expect(event.payload.timestamp).toBeTypeOf('number');
        });
      });

      describe('vehicleStateChangedEvent', () => {
        it('should create state change event', () => {
          const event = events.vehicleStateChangedEvent(mockVehicle, false);
          
          expect(event.type).toBe('VEHICLE_STATE_CHANGED');
          expect(event.payload.vehicleId).toBe('test-vehicle');
          expect(event.payload.active).toBe(false);
          expect(event.payload.timestamp).toBeTypeOf('number');
        });
      });

      describe('vehicleDamagedEvent', () => {
        it('should create damage event', () => {
          const event = events.vehicleDamagedEvent(mockVehicle, 25, 75);
          
          expect(event.type).toBe('VEHICLE_DAMAGED');
          expect(event.payload.vehicleId).toBe('test-vehicle');
          expect(event.payload.damage).toBe(25);
          expect(event.payload.oldHealth).toBe(100);
          expect(event.payload.newHealth).toBe(75);
          expect(event.payload.critical).toBe(false);
          expect(event.payload.timestamp).toBeTypeOf('number');
        });

        it('should mark as critical when health drops low', () => {
          const event = events.vehicleDamagedEvent(mockVehicle, 85, 15);
          expect(event.payload.critical).toBe(true);
        });
      });

      describe('vehicleRepairedEvent', () => {
        it('should create repair event', () => {
          const damagedVehicle = { ...mockVehicle, health: 50 };
          const event = events.vehicleRepairedEvent(damagedVehicle, 30, 80);
          
          expect(event.type).toBe('VEHICLE_REPAIRED');
          expect(event.payload.vehicleId).toBe('test-vehicle');
          expect(event.payload.repairAmount).toBe(30);
          expect(event.payload.oldHealth).toBe(50);
          expect(event.payload.newHealth).toBe(80);
          expect(event.payload.fullyRepaired).toBe(false);
          expect(event.payload.timestamp).toBeTypeOf('number');
        });

        it('should mark as fully repaired when health reaches 100', () => {
          const event = events.vehicleRepairedEvent(mockVehicle, 0, 100);
          expect(event.payload.fullyRepaired).toBe(true);
        });
      });
    });
  });

  describe('Utility Functions', () => {
    describe('combineVehicleUpdates', () => {
      it('should combine multiple updates', () => {
        const update1 = { health: 80 };
        const update2 = { shield: 25 };
        const update3 = { speed: 2 };
        
        const result = combineVehicleUpdates(update1, update2, update3);
        expect(result).toEqual({
          health: 80,
          shield: 25,
          speed: 2
        });
      });

      it('should validate and normalize values', () => {
        const updates = {
          health: -10,
          shield: -5,
          speed: 0,
          isMoving: 'true',
          active: 1
        };
        
        const result = combineVehicleUpdates(updates);
        expect(result.health).toBe(0);
        expect(result.shield).toBe(0);
        expect(result.speed).toBe(0.1);
        expect(result.isMoving).toBe(true);
        expect(result.active).toBe(true);
      });
    });

    describe('filterVehicles', () => {
      it('should filter vehicles by predicate', () => {
        const vehicles = {
          'v1': { id: 'v1', active: true, health: 100 },
          'v2': { id: 'v2', active: false, health: 50 },
          'v3': { id: 'v3', active: true, health: 25 }
        };
        
        const activeVehicles = filterVehicles(vehicles, v => v.active);
        expect(Object.keys(activeVehicles)).toEqual(['v1', 'v3']);
        
        const healthyVehicles = filterVehicles(vehicles, v => v.health > 30);
        expect(Object.keys(healthyVehicles)).toEqual(['v1', 'v2']);
      });
    });

    describe('validateVehicleIntegrity', () => {
      it('should validate correct vehicle', () => {
        const result = validateVehicleIntegrity(mockVehicle);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
      });

      it('should detect missing ID', () => {
        const vehicle = { ...mockVehicle };
        delete vehicle.id;
        const result = validateVehicleIntegrity(vehicle);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Missing vehicle ID');
      });

      it('should detect missing type', () => {
        const vehicle = { ...mockVehicle };
        delete vehicle.type;
        const result = validateVehicleIntegrity(vehicle);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Missing vehicle type');
      });

      it('should warn about health out of range', () => {
        const vehicle = { ...mockVehicle, health: 150 };
        const result = validateVehicleIntegrity(vehicle);
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Health out of range');
      });

      it('should warn about invalid speed', () => {
        const vehicle = { ...mockVehicle, speed: -1 };
        const result = validateVehicleIntegrity(vehicle);
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Invalid speed value');
      });
    });
  });

  describe('Purity tests', () => {
    it('should not modify input objects in any action', () => {
      const originalContext = JSON.parse(JSON.stringify(mockContext));
      const originalTile = JSON.parse(JSON.stringify(mockTile));

      // Test all actions
      actions.moveToTile(mockContext, { targetTile: mockTile });
      actions.stopMovement(mockContext);
      actions.updateProgress(mockContext, { progress: 50 });
      actions.updatePosition(mockContext, { newCoord: '1,1' });
      actions.completeMovement(mockContext);
      actions.createVehicleWithCapacities(mockContext, { vehicleData: { id: 'test', type: 'drone' } });

      expect(mockContext).toEqual(originalContext);
      expect(mockTile).toEqual(originalTile);
    });

    it('should always return new objects for state changes', () => {
      const result1 = actions.moveToTile(mockContext, { targetTile: mockTile });
      const result2 = actions.stopMovement(mockContext);

      expect(result1).not.toBe(mockContext);
      expect(result2).not.toBe(mockContext);
      expect(result1.vehicle).not.toBe(mockContext.vehicle);
      expect(result2.vehicle).not.toBe(mockContext.vehicle);
    });
  });

  describe('Export structure', () => {
    it('should export correct main structure', () => {
      expect(movementCore).toHaveProperty('actions');
      expect(movementCore).toHaveProperty('guards');
      expect(movementCore).toHaveProperty('selectors');
      expect(movementCore).toHaveProperty('events');
      expect(movementCore).toHaveProperty('utils');
    });

    it('should export named exports', () => {
      expect(movementActions).toBeDefined();
      expect(movementGuards).toBeDefined();
      expect(movementSelectors).toBeDefined();
      expect(movementEvents).toBeDefined();
    });

    it('should export utility functions', () => {
      expect(combineVehicleUpdates).toBeTypeOf('function');
      expect(filterVehicles).toBeTypeOf('function');
      expect(validateVehicleIntegrity).toBeTypeOf('function');
    });

    it('should export constants', () => {
      expect(VEHICLE_TYPES).toBeDefined();
      expect(DEFAULT_VEHICLE_STATE).toBeDefined();
      expect(DEFAULT_CAPACITIES).toBeDefined();
    });
  });
});
