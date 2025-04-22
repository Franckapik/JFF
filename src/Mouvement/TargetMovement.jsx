import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const TargetMovement = ({ initialPosition, children }) => {
  const currentPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const groupRef = useRef();
  const [firstTilePosition, setFirstTilePosition] = useState(null); // Static position of the first tile

  useEffect(() => {
    // Ensure the vehicle starts at the initial position
    currentPosition.current.set(initialPosition.x, initialPosition.y, initialPosition.z);

    // Set the first tile position
    setFirstTilePosition(initialPosition);
  }, [initialPosition]);

  useFrame(() => {
    // Update the group's position directly
    if (groupRef.current) {
      groupRef.current.position.copy(currentPosition.current);
    }
  });

  return (
    <>
      {/* Render the static ring on the first tile */}
      {firstTilePosition && (
        <mesh position={[firstTilePosition.x, 0.2, firstTilePosition.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="red" side={2} />
        </mesh>
      )}

      {/* Render the moving object */}
      <group ref={groupRef}>{children}</group>
    </>
  );
};

export default TargetMovement;
