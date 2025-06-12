/**
 * ============================================================================
 * CORE GUARDS - Export consolidé des guards primitifs
 * ============================================================================
 * 
 * Point d'entrée central pour tous les guards primitifs.
 * Ces guards constituent la base logique métier réutilisable.
 * 
 * 🎯 ARCHITECTURE CLEAN:
 * - Guards primitifs dans core/ (logique métier)
 * - Guards composés FSM dans guards/ (orchestration)
 * - Import depuis ./core/ au lieu de ../actions/
 */

// ============================================================================
// IMPORTS DES GUARDS PRIMITIFS
// ============================================================================

export { fuelGuards } from './fuelGuard.js';
export { FUEL_THRESHOLDS } from '../../constants/constants.js';
export { movementGuards } from './movementGuard.js';
export { MOVEMENT_CONSTANTS } from '../../constants/constants.js';
export { resourceGuards, resourceUtils } from './resourcesGuard.js';
export { RESOURCE_CONSTANTS } from '../../constants/constants.js';
export { explorationGuards, explorationUtils } from './explorationGuard.js';
export { EXPLORATION_CONSTANTS } from '../../constants/constants.js';

// ============================================================================
// EXPORT CONSOLIDÉ - ALL GUARDS
// ============================================================================

import { fuelGuards } from './fuelGuard.js';
import { movementGuards } from './movementGuard.js';
import { resourceGuards } from './resourcesGuard.js';
import { explorationGuards } from './explorationGuard.js';

/**
 * Tous les guards primitifs dans un seul objet
 * Utile pour l'import en une seule fois
 */
export const allCoreGuards = {
  // Fuel guards
  ...fuelGuards,
  
  // Movement guards
  ...movementGuards,
  
  // Resource guards
  ...resourceGuards,
  
  // Exploration guards
  ...explorationGuards
};

/**
 * Guards organisés par catégorie
 * Utile pour une utilisation structurée
 */
export const coreGuardsByCategory = {
  fuel: fuelGuards,
  movement: movementGuards,
  resources: resourceGuards,
  exploration: explorationGuards
};

/**
 * Export par défaut - Structure complète
 */
export default {
  fuel: fuelGuards,
  movement: movementGuards,
  resources: resourceGuards,
  exploration: explorationGuards,
  all: allCoreGuards
};
