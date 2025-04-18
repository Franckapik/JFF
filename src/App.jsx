import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import "./styles/App.css"; // Import du fichier CSS

const App = () => {
  const [selectedTile, setSelectedTile] = useState(null); // Tile object containing index, position, and coordinates

  return (
    <>
      {/* HUD pour afficher l'index, la position, les coordonnées r/q, walkable et explored de la tuile cliquée */}
      <div className="hud">
        {selectedTile !== null
          ? `Tuile sélectionnée : Index ${selectedTile.index}, Position (${selectedTile.position.x.toFixed(2)}, ${selectedTile.position.y.toFixed(2)}, ${selectedTile.position.z.toFixed(2)}), Coordonnées (r: ${selectedTile.coordinates.r}, q: ${selectedTile.coordinates.q}), Walkable: ${selectedTile.walkable}, Explored: ${selectedTile.explored}`
          : "Cliquez sur une tuile"}
      </div>
      <div className="canvas-container">
        <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
          <OrbitControls makeDefault />
          <Scene setSelectedTile={setSelectedTile} />
        </Canvas>
      </div>
    </>
  );
};

export default App;
