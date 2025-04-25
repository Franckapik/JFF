import React from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import "../styles/App.css"; // Import CSS for styling

const UserHUD = () => {
  const selectedTileCoord = useTileStore((state) => state.selectedTile); // Get the selected tile's coordinate
  const tile = useTileStore((state) => (selectedTileCoord ? state.tiles[selectedTileCoord] : null)); // Fetch the full tile data
  const randomVehicle = useTileStore((state) => state.randomVehicle); // Get random vehicle data
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle data
  const randomVehicleIsMoving = useTileStore((state) => state.randomVehicleIsMoving); // Get random vehicle movement status
  const targetVehicleIsMoving = useTileStore((state) => state.targetVehicleIsMoving); // Get target vehicle movement status
  const targetVehicleProgress = useTileStore((state) => state.targetVehicleProgress); // Get target vehicle progress
  const targetFuel = useTileStore((state) => state.targetFuel); // Get targetFuel from the store
  const targetDamage = useTileStore((state) => state.targetDamage); // Get targetDamage from the store
  const targetVehicleResources = useTileStore((state) => state.targetVehicleResources); // Get target vehicle resources
  const playerResources = useTileStore((state) => state.playerResources); // Get player resources from the store
  const selectedVehicle = useTileStore((state) => state.selectedVehicle); // Get selected vehicle from the store
  const drones = useTileStore((state) => state.drones); // Get drones from the store

  return (
    <div className="user-hud">
      {/* Section: Tile Information */}
      <div className="hud-column">
        <h3>Tuile Sélectionnée</h3>
        {tile ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <strong>Coord :</strong> {tile.coord || "N/A"}
            </li>
            <li>
              <strong>Position :</strong> x: {tile.position?.x.toFixed(2) || "N/A"}, y:{" "}
              {tile.position?.y.toFixed(2) || "N/A"}, z: {tile.position?.z.toFixed(2) || "N/A"}
            </li>
            <li>
              <strong>Type :</strong> {tile.type || "N/A"}
            </li>
            <li>
              <strong>Walkable :</strong> {tile.walkable ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Explored :</strong> {tile.explored ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Collected :</strong> {tile.collected ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Neighbors :</strong> {tile.neighbors?.join(", ") || "N/A"}
            </li>
            <li>
              <strong>Resources:</strong>
              <ul>
                <li>
                  <strong>Food:</strong> {tile.resources?.food || 0}
                </li>
                <li>
                  <strong>Debris:</strong> {tile.resources?.debris || 0}
                </li>
                <li>
                  <strong>Special:</strong> {tile.resources?.special || 0}
                </li>
              </ul>
            </li>
          </ul>
        ) : (
          <p>Aucune tuile sélectionnée</p>
        )}
      </div>

      {/* Section: Vehicle Information */}
      <div className="hud-column">
        <h3>Véhicules</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <strong>Véhicule Aléatoire:</strong>
            <ul>
              <li>
                <strong>Position:</strong>{" "}
                {randomVehicle
                  ? `x: ${randomVehicle.position.x.toFixed(2)}, y: ${randomVehicle.position.y.toFixed(
                      2
                    )}, z: ${randomVehicle.position.z.toFixed(2)} (Coord: ${randomVehicle.coord})`
                  : "N/A"}
              </li>
              <li>
                <strong>En Mouvement:</strong> {randomVehicleIsMoving ? "Oui" : "Non"}
              </li>
            </ul>
          </li>
          <li>
            <strong>Véhicule Cible:</strong>
            <ul>
              <li>
                <strong>Position:</strong>{" "}
                {targetVehicle
                  ? `x: ${targetVehicle.position.x.toFixed(2)}, y: ${targetVehicle.position.y.toFixed(
                      2
                    )}, z: ${targetVehicle.position.z.toFixed(2)} (Coord: ${targetVehicle.coord})`
                  : "N/A"}
              </li>
              <li>
                <strong>En Mouvement:</strong> {targetVehicleIsMoving ? "Oui" : "Non"}
              </li>
              <li>
                <strong>Progression:</strong> {targetVehicleProgress}%
              </li>
            </ul>
          </li>
          <li>
            <strong>Drones:</strong>
            <ul>
              {drones.map((drone) => (
                <li key={drone.id}>
                  <strong>ID:</strong> {drone.id} <br />
                  <strong>Position:</strong>{" "}
                  {drone.position
                    ? `x: ${drone.position.x.toFixed(2)}, y: ${drone.position.y.toFixed(
                        2
                      )}, z: ${drone.position.z.toFixed(2)}`
                    : "N/A"}{" "}
                  <br />
                  <strong>Tuile Cible:</strong> {drone.targetTile || "N/A"} <br />
                  <strong>En Mouvement:</strong> {drone.isMoving ? "Oui" : "Non"}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      {/* Section: Selected Vehicle */}
      <div className="hud-column">
        <h3>Véhicule Sélectionné</h3>
        {selectedVehicle ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <strong>ID :</strong> {selectedVehicle.id || "N/A"}
            </li>
            <li>
              <strong>Type :</strong> {selectedVehicle.type || "N/A"}
            </li>
            <li>
              <strong>Position :</strong> x: {selectedVehicle.position?.x.toFixed(2) || "N/A"}, y:{" "}
              {selectedVehicle.position?.y.toFixed(2) || "N/A"}, z: {selectedVehicle.position?.z.toFixed(2) || "N/A"}
            </li>
            <li>
              <strong>Tuile Cible :</strong> {selectedVehicle.targetTile || "N/A"}
            </li>
          </ul>
        ) : (
          <p>Aucun véhicule sélectionné</p>
        )}
      </div>

      {/* Section: Indicators */}
      <div className="hud-column">
        <h3>Indicateurs</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <strong>Carburant:</strong> {targetFuel}%
          </li>
          <li>
            <strong>Dommages:</strong> {targetDamage}%
          </li>
          <li>
            <strong>Ressources Véhicule Cible:</strong>
            <ul>
              <li>
                <strong>Nourriture:</strong> {targetVehicleResources.food}
              </li>
              <li>
                <strong>Débris:</strong> {targetVehicleResources.debris}
              </li>
              <li>
                <strong>Spécial:</strong> {targetVehicleResources.special}
              </li>
            </ul>
          </li>
          <li>
            <strong>Ressources Joueur:</strong>
            <ul>
              <li>
                <strong>Nourriture:</strong> {playerResources.food}
              </li>
              <li>
                <strong>Débris:</strong> {playerResources.debris}
              </li>
              <li>
                <strong>Spécial:</strong> {playerResources.special}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserHUD;
