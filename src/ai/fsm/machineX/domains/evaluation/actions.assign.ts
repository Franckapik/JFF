/**
 * ==========================================================================
 * EVALUATION DOMAIN - Actions de mise à jour du contexte (assign)
 * ==========================================================================
 * 
 * CONVENTION : assign[Action]Context
 * Actions pures qui modifient le contexte via assign()
 */

import { assign } from 'xstate';

import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { MachineEvents } from '../../events.pure.v5.ts';

// Helper pour typage assign compatible XState v5
function createAssignAction(
  fn: (args: { context: FSMContext; event: MachineEvents }) => Partial<FSMContext>
): ReturnType<typeof assign<FSMContext, MachineEvents, object, MachineEvents, never>> {
  return assign<FSMContext, MachineEvents, object, MachineEvents, never>(fn);
}

/**
 * Assign action pour l'évaluation initiale du contexte
 * Réinitialise le compteur d'exploration si toutes les tuiles connues sont collectées
 */
export const assignEvaluationContext = createAssignAction(({ context: _context, event: _event }) => {
  
  // ✅ FIX: Vérifier si toutes les tuiles connues ont été collectées
  const knownTiles = _context.memory?.knownTiles || [];
  const allTilesCollected = knownTiles.length > 0 && knownTiles.every(tile => tile.collected || !tile.hasResources);
  
  // Si toutes les tuiles sont collectées, réinitialiser le compteur d'exploration
  // pour permettre un nouveau cycle d'exploration
  if (allTilesCollected && (_context.memory?.stats?.tilesExploredInCycle ?? 0) > 0) {
    return {
      memory: {
        ..._context.memory,
        stats: {
          ..._context.memory?.stats,
          tilesExploredInCycle: 0
        }
      },
      lastAction: 'evaluationCycleReset_allTilesCollected'
    };
  }
  
  // Pour le moment, l'évaluation ne modifie pas le contexte directement
  // La logique de décision se fait dans onEvaluatingEntry
  return {};
});
