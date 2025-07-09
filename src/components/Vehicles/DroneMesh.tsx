import { Cone } from "@react-three/drei";
import React from "react";

import type { DroneMeshProps } from '../../types/r3f';

const DroneMesh: React.FC<DroneMeshProps> = ({ 
  color, 
  botId: _botId,
  context: _context,
  droneState,
  droneType: _droneType
}) => {
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
            droneState.state === 'scanning' ? color : 
            "black"
          }
          emissiveIntensity={
            droneState.state === 'scanning' ? 0.8 : 
            0.2
          }
        />
      </Cone>
    </>
  );
};

export default DroneMesh;
