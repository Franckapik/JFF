fsmLogger.js:277 🎮 GAME [21:37:36] Game store initialized
fsmLogger.js:277 🔴 ERROR [21:37:36] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 🔵 INFO [21:37:36] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:277 🔵 INFO [21:37:36] Système FSM: DÉMARRÉ
fsmLogger.js:277 🔴 ERROR [21:37:36] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:36] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:36] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [21:37:36] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 📜 HISTORY [21:37:36] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:36] NO context change detected for bot null
fsmLogger.js:277 🔵 INFO [21:37:36] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [21:37:36] Tiles initialized {component: 'tiles'}
fsmLogger.js:270 🎮 GAME [21:37:36] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:270 🔵 INFO [21:37:36] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:277 🔴 ERROR [21:37:36] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:36] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:36] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [21:37:36] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:36] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🚀 MOUVEMENT [21:37:36] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 3.2, y: 0.8, z: 2.0588457268119895}
fsmLogger.js:270 🚀 MOUVEMENT [21:37:36] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 2.7, y: 0.5, z: 1.5588457268119895}
fsmLogger.js:270 🔧 CONTEXT [21:37:36] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [21:37:36] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [21:37:36] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'E4', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:270 📜 HISTORY [21:37:36] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 🔵 INFO [21:37:38] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [21:37:38] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 0, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:38] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 0, required: 2, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [21:37:38] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:38] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:38] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [21:37:38] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:38] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [21:37:38] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:38] 🚀 [bot-0] explorer drone deployed - distance: 2.26
fsmLogger.js:277 📜 HISTORY [21:37:38] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:39] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [21:37:39] ✅ [bot-0] Tile explored by explorer: "D4"
fsmLogger.js:277 💎 RESOURCES [21:37:39] 💎 [bot-0] explorer discovered resources from tile: {"food":85,"debris":818,"special":2}
fsmLogger.js:270 🔵 INFO [21:37:39] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'D4', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:39] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'D4', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:39] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [21:37:39] 🗺️ Tile D4 is now marked as explored
fsmLogger.js:270 📜 HISTORY [21:37:39] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [21:37:39] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:39] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [21:37:39] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [21:37:39] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [21:37:39] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [21:37:39] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:39] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [21:37:39] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [21:37:41] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [21:37:41] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 1, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:41] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 1, required: 2, hasEnoughExplored: false, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [21:37:41] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:41] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:41] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [21:37:41] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:41] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [21:37:41] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:41] 🚀 [bot-0] explorer drone deployed - distance: 1.56
fsmLogger.js:277 📜 HISTORY [21:37:41] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:41] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [21:37:41] ✅ [bot-0] Tile explored by explorer: "E3"
fsmLogger.js:277 💎 RESOURCES [21:37:41] 💎 [bot-0] explorer discovered resources from tile: {"food":32,"debris":851,"special":1}
fsmLogger.js:270 🔵 INFO [21:37:41] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'E3', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:41] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'E3', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:41] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [21:37:41] 🗺️ Tile E3 is now marked as explored
fsmLogger.js:270 📜 HISTORY [21:37:41] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [21:37:41] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:42] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [21:37:42] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [21:37:42] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [21:37:42] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [21:37:42] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:42] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [21:37:42] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [21:37:44] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [21:37:44] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 2, collectibleDetails: Array(2), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:44] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 2, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [21:37:44] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:44] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [21:37:44] [bot-0] Selecting best tile for collection {totalKnownTiles: 2, collectibleTiles: 2, tileStates: Array(2)}
fsmLogger.js:277 💎 RESOURCES [21:37:44] [bot-0] Selected tile D4 for collection: {"food":85,"debris":818,"special":2}, position: {"x":1.4710738138249955,"y":0.5528424082982879,"z":1.682992208078293}
fsmLogger.js:270 🔵 INFO [21:37:44] [bot-0] Preparing ship movement to collection target: D4 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [21:37:44] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [21:37:44] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:44] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [21:37:44] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [21:37:44] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '1.31', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:44] 🚢 [bot-0] Ship movement started - distance: 1.31
fsmLogger.js:270 🔵 INFO [21:37:44] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:44] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:44] 🚢 [bot-0] Ship movement started - distance: 0.85
fsmLogger.js:277 📜 HISTORY [21:37:44] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:44] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:44] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:45] 🚢 [bot-0] Ship movement started - distance: 0.59
fsmLogger.js:270 🔵 INFO [21:37:45] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:45] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:45] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:45] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:46] 🚢 [bot-0] Ship movement started - distance: 0.51
fsmLogger.js:277 📜 HISTORY [21:37:46] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:46] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [21:37:46] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.51', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:46] 🚢 [bot-0] Ship movement started - distance: 0.54
fsmLogger.js:270 🔵 INFO [21:37:46] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:46] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:46] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:47] 🚢 [bot-0] Ship movement started - distance: 0.52
fsmLogger.js:277 📜 HISTORY [21:37:47] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:47] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:47] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:47] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [21:37:47] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'D4', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [21:37:47] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'D4', resourceType: 'all'}
fsmLogger.js:277 💎 RESOURCES [21:37:47] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [21:37:47] [bot-0] Attempting collection from tile D4 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [21:37:47] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [21:37:47] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [21:37:47] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [21:37:47] [bot-0] Collection successful: +{"food":85,"debris":818,"special":2} -> Score: {"food":85,"debris":818,"special":2}
fsmLogger.js:270 💎 RESOURCES [21:37:47] [bot-0] Tile D4 marked as collected in FSM memory {collected: true, collectedAt: 1750621067339, totalCollected: 905}
fsmLogger.js:277 💎 RESOURCES [21:37:47] [bot-0] Skipping TileStore update (client-side limitation)
fsmLogger.js:277 📜 HISTORY [21:37:47] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [21:37:47] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [21:37:47] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:47] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [21:37:49] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [21:37:49] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [21:37:49] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:49] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [21:37:49] State transition detected: evaluating → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [21:37:49] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [21:37:49] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.33', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:49] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.33
fsmLogger.js:270 🔵 INFO [21:37:49] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:49] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:49] 🏠 [bot-0] Ship started returning to base after collection - distance: 0.86
fsmLogger.js:277 📜 HISTORY [21:37:49] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [21:37:49] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:50] 🎯 [bot-0] Ship reached base after collection - distance: 0.80
fsmLogger.js:277 💎 RESOURCES [21:37:50] [bot-0] Ship should return to base: 905/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [21:37:50] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'E4', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [21:37:50] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 📜 HISTORY [21:37:50] State transition detected: collecting_returning_to_base → idleAtBase for bot bot-0
fsmLogger.js:270 📜 HISTORY [21:37:50] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [21:37:50] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:50] 🚢 [bot-0] Ship movement started - distance: 0.79
fsmLogger.js:277 📜 HISTORY [21:37:50] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:50] 🚢 [bot-0] Ship movement started - distance: 0.68
fsmLogger.js:277 📜 HISTORY [21:37:50] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:51] 🚢 [bot-0] Ship movement started - distance: 0.61
fsmLogger.js:277 📜 HISTORY [21:37:51] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [21:37:51] 🔍 [bot-0] Ship action tracking {currentAction: 'idling', handlerCategory: 'moving_to_tile', distance: '0.60', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [21:37:51] 🚢 [bot-0] Ship movement started - distance: 0.56
fsmLogger.js:277 📜 HISTORY [21:37:51] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [21:37:52] 🚢 [bot-0] Ship movement started - distance: 0.51
fsmLogger.js:277 📜 HISTORY [21:37:52] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
