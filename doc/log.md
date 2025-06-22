fsmLogger.js:277 🎮 GAME [13:00:01] Game store initialized
fsmLogger.js:277 🔴 ERROR [13:00:01] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 🔵 INFO [13:00:01] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:277 🔵 INFO [13:00:01] Système FSM: DÉMARRÉ
fsmLogger.js:277 🔴 ERROR [13:00:01] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:00:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:00:01] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [13:00:01] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 📜 HISTORY [13:00:01] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:00:01] NO context change detected for bot null
fsmLogger.js:277 🔵 INFO [13:00:01] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [13:00:01] Tiles initialized {component: 'tiles'}
fsmLogger.js:270 🎮 GAME [13:00:01] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:270 🔵 INFO [13:00:01] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:277 🔴 ERROR [13:00:01] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:00:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:00:01] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:00:01] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:00:01] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 📜 HISTORY [13:00:01] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 🚀 MOUVEMENT [13:00:01] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -2.2, y: 0.8, z: -1.0588457268119895}
fsmLogger.js:270 🚀 MOUVEMENT [13:00:01] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -2.7, y: 0.5, z: -1.5588457268119895}
fsmLogger.js:270 🔧 CONTEXT [13:00:01] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [13:00:01] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [13:00:01] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'C2', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:270 📜 HISTORY [13:00:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [13:00:01] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 📜 HISTORY [13:00:03] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:00:03] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:00:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:00:03] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:00:03] 🚀 [bot-0] explorer drone deployed - distance: 2.34
fsmLogger.js:277 📜 HISTORY [13:00:03] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:00:06] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:00:06] ✅ [bot-0] Tile explored by explorer: "B2"
fsmLogger.js:277 💎 RESOURCES [13:00:06] 💎 [bot-0] explorer discovered resources from tile: {"food":72,"debris":745,"special":0}
fsmLogger.js:270 🔵 INFO [13:00:06] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'B2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:00:06] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'B2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:00:06] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:00:06] 🗺️ Tile B2 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:00:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:00:06] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:00:07] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:270 🔧 CONTEXT [13:00:07] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5979258951017183}
fsmLogger.js:277 📜 HISTORY [13:00:07] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:00:08] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:270 🔵 INFO [13:00:08] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:270 🔵 INFO [13:00:08] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [13:00:08] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:00:08] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:00:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:00:08] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:270 🔵 INFO [13:00:10] 🏠 [isAtBase] Check: {basePosition: {…}, currentPosition: {…}, distance: '0.00', tolerance: 1, result: true}
fsmLogger.js:277 📜 HISTORY [13:00:10] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:00:10] State transition detected: evaluating → idleAtBase for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:00:10] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [13:00:10] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
