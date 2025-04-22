import React, { useEffect, useRef, useState } from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";

const TargetMovement = ({ initialPosition, children }) => {
  const groupRef = useRef();
  const rotationRef = useRef(new Euler(0, 0, 0)); // Track the current rotation
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle from store
  const targetVehicleTargetTile = useTileStore((state) => state.targetVehicleTargetTile); // Get target tile coord
  const tiles = useTileStore((state) => state.tiles); // Get tiles from store
  const setTargetVehicle = useTileStore((state) => state.setTargetVehicle); // Zustand setter for target vehicle
  const setTargetVehicleIsMoving = useTileStore((state) => state.setTargetVehicleIsMoving); // Zustand setter for isMoving
  const setTargetVehicleProgress = useTileStore((state) => state.setTargetVehicleProgress); // Zustand setter for progress
  const targetFuel = useTileStore((state) => state.targetFuel); // Get targetFuel from the store
  const setTargetFuel = useTileStore((state) => state.setTargetFuel); // Setter for targetFuel
  const targetVehicleStartCoord = useTileStore((state) => state.targetVehicleStartCoord); // Get initial coord

  const speed = 0.5; // Movement speed (units per second)
  const rotationSpeed = 2; // Rotation interpolation speed
  const [path, setPath] = useState([]); // List of intermediate tiles
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Index of the current target tile
  const [initialTilePosition, setInitialTilePosition] = useState(null); // Position of the initial tile
  const [totalPathDistance, setTotalPathDistance] = useState(0); // Total distance of the path
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Distance traveled so far

  const calculatePath = () => {
    if (groupRef.current && targetVehicleTargetTile) {
      // Find the current tile based on the vehicle's current position
      const currentTile = Object.values(tiles).find(
        (tile) =>
          Math.abs(tile.position.x - groupRef.current.position.x) < 0.1 &&
          Math.abs(tile.position.z - groupRef.current.position.z) < 0.1
      );
      const targetTile = tiles[targetVehicleTargetTile];

      if (currentTile && targetTile) {
        // Use a pathfinding function (e.g., A*)
        const newPath = findPath(currentTile.coord, targetTile.coord, tiles);
        setPath(newPath);
        setCurrentTargetIndex(0); // Reset the index
        setTargetVehicleProgress(0); // Reset progress

        // Calculate the total distance of the path
        let totalDistance = 0;
        for (let i = 0; i < newPath.length - 1; i++) {
          const tileA = tiles[newPath[i]];
          const tileB = tiles[newPath[i + 1]];
          totalDistance += new Vector3(tileA.position.x, tileA.position.y, tileA.position.z).distanceTo(
            new Vector3(tileB.position.x, tileB.position.y, tileB.position.z)
          );
        }
        setTotalPathDistance(totalDistance);
        setDistanceTraveled(0); // Reset traveled distance
      }
    }
  };

  useEffect(() => {
    // Ensure the vehicle starts at the initial position
    if (targetVehicle?.position && !initialTilePosition) {
      groupRef.current.position.set(
        targetVehicle.position.x,
        targetVehicle.position.y,
        targetVehicle.position.z
      );
      setInitialTilePosition(targetVehicle.position); // Save the initial position for the red ring only once
    }
  }, [targetVehicle, initialTilePosition]);

  useEffect(() => {
    calculatePath(); // Recalculate the path when the target changes
  }, [targetVehicleTargetTile, tiles]);

  useFrame((_, delta) => {
    // Prevent movement if fuel is 0%
    if (targetFuel <= 0) {
      setTargetVehicleIsMoving(false); // Ensure the vehicle is not marked as moving
      return;
    }

    if (groupRef.current && path.length > 0) {
      const currentTargetCoord = path[currentTargetIndex];
      const currentTargetTile = tiles[currentTargetCoord];

      if (currentTargetTile) {
        const targetPosition = new Vector3(
          currentTargetTile.position.x,
          currentTargetTile.position.y,
          currentTargetTile.position.z
        );

        // Calculate direction and distance
        const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
        const distance = direction.length();

        if (distance > 0.01) {
          setTargetVehicleIsMoving(true); // Set isMoving to true
          direction.normalize();
          const moveDistance = Math.min(speed * delta, distance);
          groupRef.current.position.addScaledVector(direction, moveDistance);

          // Interpolate rotation to face the target
          const targetAngle = Math.atan2(direction.x, direction.z);
          const currentAngle = rotationRef.current.y;
          const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * Math.min(rotationSpeed * delta, 1);

          // Update the rotation
          rotationRef.current.set(0, interpolatedAngle, 0);
          groupRef.current.rotation.copy(rotationRef.current);

          // Update the distance traveled
          setDistanceTraveled((prev) => prev + moveDistance);

          // Calculate progress based on the total path distance
          const progress = (distanceTraveled / totalPathDistance) * 100;
          setTargetVehicleProgress(progress.toFixed(2)); // Update progress in the store
        } else if (currentTargetIndex < path.length - 1) {
          // Move to the next tile in the path
          setCurrentTargetIndex(currentTargetIndex + 1);

          // Update the target vehicle's position in the store at intermediate tiles
          setTargetVehicle({
            position: {
              x: currentTargetTile.position.x,
              y: currentTargetTile.position.y,
              z: currentTargetTile.position.z,
            },
            coord: currentTargetCoord,
          });

          // Decrease fuel by 10% when moving to the next tile
          setTargetFuel(Math.max(targetFuel - 10, 0)); // Ensure fuel does not go below 0
        } else {
          // Final position update
          setTargetVehicle({
            position: {
              x: groupRef.current.position.x,
              y: groupRef.current.position.y,
              z: groupRef.current.position.z,
            },
            coord: currentTargetCoord,
          });

          // Reset fuel to 100% if the target vehicle returns to its initial position
          if (currentTargetCoord === targetVehicleStartCoord) {
            setTargetFuel(100); // Reset fuel to 100%
          }

          setTargetVehicleIsMoving(false); // Set isMoving to false when target is reached
          setTargetVehicleProgress(100); // Set progress to 100% when target is reached
        }
      }
    }
  });

  return (
    <>
      {/* Render the red ring on the initial tile */}
      {initialTilePosition && (
        <mesh position={[initialTilePosition.x, 0.2, initialTilePosition.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="red" side={2} /> {/* Red ring */}
        </mesh>
      )}

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

// Simplified pathfinding function
const findPath = (startCoord, targetCoord, tiles) => {
  const queue = [[startCoord]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const currentCoord = path[path.length - 1];

    if (currentCoord === targetCoord) {
      return path; // Path found
    }

    if (!visited.has(currentCoord)) {
      visited.add(currentCoord);
      const neighbors = tiles[currentCoord]?.neighbors || [];
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          queue.push([...path, neighbor]);
        }
      });
    }
  }

  return []; // No path found
};

export default TargetMovement;
