import React, { useEffect, useRef, useState } from "react";
import usePlayerStore from "../stores/usePlayerStore"; // Gestion des joueurs et véhicules
import useGameStore from "../stores/useGameStore"; // Gestion de l'état global du jeu
import useBotStore from "../stores/useBotStore"; // Gestion des actions du bot
import { useTileStore } from "../stores/useNewTileStore"; // Accès aux tuiles pour le pathfinding
import { useFrame } from "@react-three/fiber"; // Gestion des animations dans la boucle de rendu
import { Vector3, Euler } from "three"; // Utilisation des vecteurs pour les calculs 3D

const TargetMovement = ({ playerId, children }) => {
  // === Références et états locaux ===
  const groupRef = useRef(); // Référence au groupe 3D pour le mouvement
  const rotationRef = useRef(new Euler(0, 0, 0)); // Suivi de la rotation actuelle
  
  // États pour le suivi du mouvement
  const [path, setPath] = useState([]); // Liste des tuiles intermédiaires
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0); // Index de la tuile cible actuelle
  const [hasReachedTarget, setHasReachedTarget] = useState(false); // Indique si la cible finale a été atteinte
  const [totalPathDistance, setTotalPathDistance] = useState(0); // Distance totale du chemin
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Distance parcourue jusqu'à présent
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false); // Pour suivre l'initialisation

  // Constantes de mouvement
  const speed = 1.5; // Augmenter légèrement la vitesse
  const rotationSpeed = 2; // Vitesse d'interpolation de rotation

  // === Sélecteurs des stores ===
  const tiles = useTileStore((state) => state.tiles); // Obtenir les tuiles pour le calcul de chemin
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Véhicule sélectionné globalement
  const playerVehicles = usePlayerStore((state) => state.players[playerId]?.vehicles); // Véhicules du joueur
  const updateShip = usePlayerStore((state) => state.updateShip); // Fonction pour mettre à jour le navire
  
  const playerVehicle =
    playerId === "player2"
      ? playerVehicles?.ship
      : selectedVehicle.playerId === playerId && selectedVehicle.vehicleId === "ship"
      ? playerVehicles?.ship
      : playerVehicles?.drones?.find((drone) => drone.id === selectedVehicle.vehicleId); // Véhicule sélectionné

  const setClockRunning = useGameStore((state) => state.setClockRunning); // Démarrer ou arrêter l'horloge globale
  const botTargetTile = useBotStore((state) => state.targetTile); // Tuile cible du bot
  const finalizeMovement = usePlayerStore((state) => state.finalizeMovement); // Fonction pour finaliser le mouvement

  // === Fonctions utilitaires ===
  
  // Calculer le chemin entre deux tuiles 
  const findPath = (startCoord, targetCoord, tiles) => {
    const queue = [[startCoord]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const currentCoord = path[path.length - 1];

      if (currentCoord === targetCoord) {
        return path;
      }

      if (!visited.has(currentCoord)) {
        visited.add(currentCoord);
        const neighbors = tiles[currentCoord]?.neighbors || [];
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor) && tiles[neighbor]?.walkable !== false) {
            queue.push([...path, neighbor]);
          }
        });
      }
    }

    return [];
  };

  // Calculer le chemin complet vers la cible
  const calculatePath = () => {
    if (!groupRef.current || !playerVehicle) {
      console.log("Missing ref or vehicle:", { groupRef: !!groupRef.current, playerVehicle: !!playerVehicle });
      return;
    }

    const targetTile = playerId === "player2" ? botTargetTile : playerVehicle.targetTile;
        
    if (!targetTile || !targetTile.coord) {
      console.log("Missing target tile:", targetTile);
      return;
    }
    
    // Vérifier la position actuelle du group
    console.log("Group position:", groupRef.current.position);
    
    // Trouver la tuile actuelle basée sur la position du véhicule
    const currentTile = Object.values(tiles).find(
      (tile) =>
        Math.abs(tile.position.x - groupRef.current.position.x) < 0.3 &&
        Math.abs(tile.position.z - groupRef.current.position.z) < 0.3
    );
    
    if (!currentTile) {
      console.log("Current tile not found at position:", groupRef.current.position);
      
      // Utiliser la tuile du véhicule si nous ne trouvons pas de correspondance
      if (playerVehicle.coord) {
        const fallbackTile = tiles[playerVehicle.coord];
        if (fallbackTile) {
          console.log("Using fallback tile from vehicle coord:", fallbackTile);
          const newPath = findPath(playerVehicle.coord, targetTile.coord, tiles);
          processPath(newPath);
        } else {
          console.log("Fallback tile not found either.");
        }
      }
      return;
    }
    
    console.log("Found current tile:", currentTile.coord);
    const newPath = findPath(currentTile.coord, targetTile.coord, tiles);
    console.log("Path calculated:", newPath);
    
    processPath(newPath);
  };
  
  // Séparer le traitement du chemin pour plus de clarté
  const processPath = (newPath) => {
    if (!newPath || newPath.length === 0) {
      console.log("Empty path returned");
      return;
    }
    
    setPath(newPath);
    setCurrentTargetIndex(0);
    setHasReachedTarget(false);
    
    // Calculer la distance totale du chemin
    let totalDistance = 0;
    for (let i = 0; i < newPath.length - 1; i++) {
      const tileA = tiles[newPath[i]];
      const tileB = tiles[newPath[i + 1]];
      if (tileA && tileB) {
        totalDistance += new Vector3(tileA.position.x, tileA.position.y, tileA.position.z)
          .distanceTo(new Vector3(tileB.position.x, tileB.position.y, tileB.position.z));
      }
    }
    
    console.log("Total path distance:", totalDistance);
    setTotalPathDistance(totalDistance);
    setDistanceTraveled(0);
    
    // Mettre à jour l'état du véhicule
    if (playerId && playerVehicle) {
      updateShip(playerId, {
        isMoving: true,
        path: newPath,
        totalDistance: totalDistance
      });
    }
  };

  // === Effets ===

  // Définir la position initiale du véhicule de manière fiable
  useEffect(() => {
    if (!isInitialPositionSet && playerVehicle?.position && groupRef.current) {
      console.log("Setting initial position:", playerVehicle.position);
      groupRef.current.position.set(
        playerVehicle.position.x,
        playerVehicle.position.y,
        playerVehicle.position.z
      );
      setIsInitialPositionSet(true);
    }
  }, [playerVehicle, isInitialPositionSet]);

  // Recalculer le chemin quand la cible change
  useEffect(() => {
    const targetTile = playerId === "player2" ? botTargetTile : playerVehicle?.targetTile;

    if (targetTile && targetTile.coord && playerVehicle && Object.keys(tiles).length > 0 && isInitialPositionSet) {
      console.log("Target changed, recalculating path");
      setClockRunning(true);
      // Attendre un peu pour s'assurer que la position est correcte
      setTimeout(calculatePath, 100);
    }
  }, [playerId, botTargetTile, playerVehicle?.targetTile?.coord, isInitialPositionSet, Object.keys(tiles).length]);

  // === Boucle de rendu (useFrame) ===

  // Déplacer le véhicule le long du chemin
  useFrame((_, delta) => {
    if (!playerVehicle || path.length === 0 || currentTargetIndex >= path.length) return;

    // Vérifier si le véhicule a du carburant (optionnel)
    if (playerVehicle.fuel <= 0) {
      updateShip(playerId, { isMoving: false });
      return;
    }

    const currentTargetCoord = path[currentTargetIndex];
    const currentTargetTile = tiles[currentTargetCoord];

    if (!currentTargetTile) {
      console.warn("Target tile not found:", currentTargetCoord);
      return;
    }

    const targetPosition = new Vector3(
      currentTargetTile.position.x,
      currentTargetTile.position.y,
      currentTargetTile.position.z
    );

    const currentPosition = groupRef.current.position;
    const direction = new Vector3().subVectors(targetPosition, currentPosition);
    const distance = direction.length();

    // Débogage de la distance
    if (currentTargetIndex === 0 && Math.random() < 0.01) { // Limiter les logs à 1%
      console.log("Distance to target:", distance, "Target:", targetPosition, "Current:", currentPosition);
    }

    if (distance > 0.1) {
      // Le véhicule se déplace vers la tuile actuelle
      direction.normalize();
      const moveDistance = Math.min(speed * delta, distance);
      
      // Déplacer physiquement l'objet 3D
      groupRef.current.position.addScaledVector(direction, moveDistance);

      // Rotation vers la direction de déplacement
      const targetAngle = Math.atan2(direction.x, direction.z);
      const currentAngle = rotationRef.current.y;
      const interpolatedAngle = currentAngle + (targetAngle - currentAngle) * Math.min(rotationSpeed * delta, 1);

      rotationRef.current.set(0, interpolatedAngle, 0);
      groupRef.current.rotation.copy(rotationRef.current);

      // Mettre à jour la distance parcourue et progression
      setDistanceTraveled(prev => prev + moveDistance);
      const progress = (distanceTraveled / totalPathDistance) * 100;
      
      // Mettre à jour la progression dans le store
      updateShip(playerId, {
        progress: Math.min(progress, 100).toFixed(2),
      });
      
    } else {
      // Le véhicule a atteint la tuile cible actuelle
      console.log("Reached tile:", currentTargetCoord, "Index:", currentTargetIndex, "Path length:", path.length);
      
      // Mettre à jour la position dans le store pour synchroniser
      updateShip(playerId, {
        position: {
          x: currentTargetTile.position.x,
          y: currentTargetTile.position.y,
          z: currentTargetTile.position.z,
        },
        coord: currentTargetCoord,
      });
      
      if (currentTargetIndex < path.length - 1) {
        // Passer à la tuile suivante du chemin
        setCurrentTargetIndex(prev => prev + 1);
        updateShip(playerId, { fuel: Math.max(playerVehicle.fuel - 5, 0) });
      } else {
        // Le véhicule a atteint la tuile finale
        if (!hasReachedTarget) {
          setHasReachedTarget(true);
          console.log("Arrived at destination");
          
          // Finaliser le mouvement et traiter les interactions
          finalizeMovement(playerId, currentTargetTile);
          
        }
      }
    }
  });

  // === Rendu ===
  return (
    <>
      {/* Afficher le chemin pour faciliter le débogage */}
      {path.length > 0 && path.map((coord, index) => {
        if (tiles[coord] && index >= currentTargetIndex) {
          return (
            <mesh 
              key={coord} 
              position={[tiles[coord].position.x, 0.25, tiles[coord].position.z]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={index === path.length - 1 ? "orange" : "blue"} />
            </mesh>
          );
        }
        return null;
      })}
      
      {/* Ajouter un marqueur à la position actuelle pour débogage */}
      <mesh position={[groupRef.current?.position.x || 0, 0.3, groupRef.current?.position.z || 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="red" transparent opacity={0.7} />
      </mesh>
      
      <group ref={groupRef}>{children}</group>
    </>
  );
};

export default TargetMovement;
