import React, { useEffect } from 'react';
// import { Canvas } from "@react-three/fiber";
// import Scene from "./components/Scene";
import "./styles/App.css";
// import Clock from "./components/HUD/Clock";
// import TileStoreMonitor from "./components/HUD/TileStoreMonitor";

// ============= COMPOSANTS FSM =============
// import FusedBotManagerHUD from "./components/FSM/FusedBotManagerHUD";
// import CentralFSMHud from './components/HUD/CentralFSMHud';
import BotInstanceXStateTest from './components/FSM/BotInstanceXStateTest.jsx';
import { useCentralFSMStore } from './stores/useCentralFSMStore';

const App = () => {
  // const [isTimerRunning, setIsTimerRunning] = useState(true);
  const addBot = useCentralFSMStore((state) => state.addBot);
  
  // Créer le bot drone_1 au chargement de l'application
  useEffect(() => {
    console.log('[App] Creating drone_1 bot...');
    addBot('drone_1');
  }, [addBot]);
  
  return (
      <div className="app-container">
        <h1>Minimal Test for FSM Stability</h1>
        <p>
          This view renders only the necessary components to test the FSM store and hook.
          Check the console for logs from `[useCentralFSMStore]`, `[useFSM Minimal]`, and `[BotInstanceXStateTest]`.
          If there are no infinite loops, the core issue is solved.
        </p>
        
        {/* Test avec le bot par défaut ('main') */}
        <BotInstanceXStateTest botId="main" label="Main Bot" />

        {/* Test avec un second bot pour vérifier l'isolation */}
        <BotInstanceXStateTest botId="drone_1" label="Drone #1" />

      </div>
  );
};

export default App;
