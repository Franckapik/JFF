import React, { useEffect, useRef, useState } from "react";
import usePlayerStore from "../stores/playerStore";
import useGameStore from "../stores/useGameStore";
import useBotStore from "../stores/useBotStore";
import { useTileStore } from "../stores/useNewTileStore";
import { isBotPlayerId, HUMAN_PLAYER_ID, getMainShipId } from "../ai/constants/playerConstants";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";
import { calculatePath } from "../utils/utils";
import fsmLogger from "../utils/fsmLogger";

const ShipMovement = ({ playerId, children }) => {
  // === Références ===
  const groupRef = useRef();
  const rotationRef = useRef(new Euler(0, 0, 0));
  
  // === États pour le suivi du mouvement ===
  const [path, setPath] = useState([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [totalPathDistance, setTotalPathDistance] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);

  // === Sélecteurs des stores ===
  const tiles = useTileStore((state) => state.tiles);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const playerVehicles = usePlayerStore((state) => state.players[playerId]?.vehicles);
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);
  const consumeFuel = usePlayerStore(state => state.consumeFuel);
  const shipSpeeds = usePlayerStore((state) => state.movementSpeeds.ship);
  const speed = shipSpeeds.speed;
  const rotationSpeed = shipSpeeds.rotationSpeed;
  
  const botStore = useBotStore();
  const setClockRunning = useGameStore((state) => state.setClockRunning);
  const playerVehicle = playerVehicles?.[getMainShipId()];

  // === Fonctions locales ===
  const handleFinalizeMovement = (currentTargetTile) => {
    if (!playerId || !playerVehicle) return;
    
    // Pour les bots, on utilise toujours le vaisseau principal
    const vehicleId = isBotPlayerId(playerId) ? getMainShipId() : selectedVehicle.vehicleId;
    
    fsmLogger.mouvement(`[ShipMovement] Finalizing movement for ${playerId}/${vehicleId} to ${currentTargetTile.coord}`);
    
    updateVehicle(playerId, vehicleId, {
      position: currentTargetTile.position,
      coord: currentTargetTile.coord,
      progress: 100,
      isMoving: false,
      targetTile: { position: null, coord: null },
    });
  };

  const processPath = (pathData) => {
    if (!pathData.path || pathData.path.length === 0) {
      fsmLogger.mouvement("[ShipMovement] Empty path returned");
      return;
    }
    
    setPath(pathData.path);
    setCurrentTargetIndex(0);
    setHasReachedTarget(false);
    setTotalPathDistance(pathData.totalDistance);
    setDistanceTraveled(0);
    
    if (playerId && playerVehicle) {
      // Pour les bots, on utilise toujours le vaisseau principal
      const vehicleId = isBotPlayerId(playerId) ? getMainShipId() : selectedVehicle.vehicleId;
      fsmLogger.mouvement(`[ShipMovement] Setting isMoving=true for ${playerId}/${vehicleId}`);
      
      updateVehicle(playerId, vehicleId, {
        isMoving: true,
        path: pathData.path,
        totalDistance: pathData.totalDistance
      });
    }
  };

  const recalculatePath = () => {
    if (!groupRef.current || !playerVehicle) {
      fsmLogger.mouvement("[ShipMovement] Missing ref or vehicle:", { groupRef: !!groupRef.current, playerVehicle: !!playerVehicle });
      return;
    }

    const targetTile = playerVehicle.targetTile;
        
    if (!targetTile || !targetTile.coord) {
      fsmLogger.mouvement(`[ShipMovement] Missing target tile for ${playerId}:`, targetTile);
      return;
    }
    
    fsmLogger.mouvement(`[ShipMovement] Calculating path for ${playerId} from ${playerVehicle.coord} to ${targetTile.coord}`);
    
    const pathData = calculatePath(
      groupRef.current.position,
      targetTile.coord,
      tiles,
      playerVehicle.coord
    );
    
    processPath(pathData);
  };

  // === Effets ===
  useEffect(() => {
    if (!isInitialPositionSet && playerVehicle?.position && groupRef.current) {
      fsmLogger.mouvement(`[ShipMovement] Setting initial position for ${playerId}:`, playerVehicle.position);
      groupRef.current.position.set(
        playerVehicle.position.x,
        playerVehicle.position.y,
        playerVehicle.position.z
      );
      setIsInitialPositionSet(true);
    }
  }, [playerVehicle, isInitialPositionSet]);

  useEffect(() => {
    const targetTile = playerVehicle?.targetTile;

    if (targetTile && targetTile.coord && playerVehicle && Object.keys(tiles).length > 0 && isInitialPositionSet) {
      fsmLogger.mouvement(`[ShipMovement] ${playerId} target changed, recalculating path to:`, targetTile.coord);
      setClockRunning(true);
      setTimeout(recalculatePath, 100);
    }
  }, [playerId, playerVehicle?.targetTile?.coord, isInitialPositionSet, Object.keys(tiles).length]);

  // === Boucle de rendu (useFrame) ===
  useFrame((_, delta) => {
    if (!playerVehicle || path.length === 0 || currentTargetIndex >= path.length) return;

    // Pour les bots, on utilise toujours "ship"
    const vehicleId = isBotPlayerId(playerId) ? getMainShipId() : selectedVehicle.vehicleId;

    if (playerVehicle.fuel <= 0) {
      updateVehicle(playerId, vehicleId, { isMoving: false });
      return;
    }

    const currentTargetCoord = path[currentTargetIndex];
    const currentTargetTile = tiles[currentTargetCoord];

    if (!currentTargetTile) {
      console.warn("Target tile not found:", currentTargetCoord);
      return;
    }

    const targetPosition = new Vector3(
      currentTargetTile.position.x,
      currentTargetTile.position.y,
      currentTargetTile.position.z
    );

    const currentPosition = groupRef.current.position;
    const direction = new Vector3().subVectors(targetPosition, currentPosition);
    const distance = direction.length();

    if (currentTargetIndex === 0 && Math.random() < 0.01) {
      fsmLogger.mouvement(`[ShipMovement] ${playerId}/${vehicleId} Distance to target:`, distance);
    }

    if (distance > 0.1) {
      direction.normalize();
      const moveDistance = Math.min(speed * delta, distance); // Utilise la vitesse du PlayerStore
      
      groupRef.current.position.addScaledVector(direction, moveDistance);

      const targetAngle = Math.atan2(direction.x, direction.z);
      const currentAngle = rotationRef.current.y;
      const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * Math.min(rotationSpeed * delta, 1); // Utilise la vitesse de rotation du PlayerStore

      rotationRef.current.set(0, interpolatedAngle, 0);
      groupRef.current.rotation.copy(rotationRef.current);

      setDistanceTraveled(prev => prev + moveDistance);
      const progress = (distanceTraveled / totalPathDistance) * 100;
      
      updateVehicle(playerId, vehicleId, {
        progress: Math.min(progress, 100).toFixed(2),
      });
      
    } else {
      updateVehicle(playerId, vehicleId, {
        position: {
          x: currentTargetTile.position.x,
          y: currentTargetTile.position.y,
          z: currentTargetTile.position.z,
        },
        coord: currentTargetCoord,
      });
      
      if (currentTargetIndex < path.length - 1) {
        setCurrentTargetIndex(prev => prev + 1);
        consumeFuel(playerId, vehicleId);
      } else {
        if (!hasReachedTarget) {
          setHasReachedTarget(true);
          fsmLogger.mouvement(`[ShipMovement] ${playerId}/${vehicleId} Arrived at destination`);
          
          handleFinalizeMovement(currentTargetTile);
                  
          setPath([]);
          setCurrentTargetIndex(0);
        }
      }
    }
  });

  // === Rendu ===
  return (
    <>
      {path.length > 0 && path.map((coord, index) => {
        if (tiles[coord] && index >= currentTargetIndex) {
          return (
            <mesh 
              key={coord} 
              position={[tiles[coord].position.x, 0.25, tiles[coord].position.z]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={index === path.length - 1 ? "orange" : "blue"} />
            </mesh>
          );
        }
        return null;
      })}
      
      <mesh position={[groupRef.current?.position.x || 0, 0.3, groupRef.current?.position.z || 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="red" transparent opacity={0.7} />
      </mesh>
      
      <group ref={groupRef}>{children}</group>
    </>
  );
};

export default ShipMovement;
