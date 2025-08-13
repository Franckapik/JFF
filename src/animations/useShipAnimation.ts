/**
 * ============================================================================
 * SHIP ANIMATION HOOK - Architecture simplifiée similaire au drone
 * ============================================================================
 * 
 * Nouvelle architecture avec les mêmes principes que useDroneAnimation :
 * ✅ Animation uniquement quand nécessaire
 * ✅ Calcul de position cible simple et direct
 * ✅ Pas de pathfinding complexe - interpolation directe
 * ✅ Logique conditionnelle basée sur l'état FSM
 * ✅ Activation seulement en états de collection
 */

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';


import type { WorldPosition } from '../types';
import type { ShipAnimationProps, ShipAnimationReturn } from '../types/r3f';
import type { VehicleVisualState } from '../types/vehicle.d.ts';

import fsmLogger from '../logger/fsmLogger.ts';

import { applyShipVisualAnimations } from './utils/shipAnimationUtils';
// ...existing code...

export const useShipAnimation = ({
  context,
  updateVisualPosition,
  shipType = 'main-ship'
}: ShipAnimationProps): ShipAnimationReturn => {
  const shipRef = useRef<THREE.Mesh>(null!);
  const currentWorldPosition = useRef<WorldPosition>({ x: 0, y: 0.5, z: 0 });
  // ...existing code...
  const hasInitialized = useRef<boolean>(false);

  // ============================================================================
  // DONNÉES DÉRIVÉES DU CONTEXTE
  // ============================================================================
  const vehicle = context?.vehicle;
  const shipVisualState: VehicleVisualState = vehicle?.visualState || 'uninitialized';
  const shipPosition = useMemo(() => vehicle?.position || { x: 0, y: 0.5, z: 0 }, [vehicle?.position]);
  const basePosition = vehicle?.basePosition || { x: 0, y: 0.5, z: 0 };
  const targetTile = vehicle?.targetTile ?? null;


  // ============================================================================
  // SYNCHRONISATION INITIALE DEPUIS FLEETPOSITION (SOURCE DE VÉRITÉ)
  // ============================================================================
  
  useEffect(() => {
    if (shipPosition && updateVisualPosition && !hasInitialized.current) {
      hasInitialized.current = true;
      currentWorldPosition.current = { ...shipPosition };
      fsmLogger.mouvement(`🚢 [${shipType}] INITIAL SYNC`, {
        position: shipPosition,
        shipVisualState
      });
      updateVisualPosition(shipPosition);
    }
  }, [shipPosition, updateVisualPosition, shipType, shipVisualState]);

  // ============================================================================
  // CONTRÔLE D'ACTIVATION DE L'ANIMATION
  // ============================================================================
  
  // ...animationEnabled logic supprimée, le contrôle d'animation est géré dans useFrame par le switch sur shipVisualState...

  // ============================================================================
  // ANIMATION FRAME OPTIMISÉE - INTERPOLATION DIRECTE
  // ============================================================================
  
  useFrame((state, delta) => {
    // Sortie précoce si le mesh ou le véhicule n'est pas prêt
    if (!shipRef.current || !vehicle) {
      return;
    }

    // Déterminer la position cible selon l'état visuel
    let targetPosition: WorldPosition = currentWorldPosition.current;
    const isTargetTileObject = (tile: unknown): tile is { x: number; y: number; z: number } => {
      return !!tile && typeof tile === 'object' && 'x' in tile && 'y' in tile && 'z' in tile;
    };

    switch (shipVisualState) {
      case 'moving':
        if (isTargetTileObject(targetTile)) {
          targetPosition = {
            x: targetTile.x,
            y: targetTile.y,
            z: targetTile.z
          };
        } else {
          targetPosition = {
            x: basePosition.x,
            y: basePosition.y || 0.5,
            z: basePosition.z
          };
        }
        break;
      case 'returning':
        targetPosition = {
          x: basePosition.x,
          y: basePosition.y || 0.5,
          z: basePosition.z
        };
        break;
      case 'collecting':
        if (isTargetTileObject(targetTile)) {
          targetPosition = {
            x: targetTile.x,
            y: targetTile.y,
            z: targetTile.z
          };
        } else {
          targetPosition = shipPosition;
        }
        break;
      default:
        targetPosition = shipPosition;
    }

    // Interpolation uniquement pour les états actifs
    if (shipVisualState === 'moving' || shipVisualState === 'returning' || shipVisualState === 'collecting') {
      const speed = 1.0;
      const lerpFactor = Math.min(1.0, delta * speed);
      currentWorldPosition.current.x = THREE.MathUtils.lerp(
        currentWorldPosition.current.x,
        targetPosition.x,
        lerpFactor
      );
      currentWorldPosition.current.y = THREE.MathUtils.lerp(
        currentWorldPosition.current.y,
        targetPosition.y,
        lerpFactor
      );
      currentWorldPosition.current.z = THREE.MathUtils.lerp(
        currentWorldPosition.current.z,
        targetPosition.z,
        lerpFactor
      );
    } else {
      currentWorldPosition.current = { ...targetPosition };
    }

    // Mise à jour du mesh et animations visuelles
    shipRef.current.position.set(
      currentWorldPosition.current.x,
      currentWorldPosition.current.y,
      currentWorldPosition.current.z
    );
    applyShipVisualAnimations(
      shipRef.current,
      shipVisualState,
      currentWorldPosition.current.y,
      state.clock.getElapsedTime(),
      delta
    );
    updateVisualPosition(currentWorldPosition.current);
  });

  return {
  shipRef,
  currentPath: [],
  pathIndex: 0,
  shipState: undefined
  };
};
