import React from "react";
import { useTileAnimation } from "../animations/useTileAnimation";

const Tile = ({ position, radius, color, isHighTile, onClick }) => {
  const meshRef = useTileAnimation(isHighTile);

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

export default Tile;
