# FSM Cleanup Actions - Concrete Steps

## 🎯 PRIORITY 1: FIX CRITICAL ISSUE

### Fix BASE_REACHED Event Not Triggering

**Problem**: Bot gets stuck in `exploring_returning` state because `BASE_REACHED` event never triggers.

**Files to modify**:

1. **src/ai/fsm/machine/states/exploring.js** - Add timeout fallback:

```javascript
// Add after existing transitions in exploring_returning section
transition(SYSTEM_EVENT_TYPES.EXPLORATION_TIMEOUT, BOT_STATES.IDLE_AT_BASE,
  guard((context, event) => {
    const timeInState = Date.now() - (context.lastStateChange || 0);
    return timeInState > 30000; // 30 second timeout
  }),
  reduce((context, event) => {
    fsmLogger.warn("🚨 [Exploring] Timeout in exploring_returning, forcing return to base", { 
      botId: context.botId,
      timeInState: Date.now() - (context.lastStateChange || 0)
    });
    
    return contextReducers.state.prepareIdleAtBase(context, {
      reason: 'timeout_fallback'
    });
  })
),
```

2. **src/ai/fsm/machine/events/systemEvents.js** - Add timeout event:

```javascript
// Add to SYSTEM_EVENT_TYPES
EXPLORATION_TIMEOUT: 'exploration_timeout',

// Add to event creators
createExplorationTimeoutEvent: (botId, timeInState) => ({
  type: SYSTEM_EVENT_TYPES.EXPLORATION_TIMEOUT,
  botId,
  timeInState,
  timestamp: Date.now()
}),
```

3. **src/ai/fsm/hooks/useBotMachine.js** - Add timeout mechanism:

```javascript
// Add timeout check in autonomous mode
useEffect(() => {
  if (!isAutonomous || !isRunning) return;

  const checkTimeout = () => {
    if (current.name === 'exploring_returning') {
      const timeInState = Date.now() - (current.context.lastStateChange || 0);
      if (timeInState > 30000) {
        const timeoutEvent = systemEvents.createExplorationTimeoutEvent(
          current.context.botId, 
          timeInState
        );
        send(timeoutEvent.type, timeoutEvent);
      }
    }
  };

  const timeoutInterval = setInterval(checkTimeout, 5000);
  return () => clearInterval(timeoutInterval);
}, [isAutonomous, isRunning, current.name, current.context.lastStateChange, send]);
```

## 🎯 PRIORITY 2: COMMENT OUT UNUSED COMPONENTS

### Comment Out Unused States

