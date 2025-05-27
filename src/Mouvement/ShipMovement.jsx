import React, { useEffect } from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useGameStore from "../stores/useGameStore/";
import { useTileStore } from "../stores/useTileStore";
import { isBotPlayerId, getMainShipId, VEHICLE_TYPES } from "../ai/constants/playerConstants";
import { calculatePath } from "../utils/utils";
import fsmLogger from "../utils/fsmLogger";
import { useVehicleMovement } from "../hooks/useVehicleMovement";

const ShipMovement = React.memo(({ playerId, children }) => {
  // === Sélecteurs des stores avec sélecteurs optimisés ===
  const tiles = useTileStore((state) => state.tiles);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const playerVehicles = usePlayerStore((state) => state.players[playerId]?.vehicles);
  const playerVehicle = playerVehicles?.[getMainShipId()];
  const setClockRunning = useGameStore((state) => state.setClockRunning);
  
  // Pour les bots, on utilise toujours le vaisseau principal
  const vehicleId = React.useMemo(() => 
    isBotPlayerId(playerId) ? getMainShipId() : selectedVehicle.vehicleId,
    [playerId, selectedVehicle.vehicleId]
  );

  // Utilisation du hook de mouvement
  const {
    groupRef,
    initializePath,
    initializePosition,
    path,
    currentTargetIndex
  } = useVehicleMovement({
    playerId,
    vehicleId,
    vehicleType: VEHICLE_TYPES.SHIP
  });

  const recalculatePath = React.useCallback(() => {
    if (!groupRef.current || !playerVehicle) {
      fsmLogger.mouvement("[ShipMovement] Missing ref or vehicle:", { groupRef: !!groupRef.current, playerVehicle: !!playerVehicle }, playerId);
      return;
    }

    const targetTile = playerVehicle.targetTile;
        
    if (!targetTile || !targetTile.coord) {
      fsmLogger.mouvement(`[ShipMovement] Missing target tile for ${playerId}:`, targetTile, playerId);
      return;
    }
    
    fsmLogger.mouvement(`[ShipMovement] Calculating path for ${playerId} from ${playerVehicle.coord} to ${targetTile.coord}`, null, playerId);
    
    const pathData = calculatePath(
      groupRef.current.position,
      targetTile.coord,
      tiles,
      playerVehicle.coord
    );
    
    initializePath(pathData);
  }, [groupRef, playerVehicle, playerId, tiles, initializePath]);

  // === Effets ===
  useEffect(() => {
    if (playerVehicle?.position) {
      initializePosition(playerVehicle.position);
    }
  }, [playerVehicle?.position, initializePosition]);

  useEffect(() => {
    const targetTile = playerVehicle?.targetTile;
    
    if (targetTile && targetTile.coord && playerVehicle && Object.keys(tiles).length > 0) {
      fsmLogger.mouvement(`[ShipMovement] ${playerId} target changed, recalculating path to:`, targetTile.coord, playerId);
      setClockRunning(true);
      const timeoutId = setTimeout(recalculatePath, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [playerId, playerVehicle?.targetTile?.coord, Object.keys(tiles).length, recalculatePath, setClockRunning]);

  // === Rendu ===
  return (
      <group ref={groupRef}>{children}</group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  return (
    prevProps.playerId === nextProps.playerId &&
    // Children will need to be re-rendered if they change
    prevProps.children === nextProps.children
  );
});

export default ShipMovement;
