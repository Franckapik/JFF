fsmLogger.js:273 🎮 GAME [22:21:38] Game store initialized
fsmLogger.js:266 👤 PLAYER [22:21:38] Starting bot-only player generation: 1 bots {botCount: 1}
fsmLogger.js:273 👤 PLAYER [22:21:38] Created bot player: bot-0
fsmLogger.js:266 👤 PLAYER [22:21:38] Bot-only player generation completed. Total bots: 1 {playerIds: Array(1)}
fsmLogger.js:273 🔴 ERROR [22:21:38] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:273 🔵 INFO [22:21:38] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:273 🔵 INFO [22:21:38] Système FSM: DÉMARRÉ
fsmLogger.js:273 🔴 ERROR [22:21:38] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:21:38] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:273 📜 HISTORY [22:21:38] NO context change detected for bot bot-0
fsmLogger.js:273 🔵 INFO [22:21:38] [Scene] Initializing tiles...
fsmLogger.js:266 🎮 GAME [22:21:38] Tiles initialized {component: 'tiles'}
fsmLogger.js:266 🎮 GAME [22:21:38] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:266 🔵 INFO [22:21:38] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:273 📜 HISTORY [22:21:38] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:266 🚀 MOUVEMENT [22:21:38] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -1.3, y: 0.8, z: 0.5}
fsmLogger.js:266 🚀 MOUVEMENT [22:21:38] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -1.8, y: 0.5, z: 0}
fsmLogger.js:266 🔧 CONTEXT [22:21:38] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:273 📜 HISTORY [22:21:38] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:266 🔧 CONTEXT [22:21:38] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'C3', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:266 📜 HISTORY [22:21:38] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:266 📜 HISTORY [22:21:38] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:273 📜 HISTORY [22:21:40] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:273 📜 HISTORY [22:21:40] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:266 📜 HISTORY [22:21:40] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:266 📜 HISTORY [22:21:40] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:273 🚀 MOUVEMENT [22:21:40] 🚀 [bot-0] explorer drone deployed - distance: 2.34
fsmLogger.js:273 📜 HISTORY [22:21:40] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:21:43] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:273 🚀 MOUVEMENT [22:21:43] ✅ [bot-0] Tile explored by explorer: "B3"
fsmLogger.js:273 🚀 MOUVEMENT [22:21:43] 💎 [bot-0] explorer discovered resources: {"food":14,"debris":10,"special":0}
fsmLogger.js:273 📜 HISTORY [22:21:43] Received sync event: DRONE_EXPLORES_TILE for bot bot-0
fsmLogger.js:273 🔵 INFO [22:21:43] 🗺️ Tile B3 is now marked as explored
fsmLogger.js:273 🚀 MOUVEMENT [22:21:46] 🔍 [bot-0] explorer target reached - distance: 0.02
fsmLogger.js:273 🚀 MOUVEMENT [22:21:46] ✅ [bot-0] Tile explored by explorer: "B3"
fsmLogger.js:273 🚀 MOUVEMENT [22:21:46] 💎 [bot-0] explorer discovered resources: {"food":0,"debris":0,"special":0}
fsmLogger.js:273 📜 HISTORY [22:21:46] Received sync event: DRONE_EXPLORES_TILE for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:21:49] 🔍 [bot-0] explorer target reached - distance: 0.00
fsmLogger.js:273 🚀 MOUVEMENT [22:21:49] ✅ [bot-0] Tile explored by explorer: "B3"
fsmLogger.js:273 🚀 MOUVEMENT [22:21:49] 💎 [bot-0] explorer discovered resources: {"food":6,"debris":0,"special":0}
fsmLogger.js:273 📜 HISTORY [22:21:49] Received sync event: DRONE_EXPLORES_TILE for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:21:52] 🔍 [bot-0] explorer target reached - distance: 0.00
fsmLogger.js:273 🚀 MOUVEMENT [22:21:52] ✅ [bot-0] Tile explored by explorer: "B3"
fsmLogger.js:273 🚀 MOUVEMENT [22:21:52] 💎 [bot-0] explorer discovered resources: {"food":0,"debris":0,"special":0}
fsmLogger.js:273 📜 HISTORY [22:21:52] Received sync event: DRONE_EXPLORES_TILE for bot bot-0
fsmLogger.js:273 🚀 MOUVEMENT [22:21:55] 🔍 [bot-0] explorer target reached - distance: 0.00
fsmLogger.js:273 🚀 MOUVEMENT [22:21:55] ✅ [bot-0] Tile explored by explorer: "B3"
fsmLogger.js:273 🚀 MOUVEMENT [22:21:55] 💎 [bot-0] explorer discovered resources: {"food":0,"debris":64,"special":0}
fsmLogger.js:273 📜 HISTORY [22:21:55] Received sync event: DRONE_EXPLORES_TILE for bot bot-0
