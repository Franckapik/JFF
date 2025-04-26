import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import StoreHUD from "./components/StoreHUD";
import UserHUD from "./components/UserHUD";
import VehicleSelector from "./components/VehicleSelector"; // Import VehicleSelector
import MessageSelector from "./components/MessageSelector"; // Import MessageSelector
import Clock from "./components/Clock"; // Import Clock
import BotManager from "./managers/BotManager"; // Import BotManager
import { useTileStore } from "./stores/useNewTileStore"; // Import tile store

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const botManager = BotManager(); // Initialize BotManager
  const tiles = useTileStore((state) => state.tiles); // Access tiles

  useEffect(() => {
    // Wait for tiles to be initialized before starting the bot
    if (Object.keys(tiles).length > 0) {
      botManager.performAction(); // Start the bot's first action
    }
  }, [tiles, botManager]);

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
        <UserHUD />
        <StoreHUD />
        <div className="canvas-container">
          <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <Scene />
          </Canvas>
        </div>
      </div>

      {/* Clock HUD */}
      <div className="clock-hud">
        <Clock isTimerRunning={isTimerRunning} />
      </div>
    </div>
  );
};

export default App;
