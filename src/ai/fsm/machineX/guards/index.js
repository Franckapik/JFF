/**
 * ============================================================================
 * XSTATE GUARDS INDEX - Export centralisé des guards
 * ============================================================================
 * 
 * Point d'entrée central pour tous les guards XState.
 * À compléter avec les imports des guards spécialisés.
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

// ============================================================================
// IMPORTS DES GUARDS SPÉCIALISÉS
// ============================================================================

import { safetyGuards } from './safety.guards.js';
import { efficiencyGuards } from './efficiency.guards.js';
// TODO: PROMPT 5 - import { discoveryGuards } from './discovery.guards.js';

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
  // TODO: PROMPT 5 - ...discoveryGuards
};

/**
 * Guards organisés par catégorie (pour référence)
 */
export const guardsByCategory = {
  safety: safetyGuards,
  efficiency: efficiencyGuards,
  // TODO: PROMPT 5 - discovery: discoveryGuards
};

// Exports individuels pour faciliter l'usage
export { safetyGuards, efficiencyGuards };

// Export par défaut
export default allGuards;
