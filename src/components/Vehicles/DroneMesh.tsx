import { Cone } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";

import DroneHelper from "../Helpers/DroneHelper";

import type { DroneMeshProps } from '../../types/r3f';


const DroneMesh = forwardRef<THREE.Group, DroneMeshProps>(
  ({ color, botId: _botId, context: _context, droneVisualState, droneType: _droneType, meshRef }, ref) => {
    // Récupérer la position du contexte FSM (logique)
  const logicalPosition = _context?.droneFleet?.drones?.[_droneType]?.position || { x: 0, y: 0, z: 0 };
    return (
      <group ref={meshRef || ref}>
        <Cone 
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
  <DroneHelper droneVisualState={droneVisualState} logicalPosition={logicalPosition} />
      </group>
    );
  }
);
DroneMesh.displayName = "DroneMesh";
export default DroneMesh;
