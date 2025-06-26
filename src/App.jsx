import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import Clock from "./components/HUD/Clock";
import TileStoreMonitor from "./components/HUD/TileStoreMonitor";

// ============= COMPOSANTS FSM =============
import FusedBotManagerHUD from "./components/FSM/FusedBotManagerHUD";
// import CentralFSMHud from './components/HUD/CentralFSMHud';
import BotInstanceXStateTest from './components/FSM/BotInstanceXStateTest.jsx';
import { useCentralFSMStore } from './stores/useCentralFSMStore';

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const addBot = useCentralFSMStore((state) => state.addBot);
  
  // Créer le bot drone_1 au chargement de l'application
  useEffect(() => {
    // console.log('[App] Creating drone_1 bot...'); // Debug log désactivé
    addBot('drone_1');
  }, [addBot]);
  
  return (
      <div className="app-container">
        {/* Interface principale restaurée */}
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
        {/* HUD Fusionné - Gestion et debug des bots FSM */}
        <FusedBotManagerHUD />
        
        {/* TileStoreMonitor */}
        <TileStoreMonitor 
          position="top-left"
          isVisible={true}
        />

        {/* Tests FSM - masqués maintenant que tout fonctionne (décommentez si besoin) */}
        {/* 
        <div style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
          <h2>FSM Test Components (for validation)</h2>
          <BotInstanceXStateTest botId="main" label="Main Bot" />
          <BotInstanceXStateTest botId="drone_1" label="Drone #1" />
        </div>
        */}
        

      </div>
  );
};

export default App;
