import { Html } from "@react-three/drei";
import React from "react";

import { config } from '../../config';

export interface ShipHelperProps {
  position: [number, number, number];
  botState: string; // ex: 'evaluating', 'exploring', ...
}

const ShipHelper: React.FC<ShipHelperProps> = ({ position, botState }) => {
  if (!config.showHelpers.ship) return null;
  return (
    <Html position={[position[0], position[1] + 0.7, position[2]]} center distanceFactor={10}>
      <div style={{
        background: "rgba(0,0,32,0.7)",
        color: "#fff",
        padding: "2px 10px",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: "bold",
        userSelect: "none",
        pointerEvents: "none",
        border: "1px solid #888"
      }}>
        {botState}
      </div>
    </Html>
  );
};

export default ShipHelper;
