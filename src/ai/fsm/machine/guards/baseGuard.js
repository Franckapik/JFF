/**
 * Base Guards for FSM
 * Guards related to base operations, location, refueling, and docking
 * 🔄 REFACTORED: Now imports from ./core/ instead of ../actions/
 */

import { movementGuards } from './core/movementGuard.js';
import { fuelGuards } from './core/fuelGuard.js';
import { resourceGuards } from './core/resourcesGuard.js';
import fsmLogger from '../../../../logger/fsmLogger.js';

/**
 * Base guards - Operations related to base and docking
 */
export const baseGuards = {
  // Movement and location guards
  hasValidTarget: movementGuards.hasValidTarget,
  canMoveTo: movementGuards.canMoveTo,
  isMovementComplete: movementGuards.isMovementComplete,

  // Fuel and refueling guards
  canRefuel: fuelGuards.canRefuel,
  isFullTank: fuelGuards.isFullTank,

  // Resource management at base
  canDepositResources: resourceGuards.canDepositResources,

  // Base location checks
  isAtBase: (context, event) => {
    // Check if current position matches base position
    const { vehicle } = context;
    const basePosition = vehicle?.basePosition || { x: 0, y: 0 };
    const currentPosition = vehicle?.position || { x: 0, y: 0 };

    fsmLogger.error(`Checking if at base:
      Base Position: ${JSON.stringify(basePosition)},
      Current Position: ${JSON.stringify(currentPosition)}`);
    
    return currentPosition.x === basePosition.x && 
           currentPosition.y === basePosition.y;
  },

  // Check if vehicle needs to return to base
  needsToReturnToBase: (context, event) => {
    return fuelGuards.isLowFuel(context, event) ||
           resourceGuards.isAtMaxCapacity(context, event);
  },

  // Check if can perform base operations
  canPerformBaseOperations: (context, event) => {
    return baseGuards.isAtBase(context, event);
  },

  // Check if refueling is available at current location
  canRefuelAtCurrentLocation: (context, event) => {
    return baseGuards.isAtBase(context, event) && 
           fuelGuards.canRefuel(context, event);
  },

  // Check if can deposit resources at current location
  canDepositAtCurrentLocation: (context, event) => {
    return baseGuards.isAtBase(context, event) && 
           resourceGuards.canDepositResources(context, event);
  },

  // Check if should stay at base
  shouldStayAtBase: (context, event) => {
    return (!fuelGuards.isFullTank(context, event) && fuelGuards.canRefuel(context, event)) ||
           (resourceGuards.canDepositResources(context, event));
  },

  // Check if ready to leave base
  isReadyToLeaveBase: (context, event) => {
    return fuelGuards.isFullTank(context, event) &&
           !resourceGuards.canDepositResources(context, event);
  },

  // Check if base return is urgent
  isBaseReturnUrgent: (context, event) => {
    return fuelGuards.isCriticalFuel(context, event) ||
           movementGuards.isVehicleCritical(context, event);
  },
  
  // Check if vehicle needs refueling
  needsRefueling: (context, event) => {
    const fuel = context.vehicle?.fuel || 0;
    return fuel < 100 && baseGuards.isAtBase(context, event);
  }
};

export default baseGuards;
