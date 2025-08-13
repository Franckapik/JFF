import React from "react";
import { Mesh } from "three";

import { config } from '../config';

import { useTileAnimation } from "../animations/useTileAnimation";
import fsmLogger from "../logger/fsmLogger.ts";
import useGameStore from "../stores/useGameStore";
import { useTileStore } from "../stores/useTileStore/index";
import { isTileCompletelyCollected } from "../stores/useTileStore/slices/tileResourceSlice";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

import type { BotId } from "../types/fsm.d.ts";
import type { TileProps } from "../types/r3f";

import TileHelpers from "./Helpers/TileHelpers.tsx";

import type { GameStoreType, TileStoreType, XFSMStoreType } from "@/types/stores.d";

/**
 * =================================================================
 * Composant Tile
 * =================================================================
 * Représente une tuile hexagonale sur la carte du jeu.
 * Gère l'affichage, les interactions et l'état des ressources.
 */
const Tile: React.FC<TileProps> = ({ 
  position, 
  color, 
  isHighTile = false, 
}) => {
  /**
   * -----------------------------------------------------------------
   * HOOKS ET SÉLECTEURS
   * -----------------------------------------------------------------
   */
  // Référence pour l'animation de la tuile
  const meshRef = useTileAnimation(isHighTile);
  
  // Sélecteurs pour les états de la tuile depuis le store
  const updateHoveredTile = useTileStore((state: TileStoreType) => state.updateHoveredTile);

  // Sélecteurs pour les couleurs depuis le store de jeu
  const getPlayerBaseColor = useGameStore((state: GameStoreType) => state.getPlayerBaseColor);
  const getBackgroundColor = useGameStore((state: GameStoreType) => state.getBackgroundColor);

  // Sélecteur pour les bots actifs
  const activeBots = useXFSMStore((state: XFSMStoreType) => state.activeBots);

  const resourcePercentage = useTileStore((state: TileStoreType) => 
    state.tiles[position.coord] ? state.tiles[position.coord].resourcePercentage : 0
  );

  const isExplored = useTileStore((state: TileStoreType) => 
    state.tiles[position.coord] ? state.tiles[position.coord].explored === true : false
  );

  // Nouveau sélecteur pour les tuiles récemment collectées
  const lastCollectedTimestamp = useTileStore((state: TileStoreType) => 
    state.tiles[position.coord] ? state.tiles[position.coord].lastCollectedTimestamp : null
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
  const tile = useTileStore((state: TileStoreType) => state.tiles[position.coord]);
  
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
      fsmLogger.info(`🗺️ Tile ${position.coord} is now marked as explored`);
    }
  }, [isExplored, position.coord, isAssignedDepartTile]);
  

  
  // Une tuile est complètement collectée si le pourcentage est à 0%
  const isCompletelyCollected = tile ? isTileCompletelyCollected(tile) : false;
  
  // Afficher le pourcentage seulement si la tuile a été collectée (pour voir 0%)
  const shouldShowPercentage = isCompletelyCollected && resourcePercentage !== undefined;
  
  /**
   * -----------------------------------------------------------------
   * GESTIONNAIRES D'ÉVÉNEMENTS
   * -----------------------------------------------------------------
   */
  const handlePointerOver = React.useCallback(() => {
    updateHoveredTile(position.coord);
  }, [position.coord, updateHoveredTile]);
  
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
        ref={meshRef as React.RefObject<Mesh>} 
        position={[position.x, position.y, position.z]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[1, 1, 0.2, 6]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Helpers visuels pour les tuiles */}
      {config.showHelpers.tile && (
        <TileHelpers
          position={[position.x, position.y, position.z]}
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
          coord={position.coord}
        />
      )}
    </>
  );
};

Tile.displayName = 'Tile';

export default Tile;
