import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
// import VehicleSelector from "./components/HUD/VehicleSelector"; // Commenté car non utile pour l'instant
import MessageSelector from "./components/Messagerie/MessageSelector";
import Clock from "./components/HUD/Clock";
import BotDebugger from "./components/HUD/BotDebugger";
import MultiBotManager from "./components/MultiBotManager";

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

      {/* New container for MessageSelector */}
      <div className="message-selector-container">
        <MessageSelector />
      </div>

      {/* Main content area */}
      <div className="main-content">
        <div className="canvas-container">
          <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <Scene />
          </Canvas>
          
          {/* BotControls supprimé pour laisser les bots fonctionner automatiquement */}
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={isTimerRunning} />
        </div>
      </div>
      
      {/* Bot Debugger - maintenant à l'opposé de BotControls */}
      <div style={{ position: 'absolute', top: '0', right: '0', height: '100vh', zIndex: 1000 }}>
        <BotDebugger />
      </div>

      {/* MultiBotManager - gère automatiquement les bots */}
      <MultiBotManager />
    </div>
  );
};

export default App;
