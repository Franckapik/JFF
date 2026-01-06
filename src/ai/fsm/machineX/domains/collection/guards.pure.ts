/**
 * ==========================================================================
 * COLLECTION DOMAIN - Pure Guards (100% testable)
 * ==========================================================================
 * 
 * Guards purs pour la collecte de ressources.
 * - Aucun appel à getState()
 * - Aucune dépendance externe (React, R3F, Zustand)
 * - Testables en Node.js via terminal
 * - TypeScript strict: XStateV5Guard
 * 
 * @see scripts/validate-guards/ pour les tests
 */

import type { XStateV5Guard } from '../../../../../types/xstate.v5.types.ts';

/**
 * Guard pour vérifier si une tuile peut être collectée
 * Vérifie: capacité disponible, fuel suffisant, état opérationnel, cible valide
 * 
 * ⚠️ NOTE: Ne peut pas vérifier si vehicle.coord === targetCoord car le guard
 * est évalué AVANT l'action qui met à jour vehicle.coord (XState v5 behavior)
 */
export const canCollectTile: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) {
    console.log('❌ [canCollectTile] No vehicle');
    return false;
  }
  
  // ✅ Vérifier que targetVehicleTile existe et a des ressources
  const targetTile = vehicle.targetVehicleTile;
  if (!targetTile) {
    console.log('❌ [canCollectTile] No targetVehicleTile');
    return false;
  }
  
  // ✅ Check collectable property (static game rule)
  if (!targetTile.collectable) {
    console.log('❌ [canCollectTile] Tile is not collectable', { 
      coord: targetTile.position?.coord,
      type: targetTile.type
    });
    return false;
  }
  
  if (!targetTile.resources || targetTile.resources.total <= 0) {
    console.log('❌ [canCollectTile] Target tile has no resources', { 
      coord: targetTile.position?.coord, 
      resources: targetTile.resources 
    });
    return false;
  }
  
  // Calculer les ressources actuelles
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  // ⚠️ FIX: Ne pas inclure 'total' dans le calcul (évite de compter double)
  const totalResources = (currentResources.food || 0) + (currentResources.debris || 0) + (currentResources.special || 0);
  
  // Gérer maxCapacity (peut être nombre ou objet avec total)
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 10
    : Number(vehicle.maxCapacity) || 10;
  
  const hasCapacity = totalResources < maxCapacity;
  const hasEnoughFuel = (vehicle.fuel || 0) > 20; // Au moins 20% de carburant
  const isOperational = (vehicle.damage || 0) < 80; // Moins de 80% de dégâts
  
  const canCollect = hasCapacity && hasEnoughFuel && isOperational;
  
  console.log(`🔍 [canCollectTile]`, { 
    hasTargetTile: !!targetTile,
    targetCoord: targetTile?.position?.coord,
    hasResources: targetTile?.resources?.total > 0,
    currentResources,
    totalResources,
    maxCapacity,
    hasCapacity, 
    hasEnoughFuel, 
    isOperational,
    result: canCollect
  });
  
  return canCollect;
};

/**
 * Guard pour vérifier s'il y a des tuiles collectibles parmi les tuiles connues.
 * Version pure: utilise uniquement context.memory.knownTiles au lieu de TileStore.
 * 
 * Retourne true si au moins une tile connue a des ressources non collectées.
 * 
 * ⚠️ CRITICAL FIX: Exclut la tuile actuelle (targetVehicleTile) car après SHIP_LOAD_RESOURCES,
 * la tuile courante vient d'être vidée mais le contexte n'est pas encore synchronisé.
 * Le guard est évalué AVANT l'action dans XState v5.
 */
export const hasMoreCollectibleTiles: XStateV5Guard = ({ context }) => {
  // On utilise les tuiles connues du FSM plutôt que le TileStore
  const knownTiles = context.memory?.knownTiles || [];
  
  if (knownTiles.length === 0) return false;
  
  // ✅ FIX: Exclure la tuile où le ship vient de collecter
  // Cette tuile est soit vide, soit va être vidée par l'action qui suit
  const currentTileCoord = context.vehicle?.targetVehicleTile?.position?.coord;
  
  // Chercher au moins une AUTRE tuile avec des ressources non collectées
  for (const tile of knownTiles) {
    // Skip la tuile courante (celle qu'on vient de collecter)
    if (tile?.position?.coord === currentTileCoord) continue;
    
    // ✅ Check collectable property (static game rule)
    if (!tile?.collectable) continue;
    
    if (tile?.resources && tile.resources.total > 0 && !tile.collected) {
      return true;
    }
  }
  
  return false;
};