**File**: `src/ai/fsm/machine/states/index.js`
```javascriptfsmLogger.js:144 🎮 GAME [13:00:52] Game store initialized
fsmLogger.js:137 👤 PLAYER [13:00:52] Starting bot-only player generation: 1 bots {botCount: 1}
fsmLogger.js:144 👤 PLAYER [13:00:52] Created bot player: bot-0
fsmLogger.js:137 👤 PLAYER [13:00:52] Bot-only player generation completed. Total bots: 1 {playerIds: Array(1)}
fsmLogger.js:144 🔴 ERROR [13:00:52] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:144 🔵 INFO [13:00:52] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:144 🔵 INFO [13:00:52] Système FSM: DÉMARRÉ
fsmLogger.js:144 🔴 ERROR [13:00:52] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:137 📜 HISTORY [13:00:52] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:144 📜 HISTORY [13:00:52] NO context change detected for bot bot-0
fsmLogger.js:144 🔵 INFO [13:00:52] [Scene] Initializing tiles...
fsmLogger.js:137 🎮 GAME [13:00:52] Tiles initialized {component: 'tiles'}
fsmLogger.js:137 🎮 GAME [13:00:52] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:137 🔵 INFO [13:00:52] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:144 📜 HISTORY [13:00:52] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 📜 HISTORY [13:00:52] Received sync event: [object Object] for bot bot-0
fsmLogger.js:137 📜 HISTORY [13:00:52] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:137 📜 HISTORY [13:00:52] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:144 📜 HISTORY [13:00:52] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 📜 HISTORY [13:00:52] Received sync event: [object Object] for bot bot-0
fsmLogger.js:137 🚀 MOUVEMENT [13:00:52] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 3.617691453623979}
fsmLogger.js:137 🚀 MOUVEMENT [13:00:52] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0.5, z: 3.117691453623979}
fsmLogger.js:137 🔧 CONTEXT [13:00:52] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:144 📜 HISTORY [13:00:52] Received sync event: [object Object] for bot bot-0
fsmLogger.js:137 🔧 CONTEXT [13:00:52] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: '-1,2', worldPosition: {…}, eventType: 'UPDATE_POSITION'}
fsmLogger.js:137 📜 HISTORY [13:00:52] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:137 📜 HISTORY [13:00:52] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:137 🚀 MOUVEMENT [13:00:52] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 3.617691453623979}
fsmLogger.js:137 🚀 MOUVEMENT [13:00:52] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0.5, z: 3.117691453623979}
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:144 📜 HISTORY [13:00:54] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:137 📜 HISTORY [13:00:54] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:137 📜 HISTORY [13:00:54] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:137 🚀 MOUVEMENT [13:00:54] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 3.617691453623979}
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 7.20
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:137 🚀 MOUVEMENT [13:00:54] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0.5, z: 3.117691453623979}
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 7.06
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 7.00
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.95
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.91
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.86
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.81
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.76
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.72
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.66
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.59
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.53
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.46
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.41
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.36
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.31
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.27
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.22
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.18
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.14
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.11
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.07
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.04
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 6.00
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.95
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.90
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.84
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.80
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.77
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.73
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.70
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.66
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.63
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.58
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.54
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.49
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.44
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.40
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.36
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.31
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.27
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.23
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.20
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.16
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.13
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.10
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.07
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 5.02
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.99
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.95
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.91
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.88
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.84
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.81
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.78
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.75
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.72
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.69
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.66
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.63
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.58
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.54
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.50
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.46
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.43
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.40
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.37
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.34
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.31
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.28
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.25
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.22
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:54] 🚀 [bot-0] explorer drone deployed - distance: 4.19
fsmLogger.js:144 📜 HISTORY [13:00:54] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 4.16
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 4.12
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 4.08
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 4.05
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 4.02
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.99
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.96
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.94
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.92
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.89
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.88
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.85
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.82
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.80
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.76
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.73
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.71
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.68
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.66
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.64
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.62
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.60
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.58
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.56
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.52
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.50
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.47
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.45
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.42
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.40
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.37
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.35
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.33
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.32
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.29
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.27
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.24
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.22
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.19
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.17
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.15
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.13
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.11
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.09
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.07
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.04
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 3.01
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:55] 🚀 [bot-0] explorer drone deployed - distance: 2.99
fsmLogger.js:144 📜 HISTORY [13:00:55] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:56] 🔍 [bot-0] explorer target reached - distance: 1.49
fsmLogger.js:144 🚀 MOUVEMENT [13:00:56] ✅ [bot-0] Tile explored by explorer: "-2,0"
fsmLogger.js:137 🔵 INFO [13:00:56] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,0', botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:56] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,0', botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:56] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,0', botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:56] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,0', botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:56] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,0', botId: undefined}
fsmLogger.js:144 📜 HISTORY [13:00:56] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 📜 HISTORY [13:00:56] State transition detected: exploring_deploying → exploring_prospecting for bot bot-0
fsmLogger.js:137 📜 HISTORY [13:00:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'prospecting', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:137 📜 HISTORY [13:00:56] Context change detected for bot bot-0: {droneStateChange: 'deploying → prospecting', reason: 'significant change detected'}
fsmLogger.js:144 🚀 MOUVEMENT [13:00:56] 🔍 [bot-0] explorer starting prospecting phase
fsmLogger.js:137 🚀 MOUVEMENT [13:00:56] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 3.617691453623979}
fsmLogger.js:137 🚀 MOUVEMENT [13:00:56] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0.5, z: 3.117691453623979}
fsmLogger.js:144 🚀 MOUVEMENT [13:00:56] 🔍 [bot-0] explorer starting prospecting phase
fsmLogger.js:144 🚀 MOUVEMENT [13:00:59] 💎 [bot-0] explorer prospecting completed
fsmLogger.js:144 🚀 MOUVEMENT [13:00:59] 🔍 [bot-0] explorer prospecting results: {"food":0,"debris":41,"special":0}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:144 📜 HISTORY [13:00:59] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:00:59] 🔍 [bot-0] explorer starting prospecting phase
fsmLogger.js:137 🚀 MOUVEMENT [13:00:59] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 3.617691453623979}
fsmLogger.js:144 🚀 MOUVEMENT [13:00:59] 🏠 [bot-0] explorer drone returned - distance: 0.77
fsmLogger.js:144 📜 HISTORY [13:00:59] Received sync event: [object Object] for bot bot-0
fsmLogger.js:137 🚀 MOUVEMENT [13:00:59] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0.5, z: 3.117691453623979}
fsmLogger.js:144 📜 HISTORY [13:00:59] State transition detected: exploring_prospecting → exploring_returning for bot bot-0
fsmLogger.js:137 📜 HISTORY [13:00:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'prospecting', droneStateChanged: true, …}
fsmLogger.js:137 📜 HISTORY [13:00:59] Context change detected for bot bot-0: {droneStateChange: 'prospecting → returning', reason: 'significant change detected'}
fsmLogger.js:144 🚀 MOUVEMENT [13:00:59] 💎 [bot-0] explorer prospecting completed
fsmLogger.js:144 🚀 MOUVEMENT [13:00:59] 🔍 [bot-0] explorer prospecting results: {"food":0,"debris":0,"special":0}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:00:59] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:00:59] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:144 📜 HISTORY [13:00:59] Received sync event: [object Object] for bot bot-0
fsmLogger.js:137 📜 HISTORY [13:00:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:137 📜 HISTORY [13:00:59] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:137 🚀 MOUVEMENT [13:00:59] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 3.617691453623979}
fsmLogger.js:144 🚀 MOUVEMENT [13:00:59] 🏠 [bot-0] explorer drone returned - distance: 0.77
fsmLogger.js:144 📜 HISTORY [13:00:59] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:01:01] 🏠 [bot-0] explorer drone returned - distance: 1.49
fsmLogger.js:144 📜 HISTORY [13:01:01] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:01:02] 💎 [bot-0] explorer prospecting completed
fsmLogger.js:144 🚀 MOUVEMENT [13:01:02] 🔍 [bot-0] explorer prospecting results: {"food":0,"debris":0,"special":0}
fsmLogger.js:137 🔵 INFO [13:01:02] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:01:02] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,-1', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:01:02] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:01:02] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,-1', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:01:02] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:01:02] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,-1', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:01:02] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:01:02] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,-1', resourcesFound: {…}, botId: undefined}
fsmLogger.js:137 🔵 INFO [13:01:02] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:137 🔵 INFO [13:01:02] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,-1', resourcesFound: {…}, botId: undefined}
fsmLogger.js:144 📜 HISTORY [13:01:02] Received sync event: [object Object] for bot bot-0
fsmLogger.js:137 🚀 MOUVEMENT [13:01:02] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 3.617691453623979}
fsmLogger.js:137 📜 HISTORY [13:01:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:137 📜 HISTORY [13:01:02] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:144 🚀 MOUVEMENT [13:01:04] 🏠 [bot-0] explorer drone returned - distance: 0.15
fsmLogger.js:144 📜 HISTORY [13:01:04] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:01:05] 🏠 [bot-0] explorer drone returned - distance: 0.11
fsmLogger.js:144 📜 HISTORY [13:01:05] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:01:06] 🏠 [bot-0] explorer drone returned - distance: 0.10
fsmLogger.js:144 📜 HISTORY [13:01:06] Received sync event: [object Object] for bot bot-0
fsmLogger.js:144 🚀 MOUVEMENT [13:01:09] 🏠 [bot-0] explorer drone returned - distance: 0.05
fsmLogger.js:144 📜 HISTORY [13:01:09] Received sync event: [object Object] for bot bot-0

// Export des états
export { evaluatingState } from './evaluating.js';
export { exploringState } from './exploring.js';
// returningState removed - EXPLORING_RETURNING logic is now in exploring.js
// UNUSED: Resource collection never implemented in practice
// export { collectingState } from './collecting.js';
export { idleAtBaseState } from './idleAtBase.js';
```

