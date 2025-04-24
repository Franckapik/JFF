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
  const [randomVehiclePosition, setRandomVehiclePosition] = useState(null); // State for random vehicle position
  const [targetVehiclePosition, setTargetVehiclePosition] = useState(null); // State for target vehicle position

  useEffect(() => {
    // Directly set tiles in Zustand store
    setTiles(hexPositions.reduce((acc, tile) => ({ ...acc, [tile.coord]: tile }), {}));
  }, [hexPositions, setTiles]);

  useEffect(() => {
    // Set the initial random vehicle data (position and coord)
    const randomTile = hexPositions.find((tile) => tile.randomVehicleStart);
    if (randomTile) {
      const randomVehicle = { position: randomTile.position, coord: randomTile.coord };
      setRandomVehiclePosition(randomTile.position); // Update local state
      setRandomVehicleInStore(randomVehicle); // Store combined data in Zustand
      setRandomVehicleStartCoord(randomTile.coord); // Store starting coord in Zustand
    }
  }, [hexPositions, setRandomVehicleInStore, setRandomVehicleStartCoord]);

  useEffect(() => {
    // Set the initial target vehicle data (position and coord)
    const targetTile = hexPositions.find((tile) => tile.targetVehicleStart);
    if (targetTile) {
      const targetVehicle = { position: targetTile.position, coord: targetTile.coord };
      setTargetVehiclePosition(targetTile.position); // Update local state
      setTargetVehicleInStore(targetVehicle); // Store combined data in Zustand
      setTargetVehicleStartCoord(targetTile.coord); // Store starting coord in Zustand
    }
  }, [hexPositions, setTargetVehicleInStore, setTargetVehicleStartCoord]);

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

    setSelectedTile(tileCoord); // Store only the tile's coordinate
    setTargetVehicleTargetTile(tileCoord); // Mark the selected tile as the target destination
  };

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={true} /> {/* GridHelper visible for debugging */}
      <ambientLight intensity={1} /> {/* Increased ambient light intensity */}
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow /> {/* Adjusted directional light */}
      <pointLight position={[-5, 10, -5]} intensity={0.8} /> {/* Adjusted point light */}
      {randomVehiclePosition && (
        <RandomMovement initialPosition={randomVehiclePosition}>
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
        .filter((tile) => tile.walkable) // Ensure only walkable tiles are rendered
        .map((tile) => (
          <Tile
            key={tile.coord}
            position={[tile.position.x, 0, tile.position.z]}
            radius={1}
            color={tile.color}
            onClick={() => handleTileClick(tile.coord)}
          />
        ))}
    </>
  );
};

export default Scene;
