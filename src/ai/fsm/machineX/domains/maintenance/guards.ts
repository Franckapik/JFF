/**
 * ==========================================================================
 * MAINTENANCE DOMAIN - Guards
 * ==========================================================================
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
    fsmLogger.condition(`[GUARD] ${name}: ${result}`, { context: args.context });
    return result;
  };
}

/**
 * Guard pour vérifier si le vaisseau a des ressources à déposer
 */
export const needsDeposit = createGuard('needsDeposit', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle || !vehicle.resources) {
    return false;
  }

  const resources = vehicle.resources;
  const totalResources = (resources.food || 0) + (resources.debris || 0) + (resources.special || 0);
  
  const hasResources = totalResources > 0;
  
  fsmLogger.info(`💰 [needsDeposit] Vehicle resource status:`, {
    resources,
    totalResources,
    hasResources
  });
  
  return hasResources;
});

/**
 * Guard pour vérifier si le vaisseau a besoin de réparations
 */
export const needsRepair = createGuard('needsRepair', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return false;
  }

  const damage = vehicle.damage || 0;
  const needsRepairs = damage > 50; // Plus de 50% de dégâts
  
  fsmLogger.info(`🔧 [needsRepair] Vehicle damage status:`, {
    damage,
    threshold: 50,
    needsRepairs
  });
  
  return needsRepairs;
});

/**
 * Guard pour vérifier si le vaisseau a besoin de carburant
 */
export const needsRefuel = createGuard('needsRefuel', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    return false;
  }

  const fuel = vehicle.fuel || 0;
  const needsFuel = fuel < 30; // Moins de 30% de carburant
  
  fsmLogger.info(`⛽ [needsRefuel] Vehicle fuel status:`, {
    fuel,
    threshold: 30,
    needsFuel
  });
  
  return needsFuel;
});

/**
 * Guard pour vérifier si le vaisseau est à la base
 */
export const isShipOnBase = createGuard('isShipOnBase', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle || !vehicle.position || !vehicle.basePosition) {
    return false;
  }

  const shipPos = vehicle.position;
  const basePos = vehicle.basePosition;
  
  // Vérifier la proximité (tolérance de 1 unité)
  const distance = Math.sqrt(
    Math.pow(shipPos.x - basePos.x, 2) + 
    Math.pow(shipPos.z - basePos.z, 2)
  );
  
  const isAtBase = distance <= 1.0;
  
  fsmLogger.info(`🏠 [isShipOnBase] Ship base proximity:`, {
    shipPosition: shipPos,
    basePosition: basePos,
    distance,
    isAtBase
  });
  
  return isAtBase;
});

/**
 * Guard pour vérifier si toutes les tâches de maintenance sont terminées
 */
export const maintenanceComplete = createGuard('maintenanceComplete', ({ context }) => {
  // Vérifier directement les conditions sans appeler les autres guards
  const vehicle = context.vehicle;
  if (!vehicle) {
    return true; // Pas de véhicule = maintenance complète par défaut
  }

  const resources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const totalResources = (resources.food || 0) + (resources.debris || 0) + (resources.special || 0);
  const hasResources = totalResources > 0;
  
  const damage = vehicle.damage || 0;
  const needsRepairs = damage > 50;
  
  const fuel = vehicle.fuel || 0;
  const needsFuel = fuel < 30;
  
  const isComplete = !hasResources && !needsRepairs && !needsFuel;
  
  fsmLogger.info(`✅ [maintenanceComplete] Maintenance status:`, {
    hasResources,
    needsRepairs, 
    needsFuel,
    isComplete
  });
  
  return isComplete;
});

// Placeholder pour éviter les erreurs d'import
export const __maintenanceGuardsPlaceholder = createGuard('__maintenanceGuardsPlaceholder', () => true);