**File**: `src/ai/fsm/machine/machineFactory.js`
```javascript
const stateMap = {
  [BOT_STATES.EVALUATING]: evaluatingState,
  [BOT_STATES.EXPLORING_DEPLOYING]: exploringState,
  [BOT_STATES.EXPLORING_PROSPECTING]: exploringState,
  [BOT_STATES.EXPLORING_RETURNING]: exploringState,
  // UNUSED: Resource collection flow not implemented
  // [BOT_STATES.COLLECTING]: collectingState,
  [BOT_STATES.IDLE_AT_BASE]: idleAtBaseState,
};
```

### Comment Out Unused Events

**File**: `src/ai/fsm/machine/events/resourceEvents.js`
```javascript
/**
 * ⚠️ UNUSED EVENTS - Resource collection not implemented in practice
 * These events are available but never triggered in the current system
 */

// UNUSED: Resource collection flow not implemented
// export const RESOURCE_EVENT_TYPES = {
//   RESOURCE_DISCOVERED: 'resource_discovered',
//   RESOURCE_COLLECTED: 'resource_collected',
//   RESOURCE_DEPLETED: 'resource_depleted',
//   RESOURCE_UNAVAILABLE: 'resource_unavailable',
//   INVENTORY_FULL: 'inventory_full',
//   INVENTORY_EMPTY: 'inventory_empty'
// };
```

