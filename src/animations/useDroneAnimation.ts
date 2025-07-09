/**
 * ============================================================================
 * DRONE ANIMATION HOOK - Animation spécialisée pour les drones (TypeScript)
 * ============================================================================
 * 
 * Hook dédié pour l'animation des drones dans Fleet.
 * Gère le mouvement, les rotations et les effets visuels par état.
 * 
 * ✅ Converti en TypeScript avec types unifiés
 * ✅ Utilise les constantes centralisées de /types/drone
 */

import { useFrame } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import fsmLogger from '../logger/fsmLogger';
import type { FSMContext, WorldPosition } from '../types';
import {
    DRONE_STATES,
    DroneType,
    DroneVisualState,
    isDroneMoving
} from '../types/drone';

// ============================================================================
// TYPES INTERNES
// ============================================================================

interface DroneAnimationReturn {
  droneRef: MutableRefObject<THREE.Mesh | undefined>;
  droneState: DroneVisualState;
  initialPosition: WorldPosition;
}

interface InitialPositions {
  explorer: WorldPosition;
  combat: WorldPosition;
  special: WorldPosition;
}

// ============================================================================
// HOOK D'ANIMATION PRINCIPAL
// ============================================================================

/**
 * Hook d'animation spécialisé pour les drones
 * @param context - Contexte FSM
 * @param shipPosition - Position du vaisseau de référence
 * @param updateVisualPosition - Callback pour envoyer la position au tracker
 * @param droneType - Type de drone ('explorer', 'combat', 'special')
 * @param isActive - Si le bot est actif (animations complètes) ou non
 * @returns Ref du drone et données d'animation
 */
