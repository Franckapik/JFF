import React from 'react';

import { useMultiSimulatedTracker, type BotActor } from './ai/fsm/machineX/hooks/trackers/useMultiSimulatedTracker';
import FSMVisualization from './components/FSMVisualization';
import { config } from './config';
import { useDangerMovement } from './hooks/useDangerMovement';
import useBotSelectionStore from './stores/useBotSelectionStore';
import useGameStore from './stores/useGameStore';
import { useTileStore } from './stores/useTileStore';
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
  const [botActors, setBotActors] = React.useState<BotActor[]>([]);

  // Initialize on mount (one-time setup, no dependencies needed)
  React.useEffect(() => {
    try {
      // 🔗 Initialize view mode from URL parameter
      const botSelectionStore = useBotSelectionStore.getState();
      botSelectionStore.initializeFromUrl();
      console.log('🔗 [App] View mode initialized from URL:', botSelectionStore.selectedView);

      const gameStore = useGameStore.getState();
      const tileStore = useTileStore.getState();
      const xfsmStore = useXFSMStore.getState();

      // ✅ STEP 1: Generate seed for deterministic map generation
      const seed = gameStore.generateSeed();
      console.log('🎲 [App] Map seed generated:', seed);

      // ✅ STEP 2: Generate tiles with seed (base grid only, no special tiles yet)
      const radius = 3;
      const spacing = -0.2;
      const generatedTiles = tileStore.initializeGameGrid(radius, spacing, seed);
      tileStore.setTiles(generatedTiles);
      
      console.log('🎲 [App] Tiles generated:', {
        tilesCount: Object.keys(generatedTiles).length,
        radius,
        spacing,
        seed,
        tileCoords: Object.keys(generatedTiles).slice(0, 5)
      });

      // ✅ STEP 3: Initialize game state flags (except starting tiles)
      gameStore.markPlayersAsInitialized();
      gameStore.markBotsAsInitialized();
      gameStore.markTilesAsInitialized();
      // Note: markStartingTilesAsAssigned() will be called after tile assignment

      // ✅ STEP 4: Create bots FSM (will now read tiles from tileStore)
      xfsmStore.addBot('bot-0');
      xfsmStore.addBot('bot-1');
      
      // ✅ STEP 5: Assign starting tiles with fairness validation
      // This will: place spawns with fairness checks, then obstacles/danger/stations
      console.log('🎯 [App] Starting fairness-aware tile assignment...');
      
      tileStore.assignStartingTiles(['bot-0', 'bot-1'], seed);
      
      const tilesAfterAssignment = tileStore.tiles;
      const departTiles = Object.values(tilesAfterAssignment).filter(t => t.type === 'depart');
      console.log('🎯 [App] Fairness assignment complete:', {
        departTilesCount: departTiles.length,
        departTileCoords: departTiles.map(t => t.position.coord),
        assignedBots: departTiles.map(t => t.assignedToBot)
      });
      
      gameStore.markStartingTilesAsAssigned();
      xfsmStore.startBot('bot-0');
      xfsmStore.startBot('bot-1');
      
      // Get actors for multi-bot tracker
      const actor0 = xfsmStore.getActor('bot-0');
      const actor1 = xfsmStore.getActor('bot-1');
      
      const actors: BotActor[] = [];
      if (actor0) actors.push({ botId: 'bot-0', actor: actor0 });
      if (actor1) actors.push({ botId: 'bot-1', actor: actor1 });
      
      setBotActors(actors);
      
      console.log('🤖 [App] Multi-bot tracker initialized:', {
        bot0: !!actor0,
        bot1: !!actor1,
        totalBots: actors.length
      });
    } catch (error) {
      console.error('❌ [App] Initialization error:', error);
      console.error('❌ [App] Stack trace:', error?.stack);
    }
  }, []);

  // Activate multi-bot simulated tracker in test mode
  useMultiSimulatedTracker(botActors, { 
    verbose: config.enableVerboseTracking,
    enabled: config.testMode 
  });

  // 🔥 Activate dynamic danger movement system
  useDangerMovement();

  return (
    <React.StrictMode>
      <FSMVisualization />
    </React.StrictMode>
  );
}