**File**: `src/ai/fsm/machine/events/fuelEvents.js`
```javascript
/**
 * ⚠️ UNUSED EVENTS - Fuel management not implemented in practice
 * These events are available but never triggered in the current system
 */

// UNUSED: Fuel management not implemented
// export const FUEL_EVENT_TYPES = {
//   REFUEL_STARTED: 'refuel_started',
//   REFUEL_COMPLETE: 'refuel_complete',
//   LOW_FUEL_DETECTED: 'low_fuel_detected',
//   CRITICAL_FUEL_DETECTED: 'critical_fuel_detected',
//   FUEL_CONSUMED: 'fuel_consumed'
// };
```

### Comment Out Unused Guards

**File**: `src/ai/fsm/machine/guards/efficiency.js`
```javascript
export const efficiencyGuards = {
  // Resource capacity guards - ACTIVELY USED
  hasCapacityFor: resourceGuards.hasCapacityFor,
  isAtMaxCapacity: resourceGuards.isAtMaxCapacity,
  
  // UNUSED: Resource collection guards
  // canCollectResource: resourceGuards.canCollectResource,
  // canDepositResources: resourceGuards.canDepositResources,

  // Fuel efficiency guards - ACTIVELY USED
  isFullTank: fuelGuards.isFullTank,
  
  // UNUSED: Fuel management guards (if not needed)
  // canRefuel: fuelGuards.canRefuel,

  // Movement efficiency guards - ACTIVELY USED
  isMovementComplete: movementGuards.isMovementComplete,

  // Efficiency optimization checks - ACTIVELY USED
  shouldCollectMore: (context, event) => {
    return !resourceGuards.isAtMaxCapacity(context, event) &&
           resourceGuards.hasCapacityFor(context, event);
  },

  // UNUSED: Collection efficiency
  // isCollectionEfficient: (context, event) => {
  //   return resourceGuards.canCollectResource(context, event) &&
  //          efficiencyGuards.shouldCollectMore(context, event);
  // },

  shouldReturnForEfficiency: (context, event) => {
    return resourceGuards.isAtMaxCapacity(context, event) ||
           fuelGuards.isLowFuel(context, event);
  },

  // UNUSED: Inventory management
  // needsInventoryManagement: (context, event) => {
  //   return resourceGuards.isAtMaxCapacity(context, event);
  // }
};
```

### Comment Out Unused Actions

