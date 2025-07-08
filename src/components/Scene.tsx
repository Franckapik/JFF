/* ========================================
 * IMPORTS
 * ======================================== */

// React imports
import React, { useEffect } from "react";

// Three.js imports
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

// Components
import Fleet from "./Fleet";
import Tile from "./Tile.tsx";

// Stores
import useGameStore from "../stores/useGameStore";
import { useTileStore } from "../stores/useTileStore/index";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

// Types
import "../types/r3f.d.ts"; // Import R3F global type declarations

// Utils
import { BotId } from "@/types/fsm.ts";
import fsmLogger from "../logger/fsmLogger";

// Constantes
const TILE_TYPES = {
  DEPART: 'depart' as const,
};

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
  const tiles = useTileStore((state) => state.tiles);
  const assignStartingTiles = useTileStore((state) => state.assignStartingTiles);
  
 
  // Game configuration - seulement pour getBotColor maintenant
  const getBotColor = useGameStore((state) => state.getBotColor);
  
  // FSM Store - source de vérité pour les bots actifs (nouveau système XState)
  const activeBots = useXFSMStore((state) => state.activeBots);
  const addBot = useXFSMStore((state) => state.addBot);
  
  // Initialization state
  const {
    tilesInitialized,
    markTilesAsInitialized,
    markBotsAsInitialized,
    botsInitialized,
    markPlayersAsInitialized,
    playersInitialized
  } = useGameStore();
  
  const isGameInitialized = useGameStore((state) => state.isGameInitialized());


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
    if (tilesInitialized && !activeBots.includes('bot-0' as BotId)) {
      addBot('bot-0' as BotId);
      markBotsAsInitialized();
    }
  }, [tilesInitialized, addBot, activeBots]);

  // Ajout du player par défaut après initialisation des tuiles EN ATTENTE DE L'IMPLEMENTATION D'UN JOUEUR
  useEffect(() => {
    if (botsInitialized && !playersInitialized) {
      //logic to add player if needed
      markPlayersAsInitialized();
    }
  }, [botsInitialized]);

    /* ========================================
   * CONFIGURATION & CONSTANTS
   * ======================================== */

  // Synchroniser les tuiles de départ avec les bots FSM actifs
  useEffect(() => {
    // Permettre la création initiale de tuiles de départ même s'il n'y en a pas encore
    if (botsInitialized && activeBots.length > 0) {
      assignStartingTiles(activeBots);
    }
  }, [activeBots, botsInitialized, assignStartingTiles]); 

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

  if (!isGameInitialized) {
    return (
      <Html center>
        <div style={{color: '#fff', textAlign: 'center', padding: '20px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '8px'}}>
          Chargement de la scène...
        </div>
      </Html>
    );
  }

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
      {/* All tiles rendering */}
      {Object.values(tiles).map((tile) => {
        // Vérifier si c'est une tuile de départ assignée à un bot actif
        const isAssignedDepartTile = tile.type === TILE_TYPES.DEPART && 
                                   tile.assignedToBot && 
                                   activeBots.includes(tile.assignedToBot as BotId);
        
        // Calculer l'index du joueur pour le Fleet
        const playerIndex = isAssignedDepartTile ? activeBots.indexOf(tile.assignedToBot as BotId) : -1;

        return (
          <React.Fragment key={tile.coord}>
            <Tile
              position={[tile.position.x, 0, tile.position.z]}
              radius={1}
              color={tile.color || "#888888"}
              coord={tile.coord}
            />
            
            {/* Fleet pour les tuiles de départ assignées */}
            {isAssignedDepartTile && (
              // @ts-ignore
              <group position={[tile.position.x, 0.5, tile.position.z]}>
                <Fleet
                  botId={tile.assignedToBot as BotId}
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
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Scene;
