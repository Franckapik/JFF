import React, { useEffect, useRef } from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const TargetMovement = ({ initialPosition, children }) => {
  const groupRef = useRef();
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle from store
  const targetVehicleTargetTile = useTileStore((state) => state.targetVehicleTargetTile); // Get target tile coord
  const tiles = useTileStore((state) => state.tiles); // Get tiles from store

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

  useFrame(() => {
    // Update the group's position dynamically
    if (groupRef.current && targetVehicle?.position) {
      groupRef.current.position.lerp(
        new Vector3(
          targetVehicle.position.x,
          targetVehicle.position.y,
          targetVehicle.position.z
        ),
        0.1
      );
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
