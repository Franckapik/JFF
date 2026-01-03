/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Pure Guards (No Side Effects)
 * ==========================================================================
 * 
 * Guards pour la logique d'exploration, incluant la détection des tuiles danger.
 */

import type { XStateV5Guard } from '../../../../../types/xstate.v5.types.ts';

/**
 * Guard: Vérifie si un drone va rencontrer une tuile danger
 * @returns true si la tuile ciblée est de type 'danger'
 */
export const shouldDestroyDroneOnDanger: XStateV5Guard = ({ context, event }) => {
  const eventWithTile = event as any;
  const tileType = eventWithTile?.tileType;
  
  // Vérifier le type de tuile reçu dans l'événement
  if (tileType === 'danger') {
    return true;
  }
  
  // Fallback: vérifier depuis le contexte si le drone a une tuile cible
  const currentDrone = context.droneFleet?.drones?.explorer;
  const targetTile = currentDrone?.targetDroneTile;
  
  if (targetTile?.type === 'danger') {
    return true;
  }
  
  return false;
};

/**
 * Guard: Vérifie si un drone a été détruit
 * @returns true si le drone a la flag isDestroyed
 */
export const isDroneDestroyed: XStateV5Guard = ({ context }) => {
  const currentDrone = context.droneFleet?.drones?.explorer;
  return currentDrone?.isDestroyed === true;
};
