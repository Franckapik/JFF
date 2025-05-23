import React, { useState } from "react";
import { useTileAnimation } from "../animations/useTileAnimation";
import { useTileStore } from "../stores/useTileStore";
import { Html } from "@react-three/drei";

const Tile = React.memo(({ position, radius, color, isHighTile, onClick, coord }) => {
  const meshRef = useTileAnimation(isHighTile);
  const updateHoveredTile = useTileStore((state) => state.updateHoveredTile);
  
  // Récupérer l'état d'exploration directement du store avec un sélecteur memoizé
  const isExplored = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].explored : false
  );
  
  // Récupérer l'état de collection directement du store avec un sélecteur memoizé
  const isCollected = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].collected : false
  );
  
  // Récupérer le pourcentage de ressources restantes avec un sélecteur memoizé
  const resourcePercentage = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].resourcePercentage : 0
  );
  
  // Une tuile est partiellement collectée si le pourcentage est entre 1 et 99%
  const isPartiallyCollected = resourcePercentage > 0 && resourcePercentage < 100;
  
  // Handle hover events avec useCallback
  const handlePointerOver = React.useCallback(() => {
    updateHoveredTile(coord);
  }, [coord, updateHoveredTile]);
  
  const handlePointerOut = React.useCallback(() => {
    updateHoveredTile(null);
  }, [updateHoveredTile]);

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
          roughness={0.7} // Surface rugueuse
        />
      </mesh>

      {/* Affichage du pourcentage de ressources si la tuile est partiellement collectée */}
      {isPartiallyCollected && (
        <Html
          position={[position[0], 0.4, position[2]]}
          center
          distanceFactor={15}
        >
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: '#ff9933',
            padding: '3px 6px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            {resourcePercentage}%
          </div>
        </Html>
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function pour optimiser les re-rendus
  return (
    prevProps.coord === nextProps.coord &&
    prevProps.color === nextProps.color &&
    prevProps.radius === nextProps.radius &&
    prevProps.isHighTile === nextProps.isHighTile &&
    prevProps.position[0] === nextProps.position[0] &&
    prevProps.position[1] === nextProps.position[1] &&
    prevProps.position[2] === nextProps.position[2]
    // We don't compare onClick as it's a callback and should be memoized by the parent
  );
});

export default Tile;
