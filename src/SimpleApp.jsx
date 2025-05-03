import React from "react";
import { Canvas } from "@react-three/fiber";
import SimpleScene from "./components/SimpleScene";
import "./styles/App.css";
import SimpleUserHUD from "./components/SimpleUserHUD";
import SimpleBotControls from "./components/SimpleBotControls";
import Clock from "./components/Clock";

const SimpleApp = () => {
  return (
    <div className="app-container">
      <div className="main-content">
        {/* Simple Bot Controls */}
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          zIndex: 1000 
        }}>
          <SimpleBotControls />
        </div>

        {/* Simple User HUD - Ajout du conteneur avec position absolue */}
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          zIndex: 1000 
        }}>
          <SimpleUserHUD />
        </div>

        {/* 3D Scene */}
        <div className="canvas-container">
          <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
            <SimpleScene />
          </Canvas>
        </div>
        
        {/* Clock HUD */}
        <div className="clock-hud">
          <Clock isTimerRunning={true} />
        </div>
        
        {/* Learning Info Box - Mise à jour pour inclure l'EXPLORING avec drone */}
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

export default SimpleApp;