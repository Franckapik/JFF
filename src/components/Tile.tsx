import { Html } from "@react-three/drei";
import React from "react";
import { Mesh } from "three";
import { useTileAnimation } from "../animations/useTileAnimation";
import fsmLogger from "../logger/fsmLogger";
import { useTileStore } from "../stores/useTileStore/index";
import { isTileCompletelyCollected, isTilePartiallyCollected } from "../stores/useTileStore/slices/tileResourceSlice";
import type { TileProps } from "../types/tile";

/**
 * =================================================================
 * Composant Tile
 * =================================================================
 * Représente une tuile hexagonale sur la carte du jeu.
 * Gère l'affichage, les interactions et l'état des ressources.
 */
const Tile: React.FC<TileProps> = React.memo(({ 
  position, 
  radius, 
  color, 
  isHighTile = false, 
  onClick, 
  coord,
  isDepart = false,
  baseColor,
  backgroundColor,
  labelText,
  playerIndex,
  showFSMIndicator = false
}) => {
  /**
   * -----------------------------------------------------------------
   * HOOKS ET SÉLECTEURS
   * -----------------------------------------------------------------
   */
  // Référence pour l'animation de la tuile
  const meshRef = useTileAnimation(isHighTile);
  
  // Sélecteurs pour les états de la tuile depuis le store
  const updateHoveredTile = useTileStore((state) => state.updateHoveredTile);
  
  const resourcePercentage = useTileStore((state) => 
    state.tiles[coord] ? (state.tiles[coord] as any).resourcePercentage : 0
  );
  
  const isExplored = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].explored === true : false
  );

  // Nouveau sélecteur pour les tuiles récemment collectées
  const lastCollectedTimestamp = useTileStore((state) => 
    state.tiles[coord] ? (state.tiles[coord] as any).lastCollectedTimestamp : null
  );

  // Une tuile est récemment collectée si elle l'a été dans les 10 dernières secondes
  const isRecentlyCollected = React.useMemo(() => {
    if (!lastCollectedTimestamp) return false;
    const now = Date.now();
    const timeDiff = now - lastCollectedTimestamp;
    return timeDiff < 10000; // 10 secondes
  }, [lastCollectedTimestamp]);
  
  /**
   * -----------------------------------------------------------------
   * EFFETS
   * -----------------------------------------------------------------
   */
  
  // Log les tuiles explorées pour debugging
  React.useEffect(() => {
    if (isExplored && !isDepart) {
      fsmLogger.info(`🗺️ Tile ${coord} is now marked as explored`);
    }
  }, [isExplored, coord, isDepart]);
  
  /**
   * -----------------------------------------------------------------
   * ÉTATS DÉRIVÉS
   * -----------------------------------------------------------------
   */
  
  // Récupérer la tuile depuis le store pour utiliser les utilitaires
  const tile = useTileStore((state) => state.tiles[coord]);
  
  // Une tuile est partiellement collectée si le pourcentage est entre 1 et 99%
  const isPartiallyCollected = tile ? isTilePartiallyCollected(tile) : false;
  
  // Une tuile est complètement collectée si le pourcentage est à 0%
  const isCompletelyCollected = tile ? isTileCompletelyCollected(tile) : false;
  
  // Afficher le pourcentage seulement si la tuile a été collectée (pour voir 0%)
  const shouldShowPercentage = isCompletelyCollected && resourcePercentage !== undefined;
  
  // 🔍 DEBUG: Log pour tracer l'affichage du pourcentage de ressources (toutes valeurs)
  React.useEffect(() => {
    if (resourcePercentage !== undefined && resourcePercentage !== null) {
      fsmLogger.resources(`🔍 DEBUG: Tile ${coord} resource percentage update`, {
        coord,
        resourcePercentage,
        isPartiallyCollected,
        isCompletelyCollected,
        shouldShowPercentage,
        willShowRedCircle: isCompletelyCollected,
        tileExists: !!useTileStore.getState().tiles[coord],
        tileResources: useTileStore.getState().tiles[coord]?.resources,
        tileCollected: tile ? (tile as any).resourcePercentage : undefined
      });
    }
  }, [resourcePercentage, coord, isPartiallyCollected, isCompletelyCollected, shouldShowPercentage, tile]);
  
  /**
   * -----------------------------------------------------------------
   * GESTIONNAIRES D'ÉVÉNEMENTS
   * -----------------------------------------------------------------
   */
  const handlePointerOver = React.useCallback(() => {
    updateHoveredTile(coord);
  }, [coord, updateHoveredTile]);
  
  const handlePointerOut = React.useCallback(() => {
    updateHoveredTile(null);
  }, [updateHoveredTile]);

  /**
   * -----------------------------------------------------------------
   * RENDU DU COMPOSANT
   * -----------------------------------------------------------------
   */
  return (
    <>
      {/* Mesh principal de la tuile hexagonale */}
      {/* @ts-ignore */}
      <mesh 
        ref={meshRef as React.RefObject<Mesh>} 
        position={position} 
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* @ts-ignore */}
        <cylinderGeometry args={[radius, radius, 0.2, 6]} />
        {/* @ts-ignore */}
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.7}
        />
      {/* @ts-ignore */}
      </mesh>

      {/* Pour les tuiles de départ (bases des joueurs) - élément de base */}

      {/* Indicateur de pourcentage de ressources restantes */}
      {shouldShowPercentage && (
        <>
          {/* Cercle rouge pour les tuiles complètement collectées */}
          {isCompletelyCollected && (
            // @ts-ignore
            <mesh
              position={[position[0], 0.05, position[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {/* @ts-ignore */}
              <circleGeometry args={[0.6, 32]} />
              {/* @ts-ignore */}
              <meshBasicMaterial 
                color="#ff4444" 
                transparent={true}
                opacity={0.6}
              />
            {/* @ts-ignore */}
            </mesh>
          )}
          
          {/* Affichage du pourcentage */}
          <Html
            position={[position[0], 0.4, position[2]]}
            center
            distanceFactor={15}
          >
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
            }}>
              {resourcePercentage}%
            </div>
          </Html>
        </>
      )}

      {/* Indicateur de collecte récente */}
      {isRecentlyCollected && (
        <>
          {/* Effet de pulsation lumineux */}
          {/* @ts-ignore */}
          <mesh
            position={[position[0], 0.15, position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {/* @ts-ignore */}
            <circleGeometry args={[0.8, 32]} />
            {/* @ts-ignore */}
            <meshBasicMaterial 
              color="#00ffff" 
              transparent={true}
              opacity={0.3}
            />
          {/* @ts-ignore */}
          </mesh>
          
          {/* Label de collecte récente */}
          <Html
            position={[position[0], 0.6, position[2]]}
            center
            distanceFactor={20}
          >
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
            }}>
              💎 Collecté !
            </div>
          </Html>
        </>
      )}

      {/* Helper visuel pour les tuiles explorées */}
      {isExplored && !isDepart && (
        // @ts-ignore
        <mesh
          position={[position[0], 0.2, position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {/* @ts-ignore */}
          <circleGeometry args={[0.6, 16]} />
          {/* @ts-ignore */}
          <meshBasicMaterial 
            color="#00ff88" 
            transparent={true}
            opacity={0.7}
          />
        {/* @ts-ignore */}
        </mesh>
      )}

      {/* Tuile de départ (base joueur) */}
      {isDepart && (
        <>
          {/* Base platform */}
          {/* @ts-ignore */}
          <mesh
            position={[position[0], 0.2, position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {/* @ts-ignore */}
            <circleGeometry args={[0.5, 32]} />
            {/* @ts-ignore */}
            <meshStandardMaterial color={baseColor} />
          {/* @ts-ignore */}
          </mesh>
                    
          {/* Player identifier label */}
          <Html
            position={[position[0], 0.5, position[2]]}
            center
            distanceFactor={15}
          >
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
            }}>
              {labelText}
            </div>
          </Html>
        </>
      )}
    </>
  );
}, 
/**
 * Fonction de comparaison pour la mémoisation
 * Optimise les re-rendus en ne mettant à jour le composant que lorsque
 * les propriétés importantes changent
 */
(prevProps: TileProps, nextProps: TileProps) => {
  return (
    prevProps.coord === nextProps.coord &&
    prevProps.color === nextProps.color &&
    prevProps.radius === nextProps.radius &&
    prevProps.isHighTile === nextProps.isHighTile &&
    prevProps.position[0] === nextProps.position[0] &&
    prevProps.position[1] === nextProps.position[1] &&
    prevProps.position[2] === nextProps.position[2] &&
    prevProps.isDepart === nextProps.isDepart &&
    prevProps.baseColor === nextProps.baseColor &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.labelText === nextProps.labelText &&
    prevProps.playerIndex === nextProps.playerIndex &&
    prevProps.showFSMIndicator === nextProps.showFSMIndicator
    // We don't compare onClick as it's a callback and should be memoized by the parent
  );
});

Tile.displayName = 'Tile';

export default Tile;
