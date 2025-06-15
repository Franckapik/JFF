fsmLogger.js:273 🎮 GAME [22:46:30] Game store initialized
fsmLogger.js:266 👤 PLAYER [22:46:30] Starting bot-only player generation: 1 bots {botCount: 1}
fsmLogger.js:273 👤 PLAYER [22:46:30] Created bot player: bot-0
fsmLogger.js:266 👤 PLAYER [22:46:30] Bot-only player generation completed. Total bots: 1 {playerIds: Array(1)}
fsmLogger.js:273 🔴 ERROR [22:46:31] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:273 🔵 INFO [22:46:31] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:273 🔵 INFO [22:46:31] Système FSM: DÉMARRÉ
fsmLogger.js:273 🔴 ERROR [22:46:31] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:46:31] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:273 📜 HISTORY [22:46:31] NO context change detected for bot bot-0
fsmLogger.js:273 🔵 INFO [22:46:31] [Scene] Initializing tiles...
fsmLogger.js:266 🎮 GAME [22:46:31] Tiles initialized {component: 'tiles'}
fsmLogger.js:266 🎮 GAME [22:46:31] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:266 🔵 INFO [22:46:31] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:273 📜 HISTORY [22:46:31] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:266 🚀 MOUVEMENT [22:46:31] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -0.4, y: 0.8, z: -1.0588457268119895}
fsmLogger.js:266 🚀 MOUVEMENT [22:46:31] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -0.9, y: 0.5, z: -1.5588457268119895}
fsmLogger.js:266 🔧 CONTEXT [22:46:31] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:273 📜 HISTORY [22:46:31] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:266 🔧 CONTEXT [22:46:31] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'A-1', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:266 📜 HISTORY [22:46:31] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [22:46:31] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 📜 HISTORY [22:46:33] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:46:33] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:46:33] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [22:46:33] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:46:33] 🚀 [bot-0] explorer drone deployed - distance: 3.30
fsmLogger.js:273 📜 HISTORY [22:46:33] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:46:33] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:46:36] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:273 🚀 MOUVEMENT [22:46:36] ✅ [bot-0] Tile explored by explorer: "-2,0"
fsmLogger.js:266 🔵 INFO [22:46:36] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: '-2,0', botId: undefined}
fsmLogger.js:273 📜 HISTORY [22:46:36] Received sync event: DRONE_REACHED_TARGET for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:46:36] State transition detected: exploring_deploying → exploring_prospecting for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:46:36] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'prospecting', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [22:46:36] Context change detected for bot bot-0: {droneStateChange: 'deploying → prospecting', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:46:36] 🔍 [bot-0] explorer starting prospecting phase
fsmLogger.js:273 🚀 MOUVEMENT [22:46:39] 💎 [bot-0] explorer prospecting completed
fsmLogger.js:273 🚀 MOUVEMENT [22:46:39] 🔍 [bot-0] explorer prospecting results: {"food":0,"debris":0,"special":0}
fsmLogger.js:266 🔵 INFO [22:46:39] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:266 🔵 INFO [22:46:39] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: '-2,0', resourcesFound: {…}, botId: undefined}
fsmLogger.js:273 📜 HISTORY [22:46:39] Received sync event: PROSPECTING_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:46:39] State transition detected: exploring_prospecting → exploring_returning for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:46:39] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'prospecting', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [22:46:39] Context change detected for bot bot-0: {droneStateChange: 'prospecting → returning', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:46:41] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:266 🔧 CONTEXT [22:46:41] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.599524101700504}
fsmLogger.js:266 🔵 INFO [22:46:41] 🏠 [Exploring] DRONE_APPROACHING_SHIP guard check {botId: undefined, currentState: 'evaluating', droneState: 'returning', isActive: true, distance: 0.599524101700504, …}
fsmLogger.js:266 🔵 INFO [22:46:41] 🏠 [Exploring] Drone approaching ship, preparing evaluation {botId: undefined, droneType: 'explorer', distance: 0.599524101700504}
fsmLogger.js:273 📜 HISTORY [22:46:41] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:46:41] State transition detected: exploring_returning → evaluating for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:46:41] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [22:46:41] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:46:42] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:273 📜 HISTORY [22:46:42] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:266 🔵 INFO [22:46:43] 🏠 [isAtBase] Check: {basePosition: {…}, currentPosition: {…}, distance: '0.00', tolerance: 1, result: true}
fsmLogger.js:273 📜 HISTORY [22:46:43] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:46:43] State transition detected: evaluating → idleAtBase for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:46:43] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [22:46:43] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:46:47] 🏠 [bot-0] explorer drone reached ship - distance: 0.08
fsmLogger.js:273 📜 HISTORY [22:46:47] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:46:52] 🏠 [bot-0] explorer drone reached ship - distance: 0.04
fsmLogger.js:273 📜 HISTORY [22:46:52] Received sync event: DRONE_REACHED_SHIP for bot bot-0
