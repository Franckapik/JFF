/**
 * ==========================================================================
 * COLLECTION DOMAIN - Guards (conditions)
 * ==========================================================================
 * 
 * Guards réels pour la collecte de ressources par le vaisseau
 */

import fsmLogger from '../../../../../logger/fsmLogger';
import { useTileStore } from '../../../../../stores/useTileStore/index';
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
 * Guard pour vérifier si une tuile peut être collectée
 */
export const canCollectTile = createGuard('canCollectTile', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    fsmLogger.error(`[canCollectTile] No vehicle found in context`);
    return false;
  }
  
  // Vérifier que le véhicule a la capacité de collecter
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const totalResources = Object.values(currentResources).reduce((sum, val) => sum + (val || 0), 0);
  
  // Gérer maxCapacity qui peut être un nombre ou un objet avec total
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 10
    : Number(vehicle.maxCapacity) || 10;
  
  const hasCapacity = totalResources < maxCapacity;
  const hasEnoughFuel = (vehicle.fuel || 0) > 20; // Au moins 20% de carburant
  const isOperational = (vehicle.damage || 0) < 80; // Moins de 80% de dégâts
  
  const canCollect = hasCapacity && hasEnoughFuel && isOperational;
  
  fsmLogger.info(`🔍 [canCollectTile] Vehicle collection status:`, {
    totalResources,
    maxCapacity,
    hasCapacity,
    fuel: vehicle.fuel,
    hasEnoughFuel,
    damage: vehicle.damage,
    isOperational,
    canCollect
  });
  
  return canCollect;
});

/**
 * Guard pour vérifier si le véhicule est surchargé et doit retourner à la base
 */
export const isVehicleOverloaded = createGuard('isVehicleOverloaded', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    fsmLogger.error(`[isVehicleOverloaded] No vehicle found in context`);
    return false;
  }
  
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const totalResources = Object.values(currentResources).reduce((sum, val) => sum + (val || 0), 0);
  
  // Gérer maxCapacity qui peut être un nombre ou un objet avec total
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 10
    : Number(vehicle.maxCapacity) || 10;
  
  // Considérer comme surchargé si on dépasse 80% de la capacité
  const threshold = maxCapacity * 0.8;
  const isOverloaded = totalResources >= threshold;
  
  fsmLogger.info(`🎒 [isVehicleOverloaded] Vehicle load status:`, {
    totalResources,
    maxCapacity,
    threshold,
    isOverloaded
  });
  
  return isOverloaded;
});

/**
 * Guard pour vérifier s'il y a encore des tuiles collectibles disponibles
 */
export const hasMoreCollectibleTiles = createGuard('hasMoreCollectibleTiles', ({ context }) => {
  // knownTiles est maintenant un tableau de Tile
  const knownTiles = context.memory?.knownTiles || [];
  const shipPosition = context.vehicle?.position;

  if (!shipPosition) {
    fsmLogger.error(`[hasMoreCollectibleTiles] No ship position found`);
    return false;
  }

  let collectibleTilesCount = 0;
  const maxDistance = 5;

  for (const tile of knownTiles) {
    if (tile?.resources && tile.resources.total > 0 && !tile.collected) {
      // Approximation de distance
      const [tileX, tileZ] = tile.position?.coord?.split(',').map(Number) || [0,0];
      const tileStore = useTileStore.getState();
      const distance = tileStore.calculateDistance(
        shipPosition,
        { x: tileX * 2, y: 0, z: tileZ * 2 }
      );
      if (distance <= maxDistance) {
        collectibleTilesCount++;
      }
    }
  }

  const hasMore = collectibleTilesCount > 0;

  fsmLogger.info(`🔍 [hasMoreCollectibleTiles] Collectible tiles status:`, {
    shipPosition,
    collectibleTilesCount,
    maxDistance,
    hasMore,
    totalKnownTiles: knownTiles.length
  });

  return hasMore;
});

/**
 * Guard pour déterminer si le vaisseau doit retourner à la base après collecte
 */
export const shouldReturnToBase = createGuard('shouldReturnToBase', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    fsmLogger.error(`[shouldReturnToBase] No vehicle found in context`);
    return false;
  }
  
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const totalResources = currentResources.total || 0;
  
  // Gérer maxCapacity qui peut être un nombre ou un objet avec total
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 2003
    : Number(vehicle.maxCapacity) || 2003;
  
  // Retourner à la base si le véhicule est plein à 80% ou plus
  const capacityThreshold = maxCapacity * 0.8;
  const isNearFull = totalResources >= capacityThreshold;
  
  // Ou si le véhicule a peu de carburant
  const hasLowFuel = (vehicle.fuel || 100) < 30;
  
  // Ou si des dégâts importants
  const hasDamage = (vehicle.damage || 0) > 70;
  
  const shouldReturn = isNearFull || hasLowFuel || hasDamage;
  
  fsmLogger.info(`🔙 [shouldReturnToBase] Vehicle return status:`, {
    totalResources,
    maxCapacity,
    capacityUsed: `${Math.round((totalResources / maxCapacity) * 100)}%`,
    isNearFull,
    fuel: vehicle.fuel,
    hasLowFuel,
    damage: vehicle.damage,
    hasDamage,
    shouldReturn
  });
  
  return shouldReturn;
});

/**
 * Guard pour vérifier si le vaisseau peut continuer à collecter 
 * (inverse de shouldReturnToBase mais avec logique différente)
 */
export const canContinueCollecting = createGuard('canContinueCollecting', ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) return false;
  
  // Vérifier la capacité restante
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const totalResources = currentResources.total || 0;
  
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 2003
    : Number(vehicle.maxCapacity) || 2003;
  
  const hasCapacity = totalResources < (maxCapacity * 0.8); // Moins de 80% plein
  const hasEnoughFuel = (vehicle.fuel || 0) > 30;
  const isOperational = (vehicle.damage || 0) < 70;
  
  const canContinue = hasCapacity && hasEnoughFuel && isOperational;
  
  fsmLogger.info(`🔄 [canContinueCollecting] Vehicle continuation status:`, {
    hasCapacity: `${totalResources}/${maxCapacity}`,
    hasEnoughFuel,
    isOperational,
    canContinue
  });
  
  return canContinue;
});

// Placeholder pour éviter les erreurs d'import
export const __collectionGuardsPlaceholder = createGuard('__collectionGuardsPlaceholder', () => true);
