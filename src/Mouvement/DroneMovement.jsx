// ============================
// IMPORTS
// ============================
import React from "react";
import { useVehicleMovement } from "../hooks/useVehicleMovement";
import { useFloatingAnimation } from "../animations/useFloatingAnimation";

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
  initialPosition = [0, 1.0, 0],
  children 
}) => {

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
