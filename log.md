VM3285:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
evaluating.state.js:20 exploring
fsmLogger.js:277 🎮 GAME [21:18:02] Game store initialized
fsmLogger.js:270 🔵 INFO [21:18:02] [shouldExplore] {context: {…}, event: {…}}
fsmLogger.js:277 🎮 GAME [21:18:02] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [21:18:02] Tiles initialized {component: 'tiles'}
fsmLogger.js:277 🟢 STATE [21:18:02] action_evaluating_entry
fsmLogger.js:270 🔵 INFO [21:18:02] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.js:270 🎮 GAME [21:18:02] [XFSMStore.addBot] {botId: 'bot-0', activeBots: 1}
fsmLogger.js:277 🎮 GAME [21:18:02] [TileStore] Synchronized 1 starting tiles with 1 active bots
fsmLogger.js:270 🚀 MOUVEMENT [21:18:02] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 1.4, y: 0.8, z: 2.0588457268119895}
fsmLogger.js:270 🚀 MOUVEMENT [21:18:02] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0.9, y: 0.5, z: 1.5588457268119895}
fsmLogger.js:270 🔧 CONTEXT [21:18:02] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.js:270 ⚡ EVENT [21:18:02] [XFSMStore.send] {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.js:277 🔵 INFO [21:18:03] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:270 🔵 INFO [21:18:03] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:277 🟢 STATE [21:18:03] action_evaluating_exit
fsmLogger.js:277 🔵 INFO [21:18:03] ⚠️ [undefined] updateContext called with invalid event:
fsmLogger.js:277 🟢 STATE [21:18:03] 🚀 [undefined] Entering exploring state
fsmLogger.js:277 🟢 STATE [21:18:03] 🛸 [undefined] Drone deploying - moving to target
