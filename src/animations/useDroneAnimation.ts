/**
 * ============================================================================
 * DRONE ANIMATION HOOK - Animation optimisée pour les drones
 * ============================================================================
 * 
 * Hook optimisé avec useFrame conditionnel et logique factorisée.
 * ✅ useFrame appelé uniquement quand nécessaire
 * ✅ Logique factorée dans des utilitaires
 * ✅ Logs réduits et optimisés
 */

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { WorldPosition } from '../types';
import type { DroneVisualState } from '../types/drone.d.ts';
import type { DroneAnimationProps, DroneAnimationReturn } from '../types/r3f';

import fsmLogger from '../logger/fsmLogger.ts';

import { applyDroneVisualAnimations } from './utils/droneAnimationUtils';
import {
  calculateTargetPosition,
  calculateWorldPosition,
  getDroneSpeed,
  shouldAnimateDrone
} from './utils/dronePositionUtils';

export const useDroneAnimation = ({
  context,
  fleetPosition,
  updateVisualPosition,
  droneType,
  isActive,
  isMoving
}: DroneAnimationProps): DroneAnimationReturn => {
  const droneRef = useRef<THREE.Mesh>(null!);
  const currentLocalPosition = useRef<WorldPosition>({ x: 0, y: 0, z: 0 });
  const lastTargetPosition = useRef<WorldPosition | null>(null);
  const animationEnabled = useRef<boolean>(false);

  // ============================================================================
  // DONNÉES DÉRIVÉES
  // ============================================================================
  
  const droneFromContext = context?.droneFleet?.drones?.[droneType];
  const initialPosition = droneFromContext?.position || { x: 0, y: 0, z: 0 };
  const shipPosition = context?.vehicle?.position || { x: 0, y: 0, z: 0 };
  const actualFleetPosition = (fleetPosition?.x === 0 && fleetPosition?.y === 0 && fleetPosition?.z === 0) 
    ? shipPosition 
    : (fleetPosition || shipPosition);

  // ============================================================================
  // CONTRÔLE D'ACTIVATION DE L'ANIMATION
  // ============================================================================
  
  useEffect(() => {
    if (!droneFromContext || !isActive) {
      animationEnabled.current = false;
      return;
    }

    const droneState: DroneVisualState = droneFromContext.visualState || 'docked';
    const targetPosition = droneFromContext.targetPosition;
    
    // Activer l'animation si :
    // 1. La target position a changé
    // 2. Le drone est en mouvement
    // 3. Le drone est dans un état nécessitant une animation continue
    const targetChanged = targetPosition && (!lastTargetPosition.current || 
      targetPosition.x !== lastTargetPosition.current.x ||
      targetPosition.y !== lastTargetPosition.current.y ||
      targetPosition.z !== lastTargetPosition.current.z);

    const needsAnimation = shouldAnimateDrone(droneState, isMoving || false, isActive || false);
    
    if (targetChanged || needsAnimation) {
      animationEnabled.current = true;
      if (targetPosition) {
        lastTargetPosition.current = { ...targetPosition };
      }
      
      fsmLogger.mouvement(`🛸 [${droneType}] Animation ${animationEnabled.current ? 'enabled' : 'disabled'}:`, {
        targetChanged,
        needsAnimation,
        droneState,
        isMoving
      });
    } else if (!isMoving && droneState === 'docked') {
      // Désactiver l'animation pour les drones au repos
      animationEnabled.current = false;
    }
  }, [droneFromContext, isMoving, isActive, droneType]);

  // ============================================================================
  // SYNCHRONISATION INITIALE
  // ============================================================================
  
  useEffect(() => {
    if (droneFromContext?.position && updateVisualPosition) {
      updateVisualPosition(droneFromContext.position);
    }
  }, [droneFromContext?.position, updateVisualPosition]);

  // ============================================================================
  // ANIMATION FRAME OPTIMISÉE
  // ============================================================================
  
  useFrame((state, delta) => {
    // Sortie précoce si l'animation n'est pas nécessaire
    if (!droneRef.current || !actualFleetPosition || !context || !animationEnabled.current) {
      return;
    }

    const drone = context.droneFleet?.drones?.[droneType];
    if (!drone) return;

    const droneState: DroneVisualState = drone.visualState || 'docked';
    const targetPosition = calculateTargetPosition(drone, droneState, actualFleetPosition);

    // ============================================================================
    // INTERPOLATION DE POSITION
    // ============================================================================
    
    if (isMoving && (droneState === 'deploying' || droneState === 'scanning' || droneState === 'returning')) {
      const speed = getDroneSpeed(droneState);
      const lerpFactor = Math.min(1.0, delta * speed);
      
      currentLocalPosition.current.x = THREE.MathUtils.lerp(currentLocalPosition.current.x, targetPosition.x, lerpFactor);
      currentLocalPosition.current.y = THREE.MathUtils.lerp(currentLocalPosition.current.y, targetPosition.y, lerpFactor);
      currentLocalPosition.current.z = THREE.MathUtils.lerp(currentLocalPosition.current.z, targetPosition.z, lerpFactor);
    } else {
      currentLocalPosition.current = { ...targetPosition };
    }

    // ============================================================================
    // MISE À JOUR DU MESH ET ANIMATIONS VISUELLES
    // ============================================================================
    
    droneRef.current.position.set(
      currentLocalPosition.current.x, 
      currentLocalPosition.current.y, 
      currentLocalPosition.current.z
    );

    // Appliquer les animations visuelles selon l'état
    applyDroneVisualAnimations(
      droneRef.current,
      droneState,
      currentLocalPosition.current.y,
      state.clock.getElapsedTime(),
      delta
    );

    // ============================================================================
    // ENVOI DE LA POSITION AU TRACKER
    // ============================================================================
    
    const worldPosition = calculateWorldPosition(currentLocalPosition.current, actualFleetPosition);
    updateVisualPosition(worldPosition);

    // Désactiver l'animation si le drone a atteint sa cible et n'est plus en mouvement
    if (!isMoving && droneState === 'docked') {
      animationEnabled.current = false;
    }
  });

  return {
    droneRef,
    droneState: droneFromContext?.visualState || 'docked',
    initialPosition
  };
};
