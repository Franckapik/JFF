/**
 * ============================================================================
 * DRONE ANIMATION HOOK - Animation spécialisée pour les drones (TypeScript)
 * ============================================================================
 * 
 * Hook dédié pour l'animation des drones dans Fleet.
 * Gère le mouvement, les rotations et les effets visuels par état.
 * 
 * ✅ Converti en TypeScript avec types unifiés
 * ✅ Utilise les constantes centralisées de /types/drone.d.ts
 */

import { useFrame } from '@react-three/fiber';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { DroneAnimationProps, DroneAnimationReturn } from '../types/r3f';

import fsmLogger from '../logger/fsmLogger.ts';
import type { WorldPosition } from '../types';
import type {
  DroneVisualState
} from '../types/drone.d.ts';

// ============================================================================
// TYPES INTERNES
// ============================================================================



// ============================================================================
// TYPES DE PROPS POUR LE HOOK
// ============================================================================



// ============================================================================
// HOOK D'ANIMATION PRINCIPAL
// ============================================================================

export const useDroneAnimation = ({
  context,
  fleetPosition,
  updateVisualPosition,
  droneType,
  isActive,
  isMoving
}: DroneAnimationProps): DroneAnimationReturn => {
  const droneRef = useRef<THREE.Mesh>(null!);
  const lastUpdateTime = useRef<number>(0);
  const currentLocalPosition = useRef<WorldPosition>({ x: 0, y: 0, z: 0 });

  // ============================================================================
  // RÉCUPÉRATION DE LA POSITION DEPUIS LE CONTEXTE FSM
  // ============================================================================
  
  // La position initiale vient maintenant du contexte FSM (initialisée par le handler)
  const droneFromContext = context?.droneFleet?.drones?.[droneType];
  const initialPosition = droneFromContext?.position || { x: 0, y: 0, z: 0 };

  // IMPORTANT: fleetPosition peut être {0,0,0} si le Fleet est dans un groupe positionné
  // Dans ce cas, nous devons utiliser la position absolue du vaisseau depuis le contexte FSM
  const shipPosition = context?.vehicle?.position || { x: 0, y: 0, z: 0 };
  const actualFleetPosition = (fleetPosition.x === 0 && fleetPosition.y === 0 && fleetPosition.z === 0) 
    ? shipPosition 
    : fleetPosition;

  // Initialiser la position locale au premier rendu
  useEffect(() => {
    if (droneFromContext?.position && actualFleetPosition) {
      currentLocalPosition.current = {
        x: droneFromContext.position.x - actualFleetPosition.x,
        y: droneFromContext.position.y - actualFleetPosition.y,
        z: droneFromContext.position.z - actualFleetPosition.z
      };
    }
  }, [droneFromContext?.position, actualFleetPosition]);

  // ============================================================================
  // SYNCHRONISATION AVEC LE TRACKER (position depuis FSM)
  // ============================================================================
  
  useEffect(() => {
    // Synchroniser la position du contexte FSM avec le tracker
    if (droneFromContext?.position && updateVisualPosition) {
      fsmLogger.mouvement(`🛸 [${droneType}] Syncing FSM position to visual tracker:`, droneFromContext.position);
      updateVisualPosition(droneFromContext.position);
    }
  }, [droneFromContext?.position, updateVisualPosition, droneType]);

  // ============================================================================
  // ANIMATION FRAME PRINCIPAL
  // ============================================================================
  
  useFrame((state, delta) => {
    if (!droneRef.current || !actualFleetPosition || !isActive || !context) return;

    const now = state.clock.getElapsedTime();
    const drone = context.droneFleet?.drones?.[droneType];
    if (!drone) return;

    // État actuel du drone (utilisation des constantes unifiées)
    const droneState: DroneVisualState = drone.state || 'docked';

    // Throttling des mises à jour (60 FPS max)
    const shouldUpdate = now - lastUpdateTime.current > 1/60;
    
    if (shouldUpdate) {
      fsmLogger.mouvement(`🛸 [${droneType}] Animation frame:`, {
        state: droneState,
        dronePosition: drone.position,
        droneTarget: drone.targetPosition,
        fleetPosition: actualFleetPosition,
        deltaTime: delta
      });
      lastUpdateTime.current = now;
    }

    // ============================================================================
    // CALCUL DE LA POSITION CIBLE ET INTERPOLATION
    // ============================================================================
    
    const targetPosition = (() => {
      // Position cible pour l'interpolation selon l'état du drone
      if (drone.targetPosition && (droneState === 'deploying' || droneState === 'scanning' || droneState === 'returning')) {
        // Convertir la position cible absolue en position relative
        return {
          x: drone.targetPosition.x - actualFleetPosition.x,
          y: drone.targetPosition.y - actualFleetPosition.y,
          z: drone.targetPosition.z - actualFleetPosition.z
        };
      } else if (drone.position) {
        // Position de repos (relative à la flotte)
        return {
          x: drone.position.x - actualFleetPosition.x,
          y: drone.position.y - actualFleetPosition.y,
          z: drone.position.z - actualFleetPosition.z
        };
      } else {
        // Fallback : position initiale relative à la flotte
        return { x: 0, y: 0, z: 0 };
      }
    })();

    // Interpolation vers la position cible si en mouvement
    if (isMoving && (droneState === 'deploying' || droneState === 'scanning' || droneState === 'returning')) {
      const speed = droneState === 'deploying' ? 1.5 : droneState === 'returning' ? 2.0 : 1.0;
      const lerpFactor = Math.min(1.0, delta * speed);
      
      currentLocalPosition.current.x = THREE.MathUtils.lerp(currentLocalPosition.current.x, targetPosition.x, lerpFactor);
      currentLocalPosition.current.y = THREE.MathUtils.lerp(currentLocalPosition.current.y, targetPosition.y, lerpFactor);
      currentLocalPosition.current.z = THREE.MathUtils.lerp(currentLocalPosition.current.z, targetPosition.z, lerpFactor);
      
      if (shouldUpdate) {
        fsmLogger.mouvement(`🛸 [${droneType}] Interpolating to target:`, {
          currentLocal: currentLocalPosition.current,
          targetLocal: targetPosition,
          lerpFactor,
          speed,
          droneState,
          isMoving
        });
      }
    } else {
      // Si pas en mouvement, aller directement à la position cible
      currentLocalPosition.current = { ...targetPosition };
    }

    if (shouldUpdate) {
      fsmLogger.mouvement(`🛸 [${droneType}] Position calculation:`, {
        droneAbsolutePosition: drone.position,
        droneTargetPosition: drone.targetPosition,
        fleetAbsolutePosition: actualFleetPosition,
        targetRelativePosition: targetPosition,
        currentLocalPosition: currentLocalPosition.current,
        droneState,
        isMoving,
        isActive
      });
    }
    
    // ============================================================================
    // ANIMATION DE MOUVEMENT
    // ============================================================================
    
    // ============================================================================
    // SYNCHRONISATION DE LA POSITION DU MESH
    // ============================================================================
    
    if (droneRef.current) {
      // Utiliser la position locale interpolée
      droneRef.current.position.set(
        currentLocalPosition.current.x, 
        currentLocalPosition.current.y, 
        currentLocalPosition.current.z
      );
      
      if (shouldUpdate) {
        fsmLogger.mouvement(`🛸 [${droneType}] Mesh position updated:`, {
          meshExists: !!droneRef.current,
          newMeshPosition: {
            x: droneRef.current.position.x,
            y: droneRef.current.position.y,
            z: droneRef.current.position.z
          },
          currentLocalPosition: currentLocalPosition.current,
          targetPosition
        });
      }
    } else {
      if (shouldUpdate) {
        fsmLogger.error(`🛸 [${droneType}] Mesh ref is null! Cannot update position`);
      }
    }
    
    // Calcul de la position mondiale pour le tracker
    if (shouldUpdate && droneRef.current) {
      const worldPosition: WorldPosition = {
        x: actualFleetPosition.x + currentLocalPosition.current.x,
        y: actualFleetPosition.y + currentLocalPosition.current.y,
        z: actualFleetPosition.z + currentLocalPosition.current.z
      };
      
      fsmLogger.mouvement(`🛸 [${droneType}] Sending updated position to tracker:`, {
        localPosition: currentLocalPosition.current,
        worldPosition,
        targetPosition,
        droneState,
        deltaTime: delta
      });
      
      // Envoyer la position actuelle au tracker
      updateVisualPosition(worldPosition);
    }
    
    // ============================================================================
    // ANIMATIONS PAR ÉTAT (VISUEL UNIQUEMENT)
    // ============================================================================
    
    if (droneRef.current) {
      const baseY = currentLocalPosition.current.y;
      
      switch (droneState) {
        case 'docked':
          droneRef.current.rotation.y += delta * 0.5;
          droneRef.current.position.y = baseY + Math.sin(now * 2) * 0.1;
          break;
          
        case 'scanning':
          droneRef.current.position.y = baseY + Math.sin(now * 3) * 0.2;
          droneRef.current.rotation.y += delta * 1.5;
          break;
          
        case 'returning':
          droneRef.current.position.y = baseY + Math.sin(now * 6) * 0.1;
          droneRef.current.rotation.y += delta * 2;
          break;
          
        case 'deploying':
          droneRef.current.rotation.y += delta * 1;
          droneRef.current.position.y = baseY + Math.sin(now * 4) * 0.15;
          break;
          
        case 'failed': {
          // Animation d'erreur - clignotement
          const flicker = Math.sin(now * 10) > 0 ? 1 : 0.3;
          if (droneRef.current.material && 'opacity' in droneRef.current.material) {
            (droneRef.current.material as THREE.Material & { opacity: number }).opacity = flicker;
          }
          break;
        }
          
        default:
          // État par défaut : rotation lente
          droneRef.current.rotation.y += delta * 0.2;
          break;
      }
    }
  });

  // ============================================================================
  // RETOUR DU HOOK
  // ============================================================================
  
  return {
    droneRef,
    droneState: context?.droneFleet?.drones?.[droneType]?.state || 'docked',
    initialPosition
  };
};
