import React, { useMemo, useState, useEffect, useRef } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber"; // Import useThree hook
import { Vector3 } from "yuka"; // Import Yuka Vector3
import AnimatedHexTile from "./AnimatedHexTile";
import { generateHexPositions } from "../utils/utils";
import { VehicleManager } from "../GameAI/VehicleManager"; // Import VehicleManager

const Scene = ({ setSelectedTile }) => {
  const hexPositions = useMemo(() => generateHexPositions(2, 0.1), []); // Génère les tuiles avec les nouvelles propriétés
  const [animatedIndex, setAnimatedIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Index de la tuile animée
  const [randomTileIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Reintroduce randomTileIndex

  const movingCubeRef = useRef(); // Ref for the moving cube
  const vehicleManager = useRef(null); // VehicleManager instance

  // Fonction pour trouver une tuile par ses coordonnées q/r
  const findTileByCoordinates = (q, r) => {
    return hexPositions.find((tile) => tile.q === q && tile.r === r);
  };

  // Fonction pour calculer un chemin segmenté
  const calculatePath = (startTile, targetTile) => {
    console.log("Calculating path from:", startTile, "to:", targetTile);
    const path = [];
    let currentTile = startTile;

    while (currentTile.q !== targetTile.q || currentTile.r !== targetTile.r) {
      const nextNeighbor = currentTile.neighbors.find(
        (neighbor) =>
          Math.abs(neighbor.q - targetTile.q) + Math.abs(neighbor.r - targetTile.r) <
          Math.abs(currentTile.q - targetTile.q) + Math.abs(currentTile.r - targetTile.r)
      );

      if (!nextNeighbor) {
        console.log("No valid neighbor found. Breaking path calculation.");
        break;
      }

      currentTile = findTileByCoordinates(nextNeighbor.q, nextNeighbor.r);
      if (currentTile) {
        console.log("Adding tile to path:", currentTile);
        path.push(new Vector3(currentTile.position.x, currentTile.position.y, currentTile.position.z));
      }
    }

    console.log("Final path:", path);
    return path;
  };

  // Fonction pour déplacer le véhicule vers la tuile cliquée
  const moveVehicleToTile = (targetTile) => {
    console.log("Moving vehicle to tile:", targetTile);
    const vehiclePosition = vehicleManager.current.getVehiclePosition();
    console.log("Current vehicle position:", vehiclePosition);

    const startTile = findTileByCoordinates(
      Math.round(vehiclePosition.x),
      Math.round(vehiclePosition.z)
    );

    if (startTile && targetTile) {
      console.log("Start tile:", startTile, "Target tile:", targetTile);

      // Vérifiez si la tuile cible est adjacente
      const isAdjacent = startTile.neighbors.some(
        (neighbor) => neighbor.q === targetTile.q && neighbor.r === targetTile.r
      );

      if (isAdjacent) {
        console.log("Target tile is adjacent. Moving directly.");
        vehicleManager.current.setPath([
          new Vector3(targetTile.position.x, targetTile.position.y, targetTile.position.z),
        ]);
        return;
      }

      const path = calculatePath(startTile, targetTile);
      if (path.length > 0) {
        vehicleManager.current.setPath(path);
      } else {
        console.log("Path is empty. No movement will occur.");
      }
    } else {
      console.log("Start or target tile is undefined. Cannot move vehicle.");
    }
  };

  // Configure the camera using useThree
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10); // Adjusted camera position for better visibility
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
  }, [camera]);

  useEffect(() => {
    // Initialize VehicleManager only once
    if (!vehicleManager.current) {
      vehicleManager.current = new VehicleManager();
    }

    // Start update loop
    const animate = (delta) => {
      delta = Math.min(delta, 0.1); // Limit delta to avoid abnormal movements
      vehicleManager.current.update(delta);

      // Synchronize the Three.js mesh position with the Yuka vehicle
      if (movingCubeRef.current) {
        movingCubeRef.current.position.copy(vehicleManager.current.getVehiclePosition());
      }

      requestAnimationFrame((time) => animate(time * 0.001));
    };
    animate(0);

    return () => {
      vehicleManager.current.clear(); // Cleanup on unmount
    };
  }, []); // Ensure this effect runs only once

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={true} /> {/* GridHelper visible for debugging */}
      <ambientLight intensity={1} /> {/* Increased ambient light intensity */}
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow /> {/* Adjusted directional light */}
      <pointLight position={[-5, 10, -5]} intensity={0.8} /> {/* Adjusted point light */}
      {hexPositions.map((hex, index) => {
        const isHighTile = index === animatedIndex; // Vérifie si c'est la tuile animée
        return (
          <AnimatedHexTile
            key={index}
            position={[hex.position.x, isHighTile ? 0.2 : 0, hex.position.z]} // Fixed position access
            radius={1}
            color={hex.color}
            isHighTile={isHighTile} // Passe l'information si c'est la tuile animée
            onClick={() => {
              setAnimatedIndex(index); // Change l'animation sur clic
              setSelectedTile({
                index,
                position: hex.position,
                coordinates: { r: hex.r, q: hex.q }, // Pass r and q coordinates to HUD
                walkable: hex.walkable,
                explored: hex.explored,
                danger: hex.danger,
                neighbors: hex.neighbors,
              });
              console.log("Neighbors of clicked tile:", hex.neighbors); // Log neighbors to console
              moveVehicleToTile(hex); // Déplacer le véhicule vers la tuile cliquée
            }}
          />
        );
      })}
      {/* Cube placé sur une tuile aléatoire */}
      {randomTileIndex !== null && (
        <mesh position={[hexPositions[randomTileIndex].position.x, 0.3, hexPositions[randomTileIndex].position.z]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} /> {/* Taille du cube */}
          <meshStandardMaterial color="#e74c3c" /> {/* Couleur rouge */}
        </mesh>
      )}
      {/* Moving cube with Wander behavior */}
      <mesh ref={movingCubeRef} position={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} /> {/* Size of the cube */}
        <meshStandardMaterial color="#3498db" /> {/* Blue color */}
      </mesh>
    </>
  );
};

export default Scene;
