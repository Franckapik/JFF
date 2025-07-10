import { Html } from "@react-three/drei";
import React from "react";

import type { DroneVisualState } from "../../types/drone";

export interface DroneHelperProps {
  position: [number, number, number];
  droneVisualState: DroneVisualState;
}

const DroneHelper: React.FC<DroneHelperProps> = ({ position, droneVisualState }) => (
  <Html position={[position[0], position[1] + 0.5, position[2]]} center distanceFactor={10}>
    <div style={{
      background: "rgba(0,0,0,0.7)",
      color: "#fff",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "16px",
      fontWeight: "bold",
      userSelect: "none",
      pointerEvents: "none",
      border: "1px solid #888"
    }}>
      {droneVisualState}
    </div>
  </Html>
);

export default DroneHelper;
