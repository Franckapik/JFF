import React from "react";
import { Cone } from "@react-three/drei";

const DroneMesh = ({ color, botId, context, droneState, droneType = 'explorer' }) => {
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
            "black"
          }
          emissiveIntensity={
            droneState.state === 'exploring' ? 0.8 : 
            0.2
          }
        />
      </Cone>
      

    </>
  );
};

export default DroneMesh;
