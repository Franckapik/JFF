/**
 * ==========================================================================
 * FSM Context Fixtures - Mock FSMContext for Guard Testing
 * ==========================================================================
 * 
 * Factory functions to create realistic mock FSMContext objects for testing
 * guards in Node.js without R3F, Zustand, or React dependencies.
 */

/**
 * Create a minimal valid FSMContext with sensible defaults
 * 
 * @param overrides Partial context to override defaults
 * @returns Complete FSMContext object
 * 
 * @example
 * // Healthy vehicle
 * const ctx = createMockFSMContext();
 * 
 * // Low fuel
 * const ctx = createMockFSMContext({ vehicle: { fuel: 20 } });
 * 
 * // Damaged and full
 * const ctx = createMockFSMContext({
 *   vehicle: { damage: 75, resources: { food: 1000, debris: 500, special: 200 } }
 * });
 */
export function createMockFSMContext(overrides = {}) {
  const defaultContext = {
    entityId: 'test-bot-001',
    vehicle: {
      id: 'ship-001',
      fuel: 50,
      damage: 0,
      position: { x: 0, z: 0 },
      basePosition: { x: 0, z: 0 },
      resources: {
        food: 0,
        debris: 0,
        special: 0,
      },
      maxCapacity: {
        total: 2000,
        food: 800,
        debris: 800,
        special: 400,
      },
      isAtCapacity: false,
    },
    config: {
      fuelThreshold: 30,
      capacityThreshold: 80,
      repairThreshold: 50,
    },
    state: 'idle',
    lastAction: null,
    timestamp: Date.now(),
  };

  // Deep merge overrides
  return mergeDeep(defaultContext, overrides);
}

/**
 * Create a context for testing low fuel scenarios
 */
export function createLowFuelContext(fuelPercent = 20) {
  return createMockFSMContext({
    vehicle: { fuel: fuelPercent },
  });
}

/**
 * Create a context for testing high damage scenarios
 */
export function createHighDamageContext(damagePercent = 75) {
  return createMockFSMContext({
    vehicle: { damage: damagePercent },
  });
}

/**
 * Create a context for testing cargo scenarios
 */
export function createFullCargoContext() {
  return createMockFSMContext({
    vehicle: {
      resources: {
        food: 800,
        debris: 800,
        special: 400,
      },
      isAtCapacity: true,
    },
  });
}

/**
 * Create a context for testing ship at base
 */
export function createShipAtBaseContext() {
  return createMockFSMContext({
    vehicle: {
      position: { x: 0.1, z: 0.1 },
      basePosition: { x: 0, z: 0 },
    },
  });
}

/**
 * Create a context for testing ship away from base
 */
export function createShipAwayFromBaseContext(distanceX = 10, distanceZ = 10) {
  return createMockFSMContext({
    vehicle: {
      position: { x: distanceX, z: distanceZ },
      basePosition: { x: 0, z: 0 },
    },
  });
}

/**
 * Create a healthy maintenance scenario (all systems OK)
 */
export function createHealthyVehicleContext() {
  return createMockFSMContext({
    vehicle: {
      fuel: 75,
      damage: 10,
      resources: { food: 0, debris: 0, special: 0 },
      position: { x: 0, z: 0 },
      basePosition: { x: 0, z: 0 },
    },
  });
}

/**
 * Create a critical maintenance scenario (all systems failing)
 */
export function createCriticalVehicleContext() {
  return createMockFSMContext({
    vehicle: {
      fuel: 15,
      damage: 80,
      resources: { food: 500, debris: 300, special: 100 },
      position: { x: 100, z: 100 },
      basePosition: { x: 0, z: 0 },
    },
  });
}

/**
 * Recursively merge two objects, giving precedence to the second object
 */
function mergeDeep(target, source) {
  if (!source) return target;

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = mergeDeep(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}
