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

        {/* Simple User HUD */}
        <SimpleUserHUD />

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
        
        {/* Learning Info Box */}
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
          <p>Cette vue simplifiée implémente une machine à états finis (FSM) minimale avec seulement deux états :</p>
          <ul>
            <li><strong>IDLE</strong> - Le bot ne fait rien</li>
            <li><strong>EXPLORING</strong> - Le bot se déplace aléatoirement</li>
          </ul>
          <p>Utilisez les contrôles pour basculer entre les états et observer le comportement.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;