import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";
import { useTileStore } from "../store/useTileStore";
import { Torus } from "@react-three/drei"; // Import Torus from drei

const DroneMovement = ({ drone, children }) => {
  const groupRef = useRef();
  const targetVehicle = useTileStore((state) => state.targetVehicle);
  const tiles = useTileStore((state) => state.tiles);
  const updateDrone = useTileStore((state) => state.updateDrone);

  useFrame((_, delta) => {
    if (!groupRef.current || !drone.position) return; // Ensure drone.position is defined

    const currentPosition = new Vector3(
      groupRef.current.position.x,
      groupRef.current.position.y,
      groupRef.current.position.z
    );

    let targetPosition;

    if (drone.targetTile) {
      // Si le drone a une tuile cible
      const targetTile = tiles[drone.targetTile];
      
      if (targetTile) {
        targetPosition = new Vector3(
          targetTile.position.x,
          targetTile.position.y,
          targetTile.position.z
        );
      }
    } else if (targetVehicle) {
      // Sinon, suivre le véhicule cible
      targetPosition = new Vector3(
        targetVehicle.position.x,
        targetVehicle.position.y,
        targetVehicle.position.z
      );
    }
   

    if (targetPosition) {
      // Ignore the y component when calculating the distance
      const flatCurrentPosition = new Vector3(currentPosition.x, 0, currentPosition.z);
      const flatTargetPosition = new Vector3(targetPosition.x, 0, targetPosition.z);
      const direction = new Vector3().subVectors(flatTargetPosition, flatCurrentPosition);
      const distance = direction.length();


      if (distance > 0.1) { // Adjust this threshold if necessary
        direction.normalize();
        groupRef.current.position.addScaledVector(direction, delta * 2); // Vitesse du drone
        groupRef.current.position.y = 1.5; // Maintain height of +1.5
        updateDrone(drone.id, { isMoving: true });
      } else {
        groupRef.current.position.y = 1.5; // Maintain height of +1.5
        updateDrone(drone.id, { isMoving: false, targetTile: null });

      }
    }

    
  });

  return (
    <group
      ref={groupRef}
      position={[
        drone.position?.x || 0,
        1.5, // Ensure the drone starts at height +1.5
        drone.position?.z || 0,
      ]}
    >
      {children}
    </group>
  );
};

export default DroneMovement;