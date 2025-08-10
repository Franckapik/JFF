

import { forwardRef } from "react";

import type * as THREE from "three";

import type { ShipMeshProps } from "../../types/r3f";
import type { FSMContext } from "../../types/fsm";
import ShipHelper from "../Helpers/ShipHelper";

// === Animation et Tracking ===
import { useShipAnimation } from "../../animations/useShipAnimation";
import { useShipTracker } from "../../ai/fsm/hooks/trackers/ship/useShipTracker";

/**
 * Détecte si le vaisseau est dans un état de mouvement
 * @param currentState - État actuel de la machine FSM
 * @returns true si le vaisseau est en mouvement
 */
const isShipMoving = (currentState?: string): boolean => {
  const movementStates = [
    'collecting_ship_moving_to_tile',
    'collecting_ship_returning'
  ];
  return movementStates.includes(currentState || '');
};

const ShipMesh = forwardRef<THREE.Mesh, ShipMeshProps>(
  ({ color, botId = "defaultBot", context, send, meshRef, botStateValue = "unknown", isMoving }, ref) => {
    
    // ============================================================================
    // HOOKS D'ANIMATION ET DE TRACKING (TOUJOURS APPELÉS)
    // ============================================================================
    
    // Hook de tracking pour la position du vaisseau
    const updateShipPosition = useShipTracker({
      context: context || {} as FSMContext,
      send: send || (() => {}),
      botId,
      shipType: 'main-ship'
    });
    
    // Détection automatique du mouvement si pas explicitement fourni
    const shipIsMoving = isMoving ?? isShipMoving(context?.currentState);
    
    // Hook d'animation principal
    const { shipRef, shipState } = useShipAnimation({
      context,
      updateVisualPosition: updateShipPosition,
      shipType: 'main-ship',
      isActive: !!(context && send && context.vehicle),
      isMoving: shipIsMoving
    });
    
    // ============================================================================
    // RENDU CONDITIONNEL SELON LA VALIDITÉ DU CONTEXTE
    // ============================================================================
    
    // Si pas de contexte ou send valides, rendu simple sans helper
    if (!context || !send || !context.vehicle) {
      return (
        <mesh ref={meshRef || ref} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
    
    // ============================================================================
    // RENDU ET ÉTAT VISUEL
    // ============================================================================
    
    // 📊 INDICATEUR DE RESSOURCES (si le vaisseau en a)
    const currentResources = context?.vehicle?.resources;
    const hasResources = currentResources && 
      (currentResources.food > 0 || currentResources.debris > 0 || currentResources.special > 0);
      
    return (
      <>
        <mesh 
          ref={meshRef || ref || shipRef} 
          position={[0, 0, 0]} 
          castShadow
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={color} 
            metalness={hasResources ? 0.3 : 0.1}
            roughness={hasResources ? 0.4 : 0.8}
          />
        </mesh>
        {/* Helper visuel pour l'état du vaisseau */}
        <ShipHelper 
          position={[0, 0, 0]} 
          botState={shipState || botStateValue} 
        />
      </>
    );
  }
);
ShipMesh.displayName = "ShipMesh";
export default ShipMesh;
