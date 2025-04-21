import React, { useMemo, useState, useEffect, useRef } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber"; // Import useThree hook
import { Vector3 } from "yuka"; // Import Yuka Vector3
import AnimatedHexTile from "./AnimatedHexTile";
import { generateHexPositions } from "../utils/utils";
import { VehicleManager } from "../GameAI/VehicleManager"; // Import VehicleManager
import { useTileStore } from "../store/useTileStore"; // Import Zustand store

const Scene = ({ setSelectedTile }) => {
  const radius = 2; // Define the radius value
  const setTiles = useTileStore((state) => state.setTiles); // Zustand setter for tiles
  const tiles = useTileStore((state) => state.tiles); // Zustand tiles state
  const getTile = useTileStore((state) => state.getTile); // Zustand getter for a single tile

  const hexPositions = useMemo(() => generateHexPositions(radius, 0.1), []); // Use radius here
  const [animatedIndex, setAnimatedIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Index de la tuile animée
  const [randomTileIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Reintroduce randomTileIndex

  const movingCubeRef = useRef(); // Ref for the moving cube
  const vehicleManager = useRef(null); // VehicleManager instance

  useEffect(() => {
    // Map hexPositions to the Zustand store format
    const tileData = hexPositions.reduce((acc, hex) => {
      acc[hex.coord] = {
        coord: hex.coord, // Use encoded coord
        position: hex.position,
        neighbors: hex.neighbors, // Already encoded
        walkable: hex.walkable,
        explored: hex.explored,
        danger: hex.danger,
        color: hex.color,
      };
      return acc;
    }, {});
    setTiles(tileData); // Store tiles in Zustand
  }, [hexPositions, setTiles]);

  const findTileByCoordinates = (coord) => tiles[coord]; // Find tile by encoded coord

  // Fonction pour calculer un chemin segmenté
  const calculatePath = (startTile, targetTile) => {
    const path = [];
    let currentTile = startTile;

    while (currentTile.q !== targetTile.q || currentTile.r !== targetTile.r) {
      const nextNeighbor = currentTile.neighbors.find(
        (neighbor) =>
          Math.abs(neighbor.q - targetTile.q) + Math.abs(neighbor.r - targetTile.r) <
          Math.abs(currentTile.q - targetTile.q) + Math.abs(currentTile.r - targetTile.r)
      );

      if (!nextNeighbor) {
        break;
      }

      currentTile = findTileByCoordinates(nextNeighbor.q, nextNeighbor.r);
      if (currentTile) {
        path.push(new Vector3(currentTile.position.x, currentTile.position.y, currentTile.position.z));
      }
    }

    return path;
  };

  // Fonction pour déplacer le véhicule vers la tuile cliquée
  const moveVehicleToTile = (targetTile) => {
    const vehiclePosition = vehicleManager.current.getVehiclePosition();

    const startTile = findTileByCoordinates(
      Math.round(vehiclePosition.x),
      Math.round(vehiclePosition.z)
    );

    if (startTile && targetTile) {
      const isAdjacent = startTile.neighbors.some(
        (neighbor) => neighbor.q === targetTile.q && neighbor.r === targetTile.r
      );

      if (isAdjacent) {
        vehicleManager.current.setPath([
          new Vector3(targetTile.position.x, targetTile.position.y, targetTile.position.z),
        ]);
        return;
      }

      const path = calculatePath(startTile, targetTile);
      if (path.length > 0) {
        vehicleManager.current.setPath(path);
      }
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

  const handleTileClick = (tileCoord) => {
    const tile = getTile(tileCoord); // Fetch the latest tile data from the store
    if (tile && tile.coord) { // Ensure tile and tile.coord are valid
      setSelectedTile(null); // Clear the previous selected tile
      setSelectedTile({
        coord: tile.coord,
        position: tile.position,
        coordinates: {
          q: tile.coord.charCodeAt(0) - 65 - radius, // Decode q using charCodeAt
          r: parseInt(tile.coord.slice(1)) - radius, // Decode r using parseInt
        },
        walkable: tile.walkable,
        explored: tile.explored,
        danger: tile.danger,
        neighbors: tile.neighbors,
      });
    } else {
      console.error("Invalid tile or coord:", tile);
    }
  };

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={true} /> {/* GridHelper visible for debugging */}
      <ambientLight intensity={1} /> {/* Increased ambient light intensity */}
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow /> {/* Adjusted directional light */}
      <pointLight position={[-5, 10, -5]} intensity={0.8} /> {/* Adjusted point light */}
      {Object.values(tiles).map((tile) => {
        const isHighTile = tile.coord === Object.keys(tiles)[animatedIndex]; // Match by coord
        return (
          <AnimatedHexTile
            key={tile.coord}
            position={[tile.position.x, isHighTile ? 0.2 : 0, tile.position.z]}
            radius={1}
            color={tile.color}
            isHighTile={isHighTile}
            onClick={() => {
              setAnimatedIndex(Object.keys(tiles).indexOf(tile.coord)); // Update by coord
              handleTileClick(tile.coord); // Fetch and update selected tile
              moveVehicleToTile(tile); // Move vehicle by tile
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
