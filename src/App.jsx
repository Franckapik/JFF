import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import VehicleSelector from "./components/HUD/VehicleSelector";
import MessageSelector from "./components/Messagerie/MessageSelector";
import Clock from "./components/HUD/Clock";
import TileHUD from "./components/HUD/TileHUD";
import CollapsibleHUD from "./components/HUD/CollapsibleHUD";
import BotDebugger from "./components/HUD/BotDebugger";
import useBotStore from "./stores/useBotStore";

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // Récupération du processBot depuis le store
  const processBot = useBotStore((state) => state.processBot);
  const isRunning = useBotStore((state) => state.isRunning);

  // Utilisation de useEffect avec setInterval pour le traitement du bot
  useEffect(() => {
    // Ne créer l'intervalle que si le bot est actif
    if (isRunning) {
      console.log("[App] Starting bot processing with setInterval");
      
      // Créer un intervalle pour exécuter processBot toutes les secondes
      const botInterval = setInterval(() => {
        processBot();
      }, 1000);
      
      // Nettoyage lors du démontage du composant ou lorsque isRunning change
      return () => {
        console.log("[App] Stopping bot processing interval");
        clearInterval(botInterval);
      };
    }
  }, [isRunning, processBot]); // Dépendances: isRunning et processBot
  
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
