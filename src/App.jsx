import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
// import VehicleSelector from "./components/HUD/VehicleSelector"; // Commenté car non utile pour l'instant
import Clock from "./components/HUD/Clock";


// ============= COMPOSANTS FSM =============
import MultiBotManagerFSM from "./components/FSM/MultiBotManagerFSM";
import FSMDebugPanel from "./components/FSM/FSMDebugPanel";
import BotDebuggerNew from "./components/HUD/BotDebugger";

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // Liste des bots pour FSM
  const botIds = ['bot-0', 'bot-1'];
  
  return (
    <div className="app-container">
      {/* Selector container for VehicleSelector - retiré car non utile pour l'instant */}
      {/* 
      <div className="selector-container">
        <VehicleSelector />
      </div>
      */}

            {/* Bot Debugger - positionné à gauche de l'écran */}
      <BotDebuggerNew />



      {/* Main content area */}
      <div className="main-content">
        <div className="canvas-container">
          <Canvas>
            <Scene />
          </Canvas>
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={isTimerRunning} />
        </div>
      </div>

      {/* ============= SYSTÈME FSM ============= */}
      {/* MultiBotManager FSM - gestionnaire principal */}
      <MultiBotManagerFSM />
      
      {/* FSM Debug Panel - panneau de debug */}
      <FSMDebugPanel 
        botIds={botIds}
        position="bottom-left"
        minimizable={true}
      />
    </div>
  );
};

export default App;
