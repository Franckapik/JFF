/**
 * ==========================================================================
 * XSTATE GUARDS INDEX - Export centralisé des guards
 * ==========================================================================
 *
 * Point d'entrée central pour tous les guards XState (safety, efficiency, discovery, ...).
 * Chaque groupe de guards doit être importé et exporté ici pour garantir la cohérence de la machine.
 *
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// IMPORTS DES GUARDS SPÉCIALISÉS
// ============================================================================

import { safetyGuards } from './safety.guards.js';
import { efficiencyGuards } from './efficiency.guards.js';
import { discoveryGuards } from './discovery.guards.js';

// ============================================================================
// EXPORT CENTRALISÉ (À compléter)
// ============================================================================

/**
 * Tous les guards disponibles pour XState
 * Structure plate pour faciliter l'usage dans la machine
 */
export const allGuards = {
  // Safety guards (PROMPT 3 - COMPLETED)
  ...safetyGuards,
  // Efficiency guards (PROMPT 4 - COMPLETED)
  ...efficiencyGuards,
  // Discovery guards (PROMPT 5 - COMPLETED)
  ...discoveryGuards
};

/**
 * Guards organisés par catégorie (pour référence)
 */
export const guardsByCategory = {
  safety: safetyGuards,
  efficiency: efficiencyGuards,
  discovery: discoveryGuards
};

// Exports individuels pour faciliter l'usage
export { safetyGuards, efficiencyGuards, discoveryGuards };

// Export par défaut
export default allGuards;
