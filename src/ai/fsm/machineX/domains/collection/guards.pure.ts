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
 * Vérifie: capacité disponible, fuel suffisant, état opérationnel
 */
export const canCollectTile: XStateV5Guard = ({ context }) => {
  const vehicle = context.vehicle;
  if (!vehicle) return false;
  
  // Calculer les ressources actuelles
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const totalResources = Object.values(currentResources).reduce((sum, val) => sum + (val || 0), 0);
  
  // Gérer maxCapacity (peut être nombre ou objet avec total)
  const maxCapacity = typeof vehicle.maxCapacity === 'object' && vehicle.maxCapacity !== null 
    ? (vehicle.maxCapacity as unknown as Record<string, number>).total || 10
    : Number(vehicle.maxCapacity) || 10;
  
  const hasCapacity = totalResources < maxCapacity;
  const hasEnoughFuel = (vehicle.fuel || 0) > 20; // Au moins 20% de carburant
  const isOperational = (vehicle.damage || 0) < 80; // Moins de 80% de dégâts
  
  return hasCapacity && hasEnoughFuel && isOperational;
};

/**
 * Guard pour vérifier s'il y a des tuiles collectibles parmi les tuiles connues.
 * Version pure: utilise uniquement context.memory.knownTiles au lieu de TileStore.
 * 
 * Retourne true si au moins une tile connue a des ressources non collectées.
 */
export const hasMoreCollectibleTiles: XStateV5Guard = ({ context }) => {
  // On utilise les tuiles connues du FSM plutôt que le TileStore
  const knownTiles = context.memory?.knownTiles || [];
  
  if (knownTiles.length === 0) return false;
  
  // Chercher au moins une tuile avec des ressources non collectées
  for (const tile of knownTiles) {
    if (tile?.resources && tile.resources.total > 0 && !tile.collected) {
      return true;
    }
  }
  
  return false;
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
