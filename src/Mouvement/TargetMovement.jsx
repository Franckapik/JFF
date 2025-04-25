import React, { useEffect, useRef, useState } from "react";
import { useTileStore } from "../stores/useNewTileStore"; // Import tile store
import usePlayerStore from "../stores/usePlayerStore"; // Import player store
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const TargetMovement = ({ playerId, children }) => {
  const groupRef = useRef();
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Get globally selected vehicle
  const playerVehicles = usePlayerStore((state) => state.players[playerId].vehicles); // Get all vehicles for the player
  const playerVehicle =
    selectedVehicle.playerId === playerId && selectedVehicle.vehicleId === "ship"
      ? playerVehicles.ship
      : playerVehicles.drones.find((drone) => drone.id === selectedVehicle.vehicleId); // Get the selected vehicle
  const updateShip = usePlayerStore((state) => state.updateShip); // Use the generic updateShip function
  const tiles = useTileStore((state) => state.tiles); // Get tiles from the store
  const selectedTile = useTileStore((state) => state.selectedTile); // Get the selected tile
  const clearSelectedTile = useTileStore((state) => state.clearSelectedTile); // Get the clearSelectedTile function

  const [path, setPath] = useState([]); // Store the calculated path
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Index of the current target tile
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Track distance traveled
  const [resourcesCollected, setResourcesCollected] = useState(false); // Track if resources have been collected

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
      setDistanceTraveled(0); // Reset distance traveled
      setResourcesCollected(false); // Reset resource collection state
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
    if (!path || path.length === 0 || !groupRef.current || !playerVehicle) return; // Ensure playerVehicle is defined

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

        setDistanceTraveled((prev) => prev + moveDistance);

        // Calculate progress as a percentage of the path completed
        const progress =
          ((currentTargetIndex + (1 - distance / targetPosition.length())) / path.length) * 100;

        if (Math.round(playerVehicle.progress) !== Math.round(progress)) {
          updateShip(playerId, {
            position: {
              x: groupRef.current.position.x,
              y: groupRef.current.position.y,
              z: groupRef.current.position.z,
            },
            progress: Math.min(progress, 100), // Ensure progress does not exceed 100%
            isMoving: true,
          });
        }
      } else if (currentTargetIndex < path.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1); // Move to the next tile in the path

        updateShip(playerId, {
          position: {
            x: currentTargetTile.position.x,
            y: currentTargetTile.position.y,
            z: currentTargetTile.position.z,
          },
          coord: currentTargetCoord,
          fuel: Math.max(playerVehicle.fuel - 10, 0), // Decrement fuel by 10, ensuring it doesn't go below 0
        });
      } else {
        // Add resources from the destination tile to the ship
        const destinationTile = tiles[currentTargetCoord];
        const updatedResources = playerVehicle.resources ? { ...playerVehicle.resources } : {}; // Ensure resources exist

        if (destinationTile?.resources && !destinationTile.collected && !resourcesCollected) {
          updatedResources.food += destinationTile.resources.food || 0;
          updatedResources.debris += destinationTile.resources.debris || 0;
          updatedResources.special += destinationTile.resources.special || 0;

          destinationTile.collected = true;
          setResourcesCollected(true); // Mark resources as collected
        }

        // Check if the ship is on the starting tile
        const isStartingTile = currentTargetCoord === playerVehicle.startCoord;
        if (isStartingTile) {
          updateShip(playerId, {
            resources: updatedResources, // Transfer resources to the player's score
            position: {
              x: currentTargetTile.position.x,
              y: currentTargetTile.position.y,
              z: currentTargetTile.position.z,
            },
            coord: currentTargetCoord,
            progress: 100,
            isMoving: false,
          });
          clearSelectedTile(); // Clear the selected tile
        } else {
          updateShip(playerId, {
            position: {
              x: currentTargetTile.position.x,
              y: currentTargetTile.position.y,
              z: currentTargetTile.position.z,
            },
            coord: currentTargetCoord,
            progress: 100,
            isMoving: false,
            resources: updatedResources, // Update ship resources
          });
          clearSelectedTile(); // Clear the selected tile
        }
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default TargetMovement;
