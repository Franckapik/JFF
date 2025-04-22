import React, { useEffect, useRef, useState } from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const TargetMovement = ({ initialPosition, children }) => {
  const groupRef = useRef();
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle from store
  const targetVehicleTargetTile = useTileStore((state) => state.targetVehicleTargetTile); // Get target tile coord
  const tiles = useTileStore((state) => state.tiles); // Get tiles from store
  const setTargetVehicle = useTileStore((state) => state.setTargetVehicle); // Zustand setter for target vehicle
  const setTargetVehicleIsMoving = useTileStore((state) => state.setTargetVehicleIsMoving); // Zustand setter for isMoving
  const setTargetVehicleProgress = useTileStore((state) => state.setTargetVehicleProgress); // Zustand setter for progress

  const speed = 0.5; // Movement speed (units per second)
  const [path, setPath] = useState([]); // Liste des tuiles intermédiaires
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Index de la tuile cible actuelle
  const [initialTilePosition, setInitialTilePosition] = useState(null); // Position of the initial tile
  const [totalPathDistance, setTotalPathDistance] = useState(0); // Total distance of the path
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Distance traveled so far

  const calculatePath = () => {
    if (groupRef.current && targetVehicleTargetTile) {
      // Trouver la tuile actuelle basée sur la position actuelle du véhicule
      const currentTile = Object.values(tiles).find(
        (tile) =>
          Math.abs(tile.position.x - groupRef.current.position.x) < 0.1 &&
          Math.abs(tile.position.z - groupRef.current.position.z) < 0.1
      );
      const targetTile = tiles[targetVehicleTargetTile];

      if (currentTile && targetTile) {
        // Utiliser une fonction de recherche de chemin (ex. A*)
        const newPath = findPath(currentTile.coord, targetTile.coord, tiles);
        setPath(newPath);
        setCurrentTargetIndex(0); // Réinitialiser l'index
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
    if (targetVehicle?.position) {
      groupRef.current.position.set(
        targetVehicle.position.x,
        targetVehicle.position.y,
        targetVehicle.position.z
      );
      setInitialTilePosition(targetVehicle.position); // Save the initial position for the red ring
    }
  }, [targetVehicle]);

  useEffect(() => {
    calculatePath(); // Recalculer le chemin lorsque la cible change
  }, [targetVehicleTargetTile, tiles]);

  useFrame((_, delta) => {
    if (groupRef.current && path.length > 0) {
      const currentTargetCoord = path[currentTargetIndex];
      const currentTargetTile = tiles[currentTargetCoord];

      if (currentTargetTile) {
        const targetPosition = new Vector3(
          currentTargetTile.position.x,
          currentTargetTile.position.y,
          currentTargetTile.position.z
        );

        // Calculer la direction et la distance
        const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
        const distance = direction.length();

        if (distance > 0.01) {
          setTargetVehicleIsMoving(true); // Set isMoving to true
          direction.normalize();
          const moveDistance = Math.min(speed * delta, distance);
          groupRef.current.position.addScaledVector(direction, moveDistance);

          // Update the distance traveled
          setDistanceTraveled((prev) => prev + moveDistance);

          // Calculate progress based on the total path distance
          const progress = (distanceTraveled / totalPathDistance) * 100;
          setTargetVehicleProgress(progress.toFixed(2)); // Update progress in the store
        } else if (currentTargetIndex < path.length - 1) {
          // Passer à la prochaine tuile dans le chemin
          setCurrentTargetIndex(currentTargetIndex + 1);
        } else {
          setTargetVehicle({
            position: {
              x: groupRef.current.position.x,
              y: groupRef.current.position.y,
              z: groupRef.current.position.z,
            },
            coord: currentTargetCoord,
          }); // Update the vehicle's position in the store
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

// Fonction de recherche de chemin (exemple simplifié)
const findPath = (startCoord, targetCoord, tiles) => {
  const queue = [[startCoord]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const currentCoord = path[path.length - 1];

    if (currentCoord === targetCoord) {
      return path; // Chemin trouvé
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

  return []; // Aucun chemin trouvé
};

export default TargetMovement;
