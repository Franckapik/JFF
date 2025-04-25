import React from "react";
import { useTileStore } from "../stores/useNewTileStore"; // Import tile store
import usePlayerStore from "../stores/usePlayerStore"; // Import player store
import "../styles/App.css"; // Import CSS for styling

const UserHUD = () => {
  const selectedTileCoord = useTileStore((state) => state.selectedTile); // Get the selected tile's coordinate
  const tile = useTileStore((state) => (selectedTileCoord ? state.tiles[selectedTileCoord] : null)); // Fetch the full tile data
  const ship = usePlayerStore((state) => state.players.player1.vehicles.ship); // Get ship data
  const selectedVehicleId = usePlayerStore((state) => state.players.player1.vehicles.selectedVehicle); // Get selected vehicle ID
  const drones = usePlayerStore((state) => state.players.player1.vehicles.drones); // Get drones
  const playerResources = usePlayerStore((state) => state.players.player1.score.ressources); // Get player resources

  const selectedVehicle =
    selectedVehicleId === "ship"
      ? ship
      : drones.find((drone) => drone.id === selectedVehicleId) || null; // Determine the selected vehicle

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
            <strong>Véhicule Cible (Ship):</strong>
            <ul>
              <li>
                <strong>Position:</strong>{" "}
                {ship.position
                  ? `x: ${ship.position.x.toFixed(2)}, y: ${ship.position.y.toFixed(
                      2
                    )}, z: ${ship.position.z.toFixed(2)} (Coord: ${ship.coord})`
                  : "N/A"}
              </li>
              <li>
                <strong>En Mouvement:</strong> {ship.isMoving ? "Oui" : "Non"}
              </li>
              <li>
                <strong>Progression:</strong> {ship.progress}%
              </li>
              <li>
                <strong>Carburant:</strong> {ship.fuel}%
              </li>
              <li>
                <strong>Dommages:</strong> {ship.damage}%
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
              <strong>Type :</strong> {selectedVehicle.id === "ship" ? "Ship" : "Drone"}
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

      {/* Section: Player Resources */}
      <div className="hud-column">
        <h3>Ressources Joueur</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
      </div>
    </div>
  );
};

export default UserHUD;
