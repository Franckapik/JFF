# Multi-Bot System Documentation

This document describes the multi-bot system implementation in the React Three.js game.

## Overview

The multi-bot system allows multiple AI-controlled bots to operate in the game world simultaneously. Each bot has its own state, position, resources, and actions. The system supports two processing modes:

1. **Parallel Mode**: All bots execute actions simultaneously
2. **Sequential Mode**: Only one bot is active at a time, with automatic switching between bots

## Key Components

### Bot Store (useBotStore.js)

The Bot Store is the central state management system for all bots. It maintains:

- The active bot index and ID
- The processing mode (parallel or sequential)
- Each bot's individual state (botState, actionQueue, etc.)
- Functions to switch between bots and processing modes

```javascript
// Key portions of the useBotStore
const useBotStore = create((set, get) => ({
  // State tracking
  botState: BOT_STATES.IDLE,
  isRunning: false,
  currentBotIndex: 0,
  currentBotId: getBotPlayerId(0),
  processingMode: 'parallel', // 'parallel' or 'sequential'
  
  // Bot state storage
  botStates: {}, // Stores individual bot states
  
  // Set processing mode
  setProcessingMode: (mode) => {
    if (mode !== 'parallel' && mode !== 'sequential') {
      fsmLogger.error(`Invalid processing mode: ${mode}`);
      return;
    }
    set({ processingMode: mode });
  },
  
  // Switch active bot
  switchActiveBot: (botIndex) => {
    // Save current bot state
    // Set new bot as active
    // Load saved state for new bot
  }
}));
```

### MultiBotManager.jsx

This component handles the processing logic for multiple bots. It:

- Creates processing loops for parallel or sequential modes
- Manages bot transitions in sequential mode
- Displays visual indicators for the active bot

### MultiBotControls.jsx

This UI component provides controls for the multi-bot system:

- Buttons to switch between bots manually
- Toggle for parallel/sequential processing modes
- Start/stop buttons for all bots
- Status displays for each bot

## Processing Modes

### Parallel Mode

In parallel mode, all bots execute their actions simultaneously. The system:

1. Processes each bot's state machine in turn
2. Executes actions for all bots
3. Updates the visual representation of all bots

### Sequential Mode

In sequential mode, only one bot is active at a time. The system:

1. Activates only the current bot's state machine
2. Switches to the next bot automatically every 5 seconds
3. Shows a visual indicator when switching bots

## Bot State Management

Each bot maintains its own separate state, including:

- Current FSM state (idle, exploring, collecting, returning)
- Action queue
- Resources and position

The system persists each bot's state when switching between bots, allowing them to resume their activities when they become active again.

## Recent Improvements

1. **Fixed Import Issues**:
   - Corrected import paths (e.g., `./useGameStore` instead of `./gameStore`)
   - Replaced all `require()` calls with proper ES module imports

2. **Enhanced State Management**:
   - Added proper tracking of processing mode in the bot store
   - Implemented per-bot state storage to maintain individual bot states
   - Ensured proper state preservation when switching between bots

3. **Improved Component Coordination**:
   - Removed window-based communication between components
   - Centralized state management through the bot store
   - Added proper logging to track bot activities

## Testing

To test the multi-bot system:

```bash
# Run all tests
npm run test

# Run only multi-bot tests
npm run test:multibot
```

For manual testing, refer to the [MULTI_BOT_TESTING.md](MULTI_BOT_TESTING.md) document.
