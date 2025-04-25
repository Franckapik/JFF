import React, { useEffect, useRef, useState } from "react";
import { useTileStore } from "../stores/useNewTileStore"; // Import tile store
import usePlayerStore from "../stores/usePlayerStore"; // Import player store
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const TargetMovement = ({ children }) => {
  const groupRef = useRef();
  const playerVehicle = usePlayerStore((state) => state.players.player1.vehicles.ship); // Get player vehicle
  const updateShip = usePlayerStore((state) => state.updateShip); // Use the generic updateShip function
  const tiles = useTileStore((state) => state.tiles); // Get tiles from the store
  const selectedTile = useTileStore((state) => state.selectedTile); // Get the selected tile

  const [path, setPath] = useState([]); // Store the calculated path
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Index of the current target tile

  const speed = 1; // Movement speed (units per second)

  // Calculate the path when a new tile is selected
  useEffect(() => {
    if (selectedTile && tiles[selectedTile] && playerVehicle?.coord) {
      const calculatePath = (startCoord, targetCoord) => {
        const queue = [[startCoord]];
        const visited = new Set();
        let foundPath = [];

        while (queue.length > 0) {
          const currentPath = queue.shift();
          const currentCoord = currentPath[currentPath.length - 1];

          if (currentCoord === targetCoord) {
            foundPath = currentPath;
            break;
          }

          if (!visited.has(currentCoord)) {
            visited.add(currentCoord);
            const neighbors = tiles[currentCoord]?.neighbors || [];
            neighbors.forEach((neighbor) => {
              if (!visited.has(neighbor) && tiles[neighbor]?.walkable) {
                queue.push([...currentPath, neighbor]);
              }
            });
          }
        }

        return foundPath;
      };

      const calculatedPath = calculatePath(playerVehicle.coord, selectedTile);
      setPath(calculatedPath);
      setCurrentTargetIndex(0); // Reset the index
    }
  }, [selectedTile, tiles, playerVehicle?.coord]);

  // Set the initial position of the vehicle
  useEffect(() => {
    if (playerVehicle?.position && groupRef.current) {
      groupRef.current.position.set(
        playerVehicle.position.x,
        playerVehicle.position.y,
        playerVehicle.position.z
      );
    }
  }, [playerVehicle]);

  // Move the vehicle along the path
  useFrame((_, delta) => {
    if (!path || path.length === 0 || !groupRef.current) return;

    const currentTargetCoord = path[currentTargetIndex];
    const currentTargetTile = tiles[currentTargetCoord];

    if (currentTargetTile) {
      const targetPosition = new Vector3(
        currentTargetTile.position.x,
        currentTargetTile.position.y,
        currentTargetTile.position.z
      );

      const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
      const distance = direction.length();

      if (distance > 0.01) {
        direction.normalize();
        const moveDistance = Math.min(speed * delta, distance);
        groupRef.current.position.addScaledVector(direction, moveDistance);

        // Calculate progress as a percentage of the path completed
        const progress =
          ((currentTargetIndex + (1 - distance / targetPosition.length())) / path.length) * 100;

        updateShip({
          position: {
            x: groupRef.current.position.x,
            y: groupRef.current.position.y,
            z: groupRef.current.position.z,
          },
          progress: Math.min(progress, 100), // Ensure progress does not exceed 100%
          isMoving: true,
        });
      } else if (currentTargetIndex < path.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1); // Move to the next tile in the path

        updateShip({
          position: {
            x: currentTargetTile.position.x,
            y: currentTargetTile.position.y,
            z: currentTargetTile.position.z,
          },
          coord: currentTargetCoord,
        });
      } else {
        updateShip({
          position: {
            x: currentTargetTile.position.x,
            y: currentTargetTile.position.y,
            z: currentTargetTile.position.z,
          },
          coord: currentTargetCoord,
          progress: 100, // Set progress to 100% when the target is reached
          isMoving: false,
        });
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default TargetMovement;
