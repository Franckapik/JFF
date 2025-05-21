import React, { useEffect, useRef } from "react";
import { GridHelper } from "three";
import { useThree } from "@react-three/fiber";
import { Cone } from "@react-three/drei";
import Tile from "./Tile";
import { useTileStore } from "../stores/useNewTileStore";
import usePlayerStore from "../stores/playerStore";
import useBotStore from "../stores/useBotStore"; // Utiliser useBotStore à la place de useSimpleBotStore
import ShipMovement from "../Mouvement/ShipMovement";
import UnifiedDroneMovement from "../Mouvement/UnifiedDroneMovement"; // Ajout de UnifiedDroneMovement
import { 
  HUMAN_PLAYER_ID, 
  getBotPlayerId, 
  getMainShipId, 
  getDroneId, 
  isMainShipId,
  VEHICLE_TYPES,
  isDroneActiveByDefault
} from "../ai/constants/playerConstants";

const Scene = () => {
  const initializeTiles = useTileStore((state) => state.initializeTiles);
  const tiles = useTileStore((state) => state.tiles);
  const initializePlayer = usePlayerStore((state) => state.initializePlayer);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const moveToTile = usePlayerStore((state) => state.moveToTile);
  
  // Utilisation de useBotStore au lieu de useSimpleBotStore
  const initializeBot = useBotStore((state) => state.initializeBot);
  
  // Sélecteurs pour l'état d'activation des drones
  const humanDrones = usePlayerStore((state) => state.players[HUMAN_PLAYER_ID]?.vehicles);
  const botDrones = usePlayerStore((state) => state.players[getBotPlayerId(0)]?.vehicles);
  
  const botInitialized = useRef(false);
  const playersInitialized = useRef(false);

  // Initialize tiles
  useEffect(() => {
    console.log("[Scene] Initializing tiles...");
    initializeTiles();
  }, [initializeTiles]);

  // Initialize players only once when tiles are first available
  useEffect(() => {
    if (Object.keys(tiles).length > 0 && !playersInitialized.current) {
      console.log("[Scene] Initializing players with tiles:", tiles);
      initializePlayer(tiles);
      playersInitialized.current = true;
      
      // Initialize bot after players are set up
      if (!botInitialized.current) {
        console.log("[Scene] Initializing bot...");
        initializeBot();
        botInitialized.current = true;
      }
    }
  }, [tiles, initializePlayer, initializeBot]);

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
      
      {/* Drones du joueur 1 */}
      {/* Drone d'exploration - toujours visible car actif par défaut */}
      {(!humanDrones || humanDrones[getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.EXPLORER_DRONE)]?.isActive !== false) && (
        <UnifiedDroneMovement 
          playerId={HUMAN_PLAYER_ID} 
          droneId={getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.EXPLORER_DRONE)}
        >
          <Cone 
            args={[0.15, 0.4, 8]} 
            rotation={[Math.PI, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color="purple" metalness={0.5} roughness={0.3} />
          </Cone>
        </UnifiedDroneMovement>
      )}

      {/* Drone de combat - n'afficher que s'il est actif */}
      {humanDrones && humanDrones[getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.COMBAT_DRONE)]?.isActive && (
        <UnifiedDroneMovement
          playerId={HUMAN_PLAYER_ID}
          droneId={getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.COMBAT_DRONE)}
        >
          <group>
            <Cone 
              args={[0.2, 0.3, 6]} 
              rotation={[Math.PI, 0, 0]}
              castShadow
            >
              <meshStandardMaterial color="darkred" metalness={0.7} roughness={0.2} />
            </Cone>
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color="red" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -Math.PI/4]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color="red" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        </UnifiedDroneMovement>
      )}

      {/* Drone spécial - n'afficher que s'il est actif */}
      {humanDrones && humanDrones[getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.SPECIAL_DRONE)]?.isActive && (
        <UnifiedDroneMovement
          playerId={HUMAN_PLAYER_ID}
          droneId={getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.SPECIAL_DRONE)}
        >
          <group>
            <Cone 
              args={[0.12, 0.35, 8]} 
              rotation={[Math.PI, 0, 0]}
              castShadow
            >
              <meshStandardMaterial color="cyan" metalness={0.6} roughness={0.3} emissive="cyan" emissiveIntensity={0.3} />
            </Cone>
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.15, 0.025, 8, 16]} />
              <meshStandardMaterial color="lightblue" metalness={0.6} roughness={0.3} emissive="blue" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </UnifiedDroneMovement>
      )}
      
      {/* Drones du bot (player2) */}
      {/* Drone d'exploration - toujours visible car actif par défaut */}
      {(!botDrones || botDrones[getDroneId(getBotPlayerId(0), VEHICLE_TYPES.EXPLORER_DRONE)]?.isActive !== false) && (
        <UnifiedDroneMovement 
          playerId={getBotPlayerId(0)} 
          droneId={getDroneId(getBotPlayerId(0), VEHICLE_TYPES.EXPLORER_DRONE)}
        >
          <Cone 
            args={[0.15, 0.4, 8]} 
            rotation={[Math.PI, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color="magenta" metalness={0.5} roughness={0.3} />
          </Cone>
        </UnifiedDroneMovement>
      )}

      {/* Drone de combat du bot - n'afficher que s'il est actif */}
      {botDrones && botDrones[getDroneId(getBotPlayerId(0), VEHICLE_TYPES.COMBAT_DRONE)]?.isActive && (
        <UnifiedDroneMovement
          playerId={getBotPlayerId(0)}
          droneId={getDroneId(getBotPlayerId(0), VEHICLE_TYPES.COMBAT_DRONE)}
        >
          <group>
            <Cone 
              args={[0.2, 0.3, 6]} 
              rotation={[Math.PI, 0, 0]}
              castShadow
            >
              <meshStandardMaterial color="crimson" metalness={0.7} roughness={0.2} />
            </Cone>
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI/4]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color="darkred" metalness={0.7} roughness={0.2} />
            </mesh>
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -Math.PI/4]}>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color="darkred" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        </UnifiedDroneMovement>
      )}

      {/* Drone spécial du bot - n'afficher que s'il est actif */}
      {botDrones && botDrones[getDroneId(getBotPlayerId(0), VEHICLE_TYPES.SPECIAL_DRONE)]?.isActive && (
        <UnifiedDroneMovement
          playerId={getBotPlayerId(0)}
          droneId={getDroneId(getBotPlayerId(0), VEHICLE_TYPES.SPECIAL_DRONE)}
        >
          <group>
            <Cone 
              args={[0.12, 0.35, 8]} 
              rotation={[Math.PI, 0, 0]}
              castShadow
            >
              <meshStandardMaterial color="magenta" metalness={0.6} roughness={0.3} emissive="magenta" emissiveIntensity={0.3} />
            </Cone>
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.15, 0.025, 8, 16]} />
              <meshStandardMaterial color="purple" metalness={0.6} roughness={0.3} emissive="purple" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </UnifiedDroneMovement>
      )}

      {/* Commentaire à garder pour future référence */}
      {/* Pour l'instant nous ne rendons que les drones d'exploration 
          Les autres drones seront ajoutés quand ils seront activés */}
      
      {Object.keys(tiles).length > 0 && (
        <>
          <ShipMovement playerId={HUMAN_PLAYER_ID}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color={selectedVehicle.playerId === HUMAN_PLAYER_ID && isMainShipId(selectedVehicle.vehicleId) ? "yellow" : "blue"}
              />
            </mesh>
          </ShipMovement>
          <ShipMovement playerId={getBotPlayerId(0)}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color={selectedVehicle.playerId === getBotPlayerId(0) && isMainShipId(selectedVehicle.vehicleId) ? "yellow" : "red"}
              />
            </mesh>
          </ShipMovement>
        </>
      )}
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
        .map((tile) => (
          <mesh
            key={`depart-tile-${tile.coord}`}
            position={[tile.position.x, 0.2, tile.position.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color="red" />
          </mesh>
        ))}
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

export default Scene;
