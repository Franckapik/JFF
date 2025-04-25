import React, { useMemo, useState, useEffect } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber"; // Import useThree hook
import Tile from "./Tile";
import { generateHexPositions, generateInitialDrones } from "../utils/utils"; // Import generateInitialDrones
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import { Box, Torus } from "@react-three/drei"; // Import Box and Torus from drei
import RandomMovement from "../Mouvement/RandomMovement"; // Import RandomMovement component
import TargetMovement from "../Mouvement/TargetMovement"; // Import TargetMovement component
import DroneMovement from "../Mouvement/DroneMovement"; // Import DroneMovement component

const Scene = () => {
  const radius = 3; // Augmentez le rayon à 3 pour inclure un troisième cercle de tuiles
  const setTiles = useTileStore((state) => state.setTiles); // Zustand setter for tiles
  const initializeVehiclesAndDrones = useTileStore((state) => state.initializeVehiclesAndDrones); // Zustand initializer
  const setSelectedTile = useTileStore((state) => state.setSelectedTile); // Zustand setter for selectedTile
  const tiles = useTileStore((state) => state.tiles); // Zustand tiles state
  const targetVehicleIsMoving = useTileStore((state) => state.targetVehicleIsMoving); // Zustand state for movement
  const drones = useTileStore((state) => state.drones); // Get drones from the store
  const setDrones = useTileStore((state) => state.setDrones); // Get setDrones from the store
  const setSelectedVehicle = useTileStore((state) => state.setSelectedVehicle); // Zustand setter for selected vehicle
  const selectedVehicle = useTileStore((state) => state.selectedVehicle); // Get the selected vehicle from the store
  const randomVehicle = useTileStore((state) => state.randomVehicle); // Get random vehicle from the store
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle from the store
  const setTargetVehicleTargetTile = useTileStore((state) => state.setTargetVehicleTargetTile); // Correctly retrieve the setter

  const hexPositions = useMemo(() => generateHexPositions(radius, 0.1), []); // Use radius here

  useEffect(() => {
    // Directly set tiles in Zustand store
    setTiles(hexPositions.reduce((acc, tile) => ({ ...acc, [tile.coord]: tile }), {}));
    initializeVehiclesAndDrones(hexPositions); // Initialize vehicles and drones
  }, [hexPositions, setTiles, initializeVehiclesAndDrones]);

  // Configure the camera using useThree
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10); // Adjusted camera position for better visibility
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
  }, [camera]);

  const handleTileClick = (tileCoord) => {
    if (!selectedVehicle) {
      console.warn("No vehicle selected. Please select a vehicle first.");
      return; // Prevent setting a target if no vehicle is selected
    }

    if (selectedVehicle.id === "targetVehicle") {
      if (targetVehicleIsMoving) {
        console.warn("Cannot set a new target while the target vehicle is moving.");
        return; // Prevent setting a new target if the vehicle is moving
      }
      setTargetVehicleTargetTile(tileCoord); // Set the target tile for the target vehicle
    } else {
      // Handle drones
      setDrones((prevDrones) =>
        prevDrones.map((drone) =>
          drone.id === selectedVehicle.id ? { ...drone, targetTile: tileCoord } : drone
        )
      );
    }

    setSelectedTile(tileCoord); // Store the clicked tile's coordinate
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle); // Update the selected vehicle in the store
  };

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={true} /> {/* GridHelper visible for debugging */}
      <ambientLight intensity={1} /> {/* Increased ambient light intensity */}
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow /> {/* Adjusted directional light */}
      <pointLight position={[-5, 10, -5]} intensity={0.8} /> {/* Adjusted point light */}
      {randomVehicle && randomVehicle.position && (
        <RandomMovement initialPosition={randomVehicle.position}>
          <Box args={[0.5, 0.5, 0.5]} castShadow>
            <meshStandardMaterial attach="material" color="blue" />
          </Box>
        </RandomMovement>
      )}
      {targetVehicle && targetVehicle.position && (
        <TargetMovement initialPosition={targetVehicle.position}>
          <Box
            args={[0.5, 0.5, 0.5]}
            castShadow
            onClick={() => handleVehicleClick({ id: "targetVehicle", type: "Vaisseau", ...targetVehicle })}
          >
            <meshStandardMaterial
              attach="material"
              color={selectedVehicle?.id === "targetVehicle" ? "hotpink" : "red"} // Highlight if selected
            />
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
      {Object.values(tiles)
        .filter((tile) => tile.fuelStation) // Filter for the fuel station tile
        .map((tile) => (
          <mesh
            key={`fuel-station-${tile.coord}`}
            position={[tile.position.x, 0.25, tile.position.z]} // Slightly above the ground
          >
            <boxGeometry args={[0.2, 0.8, 0.2]} /> {/* Cube dimensions */}
            <meshStandardMaterial color="white" /> {/* Black color for the cube */}
          </mesh>
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.repairStation) // Filter for the repair station tile
        .map((tile) => (
          <mesh
            key={`repair-station-${tile.coord}`}
            position={[tile.position.x, 0.25, tile.position.z]} // Slightly above the ground
          >
            <boxGeometry args={[0.2, 0.8, 0.2]} /> {/* Cube dimensions */}
            <meshStandardMaterial color="green" /> {/* Green color for the cube */}
          </mesh>
        ))}
      {drones.map((drone) => (
        <DroneMovement key={drone.id} drone={drone}>
          <Torus
            args={[0.2, 0.05, 16, 100]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
            onClick={() => handleVehicleClick({ id: drone.id, type: "Drone", ...drone })}
          >
            <meshStandardMaterial
              attach="material"
              color={selectedVehicle?.id === drone.id ? "hotpink" : "white"} // Highlight if selected
            />
          </Torus>
        </DroneMovement>
      ))}
    </>
  );
};

export default Scene;
