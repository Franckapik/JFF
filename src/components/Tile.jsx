import React from "react";
import { useTileAnimation } from "../animations/useTileAnimation";
import { useTileStore } from "../stores/useTileStore";
import { Html } from "@react-three/drei";
import { FSMStateIndicator } from "./FSM";
import fsmLogger from "../logger/fsmLogger";

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
  
  /**
   * -----------------------------------------------------------------
   * ÉTATS DÉRIVÉS
   * -----------------------------------------------------------------
   */
  // Une tuile est partiellement collectée si le pourcentage est entre 1 et 99%
  const isPartiallyCollected = resourcePercentage > 0 && resourcePercentage < 100;
  
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

      {/* Helper visuel pour les tuiles explorées */}
      {isExplored && !isDepart && (
        <mesh
          position={[position[0], 0.2, position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.6, 16]} />
          <meshBasicMaterial 
            color="#00ff88" 

          />
        </mesh>
      )}

         {isExplored && !isDepart && fsmLogger.info(`Tile at ${coord} is explored`)}

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
          
          {/* Optionnellement afficher l'indicateur FSM pour cette tuile */}
          {showFSMIndicator && labelText && (
            <FSMStateIndicator
              botId={labelText}
              position={[position[0], 1.0, position[2]]}
              showDetails={false}
            />
          )}
          
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
