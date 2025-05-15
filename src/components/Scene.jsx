import React, { useEffect, useRef } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber";
import { Cone } from "@react-three/drei";
import Tile from "./Tile";
import { useTileStore } from "../stores/useNewTileStore";
import usePlayerStore from "../stores/playerStore";
import useBotStore from "../stores/useBotStore"; // Utiliser useBotStore à la place de useSimpleBotStore
import ShipMovement from "../Mouvement/ShipMovement";
import UnifiedDroneMovement from "../Mouvement/UnifiedDroneMovement"; // Ajout de UnifiedDroneMovement

const Scene = () => {
  const initializeTiles = useTileStore((state) => state.initializeTiles);
  const tiles = useTileStore((state) => state.tiles);
  const initializePlayer = usePlayerStore((state) => state.initializePlayer);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const moveToTile = usePlayerStore((state) => state.moveToTile);
  
  // Utilisation de useBotStore au lieu de useSimpleBotStore
  const initializeBot = useBotStore((state) => state.initializeBot);
  
  const botInitialized = useRef(false);
  const playersInitialized = useRef(false);

  // Initialize tiles
  useEffect(() => {
    console.log("[Scene] Initializing tiles...");
    initializeTiles();
  }, [initializeTiles]);

  // Initialize players only once when tiles are first available
  useEffect(() => {
    if (Object.keys(tiles).length > 0 && !playersInitialized.current) {
      console.log("[Scene] Initializing players with tiles:", tiles);
      initializePlayer(tiles);
      playersInitialized.current = true;
      
      // Initialize bot after players are set up
      if (!botInitialized.current) {
        console.log("[Scene] Initializing bot...");
        initializeBot();
        botInitialized.current = true;
      }
    }
  }, [tiles, initializePlayer, initializeBot]);

  // Camera setup
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const handleTileClick = (tile) => {
    const playerId = "player1";

    if (selectedVehicle.vehicleId) {
      moveToTile(playerId, selectedVehicle.vehicleId, {
        coord: tile.coord,
        position: tile.position,
      });
    }
  };

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={true} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      
      {/* Drone du joueur 1 - Utilisation du composant unifié (ajouté depuis SimpleScene) */}
      <UnifiedDroneMovement playerId="player1" droneId="drone1">
        <Cone 
          args={[0.3, 0.8, 8]} 
          rotation={[Math.PI, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color="purple" metalness={0.5} roughness={0.3} />
        </Cone>
      </UnifiedDroneMovement>
      
      {/* Drone du bot (player2) - Utilisation du composant unifié (ajouté depuis SimpleScene) */}
      <UnifiedDroneMovement playerId="player2" droneId="drone3">
        <Cone 
          args={[0.3, 0.8, 8]} 
          rotation={[Math.PI, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color="magenta" metalness={0.5} roughness={0.3} />
        </Cone>
      </UnifiedDroneMovement>
      
      {Object.keys(tiles).length > 0 && (
        <>
          <ShipMovement playerId="player1">
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color={selectedVehicle.playerId === "player1" && selectedVehicle.vehicleId === "ship" ? "yellow" : "blue"}
              />
            </mesh>
          </ShipMovement>
          <ShipMovement playerId="player2">
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color={selectedVehicle.playerId === "player2" && selectedVehicle.vehicleId === "ship" ? "yellow" : "red"}
              />
            </mesh>
          </ShipMovement>
        </>
      )}
      {Object.values(tiles)
        .filter((tile) => tile.walkable)
        .map((tile) => (
          <Tile
            key={tile.coord}
            position={[tile.position.x, 0, tile.position.z]}
            radius={1}
            color={tile.color}
            onClick={() => handleTileClick(tile)}
            coord={tile.coord}
          />
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "depart")
        .map((tile) => (
          <mesh
            key={`depart-tile-${tile.coord}`}
            position={[tile.position.x, 0.2, tile.position.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color="red" />
          </mesh>
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "fuel")
        .map((tile) => (
          <mesh
            key={`fuel-station-${tile.coord}`}
            position={[tile.position.x, 0.25, tile.position.z]}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "repair")
        .map((tile) => (
          <mesh
            key={`repair-station-${tile.coord}`}
            position={[tile.position.x, 0.25, tile.position.z]}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="green" />
          </mesh>
        ))}
    </>
  );
};

export default Scene;
