import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { Vector3 } from "three";

const RandomMovement = ({ initialPosition, children }) => {
  const currentPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const [targetPosition, setTargetPosition] = useState(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const groupRef = useRef();
  const getNeighbors = useTileStore((state) => state.getNeighbors); // Get neighbors from the store

  useEffect(() => {
    const interval = setInterval(() => {
      // Find the current tile based on the position
      const currentTile = Object.values(useTileStore.getState().tiles).find(
        (tile) =>
          Math.abs(tile.position.x - currentPosition.current.x) < 0.1 &&
          Math.abs(tile.position.z - currentPosition.current.z) < 0.1
      );

      if (currentTile) {
        // Get neighboring tiles
        const neighbors = getNeighbors(currentTile.coord);
        if (neighbors.length > 0) {
          // Choose a random neighbor and set it as the target position
          const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
          setTargetPosition(new Vector3(randomNeighbor.position.x, randomNeighbor.position.y, randomNeighbor.position.z));
        }
      }
    }, 2000); // Update target position every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [getNeighbors]);

  useFrame((_, delta) => {
    // Interpolate (lerp) the position towards the target position
    currentPosition.current.lerp(targetPosition, delta * 2); // Adjust the speed with delta * factor

    // Update the group's position directly
    if (groupRef.current) {
      groupRef.current.position.copy(currentPosition.current);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default RandomMovement;
