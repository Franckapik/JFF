import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";

import { config } from '../../config';

export interface ShipHelperProps {
  botState: string; // ex: 'evaluating', 'exploring', ...
  logicalPosition: { x: number; y: number; z: number };
}

const ShipHelper: React.FC<ShipHelperProps> = ({ botState, logicalPosition }) => {
  const [worldPosition, setWorldPosition] = useState({ x: 0, z: 0 });
  const groupRef = useRef<THREE.Group>(null);

  // Récupérer la position mondiale du groupe parent
  useFrame(() => {
    if (groupRef.current?.parent) {
      const worldPos = new THREE.Vector3();
      groupRef.current.parent.getWorldPosition(worldPos);
      setWorldPosition({ x: worldPos.x, z: worldPos.z });
    }
  });

  if (!config.showHelpers.ship) return null;
  
  const positionText = `${(worldPosition.x ?? 0).toFixed(1)}, ${(worldPosition.z ?? 0).toFixed(1)}`;
  const logicalText = `${(logicalPosition?.x ?? 0).toFixed(1)}, ${(logicalPosition?.z ?? 0).toFixed(1)}`;
  
  return (
    <group ref={groupRef}>
      <Html position={[-1.5, 1.2, 0]} center distanceFactor={10}>
        <div style={{
          background: "rgba(0,0,32,0.8)",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
          userSelect: "none",
          pointerEvents: "none",
          border: "1px solid #888",
          textAlign: "center",
          minWidth: "120px"
        }}>
          <div>🚀 {botState}</div>
          <div style={{ fontSize: "18px", opacity: 0.7 }}>
            <span title="Position visuelle">V({positionText})</span><br/>
            <span title="Position logique">F({logicalText})</span>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default ShipHelper;
