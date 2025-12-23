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

console.log(''.padEnd(70, '-'));
console.log(`\n📊 Results: ${passed}/${total} passed (${((passed / total) * 100).toFixed(1)}%)\n`);

if (passed === total) {
  console.log('✅ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`❌ ${total - passed} test(s) failed\n`);
  process.exit(1);
}
