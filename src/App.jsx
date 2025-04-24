import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import StoreHUD from "./components/StoreHUD";
import UserHUD from "./components/UserHUD";
import VehicleSelector from "./components/VehicleSelector"; // Import VehicleSelector
import MessageSelector from "./components/MessageSelector"; // Import MessageSelector

const App = () => {
  return (
    <div className="app-container">
      {/* Selector container for VehicleSelector and MessageSelector */}
      <div className="selector-container">
        <VehicleSelector />
        <MessageSelector /> {/* Add the MessageSelector below the VehicleSelector */}
      </div>

      {/* Main content area */}
      <div className="main-content">
        <UserHUD />
        <StoreHUD />
        <div className="canvas-container">
          <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <Scene />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default App;
