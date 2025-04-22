import React from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import "../styles/App.css"; // Import CSS for styling

const UserHUD = () => {
  const selectedTile = useTileStore((state) => state.selectedTile); // Read selectedTile from the store
  const randomVehicle = useTileStore((state) => state.randomVehicle); // Get random vehicle data
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle data
  const randomVehicleIsMoving = useTileStore((state) => state.randomVehicleIsMoving); // Get random vehicle movement status
  const targetVehicleIsMoving = useTileStore((state) => state.targetVehicleIsMoving); // Get target vehicle movement status
  const targetVehicleProgress = useTileStore((state) => state.targetVehicleProgress); // Get target vehicle progress

  return (
    <div className="user-hud">
      <div className="hud-column">
        <h3>Selection</h3>
        {selectedTile ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <strong>Coord :</strong> {selectedTile.coord}
            </li>
            <li>
              <strong>Position :</strong> x: {selectedTile.position.x.toFixed(2)}, y:{" "}
              {selectedTile.position.y.toFixed(2)}, z: {selectedTile.position.z.toFixed(2)}
            </li>
            <li>
              <strong>Coordinates :</strong> q: {selectedTile.coordinates.q}, r:{" "}
              {selectedTile.coordinates.r}
            </li>
            <li>
              <strong>Walkable :</strong> {selectedTile.walkable ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Explored :</strong> {selectedTile.explored ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Danger :</strong> {selectedTile.danger ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Neighbors :</strong> {selectedTile.neighbors.join(", ")}
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
            </ul>
          </li>
        </ul>
      </div>
      <div className="hud-column">
        <h3>Indicateur</h3>
        {/* Add content for Indicateur */}
      </div>
    </div>
  );
};

export default UserHUD;
