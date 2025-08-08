/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * TODO: Migrer les actions effects liées à l'exploration depuis actions.pure.v5.ts
 * - onExploringEntry/Exit
 * - onDroneDeployingEntry/Exit
 * - onDroneScanningEntry/Exit
 * - onDroneReturningEntry/Exit
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

// TODO: Migrer les actions d'exploration ici
// export const onExploringEntry = ({ context }: { context: FSMContext }) => { ... };
// export const onDroneDeployingEntry = ({ context }: { context: FSMContext }) => { ... };

// Placeholder pour éviter les erreurs d'import
export const __explorationEffectsPlaceholder = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🎭 [${context.entityId}] Exploration effects placeholder`);
};
