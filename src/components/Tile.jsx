import React from "react";
import { useTileAnimation } from "../animations/useTileAnimation";
import { useTileStore } from "../stores/useTileStore";
import { Html } from "@react-three/drei";
import fsmLogger from "../logger/fsmLogger";
import { isTileCompletelyCollected, isTilePartiallyCollected } from "../stores/useTileStore/slices/tileResourceSlice";

/**
 * =================================================================
 * Composant Tile
 * =================================================================
 * Représente une tuile hexagonale sur la carte du jeu.
 * Gère l'affichage, les interactions et l'état des ressources.
 * 
 * @param {Object} props
 * @param {Array} props.position - Position [x, y, z] de la tuile dans l'espace 3D
 * @param {number} props.radius - Rayon de la tuile hexagonale
 * @param {string} props.color - Couleur de la tuile
 * @param {boolean} props.isHighTile - Indique si la tuile est surélevée 
 * @param {Function} props.onClick - Gestionnaire d'événement au clic
 * @param {string} props.coord - Coordonnées de la tuile au format "x,y"
 * @param {boolean} props.isDepart - Indique si c'est une tuile de départ (base joueur)
 * @param {string} props.baseColor - Couleur de la base du joueur (pour les tuiles de départ)
 * @param {string} props.backgroundColor - Couleur de fond du label (pour les tuiles de départ)
 * @param {string} props.labelText - Texte du label (pour les tuiles de départ)
 * @param {number} props.playerIndex - Indice du joueur (pour les tuiles de départ)
 * @param {boolean} props.showFSMIndicator - Affiche un indicateur FSM au-dessus de la tuile de départ
 */
const Tile = React.memo(({ 
  position, 
  radius, 
  color, 
  isHighTile, 
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
    state.tiles[coord] ? state.tiles[coord].resourcePercentage : 0
  );
  
  const isExplored = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].explored === true : false
  );

  // Nouveau sélecteur pour les tuiles récemment collectées
  const lastCollectedTimestamp = useTileStore((state) => 
    state.tiles[coord] ? state.tiles[coord].lastCollectedTimestamp : null
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
        tileCollected: tile?.resourcePercentage
      });
    }
  }, [resourcePercentage, coord, isPartiallyCollected, isCompletelyCollected, shouldShowPercentage]);
  
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
      <mesh 
        ref={meshRef} 
        position={position} 
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[radius, radius, 0.2, 6]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Pour les tuiles de départ (bases des joueurs) - élément de base */}

      {/* Indicateur de pourcentage de ressources restantes */}
      {shouldShowPercentage && (
        <>
          {/* Cercle rouge pour les tuiles complètement collectées */}
          {isCompletelyCollected && (
            <mesh
              position={[position[0], 0.05, position[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.6, 32]} />
              <meshBasicMaterial 
                color="#ff4444" 
                transparent={true}
                opacity={0.6}
              />
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
          <mesh
            position={[position[0], 0.15, position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.8, 32]} />
            <meshBasicMaterial 
              color="#00ffff" 
              transparent={true}
              opacity={0.3}
            />
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
        <mesh
          position={[position[0], 0.2, position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.6, 16]} />
          <meshBasicMaterial 
            color="#00ff88" 
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      )}

      {/* Tuile de départ (base joueur) */}
      {isDepart && (
        <>
          {/* Base platform */}
          <mesh
            position={[position[0], 0.2, position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color={baseColor} />
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
(prevProps, nextProps) => {
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

export default Tile;
