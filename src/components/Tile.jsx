import React, { useState } from "react";
import { useTileAnimation } from "../animations/useTileAnimation";
import { useTileStore } from "../stores/useNewTileStore";

const Tile = ({ position, radius, color, isHighTile, onClick, coord }) => {
  const meshRef = useTileAnimation(isHighTile);
  const updateHoveredTile = useTileStore((state) => state.updateHoveredTile);
  
  // Handle hover events
  const handlePointerOver = () => {
    updateHoveredTile(coord);
  };
  
  const handlePointerOut = () => {
    updateHoveredTile(null);
  };

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
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
