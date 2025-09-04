/* eslint-disable */

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
import SceneHelper from "./Helpers/SceneHelper";
import Tile from "./Tile.tsx";

// Stores
import useGameStore from "../stores/useGameStore";
import { useTileStore } from "../stores/useTileStore/index.ts";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

// Types
import type { BotId } from "@/types/fsm.d.ts";
import { GameStoreType, TileStoreType, XFSMStoreType } from "@/types/stores.js";



/* ========================================
 * MAIN COMPONENT
 * ======================================== */

const Scene: React.FC = () => {
  /* ========================================
   * STORES & STATE
   * ======================================== */

  // Tile management
  const setTiles = useTileStore((state: TileStoreType) => state.setTiles);
  const initializeGameGrid = useTileStore((state: TileStoreType) => state.initializeGameGrid);
  const tiles = useTileStore((state: TileStoreType) => state.tiles);
  const assignStartingTiles = useTileStore((state: TileStoreType) => state.assignStartingTiles);
  // Import radius and spacing from tileBaseSlice
  const radius = useTileStore((state: TileStoreType) => state.radius);
  const spacing = useTileStore((state: TileStoreType) => state.spacing);

  // Game configuration
  const isGameInitialized = useGameStore((state: GameStoreType) => state.isGameInitialized());


  // FSM Store
  const activeBots = useXFSMStore((state: XFSMStoreType) => state.activeBots);
  const addBot = useXFSMStore((state: XFSMStoreType) => state.addBot);
  const startBot = useXFSMStore((state: XFSMStoreType) => state.startBot);
  const isBotActive = useXFSMStore((state: XFSMStoreType) => state.isBotActive);

  // Initialization state
  const { tilesInitialized, markTilesAsInitialized, markBotsAsInitialized, botsInitialized, markPlayersAsInitialized, playersInitialized } =
    useGameStore();


  /* ========================================
   * INITIALIZATION EFFECTS
   * ======================================== */

  // Initialize game tiles on component mount
  useEffect(() => {
    if (!tilesInitialized) {
      const tileMap = initializeGameGrid(radius, spacing); // Utilise les valeurs du slice
      if (tileMap && Object.keys(tileMap).length > 0) {
        setTiles(tileMap);
        markTilesAsInitialized();
      }
    }
  }, [tilesInitialized, initializeGameGrid, setTiles, markTilesAsInitialized]);

  // Ajout du bot par défaut après initialisation des tuiles
  useEffect(() => {
    if (tilesInitialized && !activeBots.includes("bot-0" as BotId)) {
      addBot("bot-0" as BotId);
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

  // Démarrer les bots une fois que les tuiles de départ sont assignées
  // ⚠️ LOGIQUE CRITIQUE : Respecter l'ordre d'initialisation pour éviter les meshes invisibles
  const startingTilesAssigned = useGameStore(state => state.startingTilesAssigned);
  const markStartingTilesAsAssigned = useGameStore(state => state.markStartingTilesAsAssigned);

  // 🎯 PHASE 1 : Assignment des tuiles de départ AVANT le démarrage des acteurs
  useEffect(() => {
    if (botsInitialized && activeBots.length > 0 && !startingTilesAssigned) {
      assignStartingTiles(activeBots);
      markStartingTilesAsAssigned();
    }
  }, [botsInitialized, activeBots, assignStartingTiles, startingTilesAssigned, markStartingTilesAsAssigned]);

  // 🎯 PHASE 2 : Démarrage des acteurs APRÈS assignment des tuiles
  useEffect(() => {
    if (isGameInitialized && activeBots.length > 0) {
      // Démarrage immédiat - Fleet se chargera de l'initialisation des positions
      activeBots.forEach(botId => {
        startBot(botId);
      });
    }
  }, [isGameInitialized, activeBots, startBot]);

  /* ========================================
   * CONFIGURATION & CONSTANTS
   * ========================================*/

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
        <div style={{ color: "#fff", textAlign: "center", padding: "20px", backgroundColor: "rgba(0,0,0,0.7)", borderRadius: "8px" }}>
          <h3>Initializing Game...</h3>
          <p>{!startingTilesAssigned ? "Assigning starting positions..." : "Setting up game components..."}</p>
        </div>
      </Html>
    );
  }

  return (
    <>
      {/* Scene FSM State Helper */}
      <SceneHelper />
      
      {/* Scene setup - Grid and lighting */}
      <gridHelper args={[10, 10]} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      
      {/* All tiles rendering */}
      {Object.values(tiles).map(tile => {
        // Vérifier si c'est une tuile de départ assignée à un bot actif
        const isAssignedDepartTile =
          tile.type === 'depart' && tile.assignedToBot && activeBots.includes(tile.assignedToBot as BotId);

        return (
          <React.Fragment key={tile.position.coord}>
            <Tile
              position={tile.position}
              color={tile.color || "#888888"}
              isHighTile={false}
            />
            {/* Fleet pour les tuiles de départ assignées - SEULEMENT si le bot est actif */}
            {isAssignedDepartTile && isBotActive(tile.assignedToBot as BotId) && (
              <group position={[tile.position.x, 0.5, tile.position.z]}>
                <Fleet
                  botId={tile.assignedToBot as BotId}
                  initialPosition={{
                    x: 0, // Position relative au group parent
                    y: 0,
                    z: 0,
                  }}
                  tilePosition={{
                    x: tile.position.x,
                    y: tile.position.y,
                    z: tile.position.z,
                  }}
                />
              </group>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Scene;
