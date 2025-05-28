/* ========================================
 * IMPORTS
 * ======================================== */

// React imports
import React, { useEffect, useRef } from "react";

// Three.js imports
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

// Components
import Tile from "./Tile";
import Bot from "./Bot";

// Stores
import { useTileStore } from "../stores/useTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import useBotStore from "../stores/useBotStore/";
import useGameStore from "../stores/useGameStore";

// Utils
import fsmLogger from "../utils/fsmLogger";
import { 
  getHumanPlayerId, 
  getBotId, 
  getMainShipId, 
  isMainShipId,
} from "../ai/constants/playerConstants";

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
  
  // Player management
  const initializePlayer = usePlayerStore((state) => state.initializePlayer);
  const moveToTile = usePlayerStore((state) => state.moveToTile);
  
  // Bot management
  const initializeBot = useBotStore((state) => state.initializeBot);
  
  // Game configuration
  const botCount = useGameStore((state) => state.botCount);
  const getBotColor = useGameStore((state) => state.getBotColor);
  const getPlayerBaseColor = useGameStore((state) => state.getPlayerBaseColor);
  const getBackgroundColor = useGameStore((state) => state.getBackgroundColor);
  
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
  
  // Generate bot indices dynamically based on botCount
  const botIndices = Array.from({ length: botCount }, (_, index) => index);

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

  // Initialize players and bots when tiles are ready
  useEffect(() => {
    const walkableTiles = getWalkableTiles();
    
    if (walkableTiles.length > 0 && !playersInitialized) {
      fsmLogger.info("[Scene] Initializing players with tiles");
      initializePlayer(walkableTiles);
      markPlayersAsInitialized();
    }
    
    if (playersInitialized && !botsInitialized) {
      fsmLogger.info("[Scene] Initializing bots...");
      
      for (let i = 0; i < botCount; i++) {
        const botId = getBotId(i);
        fsmLogger.info(`[Scene] Initializing Bot ${i} (${botId})`, null, botId);
        initializeBot(i);
      }
      
      markBotsAsInitialized();
    }
  }, [getWalkableTiles, playersInitialized, botsInitialized, initializePlayer, initializeBot, botCount, markPlayersAsInitialized, markBotsAsInitialized]);

  /* ========================================
   * CAMERA CONFIGURATION
   * ======================================== */

  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  const handleTileClick = (tile) => {
    // Move main ship to clicked tile
    const mainShipId = getMainShipId(getHumanPlayerId(1));
    moveToTile(getHumanPlayerId(1), mainShipId, {
      coord: tile.coord,
      position: tile.position,
    });
  };

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
      {Object.keys(tiles).length > 0 && (
        <Bot 
          isHuman={true}
          color="blue"
        />
      )}
      
      {/* AI Bots with dynamic colors */}
      {botIndices.map((botIndex) => (
        <Bot 
          key={`bot-${botIndex}`}
          botIndex={botIndex}
          color={getBotColor(botIndex)}
        />
      ))}

      {/* ========================================
       * WALKABLE TILES
       * ======================================== */}
      
      {getWalkableTiles().map((tile) => (
        <Tile
          key={tile.coord}
          position={[tile.position.x, 0, tile.position.z]}
          radius={1}
          color={tile.color}
          onClick={() => handleTileClick(tile)}
          coord={tile.coord}
        />
      ))}

      {/* ========================================
       * PLAYER BASES (DEPART TILES)
       * ======================================== */}
      
      {getDepartTiles().map((tile) => {
        const baseColor = getPlayerBaseColor(tile.playerIndex);
        
        return (
          <React.Fragment key={`depart-tile-${tile.coord}`}>
            {/* Base platform */}
            <mesh
              position={[tile.position.x, 0.2, tile.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.5, 32]} />
              <meshStandardMaterial color={baseColor} />
            </mesh>
            
            {/* Player identifier label */}
            <Html
              position={[tile.position.x, 0.5, tile.position.z]}
              center
              distanceFactor={15}
            >
              <div style={{
                background: getBackgroundColor(baseColor),
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
                {tile.isPlayerBase ? 'Joueur 1' : `Bot ${tile.playerIndex}`}
              </div>
            </Html>
          </React.Fragment>
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
