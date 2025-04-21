import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { Vector3 } from "three";

const RandomMovement = ({ initialPosition, children }) => {
  const currentPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const targetPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const previousPosition = useRef(null); // Track the previous position
  const groupRef = useRef();
  const getNeighbors = useTileStore((state) => state.getNeighbors); // Get neighbors from the store
  const updateTileColor = useTileStore((state) => state.updateTileColor); // Update tile color
  const speed = 0.5; // Movement speed (units per second)

  const setNextTarget = () => {
    // Find the current tile based on the position
    const currentTile = Object.values(useTileStore.getState().tiles).find(
      (tile) =>
        Math.abs(tile.position.x - currentPosition.current.x) < 0.1 &&
        Math.abs(tile.position.z - currentPosition.current.z) < 0.1
    );

    if (currentTile) {
      // Reset the color of the previous tile
      if (previousPosition.current) {
        updateTileColor(previousPosition.current.coord, "white"); // Reset to default color
      }

      // Get neighboring tiles
      const neighbors = getNeighbors(currentTile.coord).filter((neighbor) => {
        // Exclude the previous position
        return (
          !previousPosition.current ||
          neighbor.position.x !== previousPosition.current.x ||
          neighbor.position.z !== previousPosition.current.z
        );
      });

      if (neighbors.length > 0) {
        // Choose a random neighbor and set it as the target position
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        previousPosition.current = { ...currentTile }; // Update the previous position
        targetPosition.current.set(randomNeighbor.position.x, randomNeighbor.position.y, randomNeighbor.position.z);

        // Highlight the target tile
        updateTileColor(randomNeighbor.coord, "yellow");
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

      // Change the color of the current tile during movement
      const progress = 1 - distance / direction.length();
      if (progress < 0.5 && previousPosition.current) {
        updateTileColor(previousPosition.current.coord, "blue"); // Midway color
      } else {
        const currentTile = Object.values(useTileStore.getState().tiles).find(
          (tile) =>
            Math.abs(tile.position.x - currentPosition.current.x) < 0.1 &&
            Math.abs(tile.position.z - currentPosition.current.z) < 0.1
        );
        if (currentTile) {
          updateTileColor(currentTile.coord, "green"); // Final color
        }
      }
    } else {
      // If the target is reached, immediately set the next target
      setNextTarget();
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default RandomMovement;
