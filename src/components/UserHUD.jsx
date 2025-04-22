import React from "react";
import { useTileStore } from "../store/useTileStore"; // Import Zustand store
import "../styles/App.css"; // Import CSS for styling

const UserHUD = () => {
  const selectedTile = useTileStore((state) => state.selectedTile); // Read selectedTile from the store

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
        {/* Add content for Mouvement */}
      </div>
      <div className="hud-column">
        <h3>Indicateur</h3>
        {/* Add content for Indicateur */}
      </div>
    </div>
  );
};

export default UserHUD;
