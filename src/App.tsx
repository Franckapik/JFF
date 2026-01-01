import React from 'react';

import { useSimulatedTracker } from './ai/fsm/machineX/hooks/trackers/useSimulatedTracker';
import FSMVisualization from './components/FSMVisualization';
import { config } from './config';
import useGameStore from './stores/useGameStore';
import useXFSMStore from './stores/useXFSMStore';

/**
 * Minimal App component - FSM core only, no visual rendering
 * Initializes Zustand stores and FSM actor for xstate-viewer integration
 * 
 * To view FSM state in real-time:
 * 1. Open http://localhost:5173 in browser
 * 2. Open public/xstate-viewer.html in another tab
 * 3. Both tabs will sync via BroadcastChannel
 */
export default function App() {
  // Get bot actor from store for tracker
  const getActor = useXFSMStore((state) => state.getActor);
  const [botActor, setBotActor] = React.useState<ReturnType<typeof getActor>>(null);

  // Initialize on mount (one-time setup, no dependencies needed)
  React.useEffect(() => {
    const gameStore = useGameStore.getState();
    const xfsmStore = useXFSMStore.getState();

    // Initialize game state flags
    gameStore.markPlayersAsInitialized();
    gameStore.markBotsAsInitialized();
    gameStore.markTilesAsInitialized();
    gameStore.markStartingTilesAsAssigned();

    // Create and start bot FSM
    xfsmStore.addBot('bot-0');
    xfsmStore.startBot('bot-0');
    
    // Get actor for tracker
    const actor = xfsmStore.getActor('bot-0');
    setBotActor(actor);
  }, []);

  // Activate simulated tracker in test mode
  useSimulatedTracker(botActor, { 
    verbose: config.enableVerboseTracking,
    enabled: config.testMode 
  });

  return (
    <React.StrictMode>
      <FSMVisualization />
    </React.StrictMode>
  );
}
