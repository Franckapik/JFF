import React from "react";
import { useTileStore } from "../stores/useTileStore";
import usePlayerStore from "../stores/playerStore";
import { 
  HUMAN_PLAYER_ID,
  getMainShipId,
  isMainShipId
} from '../ai/constants/playerConstants';
import { useVehicleMovement } from "../hooks/useVehicleMovement";
import { useFloatingAnimation } from "../animations/useFloatingAnimation";

const DroneMovement = React.memo(({ playerId = HUMAN_PLAYER_ID, droneId = "drone1", children }) => {
  // === Stores ===
  const tiles = useTileStore((state) => state.tiles);
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);
  const humanShip = usePlayerStore((state) => state.players[HUMAN_PLAYER_ID]?.vehicles?.[getMainShipId()]);
  const allShips = usePlayerStore((state) => state.players);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);

  // Détermine le vaisseau à suivre avec useCallback
  const getShipToFollow = React.useCallback(() => {
    if (playerId !== HUMAN_PLAYER_ID) {
      return allShips[playerId]?.vehicles?.[getMainShipId()];
    }
    if (isMainShipId(selectedVehicle.vehicleId)) {
      return selectedVehicle.playerId === HUMAN_PLAYER_ID ? humanShip : allShips[selectedVehicle.playerId]?.vehicles?.[getMainShipId()];
    }
    return humanShip;
  }, [playerId, allShips, selectedVehicle, humanShip]);

  // Gestion de l'arrivée à destination avec useCallback
  const handleDroneReachedTarget = React.useCallback((reachedTileCoord) => {
    if (!reachedTileCoord) return;
    
    const reachedTile = tiles[reachedTileCoord];
    if (!reachedTile) return;
    
    // Marquer la tuile comme explorée
    useTileStore.getState().markTileAsExplored(reachedTileCoord);
    
    // Arrêter le mouvement
    updateVehicle(playerId, droneId, {
      isMoving: false,
      targetTile: null
    });
  }, [tiles, playerId, droneId, updateVehicle]);

  // Utilisation du hook de mouvement
  const {
    groupRef,
    initializePosition,
  } = useVehicleMovement({
    playerId,
    vehicleId: droneId,
    vehicleType: 'drone',
    onTargetReached: handleDroneReachedTarget
  });

  // Animation de flottement
  useFloatingAnimation(groupRef);

  // Position initiale du drone relative au vaisseau avec useMemo
  const initialPosition = React.useMemo(() => {
    const shipToFollow = getShipToFollow();
    if (shipToFollow?.position) {
      const baseHeight = 1.0;
      const radius = 0.8;
      const direction = playerId === HUMAN_PLAYER_ID ? 1 : -1;
      
      const x = shipToFollow.position.x + (radius * direction);
      const z = shipToFollow.position.z;
      
      return [x, baseHeight, z];
    }
    return [0, 1.0, 0];
  }, [getShipToFollow, playerId]);

  return (
    <group ref={groupRef} position={initialPosition}>
      {children}
    </group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  return (
    prevProps.playerId === nextProps.playerId &&
    prevProps.droneId === nextProps.droneId &&
    // Children will need to be re-rendered if they change
    prevProps.children === nextProps.children
  );
});

export default DroneMovement;
