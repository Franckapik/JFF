/**
 * ============================================================================
 * SHIP POSITION UTILITIES - Utilitaires simplifiés pour le vaisseau
 * ============================================================================
 * 
 * Fonctions simplifiées pour l'animation du vaisseau :
 * - Gestion des vitesses selon l'état
 * - Conditions d'activation de l'animation
 * - Calcul de position cible simple (pas de pathfinding complexe)
 * 
 * Architecture similaire à dronePositionUtils pour la cohérence.
 */

import type { WorldPosition } from '../../types/coordinates.d.ts';
import type { VehicleVisualState } from '../../types/vehicle.d.ts';

import fsmLogger from '../../logger/fsmLogger.ts';

/**
 * ============================================================================
 * SHIP POSITION UTILITIES - Utilitaires simplifiés pour le vaisseau
 * ============================================================================
 * 
 * Fonctions simplifiées pour l'animation du vaisseau :
 * - Gestion des vitesses selon l'état
 * - Conditions d'activation de l'animation
 * - Calcul de position cible simple (pas de pathfinding complexe)
 * 
 * Architecture similaire à dronePositionUtils pour la cohérence.
 */

/**
 * Calcule la vitesse du vaisseau selon son état
 * @param shipState - État actuel du vaisseau
 * @returns Facteur de vitesse pour l'interpolation
 */
export const getShipSpeed = (shipState: string): number => {
  switch (shipState) {
    case 'collecting_ship_moving_to_tile': return 1.0;  // Vitesse normale vers la cible
    case 'collecting_ship_returning': return 1.2;       // Légèrement plus rapide au retour
    case 'moving_to_tile': return 1.0;                  // État visuel générique
    case 'returning': return 1.2;                       // État visuel générique
    default: return 0.8;                                // Vitesse par défaut plus lente
  }
};

/**
 * Détermine si le vaisseau doit être animé selon les conditions
 * @param shipState - État actuel du vaisseau
 * @param isMoving - Indique si le vaisseau est en mouvement
 * @param isActive - Indique si l'animation est active
 * @returns True si l'animation doit être activée
 */
export const shouldAnimateShip = (
  shipState: string,
  isMoving: boolean,
  isActive: boolean
): boolean => {
  if (!isActive) {
    return false;
  }
  
  // États nécessitant une animation de mouvement
  const movementStates = [
    'collecting_ship_moving_to_tile',
    'collecting_ship_returning',
    'moving_to_tile',
    'returning'
  ];
  
  // États nécessitant une animation continue (même sans mouvement)
  const continuousAnimationStates = [
    'collecting_ship_collecting',
    'collecting'
  ];
  
  // Animation requise si :
  // 1. État de mouvement + flag isMoving
  // 2. État d'animation continue
  const needsMovementAnimation = movementStates.includes(shipState) && isMoving;
  const needsContinuousAnimation = continuousAnimationStates.includes(shipState);
  
  return needsMovementAnimation || needsContinuousAnimation;
};

/**
 * Mappe l'état FSM vers un état visuel simplifié
 * @param fsmState - État de la machine FSM
 * @returns État visuel pour l'animation
 */
export const mapFSMStateToVisualState = (fsmState: string): VehicleVisualState => {
  switch (fsmState) {
    case 'collecting_ship_moving_to_tile':
      return 'moving';
    case 'collecting_ship_collecting':
      return 'collecting';
    case 'collecting_ship_returning':
      return 'returning';
    case 'evaluating':
    case 'maintaining':
    default:
      return 'docked';
  }
};

/**
 * Calcule la position cible du vaisseau selon l'état et le véhicule
 * Simple et direct, pas de pathfinding complexe
 */
export const calculateShipTargetPosition = (
  vehicle: { 
    position?: WorldPosition; 
    basePosition?: WorldPosition; 
  targetVehicleTile?: import('../../types/tile').Tile | null;
  } | undefined, 
  shipState: string
): WorldPosition | null => {
  if (!vehicle) return null;

  // Si le vaisseau n'est pas en état de collection, rester à la position actuelle
  if (!isCollectionState(shipState)) {
    return vehicle.position || vehicle.basePosition || { x: 0, y: 0.5, z: 0 };
  }

  // En état de retour, cibler la base
  if (shipState.includes('returning') && vehicle.basePosition) {
    fsmLogger.mouvement('🚢 calculateShipTargetPosition: Targeting base for return', {
      basePosition: vehicle.basePosition,
      shipState
    });
    
    return {
      x: vehicle.basePosition.x,
      y: vehicle.basePosition.y || 0.5,
      z: vehicle.basePosition.z
    };
  }

  // Pour les autres états de collection, utiliser la tuile cible si disponible
  if (vehicle.targetVehicleTile && typeof vehicle.targetVehicleTile === 'object' && vehicle.targetVehicleTile.position) {
    fsmLogger.mouvement('🚢 calculateShipTargetPosition: Targeting tile object', {
  targetVehicleTile: vehicle.targetVehicleTile,
      shipState
    });
    return {
  x: vehicle.targetVehicleTile.position.x,
  y: vehicle.targetVehicleTile.position.y ?? 0.5,
  z: vehicle.targetVehicleTile.position.z
    };
  }

  // Fallback sur la position actuelle
  return vehicle.position || { x: 0, y: 0.5, z: 0 };
};

/**
 * Vérifie si l'état actuel est un état de collection
 */
function isCollectionState(shipState: string): boolean {
  return shipState.includes('collecting') || 
         shipState.includes('moving_to_tile') || 
         shipState.includes('returning');
}
