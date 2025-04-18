import React, { useMemo, useState, useEffect, useRef } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber"; // Import useThree hook
import AnimatedHexTile from "./AnimatedHexTile";
import { generateHexPositions } from "../utils/utils";
import { VehicleManager } from "../GameAI/VehicleManager"; // Import VehicleManager

const Scene = ({ setSelectedIndex }) => {
  const hexPositions = useMemo(() => generateHexPositions(2, 0.1), []); // Increase radius to 2 for a second ring
  const [animatedIndex, setAnimatedIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Index de la tuile animée
  const [randomTileIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Reintroduce randomTileIndex

  const movingCubeRef = useRef(); // Ref for the moving cube
  const vehicleManager = useRef(null); // VehicleManager instance

  // Configure the camera using useThree
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10); // Adjusted camera position for better visibility
    camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene
  }, [camera]);

  useEffect(() => {
    // Initialize VehicleManager with hex positions
    vehicleManager.current = new VehicleManager(hexPositions);

    // Start update loop
    const animate = (delta) => {
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
  }, [hexPositions]);

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
              setSelectedIndex(index); // Met à jour l'index sélectionné pour le HUD
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
