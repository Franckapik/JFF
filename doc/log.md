fsmLogger.js:277 🎮 GAME [00:29:03] Game store initialized
fsmLogger.js:277 🔴 ERROR [00:29:03] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:03] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:277 🔵 INFO [00:29:03] Système FSM: DÉMARRÉ
fsmLogger.js:277 🔴 ERROR [00:29:03] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:03] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [00:29:03] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 📜 HISTORY [00:29:03] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:03] NO context change detected for bot null
fsmLogger.js:277 🔵 INFO [00:29:03] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [00:29:03] Tiles initialized {component: 'tiles'}
fsmLogger.js:270 🎮 GAME [00:29:03] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:270 🔵 INFO [00:29:03] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:277 🔴 ERROR [00:29:03] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:03] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:03] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:03] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 📜 HISTORY [00:29:03] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 🚀 MOUVEMENT [00:29:03] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 2.3, y: 0.8, z: 3.617691453623979}
fsmLogger.js:270 🚀 MOUVEMENT [00:29:03] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 1.8, y: 0.5, z: 3.117691453623979}
fsmLogger.js:270 🔧 CONTEXT [00:29:03] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [00:29:03] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [00:29:03] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'D5', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:270 📜 HISTORY [00:29:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:03] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [00:29:05] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:05] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 0, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:05] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 0, required: 5, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [00:29:05] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:05] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:05] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:05] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:05] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:05] 🚀 [bot-0] explorer drone deployed - distance: 2.27
fsmLogger.js:277 📜 HISTORY [00:29:05] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:05] 🔍 [bot-0] explorer target reached - distance: 0.60
fsmLogger.js:277 🚀 MOUVEMENT [00:29:05] ✅ [bot-0] Tile explored by explorer: "C5"
fsmLogger.js:277 💎 RESOURCES [00:29:05] 💎 [bot-0] explorer discovered resources from tile: {"food":79,"debris":513,"special":1}
fsmLogger.js:270 🔵 INFO [00:29:05] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C5', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:05] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C5', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:05] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:05] 🗺️ Tile C5 is now marked as explored
fsmLogger.js:270 📜 HISTORY [00:29:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:05] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:06] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [00:29:06] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [00:29:06] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:06] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:06] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:06] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [00:29:08] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:08] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 1, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:08] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: false, totalExploredCount: 1, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:08] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 1, required: 5, hasEnoughExplored: false, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [00:29:08] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:08] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:08] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:08] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:08] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:08] 🚀 [bot-0] explorer drone deployed - distance: 1.58
fsmLogger.js:277 📜 HISTORY [00:29:08] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:08] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [00:29:08] ✅ [bot-0] Tile explored by explorer: "D4"
fsmLogger.js:277 💎 RESOURCES [00:29:08] 💎 [bot-0] explorer discovered resources from tile: {"food":6,"debris":69,"special":2}
fsmLogger.js:270 🔵 INFO [00:29:08] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'D4', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:08] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'D4', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:08] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:08] 🗺️ Tile D4 is now marked as explored
fsmLogger.js:270 📜 HISTORY [00:29:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:08] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:08] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [00:29:08] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [00:29:08] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:08] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:08] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:08] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [00:29:10] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:10] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 2, collectibleDetails: Array(2), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:10] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: false, totalExploredCount: 2, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:10] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 5, hasEnoughExplored: false, collectibleTiles: 2, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [00:29:10] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:10] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:10] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:10] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:10] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:10] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:10] 🚀 [bot-0] explorer drone deployed - distance: 2.35
fsmLogger.js:277 📜 HISTORY [00:29:10] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:11] 🔍 [bot-0] explorer target reached - distance: 0.60
fsmLogger.js:277 🚀 MOUVEMENT [00:29:11] ✅ [bot-0] Tile explored by explorer: "D6"
fsmLogger.js:277 💎 RESOURCES [00:29:11] 💎 [bot-0] explorer discovered resources from tile: {"food":58,"debris":328,"special":2}
fsmLogger.js:270 🔵 INFO [00:29:11] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'D6', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:11] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'D6', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:11] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:11] 🗺️ Tile D6 is now marked as explored
fsmLogger.js:270 📜 HISTORY [00:29:11] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:11] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:11] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [00:29:11] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [00:29:11] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:11] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:11] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:11] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [00:29:11] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [00:29:13] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:13] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:13] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:13] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:13] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [00:29:13] [bot-0] Selected tile C5 for collection: {"food":79,"debris":513,"special":1}, position: {"x":0.5819738286889298,"y":0.5534400313113881,"z":3.2442075033389637}
fsmLogger.js:270 🔵 INFO [00:29:13] [bot-0] Preparing ship movement to collection target: C5 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [00:29:13] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:13] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:13] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:13] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [00:29:13] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '1.30', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:13] 🚢 [bot-0] Ship movement started - distance: 1.30
fsmLogger.js:270 🔵 INFO [00:29:13] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:13] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:14] 🚢 [bot-0] Ship movement started - distance: 0.88
fsmLogger.js:277 📜 HISTORY [00:29:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:14] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:14] 🚢 [bot-0] Ship movement started - distance: 0.60
fsmLogger.js:270 🔵 INFO [00:29:14] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:14] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:15] 🚢 [bot-0] Ship movement started - distance: 0.46
fsmLogger.js:277 📜 HISTORY [00:29:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:15] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [00:29:15] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.45', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:15] 🚢 [bot-0] Ship movement started - distance: 0.48
fsmLogger.js:270 🔵 INFO [00:29:15] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:15] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:16] 🚢 [bot-0] Ship movement started - distance: 0.53
fsmLogger.js:277 📜 HISTORY [00:29:16] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:16] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:16] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:16] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-TRANSITION-1: SHIP_ARRIVED_AT_TILE guard evaluation (RETURNING_TO_BASE) {isMovingToTarget: true, shouldReturn: false, guardResult: false, currentAction: 'moving_to_target', selectedTileCoord: 'C5', …}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-TRANSITION-2: SHIP_ARRIVED_AT_TILE guard evaluation (EVALUATING) {isMovingToTarget: true, shouldReturn: false, guardResult: true, currentAction: 'moving_to_target', selectedTileCoord: 'C5', …}
fsmLogger.js:270 🔵 INFO [00:29:16] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'C5', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-TRANSITION-2-EXEC: Executing transition to EVALUATING {event: {…}, selectedTileCoord: 'C5', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 🔵 INFO [00:29:16] [bot-0] Starting collection from tile C5
fsmLogger.js:277 💎 RESOURCES [00:29:16] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-TILE-BEFORE: Tile state before collection {coord: 'C5', tileExists: true, tileData: {…}, knownTilesTotal: 3, memoryTimestamp: undefined}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] Attempting collection from tile C5 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:16] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-VEHICLE-BEFORE: Vehicle state before collection {vehicleId: 'bot-0-ship', vehicleType: 'main_ship', currentResources: {…}, maxCapacity: {…}, lastCollectionTime: undefined, …}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 📊 Resource calculation for food {available: 79, current: 0, maxCapacity: 25, canCollect: 25, willCollect: 25, …}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 📊 Resource calculation for debris {available: 513, current: 0, maxCapacity: 100, canCollect: 100, willCollect: 100, …}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 📊 Resource calculation for special {available: 1, current: 0, maxCapacity: 1, canCollect: 1, willCollect: 1, …}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 📊 PARTIAL COLLECTION CALCULATED {availableResources: {…}, resourcesToCollect: {…}, remainingResources: {…}, currentResources: {…}, maxCapacity: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:16] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-VEHICLE-AFTER: Vehicle state after collection {vehicleId: 'bot-0-ship', previousResources: {…}, resourcesToCollect: {…}, updatedResources: {…}, resourceChanges: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:16] [bot-0] Collection successful: +{"food":25,"debris":100,"special":1} -> Vehicle resources: {"food":25,"debris":100,"special":1} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-TILE-AFTER-FSM: Tile state after FSM update {coord: 'C5', previousTileData: {…}, updatedTileData: {…}, fsmMemoryUpdated: true, knownTilesSize: 3}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] Tile C5 marked as collected in FSM memory {collected: false, collectedAt: null, totalCollected: 126}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-STORE-BEFORE: TileStore state before sync {coord: 'C5', tileStoreExists: true, tileExistsInStore: true, tileStoreData: {…}, resourcesToDeduct: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:16] 🔍 DEBUG: deductTileResources called {coord: 'C5', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:16] 🔍 DEBUG: Resource percentage calculated {coord: 'C5', originalResources: {…}, remainingResources: {…}, totalOriginal: 593, totalRemaining: 467, …}
fsmLogger.js:270 💎 RESOURCES [00:29:16] 🔍 DEBUG: TileStore updated successfully {coord: 'C5', newPercentage: 79, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-STORE-AFTER: TileStore state after sync {coord: 'C5', syncSuccess: true, tileStoreStateBefore: {…}, tileStoreStateAfter: {…}, resourcesDeducted: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'C5', deductedResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:16] [bot-0] 🔍 PHASE3-FINAL: Collection completed successfully {coord: 'C5', collectionDuration: 4, vehicleIdBefore: 'bot-0-ship', vehicleIdAfter: 'bot-0-ship', resourcesBefore: {…}, …}
fsmLogger.js:277 📜 HISTORY [00:29:16] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [00:29:16] 🔍 DEBUG: Tile C5 resource percentage update {coord: 'C5', resourcePercentage: 2, isPartiallyCollected: true, isCompletelyCollected: false, shouldShowPercentage: false, …}
fsmLogger.js:277 🔵 INFO [00:29:16] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:16] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:16] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [00:29:18] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:18] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:18] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:18] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [00:29:18] [bot-0] Selected tile C5 for collection: {"food":54,"debris":413,"special":0}, position: {"x":0.5819738286889298,"y":0.5534400313113881,"z":3.2442075033389637}
fsmLogger.js:270 🔵 INFO [00:29:18] [bot-0] Preparing ship movement to collection target: C5 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [00:29:18] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:18] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:18] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:18] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [00:29:18] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.00', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:18] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] Ship should return to base: {"food":25,"debris":100,"special":1} (100% full - F:100% D:100% S:100%) - Threshold: 80% {currentResources: {…}, maxCapacity: {…}, capacityChecks: {…}, individualPercentages: {…}, totalResources: 126, …}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] 🔍 PHASE3-TRANSITION-1: SHIP_ARRIVED_AT_TILE guard evaluation (RETURNING_TO_BASE) {isMovingToTarget: true, shouldReturn: true, guardResult: true, currentAction: 'moving_to_target', selectedTileCoord: 'C5', …}
fsmLogger.js:270 🔵 INFO [00:29:18] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'C5', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] 🔍 PHASE3-TRANSITION-1-EXEC: Executing transition to RETURNING_TO_BASE {event: {…}, selectedTileCoord: 'C5', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 🔵 INFO [00:29:18] [bot-0] Starting collection from tile C5
fsmLogger.js:277 💎 RESOURCES [00:29:18] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] 🔍 PHASE3-TILE-BEFORE: Tile state before collection {coord: 'C5', tileExists: true, tileData: {…}, knownTilesTotal: 3, memoryTimestamp: undefined}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] Attempting collection from tile C5 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:18] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] 🔍 PHASE3-VEHICLE-BEFORE: Vehicle state before collection {vehicleId: 'bot-0-ship', vehicleType: 'main_ship', currentResources: {…}, maxCapacity: {…}, lastCollectionTime: 1750631356597, …}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] 📊 Resource calculation for food {available: 54, current: 25, maxCapacity: 25, canCollect: 0, willCollect: 0, …}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] 📊 Resource calculation for debris {available: 413, current: 100, maxCapacity: 100, canCollect: 0, willCollect: 0, …}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] ❌ FAILED: Cannot collect anything (capacity full) {totalCurrent: 126, totalMaxCapacity: 126, currentResources: {…}, maxCapacity: {…}, availableResources: {…}}
fsmLogger.js:270 🔵 INFO [00:29:18] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:18] [bot-0] 🔍 PHASE3-TRANSITION-2: SHIP_ARRIVED_AT_TILE guard evaluation (EVALUATING) {isMovingToTarget: false, shouldReturn: true, guardResult: false, currentAction: 'returning_to_base', selectedTileCoord: 'C5', …}
fsmLogger.js:270 🔵 INFO [00:29:18] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'C5', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [00:29:18] [bot-0] Deposit successful: +{"food":25,"debris":100,"special":1} -> Total Score: {"food":25,"debris":100,"special":1}
fsmLogger.js:277 📜 HISTORY [00:29:18] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:18] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:18] State transition detected: collecting_moving_to_target → collecting_returning_to_base for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:20] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:20] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:20] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:20] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [00:29:20] [bot-0] Selected tile C5 for collection: {"food":54,"debris":413,"special":0}, position: {"x":0.5819738286889298,"y":0.5534400313113881,"z":3.2442075033389637}
fsmLogger.js:270 🔵 INFO [00:29:20] [bot-0] Preparing ship movement to collection target: C5 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [00:29:20] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [00:29:20] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.00', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:20] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-TRANSITION-1: SHIP_ARRIVED_AT_TILE guard evaluation (RETURNING_TO_BASE) {isMovingToTarget: true, shouldReturn: false, guardResult: false, currentAction: 'moving_to_target', selectedTileCoord: 'C5', …}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-TRANSITION-2: SHIP_ARRIVED_AT_TILE guard evaluation (EVALUATING) {isMovingToTarget: true, shouldReturn: false, guardResult: true, currentAction: 'moving_to_target', selectedTileCoord: 'C5', …}
fsmLogger.js:270 🔵 INFO [00:29:20] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'C5', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-TRANSITION-2-EXEC: Executing transition to EVALUATING {event: {…}, selectedTileCoord: 'C5', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 🔵 INFO [00:29:20] [bot-0] Starting collection from tile C5
fsmLogger.js:277 💎 RESOURCES [00:29:20] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-TILE-BEFORE: Tile state before collection {coord: 'C5', tileExists: true, tileData: {…}, knownTilesTotal: 3, memoryTimestamp: undefined}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] Attempting collection from tile C5 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:20] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-VEHICLE-BEFORE: Vehicle state before collection {vehicleId: 'bot-0-ship', vehicleType: 'main_ship', currentResources: {…}, maxCapacity: {…}, lastCollectionTime: 1750631356597, …}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 📊 Resource calculation for food {available: 54, current: 0, maxCapacity: 25, canCollect: 25, willCollect: 25, …}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 📊 Resource calculation for debris {available: 413, current: 0, maxCapacity: 100, canCollect: 100, willCollect: 100, …}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 📊 PARTIAL COLLECTION CALCULATED {availableResources: {…}, resourcesToCollect: {…}, remainingResources: {…}, currentResources: {…}, maxCapacity: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:20] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-VEHICLE-AFTER: Vehicle state after collection {vehicleId: 'bot-0-ship', previousResources: {…}, resourcesToCollect: {…}, updatedResources: {…}, resourceChanges: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:20] [bot-0] Collection successful: +{"food":25,"debris":100,"special":0} -> Vehicle resources: {"food":25,"debris":100,"special":0} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-TILE-AFTER-FSM: Tile state after FSM update {coord: 'C5', previousTileData: {…}, updatedTileData: {…}, fsmMemoryUpdated: true, knownTilesSize: 3}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] Tile C5 marked as collected in FSM memory {collected: false, collectedAt: null, totalCollected: 251}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-STORE-BEFORE: TileStore state before sync {coord: 'C5', tileStoreExists: true, tileExistsInStore: true, tileStoreData: {…}, resourcesToDeduct: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:20] 🔍 DEBUG: deductTileResources called {coord: 'C5', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:20] 🔍 DEBUG: Resource percentage calculated {coord: 'C5', originalResources: {…}, remainingResources: {…}, totalOriginal: 593, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [00:29:20] 🔍 DEBUG: TileStore updated successfully {coord: 'C5', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-STORE-AFTER: TileStore state after sync {coord: 'C5', syncSuccess: true, tileStoreStateBefore: {…}, tileStoreStateAfter: {…}, resourcesDeducted: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'C5', deductedResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] 🔍 PHASE3-FINAL: Collection completed successfully {coord: 'C5', collectionDuration: 3, vehicleIdBefore: 'bot-0-ship', vehicleIdAfter: 'bot-0-ship', resourcesBefore: {…}, …}
fsmLogger.js:270 💎 RESOURCES [00:29:20] [bot-0] Ship should return to base: {"food":25,"debris":100,"special":1} (100% full - F:100% D:100% S:100%) - Threshold: 80% {currentResources: {…}, maxCapacity: {…}, capacityChecks: {…}, individualPercentages: {…}, totalResources: 126, …}
fsmLogger.js:270 🔵 INFO [00:29:20] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'C5', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [00:29:20] [bot-0] Deposit successful: +{"food":25,"debris":100,"special":1} -> Total Score: {"food":25,"debris":100,"special":1}
fsmLogger.js:277 📜 HISTORY [00:29:20] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:20] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:20] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:20] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 💎 RESOURCES [00:29:20] 🔍 DEBUG: Tile C5 resource percentage update {coord: 'C5', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 🔵 INFO [00:29:20] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [00:29:22] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:22] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:22] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:22] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:22] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [00:29:22] [bot-0] Selected tile C5 for collection: {"food":54,"debris":413,"special":0}, position: {"x":0.5819738286889298,"y":0.5534400313113881,"z":3.2442075033389637}
fsmLogger.js:270 🔵 INFO [00:29:22] [bot-0] Preparing ship movement to collection target: C5 {targetPosition: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:22] [bot-0] Selected tile D6 for collection: {"food":58,"debris":328,"special":2}, position: {"x":2.386098499157315,"y":0.5929300965453198,"z":4.176737132656384}
fsmLogger.js:270 🔵 INFO [00:29:22] [bot-0] Preparing ship movement to collection target: D6 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [00:29:22] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:22] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:22] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:22] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [00:29:22] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.01', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:22] 🚢 [bot-0] Ship movement started - distance: 2.01
fsmLogger.js:270 🔵 INFO [00:29:22] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:22] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:23] 🚢 [bot-0] Ship movement started - distance: 1.30
fsmLogger.js:277 📜 HISTORY [00:29:23] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:23] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:23] 🚢 [bot-0] Ship movement started - distance: 0.84
fsmLogger.js:270 🔵 INFO [00:29:23] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:23] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:23] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:24] 🚢 [bot-0] Ship movement started - distance: 0.56
fsmLogger.js:277 📜 HISTORY [00:29:24] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:24] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:24] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [00:29:24] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.51', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:25] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:270 🔵 INFO [00:29:25] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:25] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:25] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:25] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:25] 🚢 [bot-0] Ship movement started - distance: 0.49
fsmLogger.js:277 📜 HISTORY [00:29:25] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=23a37820:9119
(anonymous) @ chunk-RC3YDMAO.js?v=23a37820:18627
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18678
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
fsmLogger.js:270 📜 HISTORY [00:29:25] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:25] NO context change detected for bot bot-0
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=23a37820:9119
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=23a37820:19506
flushPassiveEffects @ chunk-RC3YDMAO.js?v=23a37820:19447
(anonymous) @ chunk-RC3YDMAO.js?v=23a37820:19328
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18678
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
fsmLogger.js:277 🚀 MOUVEMENT [00:29:26] 🚢 [bot-0] Ship movement started - distance: 0.49
fsmLogger.js:270 🔵 INFO [00:29:26] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:26] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=23a37820:9119
(anonymous) @ chunk-RC3YDMAO.js?v=23a37820:18627
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18678
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
fsmLogger.js:270 📜 HISTORY [00:29:26] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:26] NO context change detected for bot bot-0
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=23a37820:9119
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=23a37820:19506
flushPassiveEffects @ chunk-RC3YDMAO.js?v=23a37820:19447
(anonymous) @ chunk-RC3YDMAO.js?v=23a37820:19328
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
fsmLogger.js:277 🚀 MOUVEMENT [00:29:26] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] Ship should return to base: {"food":25,"debris":100,"special":0} (99% full - F:100% D:100% S:0%) - Threshold: 80% {currentResources: {…}, maxCapacity: {…}, capacityChecks: {…}, individualPercentages: {…}, totalResources: 125, …}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-TRANSITION-1: SHIP_ARRIVED_AT_TILE guard evaluation (RETURNING_TO_BASE) {isMovingToTarget: true, shouldReturn: true, guardResult: true, currentAction: 'moving_to_target', selectedTileCoord: 'D6', …}
fsmLogger.js:270 🔵 INFO [00:29:26] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'D6', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-TRANSITION-1-EXEC: Executing transition to RETURNING_TO_BASE {event: {…}, selectedTileCoord: 'D6', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 🔵 INFO [00:29:26] [bot-0] Starting collection from tile D6
fsmLogger.js:277 💎 RESOURCES [00:29:26] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-TILE-BEFORE: Tile state before collection {coord: 'D6', tileExists: true, tileData: {…}, knownTilesTotal: 3, memoryTimestamp: undefined}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] Attempting collection from tile D6 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:26] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-VEHICLE-BEFORE: Vehicle state before collection {vehicleId: 'bot-0-ship', vehicleType: 'main_ship', currentResources: {…}, maxCapacity: {…}, lastCollectionTime: 1750631360660, …}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 📊 Resource calculation for food {available: 58, current: 25, maxCapacity: 25, canCollect: 0, willCollect: 0, …}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 📊 Resource calculation for debris {available: 328, current: 100, maxCapacity: 100, canCollect: 0, willCollect: 0, …}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 📊 Resource calculation for special {available: 2, current: 0, maxCapacity: 1, canCollect: 1, willCollect: 1, …}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 📊 PARTIAL COLLECTION CALCULATED {availableResources: {…}, resourcesToCollect: {…}, remainingResources: {…}, currentResources: {…}, maxCapacity: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:26] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-VEHICLE-AFTER: Vehicle state after collection {vehicleId: 'bot-0-ship', previousResources: {…}, resourcesToCollect: {…}, updatedResources: {…}, resourceChanges: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:26] [bot-0] Collection successful: +{"food":0,"debris":0,"special":1} -> Vehicle resources: {"food":25,"debris":100,"special":1} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-TILE-AFTER-FSM: Tile state after FSM update {coord: 'D6', previousTileData: {…}, updatedTileData: {…}, fsmMemoryUpdated: true, knownTilesSize: 3}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] Tile D6 marked as collected in FSM memory {collected: false, collectedAt: null, totalCollected: 1}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-STORE-BEFORE: TileStore state before sync {coord: 'D6', tileStoreExists: true, tileExistsInStore: true, tileStoreData: {…}, resourcesToDeduct: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:26] 🔍 DEBUG: deductTileResources called {coord: 'D6', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:26] 🔍 DEBUG: Resource percentage calculated {coord: 'D6', originalResources: {…}, remainingResources: {…}, totalOriginal: 388, totalRemaining: 387, …}
fsmLogger.js:270 💎 RESOURCES [00:29:26] 🔍 DEBUG: TileStore updated successfully {coord: 'D6', newPercentage: 100, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-STORE-AFTER: TileStore state after sync {coord: 'D6', syncSuccess: true, tileStoreStateBefore: {…}, tileStoreStateAfter: {…}, resourcesDeducted: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'D6', deductedResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-FINAL: Collection completed successfully {coord: 'D6', collectionDuration: 4, vehicleIdBefore: 'bot-0-ship', vehicleIdAfter: 'bot-0-ship', resourcesBefore: {…}, …}
fsmLogger.js:270 🔵 INFO [00:29:26] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-TRANSITION-2: SHIP_ARRIVED_AT_TILE guard evaluation (EVALUATING) {isMovingToTarget: true, shouldReturn: false, guardResult: true, currentAction: 'moving_to_target', selectedTileCoord: 'C5', …}
fsmLogger.js:270 🔵 INFO [00:29:26] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'C5', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] 🔍 PHASE3-TRANSITION-2-EXEC: Executing transition to EVALUATING {event: {…}, selectedTileCoord: 'C5', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 🔵 INFO [00:29:26] [bot-0] Starting collection from tile C5
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] Attempting collection from tile C5 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:26] [bot-0] Collection successful: +{"food":25,"debris":100,"special":0} -> Vehicle resources: {"food":25,"debris":100,"special":0} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] Tile C5 marked as collected in FSM memory {collected: false, collectedAt: null, totalCollected: 251}
fsmLogger.js:270 💎 RESOURCES [00:29:26] [bot-0] Ship should return to base: {"food":25,"debris":100,"special":1} (100% full - F:100% D:100% S:100%) - Threshold: 80% {currentResources: {…}, maxCapacity: {…}, capacityChecks: {…}, individualPercentages: {…}, totalResources: 126, …}
fsmLogger.js:270 🔵 INFO [00:29:26] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'D6', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [00:29:26] [bot-0] Deposit successful: +{"food":25,"debris":100,"special":1} -> Total Score: {"food":50,"debris":200,"special":2}
fsmLogger.js:277 📜 HISTORY [00:29:26] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=23a37820:9119
(anonymous) @ chunk-RC3YDMAO.js?v=23a37820:18627
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
requestAnimationFrame
loop @ chunk-Q4YQWOCV.js?v=23a37820:16984
fsmLogger.js:270 💎 RESOURCES [00:29:26] 🔍 DEBUG: Tile D6 resource percentage update {coord: 'D6', resourcePercentage: 100, isPartiallyCollected: false, isCompletelyCollected: false, shouldShowPercentage: false, …}
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18678
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
fsmLogger.js:277 🔵 INFO [00:29:26] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:26] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:26] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=23a37820:9119
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=23a37820:19506
flushPassiveEffects @ chunk-RC3YDMAO.js?v=23a37820:19447
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18667
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18874
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=23a37820:9119
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=23a37820:19506
flushPassiveEffects @ chunk-RC3YDMAO.js?v=23a37820:19447
(anonymous) @ chunk-RC3YDMAO.js?v=23a37820:19328
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18678
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
hook.js:608 Warning: Encountered two children with the same key, `1750631362689.162`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version. Error Component Stack
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMVisualization (FSMDebugPanel.jsx:27:29)
    at div (<anonymous>)
    at div (<anonymous>)
    at FSMDebugPanel (FSMDebugPanel.jsx:508:3)
    at div (<anonymous>)
    at FSMSyncProvider (FSMSyncContext.jsx:23:35)
    at FSMProvider (FSMContext.jsx:27:31)
    at App (App.jsx:20:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=23a37820:17701
printWarning @ chunk-RC3YDMAO.js?v=23a37820:521
error @ chunk-RC3YDMAO.js?v=23a37820:505
warnOnInvalidKey @ chunk-RC3YDMAO.js?v=23a37820:10219
reconcileChildrenArray @ chunk-RC3YDMAO.js?v=23a37820:10235
reconcileChildFibers2 @ chunk-RC3YDMAO.js?v=23a37820:10559
reconcileChildren @ chunk-RC3YDMAO.js?v=23a37820:14292
updateFragment @ chunk-RC3YDMAO.js?v=23a37820:14522
beginWork @ chunk-RC3YDMAO.js?v=23a37820:15949
beginWork$1 @ chunk-RC3YDMAO.js?v=23a37820:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=23a37820:19198
workLoopSync @ chunk-RC3YDMAO.js?v=23a37820:19137
renderRootSync @ chunk-RC3YDMAO.js?v=23a37820:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=23a37820:18678
workLoop @ chunk-RC3YDMAO.js?v=23a37820:197
flushWork @ chunk-RC3YDMAO.js?v=23a37820:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=23a37820:384
fsmLogger.js:277 🔵 INFO [00:29:28] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:28] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:28] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:28] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [00:29:28] [bot-0] Selected tile D6 for collection: {"food":58,"debris":328,"special":2}, position: {"x":2.386098499157315,"y":0.5929300965453198,"z":4.176737132656384}
fsmLogger.js:270 🔵 INFO [00:29:28] [bot-0] Preparing ship movement to collection target: D6 {targetPosition: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:28] [bot-0] Selected tile D6 for collection: {"food":58,"debris":328,"special":1}, position: {"x":2.386098499157315,"y":0.5929300965453198,"z":4.176737132656384}
fsmLogger.js:277 📜 HISTORY [00:29:28] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:28] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:28] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:28] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [00:29:28] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.00', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:28] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-TRANSITION-1: SHIP_ARRIVED_AT_TILE guard evaluation (RETURNING_TO_BASE) {isMovingToTarget: true, shouldReturn: false, guardResult: false, currentAction: 'moving_to_target', selectedTileCoord: 'D6', …}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-TRANSITION-2: SHIP_ARRIVED_AT_TILE guard evaluation (EVALUATING) {isMovingToTarget: true, shouldReturn: false, guardResult: true, currentAction: 'moving_to_target', selectedTileCoord: 'D6', …}
fsmLogger.js:270 🔵 INFO [00:29:28] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'D6', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-TRANSITION-2-EXEC: Executing transition to EVALUATING {event: {…}, selectedTileCoord: 'D6', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 🔵 INFO [00:29:28] [bot-0] Starting collection from tile D6
fsmLogger.js:277 💎 RESOURCES [00:29:28] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-TILE-BEFORE: Tile state before collection {coord: 'D6', tileExists: true, tileData: {…}, knownTilesTotal: 3, memoryTimestamp: undefined}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] Attempting collection from tile D6 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:28] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-VEHICLE-BEFORE: Vehicle state before collection {vehicleId: 'bot-0-ship', vehicleType: 'main_ship', currentResources: {…}, maxCapacity: {…}, lastCollectionTime: 1750631366429, …}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 📊 Resource calculation for food {available: 58, current: 0, maxCapacity: 25, canCollect: 25, willCollect: 25, …}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 📊 Resource calculation for debris {available: 328, current: 0, maxCapacity: 100, canCollect: 100, willCollect: 100, …}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 📊 Resource calculation for special {available: 1, current: 0, maxCapacity: 1, canCollect: 1, willCollect: 1, …}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 📊 PARTIAL COLLECTION CALCULATED {availableResources: {…}, resourcesToCollect: {…}, remainingResources: {…}, currentResources: {…}, maxCapacity: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:28] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-VEHICLE-AFTER: Vehicle state after collection {vehicleId: 'bot-0-ship', previousResources: {…}, resourcesToCollect: {…}, updatedResources: {…}, resourceChanges: {…}, …}
fsmLogger.js:277 💎 RESOURCES [00:29:28] [bot-0] Collection successful: +{"food":25,"debris":100,"special":1} -> Vehicle resources: {"food":25,"debris":100,"special":1} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-TILE-AFTER-FSM: Tile state after FSM update {coord: 'D6', previousTileData: {…}, updatedTileData: {…}, fsmMemoryUpdated: true, knownTilesSize: 3}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] Tile D6 marked as collected in FSM memory {collected: false, collectedAt: null, totalCollected: 127}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-STORE-BEFORE: TileStore state before sync {coord: 'D6', tileStoreExists: true, tileExistsInStore: true, tileStoreData: {…}, resourcesToDeduct: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:28] 🔍 DEBUG: deductTileResources called {coord: 'D6', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:28] 🔍 DEBUG: Resource percentage calculated {coord: 'D6', originalResources: {…}, remainingResources: {…}, totalOriginal: 388, totalRemaining: 261, …}
fsmLogger.js:270 💎 RESOURCES [00:29:28] 🔍 DEBUG: TileStore updated successfully {coord: 'D6', newPercentage: 67, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-STORE-AFTER: TileStore state after sync {coord: 'D6', syncSuccess: true, tileStoreStateBefore: {…}, tileStoreStateAfter: {…}, resourcesDeducted: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'D6', deductedResources: {…}}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-FINAL: Collection completed successfully {coord: 'D6', collectionDuration: 2, vehicleIdBefore: 'bot-0-ship', vehicleIdAfter: 'bot-0-ship', resourcesBefore: {…}, …}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] Ship should return to base: {"food":25,"debris":100,"special":0} (99% full - F:100% D:100% S:0%) - Threshold: 80% {currentResources: {…}, maxCapacity: {…}, capacityChecks: {…}, individualPercentages: {…}, totalResources: 125, …}
fsmLogger.js:270 🔵 INFO [00:29:28] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'D6', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:28] [bot-0] 🔍 PHASE3-TRANSITION-1-EXEC: Executing transition to RETURNING_TO_BASE {event: {…}, selectedTileCoord: 'D6', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 💎 RESOURCES [00:29:28] [bot-0] Collection successful: +{"food":0,"debris":0,"special":1} -> Vehicle resources: {"food":25,"debris":100,"special":1} (Score transfer will happen at base)
fsmLogger.js:270 🔵 INFO [00:29:28] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:28] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [00:29:28] 🔍 DEBUG: Tile D6 resource percentage update {coord: 'D6', resourcePercentage: 67, isPartiallyCollected: true, isCompletelyCollected: false, shouldShowPercentage: false, …}
fsmLogger.js:277 🔵 INFO [00:29:28] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:28] State transition detected: collecting_moving_to_target → collecting_returning_to_base for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:30] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:30] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:30] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:30] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:30] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [00:29:30] [bot-0] Selected tile C5 for collection: {"food":29,"debris":313,"special":0}, position: {"x":0.5819738286889298,"y":0.5534400313113881,"z":3.2442075033389637}
fsmLogger.js:270 🔵 INFO [00:29:30] [bot-0] Preparing ship movement to collection target: C5 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [00:29:30] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [00:29:30] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.04', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:30] 🚢 [bot-0] Ship movement started - distance: 2.04
fsmLogger.js:270 🔵 INFO [00:29:30] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:30] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:30] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:30] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:30] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:31] 🚢 [bot-0] Ship movement started - distance: 1.28
fsmLogger.js:277 📜 HISTORY [00:29:31] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:31] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:31] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:31] 🚢 [bot-0] Ship movement started - distance: 0.88
fsmLogger.js:270 🔵 INFO [00:29:31] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:31] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:31] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:31] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:31] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:32] 🚢 [bot-0] Ship movement started - distance: 0.70
fsmLogger.js:277 📜 HISTORY [00:29:32] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:32] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:32] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [00:29:32] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.65', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:32] 🚢 [bot-0] Ship movement started - distance: 0.56
fsmLogger.js:270 🔵 INFO [00:29:32] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:32] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:32] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:32] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:32] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:33] 🚢 [bot-0] Ship movement started - distance: 0.43
fsmLogger.js:277 📜 HISTORY [00:29:33] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:33] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [00:29:33] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [00:29:33] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] Ship should return to base: {"food":25,"debris":100,"special":1} (100% full - F:100% D:100% S:100%) - Threshold: 80% {currentResources: {…}, maxCapacity: {…}, capacityChecks: {…}, individualPercentages: {…}, totalResources: 126, …}
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] 🔍 PHASE3-TRANSITION-1: SHIP_ARRIVED_AT_TILE guard evaluation (RETURNING_TO_BASE) {isMovingToTarget: true, shouldReturn: true, guardResult: true, currentAction: 'moving_to_target', selectedTileCoord: 'C5', …}
fsmLogger.js:270 🔵 INFO [00:29:33] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'C5', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] 🔍 PHASE3-TRANSITION-1-EXEC: Executing transition to RETURNING_TO_BASE {event: {…}, selectedTileCoord: 'C5', aboutToCallShipCollectsFromTile: true}
fsmLogger.js:277 🔵 INFO [00:29:33] [bot-0] Starting collection from tile C5
fsmLogger.js:277 💎 RESOURCES [00:29:33] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] 🔍 PHASE3-TILE-BEFORE: Tile state before collection {coord: 'C5', tileExists: true, tileData: {…}, knownTilesTotal: 3, memoryTimestamp: undefined}
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] Attempting collection from tile C5 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:33] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] 🔍 PHASE3-VEHICLE-BEFORE: Vehicle state before collection {vehicleId: 'bot-0-ship', vehicleType: 'main_ship', currentResources: {…}, maxCapacity: {…}, lastCollectionTime: 1750631368471, …}
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] 📊 Resource calculation for food {available: 29, current: 25, maxCapacity: 25, canCollect: 0, willCollect: 0, …}
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] 📊 Resource calculation for debris {available: 313, current: 100, maxCapacity: 100, canCollect: 0, willCollect: 0, …}
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] ❌ FAILED: Cannot collect anything (capacity full) {totalCurrent: 126, totalMaxCapacity: 126, currentResources: {…}, maxCapacity: {…}, availableResources: {…}}
fsmLogger.js:270 🔵 INFO [00:29:33] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:33] [bot-0] 🔍 PHASE3-TRANSITION-2: SHIP_ARRIVED_AT_TILE guard evaluation (EVALUATING) {isMovingToTarget: false, shouldReturn: true, guardResult: false, currentAction: 'returning_to_base', selectedTileCoord: 'D6', …}
fsmLogger.js:270 🔵 INFO [00:29:33] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'C5', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [00:29:33] [bot-0] Deposit successful: +{"food":25,"debris":100,"special":1} -> Total Score: {"food":50,"debris":200,"special":2}
fsmLogger.js:277 💎 RESOURCES [00:29:33] [bot-0] Deposit successful: +{"food":25,"debris":100,"special":1} -> Total Score: {"food":75,"debris":300,"special":3}
fsmLogger.js:277 📜 HISTORY [00:29:33] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [00:29:33] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [00:29:33] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:33] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:33] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [00:29:35] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [00:29:35] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [00:29:35] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [00:29:35] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [00:29:35] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [00:29:35] [bot-0] Selected tile D6 for collection: {"food":58,"debris":328,"special":1}, position: {"x":2.386098499157315,"y":0.5929300965453198,"z":4.176737132656384}
fsmLogger.js:270 🔵 INFO [00:29:35] [bot-0] Preparing ship movement to collection target: D6 {targetPosition: {…}}
fsmLogger.js:277 💎 RESOURCES [00:29:35] [bot-0] Selected tile C5 for collection: {"food":29,"debris":313,"special":0}, position: {"x":0.5819738286889298,"y":0.5534400313113881,"z":3.2442075033389637}
fsmLogger.js:270 🔵 INFO [00:29:35] [bot-0] Preparing ship movement to collection target: C5 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [00:29:35] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [00:29:35] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [00:29:35] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [00:29:35] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [00:29:35] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.40', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [00:29:35] 🚢 [bot-0] Ship movement started - distance: 0.40
fsmLogger.js:270 🔵 INFO [00:29:35] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [00:29:35] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
