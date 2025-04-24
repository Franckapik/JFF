import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useTileStore } from "../store/useTileStore";

const DroneMovement = ({ drone }) => {
  const groupRef = useRef();
  const targetVehicle = useTileStore((state) => state.targetVehicle);
  const tiles = useTileStore((state) => state.tiles);
  const updateDrone = useTileStore((state) => state.updateDrone);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

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
      const direction = new Vector3().subVectors(targetPosition, currentPosition);
      const distance = direction.length();

      if (distance > 0.1) {
        direction.normalize();
        groupRef.current.position.addScaledVector(direction, delta * 2); // Vitesse du drone
        updateDrone(drone.id, { isMoving: true });
      } else {
        updateDrone(drone.id, { isMoving: false, targetTile: null });
      }
    }
  });

  return (
    <group ref={groupRef} position={[drone.position.x, drone.position.y, drone.position.z]}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
};

export default DroneMovement;