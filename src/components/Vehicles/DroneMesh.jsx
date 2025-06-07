import React from "react";
import { Cone, Html } from "@react-three/drei";

const DroneMesh = ({ color, botId, context, droneState }) => {
  return (
    <>
      <Cone 
        args={[0.15, 0.4, 8]} 
        rotation={[Math.PI, 0, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color={color}
          // État FSM → Couleur émissive
          emissive={
            droneState.state === 'exploring' ? color : 
            droneState.state === 'prospecting' ? "#FFD700" : // Or pour prospection
            "black"
          }
          emissiveIntensity={
            droneState.state === 'exploring' ? 0.8 : 
            droneState.state === 'prospecting' ? 1.0 : // Plus intense pour prospection
            0.2
          }
        />
      </Cone>
      
      {/* ID LABEL - Drone explorateur */}
      <Html position={[0, 0.3, 0]} center>
        <div style={{ 
          color: 'rgba(255,255,255,0.6)', 
          fontSize: '9px', 
          background: 'rgba(0,0,0,0.5)', 
          padding: '1px 4px', 
          borderRadius: '3px',
          fontFamily: 'monospace',
          textAlign: 'center'
        }}>
          {context?.droneFleet?.drones?.explorer?.id || `${botId}-explorer`}
        </div>
      </Html>
    </>
  );
};

export default DroneMesh;
