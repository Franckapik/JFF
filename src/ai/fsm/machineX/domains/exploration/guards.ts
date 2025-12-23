/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Guards (conditions)
 * ==========================================================================
 * 
 * ARCHITECTURE DECISION (Phase 11 - 23 déc 2025):
 * 
 * ❓ POURQUOI PAS DE GUARDS ICI ?
 * 
 * L'exploration est un processus SÉQUENTIEL sans branchements conditionnels:
 * 
 * 1. drone_deploying → DRONE_REACHES_TILE → drone_scanning
 * 2. drone_scanning  → DRONE_HAS_SCANNED  → drone_returning  
 * 3. drone_returning → DRONE_REACHES_BASE → evaluating
 * 
 * Toutes les transitions sont EVENT-DRIVEN (basées sur position/timer),
 * pas CONDITION-DRIVEN (basées sur état du contexte).
 * 
 * ✅ Le guard pour ENTRER dans l'exploration existe déjà:
 *    - shouldExplore() dans evaluation/guards.pure.ts
 *    - Vérifie: fuel, damage, capacity, exploredThisCycle
 * 
 * ❌ Pas besoin de guards DANS l'exploration car:
 *    - Pas de décisions à prendre une fois lancé
 *    - Le processus est linéaire et automatique
 *    - Les events physiques (distance, timer) dictent les transitions
 * 
 * COMPARAISON AVEC D'AUTRES DOMAINES:
 * - evaluation: 3 guards (shouldExplore, shouldCollect, shouldMaintain) ✓
 * - maintenance: 5 guards (needsRefuel, needsRepair, etc.) ✓
 * - collection: 4 guards (canCollectTile, isOverloaded, etc.) ✓
 * - initializing: 4 guards (isPositionInitialized, etc.) ✓
 * - exploration: 0 guards (event-driven uniquement) ✓
 * 
 * @see evaluation/guards.pure.ts pour shouldExplore (guard d'entrée)
 * @see actions.effects.ts pour les logs d'entrée/sortie
 * @see handlers/ pour les trackers qui envoient les events
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { XStateV5Guard } from '../../../../../types/xstate.v5.types';

/**
 * Générateur de guards typés avec log automatique
 */
function createGuard(
  name: string,
  fn: (args: Parameters<XStateV5Guard>[0]) => boolean
): XStateV5Guard {
  return (args) => {
    const result = fn(args);
    fsmLogger.condition(`[GUARD] ${name}: ${result}`, { context: args.context, event: args.event });
    return result;
  };
}

// Placeholder pour éviter les erreurs d'import
export const __explorationGuardsPlaceholder = createGuard('__explorationGuardsPlaceholder', () => true);
