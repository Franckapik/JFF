/**
 * ==========================================================================
 * XSTATE STATES INDEX - Export centralisé des états
 * ==========================================================================
 *
 * Point d'entrée central pour tous les états XState (evaluating, exploring, ...).
 * Chaque état doit être importé et exporté ici pour garantir la cohérence de la machine.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// TODO: Imports à ajouter progressivement (PROMPT 8)
// ============================================================================

import { evaluatingState } from './evaluating.state.js';
import { exploringState } from './exploring.state.js';
import { collectingState } from './collecting.state.js';
import { maintainingState } from './maintaining.state.js';

// ============================================================================
// EXPORT CENTRALISÉ (À compléter)
// ============================================================================

/**
 * Tous les états disponibles pour XState
 */
export const allStates = {
  evaluating: evaluatingState,
  exploring: exploringState,
  collecting: collectingState,
  maintaining: maintainingState
};

// Export par défaut
export default allStates;

export { evaluatingState, exploringState, collectingState, maintainingState };
