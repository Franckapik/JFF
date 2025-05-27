import React, { useEffect } from "react";
import { useTileStore } from "../stores/useTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import useDroneState, { DRONE_STATES } from "../hooks/useDroneState";
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

  // Initialize drone state on component mount
  useEffect(() => {
    const droneState = useDroneState.getState();
    droneState.initializeDrone(droneId);
  }, [droneId]);

  // Handle returning to ship when needed and drone movement states
  useEffect(() => {
    const droneState = useDroneState.getState();
    const currentState = droneState.getDroneState(droneId);
    const vehicle = usePlayerStore.getState().players[playerId]?.vehicles[droneId];

    if (droneState.isDroneInState(droneId, DRONE_STATES.RETURNING_TO_SHIP)) {
      const shipToFollow = getShipToFollow();
      if (shipToFollow?.coord) {
        usePlayerStore.getState().updateVehicle(playerId, droneId, {
          isMoving: true,
          targetTile: { coord: shipToFollow.coord }
        });
      }
    } else if (currentState?.currentState === DRONE_STATES.DOCKED_WITH_SHIP && vehicle?.targetTile?.coord) {
      // Si le drone est docké et reçoit une nouvelle cible, transition vers MOVING_TO_TARGET
      droneState.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);
      // Activer le mouvement vers la nouvelle cible
      usePlayerStore.getState().updateVehicle(playerId, droneId, {
        isMoving: true
      });
    } else if (currentState?.currentState === DRONE_STATES.AT_TARGET && !vehicle?.isMoving) {
      // Si le drone a atteint sa cible et n'est plus en mouvement, retourner au vaisseau
      droneState.transitionDroneState(droneId, DRONE_STATES.RETURNING_TO_SHIP);
    }
  }, [droneId, playerId, getShipToFollow]);

  // Gestion de l'arrivée à destination avec useCallback
  const handleDroneReachedTarget = React.useCallback((reachedTileCoord) => {
    if (!reachedTileCoord) return;
    
    const reachedTile = tiles[reachedTileCoord];
    if (!reachedTile) return;
    
    // Get current state to manage transitions
    const droneState = useDroneState.getState();
    const currentState = droneState.getDroneState(droneId);
    
    // Marquer la tuile comme explorée
    useTileStore.getState().markTileAsExplored(reachedTileCoord);
    
    // Get ship to determine the type of target reached
    const shipToFollow = getShipToFollow();
    
    // Handle state transitions based on target and current state
    if (reachedTileCoord === shipToFollow?.coord) {
      // Reached the ship - transition to docked state
      droneState.transitionDroneState(droneId, DRONE_STATES.DOCKED_WITH_SHIP);
    } else if (currentState?.currentState === DRONE_STATES.MOVING_TO_TARGET) {
      // Reached a non-ship target while moving - transition to at target
      droneState.transitionDroneState(droneId, DRONE_STATES.AT_TARGET);
    }
    
    // Arrêter le mouvement
    updateVehicle(playerId, droneId, {
      isMoving: false,
      targetTile: null
    });
  }, [tiles, playerId, droneId, updateVehicle, getShipToFollow]);

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
