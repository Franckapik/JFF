/**
 * ==========================================================================
 * COLLECTION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * TODO: Migrer les actions effects liées à la collecte depuis actions.pure.v5.ts
 * - onCollectingEntry/Exit
 * - onShipMovingToTileEntry/Exit
 * - onShipCollectingEntry/Exit
 * - onShipReturningEntry/Exit
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

// TODO: Migrer les actions de collecte ici
// export const onCollectingEntry = ({ context }: { context: FSMContext }) => { ... };
// export const onShipMovingToTileEntry = ({ context }: { context: FSMContext }) => { ... };

// Placeholder pour éviter les erreurs d'import
export const __collectionEffectsPlaceholder = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🎭 [${context.entityId}] Collection effects placeholder`);
};
