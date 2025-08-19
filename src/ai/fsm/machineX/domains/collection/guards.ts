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

// Placeholder pour éviter les erreurs d'import
export const __collectionGuardsPlaceholder = createGuard('__collectionGuardsPlaceholder', () => true);
