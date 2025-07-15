

import { forwardRef } from "react";

import type * as THREE from "three";

import type { ShipMeshProps } from "../../types/r3f";
import ShipHelper from "../Helpers/ShipHelper";

const ShipMesh = forwardRef<THREE.Mesh, ShipMeshProps>(
  ({ color, botId: _botId, context, meshRef, botStateValue = "unknown" }, ref) => {
    // 📊 INDICATEUR DE RESSOURCES (si le vaisseau en a)
    const currentResources = context?.vehicle?.resources;
    const hasResources = currentResources && 
      (currentResources.food > 0 || currentResources.debris > 0 || currentResources.special > 0);
    return (
      <>
        <mesh ref={meshRef || ref} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={color} 
            metalness={hasResources ? 0.3 : 0.1}
            roughness={hasResources ? 0.4 : 0.8}
          />
        </mesh>
        {/* Helper visuel pour l'état du vaisseau */}
        <ShipHelper position={[0, 0, 0]} botState={botStateValue} />
      </>
    );
  }
);
ShipMesh.displayName = "ShipMesh";
export default ShipMesh;
