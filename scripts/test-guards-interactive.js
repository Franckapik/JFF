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
  createMockFSMContext,
  createHealthyVehicleContext,
  createCriticalVehicleContext,
} from './validate-guards/context-fixtures.js';
import {
  testGuard,
  testGuards,
  getTestStats,
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
  // evaluation: { /* deferred to step 6 */ },
  // collection: { /* deferred to step 6 */ },
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
