import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
// import VehicleSelector from "./components/HUD/VehicleSelector"; // Commenté car non utile pour l'instant
import MessageSelector from "./components/Messagerie/MessageSelector";
import Clock from "./components/HUD/Clock";
import BotDebugger from "./components/HUD/BotDebugger";
import BotControls from "./components/HUD/BotControls"; 
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
          
          
          {/* BotControls - repositionné à gauche avec hauteur 100% */}
          <div className="bot-controls-wrapper" style={{ 
            position: 'absolute',
            top: '0',
            left: '0',
            height: '100%',
            width: '330px',
            backgroundColor: 'rgba(245, 245, 245, 0.95)',
            zIndex: 1000,
            overflowY: 'auto',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.2)'
          }}>
            <BotControls />
          </div>
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
    </div>
  );
};

export default App;
