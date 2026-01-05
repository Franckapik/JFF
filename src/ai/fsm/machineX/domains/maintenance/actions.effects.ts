/**
 * ==========================================================================
 * MAINTENANCE DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * ARCHITECTURE NOTES:
 * - Les actions d'effets ne gèrent QUE les logs et effets de bord (pas de mutations contexte)
 * - Les transitions et mises à jour contexte sont dans actions.assign
 * - Les trackers observent l'état de la ship et envoient les événements (MAINTENANCE_COMPLETE, etc)
 * - Cette séparation permet de tester les guards et le FSM indépendamment de R3F
 */

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

/**
 * Action d'entrée de l'état maintaining
 * 
 * LOG ONLY: Trace l'entrée dans l'état global de maintenance
 */
export const onMaintainingEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔧 [${context.entityId}] Entrée dans l'état MAINTAINING`, {
    vehicleState: {
      fuel: context.vehicle?.fuel,
      damage: context.vehicle?.damage,
      resources: context.vehicle?.resources?.total
    },
    maintenanceTasks: {
      needsFuel: context.vehicle?.fuel !== 100,
      needsRepair: context.vehicle?.damage !== 0,
      needsDeposit: (context.vehicle?.resources?.total || 0) > 0
    }
  });
};

/**
 * Action de sortie de l'état maintaining
 * 
 * LOG ONLY: Trace la fin de la maintenance
 */
export const onMaintainingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`✅ [${context.entityId}] Sortie de l'état MAINTAINING`, {
    vehicleState: {
      fuel: context.vehicle?.fuel,
      damage: context.vehicle?.damage,
      resources: context.vehicle?.resources?.total
    }
  });
};

/**
 * Action d'entrée de l'état maintaining_on_base
 * 
 * LOG ONLY: Trace l'arrivée du véhicule à la base
 */
export const onShipOnBaseEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🏠 [${context.entityId}] Arrivée du navire à la base`, {
    coord: context.vehicle?.coord,
    baseCoord: context.vehicle?.baseCoord
  });
};

/**
 * Action de sortie de l'état maintaining_on_base
 * 
 * LOG ONLY: Trace le départ du navire depuis la base
 */
export const onShipOnBaseExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`✅ [${context.entityId}] Départ du navire depuis la base`, {
    coord: context.vehicle?.coord
  });
};

/**
 * Action d'entrée de l'état maintaining_depositing
 * 
 * LOG ONLY: Trace le début du dépôt de ressources
 */
export const onShipDepositingEntry = ({ context }: { context: FSMContext }) => {
  const resources = context.vehicle?.resources || { food: 0, debris: 0, special: 0, total: 0 };
  fsmLogger.action(`📦 [${context.entityId}] Dépôt des ressources`, {
    resourcesDeposited: resources,
    currentScore: context.score?.resources
  });
};

/**
 * Action de sortie de l'état maintaining_depositing
 * 
 * LOG ONLY: Trace la fin du dépôt (ressources transférées au score)
 */
export const onShipDepositingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`✅ [${context.entityId}] Ressources déposées avec succès`, {
    score: context.score?.resources,
    vehicleResources: context.vehicle?.resources
  });
};

/**
 * Action d'entrée de l'état maintaining_repairing
 * 
 * LOG ONLY: Trace le début de la réparation
 */
export const onShipRepairingEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🔨 [${context.entityId}] Réparation du navire`, {
    damageBefore: context.vehicle?.damage,
    estimatedTime: '2s' // Durée type de réparation
  });
};

/**
 * Action de sortie de l'état maintaining_repairing
 * 
 * LOG ONLY: Trace la fin de la réparation (navire intact)
 */
export const onShipRepairingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`✅ [${context.entityId}] Navire réparé`, {
    damageAfter: context.vehicle?.damage
  });
};

/**
 * Action d'entrée de l'état maintaining_refueling
 * 
 * LOG ONLY: Trace le début du ravitaillement
 */
export const onShipRefuelingEntry = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`⛽ [${context.entityId}] Ravitaillement du navire`, {
    fuelBefore: context.vehicle?.fuel,
    estimatedTime: '1s' // Durée type de ravitaillement
  });
};

/**
 * Action de sortie de l'état maintaining_refueling
 * 
 * LOG ONLY: Trace la fin du ravitaillement (navire plein)
 */
export const onShipRefuelingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`✅ [${context.entityId}] Navire ravitaillé`, {
    fuelAfter: context.vehicle?.fuel
  });
};

/**
 * 🆕 Action d'entrée de l'état maintaining.relocating
 * 
 * LOG ONLY: Trace le début de la relocalisation du navire
 */
export const onShipRelocatingEntry = ({ context }: { context: FSMContext }) => {
  const targetTile = context.vehicle?.targetVehicleTile;
  fsmLogger.action(`🚢 [${context.entityId}] Ship RELOCATING - moving to new exploration area`, {
    currentCoord: context.vehicle?.coord,
    targetCoord: targetTile?.position?.coord || 'unknown',
    fuel: context.vehicle?.fuel,
    reason: 'All local tiles explored, no collectible tiles'
  });
};

/**
 * 🆕 Action de sortie de l'état maintaining.relocating
 * 
 * LOG ONLY: Trace la fin de la relocalisation
 */
export const onShipRelocatingExit = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`✅ [${context.entityId}] Ship relocation complete`, {
    newCoord: context.vehicle?.coord,
    fuel: context.vehicle?.fuel
  });
};

// Placeholder pour éviter les erreurs d'import
export const __maintenanceEffectsPlaceholder = ({ context: _context }: { context: FSMContext }) => {
};

