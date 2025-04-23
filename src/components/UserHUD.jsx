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
  const randomVehicleStartCoord = useTileStore((state) => state.randomVehicleStartCoord); // Get random vehicle start coord
  const targetVehicleStartCoord = useTileStore((state) => state.targetVehicleStartCoord); // Get target vehicle start coord
  const targetFuel = useTileStore((state) => state.targetFuel); // Get targetFuel from the store
  const targetDamage = useTileStore((state) => state.targetDamage); // Get targetDamage from the store
  const targetVehicleResources = useTileStore((state) => state.targetVehicleResources); // Get target vehicle resources

  return (
    <div className="user-hud">
      <div className="hud-column">
        <h3>Selection</h3>
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
              <strong>Coordinates :</strong> q: {tile.coordinates?.q || "N/A"}, r:{" "}
              {tile.coordinates?.r || "N/A"}
            </li>
            <li>
              <strong>Walkable :</strong> {tile.walkable ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Explored :</strong> {tile.explored ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Danger :</strong> {tile.danger ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Outer :</strong> {tile.outer ? "Oui" : "Non"}
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
      <div className="hud-column">
        <h3>Mouvement</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <strong>Random Vehicle:</strong>
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
                <strong>Is Moving:</strong> {randomVehicleIsMoving ? "Yes" : "No"}
              </li>
              <li>
                <strong>Start Coord:</strong> {randomVehicleStartCoord || "N/A"}
              </li>
            </ul>
          </li>
          <li>
            <strong>Target Vehicle:</strong>
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
                <strong>Is Moving:</strong> {targetVehicleIsMoving ? "Yes" : "No"}
              </li>
              <li>
                <strong>Progress:</strong> {targetVehicleProgress}%
              </li>
              <li>
                <strong>Start Coord:</strong> {targetVehicleStartCoord || "N/A"}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="hud-column">
        <h3>Indicateur</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <strong>Fuel:</strong> {targetFuel}%
          </li>
          <li>
            <strong>Damage:</strong> {targetDamage}%
          </li>
          <li>
            <strong>Resources:</strong>
            <ul>
              <li>
                <strong>Food:</strong> {targetVehicleResources.food}
              </li>
              <li>
                <strong>Debris:</strong> {targetVehicleResources.debris}
              </li>
              <li>
                <strong>Special:</strong> {targetVehicleResources.special}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserHUD;
