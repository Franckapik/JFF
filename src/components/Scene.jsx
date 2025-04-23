import React, { useMemo, useState, useEffect } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber"; // Import useThree hook
import Tile from "./Tile";
import { generateHexPositions } from "../utils/utils";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { Box } from "@react-three/drei"; // Import Box from drei
import RandomMovement from "../Mouvement/RandomMovement"; // Import RandomMovement component
import TargetMovement from "../Mouvement/TargetMovement"; // Import TargetMovement component

const Scene = () => {
  const radius = 2; // Define the radius value
  const setTiles = useTileStore((state) => state.setTiles); // Zustand setter for tiles
  const setSelectedTile = useTileStore((state) => state.setSelectedTile); // Zustand setter for selectedTile
  const tiles = useTileStore((state) => state.tiles); // Zustand tiles state
  const setRandomVehicleInStore = useTileStore((state) => state.setRandomVehicle); // Zustand setter
  const setTargetVehicleInStore = useTileStore((state) => state.setTargetVehicle); // Zustand setter
  const setTargetVehicleTargetTile = useTileStore((state) => state.setTargetVehicleTargetTile); // Zustand setter
  const targetVehicleIsMoving = useTileStore((state) => state.targetVehicleIsMoving); // Zustand state for movement
  const setRandomVehicleStartCoord = useTileStore((state) => state.setRandomVehicleStartCoord); // Zustand setter
  const setTargetVehicleStartCoord = useTileStore((state) => state.setTargetVehicleStartCoord); // Zustand setter

  const hexPositions = useMemo(() => generateHexPositions(radius, 0.1), []); // Use radius here
  const [animatedIndex, setAnimatedIndex] = useState(null); // Removed random initialization
  const [randomVehiclePosition, setRandomVehiclePosition] = useState(null); // Renamed from cubePosition
  const [targetVehiclePosition, setTargetVehiclePosition] = useState(null); // State for target vehicle position

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

    // Randomly set two tiles as non-walkable and change their color to black
    const tileCoords = Object.keys(tileData);
    const randomIndices = [];
    while (randomIndices.length < 2) {
      const randomIndex = Math.floor(Math.random() * tileCoords.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    randomIndices.forEach((index) => {
      tileData[tileCoords[index]].walkable = false;
      tileData[tileCoords[index]].color = "black"; // Set color to black
    });

    setTiles(tileData); // Store tiles in Zustand
  }, [hexPositions, setTiles]);

  useEffect(() => {
    // Set the initial random vehicle data (position and coord)
    const tileData = useTileStore.getState().tiles; // Access the latest tile data
    const walkableTiles = Object.values(tileData).filter((tile) => tile.walkable); // Filter walkable tiles
    if (walkableTiles.length > 0) {
      const randomTile = walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
      const randomVehicle = { position: randomTile.position, coord: randomTile.coord };
      setRandomVehiclePosition(randomTile.position); // Update local state
      setRandomVehicleInStore(randomVehicle); // Store combined data in Zustand
      setRandomVehicleStartCoord(randomTile.coord); // Store starting coord in Zustand
    }
  }, [setRandomVehicleInStore, setRandomVehicleStartCoord]);

  useEffect(() => {
    // Set the initial target vehicle data (position and coord)
    const tileData = useTileStore.getState().tiles; // Access the latest tile data
    const walkableTiles = Object.values(tileData).filter((tile) => tile.walkable); // Filter walkable tiles
    if (walkableTiles.length > 0) {
      const randomTile = walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
      const targetVehicle = { position: randomTile.position, coord: randomTile.coord };
      setTargetVehiclePosition(randomTile.position); // Update local state
      setTargetVehicleInStore(targetVehicle); // Store combined data in Zustand
      setTargetVehicleStartCoord(randomTile.coord); // Store starting coord in Zustand
    }
  }, [setTargetVehicleInStore, setTargetVehicleStartCoord]);

  // Configure the camera using useThree
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10); // Adjusted camera position for better visibility
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
  }, [camera]);

  const handleTileClick = (tileCoord) => {
    if (targetVehicleIsMoving) {
      console.warn("Cannot set a new target while the target vehicle is moving.");
      return; // Prevent setting a new target if the vehicle is moving
    }

    const tile = tiles[tileCoord]; // Fetch the latest tile data from the store
    if (tile && tile.coord) { // Ensure tile and tile.coord are valid
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

      // Update the target vehicle's destination in the store
      setTargetVehicleTargetTile(tile.coord);
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
      {randomVehiclePosition && ( // Updated variable name
        <RandomMovement initialPosition={randomVehiclePosition}> {/* Updated variable name */}
          <Box args={[0.5, 0.5, 0.5]} castShadow>
            <meshStandardMaterial attach="material" color="blue" />
          </Box>
        </RandomMovement>
      )}
      {targetVehiclePosition && (
        <TargetMovement initialPosition={targetVehiclePosition}>
          <Box args={[0.5, 0.5, 0.5]} castShadow>
            <meshStandardMaterial attach="material" color="red" />
          </Box>
        </TargetMovement>
      )}
      {Object.values(tiles)
        .filter((tile) => tile.walkable) // Only render walkable tiles
        .map((tile) => (
          <Tile
            key={tile.coord}
            position={[tile.position.x, 0, tile.position.z]} // Removed animation logic
            radius={1}
            color={tile.color}
            onClick={() => handleTileClick(tile.coord)} // Removed animation trigger
          />
        ))}
    </>
  );
};

export default Scene;
