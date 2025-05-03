import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useTileStore } from "../stores/useNewTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import useMessageManager from "../hooks/useMessageManager";

const SimpleBotDroneMovement = ({ children }) => {
  const groupRef = useRef();
  const rotationRef = useRef(0);
  const tiles = useTileStore((state) => state.tiles);
  const { sendVehicleMessage } = useMessageManager();
  
  // Sélecteurs pour le drone et le vaisseau du bot
  const botShip = usePlayerStore((state) => state.players.player2?.vehicles?.ship);
  const botDrone = usePlayerStore((state) => state.players.player2?.vehicles?.drone3);
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);

  useFrame((_, delta) => {
    if (!groupRef.current || !botDrone) return;

    let targetPosition;
    
    if (botDrone.targetTile?.coord && tiles[botDrone.targetTile.coord]) {
      // Si le drone a une cible, il se déplace vers elle
      const tile = tiles[botDrone.targetTile.coord];
      targetPosition = new Vector3(
        tile.position.x,
        1.5,  // Hauteur du drone
        tile.position.z
      );
    } else if (botShip?.position) {
      // Sinon, il suit le vaisseau du bot avec un léger décalage
      targetPosition = new Vector3(
        botShip.position.x - 0.5,  // Légèrement à gauche du vaisseau
        1.5,  // Hauteur du drone
        botShip.position.z - 0.5   // Légèrement derrière le vaisseau
      );
    } else {
      // Position par défaut
      targetPosition = new Vector3(0, 1.5, 0);
    }

    // Calculer la direction et la distance
    const currentPosition = new Vector3(
      groupRef.current.position.x,
      groupRef.current.position.y,
      groupRef.current.position.z
    );
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
      const speed = botDrone.targetTile?.coord ? 3.0 : 2.0;  // Plus rapide en exploration
      groupRef.current.position.addScaledVector(direction, delta * speed);
      
      if (botDrone.targetTile?.coord) {
        updateVehicle('player2', 'drone3', { isMoving: true });
      }
    } else if (botDrone.targetTile?.coord && botDrone.isMoving) {
      // Arrivé à la tuile cible
      const reachedTileCoord = botDrone.targetTile.coord;
      const reachedTile = tiles[reachedTileCoord];
      
      if (reachedTile) {
        // Récupérer les informations de ressources
        const resources = reachedTile.resources || { food: 0, debris: 0, special: 0 };
        
        // Envoyer un message contenant les ressources
        sendVehicleMessage('player2', 'drone3', 'resource', resources);
        
        // Ajouter cette tuile à la mémoire du bot si elle contient des ressources
        if (resources.food > 0 || resources.debris > 0 || resources.special > 0) {
          const playersState = usePlayerStore.getState().players;
          const botMemory = playersState.player2?.memory;
          
          if (botMemory && botMemory.knownResources) {
            // Vérifier si la ressource est déjà connue
            const alreadyKnown = botMemory.knownResources.some(r => 
              r.coord === reachedTileCoord
            );
            
            if (!alreadyKnown) {
              const updatedKnownResources = [
                ...botMemory.knownResources,
                {
                  coord: reachedTileCoord,
                  position: reachedTile.position,
                  resources
                }
              ];
              
              // Mettre à jour la mémoire du bot
              usePlayerStore.setState((state) => ({
                players: {
                  ...state.players,
                  player2: {
                    ...state.players.player2,
                    memory: {
                      ...state.players.player2.memory,
                      knownResources: updatedKnownResources
                    }
                  }
                }
              }));
            }
          }
        }
        
        // Envoi des messages en fonction du type de tuile
        if (reachedTile.type) {
          switch (reachedTile.type) {
            case "resource":
              sendVehicleMessage('player2', 'drone3', 'resource', resources);
              break;
            case "danger":
              sendVehicleMessage('player2', 'drone3', 'danger');
              break;
            case "fuel":
              sendVehicleMessage('player2', 'drone3', 'fuel');
              break;
            case "repair":
              sendVehicleMessage('player2', 'drone3', 'repair');
              break;
            default:
              break;
          }
        }
        
        // Réinitialiser l'état du drone
        updateVehicle('player2', 'drone3', {
          isMoving: false,
          targetTile: null
        });
      }
    }
  });

  // Position initiale du drone (à côté du vaisseau du bot)
  const initialPosition = botShip?.position 
    ? [botShip.position.x - 0.5, 1.5, botShip.position.z - 0.5]
    : [0, 1.5, 0];

  return (
    <group ref={groupRef} position={initialPosition}>
      {children}
    </group>
  );
};

export default SimpleBotDroneMovement;