/**
 * ==========================================================================
 * MAINTENANCE DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * TODO: Migrer les actions effects liées à la maintenance depuis actions.pure.v5.ts
 * - onMaintainingEntry/Exit
 * - onShipOnBaseEntry/Exit
 * - onShipDepositingEntry/Exit
 * - onShipRepairingEntry/Exit
 * - onShipRefuelingEntry/Exit
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

// TODO: Migrer les actions de maintenance ici
// export const onMaintainingEntry = ({ context }: { context: FSMContext }) => { ... };
// export const onShipOnBaseEntry = ({ context }: { context: FSMContext }) => { ... };

// Placeholder pour éviter les erreurs d'import
export const __maintenanceEffectsPlaceholder = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🎭 [${context.entityId}] Maintenance effects placeholder`);
};
