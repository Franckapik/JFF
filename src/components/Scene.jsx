/* ========================================
 * IMPORTS
 * ======================================== */

// React imports
import React, { useEffect, useRef, useMemo } from "react";

// Three.js imports
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber";

// Components
import Tile from "./Tile";

// Stores
import { useTileStore } from "../stores/useTileStore";
import useGameStore from "../stores/useGameStore";
import useFSMStore from "../stores/useFSMStore";

// Utils
import fsmLogger from "../logger/fsmLogger";

/* ========================================
 * MAIN COMPONENT
 * ======================================== */

const Scene = () => {
  
  /* ========================================
   * STORES & STATE
   * ======================================== */
  
  // Tile management
  const tiles = useTileStore((state) => state.tiles);
  const initializeTiles = useTileStore((state) => state.initializeTiles);
  const getWalkableTiles = useTileStore((state) => state.getWalkableTiles);
  const getDepartTiles = useTileStore((state) => state.getDepartTiles);
  const getFuelStations = useTileStore((state) => state.getFuelStations);
  const getRepairStations = useTileStore((state) => state.getRepairStations);
  const syncStartingTilesWithFSMBots = useTileStore((state) => state.syncStartingTilesWithFSMBots);
  
 
  // Game configuration
  const getBotColor = useGameStore((state) => state.getBotColor);
  const getPlayerBaseColor = useGameStore((state) => state.getPlayerBaseColor);
  const getBackgroundColor = useGameStore((state) => state.getBackgroundColor);
  
  // FSM Store - source de vérité pour les bots actifs
  const activeBots = useFSMStore((state) => state.activeBots);
  
  // Initialization state
  const {
    playersInitialized,
    botsInitialized,
    tilesInitialized,
    markPlayersAsInitialized,
    markBotsAsInitialized,
    markTilesAsInitialized
  } = useGameStore();
  
  /* ========================================
   * CONFIGURATION & CONSTANTS
   * ======================================== */
   // Generate bot indices dynamically based on activeBots from FSMStore
  const botIndices = activeBots.map((_, index) => index);

  // Synchroniser les tuiles de départ avec les bots FSM actifs
  useEffect(() => {
    if (tilesInitialized) {
      syncStartingTilesWithFSMBots(activeBots);
      fsmLogger.info("[Scene] Synchronized starting tiles with FSM bots", { 
        activeBots: activeBots.length,
        botIds: activeBots 
      });
    }
  }, [activeBots, tilesInitialized, syncStartingTilesWithFSMBots]);

  /* ========================================
   * INITIALIZATION EFFECTS
   * ======================================== */

  // Initialize game tiles on component mount
  useEffect(() => {
    if (!tilesInitialized) {
      fsmLogger.info("[Scene] Initializing tiles...");
      initializeTiles();
      markTilesAsInitialized();
    }
  }, [tilesInitialized, initializeTiles, markTilesAsInitialized]);


  /* ========================================
   * CAMERA CONFIGURATION
   * ======================================== */

  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);


  /* ========================================
   * RENDER
   * ======================================== */

  return (
    <>
      {/* ========================================
       * SCENE SETUP
       * ======================================== */}
      
      {/* Grid and lighting */}
      <primitive object={new GridHelper(10, 10)} visible={true} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      
      {/* ========================================
       * PLAYERS & BOTS
       * ======================================== */}
      
      {/* Human player (rendered as Bot component) */}
      {/* Temporairement désactivé - Fleet component */}
      {/* {Object.keys(tiles).length > 0 && (
        <Fleet 
          isHuman={true}
          color="blue"
        />
      )} */}
      
      {/* AI Fleets with dynamic colors */}
      {/* Temporairement désactivé - Fleet components */}
      {/* {botIndices.map((botIndex) => (
        <Fleet 
          key={`bot-${botIndex}`}
          botIndex={botIndex}
          color={getBotColor(botIndex)}
        />
      ))} */}

      {/* Note: Les FSM State indicators sont maintenant automatiquement intégrés
       * dans les tuiles de départ (Tile component avec isDepart=true)
       */}

      {/* ========================================
       * WALKABLE TILES
       * ======================================== */}
      
      {getWalkableTiles().map((tile) => (
        <Tile
          key={tile.coord}
          position={[tile.position.x, 0, tile.position.z]}
          radius={1}
          color={tile.color}
          coord={tile.coord}
        />
      ))}

      {/* ========================================
       * PLAYER BASES (DEPART TILES)
       * ======================================== */}
      
      {getDepartTiles()
        .filter(tile => tile.playerId && activeBots.includes(tile.playerId))
        .map((tile) => {
          const baseColor = getPlayerBaseColor(tile.playerIndex);
          const backgroundColor = getBackgroundColor(baseColor);
          const labelText = tile.playerId;
          
          return (
            <Tile
              key={`depart-tile-${tile.coord}`}
              position={[tile.position.x, 0, tile.position.z]}
              radius={1}
              color={tile.color || "#888888"} // couleur de base si non définie
              coord={tile.coord}
              isDepart={true}
              baseColor={baseColor}
              backgroundColor={backgroundColor}
              labelText={labelText}
              playerIndex={tile.playerIndex}
              showFSMIndicator={true} // Afficher l'indicateur FSM dans la tuile
            />
          );
        })}

      {/* ========================================
       * FUEL STATIONS
       * ======================================== */}
      
      {getFuelStations().map((tile) => (
        <mesh
          key={`fuel-station-${tile.coord}`}
          position={[tile.position.x, 0.25, tile.position.z]}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}

      {/* ========================================
       * REPAIR STATIONS
       * ======================================== */}
      
      {getRepairStations().map((tile) => (
        <mesh
          key={`repair-station-${tile.coord}`}
          position={[tile.position.x, 0.25, tile.position.z]}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="green" />
        </mesh>
      ))}
    </>
  );
};

export default Scene;
