import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import VehicleSelector from "./components/HUD/VehicleSelector";
import MessageSelector from "./components/Messagerie/MessageSelector";
import Clock from "./components/HUD/Clock";
import TileHUD from "./components/HUD/TileHUD";
import CollapsibleHUD from "./components/HUD/CollapsibleHUD";
import BotDebugger from "./components/HUD/BotDebugger";

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  return (
    <div className="app-container">
      {/* Selector container for VehicleSelector */}
      <div className="selector-container">
        <VehicleSelector />
      </div>

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
          
          {/* TileHUD avec CollapsibleHUD */}
          <div className="tile-hud-wrapper">
            <CollapsibleHUD title="Tile Information" defaultOpen={false}>
              <TileHUD />
            </CollapsibleHUD>
          </div>
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={isTimerRunning} />
        </div>
      </div>
      
      {/* Bot Debugger - toujours affiché */}
      <BotDebugger />
    </div>
  );
};

export default App;
