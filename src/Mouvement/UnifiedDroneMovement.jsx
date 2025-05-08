import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useTileStore } from "../stores/useNewTileStore";
import usePlayerStore from "../stores/usePlayerStore";
import useMessageManager from "../hooks/useMessageManager";
import useBotStore from "../stores/useBotStore"; // Importation du store bot pour les transitions d'état
import { BotConditions } from "../ai/fsm/conditions/botConditions"; // Import direct du module BotConditions

/**
 * Composant de mouvement de drone unifié qui fonctionne pour les deux joueurs (player1 et player2/bot)
 * @param {Object} props
 * @param {string} props.playerId - "player1" ou "player2"
 * @param {string} props.droneId - Identifiant du drone (ex: "drone1", "drone3")
 * @param {React.ReactNode} props.children - Contenu à rendre à l'intérieur du groupe
 */
const UnifiedDroneMovement = ({ playerId = "player1", droneId = "drone1", children }) => {
  const groupRef = useRef();
  const rotationRef = useRef(0);
  const tiles = useTileStore((state) => state.tiles);
  const { sendVehicleMessage } = useMessageManager();
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);
  
  // Récupérer les vitesses des drones du PlayerStore
  const droneSpeeds = usePlayerStore((state) => state.movementSpeeds.drone);
  
  // Ajout du store bot pour les transitions d'état (uniquement pour player2)
  const botState = useBotStore((state) => state.botState);
  const changeState = useBotStore((state) => state.changeState);
  const BOT_STATES = useBotStore((state) => state.BOT_STATES);
  const addAction = useBotStore((state) => state.addAction);
  
  // Sélecteurs pour les vaisseaux et le drone concerné
  const player1Ship = usePlayerStore((state) => state.players.player1?.vehicles?.ship);
  const player2Ship = usePlayerStore((state) => state.players.player2?.vehicles?.ship);
  const drone = usePlayerStore((state) => state.players[playerId]?.vehicles[droneId]);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);

  // État local pour le statut du drone
  const [returningToShip, setReturningToShip] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  // Pour le drone du joueur 1, on utilise un état local pour la cible
  const [playerDroneTargetTile, setPlayerDroneTargetTile] = useState(null);
  const [isPlayerDroneMoving, setIsPlayerDroneMoving] = useState(false);

  // Détermine le vaisseau à suivre
  const getShipToFollow = () => {
    if (playerId === "player2") {
      return player2Ship; // Le drone du bot suit toujours le vaisseau du bot
    } else {
      // Pour le joueur 1, on peut utiliser le vaisseau sélectionné ou par défaut player1Ship
      if (selectedVehicle.vehicleId === "ship") {
        return selectedVehicle.playerId === "player1" ? player1Ship : player2Ship;
      }
      return player1Ship;
    }
  };

  // Pour le drone du joueur 1: vérifier si un vaisseau a une cible définie
  useEffect(() => {
    // Ne s'applique qu'au drone du joueur 1
    if (playerId !== "player1") return;
    
    // Ne pas démarrer d'exploration si le drone est en retour vers le vaisseau ou en cooldown
    if (returningToShip || cooldown > 0) return;
    
    const shipToFollow = getShipToFollow();
    
    // Si le vaisseau suivi a une cible et que le drone n'est pas déjà en déplacement
    if (shipToFollow?.targetTile?.coord && !isPlayerDroneMoving && !playerDroneTargetTile) {
      // 20% de chance d'explorer la même cible que le vaisseau
      if (Math.random() < 0.2) {
        setPlayerDroneTargetTile(shipToFollow.targetTile.coord);
        setIsPlayerDroneMoving(true);
      }
    }
  }, [playerId, player1Ship?.targetTile, player2Ship?.targetTile, selectedVehicle, 
      isPlayerDroneMoving, playerDroneTargetTile, returningToShip, cooldown]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Décrémentez le compteur de cooldown s'il est actif
    if (cooldown > 0) {
      setCooldown(cooldown - delta);
    }

    const shipToFollow = getShipToFollow();
    let targetPosition;
    
    // Détermination de la position cible
    if (playerId === "player1") {
      // Logique pour le drone du joueur 1
      if (playerDroneTargetTile && tiles[playerDroneTargetTile] && !returningToShip) {
        const tile = tiles[playerDroneTargetTile];
        targetPosition = new Vector3(
          tile.position.x,
          1.5,  // Hauteur du drone
          tile.position.z
        );
      } else if (shipToFollow?.position) {
        // Position à côté du vaisseau (légèrement à droite)
        targetPosition = new Vector3(
          shipToFollow.position.x + 0.5,
          1.5,
          shipToFollow.position.z + 0.5
        );
      } else {
        targetPosition = new Vector3(0, 1.5, 0); // Position par défaut
      }
    } else {
      // Logique pour le drone du bot (player2)
      if (drone?.targetTile?.coord && tiles[drone.targetTile.coord] && !returningToShip) {
        const tile = tiles[drone.targetTile.coord];
        targetPosition = new Vector3(
          tile.position.x,
          1.5,  // Hauteur du drone
          tile.position.z
        );
      } else if (shipToFollow?.position) {
        // Position à côté du vaisseau (légèrement à gauche)
        targetPosition = new Vector3(
          shipToFollow.position.x - 0.5,
          1.5,
          shipToFollow.position.z - 0.5
        );
      } else {
        targetPosition = new Vector3(0, 1.5, 0); // Position par défaut
      }
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
    
    // Animation de rotation avec vitesse du PlayerStore
    rotationRef.current += delta * droneSpeeds.rotationSpeed;
    groupRef.current.rotation.y = rotationRef.current;

    // Logique de déplacement
    if (distance > 0.2) {
      // Déplacement vers la cible
      direction.normalize();
      
      // Vitesse différente selon le mode, en utilisant les vitesses du PlayerStore
      let speed;
      if (playerId === "player1") {
        speed = playerDroneTargetTile && !returningToShip ? droneSpeeds.explorationSpeed : droneSpeeds.normalSpeed;
      } else {
        speed = drone?.targetTile?.coord && !returningToShip ? droneSpeeds.botExplorationSpeed : droneSpeeds.botNormalSpeed;
      }
      
      groupRef.current.position.addScaledVector(direction, delta * speed);
      
      // Mise à jour du statut de mouvement
      if (playerId === "player1") {
        if (playerDroneTargetTile && !returningToShip) {
          setIsPlayerDroneMoving(true);
        }
      } else {
        if (drone?.targetTile?.coord && !returningToShip) {
          updateVehicle(playerId, droneId, { isMoving: true });
        }
      }
    } 
    // Gestion de l'arrivée à destination
    else {
      if (playerId === "player1") {
        // Drone du joueur 1
        if (playerDroneTargetTile && isPlayerDroneMoving && !returningToShip) {
          handleDroneReachedTarget(playerDroneTargetTile);
        }
      } else {
        // Drone du bot (player2)
        if (drone?.targetTile?.coord && drone.isMoving && !returningToShip) {
          handleDroneReachedTarget(drone.targetTile.coord);
        }
      }
      
      // Gestion du retour au vaisseau
      if (returningToShip && distance <= 0.2 && shipToFollow) {
        console.log(`[UnifiedDroneMovement] Drone for ${playerId} returned to ship`);
        setReturningToShip(false);
        setCooldown(3); // 3 secondes de cooldown
      }
    }
  });

  // Gère l'arrivée du drone à sa cible
  const handleDroneReachedTarget = (reachedTileCoord) => {
    if (!reachedTileCoord) return;
    
    const reachedTile = tiles[reachedTileCoord];
    if (!reachedTile) return;
    
    // Récupérer les informations de ressources
    const resources = reachedTile.resources || { food: 0, debris: 0, special: 0 };
    
    // Envoyer un message adapté au type de tuile
    sendVehicleMessage(playerId, droneId, 'resource', resources);
    
    if (reachedTile.type) {
      switch (reachedTile.type) {
        case "resource":
          sendVehicleMessage(playerId, droneId, 'resource', resources);
          break;
        case "danger":
          sendVehicleMessage(playerId, droneId, 'danger');
          break;
        case "fuel":
          sendVehicleMessage(playerId, droneId, 'fuel');
          break;
        case "repair":
          sendVehicleMessage(playerId, droneId, 'repair');
          break;
        default:
          break;
      }
    }
    
    // Si c'est le bot, mettre à jour sa mémoire des ressources connues
    if (playerId === "player2") {
      // Vérifier s'il y a des ressources sur la tuile
      const hasResources = resources.food > 0 || resources.debris > 0 || resources.special > 0;
      
      if (hasResources) {
        // Récupérer l'état actuel du store
        const playerState = usePlayerStore.getState();
        const botMemory = playerState.players?.player2?.memory || { knownResources: [] };
        
        // Vérifier si la ressource est déjà connue
        const alreadyKnown = botMemory.knownResources && 
                            botMemory.knownResources.some(r => r.coord === reachedTileCoord);
        
        if (!alreadyKnown) {
          console.log(`[UnifiedDroneMovement] Bot drone discovered new resources at ${reachedTileCoord}:`, resources);
          
          // Créer le nouvel objet de ressource
          const newResource = {
            coord: reachedTileCoord,
            position: reachedTile.position,
            resources
          };
          
          // Utiliser la méthode updatePlayerMemory au lieu de manipuler l'état directement
          const updatedKnownResources = botMemory.knownResources ? 
            [...botMemory.knownResources, newResource] : [newResource];
          
          // Mise à jour de la mémoire via la méthode appropriée
          usePlayerStore.getState().updatePlayerMemory('player2', {
            knownResources: updatedKnownResources
          });
          
          // Forcer une vérification des conditions après la découverte de ressources
          // pour faciliter la transition vers l'état de collecte
          if (playerId === "player2" && botState === BOT_STATES.EXPLORING) {
            console.log("[UnifiedDroneMovement] Resources found, checking conditions for state transition");
            // Attendre que la mise à jour du state soit complète avant de vérifier les conditions
            setTimeout(() => {
              console.log("[UnifiedDroneMovement] Executing checkConditions after finding resources");
              const botStore = useBotStore.getState();
              const currentState = botStore.botState;
              console.log(`[UnifiedDroneMovement] Current bot state before check: ${currentState}`);
              
              // Forcer la vérification de la condition spécifique
              const playerState = usePlayerStore.getState();
              const botVehicle = playerState.players?.player2?.vehicles?.ship;
              const hasDiscoveredResourcesResult = BotConditions.hasDiscoveredResources(currentState, botVehicle);
              
              console.log(`[UnifiedDroneMovement] hasDiscoveredResources result:`, hasDiscoveredResourcesResult);
              
              // Si la condition est validée, changer l'état manuellement
              if (hasDiscoveredResourcesResult.result && hasDiscoveredResourcesResult.state) {
                console.log(`[UnifiedDroneMovement] Forcing state change to ${hasDiscoveredResourcesResult.state}`);
                botStore.changeState(hasDiscoveredResourcesResult.state);
                
                // Ajouter l'action si spécifiée
                if (hasDiscoveredResourcesResult.action) {
                  console.log(`[UnifiedDroneMovement] Adding action ${hasDiscoveredResourcesResult.action.type}`);
                  botStore.addAction(hasDiscoveredResourcesResult.action.type, hasDiscoveredResourcesResult.action.priority);
                }
              } else {
                // Si la vérification spécifique n'a pas fonctionné, essayer la vérification générale
                botStore.checkConditions();
              }
            }, 200); // Allonger légèrement le délai pour s'assurer que l'état est bien mis à jour
          }
        }
      }
    }
    
    // Marquer la tuile comme explorée
    useTileStore.getState().markTileAsExplored(reachedTileCoord);
    
    // Incrémenter le compteur d'explorations si c'est le bot
    if (playerId === "player2") {
      const playerState = usePlayerStore.getState();
      const botMemory = playerState.players?.player2?.memory;
      const currentCount = botMemory?.explorationCount || 0;
      
      // Mettre à jour le compteur d'explorations
      usePlayerStore.getState().updatePlayerMemory('player2', {
        explorationCount: currentCount + 1
      });
      
      console.log(`[UnifiedDroneMovement] Bot exploration count increased to ${currentCount + 1}`);
    }
    
    // Mise à jour des états selon le type de drone
    if (playerId === "player1") {
      setIsPlayerDroneMoving(false);
      setPlayerDroneTargetTile(null);
    } else {
      updateVehicle(playerId, droneId, {
        isMoving: false,
        targetTile: null
      });
    }
    
    // Le drone retourne au vaisseau
    setReturningToShip(true);
  };

  // Position initiale du drone
  const initialPosition = () => {
    const ship = playerId === "player1" ? player1Ship : player2Ship;
    if (ship?.position) {
      // Position légèrement décalée par rapport au vaisseau
      const offsetX = playerId === "player1" ? 0.5 : -0.5;
      const offsetZ = playerId === "player1" ? 0.5 : -0.5;
      return [ship.position.x + offsetX, 1.5, ship.position.z + offsetZ];
    }
    return [0, 1.5, 0]; // Position par défaut
  };

  return (
    <group ref={groupRef} position={initialPosition()}>
      {children}
    </group>
  );
};

export default UnifiedDroneMovement;