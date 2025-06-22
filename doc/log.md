fsmLogger.js:277 🎮 GAME [13:11:49] Game store initialized
fsmLogger.js:277 🔴 ERROR [13:11:49] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 🔵 INFO [13:11:49] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:277 🔵 INFO [13:11:49] Système FSM: DÉMARRÉ
fsmLogger.js:277 🔴 ERROR [13:11:49] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:11:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:11:49] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [13:11:49] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 📜 HISTORY [13:11:49] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:11:49] NO context change detected for bot null
fsmLogger.js:277 🔵 INFO [13:11:49] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [13:11:49] Tiles initialized {component: 'tiles'}
fsmLogger.js:270 🎮 GAME [13:11:49] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:270 🔵 INFO [13:11:49] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:277 🔴 ERROR [13:11:49] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:11:49] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:11:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [13:11:49] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🚀 MOUVEMENT [13:11:49] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -2.2, y: 0.8, z: -1.0588457268119895}
fsmLogger.js:270 🚀 MOUVEMENT [13:11:49] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -2.7, y: 0.5, z: -1.5588457268119895}
fsmLogger.js:270 🔧 CONTEXT [13:11:49] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [13:11:49] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [13:11:49] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'C2', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:270 🔵 INFO [13:11:51] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, tilesExplored: 0, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:11:51] 🔍 [Evaluating] Checking exploration guards {hasUnexplored: true, needsMoreExploration: true, isDroneInactive: true, canDeploy: true, deploymentAttempted: undefined, …}
fsmLogger.js:270 🔵 INFO [13:11:51] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:11:51] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:11:51] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:11:51] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:11:51] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:11:51] 🚀 [bot-0] explorer drone deployed - distance: 2.33
fsmLogger.js:277 📜 HISTORY [13:11:51] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:11:54] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:11:54] ✅ [bot-0] Tile explored by explorer: "B2"
fsmLogger.js:277 💎 RESOURCES [13:11:54] 💎 [bot-0] explorer discovered resources from tile: {"food":15,"debris":118,"special":0}
fsmLogger.js:270 🔵 INFO [13:11:54] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'B2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:11:54] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'B2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:11:54] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:11:54] 🗺️ Tile B2 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:11:54] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:11:54] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:11:55] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:270 🔧 CONTEXT [13:11:55] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.599149016761701}
fsmLogger.js:277 📜 HISTORY [13:11:55] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:11:56] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:270 🔵 INFO [13:11:56] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:270 🔵 INFO [13:11:56] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [13:11:56] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:11:56] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:11:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:11:56] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:270 🔵 INFO [13:11:58] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, tilesExplored: 1, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:11:58] 🔍 [Evaluating] Checking exploration guards {hasUnexplored: true, needsMoreExploration: true, isDroneInactive: true, canDeploy: true, deploymentAttempted: false, …}
fsmLogger.js:270 🔵 INFO [13:11:58] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:11:58] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:11:58] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:11:58] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:11:58] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:11:58] 🚀 [bot-0] explorer drone deployed - distance: 1.71
fsmLogger.js:277 📜 HISTORY [13:11:58] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:12:01] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:12:01] ✅ [bot-0] Tile explored by explorer: "C1"
fsmLogger.js:277 💎 RESOURCES [13:12:01] 💎 [bot-0] explorer discovered resources from tile: {"food":22,"debris":689,"special":0}
fsmLogger.js:270 🔵 INFO [13:12:01] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C1', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:12:01] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C1', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:12:01] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:12:01] 🗺️ Tile C1 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:12:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:12:01] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:12:02] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:270 🔧 CONTEXT [13:12:02] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5989935943778782}
fsmLogger.js:277 📜 HISTORY [13:12:02] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:12:03] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:270 🔵 INFO [13:12:03] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:270 🔵 INFO [13:12:03] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [13:12:03] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:12:03] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:12:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:12:03] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:270 🔵 INFO [13:12:05] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, tilesExplored: 2, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:12:05] 🔍 [Evaluating] Checking exploration guards {hasUnexplored: true, needsMoreExploration: true, isDroneInactive: true, canDeploy: true, deploymentAttempted: false, …}
fsmLogger.js:270 🔵 INFO [13:12:05] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:12:05] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:12:05] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:12:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:12:05] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:12:05] 🚀 [bot-0] explorer drone deployed - distance: 2.03
fsmLogger.js:277 📜 HISTORY [13:12:05] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:12:08] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:12:08] ✅ [bot-0] Tile explored by explorer: "C3"
fsmLogger.js:277 💎 RESOURCES [13:12:08] 💎 [bot-0] explorer discovered resources from tile: {"food":81,"debris":811,"special":2}
fsmLogger.js:270 🔵 INFO [13:12:08] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C3', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:12:08] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C3', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:12:08] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:12:08] 🗺️ Tile C3 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:12:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:12:08] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:12:09] 🏠 [bot-0] explorer drone approaching ship - distance: 0.60
fsmLogger.js:270 🔧 CONTEXT [13:12:09] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5989181805310771}
fsmLogger.js:277 📜 HISTORY [13:12:09] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:12:10] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:270 🔵 INFO [13:12:10] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:270 🔵 INFO [13:12:10] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [13:12:10] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:12:10] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:12:10] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:12:10] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:270 🔵 INFO [13:12:12] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, tilesExplored: 3, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:12:12] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
shipCollectingActions.js:503 Uncaught TypeError: fsmLogger.logInfo is not a function
    at Object.selectBestTileForCollection (shipCollectingActions.js:503:13)
    at Object.<anonymous> (evaluatingState.js:148:58)
    at callForward (chunk-4EZ7HHGP.js?v=23a37820:13:49)
    at Object.<anonymous> (chunk-4EZ7HHGP.js?v=23a37820:18:14)
    at transitionTo (chunk-4EZ7HHGP.js?v=23a37820:142:35)
    at send (chunk-4EZ7HHGP.js?v=23a37820:162:12)
    at Object.send (chunk-4EZ7HHGP.js?v=23a37820:170:5)
    at useBotMachine.js:71:20
    at useBotMachine.js:125:9
selectBestTileForCollection @ shipCollectingActions.js:503
(anonymous) @ evaluatingState.js:148
callForward @ chunk-4EZ7HHGP.js?v=23a37820:13
(anonymous) @ chunk-4EZ7HHGP.js?v=23a37820:18
transitionTo @ chunk-4EZ7HHGP.js?v=23a37820:142
send @ chunk-4EZ7HHGP.js?v=23a37820:162
send @ chunk-4EZ7HHGP.js?v=23a37820:170
(anonymous) @ useBotMachine.js:71
(anonymous) @ useBotMachine.js:125
setTimeout
(anonymous) @ useBotMachine.js:124
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=23a37820:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=23a37820:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=23a37820:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=23a37820:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=23a37820:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=23a37820:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=23a37820:19447
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18667
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
