#!/usr/bin/env node

/**
 * Quick Maintenance Guard Test (JavaScript - No TS Compilation)
 * 
 * Demonstrates guard testing without complex loaders.
 * For full interactive menu, compile TypeScript first: npm run build
 */

// Manual implementation of pure guards in JavaScript for quick testing
// These are transpiled versions of guards.pure.ts

const guards = {
  needsRefuel: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;
    const fuel = vehicle.fuel ?? 0;
    return fuel < 30;
  },

  needsRepair: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;
    const damage = vehicle.damage ?? 0;
    return damage > 50;
  },

  needsDeposit: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle || !vehicle.resources) return false;
    const resources = vehicle.resources;
    const totalResources =
      (resources.food ?? 0) +
      (resources.debris ?? 0) +
      (resources.special ?? 0);
    return totalResources > 0;
  },

  isShipOnBase: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle || !vehicle.position || !vehicle.basePosition) return false;
    const shipPos = vehicle.position;
    const basePos = vehicle.basePosition;
    const distance = Math.sqrt(
      Math.pow(shipPos.x - basePos.x, 2) +
        Math.pow(shipPos.z - basePos.z, 2)
    );
    return distance <= 1.0;
  },

  maintenanceComplete: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle) return true;

    const resources = vehicle.resources ?? { food: 0, debris: 0, special: 0 };
    const totalResources =
      (resources.food ?? 0) + (resources.debris ?? 0) + (resources.special ?? 0);
    const hasResources = totalResources > 0;

    const damage = vehicle.damage ?? 0;
    const needsRepairs = damage > 50;

    const fuel = vehicle.fuel ?? 0;
    const needsFuel = fuel < 30;

    return !hasResources && !needsRepairs && !needsFuel;
  },

  // Evaluation guards
  shouldExplore: ({ context }) => {
    const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
    const MAX_EXPLORATIONS_PER_CYCLE = 2;
    
    if (exploredThisCycle > MAX_EXPLORATIONS_PER_CYCLE) return false;

    const fuel = context.vehicle?.fuel ?? 0;
    const damage = context.vehicle?.damage ?? 0;
    const fuelThreshold = context.config?.fuelThreshold ?? 20;
    const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
    const DAMAGE_THRESHOLD = 80;
    
    if (fuel < fuelThreshold) return false;
    if (damage > DAMAGE_THRESHOLD) return false;
    if (isAtCapacity) return false;
    
    return true;
  },

  shouldMaintain: ({ context }) => {
    const fuel = context.vehicle?.fuel ?? 100;
    const damage = context.vehicle?.damage ?? 0;
    return fuel < 30 || damage > 50;
  },

  // ✅ NEW: shouldCollect with Dependency Injection pattern
  shouldCollect: ({ context }) => {
    // ✅ PURE: Read injected data, not getState()
    const availableTiles = context.injectedData?.availableTiles;
    
    // Must have tiles available to collect
    if (!availableTiles || availableTiles.length === 0) return false;
    
    // Vehicle state checks
    const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
    const fuel = context.vehicle?.fuel ?? 0;
    const fuelThreshold = context.config?.fuelThreshold ?? 20;
    
    if (isAtCapacity) return false;
    if (fuel < fuelThreshold) return false;
    
    return true;
  },

  // Collection guards
  canCollectTile: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;
    
    const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
    const totalResources = Object.values(currentResources).reduce((sum, val) => sum + (val || 0), 0);
    
    const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
      ? (vehicle.maxCapacity?.total || 10)
      : Number(vehicle.maxCapacity) || 10;
    
    const hasCapacity = totalResources < maxCapacity;
    const hasEnoughFuel = (vehicle.fuel || 0) > 20;
    const isOperational = (vehicle.damage || 0) < 80;
    
    return hasCapacity && hasEnoughFuel && isOperational;
  },

  isVehicleOverloaded: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;
    
    const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
    const totalResources = Object.values(currentResources).reduce((sum, val) => sum + (val || 0), 0);
    
    const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
      ? (vehicle.maxCapacity?.total || 10)
      : Number(vehicle.maxCapacity) || 10;
    
    const threshold = maxCapacity * 0.8;
    return totalResources >= threshold;
  },

  shouldReturnToBase: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;
    
    const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
    const totalResources = currentResources.total || 0;
    
    const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
      ? (vehicle.maxCapacity?.total || 2003)
      : Number(vehicle.maxCapacity) || 2003;
    
    const capacityThreshold = maxCapacity * 0.8;
    const isNearFull = totalResources >= capacityThreshold;
    const hasLowFuel = (vehicle.fuel || 100) < 30;
    const hasDamage = (vehicle.damage || 0) > 70;
    
    return isNearFull || hasLowFuel || hasDamage;
  },

  canContinueCollecting: ({ context }) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;
    
    const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
    const totalResources = currentResources.total || 0;
    
    const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
      ? (vehicle.maxCapacity?.total || 2003)
      : Number(vehicle.maxCapacity) || 2003;
    
    const hasCapacity = totalResources < (maxCapacity * 0.8);
    const hasEnoughFuel = (vehicle.fuel || 0) > 30;
    const isOperational = (vehicle.damage || 0) < 70;
    
    return hasCapacity && hasEnoughFuel && isOperational;
  },

  // Initializing guards
  isVehiclePositionInitialized: ({ context }) => {
    const vehiclePos = context.vehicle?.position;
    return !!vehiclePos && 
           vehiclePos.x !== undefined && 
           vehiclePos.z !== undefined;
  },

  isDronePositionInitialized: ({ context }) => {
    const drones = context.droneFleet?.drones || {};
    const firstDrone = Object.values(drones)[0];
    const dronePos = firstDrone?.position;
    return !!dronePos && 
           dronePos.x !== undefined && 
           dronePos.z !== undefined;
  },

  isBasePositionInitialized: ({ context }) => {
    const basePos = context.vehicle?.basePosition;
    return !!basePos && 
           basePos.x !== undefined && 
           basePos.z !== undefined;
  },

  areAllEntitiesInitialized: ({ context }) => {
    const vehiclePos = context.vehicle?.position;
    const vehicleInit = !!vehiclePos && vehiclePos.x !== undefined && vehiclePos.z !== undefined;
    
    const drones = context.droneFleet?.drones || {};
    const firstDrone = Object.values(drones)[0];
    const dronePos = firstDrone?.position;
    const droneInit = !!dronePos && dronePos.x !== undefined && dronePos.z !== undefined;
    
    const basePos = context.vehicle?.basePosition;
    const baseInit = !!basePos && basePos.x !== undefined && basePos.z !== undefined;
    
    return vehicleInit && droneInit && baseInit;
  },
};

