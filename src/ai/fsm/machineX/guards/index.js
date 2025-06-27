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
// TODO: Imports à ajouter progressivement (PROMPTS 3-5)
// ============================================================================

// TODO: PROMPT 3 - import { safetyGuards } from './safety.guards.js';
// TODO: PROMPT 4 - import { efficiencyGuards } from './efficiency.guards.js';  
// TODO: PROMPT 5 - import { discoveryGuards } from './discovery.guards.js';

// ============================================================================
// EXPORT CENTRALISÉ (À compléter)
// ============================================================================

/**
 * Tous les guards disponibles pour XState
 * Structure plate pour faciliter l'usage dans la machine
 */
export const allGuards = {
  // TODO: PROMPT 3-5 - Ajouter tous les guards ici
  // ...safetyGuards,
  // ...efficiencyGuards,
  // ...discoveryGuards
};

/**
 * Guards organisés par catégorie (pour référence)
 */
export const guardsByCategory = {
  // TODO: PROMPT 3 - safety: safetyGuards,
  // TODO: PROMPT 4 - efficiency: efficiencyGuards,
  // TODO: PROMPT 5 - discovery: discoveryGuards
};

// Export par défaut
export default allGuards;
