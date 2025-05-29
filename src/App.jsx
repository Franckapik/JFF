import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
// import VehicleSelector from "./components/HUD/VehicleSelector"; // Commenté car non utile pour l'instant
import Clock from "./components/HUD/Clock";
import BotDebugger from "./components/HUD/BotDebugger";
import MultiBotManager from "./components/MultiBotManager";
import MyFSMComponent from "./components/MyFSMComponent"; // Added import

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // La gestion des bots est maintenant déléguée au MultiBotManager
  
  return (
    <div className="app-container">
      {/* Selector container for VehicleSelector - retiré car non utile pour l'instant */}
      {/* 
      <div className="selector-container">
        <VehicleSelector />
      </div>
      */}



      {/* Main content area */}
      <div className="main-content">
        <div className="canvas-container">
          <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <Scene />
          </Canvas>
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={isTimerRunning} />
        </div>
      </div>

      {/* Bot Debugger - positionné à gauche de l'écran */}
      <BotDebugger />

      {/* MultiBotManager - gère automatiquement les bots */}
      <MultiBotManager />

      {/* MyFSMComponent - for quick FSM implementation */}
      <MyFSMComponent />
    </div>
  );
};

export default App;