/**
 * Guard inverse: vérifie qu'il n'y a PLUS de tuiles collectibles.
 * Utilisé pour transiter vers evaluating après la collecte.
 * 
 * Retourne true si AUCUNE tile connue n'a des ressources non collectées.
 */
export const noMoreCollectibleTiles: XStateV5Guard = ({ context }) => {
  return !hasMoreCollectibleTiles({ context } as Parameters<XStateV5Guard>[0]);
};

/**
 * Guard pour vérifier si le véhicule est surchargé (>= 80% capacité)
 * Retourne true si le véhicule doit déposer ses ressources
 */
export const isVehicleOverloaded: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) return false;
  
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const totalResources = Object.values(currentResources).reduce((sum, val) => sum + (val || 0), 0);
  
  // Gérer maxCapacity
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 10
    : Number(vehicle.maxCapacity) || 10;
  
  // Surchargé si >= 80% de la capacité
  const threshold = maxCapacity * 0.8;
  return totalResources >= threshold;
};

/**
 * Guard pour déterminer si le vaisseau doit retourner à la base
 * Raisons: capacité >= 80%, fuel < 30%, damage > 70%
 */
export const shouldReturnToBase: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) return false;
  
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const totalResources = currentResources.total || 0;
  
  // Gérer maxCapacity
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 2003
    : Number(vehicle.maxCapacity) || 2003;
  
  // Conditions de retour
  const capacityThreshold = maxCapacity * 0.8;
  const isNearFull = totalResources >= capacityThreshold;
  const hasLowFuel = (vehicle.fuel || 100) < 30;
  const hasDamage = (vehicle.damage || 0) > 70;
  
  return isNearFull || hasLowFuel || hasDamage;
};

/**
 * Guard pour vérifier si le vaisseau peut continuer à collecter
 * Inverse de shouldReturnToBase: capacité < 80%, fuel > 30%, damage < 70%
 */
export const canContinueCollecting: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) return false;
  
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0, total: 0 };
  const totalResources = currentResources.total || 0;
  
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 2003
    : Number(vehicle.maxCapacity) || 2003;
  
  const hasCapacity = totalResources < (maxCapacity * 0.8); // Moins de 80% plein
  const hasEnoughFuel = (vehicle.fuel || 0) > 30;
  const isOperational = (vehicle.damage || 0) < 70;
  
  return hasCapacity && hasEnoughFuel && isOperational;
};

/**
 * Guard pour vérifier si le ship atteint une tuile danger
 * Retourne true si targetVehicleTile est de type 'danger'
 * Utilisé pour appliquer +10% damage sur collision avec danger
 */
export const shouldApplyDangerDamage: XStateV5Guard = ({ context }) => {
  const targetTile = context.vehicle?.targetVehicleTile;
  if (!targetTile) return false;
  
  // Check if tile is danger (static or dynamic)
  const isDanger = targetTile.type === 'danger' || targetTile.isDynamicDanger === true;
  
  if (isDanger) {
    console.log('⚠️ [shouldApplyDangerDamage] Ship reaching danger tile:', {
      coord: targetTile.position?.coord,
      type: targetTile.type,
      isDynamicDanger: targetTile.isDynamicDanger
    });
  }
  
  return isDanger;
};

// ========================================================================
// 🛤️ PATHFINDING GUARDS
// ========================================================================

/**
 * Guard: Check if ship has more waypoints to traverse before reaching target
 * Returns true if pathIndex < path.length - 1 (more waypoints ahead)
 */
export const hasMoreWaypoints: XStateV5Guard = ({ context }) => {
  const path = context.vehicle?.currentPath || [];
  const pathIndex = context.vehicle?.pathIndex ?? 0;
  
  // Path includes start position, so we have more waypoints if index < length - 1
  const hasMore = pathIndex < path.length - 1;
  
  console.log(`🛤️ [hasMoreWaypoints] pathIndex=${pathIndex}, pathLength=${path.length}, hasMore=${hasMore}`);
  
  return hasMore;
};

/**
 * Guard: Check if ship has reached final waypoint (target tile)
 * Returns true if pathIndex >= path.length - 1 (at final destination)
 */
export const isAtFinalWaypoint: XStateV5Guard = ({ context }) => {
  const path = context.vehicle?.currentPath || [];
  const pathIndex = context.vehicle?.pathIndex ?? 0;
  
  // At final waypoint if index >= length - 1
  const isAtFinal = pathIndex >= path.length - 1;
  
  console.log(`🏁 [isAtFinalWaypoint] pathIndex=${pathIndex}, pathLength=${path.length}, isAtFinal=${isAtFinal}`);
  
  return isAtFinal;
};
