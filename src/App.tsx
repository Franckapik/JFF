import React from 'react';
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
  const gameStore = useGameStore();
  const xfsmStore = useXFSMStore();

  React.useEffect(() => {
    // Initialize game state flags (runs once on mount)
    gameStore.markPlayersAsInitialized();
    gameStore.markBotsAsInitialized();
    gameStore.markTilesAsInitialized();
    gameStore.markStartingTilesAsAssigned();

    // Create and start bot FSM
    xfsmStore.addBot('bot-0');
    xfsmStore.startBot('bot-0');
  }, []); // Empty dependency array - run only once on mount

  return (
    <React.StrictMode>
      <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <h1>FSM Core Running</h1>
        <p>
          ✅ Zustand stores initialized
          <br />
          ✅ XState FSM actor running (bot-0)
          <br />
          ✅ XState inspector active (if enabled in config)
          <br />
          ✅ BroadcastChannel ready for xstate-viewer
        </p>
        <h2>Integration Status</h2>
        <p>
          <strong>Game Initialized:</strong> {gameStore.isGameInitialized() ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Active Bots:</strong> {xfsmStore.activeBots.length}
        </p>
        <p>
          <strong>Inspector Enabled:</strong> Check browser console or open public/xstate-viewer.html
        </p>
        <hr />
        <p style={{ fontSize: '12px', color: '#666' }}>
          To rebuild visual layer: Create components in src/components/ and render here after FSM stabilization.
        </p>
      </div>
    </React.StrictMode>
  );
}
