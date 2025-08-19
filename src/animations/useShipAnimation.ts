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

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import type { WorldPosition } from "../types";
import type { ShipAnimationProps, ShipAnimationReturn } from "../types/r3f";
import type { VehicleVisualState } from "../types/vehicle.d.ts";

import fsmLogger from "../logger/fsmLogger.ts";

import { applyShipVisualAnimations } from "./utils/shipAnimationUtils";
// ...existing code...

export const useShipAnimation = ({ context, updateVisualPosition, shipType = "main-ship", initialPosition }: ShipAnimationProps): ShipAnimationReturn => {
  const shipRef = useRef<THREE.Group>(null!);
  const hasInitialized = useRef<boolean>(false);
  const vehicle = context?.vehicle;
  const shipVisualState: VehicleVisualState = vehicle?.visualState || "uninitialized";
  const currentWorldPosition = useRef<WorldPosition>(initialPosition ?? { x: 0, y: 0.5, z: 0 });
  const targetVehicleTile = vehicle?.targetVehicleTile ?? null;

  // ============================================================================
  // SYNCHRONISATION INITIALE - Une seule fois au montage
  // ============================================================================
  useEffect(() => {
    if (!hasInitialized.current && initialPosition && updateVisualPosition) {
      hasInitialized.current = true;
      currentWorldPosition.current = { ...initialPosition };
      updateVisualPosition(initialPosition);
      fsmLogger.mouvement(`🚢 [${shipType}] INITIAL SYNC`, { position: initialPosition });
    }
  }, [initialPosition, updateVisualPosition, shipType]);

  // ============================================================================
  // ANIMATION FRAME - Position selon état visuel uniquement
  // ============================================================================
  useFrame((state, delta) => {
    if (!shipRef.current) return;

    // Utiliser position du contexte dès qu'elle existe, sinon garder position actuelle
    if (vehicle?.position && shipVisualState !== "uninitialized") {
      let target: WorldPosition = vehicle.position;
      if (targetVehicleTile && typeof targetVehicleTile === 'object' && 'position' in targetVehicleTile) {
        target = targetVehicleTile.position;
      }
      if (shipVisualState === "moving" || shipVisualState === "collecting") {
        // Animation interpolée pour les états de mouvement
        const lerpFactor = Math.min(1.0, delta);
        currentWorldPosition.current.x = THREE.MathUtils.lerp(currentWorldPosition.current.x, target.x, lerpFactor);
        currentWorldPosition.current.y = THREE.MathUtils.lerp(currentWorldPosition.current.y, target.y, lerpFactor);
        currentWorldPosition.current.z = THREE.MathUtils.lerp(currentWorldPosition.current.z, target.z, lerpFactor);
      } else {
        // Position directe pour les autres états
        currentWorldPosition.current = { ...target };
      }
    }

    // Mise à jour du mesh et animations
    shipRef.current.position.set(currentWorldPosition.current.x, currentWorldPosition.current.y, currentWorldPosition.current.z);
    const shipMesh = shipRef.current.children.find(child => child.type === "Mesh") as THREE.Mesh;
    if (shipMesh) {
      applyShipVisualAnimations(shipMesh, shipVisualState, currentWorldPosition.current.y, state.clock.getElapsedTime(), delta);
    }
  });

  return {
    shipRef,
    currentPath: [],
    pathIndex: 0,
    shipState: undefined,
  };
};
