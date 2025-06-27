import React from 'react';
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import XStateSimulationPanel from "./components/Debug/XStateSimulationPanel";
import "./styles/App.css";

const App = () => {
  return (
      <div className="app-container">
        {/* Interface principale restaurée */}
        <div className="main-content">
          <div className="canvas-container">
            <Canvas>
              <Scene />
            </Canvas>
          </div>
        </div>
        
        {/* Panneau de simulation XState */}
        <XStateSimulationPanel botId="bot-0" />
      </div>
  );
};

export default App;
