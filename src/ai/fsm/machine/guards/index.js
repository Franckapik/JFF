/**
 * FSM Guards - Central Export
 * Modular guards that reuse existing guards from shared/actions/core/
 * 
 * Organization:
 * - safety.js: Critical conditions (fuel, vehicle health, emergencies)
 * - efficiency.js: Resource management and optimization
 * - discovery.js: Exploration and pathfinding
 * - base.js: Base operations, docking, refueling
 */

import { safetyGuards } from './safety.js';
import { efficiencyGuards } from './efficiency.js';
import { discoveryGuards } from './discovery.js';
import { baseGuards } from './base.js';

// Export individual guard categories
export { safetyGuards } from './safety.js';
export { efficiencyGuards } from './efficiency.js';
export { discoveryGuards } from './discovery.js';
export { baseGuards } from './base.js';

/**
 * Combined guards object for easy access
 * Organized by category for better maintainability
 */
export const fsmGuards = {
  // Safety guards - Critical conditions
  safety: safetyGuards,
  
  // Efficiency guards - Resource optimization
  efficiency: efficiencyGuards,
  
  // Discovery guards - Exploration logic
  discovery: discoveryGuards,
  
  // Base guards - Base operations
  base: baseGuards
};

/**
 * Flattened guards for direct access
 * Use this when you need direct access to specific guards
 */
export const allGuards = {
  // Safety guards
  ...safetyGuards,
  
  // Efficiency guards  
  ...efficiencyGuards,
  
  // Discovery guards
  ...discoveryGuards,
  
  // Base guards
  ...baseGuards
};

/**
 * Guard categories for FSM states
 * Maps common FSM states to relevant guard categories
 */
export const guardsByState = {
  IDLE: [
    'shouldStayAtBase',
    'isReadyToLeaveBase',
    'needsToReturnToBase',
    'hasUnexploredAreas'
  ],
  
  EXPLORING: [
    'canContinueOperation',
    'shouldContinueExploration',
    'isCurrentExplorationValid',
    'needsEmergencyReturn'
  ],
  
  COLLECTING: [
    'isCollectionEfficient',
    'shouldCollectMore',
    'shouldReturnForEfficiency',
    'canContinueOperation'
  ],
  
  RETURNING: [
    'needsToReturnToBase',
    'isBaseReturnUrgent',
    'canMoveTo',
    'isMovementComplete'
  ],
  
  REFUELING: [
    'canRefuelAtCurrentLocation',
    'isFullTank',
    'isAtBase'
  ],
  
  DEPOSITING: [
    'canDepositAtCurrentLocation',
    'canDepositResources',
    'isAtBase'
  ]
};

/**
 * Helper function to get guards for a specific state
 * @param {string} stateName - The FSM state name
 * @returns {Object} Object containing relevant guards for the state
 */
export const getGuardsForState = (stateName) => {
  const relevantGuardNames = guardsByState[stateName] || [];
  const stateGuards = {};
  
  relevantGuardNames.forEach(guardName => {
    if (allGuards[guardName]) {
      stateGuards[guardName] = allGuards[guardName];
    }
  });
  
  return stateGuards;
};

/**
 * Helper function to check multiple guards at once
 * @param {Array} guardNames - Array of guard names to check
 * @param {Object} context - FSM context
 * @param {Object} event - FSM event
 * @returns {Object} Object with guard names as keys and boolean results as values
 */
export const checkMultipleGuards = (guardNames, context, event) => {
  const results = {};
  
  guardNames.forEach(guardName => {
    if (allGuards[guardName]) {
      results[guardName] = allGuards[guardName](context, event);
    } else {
      console.warn(`Guard '${guardName}' not found in allGuards`);
      results[guardName] = false;
    }
  });
  
  return results;
};

export default fsmGuards;
