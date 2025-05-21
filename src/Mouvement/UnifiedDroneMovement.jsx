import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useTileStore } from "../stores/useNewTileStore";
import usePlayerStore from "../stores/playerStore";
import useMessageManager from "../hooks/useMessageManager";
import fsmLogger from "../utils/fsmLogger";
import { 
  BOT_PLAYER_ID, 
  HUMAN_PLAYER_ID,
  getMainShipId,
  isMainShipId,
  VEHICLE_TYPES,
  isDroneId
} from '../ai/constants/playerConstants';

/**
 * Composant de mouvement de drone unifié qui fonctionne pour les deux joueurs (HUMAN_PLAYER_ID et BOT_PLAYER_ID)
 * @param {Object} props
 * @param {string} props.playerId - Identifiant du joueur
 * @param {string} props.droneId - Identifiant du drone (ex: "drone1", "drone3")
 * @param {React.ReactNode} props.children - Contenu à rendre à l'intérieur du groupe
 */
const UnifiedDroneMovement = ({ playerId = HUMAN_PLAYER_ID, droneId = "drone1", children }) => {
  const groupRef = useRef();
  const rotationRef = useRef(0);
  const tiles = useTileStore((state) => state.tiles);
  const { sendVehicleMessage } = useMessageManager();
  const updateVehicle = usePlayerStore((state) => state.updateVehicle);
  const updatePlayerMemory = usePlayerStore((state) => state.updatePlayerMemory);
  
  // Get the drone's type based on its ID
  const getDroneType = () => {
    if (droneId.startsWith(VEHICLE_TYPES.EXPLORER_DRONE)) return VEHICLE_TYPES.EXPLORER_DRONE;
    if (droneId.startsWith(VEHICLE_TYPES.COMBAT_DRONE)) return VEHICLE_TYPES.COMBAT_DRONE;
    if (droneId.startsWith(VEHICLE_TYPES.SPECIAL_DRONE)) return VEHICLE_TYPES.SPECIAL_DRONE;
    return null;
  };
  
  // Get drone type specific speeds and behaviors
  const droneType = getDroneType();
  const droneSpeed = usePlayerStore((state) => {
    switch(droneType) {
      case VEHICLE_TYPES.EXPLORER_DRONE:
        return state.movementSpeeds.drone.speed * 1.2; // Explorer drones are faster
      case VEHICLE_TYPES.COMBAT_DRONE:
        return state.movementSpeeds.drone.speed * 0.9; // Combat drones are slower
      case VEHICLE_TYPES.SPECIAL_DRONE:
        return state.movementSpeeds.drone.speed; // Regular speed
      default:
        return state.movementSpeeds.drone.speed;
    }
  });
  
  const droneRotationSpeed = usePlayerStore((state) => {
    switch(droneType) {
      case VEHICLE_TYPES.EXPLORER_DRONE:
        return state.movementSpeeds.drone.rotationSpeed * 0.8; // More stable rotation
      case VEHICLE_TYPES.COMBAT_DRONE:
        return state.movementSpeeds.drone.rotationSpeed * 1.2; // More aggressive rotation
      case VEHICLE_TYPES.SPECIAL_DRONE:
        return state.movementSpeeds.drone.rotationSpeed * 0.5; // Slow, scanning rotation
      default:
        return state.movementSpeeds.drone.rotationSpeed;
    }
  });
  
  // Sélecteurs pour les vaisseaux et le drone concerné
  const humanShip = usePlayerStore((state) => state.players[HUMAN_PLAYER_ID]?.vehicles?.[getMainShipId()]);
  const botShip = usePlayerStore((state) => state.players[BOT_PLAYER_ID]?.vehicles?.[getMainShipId()]);
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
    if (playerId === BOT_PLAYER_ID) {
      return botShip; // Le drone du bot suit toujours le vaisseau du bot
    } else {
      // Pour le joueur humain, on peut utiliser le vaisseau sélectionné ou par défaut humanShip
      if (isMainShipId(selectedVehicle.vehicleId)) {
        return selectedVehicle.playerId === HUMAN_PLAYER_ID ? humanShip : botShip;
      }
      return humanShip;
    }
  };

  // Pour le drone du joueur humain: vérifier si un vaisseau a une cible définie
  useEffect(() => {
    // Ne s'applique qu'au drone du joueur humain
    if (playerId !== HUMAN_PLAYER_ID) return;
    
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
  }, [playerId, humanShip?.targetTile, botShip?.targetTile, selectedVehicle, 
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
    if (playerId === HUMAN_PLAYER_ID) {
      // Logique pour le drone du joueur humain
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
    
    // Animation de rotation avec vitesse simplifiée
    rotationRef.current += delta * droneRotationSpeed;
    groupRef.current.rotation.y = rotationRef.current;

    // Logique de déplacement
    if (distance > 0.2) {
      // Déplacement vers la cible
      direction.normalize();
      
      // Utiliser la vitesse simplifiée (la même pour tous les modes)
      groupRef.current.position.addScaledVector(direction, delta * droneSpeed);
      
      // Mise à jour du statut de mouvement
      if (playerId === HUMAN_PLAYER_ID) {
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
      // Vérifier si le drone est activé
      if (!drone?.isActive) {
        // Les drones non explorateurs reviennent au vaisseau s'ils sont inactifs
        if (droneType !== VEHICLE_TYPES.EXPLORER_DRONE) {
          setReturningToShip(true);
        }
        return;
      }

      // Comportement spécifique selon le type de drone
      switch(droneType) {
        case VEHICLE_TYPES.EXPLORER_DRONE:
          // Comportement normal d'exploration
          if (playerId === HUMAN_PLAYER_ID) {
            if (playerDroneTargetTile && isPlayerDroneMoving && !returningToShip) {
              handleDroneReachedTarget(playerDroneTargetTile);
            }
          } else {
            if (drone?.targetTile?.coord && drone.isMoving && !returningToShip) {
              handleDroneReachedTarget(drone.targetTile.coord);
            }
          }
          break;

        case VEHICLE_TYPES.COMBAT_DRONE:
          // Le drone de combat peut attaquer et poser des mines
          if (drone?.targetTile?.coord && drone.isMoving && !returningToShip) {
            handleDroneReachedTarget(drone.targetTile.coord);
            // Poser une mine si la capacité est disponible
            if (drone.mineLayingCapacity > 0) {
              updateVehicle(playerId, droneId, {
                mineLayingCapacity: drone.mineLayingCapacity - 1
              });
              sendVehicleMessage(playerId, droneId, 'mine_laid');
            }
          }
          break;

        case VEHICLE_TYPES.SPECIAL_DRONE:
          // Le drone spécial a une portée de scan plus grande
          if (drone?.targetTile?.coord && drone.isMoving && !returningToShip) {
            handleDroneReachedTarget(drone.targetTile.coord);
            // Scanner la zone pour des objets spéciaux
            if (drone.specialDetection) {
              // Scan en spiral pour trouver des objets spéciaux
              const scanRadius = drone.specialScanRange || 5;
              sendVehicleMessage(playerId, droneId, 'special_scan', { radius: scanRadius });
            }
          }
          break;
      }
      
      // Gestion du retour au vaisseau
      if (returningToShip && distance <= 0.2 && shipToFollow) {
        fsmLogger.mouvement(`[UnifiedDroneMovement] ${droneType} for ${playerId} returned to ship`);
        setReturningToShip(false);
        
        // Cooldown variable selon le type de drone
        switch(droneType) {
          case VEHICLE_TYPES.EXPLORER_DRONE:
            setCooldown(2); // Plus court pour le drone d'exploration
            break;
          case VEHICLE_TYPES.COMBAT_DRONE:
            setCooldown(4); // Plus long pour le drone de combat
            // Réinitialiser la capacité de poses de mines
            if (drone.mineLayingCapacity < 3) {
              updateVehicle(playerId, droneId, { mineLayingCapacity: 3 });
            }
            break;
          case VEHICLE_TYPES.SPECIAL_DRONE:
            setCooldown(3); // Normal pour le drone spécial
            break;
          default:
            setCooldown(3);
        }
        
        if (playerId === BOT_PLAYER_ID) {
          // Signaler que le drone est revenu au vaisseau
          updatePlayerMemory(BOT_PLAYER_ID, { droneReturnedToShip: true });

          // Transférer les ressources collectées au vaisseau principal pour les drones de combat
          if (droneType === VEHICLE_TYPES.COMBAT_DRONE && drone.resources) {
            const botShipId = getMainShipId();
            updateVehicle(BOT_PLAYER_ID, botShipId, {
              resources: {
                food: (botShip.resources.food || 0) + (drone.resources.food || 0),
                debris: (botShip.resources.debris || 0) + (drone.resources.debris || 0),
                special: (botShip.resources.special || 0) + (drone.resources.special || 0)
              }
            });
            // Vider les ressources du drone
            updateVehicle(playerId, droneId, {
              resources: { food: 0, debris: 0, special: 0 }
            });
          }
        }
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
    
    // Comportement spécifique selon le type de drone
    switch(droneType) {
      case VEHICLE_TYPES.EXPLORER_DRONE:
        // Envoyer des informations détaillées sur les ressources et dangers
        if (reachedTile.type === "resource") {
          sendVehicleMessage(playerId, droneId, 'resource', {
            ...resources,
            explorationBonus: drone.explorationBonus,
            coord: reachedTileCoord
          });
        } else if (reachedTile.type === "danger") {
          sendVehicleMessage(playerId, droneId, 'danger', {
            severity: "high",
            coord: reachedTileCoord
          });
        }
        break;

      case VEHICLE_TYPES.COMBAT_DRONE:
        // Vérifier les menaces et collecter des ressources si possible
        if (reachedTile.type === "danger") {
          sendVehicleMessage(playerId, droneId, 'combat_engage', {
            damage: drone.damage,
            coord: reachedTileCoord
          });
        } else if (resources.food > 0 || resources.debris > 0) {
          // Le drone de combat peut collecter de petites quantités
          const collectedResources = {
            food: Math.min(resources.food, drone.maxCapacity.food),
            debris: Math.min(resources.debris, drone.maxCapacity.debris),
            special: Math.min(resources.special, drone.maxCapacity.special)
          };
          sendVehicleMessage(playerId, droneId, 'resource', collectedResources);
        }
        break;

      case VEHICLE_TYPES.SPECIAL_DRONE:
        // Scanner spécifiquement pour les ressources spéciales
        if (resources.special > 0) {
          sendVehicleMessage(playerId, droneId, 'special_discovered', {
            special: resources.special,
            coord: reachedTileCoord,
            scanRange: drone.specialScanRange
          });
        } else {
          // Envoyer des données de scan même si rien n'est trouvé
          sendVehicleMessage(playerId, droneId, 'scan_complete', {
            coord: reachedTileCoord,
            scanRange: drone.specialScanRange
          });
        }
        break;

      default:
        // Comportement par défaut pour les autres types
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
    }
    
    // Si c'est le bot, mettre à jour sa mémoire des ressources connues
    if (playerId === BOT_PLAYER_ID) {
      // Vérifier s'il y a des ressources sur la tuile
      const hasResources = resources.food > 0 || resources.debris > 0 || resources.special > 0;
      
      if (hasResources) {
        // Récupérer l'état actuel du store
        const playerState = usePlayerStore.getState();
        const botMemory = playerState.players?.[BOT_PLAYER_ID]?.memory || { knownResources: [] };
        
        // Vérifier si la ressource est déjà connue
        const alreadyKnown = botMemory.knownResources && 
                            botMemory.knownResources.some(r => r.coord === reachedTileCoord);
        
        if (!alreadyKnown) {
          fsmLogger.mouvement(`[UnifiedDroneMovement] Bot drone discovered new resources at ${reachedTileCoord}:`, resources);
          
          // Créer le nouvel objet de ressource
          const newResource = {
            coord: reachedTileCoord,
            position: reachedTile.position,
            resources,
            discoveredAt: new Date().toISOString()
          };
          
          // Utiliser la méthode updatePlayerMemory au lieu de manipuler l'état directement
          const updatedKnownResources = botMemory.knownResources ? 
            [...botMemory.knownResources, newResource] : [newResource];
          
          // Mise à jour de la mémoire via la méthode appropriée
          updatePlayerMemory(BOT_PLAYER_ID, {
            knownResources: updatedKnownResources,
            lastResourceDiscovery: {
              coord: reachedTileCoord,
              resources,
              timestamp: new Date().toISOString()
            },
            // Définir un flag indiquant qu'une nouvelle ressource a été découverte
            // Les conditions du bot pourront vérifier ce flag
            hasNewResourceDiscovery: true
          });
        }
      }
    }
    
    // Marquer la tuile comme explorée
    useTileStore.getState().markTileAsExplored(reachedTileCoord);
    
    // Incrémenter le compteur d'explorations si c'est le bot
    if (playerId === BOT_PLAYER_ID) {
      const playerState = usePlayerStore.getState();
      const botMemory = playerState.players?.[BOT_PLAYER_ID]?.memory;
      const currentCount = botMemory?.explorationCount || 0;
      
      // Mettre à jour le compteur d'explorations
      updatePlayerMemory(BOT_PLAYER_ID, {
        explorationCount: currentCount + 1
      });
      
      fsmLogger.mouvement(`[UnifiedDroneMovement] Bot exploration count increased to ${currentCount + 1}`);
    }
    
    // Mise à jour des états selon le type de drone
    if (playerId === HUMAN_PLAYER_ID) {
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
    const ship = playerId === HUMAN_PLAYER_ID ? humanShip : botShip;
    if (ship?.position) {
      // Position légèrement décalée par rapport au vaisseau
      const offsetX = playerId === HUMAN_PLAYER_ID ? 0.5 : -0.5;
      const offsetZ = playerId === HUMAN_PLAYER_ID ? 0.5 : -0.5;
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