export const useDroneAnimation = (
  context: FSMContext | null,
  shipPosition: WorldPosition | null,
  updateVisualPosition: (position: WorldPosition) => void,
  droneType: DroneType = 'explorer',
  isActive: boolean = true
): DroneAnimationReturn => {
  const droneRef = useRef<THREE.Mesh>(null!);
  const lastUpdateTime = useRef<number>(0);
  const initialPositionSent = useRef<boolean>(false);

  // Positions initiales des drones (coordonnées locales au vaisseau)
  const initialPositions: InitialPositions = {
    explorer: { x: 0.5, y: 0.3, z: 0.5 },
    combat: { x: -0.5, y: 0.3, z: 0.5 },
    special: { x: 0, y: 0.3, z: -0.7 }
  };

  const initialPosition = initialPositions[droneType];

  // ============================================================================
  // TRANSMISSION DE LA POSITION INITIALE (UNE SEULE FOIS)
  // ============================================================================
  
  useEffect(() => {
    if (shipPosition && updateVisualPosition && !initialPositionSent.current) {
      const droneWorldPosition: WorldPosition = {
        x: shipPosition.x + initialPosition.x,
        y: shipPosition.y + initialPosition.y, 
        z: shipPosition.z + initialPosition.z
      };
      
      fsmLogger.mouvement(`🛸 [${droneType}] Transmitting initial drone position to FSM tracker:`, droneWorldPosition);
      updateVisualPosition(droneWorldPosition);
      initialPositionSent.current = true;
    }
  }, [shipPosition, updateVisualPosition, droneType, initialPosition]);

  // ============================================================================
  // ANIMATION FRAME PRINCIPAL
  // ============================================================================
  
  useFrame((state, delta) => {
    if (!droneRef.current || !shipPosition || !isActive || !context) return;

    const now = state.clock.getElapsedTime();
    const drone = context.droneFleet?.drones?.[droneType];
    if (!drone) return;

    // État actuel du drone (utilisation des constantes unifiées)
    const droneState: DroneVisualState = drone.state || DRONE_STATES.VISUAL.DOCKED;

    // Throttling des mises à jour (60 FPS max)
    const shouldUpdate = now - lastUpdateTime.current > 1/60;
    
    if (shouldUpdate) {
      fsmLogger.mouvement(`🛸 [${droneType}] Animation frame:`, {
        state: droneState,
        dronePosition: drone.position,
        droneTarget: drone.targetPosition,
        shipPosition,
        deltaTime: delta
      });
      lastUpdateTime.current = now;
    }

    // ============================================================================
    // CALCUL DE LA POSITION CIBLE
    // ============================================================================
    
    const targetPosition = (() => {
      // Si le drone a une position cible définie
      if (drone.targetPosition && 
          (drone.targetPosition.x !== 0 || drone.targetPosition.y !== 0 || drone.targetPosition.z !== 0)) {
        const droneTargetPos = drone.targetPosition;
        return {
          x: droneTargetPos.x - shipPosition.x,
          y: droneTargetPos.y - shipPosition.y,
          z: droneTargetPos.z - shipPosition.z
        };
      } else {
        // Fallback : position initiale relative
        return initialPosition;
      }
    })();
    
    // ============================================================================
    // ANIMATION DE MOUVEMENT
    // ============================================================================
    
    // Vérification des états de mouvement avec la fonction unifiée
    const isMoving = isDroneMoving(droneState);
    
    if (isMoving && droneRef.current) {
      if (shouldUpdate) {
        fsmLogger.error(`⚠️ [Drone ${droneType}] État ${droneState} mais pas en mouvement`);
      }
      
      // Animation fluide vers la position cible
      const lerpFactor = delta * 2; // Vitesse d'interpolation
      droneRef.current.position.lerp(
        new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
        lerpFactor
      );
      
      // Calcul de la position mondiale pour le tracker
      if (shouldUpdate) {
        const worldPosition: WorldPosition = {
          x: shipPosition.x + droneRef.current.position.x,
          y: shipPosition.y + droneRef.current.position.y,
          z: shipPosition.z + droneRef.current.position.z
        };
        
        fsmLogger.mouvement(`🛸 [${droneType}] Sending updated position to tracker:`, {
          localPosition: {
            x: droneRef.current.position.x,
            y: droneRef.current.position.y,
            z: droneRef.current.position.z
          },
          worldPosition,
          targetPosition,
          droneState,
          deltaTime: delta
        });
        
        // Envoyer la position actuelle au tracker
        updateVisualPosition(worldPosition);
      }
    }
    
    // ============================================================================
    // ANIMATIONS PAR ÉTAT (VISUEL UNIQUEMENT)
    // ============================================================================
    
    switch (droneState) {
      case DRONE_STATES.VISUAL.DOCKED:
        droneRef.current.rotation.y += delta * 0.5;
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 2) * 0.1;
        break;
        
      case DRONE_STATES.VISUAL.EXPLORING:
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 3) * 0.2;
        droneRef.current.rotation.y += delta * 1.5;
        break;
        
      case DRONE_STATES.VISUAL.RETURNING:
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 6) * 0.1;
        droneRef.current.rotation.y += delta * 2;
        break;
        
      case DRONE_STATES.VISUAL.DEPLOYING:
        droneRef.current.rotation.y += delta * 1;
        droneRef.current.position.y = targetPosition.y + Math.sin(now * 4) * 0.15;
        break;
        
      case DRONE_STATES.VISUAL.FAILED:
        // Animation d'erreur - clignotement
        const flicker = Math.sin(now * 10) > 0 ? 1 : 0.3;
        if (droneRef.current.material && 'opacity' in droneRef.current.material) {
          (droneRef.current.material as THREE.Material & { opacity: number }).opacity = flicker;
        }
        break;
        
      default:
        // État par défaut : rotation lente
        droneRef.current.rotation.y += delta * 0.2;
        break;
    }
  });

  // ============================================================================
  // RETOUR DU HOOK
  // ============================================================================
  
  return {
    droneRef,
    droneState: context?.droneFleet?.drones?.[droneType]?.state || DRONE_STATES.VISUAL.DOCKED,
    initialPosition
  };
};
