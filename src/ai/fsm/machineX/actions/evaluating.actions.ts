/**
 * ============================================================================
 * XSTATE EVALUATING ACTIONS - Actions spécifiques à l'état evaluating
 * ============================================================================
 * 
 * Actions migrées depuis la machine.xstate.js (XState), version modulaire.
 * - action_evaluating_entry : logique de décision (maintenance, collecte, exploration, idle)
 * - action_evaluating_exit : simple log
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */

import fsmLogger from '../../../../logger/fsmLogger.ts';
import type { FSMContext } from '../../../../types/fsm.d.ts';

// Types pour les actions XState v5
interface XStateActionWithSelf {
  context: FSMContext;
  self: {
    send: (event: { type: string; reason?: string }) => void;
  };
}

/**
 * Action d'entrée de l'état evaluating : logique de décision prioritaire
 * Envoie un événement selon la situation du contexte
 */
export const action_evaluating_entry = ({ context, self }: XStateActionWithSelf) => {
  fsmLogger.state('action_evaluating_entry');

  // Évaluation des conditions environnementales
  const vehicle = context?.vehicle;
  const fuel = vehicle?.fuel || 100;
  const damage = vehicle?.damage || 0;
  const resources = vehicle?.resources || { food: 0, debris: 0, special: 0 };
  const maxCapacity = vehicle?.maxCapacity || { food: 200, debris: 1800, special: 3 };

  // Vérifier si maintenance nécessaire (priorité 1)
  const needsMaintenance = fuel < 30 || damage > 50;

  // Vérifier si collecte possible (priorité 2)
  const knownTiles = context.memory?.knownTiles || new Map();
  const tilesWithResources = Array.from(knownTiles.values()).filter(tile => 
    tile.explored && tile.hasResources && tile.resources.total > 0
  );
  const hasCollectibleTiles = tilesWithResources.length > 0;

  // Vérifier capacité du vaisseau
  const totalResources = (resources.food || 0) + (resources.debris || 0) + (resources.special || 0);
  const totalCapacity = (maxCapacity.food || 0) + (maxCapacity.debris || 0) + (maxCapacity.special || 0);
  const isShipNotFull = totalResources < totalCapacity * 0.8;

  // Vérifier si exploration nécessaire (priorité 3)
  const exploredTilesCount = Array.from(knownTiles.values()).filter(tile => tile.explored).length;
  const needsExploration = exploredTilesCount < 3; // Explorer au moins 3 tuiles

  fsmLogger.info('[Evaluating] Conditions', {
    fuel, damage, needsMaintenance,
    hasCollectibleTiles, isShipNotFull,
    exploredTilesCount, needsExploration
  });

  // Décision basée sur les priorités
  setTimeout(() => {
    if (needsMaintenance) {
      fsmLogger.info('[Evaluating] → needMaintenance (fuel/damage critical)');
      self.send({ type: 'needMaintenance', reason: 'critical_condition' });
    } else if (hasCollectibleTiles && isShipNotFull) {
      fsmLogger.info('[Evaluating] → needCollecting (resources available)');
      self.send({ type: 'needCollecting', reason: 'resources_available' });
    } else if (needsExploration) {
      fsmLogger.info('[Evaluating] → needExploring (need more exploration)');
      self.send({ type: 'needExploring', reason: 'insufficient_exploration' });
    } else {
      fsmLogger.info('[Evaluating] → needMaintenance (nothing to do)');
      self.send({ type: 'needMaintenance', reason: 'idle_time' });
    }
  }, 1000); // Délai de 1s pour permettre à l'état de s'initialiser
};

/**
 * Action de sortie de l'état evaluating : simple log
 */
export const action_evaluating_exit = () => {
  fsmLogger.state('action_evaluating_exit');
};

export default {
  action_evaluating_entry,
  action_evaluating_exit
};
