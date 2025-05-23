import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Euler } from 'three';
import usePlayerStore from '../stores/playerStore';
import useBotStore from '../stores/useBotStore';
import { useTileStore } from '../stores/useTileStore';
import { isBotPlayerId, getMainShipId } from '../ai/constants/playerConstants';
import fsmLogger from '../utils/fsmLogger';

/**
 * Hook partagé pour la gestion du mouvement des véhicules (drones et vaisseaux)
 * @param {Object} params
 * @param {string} params.playerId - ID du joueur propriétaire
 * @param {string} params.vehicleId - ID du véhicule
 * @param {string} params.vehicleType - Type de véhicule ("ship" ou "drone")
 * @param {Object} [params.customSpeed] - Vitesse personnalisée {speed: number, rotationSpeed: number}
 * @param {Function} [params.onTargetReached] - Callback appelé quand la cible est atteinte
 */
export const useVehicleMovement = ({ 
  playerId, 
  vehicleId, 
  vehicleType,
  customSpeed,
  onTargetReached
}) => {
  const groupRef = useRef();
  const rotationRef = useRef(new Euler(0, 0, 0));
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [path, setPath] = useState([]);
  const [hasReachedTarget, setHasReachedTarget] = useState(false);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [totalPathDistance, setTotalPathDistance] = useState(0);

  // === Stores ===
  const tiles = useTileStore((state) => state.tiles);
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);
  const consumeFuel = usePlayerStore(state => state.consumeFuel);
  const botStore = useBotStore();
  const vehicle = usePlayerStore((state) => state.players[playerId]?.vehicles[vehicleId]);
  
  // Vitesses du véhicule
  const speeds = usePlayerStore((state) => {
    if (customSpeed) return customSpeed;
    return vehicleType === 'ship' ? state.movementSpeeds.ship : state.movementSpeeds.drone;
  });

  const handleFinalizeMovement = (currentTargetTile) => {
    if (!playerId || !vehicle) return;
    
    fsmLogger.mouvement(`[VehicleMovement] Finalizing movement for ${playerId}/${vehicleId} to ${currentTargetTile.coord}`);
    
    updateVehicle(playerId, vehicleId, {
      position: currentTargetTile.position,
      coord: currentTargetTile.coord,
      progress: 100,
      isMoving: false,
      targetTile: { position: null, coord: null },
    });

    if (onTargetReached) {
      onTargetReached(currentTargetTile.coord);
    }
  };

  // Logique de mouvement dans useFrame
  useFrame((_, delta) => {
    if (!vehicle || !groupRef.current || path.length === 0 || currentTargetIndex >= path.length) return;

    if (vehicle.fuel <= 0) {
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

    if (distance > 0.1) {
      direction.normalize();
      const speed = customSpeed?.speed || speeds.speed;
      const moveDistance = Math.min(speed * delta, distance);
      
      groupRef.current.position.addScaledVector(direction, moveDistance);

      const targetAngle = Math.atan2(direction.x, direction.z);
      const currentAngle = rotationRef.current.y;
      const rotationSpeed = customSpeed?.rotationSpeed || speeds.rotationSpeed;
      const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * Math.min(rotationSpeed * delta, 1);

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
      } else if (!hasReachedTarget) {
        setHasReachedTarget(true);
        handleFinalizeMovement(currentTargetTile);
        setPath([]);
        setCurrentTargetIndex(0);
      }
    }
  });

  // Fonction pour initialiser le chemin
  const initializePath = (pathData) => {
    if (!pathData.path || pathData.path.length === 0) {
      fsmLogger.mouvement("[VehicleMovement] Empty path returned");
      return;
    }
    
    setPath(pathData.path);
    setCurrentTargetIndex(0);
    setHasReachedTarget(false);
    setTotalPathDistance(pathData.totalDistance);
    setDistanceTraveled(0);
    
    updateVehicle(playerId, vehicleId, {
      isMoving: true,
      path: pathData.path,
      totalDistance: pathData.totalDistance
    });
  };

  // Fonction pour initialiser la position
  const initializePosition = (position) => {
    if (!isInitialPositionSet && position && groupRef.current) {
      fsmLogger.mouvement(`[VehicleMovement] Setting initial position for ${playerId}:`, position);
      groupRef.current.position.set(position.x, position.y, position.z);
      setIsInitialPositionSet(true);
    }
  };

  return {
    groupRef,
    hasReachedTarget,
    initializePath,
    initializePosition,
    currentPosition: groupRef.current?.position,
    isMoving: path.length > 0,
    path,
  };
};
