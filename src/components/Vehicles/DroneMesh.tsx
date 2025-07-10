import { Cone } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";

import DroneHelper from "../Helpers/DroneHelper";

import type { DroneMeshProps } from '../../types/r3f';


const DroneMesh = forwardRef<THREE.Mesh, DroneMeshProps>(
  ({ color, botId: _botId, context: _context, droneVisualState, droneType: _droneType, meshRef }, ref) => {
    return (
      <>
        <Cone 
          ref={meshRef || ref}
          args={[0.15, 0.4, 8]} 
          rotation={[Math.PI, 0, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color={color}
            emissive={
              droneVisualState === 'scanning' ? color : 
              "black"
            }
            emissiveIntensity={
              droneVisualState === 'scanning' ? 0.8 : 
              0.2
            }
          />
        </Cone>
        {/* Helper visuel pour l'état du drone */}
        <DroneHelper position={[0, 0, 0]} droneVisualState={droneVisualState} />
      </>
    );
  }
);
DroneMesh.displayName = "DroneMesh";
export default DroneMesh;
