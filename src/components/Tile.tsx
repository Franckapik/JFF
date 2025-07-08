import React from "react";
import { Mesh } from "three";
import { useTileAnimation } from "../animations/useTileAnimation";
import fsmLogger from "../logger/fsmLogger";
import useGameStore from "../stores/useGameStore";
import { useTileStore } from "../stores/useTileStore/index";
import { isTileCompletelyCollected, isTilePartiallyCollected } from "../stores/useTileStore/slices/tileResourceSlice";
import useXFSMStore from "../stores/useXFSMStore/index.ts";
import type { BotId } from "../types/fsm";
import type { TileProps } from "../types/tile";
import TileHelpers from "./TileHelpers";

/**
 * =================================================================
 * Composant Tile
 * =================================================================
 * Représente une tuile hexagonale sur la carte du jeu.
 * Gère l'affichage, les interactions et l'état des ressources.
 */
const Tile: React.FC<TileProps> = ({ 
  position, 
  radius, 
  color, 
  coord,
  isHighTile = false, 
  onClick
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
  
  // Sélecteurs pour les couleurs depuis le store de jeu
  const getPlayerBaseColor = useGameStore((state) => state.getPlayerBaseColor);
  const getBackgroundColor = useGameStore((state) => state.getBackgroundColor);
  
  // Sélecteur pour les bots actifs
  const activeBots = useXFSMStore((state) => state.activeBots);
  
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
   * ÉTATS DÉRIVÉS
   * -----------------------------------------------------------------
   */
  
  // Récupérer la tuile depuis le store pour utiliser les utilitaires
  const tile = useTileStore((state) => state.tiles[coord]);
  
  // Récupérer le type de tuile pour afficher les stations appropriées
  const tileType = tile ? tile.type : null;
  
  // Déterminer si c'est une tuile de départ assignée
  const isAssignedDepartTile = tile?.type === 'depart' && !!tile?.assignedToBot;
  
  // Calculer les propriétés pour les tuiles de départ assignées
  const playerIndex = isAssignedDepartTile && tile?.assignedToBot 
    ? activeBots.indexOf(tile.assignedToBot as BotId) 
    : -1;
  
  const baseColor = isAssignedDepartTile && playerIndex >= 0 
    ? getPlayerBaseColor(playerIndex) 
    : undefined;
  
  const backgroundColor = baseColor 
    ? getBackgroundColor(baseColor) 
    : undefined;
  
  const labelText = isAssignedDepartTile && tile?.assignedToBot 
    ? tile.assignedToBot 
    : undefined;
  
  /**
   * -----------------------------------------------------------------
   * EFFETS
   * -----------------------------------------------------------------
   */
  
  // Log les tuiles explorées pour debugging
  React.useEffect(() => {
    if (isExplored && !isAssignedDepartTile) {
      fsmLogger.info(`🗺️ Tile ${coord} is now marked as explored`);
    }
  }, [isExplored, coord, isAssignedDepartTile]);
  
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

      {/* Helpers visuels pour les tuiles */}
      <TileHelpers
        position={position}
        tileType={tileType}
        isAssignedDepartTile={!!isAssignedDepartTile}
        baseColor={baseColor}
        backgroundColor={backgroundColor}
        labelText={labelText}
        shouldShowPercentage={!!shouldShowPercentage}
        isCompletelyCollected={!!isCompletelyCollected}
        resourcePercentage={resourcePercentage}
        isRecentlyCollected={!!isRecentlyCollected}
        isExplored={!!isExplored}
      />
    </>
  );
};

Tile.displayName = 'Tile';

export default Tile;
