import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import HUD from "./components/HUD"; // Import the HUD component
import "./styles/App.css";
import StoreHUD from "./components/storeHUD"; // Import the StoreHUD component

const App = () => {
  const [selectedTile, setSelectedTile] = useState(null); // Tile object containing index, position, and coordinates

  return (
    <>
      <HUD selectedTile={selectedTile} /> {/* Use the HUD component */}
      <StoreHUD />
      <div className="canvas-container">
        <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
{/*           <OrbitControls makeDefault />
 */}          <Scene setSelectedTile={setSelectedTile} />
        </Canvas>
      </div>
    </>
  );
};

export default App;
