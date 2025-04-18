import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

const AnimatedHexTile = ({ position, radius, color, isHighTile, onClick }) => {
  const meshRef = useRef();
  const [progress, setProgress] = useState(0); // Progression de l'animation (0 à 1)
  const [direction, setDirection] = useState(1); // Direction de l'animation (1 = montée, -1 = descente)

  useFrame(() => {
    if (isHighTile && meshRef.current) {
      const speed = 0.01; // Vitesse de l'animation
      const easedProgress = Math.sin((progress * Math.PI) / 2); // Easing avec Math.sin

      // Met à jour la position en fonction de la progression
      meshRef.current.position.y = easedProgress * 0.2;

      // Met à jour la progression
      const newProgress = progress + direction * speed;
      if (newProgress >= 1) {
        setProgress(1);
        setDirection(-1); // Inverse la direction
      } else if (newProgress <= 0) {
        setProgress(0);
        setDirection(1); // Inverse la direction
      } else {
        setProgress(newProgress);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <cylinderGeometry args={[radius, radius, 0.2, 6]} /> {/* Épaisseur de 0.2 */}
      <meshStandardMaterial
        color={color}
        metalness={0.1} // Faible effet métallique
        roughness={0.8} // Rugosité élevée pour un aspect plastique/silicone
      />
    </mesh>
  );
};

export default AnimatedHexTile;
