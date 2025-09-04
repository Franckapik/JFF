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
    getDroneSpeed,
    shouldAnimateDrone
} from './utils/dronePositionUtils';

export const useDroneAnimation = ({
  context,
  updateVisualPosition,
  droneType,
  isActive,
  isMoving
}: DroneAnimationProps): DroneAnimationReturn => {
  const droneRef = useRef<THREE.Group>(null!);
  const currentLocalPosition = useRef<WorldPosition>({ x: 0, y: 0, z: 0 });
  const lastTargetPosition = useRef<WorldPosition | null>(null);
  const animationEnabled = useRef<boolean>(false);

  // ============================================================================
  // DONNÉES DÉRIVÉES
  // ============================================================================
  
  const droneFromContext = context?.droneFleet?.drones?.[droneType];
  const initialPosition = { x: 0, y: 0, z: 0 }; // Position relative au group parent

  // ============================================================================
  // CONTRÔLE D'ACTIVATION DE L'ANIMATION
  // ============================================================================
  
  useEffect(() => {
    if (!droneFromContext || !isActive) {
      animationEnabled.current = false;
      return;
    }

    const droneState: DroneVisualState = droneFromContext.visualState || 'docked';
  const targetTile = droneFromContext.targetDroneTile;
  const targetPosition = targetTile ? targetTile.position : null;
    
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
    if (!droneRef.current || !context || !animationEnabled.current) {
      return;
    }

    const drone = context.droneFleet?.drones?.[droneType];
    if (!drone) return;

    const droneState: DroneVisualState = drone.visualState || 'docked';
    const formationOffset = context.droneFleet?.formationOffsets?.[droneType] || { x: 0.5, y: 0, z: 0.5 };
    const parentPosition = droneRef.current.parent?.position || { x: 0, y: 0, z: 0 };

    // ============================================================================
    // CALCUL DE LA POSITION CIBLE RELATIVE AU PARENT GROUP
    // ============================================================================

    let targetRelativePosition = { x: 0, y: 0, z: 0 };

    switch (droneState) {
      case 'docked':
        // Position de formation relative au group parent
        targetRelativePosition = formationOffset;
        break;
        
      case 'deploying':
      case 'scanning':
        // Aller vers la tuile cible (position absolue - position parent = position relative)
        if (drone.targetDroneTile && typeof drone.targetDroneTile === 'object' && 'position' in drone.targetDroneTile) {
          const targetPos = drone.targetDroneTile.position;
          targetRelativePosition = {
            x: targetPos.x - parentPosition.x,
            y: targetPos.y - parentPosition.y,
            z: targetPos.z - parentPosition.z,
          };
        }
        break;
        
      case 'returning':
        // Retour vers la position du vaisseau (center du group parent)
        targetRelativePosition = { x: 0, y: 0, z: 0 };
        break;
        
      default:
        targetRelativePosition = formationOffset;
    }

    // ============================================================================
    // INTERPOLATION DE POSITION
    // ============================================================================
    
    if (isMoving && (droneState === 'deploying' || droneState === 'scanning' || droneState === 'returning')) {
      const speed = getDroneSpeed(droneState);
      const lerpFactor = Math.min(1.0, delta * speed);
      
      currentLocalPosition.current.x = THREE.MathUtils.lerp(currentLocalPosition.current.x, targetRelativePosition.x, lerpFactor);
      currentLocalPosition.current.y = THREE.MathUtils.lerp(currentLocalPosition.current.y, targetRelativePosition.y, lerpFactor);
      currentLocalPosition.current.z = THREE.MathUtils.lerp(currentLocalPosition.current.z, targetRelativePosition.z, lerpFactor);
    } else {
      currentLocalPosition.current = { ...targetRelativePosition };
    }

    // ============================================================================
    // MISE À JOUR DU MESH ET ANIMATIONS VISUELLES
    // ============================================================================
    
    droneRef.current.position.set(
      currentLocalPosition.current.x, 
      currentLocalPosition.current.y, 
      currentLocalPosition.current.z
    );

    // Appliquer les animations visuelles selon l'état sur le premier mesh enfant
    const droneMesh = droneRef.current.children.find(child => child.type === 'Mesh') as THREE.Mesh;
    if (droneMesh) {
      applyDroneVisualAnimations(
        droneMesh,
        droneState,
        currentLocalPosition.current.y,
        state.clock.getElapsedTime(),
        delta
      );
    }

    // ============================================================================
    // ENVOI DE LA POSITION AU TRACKER
    // ============================================================================
    
    // Calculer la position absolue pour le tracker FSM
    const worldPosition = {
      x: parentPosition.x + currentLocalPosition.current.x,
      y: parentPosition.y + currentLocalPosition.current.y,
      z: parentPosition.z + currentLocalPosition.current.z,
    };
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
