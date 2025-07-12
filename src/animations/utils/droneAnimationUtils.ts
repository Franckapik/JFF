/**
 * ============================================================================
 * DRONE VISUAL ANIMATIONS - Animations visuelles pour les drones
 * ============================================================================
 */

import * as THREE from 'three';

import type { DroneVisualState } from '../../types/drone.d.ts';

/**
 * Applique les animations visuelles selon l'état du drone
 */
export const applyDroneVisualAnimations = (
  mesh: THREE.Mesh,
  droneState: DroneVisualState,
  baseY: number,
  elapsedTime: number,
  deltaTime: number
): void => {
  switch (droneState) {
    case 'docked':
      mesh.rotation.y += deltaTime * 0.5;
      mesh.position.y = baseY + Math.sin(elapsedTime * 2) * 0.1;
      break;
      
    case 'scanning':
      mesh.position.y = baseY + Math.sin(elapsedTime * 3) * 0.2;
      mesh.rotation.y += deltaTime * 1.5;
      break;
      
    case 'returning':
      mesh.position.y = baseY + Math.sin(elapsedTime * 6) * 0.1;
      mesh.rotation.y += deltaTime * 2;
      break;
      
    case 'deploying':
      mesh.rotation.y += deltaTime * 1;
      mesh.position.y = baseY + Math.sin(elapsedTime * 4) * 0.15;
      break;
      
    case 'failed': {
      const flicker = Math.sin(elapsedTime * 10) > 0 ? 1 : 0.3;
      if (mesh.material && 'opacity' in mesh.material) {
        (mesh.material as THREE.Material & { opacity: number }).opacity = flicker;
      }
      break;
    }
      
    default:
      mesh.rotation.y += deltaTime * 0.2;
      break;
  }
};