// Mock context factory
function createMockContext(overrides = {}) {
  return {
    vehicle: {
      fuel: 50,
      damage: 0,
      position: { x: 0, z: 0 },
      basePosition: { x: 0, z: 0 },
      resources: { food: 0, debris: 0, special: 0 },
      ...overrides.vehicle,
    },
    ...overrides,
  };
}

// Test runner
function runGuardTest(name, guardFn, context, expected) {
  try {
    const result = guardFn({ context });
    const passed = result === expected;
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(
      `${status} | ${name.padEnd(25)} | Result: ${String(result).padEnd(5)} | Expected: ${String(expected).padEnd(5)}`
    );
    return passed;
  } catch (error) {
    console.log(`❌ ERROR | ${name.padEnd(25)} | ${error.message}`);
    return false;
  }
}

// Main test suite
console.log('\n🧪 MAINTENANCE GUARD QUICK TESTS\n');
console.log(
  'Status | Guard Name                | Result | Expected'
);
console.log(''.padEnd(70, '-'));

let passed = 0;
let total = 0;

// Test 1: needsRefuel - Low fuel
total++;
if (
  runGuardTest(
    'needsRefuel (low fuel)',
    guards.needsRefuel,
    createMockContext({ vehicle: { fuel: 20 } }),
    true
  )
)
  passed++;

// Test 2: needsRefuel - High fuel
total++;
if (
  runGuardTest(
    'needsRefuel (high fuel)',
    guards.needsRefuel,
    createMockContext({ vehicle: { fuel: 50 } }),
    false
  )
)
  passed++;

// Test 3: needsRepair - High damage
total++;
if (
  runGuardTest(
    'needsRepair (high damage)',
    guards.needsRepair,
    createMockContext({ vehicle: { damage: 75 } }),
    true
  )
)
  passed++;

// Test 4: needsRepair - Low damage
total++;
if (
  runGuardTest(
    'needsRepair (low damage)',
    guards.needsRepair,
    createMockContext({ vehicle: { damage: 30 } }),
    false
  )
)
  passed++;

