/**
 * ==========================================================================
 * EVALUATION DOMAIN - Guards (conditions)
 * ==========================================================================
 * 
 * CONVENTION : should[Action]
 * Guards pour les conditions de transition dans le domaine d'évaluation
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore';
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
 * Guard pour déterminer si la collecte est nécessaire
 * Nouvelle logique : Si plus de 2 explorations par drone, le vaisseau doit explorer/collecter
 */
export const shouldCollect = createGuard('shouldCollect', ({ context }) => {
  const exploredThisCycle = context.memory?.stats?.tilesExploredInCycle ?? 0;
  
  // Si plus de 2 explorations par drone, le vaisseau prend le relais
  if (exploredThisCycle > 2) {
    fsmLogger.info(`[${context.entityId}] shouldCollect: true - Vaisseau prend le relais après ${exploredThisCycle} explorations par drone`);
    return !context.vehicle.isAtCapacity && context.vehicle.fuel > context.config.fuelThreshold;
  }
  
  // Logique modifiée : vérifier s'il existe des tuiles collectibles dans le rayon
  // au lieu de vérifier si une tuile cible est déjà assignée
  if (context.vehicle.isAtCapacity || context.vehicle.fuel <= context.config.fuelThreshold) {
    return false;
  }
  
  // Utiliser le store pour vérifier les tuiles disponibles
  const tileStore = useTileStore.getState();
  const shipPosition = context.vehicle?.position;
  const collectingRadius = context.config?.collectingRadius ?? 3;
  
  // Vérifier s'il existe au moins une tuile collectible dans le rayon
  const availableTile = tileStore.tileInRadius(shipPosition, collectingRadius);
  
  fsmLogger.info(`[${context.entityId}] shouldCollect: checking available tiles`, {
    shipPosition,
    collectingRadius,
    hasAvailableTile: !!availableTile,
    targetTileCoord: availableTile?.coord
  });
  
  return !!availableTile;
});

/**
 * Guard pour déterminer si la maintenance est nécessaire
 */
export const shouldMaintain = createGuard('shouldMaintain', ({ context }) => {
  const fuel = context.vehicle?.fuel || 100;
  const damage = context.vehicle?.damage || 0;
  return fuel < 30 || damage > 50;
});
