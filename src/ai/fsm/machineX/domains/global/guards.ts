/**
 * ==========================================================================
 * GLOBAL DOMAIN - Guards
 * ==========================================================================
 * 
 * Guards globales qui ne dépendent d'aucun domaine spécifique.
 * Actuellement vides car les guards sont généralement liées aux domaines métier.
 */

import type { FSMContext } from '../../../../../types/fsm.d.ts';

// Placeholder pour les guards globales
export const __globalGuardsPlaceholder = ({ context: _context }: { context: FSMContext }) => {
  return true;
};
