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
import { useTileStore } from "../stores/useTileStore/index.ts";
import useXFSMStore from "../stores/useXFSMStore/index.ts";

// Types
import type { BotId } from "@/types/fsm.d.ts";
import type { TileProps } from "@/types/r3f";
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
      {/* Scene setup - Grid and lighting */}
      <gridHelper args={[10, 10]} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      
      {/* All tiles rendering */}
      {Object.values(tiles).map(tile => {
        const typedTile = tile as TileProps;
        // Utiliser WorldPosition pour Tile, array pour primitives Three.js
        const posObj = typedTile.position;
  // (supprimé : variable non utilisée)

        // Vérifier si c'est une tuile de départ assignée à un bot actif
        const isAssignedDepartTile =
          typedTile.type === 'depart' && typedTile.assignedToBot && activeBots.includes(typedTile.assignedToBot as BotId);

        return (
          <React.Fragment key={typedTile.coord}>
            <Tile
              position={posObj}
              radius={typedTile.radius ?? 1}
              color={typedTile.color || "#888888"}
              coord={typedTile.coord}
              isHighTile={typedTile.isHighTile}
              onClick={typedTile.onClick}
            />
            {/* Fleet pour les tuiles de départ assignées - SEULEMENT si le bot est actif */}
            {isAssignedDepartTile && isBotActive(typedTile.assignedToBot as BotId) && (
              <group position={[posObj.x, 0.5, posObj.z]}>
                <Fleet
                  botId={typedTile.assignedToBot as BotId}
                  fleetPosition={{
                    x: posObj.x, // ✅ Vraies coordonnées mondiales
                    y: 0.5,
                    z: posObj.z,
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