// Test 5: needsDeposit - Has resources
total++;
if (
  runGuardTest(
    'needsDeposit (has resources)',
    guards.needsDeposit,
    createMockContext({ vehicle: { resources: { food: 100, debris: 0, special: 0 } } }),
    true
  )
)
  passed++;

// Test 6: needsDeposit - No resources
total++;
if (
  runGuardTest(
    'needsDeposit (no resources)',
    guards.needsDeposit,
    createMockContext({ vehicle: { resources: { food: 0, debris: 0, special: 0 } } }),
    false
  )
)
  passed++;

// Test 7: isShipOnBase - At base
total++;
if (
  runGuardTest(
    'isShipOnBase (at base)',
    guards.isShipOnBase,
    createMockContext({
      vehicle: {
        position: { x: 0.5, z: 0.5 },
        basePosition: { x: 0, z: 0 },
      },
    }),
    true
  )
)
  passed++;

// Test 8: isShipOnBase - Far from base
total++;
if (
  runGuardTest(
    'isShipOnBase (far from base)',
    guards.isShipOnBase,
    createMockContext({
      vehicle: {
        position: { x: 100, z: 100 },
        basePosition: { x: 0, z: 0 },
      },
    }),
    false
  )
)
  passed++;

// Test 9: maintenanceComplete - All OK
total++;
if (
  runGuardTest(
    'maintenanceComplete (all OK)',
    guards.maintenanceComplete,
    createMockContext({
      vehicle: {
        fuel: 50,
        damage: 0,
        resources: { food: 0, debris: 0, special: 0 },
      },
    }),
    true
  )
)
  passed++;

// Test 10: maintenanceComplete - Has issues
total++;
if (
  runGuardTest(
    'maintenanceComplete (low fuel)',
    guards.maintenanceComplete,
    createMockContext({
      vehicle: {
        fuel: 20,
        damage: 0,
        resources: { food: 0, debris: 0, special: 0 },
      },
    }),
    false
  )
)
  passed++;

console.log(''.padEnd(70, '-'));

// EVALUATION TESTS
console.log('\n🧪 EVALUATION GUARD TESTS\n');
console.log(
  'Status | Guard Name                | Result | Expected'
);
console.log(''.padEnd(70, '-'));

// Test 11: shouldExplore - Good conditions
total++;
if (
  runGuardTest(
    'shouldExplore (good conditions)',
    guards.shouldExplore,
    createMockContext({
      vehicle: { fuel: 50, damage: 20, isAtCapacity: false },
      config: { fuelThreshold: 20 },
      memory: { stats: { tilesExploredInCycle: 1 } },
    }),
    true
  )
)
  passed++;

// Test 12: shouldExplore - Low fuel
total++;
if (
  runGuardTest(
    'shouldExplore (low fuel)',
    guards.shouldExplore,
    createMockContext({
      vehicle: { fuel: 15, damage: 20, isAtCapacity: false },
      config: { fuelThreshold: 20 },
      memory: { stats: { tilesExploredInCycle: 1 } },
    }),
    false
  )
)
  passed++;

// Test 13: shouldExplore - Too many explorations
total++;
if (
  runGuardTest(
    'shouldExplore (cycle limit)',
    guards.shouldExplore,
    createMockContext({
      vehicle: { fuel: 50, damage: 20, isAtCapacity: false },
      config: { fuelThreshold: 20 },
      memory: { stats: { tilesExploredInCycle: 3 } },
    }),
    false
  )
)
  passed++;

// Test 14: shouldExplore - High damage
total++;
if (
  runGuardTest(
    'shouldExplore (high damage)',
    guards.shouldExplore,
    createMockContext({
      vehicle: { fuel: 50, damage: 85, isAtCapacity: false },
      config: { fuelThreshold: 20 },
      memory: { stats: { tilesExploredInCycle: 1 } },
    }),
    false
  )
)
  passed++;

// Test 15: shouldMaintain - Low fuel
total++;
if (
  runGuardTest(
    'shouldMaintain (low fuel)',
    guards.shouldMaintain,
    createMockContext({ vehicle: { fuel: 25, damage: 10 } }),
    true
  )
)
  passed++;

// Test 16: shouldMaintain - High damage
total++;
if (
  runGuardTest(
    'shouldMaintain (high damage)',
    guards.shouldMaintain,
    createMockContext({ vehicle: { fuel: 50, damage: 60 } }),
    true
  )
)
  passed++;

// Test 17: shouldMaintain - All good
total++;
if (
  runGuardTest(
    'shouldMaintain (all good)',
    guards.shouldMaintain,
    createMockContext({ vehicle: { fuel: 50, damage: 20 } }),
    false
  )
)
  passed++;

