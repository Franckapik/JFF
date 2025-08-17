import { Canvas } from "@react-three/fiber";
import React from 'react';

import Scene from "./components/Scene.tsx";
import "./styles/App.css";


const App: React.FC = () => {
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
{/*         <XStateSimulationPanel botId="bot-0" />
 */}      </div>
  );
};

export default App;
