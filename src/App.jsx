import React, { useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import Clock from "./components/HUD/Clock";
import TileStoreMonitor from "./components/HUD/TileStoreMonitor";

// ============= COMPOSANTS FSM =============
import FSMHUD from "./components/FSM/FSMHUD";
import FSMHUDFixed from "./components/FSM/FSMHUDFixed";
import FusedBotManagerHUDFixed from "./components/FSM/FusedBotManagerHUDFixed";
import CentralFSMHudFixed from './components/HUD/CentralFSMHudFixed';
import StoreTestMinimal from './components/FSM/StoreTestMinimal';
import BotInstanceXStateTest from './components/FSM/BotInstanceXStateTest.jsx';
import { useFSMStore } from './stores/useFSMStoreXState';

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const addBot = useFSMStore((state) => state.addBot);
  
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

        
        {/* FSM HUDs - Versions corrigées pour éviter les boucles infinies */}
        <FSMHUDFixed />
        <FusedBotManagerHUDFixed />
        <CentralFSMHudFixed />
        
        {/* FSMHUD Original - DÉSACTIVÉ CAR BOUCLE INFINIE */}
        {/* <FSMHUD /> */}
        
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
