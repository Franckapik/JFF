/**
 * ============================================================================
 * DRONE POSITION UTILITIES - Utilitaires pour calculs de position
 * ============================================================================
 */

import type { WorldPosition } from '../../types/coordinates.d.ts';
import type { DroneVisualState } from '../../types/drone.d.ts';

interface DroneData {
  position?: WorldPosition;
  targetPosition?: WorldPosition;
  state?: DroneVisualState;
}

/**
 * Calcule la position cible relative d'un drone selon son état
 */
export const calculateTargetPosition = (
  drone: DroneData,
  droneState: DroneVisualState,
  actualFleetPosition: WorldPosition,
  formationOffset?: { x: number; y: number; z: number }
): WorldPosition => {
  // Pour l'état "returning", retourner à la position du vaisseau (targetPosition relative)
  if (droneState === 'returning' && drone.targetPosition) {
    // Le drone retourne au vaisseau : utiliser la targetPosition en coordonnées relatives
    return {
      x: drone.targetPosition.x - actualFleetPosition.x,
      y: drone.targetPosition.y - actualFleetPosition.y,
      z: drone.targetPosition.z - actualFleetPosition.z
    };
  }
  
  // Si le drone est docked, utiliser l'offset de formation
  if (droneState === 'docked' && formationOffset) {
    return {
      x: formationOffset.x,
      y: formationOffset.y,
      z: formationOffset.z
    };
  }
  
  // Pour les autres états, utiliser la position cible ou la position actuelle
  if (drone.targetPosition && (droneState === 'deploying' || droneState === 'scanning')) {
    return {
      x: drone.targetPosition.x - actualFleetPosition.x,
      y: drone.targetPosition.y - actualFleetPosition.y,
      z: drone.targetPosition.z - actualFleetPosition.z
    };
  } else if (drone.position) {
    return {
      x: drone.position.x - actualFleetPosition.x,
      y: drone.position.y - actualFleetPosition.y,
      z: drone.position.z - actualFleetPosition.z
    };
  }
  
  // Par défaut, utiliser l'offset de formation si disponible
  return formationOffset || { x: 0, y: 0, z: 0 };
};

/**
 * Calcule la vitesse selon l'état du drone
 */
export const getDroneSpeed = (droneState: DroneVisualState): number => {
  switch (droneState) {
    case 'deploying': return 1.5;
    case 'returning': return 2.0;
    default: return 1.0;
  }
};

/**
 * Vérifie si le drone doit être animé
 */
export const shouldAnimateDrone = (
  droneState: DroneVisualState,
  isMoving: boolean,
  isActive: boolean
): boolean => {
  return isActive && (isMoving || droneState === 'scanning' || droneState === 'docked');
};

/**
 * Calcule la position mondiale depuis la position locale
 */
export const calculateWorldPosition = (
  localPosition: WorldPosition,
  initialPosition: WorldPosition
): WorldPosition => ({
  x: initialPosition.x + localPosition.x,
  y: initialPosition.y + localPosition.y,
  z: initialPosition.z + localPosition.z
});