// =============================
// 🔍 DEPENDENCY INJECTION PATTERN - shouldCollect Tests (Tests 18-20)
// =============================
console.log(''.padEnd(70, '-'));
console.log('\n🔍 DEPENDENCY INJECTION PATTERN - shouldCollect Tests\n');
console.log(
  'Status | Guard Name                | Result | Expected'
);
console.log(''.padEnd(70, '-'));

// Test 18: shouldCollect - With injected tiles
total++;
if (
  runGuardTest(
    'shouldCollect (injected tiles)',
    guards.shouldCollect,
    createMockContext({
      vehicle: { fuel: 50, isAtCapacity: false },
      config: { fuelThreshold: 20 },
      injectedData: {
        availableTiles: [{ coord: { x: 1, z: 1 } }],
        injectedAt: Date.now(),
      },
    }),
    true
  )
)
  passed++;

// Test 19: shouldCollect - No injected tiles
total++;
if (
  runGuardTest(
    'shouldCollect (no tiles)',
    guards.shouldCollect,
    createMockContext({
      vehicle: { fuel: 50, isAtCapacity: false },
      config: { fuelThreshold: 20 },
      injectedData: { availableTiles: [], injectedAt: Date.now() },
    }),
    false
  )
)
  passed++;

// Test 20: shouldCollect - No injection (deferred to Phase 2)
total++;
if (
  runGuardTest(
    'shouldCollect (no injection)',
    guards.shouldCollect,
    createMockContext({
      vehicle: { fuel: 50, isAtCapacity: false },
      config: { fuelThreshold: 20 },
      // injectedData intentionally missing
    }),
    false
  )
)
  passed++;

console.log(''.padEnd(70, '-'));

// =============================
// COLLECTION GUARD TESTS (Tests 21-30)
// =============================
console.log('\n🧪 COLLECTION GUARD TESTS\n');
console.log(
  'Status | Guard Name                | Result | Expected'
);
console.log(''.padEnd(70, '-'));

// Test 21: canCollectTile - Good conditions
total++;
if (
  runGuardTest(
    'canCollectTile (good)',
    guards.canCollectTile,
    createMockContext({
      vehicle: {
        fuel: 50,
        damage: 20,
        resources: { food: 0, debris: 0, special: 0 },
        maxCapacity: 100,
      },
    }),
    true
  )
)
  passed++;

// Test 22: canCollectTile - Low fuel
total++;
if (
  runGuardTest(
    'canCollectTile (low fuel)',
    guards.canCollectTile,
    createMockContext({
      vehicle: {
        fuel: 15,
        damage: 20,
        resources: { food: 0, debris: 0, special: 0 },
        maxCapacity: 100,
      },
    }),
    false
  )
)
  passed++;

// Test 23: canCollectTile - High damage
total++;
if (
  runGuardTest(
    'canCollectTile (high damage)',
    guards.canCollectTile,
    createMockContext({
      vehicle: {
        fuel: 50,
        damage: 85,
        resources: { food: 0, debris: 0, special: 0 },
        maxCapacity: 100,
      },
    }),
    false
  )
)
  passed++;

// Test 24: canCollectTile - At capacity
total++;
if (
  runGuardTest(
    'canCollectTile (at capacity)',
    guards.canCollectTile,
    createMockContext({
      vehicle: {
        fuel: 50,
        damage: 20,
        resources: { food: 50, debris: 50, special: 0 },
        maxCapacity: 100,
      },
    }),
    false
  )
)
  passed++;

// Test 25: isVehicleOverloaded - Below threshold
total++;
if (
  runGuardTest(
    'isVehicleOverloaded (50%)',
    guards.isVehicleOverloaded,
    createMockContext({
      vehicle: {
        resources: { food: 50, debris: 0, special: 0 },
        maxCapacity: 100,
      },
    }),
    false
  )
)
  passed++;

// Test 26: isVehicleOverloaded - At 80%
total++;
if (
  runGuardTest(
    'isVehicleOverloaded (80%)',
    guards.isVehicleOverloaded,
    createMockContext({
      vehicle: {
        resources: { food: 80, debris: 0, special: 0 },
        maxCapacity: 100,
      },
    }),
    true
  )
)
  passed++;

