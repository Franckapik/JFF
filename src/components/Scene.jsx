import React, { useEffect, useRef } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Tile from "./Tile";
import Bot from "./Bot";
import { useTileStore } from "../stores/useTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import useBotStore from "../stores/useBotStore/";
import useGameStore from "../stores/useGameStore";
import fsmLogger from "../utils/fsmLogger";
import { 
  HUMAN_PLAYER_ID, 
  getBotPlayerId, 
  getMainShipId, 
  isMainShipId,
} from "../ai/constants/playerConstants";

const Scene = () => {
  const initializeTiles = useTileStore((state) => state.initializeTiles);
  const tiles = useTileStore((state) => state.tiles);
  const initializePlayer = usePlayerStore((state) => state.initializePlayer);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const moveToTile = usePlayerStore((state) => state.moveToTile);
  
  // Utilisation de useBotStore au lieu de useSimpleBotStore
  const initializeBot = useBotStore((state) => state.initializeBot);
  
  // Récupérer le nombre de bots depuis useGameStore
  const botCount = useGameStore((state) => state.botCount);
  
  // Définir un tableau des indices de bots dynamiquement en fonction de botCount
  const botIndices = Array.from({ length: botCount }, (_, index) => index);
  
  // Définir un tableau de couleurs pour les différents bots
  const botColors = ["red", "orange", "green", "purple", "teal", "brown", "magenta", "cyan"];
  
  const botInitialized = useRef(false);
  const playersInitialized = useRef(false);

  // Initialize tiles
  useEffect(() => {
    fsmLogger.info("[Scene] Initializing tiles...");
    initializeTiles();
  }, [initializeTiles]);

  // Initialize players only once when tiles are first available
  useEffect(() => {
    if (Object.keys(tiles).length > 0 && !playersInitialized.current) {
      fsmLogger.info("[Scene] Initializing players with tiles:", tiles);
      initializePlayer(tiles);
      playersInitialized.current = true;
      
      // Initialize bots after players are set up
      if (!botInitialized.current) {
        fsmLogger.info("[Scene] Initializing bots...");
        
        // Initialiser tous les bots dynamiquement en fonction de botCount
        for (let i = 0; i < botCount; i++) {
          const botId = `player${i+2}`;
          fsmLogger.info(`[Scene] Initializing Bot ${i+1} (${botId})`, null, botId);
          initializeBot(i);
        }
        
        botInitialized.current = true;
      }
    }
  }, [tiles, initializePlayer, initializeBot, botCount]);

  // Camera setup
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const handleTileClick = (tile) => {
    if (selectedVehicle.vehicleId) {
      moveToTile(HUMAN_PLAYER_ID, selectedVehicle.vehicleId, {
        coord: tile.coord,
        position: tile.position,
      });
    }
  };

  return (
    <>
      <primitive object={new GridHelper(10, 10)} visible={true} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.8} />
      
      {/* Joueur humain utilisant le composant Bot */}
      {Object.keys(tiles).length > 0 && (
        <Bot 
          isHuman={true}
          selectedVehicle={selectedVehicle}
          color="blue"
        />
      )}
      
      {/* Rendu des bots en utilisant le composant réutilisable et une boucle */}
      {botIndices.map((botIndex) => {        
        // Utiliser la couleur correspondant à l'index du bot (avec modulo pour gérer plus de bots que de couleurs)
        const colorIndex = botIndex % botColors.length;
        
        return (
          <Bot 
            key={`bot-${botIndex}`}
            botIndex={botIndex}
            selectedVehicle={selectedVehicle}
            color={botColors[colorIndex]}
          />
        );
      })}

      {/* Commentaire à garder pour future référence */}
      {/* Pour l'instant nous ne rendons que les drones d'exploration 
          Les autres drones seront ajoutés quand ils seront activés */}
      
      {Object.values(tiles)
        .filter((tile) => tile.walkable)
        .map((tile) => (
          <Tile
            key={tile.coord}
            position={[tile.position.x, 0, tile.position.z]}
            radius={1}
            color={tile.color}
            onClick={() => handleTileClick(tile)}
            coord={tile.coord}
          />
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "depart")
        .map((tile, index) => {
          // Déterminer à quel joueur appartient cette base
          // Les bases sont attribuées selon leur index dans le tableau des tuiles "depart"
          const playerId = index === 0 ? HUMAN_PLAYER_ID : getBotPlayerId(index - 1);
          const isPlayerBase = playerId === HUMAN_PLAYER_ID;
          
          // Utiliser la même couleur que les bots pour les bases
          const baseColor = isPlayerBase ? "blue" : 
            botColors[(index - 1) % botColors.length];
          
          return (
            <React.Fragment key={`depart-tile-${tile.coord}`}>
              <mesh
                position={[tile.position.x, 0.2, tile.position.z]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <circleGeometry args={[0.5, 32]} />
                <meshStandardMaterial color={baseColor} />
              </mesh>
              
              {/* Identifiant du joueur au-dessus de sa base */}
              <Html
                position={[tile.position.x, 0.5, tile.position.z]}
                center
                distanceFactor={15}
              >
                <div style={{
                  background: isPlayerBase ? 'rgba(0,50,200,0.8)' : getBackgroundColor(baseColor),
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
                  {isPlayerBase ? 'Joueur 1' : `Bot ${index}`}
                </div>
              </Html>
            </React.Fragment>
          );
        })}
      {Object.values(tiles)
        .filter((tile) => tile.type === "fuel")
        .map((tile) => (
          <mesh
            key={`fuel-station-${tile.coord}`}
            position={[tile.position.x, 0.25, tile.position.z]}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        ))}
      {Object.values(tiles)
        .filter((tile) => tile.type === "repair")
        .map((tile) => (
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

// Fonction utilitaire pour convertir une couleur en arrière-plan RGBA
const getBackgroundColor = (color) => {
  const colorMap = {
    'red': 'rgba(200,50,0,0.8)',
    'orange': 'rgba(255,140,0,0.8)',
    'green': 'rgba(0,150,50,0.8)',
    'purple': 'rgba(100,0,150,0.8)',
    'teal': 'rgba(0,128,128,0.8)',
    'brown': 'rgba(139,69,19,0.8)',
    'magenta': 'rgba(255,0,255,0.8)',
    'cyan': 'rgba(0,180,180,0.8)'
  };
  
  return colorMap[color] || 'rgba(100,100,100,0.8)';
};

export default Scene;
