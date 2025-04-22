import React, { useEffect, useRef } from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const TargetMovement = ({ initialPosition, children }) => {
  const groupRef = useRef();
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle from store
  const targetVehicleTargetTile = useTileStore((state) => state.targetVehicleTargetTile); // Get target tile coord
  const tiles = useTileStore((state) => state.tiles); // Get tiles from store

  const speed = 0.5; // Movement speed (units per second)

  useEffect(() => {
    // Ensure the vehicle starts at the initial position
    if (targetVehicle?.position) {
      groupRef.current.position.set(
        targetVehicle.position.x,
        targetVehicle.position.y,
        targetVehicle.position.z
      );
    }
  }, [targetVehicle]);

  useFrame((_, delta) => {
    if (groupRef.current && targetVehicle?.position && targetVehicleTargetTile) {
      const targetTile = tiles[targetVehicleTargetTile];
      if (targetTile) {
        const targetPosition = new Vector3(
          targetTile.position.x,
          targetTile.position.y,
          targetTile.position.z
        );

        // Calculate the direction vector to the target position
        const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
        const distance = direction.length();

        if (distance > 0.01) {
          // Normalize the direction and move at a constant speed
          direction.normalize();
          const moveDistance = Math.min(speed * delta, distance); // Ensure we don't overshoot the target
          groupRef.current.position.addScaledVector(direction, moveDistance);
        }
      }
    }
  });

  return (
    <>
      {/* Render the helper dynamically */}
      {targetVehicleTargetTile && tiles[targetVehicleTargetTile] && (
        <mesh
          position={[
            tiles[targetVehicleTargetTile].position.x,
            0.2,
            tiles[targetVehicleTargetTile].position.z,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="yellow" /> {/* Updated color to yellow */}
        </mesh>
      )}

      {/* Render the moving object */}
      <group ref={groupRef}>{children}</group>
    </>
  );
};

export default TargetMovement;
