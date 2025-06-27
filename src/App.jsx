import React, { useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import XStateSimulationPanel from "./components/Debug/XStateSimulationPanel";
import "./styles/App.css";
import  useXFSMStore  from './stores/useXFSMStore';

const App = () => {
  const addBot = useXFSMStore((state) => state.addBot);
  
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
        </div>
        
        {/* Panneau de simulation XState */}
        <XStateSimulationPanel botId="bot-0" />
      </div>
  );
};

export default App;
