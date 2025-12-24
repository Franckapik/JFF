/**
 * ============================================================================
 * DRONE POSITION UTILITIES - Utilitaires pour calculs de position
 * ============================================================================
 */

import { calculateRelativePosition } from '../../core/spatial/animation';
import type { WorldPosition } from '../../types/coordinates.d.ts';
import type { DroneVisualState } from '../../types/drone.d.ts';

interface DroneData {
  position?: WorldPosition;
  targetDroneTile?: import('../../types/tile').Tile | WorldPosition | null;
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
  // Pour l'état "returning", retourner à la position du vaisseau (targetDroneTile relative)
  if (droneState === 'returning' && drone.targetDroneTile) {
    const pos = (typeof drone.targetDroneTile === 'object' && 'position' in drone.targetDroneTile)
      ? drone.targetDroneTile.position
      : drone.targetDroneTile;
    if (pos) {
      return calculateRelativePosition(pos, actualFleetPosition);
    }
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
  if (drone.targetDroneTile && (droneState === 'deploying' || droneState === 'scanning')) {
    const pos = (typeof drone.targetDroneTile === 'object' && 'position' in drone.targetDroneTile)
      ? drone.targetDroneTile.position
      : drone.targetDroneTile;
    if (pos) {
      return calculateRelativePosition(pos, actualFleetPosition);
    }
  }
  if (drone.position) {
    return calculateRelativePosition(drone.position, actualFleetPosition);
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
): WorldPosition => {
  // Import de la fonction depuis core/spatial
  const { calculateWorldPosition: coreCalculateWorldPosition } = require('../../core/spatial/animation');
  return coreCalculateWorldPosition(localPosition, initialPosition);
};
