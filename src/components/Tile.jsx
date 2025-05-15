import React, { useState } from "react";
import { useTileAnimation } from "../animations/useTileAnimation";
import { useTileStore } from "../stores/useNewTileStore";

const Tile = ({ position, radius, color, isHighTile, onClick, coord }) => {
  const meshRef = useTileAnimation(isHighTile);
  const updateHoveredTile = useTileStore((state) => state.updateHoveredTile);
  
  // Récupérer l'état d'exploration directement du store
  const isExplored = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].explored : false
  );
  
  // Récupérer l'état de collection directement du store
  const isCollected = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].collected : false
  );
  
  // Récupérer le pourcentage de ressources restantes
  const resourcePercentage = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].resourcePercentage : 0
  );
  
  // Une tuile est partiellement collectée si le pourcentage est entre 1 et 99%
  const isPartiallyCollected = resourcePercentage > 0 && resourcePercentage < 100;
  
  // Handle hover events
  const handlePointerOver = () => {
    updateHoveredTile(coord);
  };
  
  const handlePointerOut = () => {
    updateHoveredTile(null);
  };

  return (
    <>
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
      
      {/* Indicateur d'exploration - petit cercle sur la tuile */}
      {isExplored && (
        <mesh
          position={[position[0], 0.21, position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[radius * 0.3, 16]} />
          <meshStandardMaterial 
            color="#00ffaa" 
            emissive="#00ffaa"
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
      
      {/* Indicateur de collection - cercle rouge sur la tuile */}
      {isCollected && (
        <mesh
          position={[position[0], 0.22, position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[radius * 0.25, 16]} />
          <meshStandardMaterial 
            color="#ff3333" 
            emissive="#ff0000"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
      
      {/* Indicateur de collection partielle - cercle orange sur la tuile */}
      {isPartiallyCollected && (
        <mesh
          position={[position[0], 0.22, position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[radius * 0.25, 16]} />
          <meshStandardMaterial 
            color="#ff9933" 
            emissive="#ff8800"
            emissiveIntensity={0.6}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </>
  );
};

export default Tile;
