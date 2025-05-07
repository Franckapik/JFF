import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import PlayerHUD from "./components/PlayerHUD";
import VehicleSelector from "./components/VehicleSelector";
import MessageSelector from "./components/MessageSelector";
import Clock from "./components/Clock";
import BotControls from "./components/BotControls";
import BotHUD from "./components/BotHUD";
import TileHUD from "./components/TileHUD";
import CollapsibleHUD from "./components/CollapsibleHUD";
import BotDebugger from "./components/BotDebugger"; // Importation du BotDebugger

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

      {/* Bot Controls avec CollapsibleHUD - à droite */}
      <div className="bot-hud-wrapper">
        <CollapsibleHUD title="Bot Controls" defaultOpen={false}>
          <BotControls />
        </CollapsibleHUD>
      </div>

      {/* Bot HUD à gauche */}
      <div className="player-hud-wrapper">
        <CollapsibleHUD title="Bot Status" defaultOpen={true}>
          <BotHUD />
        </CollapsibleHUD>
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
          
          {/* PlayerHUD déplacé en bas à gauche */}
          <div className="player-hud-wrapper" style={{ top: 'auto', bottom: '10px', left: '10px' }}>
            <CollapsibleHUD title="Player Status" defaultOpen={false}>
              <PlayerHUD />
            </CollapsibleHUD>
          </div>
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={isTimerRunning} />
        </div>
      </div>
      
      {/* Bot Debugger - ajouté pour visualiser l'état de la FSM du bot */}
      <BotDebugger />
    </div>
  );
};

export default App;
