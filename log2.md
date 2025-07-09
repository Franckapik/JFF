VM95012:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.js:282 🎮 GAME [13:07:04] [Scene] Initializing tiles...
fsmLogger.js:282 🎮 GAME [13:07:04] Tiles initialized
fsmLogger.js:282 🎮 GAME [13:07:04] [XFSMStore.createBotActor] Actor for bot-0 created - Status: active, State: evaluating, startImmediately: false
index.ts:49 [XFSMStore.createBotActor] Actor for bot-0 created - Status: active, State: evaluating, startImmediately: false
fsmLogger.js:282 🎮 GAME [13:07:04] [XFSMStore.createBotActor] Actor for bot-0 created but not started (status: active, state: evaluating)
fsmLogger.js:275 🎮 GAME [13:07:04] [XFSMStore.addBot] {botId: 'bot-0', activeBots: 1, started: false}
fsmLogger.js:282 🎮 GAME [13:07:04] Bots initialized
fsmLogger.js:282 🎮 GAME [13:07:04] Players initialized
fsmLogger.js:275 🎮 GAME [13:07:04] Game fully initialized {players: true, bots: true, tiles: true}
fsmLogger.js:282 🎮 GAME [13:07:05] [Scene] Starting bot bot-0 after position initialization delay
fsmLogger.js:282 🎮 GAME [13:07:05] [XFSMStore.startBotActor] Actor for bot-0 - Status: active, State: evaluating
index.ts:89 [XFSMStore.startBotActor] Actor for bot-0 - Status: active, State: evaluating
fsmLogger.js:282 🎮 GAME [13:07:05] [XFSMStore.startBotActor] Starting actor for bot-0 (current status: active)
fsmLogger.js:282 🟢 STATE [13:07:05] action_evaluating_entry
fsmLogger.js:275 🔵 INFO [13:07:05] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: undefined, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.js:282 🎮 GAME [13:07:05] [XFSMStore.startBotActor] Actor started for bot-0 - New Status: active, State: evaluating
index.ts:114 [XFSMStore.startBotActor] Actor started for bot-0 - New Status: active, State: evaluating
fsmLogger.js:282 🎮 GAME [13:07:05] [XFSMStore.startBot] Bot bot-0 started
fsmLogger.js:282 🔵 INFO [13:07:06] [Evaluating] → needExploring (need more exploration)
fsmLogger.js:275 🟣 CONDITION [13:07:06] [shouldExplore] {context: {…}, event: undefined}
fsmLogger.js:282 🟢 STATE [13:07:06] action_evaluating_exit
fsmLogger.js:275 🔵 INFO [13:07:06] 🔄 [bot-0] updateContext called with: {hasContext: true, hasEvent: true, eventType: 'needExploring', event: {…}, contextKeys: Array(16)}
fsmLogger.js:282 🔵 INFO [13:07:06] 🔄 [bot-0] Updating context for transition: needExploring
fsmLogger.js:282 🔵 INFO [13:07:06] 🚁 [bot-0] Deploying drone for exploration
droneExploringActions.js:72 {id: 'bot-0-ship', type: 'main_ship', position: {…}, basePosition: {…}, coord: {…}, …}
fsmLogger.js:282 🐛 DEBUG [13:07:06] [selectTargetTileInRadiusForDrone] No valid tiles found within radius 3, exploration complete in this area
fsmLogger.js:282 🐛 DEBUG [13:07:06] [droneDeployForExploration] No valid exploration targets within radius 3, area exploration complete
fsmLogger.js:275 🔵 INFO [13:07:06] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.js:282 🟢 STATE [13:07:06] 🚀 [bot-0] Entering exploring state
fsmLogger.js:282 🟢 STATE [13:07:06] 🛸 [bot-0] Drone deploying - moving to target
