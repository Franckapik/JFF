/**
 * ==========================================================================
 * MAINTENANCE DOMAIN - Guards
 * ==========================================================================
 * 
 * TODO: Migrer les guards liées à la maintenance depuis les fichiers existants
 * - isShipOnBase
 * - needsRepair
 * - needsRefuel
 * - canRepair
 * - canRefuel
 */

import type { FSMContext } from '../../../../../types/fsm.d.ts';

// TODO: Migrer les guards de maintenance ici
// export const isShipOnBase = ({ context }: { context: FSMContext }) => { ... };
// export const needsRepair = ({ context }: { context: FSMContext }) => { ... };

// Placeholder pour éviter les erreurs d'import
export const __maintenanceGuardsPlaceholder = ({ context: _context }: { context: FSMContext }) => {
  return true;
};
