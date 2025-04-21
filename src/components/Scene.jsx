import React, { useMemo, useState, useEffect } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber"; // Import useThree hook
import AnimatedHexTile from "./AnimatedHexTile";
import { generateHexPositions } from "../utils/utils";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store

const Scene = ({ setSelectedTile }) => {
  const radius = 2; // Define the radius value
  const setTiles = useTileStore((state) => state.setTiles); // Zustand setter for tiles
  const tiles = useTileStore((state) => state.tiles); // Zustand tiles state

  const hexPositions = useMemo(() => generateHexPositions(radius, 0.1), []); // Use radius here
  const [animatedIndex, setAnimatedIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Index de la tuile animée

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
            }}
          />
        );
      })}
    </>
  );
};

export default Scene;
