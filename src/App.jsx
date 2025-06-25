import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import Clock from "./components/HUD/Clock";
import TileStoreMonitor from "./components/HUD/TileStoreMonitor";


// ============= COMPOSANTS FSM =============
import FusedBotManagerHUD from "./components/FSM/FusedBotManagerHUD";
import useFSMStore from "./stores/useFSMStore/index.js";
import { FSMProvider } from "./ai/fsm/contexts/FSMContext.jsx";
import { FSMSyncProvider } from "./ai/fsm/contexts/FSMSyncContext.jsx";
import CentralFSMHud from './components/HUD/CentralFSMHud';
import BotInstanceXStateTest from './components/FSM/BotInstanceXStateTest.jsx';



const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showFleetExample, setShowFleetExample] = useState(false);
  
  // Initialiser le store FSM avec des bots par défaut
  const { setBots, getBotCount } = useFSMStore();
  
  useEffect(() => {
    // Initialiser avec 2 bots par défaut si aucun bot n'est présent
    if (getBotCount() === 0) {
      setBots(['bot-0', 'bot-1']);
    }
  }, [setBots, getBotCount]);
  
  return (
    <FSMProvider>
      <FSMSyncProvider>
        <div className="app-container">
        {/* Bouton pour basculer vers FleetExample */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000
        }}>
          <button
            onClick={() => setShowFleetExample(!showFleetExample)}
            style={{
              padding: '10px 20px',
              backgroundColor: showFleetExample ? '#ff4444' : '#4444ff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}
          >
            {showFleetExample ? '🏠 Scène Principale' : '🤖 Demo FSM → Fleet'}
          </button>
        </div>

          <>
            {/* Main content area */}
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
          </>
   

        {/* ============= SYSTÈME FSM ============= */}
        {/* HUD Fusionné - Gestion et debug des bots FSM */}
        <FusedBotManagerHUD />
        
        {/* Tile Store Monitor - réactivé pour diagnostic complémentaire */}
        <TileStoreMonitor 
          position="top-left"
          isVisible={true}
        />

        {/* HUD FSM Centralisé */}
        <CentralFSMHud />

        {/* Test XState Bot Instance */}
        <BotInstanceXStateTest />

      </div>
    </FSMSyncProvider>
    </FSMProvider>
  );
};

export default App;
