fsmLogger.js:277 🎮 GAME [13:32:47] Game store initialized
fsmLogger.js:277 🔴 ERROR [13:32:47] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 🔵 INFO [13:32:47] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'evaluating', hasStartedExploring: false, shouldStartEvaluation: true, tilesExplored: 0}
fsmLogger.js:277 🔵 INFO [13:32:47] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:277 🔵 INFO [13:32:47] Système FSM: DÉMARRÉ
fsmLogger.js:277 🔴 ERROR [13:32:47] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:47] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:32:47] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [13:32:47] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 🔵 INFO [13:32:47] 🔍 [useBotMachine] Evaluation trigger check for null {state: 'evaluating', hasStartedExploring: false, shouldStartEvaluation: true, tilesExplored: 0}
fsmLogger.js:270 📜 HISTORY [13:32:47] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:32:47] NO context change detected for bot null
fsmLogger.js:277 🔵 INFO [13:32:47] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [13:32:47] Tiles initialized {component: 'tiles'}
fsmLogger.js:270 🎮 GAME [13:32:47] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:270 🔵 INFO [13:32:47] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:277 🔴 ERROR [13:32:47] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:47] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:32:47] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [13:32:47] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:47] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 📜 HISTORY [13:32:47] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 🚀 MOUVEMENT [13:32:47] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -3.1, y: 0.8, z: 0.5}
fsmLogger.js:270 🚀 MOUVEMENT [13:32:47] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -3.6, y: 0.5, z: 0}
fsmLogger.js:270 🔧 CONTEXT [13:32:47] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [13:32:47] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [13:32:47] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'B3', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:270 📜 HISTORY [13:32:47] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [13:32:47] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [13:32:49] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [13:32:49] 🔍 [hasExploredEnoughTiles] Guard check {exploredCount: 0, required: 3, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:49] 🔍 [hasBestTileForCollection] Guard check {totalKnownTiles: 0, collectibleTiles: 0, collectibleCoords: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:49] 🔍 [shouldTransitionToCollection] Guard check {exploredCount: 0, required: 3, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [13:32:49] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, tilesExplored: 0, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:49] 🔍 [Evaluating] Checking exploration guards {hasUnexplored: true, needsMoreExploration: true, isDroneInactive: true, canDeploy: true, deploymentAttempted: undefined, …}
fsmLogger.js:270 🔵 INFO [13:32:49] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:32:49] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔵 INFO [13:32:49] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'exploring_deploying', hasStartedExploring: true, shouldStartEvaluation: false, tilesExplored: 0}
fsmLogger.js:277 📜 HISTORY [13:32:49] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:49] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:32:49] 🚀 [bot-0] explorer drone deployed - distance: 2.30
fsmLogger.js:277 📜 HISTORY [13:32:49] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:32:50] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:32:50] ✅ [bot-0] Tile explored by explorer: "B2"
fsmLogger.js:277 💎 RESOURCES [13:32:50] 💎 [bot-0] explorer discovered resources from tile: {"food":38,"debris":319,"special":1}
fsmLogger.js:270 🔵 INFO [13:32:50] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'B2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:50] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'B2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:32:50] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:32:50] 🗺️ Tile B2 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:32:50] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:50] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:32:50] 🏠 [bot-0] explorer drone approaching ship - distance: 0.59
fsmLogger.js:270 🔧 CONTEXT [13:32:50] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5917507827594378}
fsmLogger.js:277 📜 HISTORY [13:32:50] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:270 🔵 INFO [13:32:50] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'evaluating', hasStartedExploring: false, shouldStartEvaluation: true, tilesExplored: 0}
fsmLogger.js:277 🔵 INFO [13:32:50] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:270 📜 HISTORY [13:32:50] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:32:50] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [13:32:50] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 🔵 INFO [13:32:50] 🔍 [useBotMachine] Evaluation trigger check for null {state: 'evaluating', hasStartedExploring: false, shouldStartEvaluation: true, tilesExplored: 0}
fsmLogger.js:270 📜 HISTORY [13:32:50] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [13:32:50] NO context change detected for bot null
fsmLogger.js:270 🚀 MOUVEMENT [13:32:50] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: -3.1, y: 0.8, z: 0.5}
fsmLogger.js:270 🚀 MOUVEMENT [13:32:50] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: -3.6, y: 0.5, z: 0}
fsmLogger.js:277 📜 HISTORY [13:32:50] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [13:32:51] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [13:32:51] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [13:32:51] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'B3', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:270 🔵 INFO [13:32:51] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:270 📜 HISTORY [13:32:51] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [13:32:51] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
chunk-4OO23XFX.js?v=23a37820:17835 THREE.WebGLRenderer: Context Lost.
fsmLogger.js:277 🔵 INFO [13:32:53] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [13:32:53] 🔍 [hasExploredEnoughTiles] Guard check {exploredCount: 0, required: 3, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:53] 🔍 [hasBestTileForCollection] Guard check {totalKnownTiles: 0, collectibleTiles: 0, collectibleCoords: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:53] 🔍 [shouldTransitionToCollection] Guard check {exploredCount: 0, required: 3, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [13:32:53] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, tilesExplored: 0, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:53] 🔍 [Evaluating] Checking exploration guards {hasUnexplored: true, needsMoreExploration: true, isDroneInactive: true, canDeploy: true, deploymentAttempted: undefined, …}
fsmLogger.js:270 🔵 INFO [13:32:53] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:32:53] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔵 INFO [13:32:53] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'exploring_deploying', hasStartedExploring: true, shouldStartEvaluation: false, tilesExplored: 0}
fsmLogger.js:277 📜 HISTORY [13:32:53] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:53] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:53] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:32:53] 🚀 [bot-0] explorer drone deployed - distance: 1.10
fsmLogger.js:277 📜 HISTORY [13:32:53] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:32:53] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:32:53] ✅ [bot-0] Tile explored by explorer: "B4"
fsmLogger.js:277 💎 RESOURCES [13:32:53] 💎 [bot-0] explorer discovered resources from tile: {"food":27,"debris":715,"special":1}
fsmLogger.js:270 🔵 INFO [13:32:53] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'B4', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:53] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'B4', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:32:53] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:32:53] 🗺️ Tile B4 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:32:53] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:53] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:32:53] 🏠 [bot-0] explorer drone approaching ship - distance: 0.59
fsmLogger.js:270 🔧 CONTEXT [13:32:53] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5891999510419492}
fsmLogger.js:277 📜 HISTORY [13:32:53] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:32:54] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:270 🔵 INFO [13:32:54] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:270 🔵 INFO [13:32:54] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [13:32:54] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:270 🔵 INFO [13:32:54] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'evaluating', hasStartedExploring: false, shouldStartEvaluation: true, tilesExplored: 1}
fsmLogger.js:277 🔵 INFO [13:32:54] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [13:32:54] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:54] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:54] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [13:32:56] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [13:32:56] 🔍 [hasExploredEnoughTiles] Guard check {exploredCount: 1, required: 3, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:56] 🔍 [hasBestTileForCollection] Guard check {totalKnownTiles: 1, collectibleTiles: 1, collectibleCoords: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:56] 🔍 [shouldTransitionToCollection] Guard check {exploredCount: 1, required: 3, hasEnoughExplored: false, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [13:32:56] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, tilesExplored: 1, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:56] 🔍 [Evaluating] Checking exploration guards {hasUnexplored: true, needsMoreExploration: true, isDroneInactive: true, canDeploy: true, deploymentAttempted: false, …}
fsmLogger.js:270 🔵 INFO [13:32:56] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:32:56] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔵 INFO [13:32:56] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'exploring_deploying', hasStartedExploring: true, shouldStartEvaluation: false, tilesExplored: 1}
fsmLogger.js:277 📜 HISTORY [13:32:56] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:56] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:32:56] 🚀 [bot-0] explorer drone deployed - distance: 1.60
fsmLogger.js:277 📜 HISTORY [13:32:56] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:32:56] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:32:56] ✅ [bot-0] Tile explored by explorer: "C3"
fsmLogger.js:277 💎 RESOURCES [13:32:56] 💎 [bot-0] explorer discovered resources from tile: {"food":52,"debris":364,"special":1}
fsmLogger.js:270 🔵 INFO [13:32:56] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C3', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:56] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C3', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:32:56] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:32:56] 🗺️ Tile C3 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:32:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:56] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:32:57] 🏠 [bot-0] explorer drone approaching ship - distance: 0.58
fsmLogger.js:270 🔧 CONTEXT [13:32:57] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5848142692975168}
fsmLogger.js:277 📜 HISTORY [13:32:57] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:32:57] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:270 🔵 INFO [13:32:57] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:270 🔵 INFO [13:32:57] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [13:32:57] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [13:32:57] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:270 🔵 INFO [13:32:57] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'evaluating', hasStartedExploring: false, shouldStartEvaluation: true, tilesExplored: 2}
fsmLogger.js:277 📜 HISTORY [13:32:57] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:57] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:57] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [13:32:59] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [13:32:59] 🔍 [hasExploredEnoughTiles] Guard check {exploredCount: 2, required: 3, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:59] 🔍 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 2, collectibleCoords: Array(2), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:59] 🔍 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 3, hasEnoughExplored: false, collectibleTiles: 2, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [13:32:59] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, tilesExplored: 2, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:32:59] 🔍 [Evaluating] Checking exploration guards {hasUnexplored: true, needsMoreExploration: true, isDroneInactive: true, canDeploy: true, deploymentAttempted: false, …}
fsmLogger.js:270 🔵 INFO [13:32:59] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:32:59] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔵 INFO [13:32:59] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'exploring_deploying', hasStartedExploring: true, shouldStartEvaluation: false, tilesExplored: 2}
fsmLogger.js:277 📜 HISTORY [13:32:59] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:32:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:32:59] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:32:59] 🚀 [bot-0] explorer drone deployed - distance: 1.61
fsmLogger.js:277 📜 HISTORY [13:32:59] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:33:00] 🔍 [bot-0] explorer target reached - distance: 0.25
fsmLogger.js:277 🚀 MOUVEMENT [13:33:00] ✅ [bot-0] Tile explored by explorer: "C2"
fsmLogger.js:277 💎 RESOURCES [13:33:00] 💎 [bot-0] explorer discovered resources from tile: {"food":53,"debris":330,"special":2}
fsmLogger.js:270 🔵 INFO [13:33:00] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:33:00] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [13:33:00] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [13:33:00] 🗺️ Tile C2 is now marked as explored
fsmLogger.js:270 📜 HISTORY [13:33:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:33:00] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [13:33:00] 🏠 [bot-0] explorer drone approaching ship - distance: 0.59
fsmLogger.js:270 🔧 CONTEXT [13:33:00] 🔍 [DEBUG] Sending DRONE_APPROACHING_SHIP event {botId: 'bot-0', droneType: 'explorer', hookInstanceId: 'bot-0-explorer', eventKey: 'drone_returning_approaching_bot-0_explorer', distance: 0.5944147187664877}
fsmLogger.js:277 📜 HISTORY [13:33:00] Received sync event: DRONE_APPROACHING_SHIP for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [13:33:00] 🏠 [bot-0] explorer drone reached ship - distance: 0.25
fsmLogger.js:270 🔵 INFO [13:33:00] 🏠 [Exploring] DRONE_REACHED_SHIP guard check {botId: 'bot-0', droneState: 'returning', isActive: true, shouldTransition: true}
fsmLogger.js:270 🔵 INFO [13:33:00] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [13:33:00] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [13:33:00] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:270 🔵 INFO [13:33:00] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'evaluating', hasStartedExploring: false, shouldStartEvaluation: true, tilesExplored: 3}
fsmLogger.js:277 📜 HISTORY [13:33:00] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:33:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [13:33:00] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [13:33:02] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [13:33:02] 🔍 [hasExploredEnoughTiles] Guard check {exploredCount: 3, required: 3, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:33:02] 🔍 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleCoords: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:33:02] 🔍 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 3, hasEnoughExplored: true, collectibleTiles: 3, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [13:33:02] 🔍 [Evaluating] Checking multi-tile cycle guards {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, tilesExplored: 3, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:33:02] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [13:33:02] 🎯 [selectBestTileForCollection] Selected best tile {coord: 'B4', value: 779, availableTiles: 3, selectedTile: {…}}
fsmLogger.js:277 📜 HISTORY [13:33:02] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔵 INFO [13:33:02] 🔍 [useBotMachine] Evaluation trigger check for bot-0 {state: 'collecting_moving_to_target', hasStartedExploring: true, shouldStartEvaluation: false, tilesExplored: 3}
fsmLogger.js:277 📜 HISTORY [13:33:02] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [13:33:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [13:33:02] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
