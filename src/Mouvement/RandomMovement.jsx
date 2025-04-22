import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { Vector3 } from "three";

const RandomMovement = ({ initialPosition, children }) => {
  const currentPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const targetPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const previousTileCoord = useRef(null); // Track the previous tile's coord
  const groupRef = useRef();
  const [firstTilePosition, setFirstTilePosition] = useState(null); // Static position of the first tile
  const [startMarker, setStartMarker] = useState(null); // Position of the start marker
  const [endMarker, setEndMarker] = useState(null); // Position of the end marker
  const getNeighbors = useTileStore((state) => state.getNeighbors); // Get neighbors from the store
  const speed = 0.5; // Movement speed (units per second)

  const setNextTarget = () => {
    // Find the current tile based on the position
    const currentTile = Object.values(useTileStore.getState().tiles).find(
      (tile) =>
        Math.abs(tile.position.x - currentPosition.current.x) < 0.1 &&
        Math.abs(tile.position.z - currentPosition.current.z) < 0.1
    );

    if (currentTile) {
      // Set the first tile position if not already set
      if (!firstTilePosition) {
        setFirstTilePosition(currentTile.position);
      }

      // Update the start marker to the current tile's position
      setStartMarker(currentTile.position);

      // Get neighboring tiles
      const neighbors = getNeighbors(currentTile.coord).filter((neighbor) => {
        // Exclude the previous tile
        return neighbor.coord !== previousTileCoord.current;
      });

      if (neighbors.length > 0) {
        // Choose a random neighbor and set it as the target position
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        previousTileCoord.current = currentTile.coord; // Update the previous tile's coord
        targetPosition.current.set(randomNeighbor.position.x, randomNeighbor.position.y, randomNeighbor.position.z);

        // Update the end marker to the target tile's position
        setEndMarker(randomNeighbor.position);
      }
    }
  };

  useEffect(() => {
    setNextTarget(); // Set the initial target position
  }, [getNeighbors]);

  useFrame((_, delta) => {
    // Calculate the direction vector to the target position
    const direction = new Vector3().subVectors(targetPosition.current, currentPosition.current);
    const distance = direction.length();

    if (distance > 0.01) {
      // Normalize the direction and move at a constant speed
      direction.normalize();
      const moveDistance = Math.min(speed * delta, distance); // Ensure we don't overshoot the target
      currentPosition.current.addScaledVector(direction, moveDistance);

      // Update the group's position directly
      if (groupRef.current) {
        groupRef.current.position.copy(currentPosition.current);
      }
    } else {
      // If the target is reached, immediately set the next target
      setNextTarget();
    }
  });

  return (
    <>
      {/* Render the static ring on the first tile */}
      {firstTilePosition && (
        <mesh position={[firstTilePosition.x, 0.2, firstTilePosition.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="blue" side={2} /> {/* Updated color to blue */}
        </mesh>
      )}

      {/* Render the start marker */}
      {startMarker && (
        <mesh position={[startMarker.x, 0.2, startMarker.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      )}

      {/* Render the end marker */}
      {endMarker && (
        <mesh position={[endMarker.x, 0.2, endMarker.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="green" />
        </mesh>
      )}

      {/* Render the moving object */}
      <group ref={groupRef}>{children}</group>
    </>
  );
};

export default RandomMovement;
