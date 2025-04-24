import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";
import { useTileStore } from "../store/useTileStore";
import { Torus } from "@react-three/drei"; // Import Torus from drei

const DroneMovement = ({ drone, children }) => {
  const groupRef = useRef();
  const targetVehicle = useTileStore((state) => state.targetVehicle);
  const tiles = useTileStore((state) => state.tiles);
  const updateDrone = useTileStore((state) => state.updateDrone);
  const addPlayerMessage = useTileStore((state) => state.addPlayerMessage); // Import addPlayerMessage from the store

  useFrame((_, delta) => {
    if (!groupRef.current || !drone.position) return; // Ensure drone.position is defined

    const currentPosition = new Vector3(
      groupRef.current.position.x,
      groupRef.current.position.y,
      groupRef.current.position.z
    );

    let targetPosition;

    if (drone.targetTile) {
      // Si le drone a une tuile cible
      const targetTile = tiles[drone.targetTile];
      
      if (targetTile) {
        targetPosition = new Vector3(
          targetTile.position.x,
          targetTile.position.y,
          targetTile.position.z
        );
      }
    } else if (targetVehicle) {
      // Sinon, suivre le véhicule cible
      targetPosition = new Vector3(
        targetVehicle.position.x,
        targetVehicle.position.y,
        targetVehicle.position.z
      );
    }
   

    if (targetPosition) {
      // Ignore the y component when calculating the distance
      const flatCurrentPosition = new Vector3(currentPosition.x, 0, currentPosition.z);
      const flatTargetPosition = new Vector3(targetPosition.x, 0, targetPosition.z);
      const direction = new Vector3().subVectors(flatTargetPosition, flatCurrentPosition);
      const distance = direction.length();


      if (distance > 0.1) { // Adjust this threshold if necessary
        direction.normalize();
        groupRef.current.position.addScaledVector(direction, delta * 2); // Vitesse du drone
        groupRef.current.position.y = 1.5; // Maintain height of +1.5
        updateDrone(drone.id, { isMoving: true, hasReachedTarget: false });
      } else if (!drone.hasReachedTarget) {
        groupRef.current.position.y = 1.5; // Maintain height of +1.5

        // Sauvegarder la tuile cible avant de la réinitialiser
        const reachedTile = drone.targetTile;
        const reachedTileName = tiles[reachedTile]?.name || `Tuile ${reachedTile}`; // Nom de la tuile ou fallback
        const resources = tiles[reachedTile]?.resources || { food: 0, debris: 0, special: 0 }; // Récupérer les ressources

        updateDrone(drone.id, { isMoving: false, targetTile: null, hasReachedTarget: true });

        // Ajouter un message à la liste des messages du joueur
        if (reachedTile) {
          addPlayerMessage({
            droneId: drone.id,
            title: `Drone ${drone.id} a atteint ${reachedTileName}.`,
            body: `Le drone ${drone.id} a terminé sa mission et a atteint ${reachedTileName}. Voici les ressources trouvées :\n\n` +
                  `- Nourriture : ${resources.food}\n` +
                  `- Débris : ${resources.debris}\n` +
                  `- Spécial : ${resources.special}`,
            tileName: reachedTileName, // Inclure le nom de la tuile
            timestamp: Date.now(), // Ajouter un timestamp pour le tri et l'affichage
          });
        }
      }
    }

    
  });

  return (
    <group
      ref={groupRef}
      position={[
        drone.position?.x || 0,
        1.5, // Ensure the drone starts at height +1.5
        drone.position?.z || 0,
      ]}
    >
      {children}
    </group>
  );
};

export default DroneMovement;