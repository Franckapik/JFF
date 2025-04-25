import React, { useEffect } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber";
import Tile from "./Tile";
import { useTileStore } from "../stores/useNewTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import TargetMovement from "../Mouvement/TargetMovement"; // Import TargetMovement

const Scene = () => {
  const initializeTiles = useTileStore((state) => state.initializeTiles); // Zustand initializer for tiles
  const tiles = useTileStore((state) => state.tiles); // Zustand tiles state
  const initializePlayer = usePlayerStore((state) => state.initializePlayer); // Player initialization method
  const shipPosition = usePlayerStore((state) => state.players.player1.vehicles.ship.position); // Ship position
  const setSelectedTile = useTileStore((state) => state.setSelectedTile); // Zustand setter for selectedTile

  useEffect(() => {
    initializeTiles(); // Initialize tiles with default radius and spacing
  }, [initializeTiles]);

  useEffect(() => {
    if (Object.keys(tiles).length > 0) {
      initializePlayer(tiles); // Initialize player once tiles are available
    }
  }, [tiles, initializePlayer]);

  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10); // Adjusted camera position for better visibility
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
  }, [camera]);

  const handleTileClick = (tileCoord) => {
    setSelectedTile(tileCoord); // Store the clicked tile's coordinate
  };

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={true} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      {shipPosition && (
        <TargetMovement>
          <mesh  castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} /> {/* Vehicle dimensions */}
            <meshStandardMaterial color="blue" /> {/* Blue color for the vehicle */}
          </mesh>
        </TargetMovement>
      )}
      {Object.values(tiles)
        .filter((tile) => tile.walkable)
        .map((tile) => (
          <Tile
            key={tile.coord}
            position={[tile.position.x, 0, tile.position.z]}
            radius={1}
            color={tile.color}
            onClick={() => handleTileClick(tile.coord)}
          />
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "depart") // Filter for the starting tile
        .map((tile) => (
          <mesh
            key={`depart-tile-${tile.coord}`}
            position={[tile.position.x, 0.2, tile.position.z]} // Slightly above the ground
            rotation={[-Math.PI / 2, 0, 0]} // Rotate to lie flat on the ground
          >
            <circleGeometry args={[0.5, 32]} /> {/* Circle dimensions */}
            <meshStandardMaterial color="red" /> {/* Red color for the circle */}
          </mesh>
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "fuel") // Filter for the fuel station tile
        .map((tile) => (
          <mesh
            key={`fuel-station-${tile.coord}`}
            position={[tile.position.x, 0.25, tile.position.z]} // Slightly above the ground
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} /> {/* Adjusted cube dimensions */}
            <meshStandardMaterial color="orange" /> {/* Black color for the cube */}
          </mesh>
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "repair") // Filter for the repair station tile
        .map((tile) => (
          <mesh
            key={`repair-station-${tile.coord}`}
            position={[tile.position.x, 0.25, tile.position.z]} // Slightly above the ground
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} /> {/* Adjusted cube dimensions */}
            <meshStandardMaterial color="green" /> {/* Green color for the cube */}
          </mesh>
        ))}
    </>
  );
};

export default Scene;
