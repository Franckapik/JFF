/**
 * ==========================================================================
 * EVALUATION DOMAIN - Guards (conditions)
 * ==========================================================================
 * 
 * CONVENTION : should[Action]
 * Guards pour les conditions de transition dans le domaine d'évaluation
 * 
 * ARCHITECTURE NOTE (Phase 11 - Context Injector Pattern):
 * shouldCollect has been migrated to guards.pure.ts and now uses dependency
 * injection. The effect onEvaluatingEntry queries tiles and injects into
 * context.injectedData, allowing the guard to remain pure and testable.
 * 
 * @see guards.pure.ts for pure implementation
 * @see actions.effects.ts for injection logic (assignInjectTileData)
 * @see src/types/fsm.d.ts for injectedData type definition
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import type { XStateV5Guard } from '../../../../../types/xstate.v5.types';

import { shouldCollect as shouldCollectPure } from './guards.pure';

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

/**
 * Guard principal pour déterminer si l'exploration est nécessaire
 * Nouvelle logique : Si plus de 2 explorations dans le cycle courant, on ne propose plus d'exploration
 */
export const shouldExplore = createGuard('shouldExplore', ({ context }) => {
  // Nouvelle logique : on limite à 2 explorations par cycle
  const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  
  if (exploredThisCycle > 2) {
    fsmLogger.info(`[${context.entityId}] shouldExplore: false - déjà ${exploredThisCycle} explorations dans ce cycle (limite: 2)`);
    return false;
  }

  if (context.vehicle.fuel < context.config.fuelThreshold) return false;
  if (context.vehicle.damage > 80) return false;
  if (context.vehicle.isAtCapacity) return false;
  return true;
});

/**
 * 🔍 shouldCollect - Now Pure via Dependency Injection
 * 
 * MIGRATION NOTES (Phase 11):
 * - Implementation moved to guards.pure.ts (100% pure, Node.js testable)
 * - Tile queries now executed in onEvaluatingEntry effect
 * - Query results injected into context.injectedData.availableTiles
 * - Pure guard reads injected data instead of calling getState()
 * 
 * ARCHITECTURE DECISION (Temporary Scaffolding):
 * This Context Injector pattern is TEMPORARY scaffolding for Phase 2.
 * The "injectedData" zone is marked for discussion on permanent SoC boundaries.
 * 
 * FUTURE REFACTORING OPTIONS (Phase 2):
 * 1. Service Layer: Move all queries to a separate service, FSM stays pure
 * 2. Query Actor: Create XState actor for spatial queries, communicate via events
 * 3. Pre-computed Cache: Effect caches tiles before FSM state transitions
 * 
 * @see FSM_CONTEXT_VS_STORES_ANALYSIS.md for architectural options
 * @see guards.pure.ts for pure implementation
 * @see actions.effects.ts assignInjectTileData for query execution
 */
export const shouldCollect = createGuard('shouldCollect', shouldCollectPure);

/**
 * Guard pour déterminer si la maintenance est nécessaire
 */
export const shouldMaintain = createGuard('shouldMaintain', ({ context }) => {
  const fuel = context.vehicle?.fuel || 100;
  const damage = context.vehicle?.damage || 0;
  return fuel < 30 || damage > 50;
});
