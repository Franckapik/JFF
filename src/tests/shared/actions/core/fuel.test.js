/**
 * ============================================================================
 * FUEL ACTIONS CORE - Tests unitaires
 * ============================================================================
 * 
 * Tests pour valider la pureté des fonctions de carburant, la gestion d'erreurs
 * et les transformations d'état correctes.
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fuelCore from '../../../../shared/actions/core/fuel.js';

// Destructurer les exports du module
const { actions, guards, selectors, events, utils, FUEL_THRESHOLDS, DEFAULT_FUEL_CAPACITY } = fuelCore;
const {
  consumeFuel,
  refuelVehicle,
  addFuel,
  setFuelLevel,
  emptyTank,
  consumeFuelForDistance
} = actions;
const {
  canConsumeFuel,
  hasEnoughFuelForDistance,
  isCriticalFuel,
  isLowFuel,
  canRefuel,
  isFullTank
} = guards;
const {
  getCurrentFuel,
  getFuelPercentage,
  getFuelNeeded,
  getEstimatedRange,
  getFuelStatus,
  getFuelInfo
} = selectors;
const {
  fuelConsumedEvent,
  fuelRefueledEvent,
  fuelCriticalEvent,
  fuelEmptyEvent
} = events;
const {
  validateFuelLevel,
  normalizeFuelLevel,
  calculateConsumption
} = utils;

// Constants extraites du module
const MAX_FUEL_LEVEL = DEFAULT_FUEL_CAPACITY || 100;
const MIN_FUEL_LEVEL = 0;
const CRITICAL_FUEL_THRESHOLD = FUEL_THRESHOLDS?.critical || 20;
const LOW_FUEL_THRESHOLD = FUEL_THRESHOLDS?.low || 30;
const DEFAULT_CONSUMPTION_RATE = 1;

describe('Fuel Actions Core', () => {
  let mockVehicle;

  beforeEach(() => {
    mockVehicle = {
      id: 'test-vehicle',
      type: 'drone',
      fuel: 75,
      fuelConsumption: 2
    };
  });

  describe('Constants', () => {
    it('should have correct fuel constants', () => {
      expect(MAX_FUEL_LEVEL).toBe(100);
      expect(MIN_FUEL_LEVEL).toBe(0);
      expect(CRITICAL_FUEL_THRESHOLD).toBe(20);
      expect(LOW_FUEL_THRESHOLD).toBe(30);
      expect(DEFAULT_CONSUMPTION_RATE).toBe(1);
    });
  });

  describe('Actions principales', () => {
    describe('consumeFuel', () => {
      it('should consume fuel correctly', () => {
        const result = consumeFuel(mockVehicle, 25);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: 50
        });
      });

      it('should not go below minimum fuel', () => {
        const result = consumeFuel(mockVehicle, 100);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: MIN_FUEL_LEVEL
        });
      });

      it('should handle zero consumption', () => {
        const result = consumeFuel(mockVehicle, 0);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: 75
        });
      });

      it('should not mutate original vehicle', () => {
        const originalVehicle = JSON.parse(JSON.stringify(mockVehicle));
        consumeFuel(mockVehicle, 25);
        expect(mockVehicle).toEqual(originalVehicle);
      });
    });

    describe('refuelVehicle', () => {
      it('should refuel to maximum by default', () => {
        const result = refuelVehicle(mockVehicle);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: MAX_FUEL_LEVEL
        });
      });

      it('should refuel specific amount', () => {
        const result = refuelVehicle(mockVehicle, 10);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: 85
        });
      });

      it('should not exceed maximum fuel', () => {
        const result = refuelVehicle(mockVehicle, 50);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: MAX_FUEL_LEVEL
        });
      });
    });

    describe('addFuel', () => {
      it('should add fuel correctly', () => {
        const result = addFuel(mockVehicle, 15);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: 90
        });
      });

      it('should handle negative amounts', () => {
        const result = addFuel(mockVehicle, -10);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: 65
        });
      });
    });

    describe('setFuelLevel', () => {
      it('should set specific fuel level', () => {
        const result = setFuelLevel(mockVehicle, 50);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: 50
        });
      });

      it('should normalize invalid levels', () => {
        const result1 = setFuelLevel(mockVehicle, 150);
        const result2 = setFuelLevel(mockVehicle, -10);

        expect(result1.fuel).toBe(MAX_FUEL_LEVEL);
        expect(result2.fuel).toBe(MIN_FUEL_LEVEL);
      });
    });

    describe('emptyTank', () => {
      it('should empty fuel tank', () => {
        const result = emptyTank(mockVehicle);

        expect(result).toEqual({
          ...mockVehicle,
          fuel: MIN_FUEL_LEVEL
        });
      });
    });

    describe('consumeFuelForDistance', () => {
      it('should consume fuel based on distance', () => {
        const result = consumeFuelForDistance(mockVehicle, 5);
        // Distance 5 * consumption rate 2 = 10 fuel consumed
        expect(result).toEqual({
          ...mockVehicle,
          fuel: 65
        });
      });

      it('should use default consumption when vehicle has none', () => {
        const vehicleWithoutConsumption = { ...mockVehicle, fuelConsumption: undefined };
        const result = consumeFuelForDistance(vehicleWithoutConsumption, 10);
        // Distance 10 * default rate 1 = 10 fuel consumed
        expect(result.fuel).toBe(65);
      });
    });
  });

  describe('Guards', () => {
    describe('canConsumeFuel', () => {
      it('should return true when enough fuel available', () => {
        expect(canConsumeFuel(mockVehicle, 50)).toBe(true);
      });

      it('should return false when not enough fuel', () => {
        expect(canConsumeFuel(mockVehicle, 100)).toBe(false);
      });

      it('should handle exact amount', () => {
        expect(canConsumeFuel(mockVehicle, 75)).toBe(true);
      });
    });

    describe('hasEnoughFuelForDistance', () => {
      it('should return true for achievable distance', () => {
        expect(hasEnoughFuelForDistance(mockVehicle, 30)).toBe(true);
      });

      it('should return false for excessive distance', () => {
        expect(hasEnoughFuelForDistance(mockVehicle, 50)).toBe(false);
      });

      it('should handle exact distance', () => {
        // 75 fuel / 2 consumption = 37.5 distance
        expect(hasEnoughFuelForDistance(mockVehicle, 37)).toBe(true);
        expect(hasEnoughFuelForDistance(mockVehicle, 38)).toBe(false);
      });
    });

    describe('isCriticalFuel', () => {
      it('should return false for normal fuel levels', () => {
        expect(isCriticalFuel(mockVehicle)).toBe(false);
      });

      it('should return true for critical fuel levels', () => {
        const criticalVehicle = { ...mockVehicle, fuel: 15 };
        expect(isCriticalFuel(criticalVehicle)).toBe(true);
      });

      it('should handle threshold boundary', () => {
        const boundaryVehicle = { ...mockVehicle, fuel: CRITICAL_FUEL_THRESHOLD };
        expect(isCriticalFuel(boundaryVehicle)).toBe(true);
      });
    });

    describe('isLowFuel', () => {
      it('should return false for normal fuel levels', () => {
        expect(isLowFuel(mockVehicle)).toBe(false);
      });

      it('should return true for low fuel levels', () => {
        const lowFuelVehicle = { ...mockVehicle, fuel: 25 };
        expect(isLowFuel(lowFuelVehicle)).toBe(true);
      });
    });

    describe('canRefuel', () => {
      it('should return true for vehicle not at max', () => {
        expect(canRefuel(mockVehicle)).toBe(true);
      });

      it('should return false for full tank', () => {
        const fullVehicle = { ...mockVehicle, fuel: MAX_FUEL_LEVEL };
        expect(canRefuel(fullVehicle)).toBe(false);
      });
    });

    describe('isFullTank', () => {
      it('should return false for partial tank', () => {
        expect(isFullTank(mockVehicle)).toBe(false);
      });

      it('should return true for full tank', () => {
        const fullVehicle = { ...mockVehicle, fuel: MAX_FUEL_LEVEL };
        expect(isFullTank(fullVehicle)).toBe(true);
      });
    });
  });

  describe('Selectors', () => {
    describe('getCurrentFuel', () => {
      it('should return current fuel level', () => {
        expect(getCurrentFuel(mockVehicle)).toBe(75);
      });

      it('should handle missing fuel property', () => {
        const vehicleWithoutFuel = { ...mockVehicle, fuel: undefined };
        expect(getCurrentFuel(vehicleWithoutFuel)).toBe(MAX_FUEL_LEVEL);
      });
    });

    describe('getFuelPercentage', () => {
      it('should calculate correct percentage', () => {
        expect(getFuelPercentage(mockVehicle)).toBe(75);
      });

      it('should handle edge cases', () => {
        const emptyVehicle = { ...mockVehicle, fuel: 0 };
        const fullVehicle = { ...mockVehicle, fuel: 100 };

        expect(getFuelPercentage(emptyVehicle)).toBe(0);
        expect(getFuelPercentage(fullVehicle)).toBe(100);
      });
    });

    describe('getFuelNeeded', () => {
      it('should calculate fuel needed for full tank', () => {
        expect(getFuelNeeded(mockVehicle)).toBe(25);
      });

      it('should return 0 for full tank', () => {
        const fullVehicle = { ...mockVehicle, fuel: MAX_FUEL_LEVEL };
        expect(getFuelNeeded(fullVehicle)).toBe(0);
      });
    });

    describe('getEstimatedRange', () => {
      it('should calculate range based on consumption', () => {
        // 75 fuel / 2 consumption = 37.5 range
        expect(getEstimatedRange(mockVehicle)).toBe(37.5);
      });

      it('should use default consumption when missing', () => {
        const vehicleWithoutConsumption = { ...mockVehicle, fuelConsumption: undefined };
        expect(getEstimatedRange(vehicleWithoutConsumption)).toBe(75);
      });

      it('should handle zero consumption', () => {
        const zeroConsumptionVehicle = { ...mockVehicle, fuelConsumption: 0 };
        expect(getEstimatedRange(zeroConsumptionVehicle)).toBe(Infinity);
      });
    });

    describe('getFuelStatus', () => {
      it('should return correct status for normal fuel', () => {
        expect(getFuelStatus(mockVehicle)).toBe('normal');
      });

      it('should return correct status for low fuel', () => {
        const lowFuelVehicle = { ...mockVehicle, fuel: 25 };
        expect(getFuelStatus(lowFuelVehicle)).toBe('low');
      });

      it('should return correct status for critical fuel', () => {
        const criticalVehicle = { ...mockVehicle, fuel: 15 };
        expect(getFuelStatus(criticalVehicle)).toBe('critical');
      });

      it('should return correct status for empty fuel', () => {
        const emptyVehicle = { ...mockVehicle, fuel: 0 };
        expect(getFuelStatus(emptyVehicle)).toBe('empty');
      });
    });

    describe('getFuelInfo', () => {
      it('should return complete fuel information', () => {
        const result = getFuelInfo(mockVehicle);

        expect(result).toMatchObject({
          current: 75,
          percentage: 75,
          needed: 25,
          status: 'normal',
          range: 37.5,
          isLow: false,
          isCritical: false,
          isEmpty: false,
          isFull: false
        });
      });
    });
  });

  describe('Events', () => {
    describe('fuelConsumedEvent', () => {
      it('should create correct event structure', () => {
        const event = fuelConsumedEvent(mockVehicle, 25, 50);

        expect(event).toMatchObject({
          type: 'FUEL_CONSUMED',
          payload: {
            vehicleId: 'test-vehicle',
            consumed: 25,
            oldLevel: 75,
            newLevel: 50
          }
        });
        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });

    describe('fuelRefueledEvent', () => {
      it('should create correct event structure', () => {
        const event = fuelRefueledEvent(mockVehicle, 25, 100);

        expect(event).toMatchObject({
          type: 'FUEL_REFUELED',
          payload: {
            vehicleId: 'test-vehicle',
            refueled: 25,
            oldLevel: 75,
            newLevel: 100
          }
        });
        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });

    describe('fuelCriticalEvent', () => {
      it('should create correct event structure', () => {
        const event = fuelCriticalEvent(mockVehicle);

        expect(event).toMatchObject({
          type: 'FUEL_CRITICAL',
          payload: {
            vehicleId: 'test-vehicle',
            currentLevel: 75,
            threshold: CRITICAL_FUEL_THRESHOLD
          }
        });
        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });

    describe('fuelEmptyEvent', () => {
      it('should create correct event structure', () => {
        const event = fuelEmptyEvent(mockVehicle);

        expect(event).toMatchObject({
          type: 'FUEL_EMPTY',
          payload: {
            vehicleId: 'test-vehicle'
          }
        });
        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });
  });

  describe('Utils', () => {
    describe('validateFuelLevel', () => {
      it('should accept valid fuel levels', () => {
        expect(() => validateFuelLevel(50)).not.toThrow();
        expect(() => validateFuelLevel(0)).not.toThrow();
        expect(() => validateFuelLevel(100)).not.toThrow();
      });

      it('should throw for invalid fuel levels', () => {
        expect(() => validateFuelLevel(-10))
          .toThrow('Fuel level must be between 0 and 100');
        expect(() => validateFuelLevel(150))
          .toThrow('Fuel level must be between 0 and 100');
        expect(() => validateFuelLevel('invalid'))
          .toThrow('Fuel level must be a number');
      });
    });

    describe('normalizeFuelLevel', () => {
      it('should normalize valid levels', () => {
        expect(normalizeFuelLevel(50)).toBe(50);
        expect(normalizeFuelLevel(0)).toBe(0);
        expect(normalizeFuelLevel(100)).toBe(100);
      });

      it('should clamp out-of-range values', () => {
        expect(normalizeFuelLevel(-10)).toBe(0);
        expect(normalizeFuelLevel(150)).toBe(100);
      });

      it('should handle non-numeric values', () => {
        expect(normalizeFuelLevel('50')).toBe(50);
        expect(normalizeFuelLevel('invalid')).toBe(100);
        expect(normalizeFuelLevel(null)).toBe(100);
        expect(normalizeFuelLevel(undefined)).toBe(100);
      });
    });

    describe('calculateConsumption', () => {
      it('should calculate consumption correctly', () => {
        expect(calculateConsumption(10, 2)).toBe(20);
        expect(calculateConsumption(5, 1.5)).toBe(7.5);
      });

      it('should handle zero distance', () => {
        expect(calculateConsumption(0, 2)).toBe(0);
      });

      it('should handle zero consumption rate', () => {
        expect(calculateConsumption(10, 0)).toBe(0);
      });
    });
  });

  describe('Purity tests', () => {
    it('should not modify input objects in any action', () => {
      const originalVehicle = JSON.stringify(mockVehicle);

      // Test all actions
      consumeFuel(mockVehicle, 25);
      refuelVehicle(mockVehicle, 10);
      addFuel(mockVehicle, 15);
      setFuelLevel(mockVehicle, 50);
      emptyTank(mockVehicle);
      consumeFuelForDistance(mockVehicle, 5);

      expect(JSON.stringify(mockVehicle)).toBe(originalVehicle);
    });

    it('should always return new objects for state changes', () => {
      const result1 = consumeFuel(mockVehicle, 25);
      const result2 = refuelVehicle(mockVehicle, 10);

      expect(result1).not.toBe(mockVehicle);
      expect(result2).not.toBe(mockVehicle);
    });
  });

  describe('Export structure', () => {
    it('should export correct structure', () => {
      expect(fuelCore).toHaveProperty('actions');
      expect(fuelCore).toHaveProperty('guards');
      expect(fuelCore).toHaveProperty('selectors');
      expect(fuelCore).toHaveProperty('events');
      expect(fuelCore).toHaveProperty('utils');
    });

    it('should have all expected actions', () => {
      const { actions } = fuelCore;
      expect(actions).toHaveProperty('consumeFuel');
      expect(actions).toHaveProperty('refuelVehicle');
      expect(actions).toHaveProperty('addFuel');
      expect(actions).toHaveProperty('setFuelLevel');
      expect(actions).toHaveProperty('emptyTank');
      expect(actions).toHaveProperty('consumeFuelForDistance');
    });

    it('should have all expected guards', () => {
      const { guards } = fuelCore;
      expect(guards).toHaveProperty('canConsumeFuel');
      expect(guards).toHaveProperty('hasEnoughFuelForDistance');
      expect(guards).toHaveProperty('isCriticalFuel');
      expect(guards).toHaveProperty('isLowFuel');
      expect(guards).toHaveProperty('canRefuel');
      expect(guards).toHaveProperty('isFullTank');
    });
  });
});
