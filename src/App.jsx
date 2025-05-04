import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import PlayerHUD from "./components/PlayerHUD"; // Remplacement de UserHUD par PlayerHUD
import VehicleSelector from "./components/VehicleSelector";
import MessageSelector from "./components/MessageSelector";
import Clock from "./components/Clock";
import BotControls from "./components/BotControls"; // Utilisation de BotControls (mis à jour)
import BotHUD from "./components/BotHUD"; // BotHUD (ancien SimpleUserHUD)
import TileHUD from "./components/TileHUD"; // Import de notre nouveau composant TileHUD

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

      {/* Bot Controls - Utilisation de la classe CSS au lieu du style inline */}
      <div className="bot-controls-position">
        <BotControls />
      </div>

      {/* BotHUD - Utilisation de la classe CSS au lieu du style inline */}
      <div className="bot-hud-position">
        <BotHUD />
      </div>

      {/* PlayerHUD - Nouvelle position pour le HUD du joueur 1 */}
      <div className="player-hud-position">
        <PlayerHUD />
      </div>

      {/* Main content area */}
      <div className="main-content">
        <div className="canvas-container">
          <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <Scene />
          </Canvas>
          
          {/* TileHUD - S'affiche lors du survol d'une tuile */}
          <TileHUD />
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={isTimerRunning} />
        </div>
      </div>
    </div>
  );
};

export default App;
