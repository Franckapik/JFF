import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useTileStore } from "../stores/useNewTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import useMessageManager from "../hooks/useMessageManager";

const SimpleDroneMovement = ({ children }) => {
  const groupRef = useRef();
  const rotationRef = useRef(0);
  const tiles = useTileStore((state) => state.tiles);
  const { sendVehicleMessage } = useMessageManager();
  
  // Sélecteurs pour les vaisseaux
  const player1Ship = usePlayerStore((state) => state.players.player1?.vehicles?.ship);
  const player2Ship = usePlayerStore((state) => state.players.player2?.vehicles?.ship);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);

  // État local pour le drone
  const [targetTile, setTargetTile] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [returningToShip, setReturningToShip] = useState(false); 
  const [cooldown, setCooldown] = useState(0);

  // Détermine le vaisseau à suivre (priorité au vaisseau sélectionné)
  const determineShipToFollow = () => {
    if (selectedVehicle.vehicleId === "ship") {
      const playerId = selectedVehicle.playerId;
      return playerId === "player1" ? player1Ship : player2Ship;
    }
    // Par défaut, suivre le vaisseau du joueur 1
    return player1Ship;
  };

  // Vérifier si un vaisseau a une cible définie
  useEffect(() => {
    // Ne pas démarrer d'exploration si le drone est en retour vers le vaisseau ou en cooldown
    if (returningToShip || cooldown > 0) return;
    
    const followedShip = determineShipToFollow();
    
    // Si le vaisseau suivi a une cible et que le drone n'est pas déjà en déplacement
    if (followedShip?.targetTile?.coord && !isMoving && !targetTile) {
      // 20% de chance d'explorer la même cible que le vaisseau
      if (Math.random() < 0.2) {
        setTargetTile(followedShip.targetTile.coord);
        setIsMoving(true);
      }
    }
  }, [player1Ship?.targetTile, player2Ship?.targetTile, selectedVehicle, isMoving, targetTile, returningToShip, cooldown]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Décrementer le cooldown
    if (cooldown > 0) {
      setCooldown(cooldown - delta);
    }

    const shipToFollow = determineShipToFollow();
    let targetPosition;
    
    if (targetTile && tiles[targetTile] && !returningToShip) {
      // Si le drone a une cible et n'est pas en retour, il se déplace vers elle
      const tile = tiles[targetTile];
      targetPosition = new Vector3(
        tile.position.x,
        1.5,  // Hauteur du drone
        tile.position.z
      );
    } else if (shipToFollow?.position) {
      // Sinon, il suit le vaisseau avec un léger décalage
      targetPosition = new Vector3(
        shipToFollow.position.x + 0.5,
        1.5,  // Hauteur du drone
        shipToFollow.position.z + 0.5
      );
    } else {
      // Position par défaut si aucun vaisseau à suivre
      targetPosition = new Vector3(0, 1.5, 0);
    }

    // Calculer la direction et la distance
    const currentPosition = groupRef.current.position;
    const direction = new Vector3().subVectors(targetPosition, currentPosition);
    const distance = direction.length();
    
    // Animation de flottement
    groupRef.current.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.1;
    
    // Animation de rotation
    rotationRef.current += delta * 0.5;
    groupRef.current.rotation.y = rotationRef.current;

    if (distance > 0.2) {
      // Déplacement vers la cible
      direction.normalize();
      const speed = targetTile && !returningToShip ? 2.5 : 1.8;  // Plus rapide en exploration
      groupRef.current.position.addScaledVector(direction, delta * speed);
      
      if (targetTile && !returningToShip) setIsMoving(true);
    } else if (targetTile && isMoving && !returningToShip) {
      // Arrivé à la tuile cible
      const reachedTile = tiles[targetTile];
      if (reachedTile) {
        // Récupérer les informations de ressources
        const resources = reachedTile.resources || { food: 0, debris: 0, special: 0 };
        
        // Envoyer un message contenant les ressources
        sendVehicleMessage("player1", "drone1", "resource", resources);
        
        // Traiter selon le type de tuile
        if (reachedTile.type) {
          switch (reachedTile.type) {
            case "resource":
              sendVehicleMessage("player1", "drone1", "resource", resources);
              break;
            case "danger":
              sendVehicleMessage("player1", "drone1", "danger");
              break;
            case "fuel":
              sendVehicleMessage("player1", "drone1", "fuel");
              break;
            case "repair":
              sendVehicleMessage("player1", "drone1", "repair");
              break;
            default:
              break;
          }
        }
        
        // Marquer la tuile comme explorée
        useTileStore.getState().markTileAsExplored(targetTile);
        
        // Réinitialiser l'état et initialiser le retour vers le vaisseau
        setIsMoving(false);
        setReturningToShip(true);
        setTargetTile(null);
      }
    } else if (returningToShip && distance <= 0.2 && shipToFollow) {
      // Le drone est revenu au vaisseau
      console.log(`[PlayerDrone] Returned to ship at position: ${shipToFollow.position.x}, ${shipToFollow.position.z}`);
      setReturningToShip(false);
      
      // Mettre un cooldown avant la prochaine exploration
      setCooldown(3); // 3 secondes de cooldown
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {children}
    </group>
  );
};

export default SimpleDroneMovement;