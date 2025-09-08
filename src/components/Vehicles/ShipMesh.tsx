

import { forwardRef } from "react";

import type * as THREE from "three";

import type { FSMContext } from "../../types/fsm";
import type { ShipMeshProps } from "../../types/r3f";
import ShipHelper from "../Helpers/ShipHelper";

// === Animation et Tracking ===
import { useShipTracker } from "../../ai/fsm/hooks/trackers/ship/useShipTracker";
import { useShipAnimation } from "../../animations/useShipAnimation";

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

const ShipMesh = forwardRef<THREE.Group, ShipMeshProps>(
  ({ color, botId = "defaultBot", context, send, initialPosition, meshRef, botStateValue = "unknown", isMoving }, ref) => {
    
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
    const shipIsMoving = isMoving ?? isShipMoving(context?.fsmState);
    
    // Hook d'animation principal
    const { shipRef, shipState } = useShipAnimation({
      context,
      initialPosition: initialPosition || null, // Source de vérité depuis Scene/Fleet
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
        <group ref={ref}>
          <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
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
      <group ref={shipRef}>
        <mesh 
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
          botState={shipState || botStateValue} 
          logicalPosition={context?.vehicle?.position || { x: 0, y: 0, z: 0 }}
        />
      </group>
    );
  }
);
ShipMesh.displayName = "ShipMesh";
export default ShipMesh;
