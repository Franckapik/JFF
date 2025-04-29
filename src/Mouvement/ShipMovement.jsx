import React, { useEffect, useRef, useState } from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useGameStore from "../stores/useGameStore";
import useBotStore from "../stores/useBotStore";
import { useTileStore } from "../stores/useNewTileStore";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";
import { calculatePath } from "../utils/utils";

const ShipMovement = ({ playerId, children }) => {
  // === Références et états locaux ===
  const groupRef = useRef();
  const rotationRef = useRef(new Euler(0, 0, 0));
  
  // États pour le suivi du mouvement
  const [path, setPath] = useState([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [totalPathDistance, setTotalPathDistance] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);

  // Constantes de mouvement
  const speed = 1.5;
  const rotationSpeed = 2;

  // === Sélecteurs des stores ===
  const tiles = useTileStore((state) => state.tiles);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const playerVehicles = usePlayerStore((state) => state.players[playerId]?.vehicles);
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);
  const consumeFuel = usePlayerStore(state => state.consumeFuel);
  
  const botStore = useBotStore();
  const botTargetTile = useBotStore(state => 
    playerId === "player2" ? state.bots?.player2?.ship?.targetTile : null
  );
  
  const playerVehicle =
    playerId === "player2"
      ? playerVehicles?.ship
      : selectedVehicle.playerId === playerId 
        ? playerVehicles[selectedVehicle.vehicleId]
        : null;

  const setClockRunning = useGameStore((state) => state.setClockRunning);

  // === Fonctions locales ===
  const handleFinalizeMovement = (currentTargetTile) => {
    if (playerId && playerVehicle && selectedVehicle.vehicleId) {
      const vehicleId = selectedVehicle.vehicleId;
      updateVehicle(playerId, vehicleId, {
        position: currentTargetTile.position,
        coord: currentTargetTile.coord,
        progress: 100,
        isMoving: false,
        targetTile: { position: null, coord: null },
      });
    }
  };

  const processPath = (pathData) => {
    if (!pathData.path || pathData.path.length === 0) {
      console.log("Empty path returned");
      return;
    }
    
    setPath(pathData.path);
    setCurrentTargetIndex(0);
    setHasReachedTarget(false);
    setTotalPathDistance(pathData.totalDistance);
    setDistanceTraveled(0);
    
    if (playerId && playerVehicle) {
      updateVehicle(playerId, selectedVehicle.vehicleId, {
        isMoving: true,
        path: pathData.path,
        totalDistance: pathData.totalDistance
      });
    }
  };

  const recalculatePath = () => {
    if (!groupRef.current || !playerVehicle) {
      console.log("Missing ref or vehicle:", { groupRef: !!groupRef.current, playerVehicle: !!playerVehicle });
      return;
    }

    const targetTile = playerId === "player2" 
      ? botTargetTile 
      : playerVehicle.targetTile;
        
    if (!targetTile || !targetTile.coord) {
      console.log(`Missing target tile for ${playerId}:`, targetTile);
      return;
    }
    
    console.log(`Calculating path for ${playerId} from ${playerVehicle.coord} to ${targetTile.coord}`);
    
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
      console.log("Setting initial position:", playerVehicle.position);
      groupRef.current.position.set(
        playerVehicle.position.x,
        playerVehicle.position.y,
        playerVehicle.position.z
      );
      setIsInitialPositionSet(true);
    }
  }, [playerVehicle, isInitialPositionSet]);

  useEffect(() => {
    const targetTile = playerId === "player2" ? botTargetTile : playerVehicle?.targetTile;

    if (targetTile && targetTile.coord && playerVehicle && Object.keys(tiles).length > 0 && isInitialPositionSet) {
      console.log(`[${playerId}] Target changed, recalculating path to:`, targetTile.coord);
      setClockRunning(true);
      setTimeout(recalculatePath, 100);
    }
  }, [playerId, botTargetTile, playerVehicle?.targetTile?.coord, isInitialPositionSet, Object.keys(tiles).length]);

  // === Boucle de rendu (useFrame) ===
  useFrame((_, delta) => {
    if (!playerVehicle || path.length === 0 || currentTargetIndex >= path.length) return;

    if (playerVehicle.fuel <= 0) {
      updateVehicle(playerId, selectedVehicle.vehicleId, { isMoving: false });
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
      console.log("Distance to target:", distance, "Target:", targetPosition, "Current:", currentPosition);
    }

    if (distance > 0.1) {
      direction.normalize();
      const moveDistance = Math.min(speed * delta, distance);
      
      groupRef.current.position.addScaledVector(direction, moveDistance);

      const targetAngle = Math.atan2(direction.x, direction.z);
      const currentAngle = rotationRef.current.y;
      const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * Math.min(rotationSpeed * delta, 1);

      rotationRef.current.set(0, interpolatedAngle, 0);
      groupRef.current.rotation.copy(rotationRef.current);

      setDistanceTraveled(prev => prev + moveDistance);
      const progress = (distanceTraveled / totalPathDistance) * 100;
      
      if (selectedVehicle.vehicleId) {
        updateVehicle(playerId, selectedVehicle.vehicleId, {
          progress: Math.min(progress, 100).toFixed(2),
        });
      }
      
    } else {
      console.log("Reached tile:", currentTargetCoord, "Index:", currentTargetIndex, "Path length:", path.length);
      
      if (selectedVehicle.vehicleId) {
        updateVehicle(playerId, selectedVehicle.vehicleId, {
          position: {
            x: currentTargetTile.position.x,
            y: currentTargetTile.position.y,
            z: currentTargetTile.position.z,
          },
          coord: currentTargetCoord,
        });
      }
      
      if (currentTargetIndex < path.length - 1) {
        setCurrentTargetIndex(prev => prev + 1);
        consumeFuel(playerId, selectedVehicle.vehicleId);
      } else {
        if (!hasReachedTarget) {
          setHasReachedTarget(true);
          console.log("Arrived at destination");
          
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
