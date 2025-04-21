import React from "react";
import "../styles/App.css"; // Import CSS for styling

const HUD = ({ selectedTile }) => {
  if (!selectedTile) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 10,
          left: 10,
          background: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <strong>Aucune tuile sélectionnée</strong>
      </div>
    );
  }

  const { coord, position, coordinates, walkable, explored, danger, neighbors } = selectedTile;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: 10,
        background: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <strong>Tuile sélectionnée :</strong>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <strong>Coord :</strong> {coord}
        </li>
        <li>
          <strong>Position :</strong> x: {position.x.toFixed(2)}, y: {position.y.toFixed(2)}, z:{" "}
          {position.z.toFixed(2)}
        </li>
        <li>
          <strong>Coordinates :</strong> q: {coordinates.q}, r: {coordinates.r}
        </li>
        <li>
          <strong>Walkable :</strong> {walkable ? "Oui" : "Non"}
        </li>
        <li>
          <strong>Explored :</strong> {explored ? "Oui" : "Non"}
        </li>
        <li>
          <strong>Danger :</strong> {danger ? "Oui" : "Non"}
        </li>
        <li>
          <strong>Neighbors :</strong> {neighbors.join(", ")}
        </li>
      </ul>
    </div>
  );
};

export default HUD;
