import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { Vector3, Euler } from "three";

const RandomMovement = ({ initialPosition, children }) => {
  const currentPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const targetPosition = useRef(new Vector3(initialPosition.x, initialPosition.y, initialPosition.z));
  const previousTileCoord = useRef(null); // Track the previous tile's coord
  const groupRef = useRef();
  const rotationRef = useRef(new Euler(0, 0, 0)); // Track the current rotation
  const [firstTilePosition, setFirstTilePosition] = useState(null); // Static position of the first tile
  const [startMarker, setStartMarker] = useState(null); // Position of the start marker
  const [endMarker, setEndMarker] = useState(null); // Position of the end marker
  const getNeighbors = useTileStore((state) => state.getNeighbors); // Get neighbors from the store
  const setRandomVehicleTargetTile = useTileStore((state) => state.setRandomVehicleTargetTile); // Zustand setter
  const setRandomVehicleIsMoving = useTileStore((state) => state.setRandomVehicleIsMoving); // Zustand setter for isMoving
  const setRandomVehicle = useTileStore((state) => state.setRandomVehicle); // Zustand setter for random vehicle
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle from the store
  const setTargetDamage = useTileStore((state) => state.setTargetDamage); // Setter for targetDamage
  const targetDamage = useTileStore((state) => state.targetDamage); // Get targetDamage from the store
  const speed = 0.08; // Movement speed (units per second)
  const rotationSpeed = 2; // Rotation interpolation speed
  const [processedOverlap, setProcessedOverlap] = useState(false); // Track if overlap has been processed for the current tile

  const setNextTarget = () => {
    const currentTile = Object.values(useTileStore.getState().tiles).find(
      (tile) =>
        Math.abs(tile.position.x - currentPosition.current.x) < 0.1 &&
        Math.abs(tile.position.z - currentPosition.current.z) < 0.1
    );

    if (currentTile) {
      const neighbors = getNeighbors(currentTile.coord).filter(
        (neighbor) => neighbor.coord !== previousTileCoord.current
      );

      if (neighbors.length > 0) {
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        previousTileCoord.current = currentTile.coord;
        targetPosition.current.set(randomNeighbor.position.x, randomNeighbor.position.y, randomNeighbor.position.z);

        // Gérer les types de tuiles
        switch (currentTile.type) {
          case "danger":
            addPlayerMessage({
              vehiculeId: "randomVehicle",
              title: "Le véhicule aléatoire a traversé une zone dangereuse.",
              body: "Le véhicule a subi des dégâts en traversant une zone dangereuse.",
              timestamp: Date.now(),
            });
            setTargetDamage(Math.min(targetDamage + 10, 100)); // Augmenter les dégâts
            break;

          default:
            break;
        }
      }
    }
  };

  const checkOverlapWithTarget = () => {
    if (targetVehicle?.coord && previousTileCoord.current === targetVehicle.coord && !processedOverlap) {
      setTargetDamage(Math.min(targetDamage + 10, 100)); // Increase damage by 10%, max 100%
      setProcessedOverlap(true); // Mark overlap as processed for the current tile
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

        // Calculate the target rotation
        const targetAngle = Math.atan2(direction.x, direction.z);
        const currentAngle = rotationRef.current.y;
        const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * Math.min(rotationSpeed * delta, 1);

        // Update the rotation
        rotationRef.current.set(0, interpolatedAngle, 0);
        groupRef.current.rotation.copy(rotationRef.current);
      }

      setRandomVehicleIsMoving(true); // Set isMoving to true

      // Continuously check for overlap with the target vehicle
      checkOverlapWithTarget();
    } else {
      // If the target is reached, immediately set the next target
      setRandomVehicle({
        position: {
          x: currentPosition.current.x,
          y: currentPosition.current.y,
          z: currentPosition.current.z,
        },
        coord: previousTileCoord.current,
      }); // Update the vehicle's position in the store

      checkOverlapWithTarget(); // Check for overlap with the target vehicle
      setNextTarget();
      setRandomVehicleIsMoving(false); // Set isMoving to false when target is reached
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
