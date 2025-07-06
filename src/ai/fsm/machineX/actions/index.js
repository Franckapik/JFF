/**
 * ==========================================================================
 * XSTATE ACTIONS INDEX - Export centralisé des actions
 * ==========================================================================
 *
 * Point d'entrée central pour toutes les actions XState (evaluating, exploring, ...).
 * Chaque groupe d'actions doit être importé et exporté ici pour garantir la cohérence de la machine.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// IMPORTS ACTIONS
// ============================================================================

import * as evaluatingActions from './evaluating.actions.js';
import * as exploringActions from './exploring.actions.js';
import * as collectingActions from './collecting.actions.js';
import * as maintainingActions from './maintaining.actions.js';
import { positionActions } from './core/positionActions.js'; // Import position actions

// ============================================================================
// EXPORT CENTRALISÉ
// ============================================================================

/**
 * Toutes les actions disponibles pour XState
 * Structure plate pour faciliter l'usage dans la machine
 */
export const allActions = {
  ...evaluatingActions,
  ...exploringActions,
  ...collectingActions,
  ...maintainingActions,
  ...positionActions // Add position actions to the main export
};

/**
 * Actions organisées par catégorie (pour référence)
 */
export const actionsByCategory = {
  evaluating: evaluatingActions,
  exploring: exploringActions,
  collecting: collectingActions,
  maintaining: maintainingActions,
  position: positionActions // Add position actions category
};

// Export par défaut
export default allActions;
