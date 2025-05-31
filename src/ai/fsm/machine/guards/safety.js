/**
 * Safety Guards for FSM
 * Guards related to safety conditions: fuel, vehicle health, critical situations
 * Reuses existing guards from shared/actions/core/
 */

import { fuelGuards } from '../../../../shared/actions/core/fuel.js';
import { movementGuards } from '../../../../shared/actions/core/movement.js';

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
    return fuelGuards.isCriticalFuel(context, event) || 
           movementGuards.isVehicleCritical(context, event);
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
