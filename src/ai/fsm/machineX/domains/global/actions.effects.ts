/**
 * ==========================================================================
 * GLOBAL DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * Actions d'effets de bord globales qui ne dépendent d'aucun domaine spécifique.
 * Actuellement vides car les actions globales sont principalement des assign.
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { FSMContext } from '../../../../../types/fsm.d.ts';

// Placeholder pour les actions d'effets de bord globales
export const __globalEffectsPlaceholder = ({ context }: { context: FSMContext }) => {
  fsmLogger.action(`🌐 [${context.entityId}] Global effects placeholder`);
};
