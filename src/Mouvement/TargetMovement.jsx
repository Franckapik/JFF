import React, { useEffect, useRef } from "react";
import { useTileStore } from "../stores/useNewTileStore"; // Import tile store
import usePlayerStore from "../stores/usePlayerStore"; // Import player store
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const TargetMovement = ({ children }) => {
  const groupRef = useRef();
  const playerVehicle = usePlayerStore((state) => state.players.player1.vehicles.ship); // Get player vehicle
  const updateShip = usePlayerStore((state) => state.updateShip); // Use the generic updateShip function
  const tiles = useTileStore((state) => state.tiles); // Get tiles from the store
  const selectedTile = useTileStore((state) => state.selectedTile); // Get the selected tile

  const speed = 1; // Movement speed (units per second)

  // Set the initial position of the vehicle
  useEffect(() => {
    if (playerVehicle?.position && groupRef.current) {
      groupRef.current.position.set(
        playerVehicle.position.x,
        playerVehicle.position.y,
        playerVehicle.position.z
      );
    }
  }, [playerVehicle]);

  // Move the vehicle directly to the target tile
  useFrame((_, delta) => {
    if (!selectedTile || !tiles[selectedTile] || !groupRef.current) return;

    const targetTile = tiles[selectedTile];
    const targetPosition = new Vector3(
      targetTile.position.x,
      targetTile.position.y,
      targetTile.position.z
    );

    const direction = new Vector3().subVectors(targetPosition, groupRef.current.position);
    const distance = direction.length();

    if (distance > 0.01) {
      direction.normalize();
      const moveDistance = Math.min(speed * delta, distance);
      groupRef.current.position.addScaledVector(direction, moveDistance);

      updateShip({
        position: {
          x: groupRef.current.position.x,
          y: groupRef.current.position.y,
          z: groupRef.current.position.z,
        },
        isMoving: true,
      });
    } else {
      updateShip({
        position: {
          x: targetTile.position.x,
          y: targetTile.position.y,
          z: targetTile.position.z,
        },
        coord: selectedTile,
        isMoving: false,
      });
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default TargetMovement;
