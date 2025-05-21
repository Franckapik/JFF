# Manual Testing Guide for Multi-Bot System

This document provides a step-by-step guide to manually test the multi-bot system to ensure all the fixes are working correctly.

## Setup

1. Start the development server:
   ```
   npm run dev
   ```

2. Open the application in your browser (default: http://localhost:5173)

## Test Scenarios

### 1. Basic Bot Switching

**Steps:**
1. Observe the "Multi-Bot Controls" panel in the UI
2. Click on different bot buttons (e.g., "Bot 1 (player2)", "Bot 2 (player3)")
3. Verify that the active bot indicator changes in the UI
4. Verify that the 3D representation of the active bot shows a yellow highlight

**Expected Results:**
- The active bot should be highlighted in the UI
- The 3D model of the active bot should have a yellow highlight/indicator
- The "ACTIVE" label should appear next to the correct bot in the status list

### 2. Processing Mode Switching

**Steps:**
1. Click the "Processing Mode" button to toggle between "Parallel (All Bots)" and "Sequential (One by One)"
2. Start the bots by clicking "Start All Bots"
3. Observe the bot behavior in both modes

**Expected Results:**
- In Parallel mode: All bots should move simultaneously when the FSM is active
- In Sequential mode: Only one bot should be active at a time, with automatic switching every 5 seconds
- A notification should briefly appear when switching between bots in sequential mode

### 3. Bot State Persistence

**Steps:**
1. Start all bots
2. Switch to Bot 1 and observe its state
3. Switch to Bot 2 and observe its state
4. Switch back to Bot 1
5. Stop all bots

**Expected Results:**
- Each bot should maintain its own state independent of the other bots
- When switching back to a previously viewed bot, it should be in the same state as when you left it

### 4. Resource Collection

**Steps:**
1. Start all bots in Parallel mode
2. Allow the bots to find and collect resources
3. Check the resource counters for each bot in the "All Bots Status" section

**Expected Results:**
- Each bot should be able to collect resources independently
- The resource counters should update correctly for each bot

### 5. Error Detection

**Console Check:**
1. Open your browser's developer console (F12 or right-click → Inspect → Console)
2. Start all bots and let them run for at least 30 seconds
3. Check for any errors in the console

**Expected Results:**
- No errors related to the multi-bot system should appear in the console
- Specifically, there should be no `ReferenceError: require is not defined` errors
- There should be no errors related to importing `useGameStore`

## Troubleshooting

If you encounter issues:

1. **Browser Cache**: Try clearing your browser cache and hard refreshing (Ctrl+F5 or Cmd+Shift+R)
2. **Restart Development Server**: Stop and restart the development server
3. **Check Console Errors**: Look for specific error messages in the developer console
4. **Recent Changes**: If you've made recent changes to the code, verify that they don't conflict with the multi-bot system

## Reporting Issues

If you find issues that weren't addressed by the fixes, please report them with:
1. A clear description of the issue
2. Steps to reproduce
3. Expected vs. actual behavior
4. Console error messages (if any)
