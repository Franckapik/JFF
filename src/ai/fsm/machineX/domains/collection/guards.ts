/**
 * ==========================================================================
 * COLLECTION DOMAIN - Guards (conditions)
 * ==========================================================================
 * 
 * TODO: Migrer les guards liées à la collecte depuis guards.pure.v5.ts
 * - canCollectTile
 * - isVehicleOverloaded
 * - hasResourcesToCollect
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

// TODO: Migrer les guards de collecte ici
// export const canCollectTile = createGuard('canCollectTile', ({ context }) => { ... });

// Placeholder pour éviter les erreurs d'import
export const __collectionGuardsPlaceholder = createGuard('__collectionGuardsPlaceholder', () => true);
