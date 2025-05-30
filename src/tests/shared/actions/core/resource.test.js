/**
 * ============================================================================
 * RESOURCE ACTIONS CORE - Tests unitaires
 * ============================================================================
 * 
 * Tests pour valider la pureté des fonctions de ressources, la gestion d'erreurs
 * et les transformations d'état correctes.
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import resourceCore from '../../../../shared/actions/core/resource.js';

// Destructurer les exports du module
const { actions, guards, selectors, events, utils, EMPTY_RESOURCES, DEFAULT_CAPACITY } = resourceCore;
const {
  collectResources,
  depositResources,
  addResources,
  clearResources,
  updateResources
} = actions;
const {
  canCollectResource,
  hasCapacityFor,
  isAtMaxCapacity,
  canDepositResources
} = guards;
const {
  getCurrentResources,
  getMaxCapacity,
  getRemainingCapacity,
  getCapacityPercentage,
  getResourceSummary
} = selectors;
const {
  resourcesCollectedEvent,
  resourcesDepositedEvent,
  capacityReachedEvent
} = events;
const {
  validateResourceTypes,
  normalizeResources
} = utils;

describe('Resource Actions Core', () => {
  let mockVehicle;
  let mockResources;
  let mockCapacity;

  beforeEach(() => {
    mockVehicle = {
      id: 'test-vehicle',
      type: 'drone',
      resources: { food: 20, debris: 150, special: 1 },
      maxCapacity: { food: 100, debris: 1000, special: 2 }
    };

    mockResources = { food: 30, debris: 100, special: 1 };
    mockCapacity = { food: 100, debris: 1000, special: 2 };
  });

  describe('Constants', () => {
    it('should have correct EMPTY_RESOURCES', () => {
      expect(EMPTY_RESOURCES).toEqual({ food: 0, debris: 0, special: 0 });
    });

    it('should have correct DEFAULT_CAPACITY', () => {
      expect(DEFAULT_CAPACITY).toEqual({ food: 100, debris: 1000, special: 2 });
    });
  });

  describe('Actions principales', () => {
    describe('collectResources', () => {
      it('should collect resources within capacity', () => {
        const resourcesToCollect = { food: 10, debris: 50, special: 1 };
        const result = collectResources(mockVehicle, resourcesToCollect);

        expect(result).toEqual({
          ...mockVehicle,
          resources: { food: 30, debris: 200, special: 2 }
        });
      });

      it('should limit collection to available capacity', () => {
        const excessiveResources = { food: 200, debris: 2000, special: 5 };
        const result = collectResources(mockVehicle, excessiveResources);

        expect(result).toEqual({
          ...mockVehicle,
          resources: { food: 100, debris: 1000, special: 2 }
        });
      });

      it('should handle partial resources', () => {
        const partialResources = { food: 10 };
        const result = collectResources(mockVehicle, partialResources);

        expect(result).toEqual({
          ...mockVehicle,
          resources: { food: 30, debris: 150, special: 1 }
        });
      });

      it('should not mutate original vehicle', () => {
        const originalVehicle = JSON.parse(JSON.stringify(mockVehicle));
        collectResources(mockVehicle, mockResources);
        expect(mockVehicle).toEqual(originalVehicle);
      });
    });

    describe('depositResources', () => {
      it('should empty all resources', () => {
        const result = depositResources(mockVehicle);

        expect(result).toEqual({
          ...mockVehicle,
          resources: EMPTY_RESOURCES
        });
      });

      it('should not mutate original vehicle', () => {
        const originalVehicle = JSON.parse(JSON.stringify(mockVehicle));
        depositResources(mockVehicle);
        expect(mockVehicle).toEqual(originalVehicle);
      });
    });

    describe('addResources', () => {
      it('should add resources correctly', () => {
        const current = { food: 10, debris: 100, special: 0 };
        const toAdd = { food: 5, debris: 50, special: 1 };
        const result = addResources(current, toAdd);

        expect(result).toEqual({ food: 15, debris: 150, special: 1 });
      });

      it('should handle missing properties', () => {
        const current = { food: 10 };
        const toAdd = { debris: 50 };
        const result = addResources(current, toAdd);

        expect(result).toEqual({ food: 10, debris: 50, special: 0 });
      });

      it('should not mutate inputs', () => {
        const current = { food: 10, debris: 100, special: 0 };
        const toAdd = { food: 5, debris: 50, special: 1 };
        const originalCurrent = { ...current };
        const originalToAdd = { ...toAdd };

        addResources(current, toAdd);

        expect(current).toEqual(originalCurrent);
        expect(toAdd).toEqual(originalToAdd);
      });
    });

    describe('clearResources', () => {
      it('should clear all resources', () => {
        const result = clearResources(mockVehicle);

        expect(result).toEqual({
          ...mockVehicle,
          resources: EMPTY_RESOURCES
        });
      });
    });

    describe('updateResources', () => {
      it('should update resources directly', () => {
        const newResources = { food: 50, debris: 500, special: 1 };
        const result = updateResources(mockVehicle, newResources);

        expect(result).toEqual({
          ...mockVehicle,
          resources: newResources
        });
      });

      it('should normalize resources', () => {
        const invalidResources = { food: -10, debris: null, special: undefined };
        const result = updateResources(mockVehicle, invalidResources);

        expect(result.resources.food).toBe(0);
        expect(result.resources.debris).toBe(0);
        expect(result.resources.special).toBe(0);
      });
    });
  });

  describe('Guards', () => {
    describe('canCollectResource', () => {
      it('should return true when capacity available', () => {
        const resourceToCollect = { food: 10, debris: 50, special: 1 };
        expect(canCollectResource(mockVehicle, resourceToCollect)).toBe(true);
      });

      it('should return false when at capacity', () => {
        const fullVehicle = {
          ...mockVehicle,
          resources: { food: 100, debris: 1000, special: 2 }
        };
        const resourceToCollect = { food: 1, debris: 1, special: 1 };
        expect(canCollectResource(fullVehicle, resourceToCollect)).toBe(false);
      });

      it('should handle partial capacity', () => {
        const partialResource = { food: 10 };
        expect(canCollectResource(mockVehicle, partialResource)).toBe(true);
      });
    });

    describe('hasCapacityFor', () => {
      it('should return true for specific resource type with capacity', () => {
        expect(hasCapacityFor(mockVehicle, 'food', 50)).toBe(true);
        expect(hasCapacityFor(mockVehicle, 'debris', 500)).toBe(true);
        expect(hasCapacityFor(mockVehicle, 'special', 1)).toBe(true);
      });

      it('should return false when no capacity', () => {
        expect(hasCapacityFor(mockVehicle, 'food', 100)).toBe(false);
        expect(hasCapacityFor(mockVehicle, 'special', 2)).toBe(false);
      });
    });

    describe('isAtMaxCapacity', () => {
      it('should return false for vehicle with space', () => {
        expect(isAtMaxCapacity(mockVehicle)).toBe(false);
      });

      it('should return true for full vehicle', () => {
        const fullVehicle = {
          ...mockVehicle,
          resources: { food: 100, debris: 1000, special: 2 }
        };
        expect(isAtMaxCapacity(fullVehicle)).toBe(true);
      });

      it('should return true if any resource at max', () => {
        const partiallyFullVehicle = {
          ...mockVehicle,
          resources: { food: 100, debris: 150, special: 1 }
        };
        expect(isAtMaxCapacity(partiallyFullVehicle)).toBe(true);
      });
    });

    describe('canDepositResources', () => {
      it('should return true for vehicle with resources', () => {
        expect(canDepositResources(mockVehicle)).toBe(true);
      });

      it('should return false for empty vehicle', () => {
        const emptyVehicle = {
          ...mockVehicle,
          resources: EMPTY_RESOURCES
        };
        expect(canDepositResources(emptyVehicle)).toBe(false);
      });
    });
  });

  describe('Selectors', () => {
    describe('getCurrentResources', () => {
      it('should return current resources', () => {
        const result = getCurrentResources(mockVehicle);
        expect(result).toEqual({ food: 20, debris: 150, special: 1 });
      });

      it('should handle missing resources', () => {
        const vehicleWithoutResources = { ...mockVehicle, resources: undefined };
        const result = getCurrentResources(vehicleWithoutResources);
        expect(result).toEqual(EMPTY_RESOURCES);
      });
    });

    describe('getMaxCapacity', () => {
      it('should return max capacity', () => {
        const result = getMaxCapacity(mockVehicle);
        expect(result).toEqual({ food: 100, debris: 1000, special: 2 });
      });

      it('should use default capacity when missing', () => {
        const vehicleWithoutCapacity = { ...mockVehicle, maxCapacity: undefined };
        const result = getMaxCapacity(vehicleWithoutCapacity);
        expect(result).toEqual(DEFAULT_CAPACITY);
      });
    });

    describe('getRemainingCapacity', () => {
      it('should calculate remaining capacity', () => {
        const result = getRemainingCapacity(mockVehicle);
        expect(result).toEqual({ food: 80, debris: 850, special: 1 });
      });
    });

    describe('getCapacityPercentage', () => {
      it('should calculate capacity percentage', () => {
        const result = getCapacityPercentage(mockVehicle);
        expect(result).toEqual({ food: 20, debris: 15, special: 50 });
      });

      it('should handle zero capacity', () => {
        const vehicleWithZeroCapacity = {
          ...mockVehicle,
          maxCapacity: { food: 0, debris: 0, special: 0 }
        };
        const result = getCapacityPercentage(vehicleWithZeroCapacity);
        expect(result).toEqual({ food: 0, debris: 0, special: 0 });
      });
    });

    describe('getResourceSummary', () => {
      it('should return complete resource summary', () => {
        const result = getResourceSummary(mockVehicle);

        expect(result).toMatchObject({
          current: { food: 20, debris: 150, special: 1 },
          capacity: { food: 100, debris: 1000, special: 2 },
          remaining: { food: 80, debris: 850, special: 1 },
          percentage: { food: 20, debris: 15, special: 50 },
          totalItems: 171,
          hasResources: true,
          atCapacity: false
        });
      });
    });
  });

  describe('Events', () => {
    describe('resourcesCollectedEvent', () => {
      it('should create correct event structure', () => {
        const collected = { food: 10, debris: 50, special: 1 };
        const event = resourcesCollectedEvent(mockVehicle, collected);

        expect(event).toMatchObject({
          type: 'RESOURCES_COLLECTED',
          payload: {
            vehicleId: 'test-vehicle',
            collected: { food: 10, debris: 50, special: 1 },
            newTotal: { food: 30, debris: 200, special: 2 }
          }
        });
        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });

    describe('resourcesDepositedEvent', () => {
      it('should create correct event structure', () => {
        const event = resourcesDepositedEvent(mockVehicle);

        expect(event).toMatchObject({
          type: 'RESOURCES_DEPOSITED',
          payload: {
            vehicleId: 'test-vehicle',
            deposited: { food: 20, debris: 150, special: 1 }
          }
        });
        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });

    describe('capacityReachedEvent', () => {
      it('should create correct event structure', () => {
        const event = capacityReachedEvent(mockVehicle, 'food');

        expect(event).toMatchObject({
          type: 'CAPACITY_REACHED',
          payload: {
            vehicleId: 'test-vehicle',
            resourceType: 'food'
          }
        });
        expect(event.payload.timestamp).toBeTypeOf('number');
      });
    });
  });

  describe('Utils', () => {
    describe('validateResourceTypes', () => {
      it('should validate correct resource structure', () => {
        const validResources = { food: 10, debris: 50, special: 1 };
        expect(() => validateResourceTypes(validResources)).not.toThrow();
      });

      it('should throw for invalid properties', () => {
        const invalidResources = { food: 10, invalidProp: 50 };
        expect(() => validateResourceTypes(invalidResources))
          .toThrow('Invalid resource type: invalidProp');
      });

      it('should throw for negative values', () => {
        const negativeResources = { food: -10, debris: 50, special: 1 };
        expect(() => validateResourceTypes(negativeResources))
          .toThrow('Resource amounts must be non-negative');
      });
    });

    describe('normalizeResources', () => {
      it('should normalize complete resources', () => {
        const result = normalizeResources({ food: 10, debris: 50, special: 1 });
        expect(result).toEqual({ food: 10, debris: 50, special: 1 });
      });

      it('should add missing properties', () => {
        const result = normalizeResources({ food: 10 });
        expect(result).toEqual({ food: 10, debris: 0, special: 0 });
      });

      it('should handle null/undefined values', () => {
        const result = normalizeResources({ food: null, debris: undefined, special: 1 });
        expect(result).toEqual({ food: 0, debris: 0, special: 1 });
      });

      it('should convert negative to zero', () => {
        const result = normalizeResources({ food: -10, debris: 50, special: -1 });
        expect(result).toEqual({ food: 0, debris: 50, special: 0 });
      });
    });
  });

  describe('Purity tests', () => {
    it('should not modify input objects in any action', () => {
      const originalVehicle = JSON.stringify(mockVehicle);
      const originalResources = JSON.stringify(mockResources);

      // Test all actions
      collectResources(mockVehicle, mockResources);
      depositResources(mockVehicle);
      addResources(mockVehicle.resources, mockResources);
      clearResources(mockVehicle);
      updateResources(mockVehicle, mockResources);

      expect(JSON.stringify(mockVehicle)).toBe(originalVehicle);
      expect(JSON.stringify(mockResources)).toBe(originalResources);
    });

    it('should always return new objects for state changes', () => {
      const result1 = collectResources(mockVehicle, mockResources);
      const result2 = depositResources(mockVehicle);

      expect(result1).not.toBe(mockVehicle);
      expect(result2).not.toBe(mockVehicle);
      expect(result1.resources).not.toBe(mockVehicle.resources);
    });
  });

  describe('Export structure', () => {
    it('should export correct structure', () => {
      expect(resourceCore).toHaveProperty('actions');
      expect(resourceCore).toHaveProperty('guards');
      expect(resourceCore).toHaveProperty('selectors');
      expect(resourceCore).toHaveProperty('events');
      expect(resourceCore).toHaveProperty('utils');
    });

    it('should have all expected actions', () => {
      const { actions } = resourceCore;
      expect(actions).toHaveProperty('collectResources');
      expect(actions).toHaveProperty('depositResources');
      expect(actions).toHaveProperty('addResources');
      expect(actions).toHaveProperty('clearResources');
      expect(actions).toHaveProperty('updateResources');
    });

    it('should have all expected guards', () => {
      const { guards } = resourceCore;
      expect(guards).toHaveProperty('canCollectResource');
      expect(guards).toHaveProperty('hasCapacityFor');
      expect(guards).toHaveProperty('isAtMaxCapacity');
      expect(guards).toHaveProperty('canDepositResources');
    });
  });
});
