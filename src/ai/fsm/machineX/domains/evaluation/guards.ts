/**
 * ==========================================================================
 * EVALUATION DOMAIN - Guards (conditions)
 * ==========================================================================
 * 
 * CONVENTION : should[Action]
 * Guards pour les conditions de transition dans le domaine d'évaluation
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { XStateV5Guard } from '../../../../../types/xstate.v5.types';

/**
 * Générateur de guards typés avec log automatique
 */
function createGuard(
  name: string,
  fn: (args: Parameters<XStateV5Guard>[0]) => boolean
): XStateV5Guard {
  return (args) => {
    const result = fn(args);
    fsmLogger.condition(`[GUARD] ${name}: ${result}`, { context: args.context, event: args.event });
    return result;
  };
}

/**
 * Guard principal pour déterminer si l'exploration est nécessaire
 */
export const shouldExplore = createGuard('shouldExplore', ({ context }) => {
  if (context.vehicle.fuel < context.config.fuelThreshold) return false;
  if (context.vehicle.damage > 80) return false;
  if (context.vehicle.isAtCapacity) return false;
  const isDroneAvailable = context.droneFleet?.drones?.explorer?.state === 'docked';
  return isDroneAvailable;
});

/**
 * Guard pour déterminer si la collecte est nécessaire
 */
export const shouldCollect = createGuard('shouldCollect', ({ context }) => {
  return context.selectedTileForCollection !== null && 
         !context.vehicle.isAtCapacity &&
         context.vehicle.fuel > context.config.fuelThreshold;
});

/**
 * Guard pour déterminer si la maintenance est nécessaire
 */
export const shouldMaintain = createGuard('shouldMaintain', ({ context }) => {
  const fuel = context.vehicle?.fuel || 100;
  const damage = context.vehicle?.damage || 0;
  return fuel < 30 || damage > 50;
});
