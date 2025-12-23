#!/usr/bin/env node

/**
 * ==========================================================================
 * Interactive Guard Validation Menu
 * ==========================================================================
 * 
 * Terminal CLI menu to:
 * 1. Select domain and guards to test
 * 2. Configure mock context (fuel, damage, resources, position)
 * 3. Execute guard tests
 * 4. Display formatted results
 * 
 * Usage: npm run validate-guards
 */

import inquirer from 'inquirer';
import {
    createCriticalVehicleContext,
    createHealthyVehicleContext,
    createMockFSMContext,
} from './validate-guards/context-fixtures.js';
import {
    getTestStats,
    testGuards
} from './validate-guards/guard-runner.js';
import {
    formatHeader,
    formatResultsTable,
    formatTestSummary,
} from './validate-guards/reporters.js';

/**
 * JavaScript implementations of pure guards (transpiled from guards.pure.ts)
 * These don't require TypeScript compilation
 */
const maintenanceGuards = {
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
      (resources.food ?? 0) +
      (resources.debris ?? 0) +
      (resources.special ?? 0);
    const hasResources = totalResources > 0;

    const damage = vehicle.damage ?? 0;
    const needsRepairs = damage > 50;

    const fuel = vehicle.fuel ?? 0;
    const needsFuel = fuel < 30;

    return !hasResources && !needsRepairs && !needsFuel;
  },
};

/**
 * JavaScript implementations of evaluation guards (transpiled from guards.pure.ts)
 */
const evaluationGuards = {
  shouldExplore: ({ context }) => {
    const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
    const MAX_EXPLORATIONS_PER_CYCLE = 2;
    
    if (exploredThisCycle > MAX_EXPLORATIONS_PER_CYCLE) {
      return false;
    }

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
    const FUEL_MAINTENANCE_THRESHOLD = 30;
    const DAMAGE_MAINTENANCE_THRESHOLD = 50;
    
    return fuel < FUEL_MAINTENANCE_THRESHOLD || damage > DAMAGE_MAINTENANCE_THRESHOLD;
  },
};

/**
 * JavaScript implementations of collection guards (transpiled from guards.pure.ts)
 */
const collectionGuards = {
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
};

/**
 * Guard registry: maps domain names to guard modules
 */
const GUARD_REGISTRY = {
  maintenance: {
    module: maintenanceGuards,
    guards: [
      'needsRefuel',
      'needsRepair',
      'needsDeposit',
      'isShipOnBase',
      'maintenanceComplete',
    ],
    description: '🔧 Maintenance domain guards (fuel, damage, resources)',
  },
  evaluation: {
    module: evaluationGuards,
    guards: [
      'shouldExplore',
      'shouldMaintain',
    ],
    description: '📊 Evaluation domain guards (exploration & maintenance decisions)',
  },
  collection: {
    module: collectionGuards,
    guards: [
      'canCollectTile',
      'isVehicleOverloaded',
      'shouldReturnToBase',
      'canContinueCollecting',
    ],
    description: '📦 Collection domain guards (resource gathering & capacity)',
  },
};


/**
 * Context scenario presets
 */
const CONTEXT_PRESETS = {
  healthy: {
    label: 'Healthy vehicle (all systems OK)',
    value: 'healthy',
    factory: createHealthyVehicleContext,
  },
  critical: {
    label: 'Critical condition (all systems failing)',
    value: 'critical',
    factory: createCriticalVehicleContext,
  },
  custom: {
    label: 'Custom context (configure values)',
    value: 'custom',
    factory: null,
  },
};

/**
 * Main menu flow
 */
