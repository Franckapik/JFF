import React from "react";
import "../styles/App.css"; // Import CSS for styling

const HUD = ({ selectedTile, hud }) => {
  return (
    <div className="hud">
      {selectedTile !== null ? (
        <>
          <div>Tuile sélectionnée :</div>
          <div>Index: {selectedTile.index}</div>
          <div>
            Position: ({selectedTile.position.x.toFixed(2)}, {selectedTile.position.y.toFixed(2)}, {selectedTile.position.z.toFixed(2)})
          </div>
          <div>Coordonnées: (r: {selectedTile.coordinates.r}, q: {selectedTile.coordinates.q})</div>
          <div>Walkable: {selectedTile.walkable ? "Oui" : "Non"}</div>
          <div>Explored: {selectedTile.explored ? "Oui" : "Non"}</div>
        </>
      ) : (
        "Cliquez sur une tuile"
      )}
      {hud && hud.path && (
        <>
          <div>Chemin :</div>
          {hud.path.length > 0 ? (
            hud.path.map((point, index) => (
              <div key={index}>
                Point {index + 1}: ({point.x.toFixed(2)}, {point.y.toFixed(2)}, {point.z.toFixed(2)})
              </div>
            ))
          ) : (
            <div>Aucun chemin défini</div>
          )}
        </>
      )}
    </div>
  );
};

export default HUD;
