import type { Ref } from "react";
import { forwardRef } from "react";
import * as THREE from "three";

import type { ShipMeshProps } from "../../types/r3f";

interface ShipMeshWithRefProps extends ShipMeshProps {
  meshRef?: Ref<THREE.Mesh>;
}

const ShipMesh = forwardRef<THREE.Mesh, ShipMeshWithRefProps>(
  ({ color, botId: _botId, context, meshRef }, ref) => {

  // 📊 INDICATEUR DE RESSOURCES (si le vaisseau en a)
  const currentResources = context?.vehicle?.resources;
  const hasResources = currentResources && 
    (currentResources.food > 0 || currentResources.debris > 0 || currentResources.special > 0);
  
  return (
    <mesh ref={meshRef || ref} position={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color={color} 
        // Ajout d'un effet métallique si le vaisseau a des ressources
        metalness={hasResources ? 0.3 : 0.1}
        roughness={hasResources ? 0.4 : 0.8}
      />
    </mesh>
  );
  }
);
ShipMesh.displayName = "ShipMesh";
export default ShipMesh;
