fsmLogger.js:273 🎮 GAME [14:44:29] Game store initialized
fsmLogger.js:266 👤 PLAYER [14:44:29] Starting bot-only player generation: 1 bots {botCount: 1}
fsmLogger.js:273 👤 PLAYER [14:44:29] Created bot player: bot-0
fsmLogger.js:266 👤 PLAYER [14:44:29] Bot-only player generation completed. Total bots: 1 {playerIds: Array(1)}
fsmLogger.js:273 🔴 ERROR [14:44:29] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:273 🔵 INFO [14:44:29] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:273 🔵 INFO [14:44:29] Système FSM: DÉMARRÉ
fsmLogger.js:273 🔴 ERROR [14:44:29] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:44:29] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:273 📜 HISTORY [14:44:29] NO context change detected for bot bot-0
fsmLogger.js:273 🔵 INFO [14:44:30] [Scene] Initializing tiles...
fsmLogger.js:266 🎮 GAME [14:44:30] Tiles initialized {component: 'tiles'}
fsmLogger.js:266 🎮 GAME [14:44:30] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:266 🔵 INFO [14:44:30] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:273 📜 HISTORY [14:44:30] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:266 🚀 MOUVEMENT [14:44:30] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -1.3, y: 0.8, z: 0.5}
fsmLogger.js:266 🚀 MOUVEMENT [14:44:30] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -1.8, y: 0.5, z: 0}
fsmLogger.js:266 🔧 CONTEXT [14:44:30] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:273 📜 HISTORY [14:44:30] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:266 🔧 CONTEXT [14:44:30] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: '-1,0', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:266 📜 HISTORY [14:44:30] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [14:44:30] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 📜 HISTORY [14:44:31] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:44:31] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:44:31] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [14:44:31] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:44:31] 🚀 [bot-0] explorer drone deployed - distance: 3.74
fsmLogger.js:273 📜 HISTORY [14:44:31] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:44:32] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:44:32] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [14:44:35] 🔍 [bot-0] explorer target reached - distance: 0.25
useFSMDroneTracker.js:134 🛸 [useFSMDroneTracker] Converting position to coords: {visualPosition: {…}, gridCoord: '-2,-1', tileCoord: '-2,-1'}
tileMarkSlice.js:49 🗺️ [TileMarkSlice] markTileAsExplored called with: -2,-1
tileMarkSlice.js:50 🗺️ [TileMarkSlice] Current tiles keys: (37) ['A3', 'A4', 'A5', 'A6', 'B2', 'B3', 'B4', 'B5', 'B6', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'F0', 'F1', 'F2', 'F3', 'F4', 'G0', 'G1', 'G2', 'G3']
tileMarkSlice.js:53 🗺️ [TileMarkSlice] Found tile: undefined
fsmLogger.js:273 🚀 MOUVEMENT [14:44:35] ✅ [bot-0] Tile explored by explorer: "-2,-1"
fsmLogger.js:266 🔵 INFO [14:44:35] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,-1', botId: undefined}
fsmLogger.js:273 📜 HISTORY [14:44:35] Received sync event: DRONE_REACHED_TARGET for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:44:35] State transition detected: exploring_deploying → exploring_prospecting for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:44:35] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'prospecting', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [14:44:35] Context change detected for bot bot-0: {droneStateChange: 'deploying → prospecting', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:44:35] 🔍 [bot-0] explorer starting prospecting phase
fsmLogger.js:273 🚀 MOUVEMENT [14:44:38] 💎 [bot-0] explorer prospecting completed
fsmLogger.js:273 🚀 MOUVEMENT [14:44:38] 🔍 [bot-0] explorer prospecting results: {"food":0,"debris":0,"special":0}
fsmLogger.js:266 🔵 INFO [14:44:38] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:266 🔵 INFO [14:44:38] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,-1', resourcesFound: {…}, botId: undefined}
fsmLogger.js:273 📜 HISTORY [14:44:38] Received sync event: PROSPECTING_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:44:38] State transition detected: exploring_prospecting → exploring_returning for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:44:38] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'prospecting', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [14:44:38] Context change detected for bot bot-0: {droneStateChange: 'prospecting → returning', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:44:40] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:266 🔧 CONTEXT [14:44:40] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5975335901493806}
fsmLogger.js:266 🔵 INFO [14:44:40] 🏠 [Exploring] DRONE_APPROACHING_SHIP guard check {botId: undefined, currentState: 'evaluating', droneState: 'returning', isActive: true, distance: 0.5975335901493806, …}
fsmLogger.js:266 🔵 INFO [14:44:40] 🏠 [Exploring] Drone approaching ship, preparing evaluation {botId: undefined, droneType: 'explorer', distance: 0.5975335901493806}
fsmLogger.js:273 📜 HISTORY [14:44:40] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:44:40] State transition detected: exploring_returning → evaluating for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:44:40] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [14:44:40] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:44:41] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:273 📜 HISTORY [14:44:41] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:266 🔵 INFO [14:44:42] 🏠 [isAtBase] Check: {basePosition: {…}, currentPosition: {…}, distance: '0.00', tolerance: 1, result: true}
fsmLogger.js:273 📜 HISTORY [14:44:42] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [14:44:42] State transition detected: evaluating → idleAtBase for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:44:42] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [14:44:42] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [14:44:46] 🏠 [bot-0] explorer drone reached ship - distance: 0.10
fsmLogger.js:266 🔵 INFO [14:44:46] 🏠 [IdleAtBase] DRONE_REACHED_SHIP guard check {botId: undefined, currentState: 'evaluating', droneState: 'returning', isActive: true, shouldDock: true}
fsmLogger.js:266 🔵 INFO [14:44:46] 🏠 [IdleAtBase] Docking drone while at base {botId: undefined, droneType: 'explorer'}
fsmLogger.js:273 📜 HISTORY [14:44:46] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:266 📜 HISTORY [14:44:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [14:44:46] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
