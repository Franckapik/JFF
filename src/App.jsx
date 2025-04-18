import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import "./styles/App.css"; // Import du fichier CSS

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(null); // Index de la tuile sélectionnée

  return (
    <>
      {/* HUD pour afficher l'index de la tuile cliquée */}
      <div className="hud">
        {selectedIndex !== null ? `Tuile sélectionnée : ${selectedIndex}` : "Cliquez sur une tuile"}
      </div>
      <div className="canvas-container">
        <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
          <OrbitControls makeDefault />
          <Scene setSelectedIndex={setSelectedIndex} />
        </Canvas>
      </div>
    </>
  );
};

export default App;
