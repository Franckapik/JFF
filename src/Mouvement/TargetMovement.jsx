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
  const targetDamage = useTileStore((state) => state.targetDamage); // Get targetDamage from the store
  const setTargetDamage = useTileStore((state) => state.setTargetDamage); // Setter for targetDamage
  const setTargetVehicleResources = useTileStore((state) => state.setTargetVehicleResources); // Setter for target vehicle resources
  const setPlayerResources = useTileStore((state) => state.setPlayerResources); // Setter for player resources
  const targetVehicleResources = useTileStore((state) => state.targetVehicleResources); // Get target vehicle resources
  const resetTargetVehicleResources = useTileStore((state) => state.resetTargetVehicleResources); // Import reset function
  const markTileAsCollected = useTileStore((state) => state.markTileAsCollected); // Import markTileAsCollected function
  const isFuelStation = useTileStore((state) => state.isFuelStation); // Check if a tile is a fuel station
  const isRepairStation = useTileStore((state) => state.isRepairStation); // Check if a tile is a repair station
  const addPlayerMessage = useTileStore((state) => state.addPlayerMessage); // Add player messages

  const [fuelRefilled, setFuelRefilled] = useState(false); // Track if fuel has been refilled
  const [damageRepaired, setDamageRepaired] = useState(false); // Track if damage has been repaired
  const [path, setPath] = useState([]); // List of intermediate tiles
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Index of the current target tile
  const [initialTilePosition, setInitialTilePosition] = useState(null); // Position of the initial tile
  const [totalPathDistance, setTotalPathDistance] = useState(0); // Total distance of the path
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Distance traveled so far
  const [resourcesCollected, setResourcesCollected] = useState(false); // Track if resources have been collected
  const [resourcesTransferred, setResourcesTransferred] = useState(false); // Track if resources have been transferred

  const speed = 1; // Movement speed (units per second)
  const rotationSpeed = 2; // Rotation interpolation speed

  const calculatePath = () => {
    if (groupRef.current && targetVehicleTargetTile) {
      const currentTile = Object.values(tiles).find(
        (tile) =>
          Math.abs(tile.position.x - groupRef.current.position.x) < 0.1 &&
          Math.abs(tile.position.z - groupRef.current.position.z) < 0.1
      );
      const targetTile = tiles[targetVehicleTargetTile];

      if (currentTile && targetTile) {
        const newPath = findPath(currentTile.coord, targetTile.coord, tiles);
        setPath(newPath);
        setCurrentTargetIndex(0); // Reset the index
        setTargetVehicleProgress(0); // Reset progress

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
    if (targetVehicle?.position && !initialTilePosition) {
      groupRef.current.position.set(
        targetVehicle.position.x,
        targetVehicle.position.y,
        targetVehicle.position.z
      );
      setInitialTilePosition(targetVehicle.position);
    }
  }, [targetVehicle, initialTilePosition]);

  useEffect(() => {
    if (targetVehicleTargetTile && tiles[targetVehicleTargetTile]) {
      calculatePath();
      setResourcesCollected(false); // Reset resourcesCollected for the new target
    }
  }, [targetVehicleTargetTile, tiles]);

  useFrame((_, delta) => {
    if (targetFuel <= 0) {
      setTargetVehicleIsMoving(false);
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

        const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
        const distance = direction.length();

        if (distance > 0.01) {
          setTargetVehicleIsMoving(true);
          direction.normalize();
          const moveDistance = Math.min(speed * delta, distance);
          groupRef.current.position.addScaledVector(direction, moveDistance);

          const targetAngle = Math.atan2(direction.x, direction.z);
          const currentAngle = rotationRef.current.y;
          const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * Math.min(rotationSpeed * delta, 1);

          rotationRef.current.set(0, interpolatedAngle, 0);
          groupRef.current.rotation.copy(rotationRef.current);

          setDistanceTraveled((prev) => prev + moveDistance);

          const progress = (distanceTraveled / totalPathDistance) * 100;
          setTargetVehicleProgress(progress.toFixed(2));
        } else if (currentTargetIndex < path.length - 1) {
          setCurrentTargetIndex(currentTargetIndex + 1);

          setTargetVehicle({
            position: {
              x: currentTargetTile.position.x,
              y: currentTargetTile.position.y,
              z: currentTargetTile.position.z,
            },
            coord: currentTargetCoord,
          });

          setTargetFuel(Math.max(targetFuel - 10, 0));
        } else {
          setTargetVehicle({
            position: {
              x: groupRef.current.position.x,
              y: groupRef.current.position.y,
              z: groupRef.current.position.z,
            },
            coord: currentTargetCoord,
          });

          if (!currentTargetTile.targetVehicleStart && !resourcesCollected && !currentTargetTile.collected) {
            const destinationTile = tiles[currentTargetCoord];
            if (destinationTile && destinationTile.resources && destinationTile.collectable) {
              setTargetVehicleResources(destinationTile.resources);
              markTileAsCollected(currentTargetCoord);
            }
            setResourcesCollected(true);
          }

          const isStartingTile = tiles[currentTargetCoord]?.targetVehicleStart;
          if (isStartingTile && !resourcesTransferred) {
            setTargetFuel(100);
            setPlayerResources(targetVehicleResources);
            resetTargetVehicleResources();
            setResourcesTransferred(true);
          } else if (!isStartingTile) {
            setResourcesTransferred(false);
          }

          if (isFuelStation(currentTargetCoord) && !fuelRefilled && targetFuel < 100) {
            setTargetFuel(100);
            setFuelRefilled(true);
            addPlayerMessage({
              text: "Le réservoir de carburant a été rempli à 100 % !",
              type: "info",
              timestamp: Date.now(),
            });
          } else if (!isFuelStation(currentTargetCoord)) {
            setFuelRefilled(false);
          }

          if (isRepairStation(currentTargetCoord) && !damageRepaired && targetDamage > 0) {
            setTargetDamage(0);
            setDamageRepaired(true);
            addPlayerMessage({
              text: "Les dégâts du vaisseau ont été réparés !",
              type: "info",
              timestamp: Date.now(),
            });
          } else if (!isRepairStation(currentTargetCoord)) {
            setDamageRepaired(false);
          }

          setTargetVehicleIsMoving(false);
          setTargetVehicleProgress(100);
        }
      }
    }
  });

  return (
    <>
      {initialTilePosition && (
        <mesh position={[initialTilePosition.x, 0.2, initialTilePosition.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="red" side={2} />
        </mesh>
      )}

      {targetVehicleTargetTile && tiles[targetVehicleTargetTile] && (
        <mesh
          position={[
            tiles[targetVehicleTargetTile].position.x,
            0.2,
            tiles[targetVehicleTargetTile].position.z,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      )}

      <group ref={groupRef}>{children}</group>
    </>
  );
};

const findPath = (startCoord, targetCoord, tiles) => {
  const queue = [[startCoord]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const currentCoord = path[path.length - 1];

    if (currentCoord === targetCoord) {
      return path;
    }

    if (!visited.has(currentCoord)) {
      visited.add(currentCoord);
      const neighbors = tiles[currentCoord]?.neighbors || [];
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor) && tiles[neighbor]?.walkable !== false) {
          queue.push([...path, neighbor]);
        }
      });
    }
  }

  return [];
};

export default TargetMovement;
