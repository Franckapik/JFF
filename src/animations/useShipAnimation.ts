/**
 * ============================================================================
 * SHIP ANIMATION HOOK - Animation optimisée pour le vaisseau principal
 * ============================================================================
 * 
 * Hook d'animation spécialisé pour le vaisseau avec :
 * ✅ Positionnement absolu (contrairement aux drones en relatif)
 * ✅ Calcul de chemin BFS tuile par tuile
 * ✅ Interpolation progressive entre tuiles
 * ✅ useFrame conditionnel selon l'état FSM
 * ✅ Intégration avec les trackers de position
 */

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { GridCoordinate, WorldPosition } from '../types';
import type { ShipAnimationProps, ShipAnimationReturn } from '../types/r3f';
import type { ShipVisualState } from '../types/r3f.d.ts';

import fsmLogger from '../logger/fsmLogger.ts';

import { applyShipVisualAnimations } from './utils/shipAnimationUtils';
import {
    calculateShipPath,
    getShipSpeed,
    isPathCompleted,
    shouldAnimateShip
} from './utils/shipPositionUtils';

export const useShipAnimation = ({
  context,
  updateVisualPosition,
  shipType = 'main-ship',
  isActive,
  isMoving
}: ShipAnimationProps): ShipAnimationReturn => {
  // ============================================================================
  // REFS DE GESTION D'ÉTAT
  // ============================================================================
  
  const shipRef = useRef<THREE.Mesh>(null!);
  const currentWorldPosition = useRef<WorldPosition>({ x: 0, y: 0, z: 0 });
  const currentPath = useRef<WorldPosition[]>([]);
  const pathIndex = useRef<number>(0);
  const animationEnabled = useRef<boolean>(false);
  const lastTargetTile = useRef<GridCoordinate | null>(null);

  // ============================================================================
  // DONNÉES DÉRIVÉES DU CONTEXTE
  // ============================================================================
  
  const vehicle = context?.vehicle;
  const selectedTile = context?.selectedTileForCollection;
  const shipState = context?.currentState || '';
  const shipVisualState: ShipVisualState = getShipVisualState(shipState);

  // ============================================================================
  // CONTRÔLE D'ACTIVATION DE L'ANIMATION
  // ============================================================================
  
  useEffect(() => {
    if (!isActive) {
      animationEnabled.current = false;
      fsmLogger.debug(`🚢 [${shipType}] Animation disabled: not active`);
      return;
    }

    const needsAnimation = shouldAnimateShip(shipState, isMoving || false, isActive || false);
    
    if (needsAnimation !== animationEnabled.current) {
      animationEnabled.current = needsAnimation;
      fsmLogger.mouvement(`🚢 [${shipType}] Animation ${needsAnimation ? 'ENABLED' : 'DISABLED'}`, {
        shipState,
        isMoving,
        isActive,
        needsAnimation
      });
    }
  }, [shipState, isMoving, isActive, shipType]);

  // ============================================================================
  // CALCUL DE CHEMIN LORS DU CHANGEMENT DE CIBLE
  // ============================================================================
  
  useEffect(() => {
    if (!selectedTile || !vehicle?.basePosition) {
      fsmLogger.debug(`🚢 [${shipType}] No path calculation: selectedTile=${!!selectedTile}, basePosition=${!!vehicle?.basePosition}`);
      return;
    }

    // Éviter les recalculs inutiles
    const tileKey = selectedTile.coord.coord;
    if (lastTargetTile.current === tileKey) {
      return;
    }

    try {
      // Calculer le nouveau chemin BFS
      const newPath = calculateShipPath(vehicle.basePosition, selectedTile.coord.coord);
      
      if (newPath.length > 0) {
        currentPath.current = newPath;
        pathIndex.current = 0;
        lastTargetTile.current = tileKey;
        
        fsmLogger.mouvement(`🚢 [${shipType}] New path calculated`, {
          from: vehicle.basePosition,
          to: selectedTile.coord.coord,
          pathLength: newPath.length,
          path: newPath
        });
        
        // Initialiser la position si c'est le premier calcul
        if (currentWorldPosition.current.x === 0 && currentWorldPosition.current.y === 0 && currentWorldPosition.current.z === 0) {
          currentWorldPosition.current = { ...newPath[0] };
        }
      } else {
        fsmLogger.error(`🚢 [${shipType}] No path found`, {
          from: vehicle.basePosition,
          to: selectedTile.coord.coord
        });
      }
    } catch (error) {
      // Log d'erreur seulement, pas de log de succès pour éviter les spams
      fsmLogger.error(`🚢 [${shipType}] Error calculating path`, { error });
    }
  }, [selectedTile, vehicle?.basePosition, shipType]);

  // ============================================================================
  // SYNCHRONISATION INITIALE DE POSITION (UNE SEULE FOIS)
  // ============================================================================
  
  useEffect(() => {
    if (vehicle?.basePosition && updateVisualPosition && currentWorldPosition.current.x === 0) {
      // Initialiser la position du vaisseau à sa base (une seule fois)
      currentWorldPosition.current = { ...vehicle.basePosition };
      updateVisualPosition(vehicle.basePosition);
    }
  }, [vehicle?.basePosition, updateVisualPosition]);

  // ============================================================================
  // ANIMATION FRAME OPTIMISÉE - INTERPOLATION TUILE PAR TUILE
  // ============================================================================
  
  useFrame((state, delta) => {
    // Sortie précoce si l'animation n'est pas nécessaire
    if (!shipRef.current || !animationEnabled.current || currentPath.current.length === 0) {
      return;
    }

    const path = currentPath.current;
    const currentIndex = pathIndex.current;
    
    // Vérifier si le chemin est terminé
    if (isPathCompleted(currentWorldPosition.current, path, currentIndex)) {
      animationEnabled.current = false;
      fsmLogger.mouvement(`🚢 [${shipType}] Path completed`, {
        finalPosition: currentWorldPosition.current,
        pathLength: path.length
      });
      return;
    }

    // Obtenir la prochaine tuile cible
    if (currentIndex >= path.length - 1) {
      return; // Pas de prochaine tuile
    }

    const currentTarget = path[currentIndex + 1];
    const speed = getShipSpeed(shipState);
    const lerpFactor = Math.min(1.0, delta * speed);

    // ============================================================================
    // INTERPOLATION VERS LA PROCHAINE TUILE
    // ============================================================================
    
    currentWorldPosition.current.x = THREE.MathUtils.lerp(
      currentWorldPosition.current.x, 
      currentTarget.x, 
      lerpFactor
    );
    currentWorldPosition.current.y = THREE.MathUtils.lerp(
      currentWorldPosition.current.y, 
      currentTarget.y, 
      lerpFactor
    );
    currentWorldPosition.current.z = THREE.MathUtils.lerp(
      currentWorldPosition.current.z, 
      currentTarget.z, 
      lerpFactor
    );

    // ============================================================================
    // DÉTECTION D'ARRIVÉE SUR TUILE
    // ============================================================================
    
    const distance = calculateDistance(currentWorldPosition.current, currentTarget);
    if (distance < 0.1) { // Seuil de détection d'arrivée sur tuile
      pathIndex.current++;
      
      fsmLogger.mouvement(`🚢 [${shipType}] Reached waypoint ${currentIndex + 1}/${path.length}`, {
        waypointPosition: currentTarget,
        currentPosition: currentWorldPosition.current,
        remainingWaypoints: path.length - pathIndex.current - 1
      });
    }

    // ============================================================================
    // MISE À JOUR DU MESH ET ANIMATIONS VISUELLES
    // ============================================================================
    
    shipRef.current.position.set(
      currentWorldPosition.current.x,
      currentWorldPosition.current.y,
      currentWorldPosition.current.z
    );

    // Appliquer les animations visuelles selon l'état
    applyShipVisualAnimations(
      shipRef.current,
      shipVisualState,
      currentWorldPosition.current.y, // baseY
      state.clock.getElapsedTime(),
      delta
    );

    // ============================================================================
    // ENVOI DE LA POSITION AU TRACKER
    // ============================================================================
    
    updateVisualPosition(currentWorldPosition.current);
  });

  return {
    shipRef,
    shipState,
    currentPath: currentPath.current,
    pathIndex: pathIndex.current
  };
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Convertit l'état FSM en état visuel du vaisseau
 */
function getShipVisualState(shipState: string): ShipVisualState {
  if (shipState.includes('moving_to_tile')) return 'moving_to_tile';
  if (shipState.includes('collecting')) return 'collecting';
  if (shipState.includes('returning')) return 'returning';
  return 'docked';
}

/**
 * Calcule la distance entre deux positions
 */
function calculateDistance(pos1: WorldPosition, pos2: WorldPosition): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
