/* ========================================
 * IMPORTS
 * ======================================== */

// React imports
import React, { useEffect } from "react";

// Three.js imports
import { useThree } from "@react-three/fiber";

// Components
import Fleet from "./Fleet";
import Tile from "./Tile.tsx";

// Stores
import useGameStore from "../stores/useGameStore";
import { useTileStore } from "../stores/useTileStore/index";
import useXFSMStore from "../stores/useXFSMStore";

// Types
import type { VehicleId } from "../types";
import "../types/r3f.d.ts"; // Import R3F global type declarations

// Utils
import fsmLogger from "../logger/fsmLogger";

/* ========================================
 * MAIN COMPONENT
 * ======================================== */

const Scene: React.FC = () => {
  
  /* ========================================
   * STORES & STATE
   * ======================================== */
  
  // Tile management
  const setTiles = useTileStore((state) => state.setTiles);
  const initializeGameGrid = useTileStore((state) => state.initializeGameGrid);
  const tiles = useTileStore((state) => state.tiles); // Ajout pour forcer le re-rendu
  const getWalkableTiles = useTileStore((state) => state.getWalkableTiles);
  const getDepartTiles = useTileStore((state) => state.getDepartTiles);
  const getFuelStations = useTileStore((state) => state.getFuelStations);
  const getRepairStations = useTileStore((state) => state.getRepairStations);
  const syncStartingTilesWithFSMBots = useTileStore((state) => state.syncStartingTilesWithFSMBots);
  
 
  // Game configuration
  const getBotColor = useGameStore((state) => state.getBotColor);
  const getPlayerBaseColor = useGameStore((state) => state.getPlayerBaseColor);
  const getBackgroundColor = useGameStore((state) => state.getBackgroundColor);
  
  // FSM Store - source de vérité pour les bots actifs (nouveau système XState)
  const activeBots = useXFSMStore((state) => state.activeBots);
  const addBot = useXFSMStore((state) => state.addBot);
  
  // Initialization state
  const {
    tilesInitialized,
    markTilesAsInitialized
  } = useGameStore();
  
  /* ========================================
   * CONFIGURATION & CONSTANTS
   * ======================================== */

  // Synchroniser les tuiles de départ avec les bots FSM actifs
  useEffect(() => {
    // Permettre la création initiale de tuiles de départ même s'il n'y en a pas encore
    if (tilesInitialized && activeBots.length > 0) {
      syncStartingTilesWithFSMBots(activeBots);
    }
  }, [activeBots, tilesInitialized, syncStartingTilesWithFSMBots]); 

  /* ========================================
   * INITIALIZATION EFFECTS
   * ======================================== */

  // Initialize game tiles on component mount
  useEffect(() => {
    if (!tilesInitialized) {
      fsmLogger.game("[Scene] Initializing tiles...");
      const tileMap = initializeGameGrid(3, -0.2); //radius, spacing
      if (tileMap && Object.keys(tileMap).length > 0) {
        setTiles(tileMap);
        markTilesAsInitialized();
      }
    }
  }, [tilesInitialized, initializeGameGrid, setTiles, markTilesAsInitialized]);


  // Ajout du bot par défaut après initialisation des tuiles
  useEffect(() => {
    if (tilesInitialized && !activeBots.includes('bot-0' as VehicleId)) {
      addBot('bot-0' as VehicleId);
    }
  }, [tilesInitialized, addBot, activeBots]);


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
      {/* Scene setup - Grid and lighting */}
      {/* @ts-ignore */}
      <gridHelper args={[10, 10]} />
      {/* @ts-ignore */}
      <ambientLight intensity={1} />
      {/* @ts-ignore */}
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      {/* @ts-ignore */}
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      
      {/* Walkable tiles */}
      {getWalkableTiles().map((tile) => (
        <Tile
          key={tile.coord}
          position={[tile.position.x, 0, tile.position.z]}
          radius={1}
          color={tile.color}
          coord={tile.coord}
        />
      ))}

      {/* Player bases (departure tiles) with fleets */}
      {getDepartTiles()
        .filter(tile => {
          const tileWithPlayer = tile as any;
          const hasPlayer = tileWithPlayer.assignedToBot && activeBots.includes(tileWithPlayer.assignedToBot);
          return hasPlayer;
        })
        .map((tile) => {
          const tileWithPlayer = tile as any;
          const botId = tileWithPlayer.assignedToBot;
          const playerIndex = activeBots.indexOf(botId);
          const baseColor = getPlayerBaseColor(playerIndex);
          const backgroundColor = getBackgroundColor(baseColor);
          const labelText = botId;
          
          return (
            <>
              {/* @ts-ignore */}
              <group key={`depart-group-${tile.coord}`}>
                <Tile
                  key={`depart-tile-${tile.coord}`}
                  position={[tile.position.x, 0, tile.position.z]}
                  radius={1}
                  color={tile.color || "#888888"}
                  coord={tile.coord}
                  isDepart={true}
                  baseColor={baseColor}
                  backgroundColor={backgroundColor}
                  labelText={labelText}
                  playerIndex={playerIndex}
                  showFSMIndicator={true}
                />
                
                {/* @ts-ignore */}
                <group position={[tile.position.x, 0.5, tile.position.z]}>
                  <Fleet
                    botId={botId}
                    botIndex={playerIndex}
                    color={getBotColor(playerIndex)}
                    shipPosition={{
                      x: tile.position.x,
                      y: 0.5,
                      z: tile.position.z
                    }}
                    tileCoord={tile.coord as any}
                  />
                  {/* @ts-ignore */}
                </group>
                {/* @ts-ignore */}
              </group>
            </>
          );
        })}

      {/* Fuel stations */}
      {getFuelStations().map((tile) => (
        // @ts-ignore
        <mesh
          key={`fuel-station-${tile.coord}`}
          position={[tile.position.x, 0.25, tile.position.z]}
        >
          {/* @ts-ignore */}
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="orange" />
        {/* @ts-ignore */}
        </mesh>
      ))}

      {/* Repair stations */}
      {getRepairStations().map((tile) => (
        // @ts-ignore
        <mesh
          key={`repair-station-${tile.coord}`}
          position={[tile.position.x, 0.25, tile.position.z]}
        >
          {/* @ts-ignore */}
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          {/* @ts-ignore */}
          <meshStandardMaterial color="green" />
        {/* @ts-ignore */}
        </mesh>
      ))}
    </>
  );
};

export default Scene;
