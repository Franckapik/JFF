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
import Tile from "./Tile.tsx";

// Stores
import useGameStore from "../stores/useGameStore";
import { useTileStore } from "../stores/useTileStore/index";
import useXFSMStore from "../stores/useXFSMStore/index.ts";


// Utils
import { BotId } from "@/types/fsm.ts";



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

  // Game configuration - seulement pour getBotColorById maintenant
  const getBotColorById = useGameStore(state => state.getBotColorById);

  // FSM Store - source de vérité pour les bots actifs (nouveau système XState)
  const activeBots = useXFSMStore(state => state.activeBots);
  const addBot = useXFSMStore(state => state.addBot);
  const startBot = useXFSMStore(state => state.startBot);
  const isBotActive = useXFSMStore(state => state.isBotActive);

  // Initialization state
  const { tilesInitialized, markTilesAsInitialized, markBotsAsInitialized, botsInitialized, markPlayersAsInitialized, playersInitialized } =
    useGameStore();

  const isGameInitialized = useGameStore(state => state.isGameInitialized());

  /* ========================================
   * INITIALIZATION EFFECTS
   * ======================================== */

  // Initialize game tiles on component mount
  useEffect(() => {
    if (!tilesInitialized) {
      const tileMap = initializeGameGrid(3, -0.2); //radius, spacing
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
      markStartingTilesAsAssigned(true);
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
      {/* Scene setup - Grid and lighting */}
      <gridHelper args={[10, 10]} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      
      {/* All tiles rendering */}
      {Object.values(tiles).map(tile => {
        // Cast tile to the correct type if possible
        type TileType = {
          coord: string;
          position: { x: number; z: number };
          radius?: number;
          color?: string;
          type?: string;
          assignedToBot?: string;
        };
        const typedTile = tile as TileType;

        // Vérifier si c'est une tuile de départ assignée à un bot actif
        const isAssignedDepartTile =
          typedTile.type === 'depart' && typedTile.assignedToBot && activeBots.includes(typedTile.assignedToBot as BotId);

        return (
          <React.Fragment key={typedTile.coord}>
            <Tile position={[typedTile.position.x, 0, typedTile.position.z]} radius={1} color={typedTile.color || "#888888"} coord={typedTile.coord} />
            {/* Fleet pour les tuiles de départ assignées - SEULEMENT si le bot est actif */}
            {isAssignedDepartTile && isBotActive(typedTile.assignedToBot as BotId) && (
              <group position={[typedTile.position.x, 0.5, typedTile.position.z]}>
                <Fleet
                  botId={typedTile.assignedToBot as BotId}
                  color={getBotColorById(typedTile.assignedToBot as BotId)}
                  shipPosition={{
                    x: typedTile.position.x,
                    y: 0.5,
                    z: typedTile.position.z,
                  }}
                  dronePosition={{
                    x: typedTile.position.x + 0.5,
                    y: 0.8,
                    z: typedTile.position.z + 0.5,
                  }}
                  tileCoord={typedTile.coord as any}
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
