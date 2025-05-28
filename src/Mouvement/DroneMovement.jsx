// ============================
// IMPORTS
// ============================
import React, { useEffect } from "react";
import { useTileStore } from "../stores/useTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import useDroneState, { DRONE_STATES } from "../hooks/useDroneState";
import { 
  getHumanPlayerId,
  getMainShipId,
  isMainShipId
} from '../ai/constants/playerConstants';
import { useVehicleMovement } from "../hooks/useVehicleMovement";
import { useFloatingAnimation } from "../animations/useFloatingAnimation";

// ============================
// DRONE MOVEMENT COMPONENT
// ============================
/**
 * DroneMovement Component
 * 
 * Gère le mouvement et les états d'un drone, incluant:
 * - Navigation vers des cibles d'exploration
 * - Retour automatique vers le vaisseau mère
 * - Animation de flottement
 * - Synchronisation des états entre le store et l'affichage 3D
 */
const DroneMovement = React.memo(({ 
  playerId = getHumanPlayerId(1), 
  droneId = "drone1", 
  children 
}) => {
  
  // ============================
  // STORE SELECTORS
  // ============================
  
  // Données des tuiles pour l'exploration
  const tiles = useTileStore((state) => state.tiles);
  
  // Actions et données des joueurs/véhicules
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);
  const humanShip = usePlayerStore((state) => 
    state.players[getHumanPlayerId(1)]?.vehicles?.[getMainShipId()]
  );
  const allShips = usePlayerStore((state) => state.players);

  // ============================
  // COMPUTED VALUES & CALLBACKS
  // ============================
  
  /**
   * Détermine le vaisseau à suivre selon le joueur
   * Pour le joueur humain: utilise humanShip
   * Pour les autres joueurs: cherche dans allShips
   */
  const getShipToFollow = React.useCallback(() => {
    if (playerId !== getHumanPlayerId(1)) {
      return allShips[playerId]?.vehicles?.[getMainShipId()];
    }
    return humanShip;
  }, [playerId, allShips, humanShip]);

  /**
   * Calcule la position initiale du drone près du vaisseau mère
   * Position relative avec offset pour éviter les collisions
   */
  const initialPosition = React.useMemo(() => {
    const shipToFollow = getShipToFollow();
    if (shipToFollow?.position) {
      const baseHeight = 1.0;
      const radius = 0.8;
      const direction = playerId === getHumanPlayerId(1) ? 1 : -1;
      
      const x = shipToFollow.position.x + (radius * direction);
      const z = shipToFollow.position.z;
      
      return [x, baseHeight, z];
    }
    return [0, 1.0, 0];
  }, [getShipToFollow, playerId]);

  // ============================
  // MOVEMENT & ANIMATION HOOKS
  // ============================
  
  /**
   * Gestion de l'arrivée à destination
   * Traite les différents types de cibles (vaisseau, exploration)
   * Met à jour les états du drone en conséquence
   */
  const handleDroneReachedTarget = React.useCallback((reachedTileCoord) => {
    if (!reachedTileCoord) return;
    
    const reachedTile = tiles[reachedTileCoord];
    if (!reachedTile) return;
    
    console.log('🎯 DRONE REACHED TARGET:', reachedTileCoord);
    
    // Récupération de l'état actuel du drone
    const droneState = useDroneState.getState();
    const currentState = droneState.getDroneState(droneId);
    
    // Marquer la tuile comme explorée
    useTileStore.getState().markTileAsExplored(reachedTileCoord);
    
    // Récupération du vaisseau de référence
    const shipToFollow = getShipToFollow();
    
    // Gestion des transitions d'état selon la cible atteinte
    if (reachedTileCoord === shipToFollow?.coord) {
      // Arrivée au vaisseau - passage en état docké
      console.log('🏠 DRONE RETURNED TO SHIP');
      droneState.transitionDroneState(droneId, DRONE_STATES.DOCKED_WITH_SHIP);
    } else if (currentState?.currentState === DRONE_STATES.MOVING_TO_TARGET) {
      // Arrivée à une cible d'exploration - passage en état "à la cible"
      console.log('🎯 DRONE AT EXPLORATION TARGET');
      droneState.transitionDroneState(droneId, DRONE_STATES.AT_TARGET);
      
      // Programmation automatique du retour vers le vaisseau
      setTimeout(() => {
        console.log('⏰ DRONE STARTING RETURN TO SHIP');
        droneState.transitionDroneState(droneId, DRONE_STATES.RETURNING_TO_SHIP);
        if (shipToFollow?.coord) {
          updateVehicle(playerId, droneId, {
            targetTile: { coord: shipToFollow.coord, position: shipToFollow.position },
            isMoving: true
          });
        }
      }, 2000); // Délai de 2 secondes
    }
    
    // Arrêt du mouvement du drone
    updateVehicle(playerId, droneId, {
      isMoving: false,
      targetTile: null
    });
  }, [tiles, playerId, droneId, updateVehicle, getShipToFollow]);

  // Hook de gestion du mouvement des véhicules
  const {
    groupRef,
    initializePosition,
  } = useVehicleMovement({
    playerId,
    vehicleId: droneId,
    vehicleType: 'drone',
    onTargetReached: handleDroneReachedTarget
  });

  // Animation de flottement pour un effet visuel réaliste
  useFloatingAnimation(groupRef);

  // ============================
  // LIFECYCLE EFFECTS
  // ============================
  
  /**
   * EFFET 1: Initialisation du drone
   * Exécuté au montage du composant pour initialiser l'état du drone
   */
  useEffect(() => {
    const droneState = useDroneState.getState();
    droneState.initializeDrone(droneId);
  }, [droneId]);

  /**
   * EFFET 2: Gestion des états de mouvement du drone
   * Surveille les changements d'état et déclenche les actions appropriées
   */
  useEffect(() => {
    const droneState = useDroneState.getState();
    const currentState = droneState.getDroneState(droneId);
    const vehicle = usePlayerStore.getState().players[playerId]?.vehicles[droneId];

    // Gestion de l'état "retour vers le vaisseau"
    if (droneState.isDroneInState(droneId, DRONE_STATES.RETURNING_TO_SHIP)) {
      const shipToFollow = getShipToFollow();
      if (shipToFollow?.coord) {
        usePlayerStore.getState().updateVehicle(playerId, droneId, {
          isMoving: true,
          targetTile: { coord: shipToFollow.coord }
        });
      }
    } 
    // Transition du drone docké vers une nouvelle cible
    else if (currentState?.currentState === DRONE_STATES.DOCKED_WITH_SHIP && vehicle?.targetTile?.coord) {
      droneState.transitionDroneState(droneId, DRONE_STATES.MOVING_TO_TARGET);
      usePlayerStore.getState().updateVehicle(playerId, droneId, {
        isMoving: true
      });
    } 
    // Retour automatique quand le drone a fini d'explorer
    else if (currentState?.currentState === DRONE_STATES.AT_TARGET && !vehicle?.isMoving) {
      droneState.transitionDroneState(droneId, DRONE_STATES.RETURNING_TO_SHIP);
    }
  }, [droneId, playerId, getShipToFollow]);

  /**
   * EFFET 3: Initialisation de la position du drone dans le store
   * S'assure que le drone a une position valide au démarrage
   */
  useEffect(() => {
    const shipToFollow = getShipToFollow();
    const vehicle = usePlayerStore.getState().players[playerId]?.vehicles[droneId];
    
    // Initialisation si le drone n'a pas de position dans le store
    if (shipToFollow?.position && (!vehicle?.position || !vehicle?.coord)) {
      const baseHeight = 1.0;
      const radius = 0.8;
      const direction = playerId === getHumanPlayerId(1) ? 1 : -1;
      
      const dronePosition = {
        x: shipToFollow.position.x + (radius * direction),
        y: baseHeight,
        z: shipToFollow.position.z
      };
      
      // Mise à jour du store avec la position initiale
      updateVehicle(playerId, droneId, {
        position: dronePosition,
        coord: shipToFollow.coord, // Même coordonnée que le vaisseau
        progress: 0, // Progression à 0% au démarrage
        isMoving: false
      });
      
      // Synchronisation avec l'affichage 3D
      initializePosition(dronePosition);
    }
  }, [playerId, droneId, getShipToFollow, updateVehicle, initializePosition]);

  // ============================
  // RENDER
  // ============================
  
  return (
    <group ref={groupRef} position={initialPosition}>
      {children}
    </group>
  );
}, 
// ============================
// MEMOIZATION COMPARISON
// ============================
(prevProps, nextProps) => {
  // Fonction de comparaison personnalisée pour optimiser les re-rendus
  return (
    prevProps.playerId === nextProps.playerId &&
    prevProps.droneId === nextProps.droneId &&
    prevProps.children === nextProps.children
  );
});

// ============================
// EXPORT
// ============================
export default DroneMovement;
