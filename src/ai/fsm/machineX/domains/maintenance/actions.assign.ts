/**
 * ==========================================================================
 * MAINTENANCE DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * TODO: Migrer les actions assign liées à la maintenance depuis actions.pure.v5.ts
 * - assignMaintenanceTaskContext
 * - depositResources (si c'est une action assign)
 * - repairVehicle (si c'est une action assign)
 * - refuelVehicle (si c'est une action assign)
 */

import { assign } from 'xstate';

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { VehicleVisualState } from '../../../../../types/vehicle.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Action assign pour le dépôt de ressources à la base
 * Transfert des ressources du véhicule vers le score du joueur
 */
export const assignShipDepositResourcesContext = createAssignAction(({ context, event }) => {
  fsmLogger.action(`🔄 [${context?.entityId || 'unknown'}] assignShipDepositResourcesContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type
  });
  
  if (!context.vehicle) {
    return {};
  }
  
  // Transférer les ressources du véhicule vers le score
  const vehicleResources = context.vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const currentScore = context.score?.resources || { food: 0, debris: 0, special: 0, total: 0 };
  
  const newScore = {
    food: (currentScore.food || 0) + (vehicleResources.food || 0),
    debris: (currentScore.debris || 0) + (vehicleResources.debris || 0), 
    special: (currentScore.special || 0) + (vehicleResources.special || 0),
    total: 0 // Sera calculé ci-dessous
  };
  newScore.total = newScore.food + newScore.debris + newScore.special;

  fsmLogger.action(`💰 [${context.entityId}] Depositing resources at base:`, {
    resourcesDeposited: vehicleResources,
    scoreBefore: currentScore,
    scoreAfter: newScore,
    totalGained: vehicleResources.total || 0
  });
  
  // ✅ FIX: Réinitialiser le compteur d'exploration par cycle après le dépôt
  // Cela permet de recommencer un nouveau cycle exploration → collection → maintenance
  const resetStats = {
    ...context.memory?.stats,
    tilesExploredInCycle: 0
  };
  
  fsmLogger.info(`🔄 [${context.entityId}] Resetting exploration cycle counter after deposit`, {
    previousCount: context.memory?.stats?.tilesExploredInCycle ?? 0,
    newCount: 0
  });
  
  return {
    vehicle: {
      ...context.vehicle,
      resources: { food: 0, debris: 0, special: 0, total: 0 }, // Ressources déposées
      visualState: 'maintaining' as VehicleVisualState
    },
    score: {
      ...context.score,
      resources: newScore
    },
    memory: {
      ...context.memory,
      stats: resetStats
    },
    lastAction: 'resourcesDeposited_success',
    fsmState: 'maintaining_depositing',
  };
});

/**
 * Action assign pour la réparation du véhicule
 */
export const assignShipRepairContext = createAssignAction(({ context }) => {
  
  if (!context.vehicle) {
    return {};
  }
  
  return {
    vehicle: {
      ...context.vehicle,
      damage: 0, // Réparation complète
      visualState: 'repairing' as VehicleVisualState
    },
    lastAction: 'vehicleRepaired_success',
    fsmState: 'maintaining_repairing',
  };
});

/**
 * Action assign pour le ravitaillement du véhicule
 */
export const assignShipRefuelContext = createAssignAction(({ context }) => {
  
  if (!context.vehicle) {
    return {};
  }
  
  return {
    vehicle: {
      ...context.vehicle,
      fuel: 100, // Plein de carburant
      visualState: 'refueling' as VehicleVisualState
    },
    lastAction: 'vehicleRefueled_success',
    fsmState: 'maintaining_refueling',
  };
});

// Placeholder pour éviter les erreurs d'import
export const __maintenanceAssignPlaceholder = createAssignAction(({ context: _context }) => {
  return {};
});
