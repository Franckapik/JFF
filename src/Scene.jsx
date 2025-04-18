import React, { useMemo, useState } from "react";
import { GridHelper } from "three";
import AnimatedHexTile from "./AnimatedHexTile";
import { generateHexPositions } from "./utils";

const Scene = ({ setSelectedIndex }) => {
  const hexPositions = useMemo(() => generateHexPositions(1, 0.1), []); // Espacement de 0.1
  const [animatedIndex, setAnimatedIndex] = useState(Math.floor(Math.random() * hexPositions.length)); // Index de la tuile animée

  // Sélectionner une tuile aléatoire pour le cube
  const randomTileIndex = useMemo(() => Math.floor(Math.random() * hexPositions.length), [hexPositions]);

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={false} /> {/* GridHelper caché */}
      <ambientLight intensity={0.8} /> {/* Lumière ambiante douce */}
      <directionalLight position={[5, 5, 5]} intensity={0.7} castShadow /> {/* Lumière directionnelle */}
      <pointLight position={[-5, 5, -5]} intensity={0.5} /> {/* Lumière ponctuelle */}
      {hexPositions.map((hex, index) => {
        const isHighTile = index === animatedIndex; // Vérifie si c'est la tuile animée
        return (
          <AnimatedHexTile
            key={index}
            position={[hex.position[0], isHighTile ? 0.2 : 0, hex.position[2]]} // Position initiale
            radius={1}
            color={hex.color} // Chaque tuile a une couleur différente
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
        <mesh position={[hexPositions[randomTileIndex].position[0], 0.3, hexPositions[randomTileIndex].position[2]]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} /> {/* Taille du cube */}
          <meshStandardMaterial color="#e74c3c" /> {/* Couleur rouge */}
        </mesh>
      )}
    </>
  );
};

export default Scene;
