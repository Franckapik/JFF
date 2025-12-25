import React from 'react';

import FSMVisualization from './components/FSMVisualization';
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
  // Initialize on mount (one-time setup, no dependencies needed)
  // Force recompile trigger
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
  }, []);

  return (
    <React.StrictMode>
      <FSMVisualization />
    </React.StrictMode>
  );
}
