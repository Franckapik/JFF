/**
 * Safety Guards for FSM
 * Guards related to safety conditions: fuel, vehicle health, critical situations
 * 🔄 REFACTORED: Now imports from ./core/ instead of ../actions/
 */

import fsmLogger from '../../../../logger/fsmLogger.js';
import { fuelGuards } from './core/fuelGuard.js';
import { movementGuards } from './core/movementGuard.js';

/**
 * Safety guards - Critical conditions that require immediate attention
 */
export const safetyGuards = {
  // Fuel safety guards
  isLowFuel: fuelGuards.isLowFuel,
  isCriticalFuel: fuelGuards.isCriticalFuel,
  hasEnoughFuelForDistance: fuelGuards.hasEnoughFuelForDistance,
  canConsumeFuel: fuelGuards.canConsumeFuel,

  // Vehicle health safety guards
  isVehicleCritical: movementGuards.isVehicleCritical,
  isVehicleOperational: movementGuards.isVehicleOperational,
  hasEnoughFuel: movementGuards.hasEnoughFuel,

  // Emergency conditions
  needsEmergencyReturn: (context, event) => {
    const isCritical = fuelGuards.isCriticalFuel(context, event);
    const isVehicleCritical = movementGuards.isVehicleCritical(context, event);

    return isCritical || isVehicleCritical;
  },

  // Safety checks for operations
  isSafeToOperate: (context, event) => {
    return movementGuards.isVehicleOperational(context, event) &&
           !fuelGuards.isCriticalFuel(context, event);
  },

  // Check if vehicle can safely continue current operation
  canContinueOperation: (context, event) => {
    return fuelGuards.hasEnoughFuelForDistance(context, event) &&
           movementGuards.isVehicleOperational(context, event);
  }
};

export default safetyGuards;
