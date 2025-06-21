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
    const basePosition = vehicle?.basePosition;
    const currentPosition = vehicle?.position;

    if (!basePosition || !currentPosition) {
      fsmLogger.error(`❌ [isAtBase] Missing positions:`, {
        hasBasePosition: !!basePosition,
        hasCurrentPosition: !!currentPosition,
        basePosition,
        currentPosition
      });
      return false;
    }

    // 🎯 CALCUL DE DISTANCE avec tolérance
    const distance = Math.sqrt(
      Math.pow(currentPosition.x - basePosition.x, 2) + 
      Math.pow(currentPosition.z - basePosition.z, 2)
    );
    
    const tolerance = 1.0; // Tolérance d'1 unité pour considérer "à la base"
    const isAtBase = distance <= tolerance;

    fsmLogger.info(`🏠 [isAtBase] Check:`, {
      basePosition,
      currentPosition,
      distance: distance.toFixed(2),
      tolerance,
      result: isAtBase
    });
    
    return isAtBase;
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
