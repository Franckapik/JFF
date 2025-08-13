import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";

import { config } from '../../config';
import type { DroneVisualState } from "../../types/drone";

export interface DroneHelperProps {
  droneVisualState: DroneVisualState;
  logicalPosition: { x: number; y: number; z: number };
}

const DroneHelper: React.FC<DroneHelperProps> = ({ droneVisualState, logicalPosition }) => {
  const [worldPosition, setWorldPosition] = useState({ x: 0, z: 0 });
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current?.parent) {
      const worldPos = new THREE.Vector3();
      groupRef.current.parent.getWorldPosition(worldPos);
      setWorldPosition({ x: worldPos.x, z: worldPos.z });
    }
  });

  if (!config.showHelpers.drone) return null;

  const positionText = `${(worldPosition.x ?? 0).toFixed(1)}, ${(worldPosition.z ?? 0).toFixed(1)}`;
  const logicalText = `${(logicalPosition?.x ?? 0).toFixed(1)}, ${(logicalPosition?.z ?? 0).toFixed(1)}`;

  return (
    <group ref={groupRef}>
      <Html position={[1.5, 1.2, 0]} center distanceFactor={10}>
        <div style={{
          background: "rgba(0,0,0,0.8)",
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
          <div>🚁 {droneVisualState}</div>
          <div style={{ fontSize: "18px", opacity: 0.7 }}>
            <span title="Position visuelle">V({positionText})</span><br/>
            <span title="Position logique">F({logicalText})</span>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default DroneHelper;