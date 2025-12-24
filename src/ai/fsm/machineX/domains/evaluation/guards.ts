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
import { useTileStore } from '../../../../../stores/useTileStore';
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
 * Guard pour vérifier que le TileStore est initialisé
 * ⚠️ IMPURE - Accède au TileStore (mais safe pour guards XState)
 */
export const hasTilesAvailable = createGuard('hasTilesAvailable', () => {
  const tileStore = useTileStore.getState();
  const tiles = tileStore.tiles;
  const hasTiles = tiles && Object.keys(tiles).length > 0;
  
  if (!hasTiles) {
    fsmLogger.warn('[GUARD] hasTilesAvailable: false - TileStore not yet initialized');
  }
  
  return hasTiles;
});

/**
 * Guard combiné : vérifie à la fois les tiles disponibles ET les conditions d'exploration
 * Combine hasTilesAvailable + shouldExplore de guards.pure.ts
 */
export const canStartExploring = createGuard('canStartExploring', ({ context }) => {
  // Check 1: TileStore doit être initialisé
  const tileStore = useTileStore.getState();
  const tiles = tileStore.tiles;
  const hasTiles = tiles && Object.keys(tiles).length > 0;
  
  if (!hasTiles) {
    fsmLogger.warn('[GUARD] canStartExploring: false - TileStore not yet initialized');
    return false;
  }
  
  // Check 2: Conditions métier (même logique que shouldExplore pure)
  const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  const MAX_EXPLORATIONS_PER_CYCLE = 2;
  
  if (exploredThisCycle > MAX_EXPLORATIONS_PER_CYCLE) {
    fsmLogger.info(`[GUARD] canStartExploring: false - déjà ${exploredThisCycle} explorations ce cycle (max: ${MAX_EXPLORATIONS_PER_CYCLE})`);
    return false;
  }

  const fuel = context.vehicle?.fuel ?? 0;
  const damage = context.vehicle?.damage ?? 0;
  const fuelThreshold = context.config?.fuelThreshold ?? 20;
  const isAtCapacity = context.vehicle?.isAtCapacity ?? false;
  
  const hasEnoughFuel = fuel >= fuelThreshold;
  const isHealthy = damage <= 80;
  const hasSpace = !isAtCapacity;
  
  const canExplore = hasEnoughFuel && isHealthy && hasSpace;
  
  if (!canExplore) {
    fsmLogger.info(`[GUARD] canStartExploring: false - fuel:${fuel}, damage:${damage}, atCapacity:${isAtCapacity}`);
  }
  
  return canExplore;
});

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
