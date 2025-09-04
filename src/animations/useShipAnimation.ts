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
    if (!hasInitialized.current && shipRef.current && updateVisualPosition) {
      hasInitialized.current = true;
      // Pour l'initialisation, utiliser la vraie position de la tuile (parent group position)
      const parentPosition = shipRef.current.parent?.position;
      if (parentPosition) {
        const actualPosition = {
          x: parentPosition.x,
          y: parentPosition.y,
          z: parentPosition.z,
        };
        currentWorldPosition.current = actualPosition;
        updateVisualPosition(actualPosition);
        fsmLogger.mouvement(`🚢 [${shipType}] INITIAL SYNC`, { 
          parentPosition: parentPosition, 
          actualPosition 
        });
      }
    }
  }, [updateVisualPosition, shipType]);

  // ============================================================================
  // ANIMATION FRAME - Position selon état visuel uniquement
  // ============================================================================
  useFrame((state, delta) => {
    if (!shipRef.current) return;

    const parentPosition = shipRef.current.parent?.position || { x: 0, y: 0, z: 0 };

    // Utiliser position du contexte dès qu'elle existe, sinon garder position actuelle
    if (vehicle?.position && shipVisualState !== "uninitialized") {
      let target: WorldPosition = vehicle.position;
      if (targetVehicleTile && typeof targetVehicleTile === 'object' && 'position' in targetVehicleTile) {
        target = targetVehicleTile.position;
      }
      
      // Convertir la position absolue en position relative au parent group
      const relativeTarget = {
        x: target.x - parentPosition.x,
        y: target.y - parentPosition.y,
        z: target.z - parentPosition.z,
      };
      
      if (shipVisualState === "moving" || shipVisualState === "collecting") {
        // Animation interpolée pour les états de mouvement (en coordonnées relatives)
        const lerpFactor = Math.min(1.0, delta);
        const currentRelative = {
          x: shipRef.current.position.x,
          y: shipRef.current.position.y,
          z: shipRef.current.position.z,
        };
        
        const newRelative = {
          x: THREE.MathUtils.lerp(currentRelative.x, relativeTarget.x, lerpFactor),
          y: THREE.MathUtils.lerp(currentRelative.y, relativeTarget.y, lerpFactor),
          z: THREE.MathUtils.lerp(currentRelative.z, relativeTarget.z, lerpFactor),
        };
        
        shipRef.current.position.set(newRelative.x, newRelative.y, newRelative.z);
        
        // Mettre à jour currentWorldPosition pour la cohérence
        currentWorldPosition.current = {
          x: parentPosition.x + newRelative.x,
          y: parentPosition.y + newRelative.y,
          z: parentPosition.z + newRelative.z,
        };
      } else {
        // Position directe pour les autres états (en coordonnées relatives)
        shipRef.current.position.set(relativeTarget.x, relativeTarget.y, relativeTarget.z);
        currentWorldPosition.current = { ...target };
      }
    } else {
      // Si pas de position dans le contexte, rester à la position relative initiale
      shipRef.current.position.set(initialPosition?.x || 0, initialPosition?.y || 0, initialPosition?.z || 0);
      currentWorldPosition.current = {
        x: parentPosition.x + (initialPosition?.x || 0),
        y: parentPosition.y + (initialPosition?.y || 0),
        z: parentPosition.z + (initialPosition?.z || 0),
      };
    }

    // Mise à jour du mesh et animations
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
