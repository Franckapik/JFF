/**
 * ============================================================================
 * XSTATE STATES INDEX - Export centralisé des états
 * ============================================================================
 * 
 * Point d'entrée central pour tous les états XState.
 * À compléter avec les imports des états configurés.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// TODO: Imports à ajouter progressivement (PROMPT 8)
// ============================================================================

import { evaluatingState } from './evaluating.state.js';

// ============================================================================
// EXPORT CENTRALISÉ (À compléter)
// ============================================================================

/**
 * Tous les états disponibles pour XState
 */
export const allStates = {
  evaluating: evaluatingState
};

// Export par défaut
export default allStates;

export { evaluatingState };
