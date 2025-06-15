fsmLogger.js:273 🎮 GAME [22:13:00] Game store initialized
fsmLogger.js:266 👤 PLAYER [22:13:00] Starting bot-only player generation: 1 bots {botCount: 1}
fsmLogger.js:273 👤 PLAYER [22:13:00] Created bot player: bot-0
fsmLogger.js:266 👤 PLAYER [22:13:00] Bot-only player generation completed. Total bots: 1 {playerIds: Array(1)}
fsmLogger.js:273 🔴 ERROR [22:13:00] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:273 🔵 INFO [22:13:00] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:273 🔵 INFO [22:13:00] Système FSM: DÉMARRÉ
fsmLogger.js:273 🔴 ERROR [22:13:00] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:13:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:273 📜 HISTORY [22:13:00] NO context change detected for bot bot-0
fsmLogger.js:273 🔵 INFO [22:13:00] [Scene] Initializing tiles...
fsmLogger.js:266 🎮 GAME [22:13:00] Tiles initialized {component: 'tiles'}
fsmLogger.js:266 🎮 GAME [22:13:00] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:266 🔵 INFO [22:13:00] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:273 📜 HISTORY [22:13:00] Received sync event: [object Object] for bot bot-0
fsmLogger.js:266 🚀 MOUVEMENT [22:13:00] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -2.2, y: 0.8, z: -1.0588457268119895}
fsmLogger.js:266 🚀 MOUVEMENT [22:13:00] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -2.7, y: 0.5, z: -1.5588457268119895}
fsmLogger.js:266 🔧 CONTEXT [22:13:00] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:266 🔧 CONTEXT [22:13:00] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: '-1,-1', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:266 📜 HISTORY [22:13:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [22:13:00] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 📜 HISTORY [22:13:02] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:02] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:13:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [22:13:02] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:13:02] 🚀 [bot-0] explorer drone deployed - distance: 7.03
fsmLogger.js:273 📜 HISTORY [22:13:02] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:02] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:02] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:02] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:03] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:13:03] 🚀 [bot-0] explorer drone deployed - distance: 4.69
fsmLogger.js:273 📜 HISTORY [22:13:03] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:03] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:03] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:03] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:03] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:13:03] 🚀 [bot-0] explorer drone deployed - distance: 3.14
fsmLogger.js:273 📜 HISTORY [22:13:03] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:13:06] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:273 🚀 MOUVEMENT [22:13:06] ✅ [bot-0] Tile explored by explorer: "B2"
fsmLogger.js:266 🔵 INFO [22:13:06] 🎯 [Exploring] Drone reached target, starting prospecting phase {tileCoord: 'B2', botId: undefined}
fsmLogger.js:273 📜 HISTORY [22:13:06] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:06] State transition detected: exploring_deploying → exploring_prospecting for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:13:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'prospecting', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [22:13:06] Context change detected for bot bot-0: {droneStateChange: 'deploying → prospecting', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:13:06] 🔍 [bot-0] explorer starting prospecting phase
fsmLogger.js:273 🚀 MOUVEMENT [22:13:09] 💎 [bot-0] explorer prospecting completed
fsmLogger.js:273 🚀 MOUVEMENT [22:13:09] 🔍 [bot-0] explorer prospecting results: {"food":33,"debris":0,"special":0}
fsmLogger.js:266 🔵 INFO [22:13:09] 🔍 [Exploring] Guard result: true {botId: undefined, guardConditions: {…}}
fsmLogger.js:266 🔵 INFO [22:13:09] 💎 [Exploring] Prospecting completed, returning to base with data {tileCoord: 'B2', resourcesFound: {…}, botId: undefined}
fsmLogger.js:266 🔵 INFO [22:13:09] 📦 [Exploring] Resources discovered and recorded {resource: {…}, botId: undefined}
fsmLogger.js:273 📜 HISTORY [22:13:09] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:09] State transition detected: exploring_prospecting → exploring_returning for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:13:09] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'prospecting', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [22:13:09] Context change detected for bot bot-0: {droneStateChange: 'prospecting → returning', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:13:13] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:266 🔧 CONTEXT [22:13:13] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5999599469234087}
fsmLogger.js:266 🔵 INFO [22:13:13] 🏠 [Exploring] DRONE_APPROACHING_SHIP guard check {botId: undefined, currentState: 'evaluating', droneState: 'returning', isActive: true, distance: 0.5999599469234087, …}
fsmLogger.js:266 🔵 INFO [22:13:13] 🏠 [Exploring] Drone approaching ship, preparing evaluation {botId: undefined, droneType: 'explorer', distance: 0.5999599469234087}
fsmLogger.js:273 📜 HISTORY [22:13:13] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:13] State transition detected: exploring_returning → evaluating for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:13:13] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [22:13:13] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:13:14] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:273 📜 HISTORY [22:13:14] Received sync event: [object Object] for bot bot-0
fsmLogger.js:266 🔵 INFO [22:13:15] 🏠 [isAtBase] Check: {basePosition: {…}, currentPosition: {…}, distance: '0.00', tolerance: 1, result: true, …}
fsmLogger.js:273 📜 HISTORY [22:13:15] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:13:15] State transition detected: evaluating → idleAtBase for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:13:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'returning', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [22:13:15] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:13:19] 🏠 [bot-0] explorer drone reached ship - distance: 0.07
fsmLogger.js:273 📜 HISTORY [22:13:19] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:13:24] 🏠 [bot-0] explorer drone reached ship - distance: 0.05
fsmLogger.js:273 📜 HISTORY [22:13:24] Received sync event: [object Object] for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:13:29] 🏠 [bot-0] explorer drone reached ship - distance: 0.09
fsmLogger.js:273 📜 HISTORY [22:13:29] Received sync event: [object Object] for bot bot-0