// Test 27: shouldReturnToBase - Low fuel
total++;
if (
  runGuardTest(
    'shouldReturnToBase (low fuel)',
    guards.shouldReturnToBase,
    createMockContext({
      vehicle: {
        fuel: 20,
        damage: 0,
        resources: { food: 0, debris: 0, special: 0, total: 0 },
        maxCapacity: 2003,
      },
    }),
    true
  )
)
  passed++;

// Test 28: shouldReturnToBase - High damage
total++;
if (
  runGuardTest(
    'shouldReturnToBase (high damage)',
    guards.shouldReturnToBase,
    createMockContext({
      vehicle: {
        fuel: 50,
        damage: 75,
        resources: { food: 0, debris: 0, special: 0, total: 0 },
        maxCapacity: 2003,
      },
    }),
    true
  )
)
  passed++;

// Test 29: shouldReturnToBase - Near full
total++;
if (
  runGuardTest(
    'shouldReturnToBase (near full)',
    guards.shouldReturnToBase,
    createMockContext({
      vehicle: {
        fuel: 50,
        damage: 0,
        resources: { food: 0, debris: 0, special: 0, total: 1700 },
        maxCapacity: 2003,
      },
    }),
    true
  )
)
  passed++;

// Test 30: canContinueCollecting - All good
total++;
if (
  runGuardTest(
    'canContinueCollecting (good)',
    guards.canContinueCollecting,
    createMockContext({
      vehicle: {
        fuel: 50,
        damage: 20,
        resources: { food: 0, debris: 0, special: 0, total: 500 },
        maxCapacity: 2003,
      },
    }),
    true
  )
)
  passed++;

console.log(''.padEnd(70, '-'));

// =============================
// INITIALIZING GUARD TESTS (Tests 31-37)
// =============================
console.log('\n🧪 INITIALIZING GUARD TESTS\n');
console.log(
  'Status | Guard Name                | Result | Expected'
);
console.log(''.padEnd(70, '-'));

// Test 31: isVehiclePositionInitialized - Valid position
total++;
if (
  runGuardTest(
    'isVehiclePositionInitialized (valid)',
    guards.isVehiclePositionInitialized,
    createMockContext({
      vehicle: {
        position: { x: 10, z: 20 },
      },
    }),
    true
  )
)
  passed++;

// Test 32: isVehiclePositionInitialized - Missing position
total++;
if (
  runGuardTest(
    'isVehiclePositionInitialized (missing)',
    guards.isVehiclePositionInitialized,
    createMockContext({
      vehicle: {},
    }),
    false
  )
)
  passed++;

// Test 33: isDronePositionInitialized - Valid drone
total++;
if (
  runGuardTest(
    'isDronePositionInitialized (valid)',
    guards.isDronePositionInitialized,
    createMockContext({
      droneFleet: {
        drones: {
          explorer: { position: { x: 5, z: 15 } },
        },
      },
    }),
    true
  )
)
  passed++;

// Test 34: isDronePositionInitialized - No drones
total++;
if (
  runGuardTest(
    'isDronePositionInitialized (no drones)',
    guards.isDronePositionInitialized,
    createMockContext({
      droneFleet: { drones: {} },
    }),
    false
  )
)
  passed++;

// Test 35: isBasePositionInitialized - Valid base
total++;
if (
  runGuardTest(
    'isBasePositionInitialized (valid)',
    guards.isBasePositionInitialized,
    createMockContext({
      vehicle: {
        basePosition: { x: 0, z: 0 },
      },
    }),
    true
  )
)
  passed++;

// Test 36: isBasePositionInitialized - Missing base
total++;
if (
  runGuardTest(
    'isBasePositionInitialized (missing)',
    guards.isBasePositionInitialized,
    createMockContext({
      vehicle: {},
    }),
    false
  )
)
  passed++;

// Test 37: areAllEntitiesInitialized - All valid
total++;
if (
  runGuardTest(
    'areAllEntitiesInitialized (all valid)',
    guards.areAllEntitiesInitialized,
    createMockContext({
      vehicle: {
        position: { x: 10, z: 20 },
        basePosition: { x: 0, z: 0 },
      },
      droneFleet: {
        drones: {
          explorer: { position: { x: 5, z: 15 } },
        },
      },
    }),
    true
  )
)
  passed++;

console.log(''.padEnd(70, '-'));
console.log(`\n📊 Results: ${passed}/${total} passed (${((passed / total) * 100).toFixed(1)}%)\n`);

if (passed === total) {
  console.log('✅ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`❌ ${total - passed} test(s) failed\n`);
  process.exit(1);
}