async function main() {
  console.log('\n🚀 FSM Guard Validation Tool\n');

  try {
    // Step 1: Select domain
    const { domain } = await inquirer.prompt([
      {
        type: 'list',
        name: 'domain',
        message: 'Select domain to test:',
        choices: Object.entries(GUARD_REGISTRY).map(([key, config]) => ({
          name: `${config.description}`,
          value: key,
        })),
      },
    ]);

    const domainConfig = GUARD_REGISTRY[domain];

    // Step 2: Select guards
    const { selectedGuards } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedGuards',
        message: 'Select guards to test:',
        choices: domainConfig.guards.map((guardName) => ({
          name: guardName,
          value: guardName,
          checked: true, // All selected by default
        })),
        validate: (answer) => {
          if (answer.length === 0) {
            return 'Select at least one guard';
          }
          return true;
        },
      },
    ]);

    // Step 3: Select context scenario
    const { contextScenario } = await inquirer.prompt([
      {
        type: 'list',
        name: 'contextScenario',
        message: 'Select context scenario:',
        choices: Object.entries(CONTEXT_PRESETS).map(([key, preset]) => ({
          name: preset.label,
          value: key,
        })),
      },
    ]);

    // Step 4: Get context
    let mockContext;

    if (contextScenario === 'custom') {
      const contextAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'fuel',
          message: 'Vehicle fuel percentage (0-100):',
          default: '50',
          validate: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 0 || num > 100) {
              return 'Must be a number between 0 and 100';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'damage',
          message: 'Vehicle damage percentage (0-100):',
          default: '0',
          validate: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 0 || num > 100) {
              return 'Must be a number between 0 and 100';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'food',
          message: 'Food resources (0-800):',
          default: '0',
          validate: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 0 || num > 800) {
              return 'Must be a number between 0 and 800';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'debris',
          message: 'Debris resources (0-800):',
          default: '0',
          validate: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 0 || num > 800) {
              return 'Must be a number between 0 and 800';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'positionX',
          message: 'Ship position X:',
          default: '0',
          validate: (value) => {
            const num = parseFloat(value);
            return !isNaN(num) || 'Must be a number';
          },
        },
        {
          type: 'input',
          name: 'positionZ',
          message: 'Ship position Z:',
          default: '0',
          validate: (value) => {
            const num = parseFloat(value);
            return !isNaN(num) || 'Must be a number';
          },
        },
      ]);

      mockContext = createMockFSMContext({
        vehicle: {
          fuel: parseInt(contextAnswers.fuel),
          damage: parseInt(contextAnswers.damage),
          resources: {
            food: parseInt(contextAnswers.food),
            debris: parseInt(contextAnswers.debris),
            special: 0,
          },
          position: {
            x: parseFloat(contextAnswers.positionX),
            z: parseFloat(contextAnswers.positionZ),
          },
        },
      });
    } else {
      const preset = CONTEXT_PRESETS[contextScenario];
      mockContext = preset.factory();
    }

    // Step 5: Run tests
    console.log(formatHeader(domain, selectedGuards));

    const guardsToTest = selectedGuards.map((guardName) => [
      guardName,
      domainConfig.module[guardName],
    ]);

    const results = await testGuards(guardsToTest, mockContext, {});

    // Step 6: Display results
    console.log(formatResultsTable(results));

    const stats = getTestStats(results);
    console.log(formatTestSummary(stats));

    // Step 7: Offer next action
    const { nextAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'nextAction',
        message: 'What next?',
        choices: [
          { name: '▶️  Run another test', value: 'again' },
          { name: '📊 View context used', value: 'context' },
          { name: '🚪 Exit', value: 'exit' },
        ],
      },
    ]);

    if (nextAction === 'again') {
      // Restart
      console.clear();
      return main();
    } else if (nextAction === 'context') {
      console.log('\n📋 Context used for this test:\n');
      console.log(JSON.stringify(mockContext, null, 2));
      console.log('\n');
      return main();
    }

    // Exit
    console.log('\n👋 Goodbye!\n');
    process.exit(0);
  } catch (error) {
    if (error.isTtyError) {
      console.error('Prompt could not be rendered in the current environment');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

// Run main
main();
