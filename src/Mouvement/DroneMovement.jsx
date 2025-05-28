// ============================
// IMPORTS
// ============================
import React from "react";
import { useVehicleMovement } from "../hooks/useVehicleMovement";
import { useFloatingAnimation } from "../animations/useFloatingAnimation";
import usePlayerStore from "../stores/usePlayerStore";

// ============================
// DRONE MOVEMENT COMPONENT
// ============================
/**
 * DroneMovement Component
 * 
 * Composant de rendu 3D pour l'affichage d'un drone.
 * Responsabilités:
 * - Rendu visuel du drone dans la scène 3D
 * - Animation de flottement
 * - Positionnement initial du drone
 */
const DroneMovement = React.memo(({ 
  playerId = "player1", 
  droneId = "drone1", 
  children 
}) => {
  // ============================
  // STORES
  // ============================
  const vehicle = usePlayerStore((state) => state.players[playerId]?.vehicles[droneId]);

  // ============================
  // MOVEMENT & ANIMATION HOOKS
  // ============================
  
  // Hook de gestion du mouvement des véhicules
  const { groupRef } = useVehicleMovement({
    playerId,
    vehicleId: droneId,
    vehicleType: 'drone'
  });

  // Animation de flottement pour un effet visuel réaliste
  useFloatingAnimation(groupRef);

  // ============================
  // RENDER
  // ============================
  
  // Si le véhicule n'existe pas ou n'a pas de position, ne rien rendre
  if (!vehicle?.position) {
    return null;
  }

  return (
    <group ref={groupRef} position={[vehicle.position.x, vehicle.position.y, vehicle.position.z]}>
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
