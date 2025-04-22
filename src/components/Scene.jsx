import React, { useMemo, useState, useEffect } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber"; // Import useThree hook
import Tile from "./Tile";
import { generateHexPositions } from "../utils/utils";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { Box } from "@react-three/drei"; // Import Box from drei
import RandomMovement from "../Mouvement/RandomMovement"; // Import RandomMovement component
import TargetMovement from "../Mouvement/TargetMovement"; // Import TargetMovement component

const Scene = ({ setSelectedTile }) => {
  const radius = 2; // Define the radius value
  const setTiles = useTileStore((state) => state.setTiles); // Zustand setter for tiles
  const tiles = useTileStore((state) => state.tiles); // Zustand tiles state
  const setRandomVehicleInStore = useTileStore((state) => state.setRandomVehicle); // Zustand setter
  const setTargetVehicleInStore = useTileStore((state) => state.setTargetVehicle); // Zustand setter

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
    setTiles(tileData); // Store tiles in Zustand
  }, [hexPositions, setTiles]);

  useEffect(() => {
    // Set the initial random vehicle data (position and coord)
    if (hexPositions.length > 0) {
      const randomTile = hexPositions[Math.floor(Math.random() * hexPositions.length)];
      const randomVehicle = { position: randomTile.position, coord: randomTile.coord };
      setRandomVehiclePosition(randomTile.position); // Update local state
      setRandomVehicleInStore(randomVehicle); // Store combined data in Zustand
    }
  }, [hexPositions, setRandomVehicleInStore]);

  useEffect(() => {
    // Set the initial target vehicle data (position and coord)
    if (hexPositions.length > 0) {
      const randomTile = hexPositions[Math.floor(Math.random() * hexPositions.length)];
      const targetVehicle = { position: randomTile.position, coord: randomTile.coord };
      setTargetVehiclePosition(randomTile.position); // Update local state
      setTargetVehicleInStore(targetVehicle); // Store combined data in Zustand
    }
  }, [hexPositions, setTargetVehicleInStore]);

  // Configure the camera using useThree
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10); // Adjusted camera position for better visibility
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
  }, [camera]);

  const handleTileClick = (tileCoord) => {
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
      {Object.values(tiles).map((tile) => (
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
