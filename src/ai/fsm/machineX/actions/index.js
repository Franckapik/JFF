/**
 * ============================================================================
 * XSTATE ACTIONS INDEX - Export centralisé des actions
 * ============================================================================
 * 
 * Point d'entrée central pour toutes les actions XState.
 * À compléter avec les imports des actions spécialisées.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// TODO: Imports à ajouter progressivement (PROMPT 7)
// ============================================================================

import * as evaluatingActions from './evaluating.actions.js';

// ============================================================================
// EXPORT CENTRALISÉ (À compléter)
// ============================================================================

/**
 * Toutes les actions disponibles pour XState
 * Structure plate pour faciliter l'usage dans la machine
 */
export const allActions = {
  ...evaluatingActions
};

/**
 * Actions organisées par catégorie (pour référence)
 */
export const actionsByCategory = {
  evaluating: evaluatingActions
};

// Export par défaut
export default allActions;
