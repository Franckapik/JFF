import React, { useEffect, useRef, useState } from "react";
import { useTileStore } from "../stores/useNewTileStore"; // Gestion des tuiles
import usePlayerStore from "../stores/usePlayerStore"; // Gestion des joueurs et véhicules
import useGameStore from "../stores/useGameStore"; // Gestion de l'état global du jeu
import useBotStore from "../stores/useBotStore"; // Gestion des actions du bot
import { useFrame } from "@react-three/fiber"; // Gestion des animations dans la boucle de rendu
import { Vector3 } from "three"; // Utilisation des vecteurs pour les calculs 3D
import useMessageManager from "../hooks/useMessageManager"; // Gestion des messages

const TargetMovement = ({ playerId, children }) => {
  // === Références et états locaux ===
  const groupRef = useRef(); // Référence au groupe 3D pour le mouvement
  const [path, setPath] = useState([]); // Chemin calculé pour le mouvement
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Index de la tuile cible actuelle
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Distance parcourue
  const [resourcesCollected, setResourcesCollected] = useState(false); // Indique si les ressources ont été collectées
  const [repairApplied, setRepairApplied] = useState(false); // Indique si une réparation a été appliquée
  const [fuelApplied, setFuelApplied] = useState(false); // Indique si un ravitaillement a été appliqué
  const [hasReachedTarget, setHasReachedTarget] = useState(false); // Indique si la cible a été atteinte

  const speed = 1; // Vitesse de déplacement (unités par seconde)

  // === Sélecteurs des stores ===
  // Gestion des véhicules et des joueurs
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Véhicule sélectionné globalement
  const playerVehicles = usePlayerStore((state) => state.players[playerId].vehicles); // Véhicules du joueur
  const playerVehicle =
    playerId === "player2" // Ignorer le véhicule sélectionné pour le joueur 2
      ? playerVehicles.ship
      : selectedVehicle.playerId === playerId && selectedVehicle.vehicleId === "ship"
      ? playerVehicles.ship
      : playerVehicles.drones.find((drone) => drone.id === selectedVehicle.vehicleId); // Véhicule sélectionné
  const updateShip = usePlayerStore((state) => state.updateShip); // Fonction pour mettre à jour le véhicule

  // Gestion des tuiles
  const tiles = useTileStore((state) => state.tiles); // Toutes les tuiles
  const selectedTile = useTileStore((state) => state.selectedTile); // Tuile sélectionnée
  const clearSelectedTile = useTileStore((state) => state.clearSelectedTile); // Fonction pour désélectionner une tuile

  // Gestion globale du jeu
  const setClockRunning = useGameStore((state) => state.setClockRunning); // Démarrer ou arrêter l'horloge globale

  // Gestion des messages
  const { sendVehicleMessage } = useMessageManager(); // Fonction pour envoyer des messages

  // Gestion des actions du bot
  const botState = useBotStore((state) => state.state); // État actuel du bot (FSM)
  const botTargetTile = useBotStore((state) => state.targetTile); // Tuile cible du bot
  const executeBotAction = useBotStore((state) => state.execute); // Exécuter une action du bot

  const markVehicleArrival = usePlayerStore((state) => state.markVehicleArrival);
  const collectResources = usePlayerStore((state) => state.collectResources);
  const repairVehicle = usePlayerStore((state) => state.repairVehicle);
  const refuelVehicle = usePlayerStore((state) => state.refuelVehicle);
  const returnToBase = usePlayerStore((state) => state.returnToBase);

  // === Effets ===

  // Effet : Calculer le chemin lorsque la tuile sélectionnée change
  useEffect(() => {
    if (selectedTile && tiles[selectedTile] && playerVehicle?.coord) {
      setClockRunning(true); // Démarrer l'horloge
      const calculatePath = (startCoord, targetCoord) => {
        const queue = [[startCoord]];
        const visited = new Set();
        let foundPath = [];

        while (queue.length > 0) {
          const currentPath = queue.shift();
          const currentCoord = currentPath[currentPath.length - 1];

          if (currentCoord === targetCoord) {
            foundPath = currentPath;
            break;
          }

          if (!visited.has(currentCoord)) {
            visited.add(currentCoord);
            const neighbors = tiles[currentCoord]?.neighbors || [];
            neighbors.forEach((neighbor) => {
              if (!visited.has(neighbor) && tiles[neighbor]?.walkable) {
                queue.push([...currentPath, neighbor]);
              }
            });
          }
        }

        return foundPath;
      };

      const calculatedPath = calculatePath(playerVehicle.coord, selectedTile);
      setPath(calculatedPath);
      setCurrentTargetIndex(0); // Réinitialiser l'index
      setDistanceTraveled(0); // Réinitialiser la distance parcourue
      setResourcesCollected(false); // Réinitialiser l'état de collecte des ressources
      setRepairApplied(false); // Réinitialiser l'état de réparation
      setFuelApplied(false); // Réinitialiser l'état de ravitaillement
      setHasReachedTarget(false); // Réinitialiser l'état de cible atteinte
    }
  }, [selectedTile, tiles, playerVehicle?.coord, setClockRunning]);

  // Effet : Calculer le chemin pour le joueur 2 (bot) en fonction de la FSM
  useEffect(() => {
    if (playerId === "player2" && botTargetTile && tiles[botTargetTile]) {
      const calculatePath = (startCoord, targetCoord) => {
        const queue = [[startCoord]];
        const visited = new Set();
        let foundPath = [];

        while (queue.length > 0) {
          const currentPath = queue.shift();
          const currentCoord = currentPath[currentPath.length - 1];

          if (currentCoord === targetCoord) {
            foundPath = currentPath;
            break;
          }

          if (!visited.has(currentCoord)) {
            visited.add(currentCoord);
            const neighbors = tiles[currentCoord]?.neighbors || [];
            neighbors.forEach((neighbor) => {
              if (!visited.has(neighbor) && tiles[neighbor]?.walkable) {
                queue.push([...currentPath, neighbor]);
              }
            });
          }
        }

        return foundPath;
      };

      const playerVehicle = usePlayerStore.getState().players[playerId].vehicles.ship;
      const calculatedPath = calculatePath(playerVehicle.coord, botTargetTile);
      setPath(calculatedPath);
      setCurrentTargetIndex(0);
    }
  }, [botTargetTile, tiles, playerId]);

  // Effet : Définir la position initiale du véhicule
  useEffect(() => {
    if (playerVehicle?.position && groupRef.current) {
      groupRef.current.position.set(
        playerVehicle.position.x,
        playerVehicle.position.y,
        playerVehicle.position.z
      );
    }
  }, [playerVehicle]);

  // === Boucle de rendu (useFrame) ===

  // Déplacer le véhicule le long du chemin
  useFrame((_, delta) => {
    if (!path || path.length === 0 || !groupRef.current || !playerVehicle || hasReachedTarget) return;

    const currentTargetCoord = path[currentTargetIndex];
    const currentTargetTile = tiles[currentTargetCoord];

    if (currentTargetTile) {
      const targetPosition = new Vector3(
        currentTargetTile.position.x,
        currentTargetTile.position.y,
        currentTargetTile.position.z
      );

      const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
      const distance = direction.length();

      if (distance > 0.01) {
        direction.normalize();
        const moveDistance = Math.min(speed * delta, distance);
        groupRef.current.position.addScaledVector(direction, moveDistance);

        setDistanceTraveled((prev) => prev + moveDistance);

        // Calculer la progression en pourcentage
        const progress =
          ((currentTargetIndex + (1 - distance / targetPosition.length())) / path.length) * 100;

        if (Math.round(playerVehicle.progress) !== Math.round(progress)) {
          updateShip(playerId, {
            position: {
              x: groupRef.current.position.x,
              y: groupRef.current.position.y,
              z: groupRef.current.position.z,
            },
            progress: Math.min(progress, 100), // Limiter la progression à 100%
            isMoving: true,
          });
        }
      } else if (currentTargetIndex < path.length - 1) {
        setCurrentTargetIndex(currentTargetIndex + 1); // Passer à la tuile suivante
        updateShip(playerId, {
          position: {
            x: currentTargetTile.position.x,
            y: currentTargetTile.position.y,
            z: currentTargetTile.position.z,
          },
          coord: currentTargetCoord,
          fuel: Math.max(playerVehicle.fuel - 10, 0), // Réduire le carburant
        });
      } else {
        handleTargetReached(currentTargetTile, currentTargetCoord); // Gérer l'arrivée à la cible
      }
    }
  });

  // === Gérer l'arrivée à la tuile cible ===
  const handleTargetReached = (currentTargetTile, currentTargetCoord) => {
    const destinationTile = tiles[currentTargetCoord];
    if (!destinationTile) return;

    // Utiliser un switch pour gérer les différents types de tuiles
    switch (destinationTile.type) {
      case "resource":
        if (!destinationTile.collected && !resourcesCollected) {
          collectResources(playerId, destinationTile);
          setResourcesCollected(true);
        }
        break;

      case "repair":
        if (!repairApplied) {
          repairVehicle(playerId);
          setRepairApplied(true);
        }
        break;

      case "fuel":
        if (!fuelApplied) {
          refuelVehicle(playerId);
          setFuelApplied(true);
        }
        break;

      case "depart":
        returnToBase(playerId, currentTargetTile);
        return; // Sortir immédiatement après avoir géré la tuile de départ

      default:
        console.warn(`Unhandled tile type: ${destinationTile.type}`);
        break;
    }

    // Marquer l'arrivée si ce n'est pas une tuile de départ
    markVehicleArrival(playerId, currentTargetTile);
    clearSelectedTile();

    setClockRunning(false);
    setHasReachedTarget(true);

    if (playerId === "player2") {
      executeBotAction(tiles);
    }
  };

  // === Rendu ===
  return <group ref={groupRef}>{children}</group>;
};

export default TargetMovement;
