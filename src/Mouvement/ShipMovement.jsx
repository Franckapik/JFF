import React, { useEffect } from "react";
import usePlayerStore from "../stores/playerStore";
import useGameStore from "../stores/useGameStore";
import { useTileStore } from "../stores/useTileStore";
import { isBotPlayerId, getMainShipId } from "../ai/constants/playerConstants";
import { calculatePath } from "../utils/utils";
import fsmLogger from "../utils/fsmLogger";
import { useVehicleMovement } from "../hooks/useVehicleMovement";

const ShipMovement = ({ playerId, children }) => {
  // === Sélecteurs des stores ===
  const tiles = useTileStore((state) => state.tiles);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const playerVehicles = usePlayerStore((state) => state.players[playerId]?.vehicles);
  const playerVehicle = playerVehicles?.[getMainShipId()];
  const setClockRunning = useGameStore((state) => state.setClockRunning);
  
  // Pour les bots, on utilise toujours le vaisseau principal
  const vehicleId = isBotPlayerId(playerId) ? getMainShipId() : selectedVehicle.vehicleId;

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
    vehicleType: 'ship'
  });

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
    
    initializePath(pathData);
  };

  // === Effets ===
  useEffect(() => {
    if (playerVehicle?.position) {
      initializePosition(playerVehicle.position);
    }
  }, [playerVehicle]);

  useEffect(() => {
    const targetTile = playerVehicle?.targetTile;
    
    if (targetTile && targetTile.coord && playerVehicle && Object.keys(tiles).length > 0) {
      fsmLogger.mouvement(`[ShipMovement] ${playerId} target changed, recalculating path to:`, targetTile.coord);
      setClockRunning(true);
      setTimeout(recalculatePath, 100);
    }
  }, [playerId, playerVehicle?.targetTile?.coord, Object.keys(tiles).length]);

  // === Rendu ===
  return (
      <group ref={groupRef}>{children}</group>
  );
};

export default ShipMovement;
