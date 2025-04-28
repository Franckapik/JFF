import React, { useEffect, useRef, useState } from "react";
import usePlayerStore from "../stores/usePlayerStore"; // Gestion des joueurs et véhicules
import useGameStore from "../stores/useGameStore"; // Gestion de l'état global du jeu
import useBotStore from "../stores/useBotStore"; // Gestion des actions du bot
import { useFrame } from "@react-three/fiber"; // Gestion des animations dans la boucle de rendu
import { Vector3 } from "three"; // Utilisation des vecteurs pour les calculs 3D

const TargetMovement = ({ playerId, children }) => {
  // === Références et états locaux ===
  const groupRef = useRef(); // Référence au groupe 3D pour le mouvement
  const [resourcesCollected, setResourcesCollected] = useState(false); // Indique si les ressources ont été collectées
  const [repairApplied, setRepairApplied] = useState(false); // Indique si une réparation a été appliquée
  const [fuelApplied, setFuelApplied] = useState(false); // Indique si un ravitaillement a été appliqué
  const [hasReachedTarget, setHasReachedTarget] = useState(false); // Indique si la cible a été atteinte

  const speed = 1; // Vitesse de déplacement (unités par seconde)

  // === Sélecteurs des stores ===
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Véhicule sélectionné globalement
  const playerVehicles = usePlayerStore((state) => state.players[playerId].vehicles); // Véhicules du joueur
  const playerVehicle =
    playerId === "player2" // Ignorer le véhicule sélectionné pour le joueur 2
      ? playerVehicles.ship
      : selectedVehicle.playerId === playerId && selectedVehicle.vehicleId === "ship"
      ? playerVehicles.ship
      : playerVehicles.drones.find((drone) => drone.id === selectedVehicle.vehicleId); // Véhicule sélectionné

  const setClockRunning = useGameStore((state) => state.setClockRunning); // Démarrer ou arrêter l'horloge globale
  const botTargetTile = useBotStore((state) => state.targetTile); // Tuile cible du bot
  const executeBotAction = useBotStore((state) => state.execute); // Exécuter une action du bot

  const collectResources = usePlayerStore((state) => state.collectResources);
  const repairVehicle = usePlayerStore((state) => state.repairVehicle);
  const refuelVehicle = usePlayerStore((state) => state.refuelVehicle);
  const returnToBase = usePlayerStore((state) => state.returnToBase);
  const calculatePath = usePlayerStore((state) => state.calculatePath);
  const finalizeMovement = usePlayerStore((state) => state.finalizeMovement);
  const moveVehicle = usePlayerStore((state) => state.moveVehicle);

  // === Effets ===

  // Effet : Calculer le chemin pour le joueur (1 ou 2) lorsque la tuile cible change
  useEffect(() => {
    const targetTile = playerId === "player2" ? botTargetTile : playerVehicle?.targetTile;

    if (targetTile && playerVehicle?.coord) {
      setClockRunning(true); // Démarrer l'horloge
      calculatePath(playerId, targetTile, {}); // Utiliser la fonction du store
      setResourcesCollected(false); // Réinitialiser l'état de collecte des ressources
      setRepairApplied(false); // Réinitialiser l'état de réparation
      setFuelApplied(false); // Réinitialiser l'état de ravitaillement
      setHasReachedTarget(false); // Réinitialiser l'état de cible atteinte
    }
  }, [playerId, botTargetTile, playerVehicle?.coord, setClockRunning]);

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
    if (!playerVehicle || !playerVehicle.targetTile || hasReachedTarget) return;

    const targetTile = playerVehicle.targetTile;

    if (targetTile?.position && targetTile?.coord) {
      const targetPosition = new Vector3(targetTile.position.x, targetTile.position.y, targetTile.position.z);
      const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
      const distance = direction.length();

      if (distance > 0.01) {
        direction.normalize();
        const moveDistance = Math.min(speed * delta, distance);
        groupRef.current.position.addScaledVector(direction, moveDistance);

        moveVehicle(playerId, selectedVehicle.vehicleId, groupRef.current.position, targetTile);
      } else {
        handleTargetReached(targetTile);
      }
    }
  });

  // === Gérer l'arrivée à la tuile cible ===
  const handleTargetReached = (targetTile) => {
    if (!targetTile) return;

    switch (targetTile.type) {
      case "resource":
        collectResources(playerId, targetTile);
        break;

      case "repair":
        repairVehicle(playerId);
        break;

      case "fuel":
        refuelVehicle(playerId);
        break;

      case "depart":
        returnToBase(playerId, targetTile);
        return; // Sortir immédiatement après avoir géré la tuile de départ

      default:
        console.warn(`Unhandled tile type: ${targetTile.type}`);
        break;
    }

    finalizeMovement(playerId, targetTile);

    if (playerId === "player2") {
      executeBotAction({});
    }
  };

  // === Rendu ===
  return <group ref={groupRef}>{children}</group>;
};

export default TargetMovement;
