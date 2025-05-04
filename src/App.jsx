import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import UserHUD from "./components/UserHUD";
import VehicleSelector from "./components/VehicleSelector";
import MessageSelector from "./components/MessageSelector";
import Clock from "./components/Clock";
import BotControls from "./components/BotControls"; // Utilisation de BotControls (mis à jour)
import BotHUD from "./components/BotHUD"; // BotHUD (ancien SimpleUserHUD)

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

      {/* Bot Controls - Mis à jour avec le style inline de SimpleApp */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        zIndex: 1000 
      }}>
        <BotControls />
      </div>

      {/* BotHUD - Renommé de SimpleUserHUD à BotHUD */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        zIndex: 1000 
      }}>
        <BotHUD />
      </div>

      {/* Main content area */}
      <div className="main-content">
        <UserHUD />
        <div className="canvas-container">
          <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <Scene />
          </Canvas>
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={isTimerRunning} />
        </div>
        
        {/* Learning Info Box - Ajouté depuis SimpleApp */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '5px',
          maxWidth: '400px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}>
          <h3>FSM Learning Mode</h3>
          <p>Cette vue simplifiée implémente une machine à états finis (FSM) avec quatre états :</p>
          <ul>
            <li><strong>IDLE</strong> - Le bot ne fait rien</li>
            <li><strong>COLLECTING</strong> - Le bot se déplace aléatoirement pour collecter des ressources</li>
            <li><strong>EXPLORING</strong> - Le bot utilise son drone (magenta) pour explorer les tuiles à distance</li>
            <li><strong>RETURNING</strong> - Le bot retourne à sa base quand le carburant est inférieur à 50%</li>
          </ul>
          <p>L'état initial est COLLECTING. Conditions de transition principales:</p>
          <ul>
            <li>Le bot passe en mode RETURNING lorsque son carburant passe sous 50%</li>
            <li>Après ravitaillement à 100%, le bot passe en mode EXPLORING et utilise son drone</li>
          </ul>
          <p>Les drones (violet pour joueur 1, magenta pour le bot) suivent leurs vaisseaux respectifs et peuvent explorer les tuiles pour envoyer des informations sur les ressources.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
