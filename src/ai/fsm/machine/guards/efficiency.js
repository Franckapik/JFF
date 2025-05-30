/**
 * Efficiency Guards for FSM
 * Guards related to resource management, capacity optimization, and efficiency
 * Reuses existing guards from shared/actions/core/
 */

import { resourceGuards } from '../../../../shared/actions/core/resources.js';
import { fuelGuards } from '../../../../shared/actions/core/fuel.js';
import { movementGuards } from '../../../../shared/actions/core/movement.js';

/**
 * Efficiency guards - Optimize resource collection and management
 */
export const efficiencyGuards = {
  // Resource capacity guards
  hasCapacityFor: resourceGuards.hasCapacityFor,
  isAtMaxCapacity: resourceGuards.isAtMaxCapacity,
  canCollectResource: resourceGuards.canCollectResource,
  canDepositResources: resourceGuards.canDepositResources,

  // Fuel efficiency guards
  isFullTank: fuelGuards.isFullTank,
  canRefuel: fuelGuards.canRefuel,

  // Movement efficiency guards
  isMovementComplete: movementGuards.isMovementComplete,

  // Efficiency optimization checks
  shouldCollectMore: (context, event) => {
    return !resourceGuards.isAtMaxCapacity(context, event) &&
           !fuelGuards.isLowFuel(context, event);
  },

  // Check if it's efficient to continue collecting
  isCollectionEfficient: (context, event) => {
    return resourceGuards.hasCapacityFor(context, event) &&
           fuelGuards.hasEnoughFuelForDistance(context, event);
  },

  // Check if vehicle should return to base for efficiency
  shouldReturnForEfficiency: (context, event) => {
    return resourceGuards.isAtMaxCapacity(context, event) ||
           fuelGuards.isLowFuel(context, event);
  },

  // Check if refueling is needed for efficiency
  needsRefuelForEfficiency: (context, event) => {
    return fuelGuards.isLowFuel(context, event) && 
           fuelGuards.canRefuel(context, event);
  },

  // Check if inventory management is needed
  needsInventoryManagement: (context, event) => {
    return resourceGuards.isAtMaxCapacity(context, event);
  }
};

export default efficiencyGuards;