**File**: `src/ai/fsm/machine/actions/core/resourcesActions.js`
```javascript
/**
 * ⚠️ PARTIALLY UNUSED - Resource collection not implemented in practice
 * Keep selectors and guards, comment out collection actions
 */

export const resourceActions = {
  // UNUSED: Resource collection actions
  // collectResource: (context, event) => {
  //   const { resourceId, amount, resourceType } = event;
  //   // ... implementation
  // },
  
  // UNUSED: Inventory management
  // updateInventory: (context, event) => {
  //   const { resources } = event;
  //   // ... implementation  
  // },

  // Keep position and discovery actions - ACTIVELY USED
  updatePosition: (context, event) => {
    // ... keep this
  },

  // UNUSED: Deposit actions
  // depositResources: (context, event) => {
  //   // ... implementation
  // }
};
```

## 🎯 PRIORITY 3: ADD SAFETY MECHANISMS

### Add State Recovery Mechanisms

**File**: `src/ai/fsm/machine/states/evaluating.js`
```javascript
// Add recovery transition for stuck states
transition(SYSTEM_EVENT_TYPES.STATE_RECOVERY, BOT_STATES.EVALUATING,
  guard(() => true),
  reduce((context, event) => {
    fsmLogger.warn("🔄 [Evaluating] State recovery triggered", { 
      botId: context.botId,
      fromState: event.fromState,
      reason: event.reason
    });
    
    return contextReducers.state.prepareEvaluating(context, {
      reason: 'state_recovery',
      previousState: event.fromState
    });
  })
),
```

### Add Monitoring Hooks

**File**: `src/ai/fsm/hooks/useBotMachine.js`
```javascript
// Add state monitoring
useEffect(() => {
  const monitoringInterval = setInterval(() => {
    if (current.context.lastStateChange) {
      const timeInState = Date.now() - current.context.lastStateChange;
      
      // Log long-running states
      if (timeInState > 60000) { // 1 minute
        fsmLogger.warn(`Bot ${current.context.botId} in state ${current.name} for ${timeInState/1000}s`);
      }
      
      // Force recovery for extremely long states
      if (timeInState > 300000) { // 5 minutes
        const recoveryEvent = systemEvents.createStateRecoveryEvent(
          current.context.botId,
          current.name,
          'timeout_recovery'
        );
        send(recoveryEvent.type, recoveryEvent);
      }
    }
  }, 30000); // Check every 30 seconds

  return () => clearInterval(monitoringInterval);
}, [current.name, current.context.lastStateChange, current.context.botId, send]);
```

## 🎯 PRIORITY 4: UPDATE DOCUMENTATION

### Update README Files

**File**: `src/ai/fsm/machine/states/README.md`
```markdown
## États Disponibles

### 1. EVALUATING ✅
État central qui analyse la situation et décide de l'action suivante.

### 2. EXPLORING ✅  
État de recherche et découverte de ressources.
- Sub-states: exploring_deploying, exploring_prospecting, exploring_returning

### 3. IDLE_AT_BASE ✅
État de ravitaillement et maintenance à la base.

### 4. COLLECTING ❌ (Commented Out)
État de collecte de ressources - Non implémenté dans la pratique.

### 5. RETURNING ❌ (Removed)
Remplacé par exploring_returning dans l'état exploring.
```

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Fix BASE_REACHED timeout issue
- [ ] Add EXPLORATION_TIMEOUT event
- [ ] Comment out unused states in index.js
- [ ] Comment out unused events in resourceEvents.js
- [ ] Comment out unused events in fuelEvents.js  
- [ ] Comment out unused guards in efficiency.js
- [ ] Comment out unused actions in resourcesActions.js
- [ ] Add state recovery mechanisms
- [ ] Add monitoring hooks
- [ ] Update documentation
- [ ] Test exploration flow still works
- [ ] Verify timeout mechanisms work
- [ ] Build and validate no errors

## 🧪 TESTING STEPS

1. **Test Normal Flow**:
   - Start bot → evaluating → exploring_deploying → exploring_prospecting → exploring_returning → idle_at_base

2. **Test Timeout Mechanism**:
   - Force bot to stay in exploring_returning for >30s
   - Verify timeout triggers and moves to idle_at_base

3. **Test Manual Overrides**:
   - Ensure MANUAL_OVERRIDE still works from all states

4. **Test Emergency Handling**:
   - Verify EMERGENCY_DETECTED transitions work

5. **Verify Unused Components**:
   - Ensure commented out components don't break builds
   - Verify no dead code references remain
