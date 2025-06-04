import React from "react";
import { Html } from "@react-three/drei";

const ShipMesh = ({ color, botId, context }) => {
  return (
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
      
      {/* ID LABEL - Vaisseau principal */}
      <Html position={[0, 0.4, 0]} center>
        <div style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '10px', 
          background: 'rgba(0,0,0,0.6)', 
          padding: '2px 6px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          textAlign: 'center'
        }}>
          {context?.vehicle?.id || `${botId}-ship`}
        </div>
      </Html>
    </mesh>
  );
};

export default ShipMesh;
