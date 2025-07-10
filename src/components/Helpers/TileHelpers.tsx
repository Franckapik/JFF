import { Html } from "@react-three/drei";
import React from "react";

import type { TileHelpersProps } from "../../types/r3f";

const TileHelpers: React.FC<TileHelpersProps> = ({
  position,
  tileType,
  isAssignedDepartTile,
  baseColor,
  backgroundColor,
  labelText,
  shouldShowPercentage,
  isCompletelyCollected,
  resourcePercentage,
  isRecentlyCollected,
  isExplored,
}) => (
  <>
    {/* Indicateur de pourcentage de ressources restantes */}
    {shouldShowPercentage && (
      <>
        {isCompletelyCollected && (
          <mesh position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.6, 32]} />
            <meshBasicMaterial color="#ff4444" transparent opacity={0.6} />
          </mesh>
        )}
        <Html position={[position[0], 0.4, position[2]]} center distanceFactor={15}>
          <div style={{
            background: isCompletelyCollected ? 'rgba(255, 68, 68, 0.8)' : 'rgba(0,0,0,0.7)',
            color: isCompletelyCollected ? '#ffffff' : '#ff9933',
            padding: '3px 6px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none',
            border: isCompletelyCollected ? '2px solid #ff4444' : 'none',
          }}>{resourcePercentage}%</div>
        </Html>
      </>
    )}

    {/* Indicateur de collecte récente */}
    {isRecentlyCollected && (
      <>
        <mesh position={[position[0], 0.15, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </mesh>
        <Html position={[position[0], 0.6, position[2]]} center distanceFactor={20}>
          <div style={{
            background: 'rgba(0,255,255,0.8)',
            color: '#000',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none',
            animation: 'pulse 1s infinite',
          }}>💎 Collecté !</div>
        </Html>
      </>
    )}

    {/* Helper visuel pour les tuiles explorées */}
    {isExplored && !isAssignedDepartTile && (
      <mesh position={[position[0], 0.2, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.7} />
      </mesh>
    )}

    {/* Tuile de départ (base joueur) */}
    {isAssignedDepartTile && (
      <>
        <mesh position={[position[0], 0.2, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <Html position={[position[0], 0.5, position[2]]} center distanceFactor={15}>
          <div style={{
            background: backgroundColor,
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>{labelText}</div>
        </Html>
      </>
    )}

    {/* Station de carburant */}
    {tileType === 'fuel' && (
      <mesh position={[position[0], 0.25, position[2]]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    )}

    {/* Station de réparation */}
    {tileType === 'repair' && (
      <mesh position={[position[0], 0.25, position[2]]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="green" />
      </mesh>
    )}
  </>
);

export default TileHelpers;
