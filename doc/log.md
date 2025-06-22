fsmLogger.js:277 🎮 GAME [23:35:43] Game store initialized
fsmLogger.js:277 🔴 ERROR [23:35:43] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 🔵 INFO [23:35:43] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:277 🔵 INFO [23:35:43] Système FSM: DÉMARRÉ
fsmLogger.js:277 🔴 ERROR [23:35:43] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:43] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:43] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [23:35:43] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 📜 HISTORY [23:35:43] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:43] NO context change detected for bot null
fsmLogger.js:277 🔵 INFO [23:35:43] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [23:35:43] Tiles initialized {component: 'tiles'}
fsmLogger.js:270 🎮 GAME [23:35:43] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:270 🔵 INFO [23:35:43] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:277 🔴 ERROR [23:35:43] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:43] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:43] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:35:44] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:44] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🚀 MOUVEMENT [23:35:44] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 0.5, y: 0.8, z: 0.5}
fsmLogger.js:270 🚀 MOUVEMENT [23:35:44] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0.5, z: 0}
fsmLogger.js:270 🔧 CONTEXT [23:35:44] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [23:35:44] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:35:44] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'D3', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:270 📜 HISTORY [23:35:44] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 🔵 INFO [23:35:46] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:35:46] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 0, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:46] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 0, required: 5, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:35:46] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:46] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:46] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:35:46] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:46] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:46] 🚀 [bot-0] explorer drone deployed - distance: 2.28
fsmLogger.js:277 📜 HISTORY [23:35:46] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:46] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [23:35:46] ✅ [bot-0] Tile explored by explorer: "C3"
fsmLogger.js:277 💎 RESOURCES [23:35:46] 💎 [bot-0] explorer discovered resources from tile: {"food":29,"debris":402,"special":2}
fsmLogger.js:270 🔵 INFO [23:35:46] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C3', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:46] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C3', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:46] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:35:46] 🗺️ Tile C3 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:35:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:46] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:46] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [23:35:46] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:35:46] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:35:46] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:35:46] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:46] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:35:48] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:35:48] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 1, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:48] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: false, totalExploredCount: 1, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:35:48] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 1, required: 5, hasEnoughExplored: false, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [23:35:48] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:48] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:48] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:35:48] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:48] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:48] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:48] 🚀 [bot-0] explorer drone deployed - distance: 1.62
fsmLogger.js:277 📜 HISTORY [23:35:48] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:49] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [23:35:49] ✅ [bot-0] Tile explored by explorer: "D2"
fsmLogger.js:277 💎 RESOURCES [23:35:49] 💎 [bot-0] explorer discovered resources from tile: {"food":100,"debris":77,"special":1}
fsmLogger.js:270 🔵 INFO [23:35:49] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'D2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:49] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'D2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:49] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:35:49] 🗺️ Tile D2 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:35:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:49] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:49] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [23:35:49] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:35:49] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:35:49] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:35:49] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:49] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:35:51] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:35:51] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 2, collectibleDetails: Array(2), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:51] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: false, totalExploredCount: 2, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:35:51] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 5, hasEnoughExplored: false, collectibleTiles: 2, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [23:35:51] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:51] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:51] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:35:51] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:51] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:51] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:51] 🚀 [bot-0] explorer drone deployed - distance: 2.33
fsmLogger.js:277 📜 HISTORY [23:35:51] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:51] 🔍 [bot-0] explorer target reached - distance: 0.60
fsmLogger.js:277 🚀 MOUVEMENT [23:35:51] ✅ [bot-0] Tile explored by explorer: "D4"
fsmLogger.js:277 💎 RESOURCES [23:35:51] 💎 [bot-0] explorer discovered resources from tile: {"food":48,"debris":624,"special":2}
fsmLogger.js:270 🔵 INFO [23:35:51] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'D4', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:51] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'D4', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:51] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:35:51] 🗺️ Tile D4 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:35:51] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:51] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:52] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [23:35:52] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:35:52] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:35:52] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:35:52] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:52] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:35:52] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:35:54] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:35:54] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 3, collectibleDetails: Array(3), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:54] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:35:54] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:35:54] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 3, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [23:35:54] [bot-0] Selected tile D4 for collection: {"food":48,"debris":624,"special":2}, position: {"x":0.5852882460284505,"y":0.5931340758136385,"z":1.0579705726774031}
fsmLogger.js:270 🔵 INFO [23:35:54] [bot-0] Preparing ship movement to collection target: D4 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:35:54] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:35:54] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:54] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:35:54] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:35:54] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '1.27', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:54] 🚢 [bot-0] Ship movement started - distance: 1.27
fsmLogger.js:270 🔵 INFO [23:35:54] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:54] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:54] 🚢 [bot-0] Ship movement started - distance: 0.86
fsmLogger.js:277 📜 HISTORY [23:35:54] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:54] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:54] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:55] 🚢 [bot-0] Ship movement started - distance: 0.57
fsmLogger.js:270 🔵 INFO [23:35:55] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:55] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:55] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:55] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:55] 🚢 [bot-0] Ship movement started - distance: 0.43
fsmLogger.js:277 📜 HISTORY [23:35:56] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:56] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:35:56] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.42', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:56] 🚢 [bot-0] Ship movement started - distance: 0.44
fsmLogger.js:270 🔵 INFO [23:35:56] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:56] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:56] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:57] 🚢 [bot-0] Ship movement started - distance: 0.49
fsmLogger.js:277 📜 HISTORY [23:35:57] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:57] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:57] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:57] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [23:35:57] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'D4', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:35:57] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'D4', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:35:57] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'D4', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 3}
fsmLogger.js:277 💎 RESOURCES [23:35:57] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:35:57] [bot-0] Attempting collection from tile D4 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:35:57] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:35:57] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:35:57] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:35:57] [bot-0] Collection successful: +{"food":48,"debris":624,"special":2} -> Vehicle resources: {"food":48,"debris":624,"special":2} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:35:57] [bot-0] Tile D4 marked as collected in FSM memory {collected: true, collectedAt: 1750628157279, totalCollected: 674}
fsmLogger.js:270 💎 RESOURCES [23:35:57] 🔍 DEBUG: deductTileResources called {coord: 'D4', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:35:57] 🔍 DEBUG: Resource percentage calculated {coord: 'D4', originalResources: {…}, remainingResources: {…}, totalOriginal: 674, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:35:57] 🔍 DEBUG: TileStore updated successfully {coord: 'D4', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:35:57] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'D4', deductedResources: {…}}
fsmLogger.js:277 📜 HISTORY [23:35:57] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:35:57] 🔍 DEBUG: Tile D4 resource percentage update {coord: 'D4', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 📜 HISTORY [23:35:57] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:57] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:35:57] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:35:59] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:35:59] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 2, collectibleDetails: Array(2), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:35:59] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:35:59] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:35:59] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 2, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [23:35:59] [bot-0] Selected tile C3 for collection: {"food":29,"debris":402,"special":2}, position: {"x":-1.2229090670205909,"y":0.5533015445899377,"z":0.12545455064769756}
fsmLogger.js:270 🔵 INFO [23:35:59] [bot-0] Preparing ship movement to collection target: C3 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:35:59] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:35:59] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:35:59] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:35:59] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.07', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:35:59] 🚢 [bot-0] Ship movement started - distance: 2.07
fsmLogger.js:270 🔵 INFO [23:35:59] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:35:59] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:35:59] 🚢 [bot-0] Ship movement started - distance: 1.32
fsmLogger.js:277 📜 HISTORY [23:35:59] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:35:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:35:59] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:00] 🚢 [bot-0] Ship movement started - distance: 0.92
fsmLogger.js:270 🔵 INFO [23:36:00] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:00] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:00] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:01] 🚢 [bot-0] Ship movement started - distance: 0.66
fsmLogger.js:277 📜 HISTORY [23:36:01] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:01] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:01] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.59', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:01] 🚢 [bot-0] Ship movement started - distance: 0.48
fsmLogger.js:270 🔵 INFO [23:36:01] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:01] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:01] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:02] 🚢 [bot-0] Ship movement started - distance: 0.41
fsmLogger.js:277 📜 HISTORY [23:36:02] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:02] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:02] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:270 🔵 INFO [23:36:02] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:02] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:02] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:03] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [23:36:03] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'C3', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:03] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'C3', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:03] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'C3', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 3}
fsmLogger.js:277 💎 RESOURCES [23:36:03] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:03] [bot-0] Attempting collection from tile C3 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:03] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:36:03] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:36:03] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:36:03] [bot-0] Collection successful: +{"food":29,"debris":402,"special":2} -> Vehicle resources: {"food":77,"debris":1026,"special":4} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:03] [bot-0] Tile C3 marked as collected in FSM memory {collected: true, collectedAt: 1750628163060, totalCollected: 433}
fsmLogger.js:270 💎 RESOURCES [23:36:03] 🔍 DEBUG: deductTileResources called {coord: 'C3', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:03] 🔍 DEBUG: Resource percentage calculated {coord: 'C3', originalResources: {…}, remainingResources: {…}, totalOriginal: 433, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:36:03] 🔍 DEBUG: TileStore updated successfully {coord: 'C3', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:03] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'C3', deductedResources: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:03] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:36:03] 🔍 DEBUG: Tile C3 resource percentage update {coord: 'C3', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 🔵 INFO [23:36:03] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:36:03] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:03] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:05] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:05] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:05] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 3, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:36:05] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:05] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 1, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [23:36:05] [bot-0] Selected tile D2 for collection: {"food":100,"debris":77,"special":1}, position: {"x":-0.7884180582728255,"y":0.5989249474740371,"z":-0.9845393111193325}
fsmLogger.js:270 🔵 INFO [23:36:05] [bot-0] Preparing ship movement to collection target: D2 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:05] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:05] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:05] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:36:05] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '1.25', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:05] 🚢 [bot-0] Ship movement started - distance: 1.25
fsmLogger.js:270 🔵 INFO [23:36:05] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:05] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:05] 🚢 [bot-0] Ship movement started - distance: 0.80
fsmLogger.js:277 📜 HISTORY [23:36:05] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:05] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:06] 🚢 [bot-0] Ship movement started - distance: 0.63
fsmLogger.js:270 🔵 INFO [23:36:06] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:06] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:06] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:06] 🚢 [bot-0] Ship movement started - distance: 0.55
fsmLogger.js:277 📜 HISTORY [23:36:06] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:06] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:07] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.52', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:07] 🚢 [bot-0] Ship movement started - distance: 0.44
fsmLogger.js:270 🔵 INFO [23:36:07] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:07] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:07] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:07] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:07] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] Ship should return to base: {"food":77,"debris":1026,"special":4} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 1107, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:36:07] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'D2', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'D2', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'D2', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 3}
fsmLogger.js:277 💎 RESOURCES [23:36:07] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] Attempting collection from tile D2 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:07] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:36:07] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:36:07] [bot-0] Collection successful: +{"food":100,"debris":77,"special":1} -> Vehicle resources: {"food":177,"debris":1103,"special":5} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] Tile D2 marked as collected in FSM memory {collected: true, collectedAt: 1750628167744, totalCollected: 178}
fsmLogger.js:270 💎 RESOURCES [23:36:07] 🔍 DEBUG: deductTileResources called {coord: 'D2', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:07] 🔍 DEBUG: Resource percentage calculated {coord: 'D2', originalResources: {…}, remainingResources: {…}, totalOriginal: 178, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:36:07] 🔍 DEBUG: TileStore updated successfully {coord: 'D2', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'D2', deductedResources: {…}}
fsmLogger.js:270 🔵 INFO [23:36:07] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:07] [bot-0] Ship should return to base: {"food":177,"debris":1103,"special":5} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 1285, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:36:07] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'D2', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:36:07] [bot-0] Deposit successful: +{"food":177,"debris":1103,"special":5} -> Total Score: {"food":177,"debris":1103,"special":5}
fsmLogger.js:277 📜 HISTORY [23:36:07] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:36:07] 🔍 DEBUG: Tile D2 resource percentage update {coord: 'D2', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 📜 HISTORY [23:36:07] State transition detected: collecting_moving_to_target → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:07] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:07] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:09] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:09] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:09] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 5, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:36:09] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:09] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:09] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:09] 🚀 [bot-0] explorer drone deployed - distance: 1.59
fsmLogger.js:277 📜 HISTORY [23:36:09] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:10] 🔍 [bot-0] explorer target reached - distance: 0.60
fsmLogger.js:277 🚀 MOUVEMENT [23:36:10] ✅ [bot-0] Tile explored by explorer: "E3"
fsmLogger.js:277 💎 RESOURCES [23:36:10] 💎 [bot-0] explorer discovered resources from tile: {"food":89,"debris":162,"special":1}
fsmLogger.js:270 🔵 INFO [23:36:10] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'E3', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:10] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'E3', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:10] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:10] 🗺️ Tile E3 is now marked as explored
fsmLogger.js:277 🚀 MOUVEMENT [23:36:10] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [23:36:10] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:36:10] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:10] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:36:12] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:12] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 4, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:12] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 4, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:36:12] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:12] [bot-0] Selecting best tile for collection {totalKnownTiles: 4, collectibleTiles: 1, tileStates: Array(4)}
fsmLogger.js:277 💎 RESOURCES [23:36:12] [bot-0] Selected tile E3 for collection: {"food":89,"debris":162,"special":1}, position: {"x":1.249576688135822,"y":0.6431395074762587,"z":0.1843360014621664}
fsmLogger.js:270 🔵 INFO [23:36:12] [bot-0] Preparing ship movement to collection target: E3 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:12] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:12] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.32', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:12] 🚢 [bot-0] Ship movement started - distance: 2.32
fsmLogger.js:270 🔵 INFO [23:36:12] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:12] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:12] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:12] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:12] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:12] 🚢 [bot-0] Ship movement started - distance: 1.41
fsmLogger.js:277 📜 HISTORY [23:36:12] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:12] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:12] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:13] 🚢 [bot-0] Ship movement started - distance: 0.92
fsmLogger.js:270 🔵 INFO [23:36:13] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:13] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:13] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:13] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:13] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:14] 🚢 [bot-0] Ship movement started - distance: 0.59
fsmLogger.js:277 📜 HISTORY [23:36:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:14] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:14] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.52', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:14] 🚢 [bot-0] Ship movement started - distance: 0.42
fsmLogger.js:270 🔵 INFO [23:36:14] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:14] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:14] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:14] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [23:36:14] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'E3', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:14] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'E3', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:14] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'E3', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 4}
fsmLogger.js:277 💎 RESOURCES [23:36:14] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:14] [bot-0] Attempting collection from tile E3 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:14] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:36:14] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:36:14] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:36:14] [bot-0] Collection successful: +{"food":89,"debris":162,"special":1} -> Vehicle resources: {"food":89,"debris":162,"special":1} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:14] [bot-0] Tile E3 marked as collected in FSM memory {collected: true, collectedAt: 1750628174960, totalCollected: 252}
fsmLogger.js:270 💎 RESOURCES [23:36:14] 🔍 DEBUG: deductTileResources called {coord: 'E3', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:14] 🔍 DEBUG: Resource percentage calculated {coord: 'E3', originalResources: {…}, remainingResources: {…}, totalOriginal: 252, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:36:14] 🔍 DEBUG: TileStore updated successfully {coord: 'E3', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:14] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'E3', deductedResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:14] [bot-0] Ship should return to base: {"food":177,"debris":1103,"special":5} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 1285, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:36:14] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'E3', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:36:14] [bot-0] Deposit successful: +{"food":177,"debris":1103,"special":5} -> Total Score: {"food":177,"debris":1103,"special":5}
fsmLogger.js:277 📜 HISTORY [23:36:14] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:36:14] 🔍 DEBUG: Tile E3 resource percentage update {coord: 'E3', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 🔵 INFO [23:36:14] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:36:14] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:14] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:16] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:16] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:16] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 5, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:36:16] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:16] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:16] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:16] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:16] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:16] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:16] 🚀 [bot-0] explorer drone deployed - distance: 3.49
fsmLogger.js:277 📜 HISTORY [23:36:16] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:17] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [23:36:17] ✅ [bot-0] Tile explored by explorer: "C2"
fsmLogger.js:277 💎 RESOURCES [23:36:17] 💎 [bot-0] explorer discovered resources from tile: {"food":55,"debris":160,"special":2}
fsmLogger.js:270 🔵 INFO [23:36:17] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:17] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:17] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:17] 🗺️ Tile C2 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:36:17] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:17] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:18] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [23:36:18] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:36:18] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:18] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:36:18] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:18] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:18] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:20] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:20] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 4, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:20] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 4, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:36:20] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:20] [bot-0] Selecting best tile for collection {totalKnownTiles: 4, collectibleTiles: 1, tileStates: Array(4)}
fsmLogger.js:277 💎 RESOURCES [23:36:20] [bot-0] Selected tile C2 for collection: {"food":55,"debris":160,"special":2}, position: {"x":-2.170980595391231,"y":0.5492527064030496,"z":-1.2938745291939833}
fsmLogger.js:270 🔵 INFO [23:36:20] [bot-0] Preparing ship movement to collection target: C2 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:20] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:20] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:20] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:20] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:36:20] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '3.40', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:20] 🚢 [bot-0] Ship movement started - distance: 3.40
fsmLogger.js:270 🔵 INFO [23:36:20] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:20] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:20] 🚢 [bot-0] Ship movement started - distance: 1.78
fsmLogger.js:277 📜 HISTORY [23:36:20] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:20] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:20] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:21] 🚢 [bot-0] Ship movement started - distance: 1.13
fsmLogger.js:270 🔵 INFO [23:36:21] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:21] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:21] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:21] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:21] 🚢 [bot-0] Ship movement started - distance: 0.81
fsmLogger.js:277 📜 HISTORY [23:36:21] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:21] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:21] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:22] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.75', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:22] 🚢 [bot-0] Ship movement started - distance: 0.66
fsmLogger.js:270 🔵 INFO [23:36:22] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:22] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:22] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:22] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:23] 🚢 [bot-0] Ship movement started - distance: 0.53
fsmLogger.js:277 📜 HISTORY [23:36:23] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:23] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:23] 🚢 [bot-0] Ship movement started - distance: 0.42
fsmLogger.js:270 🔵 INFO [23:36:23] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:23] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:23] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:23] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [23:36:23] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'C2', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:23] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'C2', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:23] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'C2', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 5}
fsmLogger.js:277 💎 RESOURCES [23:36:23] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:23] [bot-0] Attempting collection from tile C2 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:23] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:36:23] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:36:23] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:36:23] [bot-0] Collection successful: +{"food":55,"debris":160,"special":2} -> Vehicle resources: {"food":144,"debris":322,"special":3} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:23] [bot-0] Tile C2 marked as collected in FSM memory {collected: true, collectedAt: 1750628183859, totalCollected: 217}
fsmLogger.js:270 💎 RESOURCES [23:36:23] 🔍 DEBUG: deductTileResources called {coord: 'C2', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:23] 🔍 DEBUG: Resource percentage calculated {coord: 'C2', originalResources: {…}, remainingResources: {…}, totalOriginal: 217, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:36:23] 🔍 DEBUG: TileStore updated successfully {coord: 'C2', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:23] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'C2', deductedResources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:23] [bot-0] Collection successful: +{"food":55,"debris":160,"special":2} -> Vehicle resources: {"food":55,"debris":160,"special":2} (Score transfer will happen at base)
fsmLogger.js:277 📜 HISTORY [23:36:23] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:36:23] 🔍 DEBUG: Tile C2 resource percentage update {coord: 'C2', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 📜 HISTORY [23:36:23] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:23] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:23] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:36:25] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:25] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 4, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:25] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 4, required: 5, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:36:25] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:25] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:25] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:25] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:25] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:25] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:25] 🚀 [bot-0] explorer drone deployed - distance: 1.78
fsmLogger.js:277 📜 HISTORY [23:36:25] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:26] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [23:36:26] ✅ [bot-0] Tile explored by explorer: "C4"
fsmLogger.js:277 💎 RESOURCES [23:36:26] 💎 [bot-0] explorer discovered resources from tile: {"food":64,"debris":420,"special":0}
fsmLogger.js:270 🔵 INFO [23:36:26] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'C4', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:26] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'C4', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:26] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:26] 🗺️ Tile C4 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:36:26] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:26] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:26] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [23:36:26] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:36:26] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:26] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:36:26] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:26] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:26] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:28] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:28] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 5, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:28] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 5, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:36:28] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:28] [bot-0] Selecting best tile for collection {totalKnownTiles: 5, collectibleTiles: 1, tileStates: Array(5)}
fsmLogger.js:277 💎 RESOURCES [23:36:28] [bot-0] Selected tile C4 for collection: {"food":64,"debris":420,"special":0}, position: {"x":-0.7825225365197926,"y":0.6179346406702243,"z":0.994410309878921}
fsmLogger.js:270 🔵 INFO [23:36:28] [bot-0] Preparing ship movement to collection target: C4 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:28] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:28] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:28] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:28] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:36:28] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.54', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:28] 🚢 [bot-0] Ship movement started - distance: 2.54
fsmLogger.js:270 🔵 INFO [23:36:28] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:28] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:29] 🚢 [bot-0] Ship movement started - distance: 1.50
fsmLogger.js:277 📜 HISTORY [23:36:29] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:29] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:29] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:29] 🚢 [bot-0] Ship movement started - distance: 0.95
fsmLogger.js:270 🔵 INFO [23:36:29] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:29] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:29] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:29] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:30] 🚢 [bot-0] Ship movement started - distance: 0.62
fsmLogger.js:277 📜 HISTORY [23:36:30] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:30] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:30] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:30] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.56', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:30] 🚢 [bot-0] Ship movement started - distance: 0.48
fsmLogger.js:270 🔵 INFO [23:36:30] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:30] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:30] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:30] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:31] 🚢 [bot-0] Ship movement started - distance: 0.49
fsmLogger.js:277 📜 HISTORY [23:36:31] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:31] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:31] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:32] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:270 🔵 INFO [23:36:32] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:32] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:32] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:32] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:32] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] Ship should return to base: {"food":144,"debris":322,"special":3} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 469, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:36:32] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'C4', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'C4', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'C4', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 6}
fsmLogger.js:277 💎 RESOURCES [23:36:32] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] Attempting collection from tile C4 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:32] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:36:32] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:36:32] [bot-0] Collection successful: +{"food":64,"debris":420,"special":0} -> Vehicle resources: {"food":208,"debris":742,"special":3} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] Tile C4 marked as collected in FSM memory {collected: true, collectedAt: 1750628192492, totalCollected: 484}
fsmLogger.js:270 💎 RESOURCES [23:36:32] 🔍 DEBUG: deductTileResources called {coord: 'C4', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:32] 🔍 DEBUG: Resource percentage calculated {coord: 'C4', originalResources: {…}, remainingResources: {…}, totalOriginal: 484, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:36:32] 🔍 DEBUG: TileStore updated successfully {coord: 'C4', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'C4', deductedResources: {…}}
fsmLogger.js:270 🔵 INFO [23:36:32] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:32] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'C4', botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:36:32] [bot-0] Collection successful: +{"food":64,"debris":420,"special":0} -> Vehicle resources: {"food":119,"debris":580,"special":2} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:32] [bot-0] Ship should return to base: {"food":208,"debris":742,"special":3} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 953, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:36:32] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'C4', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:36:32] [bot-0] Deposit successful: +{"food":208,"debris":742,"special":3} -> Total Score: {"food":385,"debris":1845,"special":8}
fsmLogger.js:277 📜 HISTORY [23:36:32] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:36:32] 🔍 DEBUG: Tile C4 resource percentage update {coord: 'C4', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 📜 HISTORY [23:36:32] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:32] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:32] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:32] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:36:34] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:34] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 5, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:34] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 5, required: 5, hasEnoughExplored: true, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:36:34] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:34] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:34] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:34] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:34] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:34] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:34] 🚀 [bot-0] explorer drone deployed - distance: 2.27
fsmLogger.js:277 📜 HISTORY [23:36:34] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:34] 🔍 [bot-0] explorer target reached - distance: 0.60
fsmLogger.js:277 🚀 MOUVEMENT [23:36:34] ✅ [bot-0] Tile explored by explorer: "E2"
fsmLogger.js:277 💎 RESOURCES [23:36:34] 💎 [bot-0] explorer discovered resources from tile: {"food":42,"debris":693,"special":0}
fsmLogger.js:270 🔵 INFO [23:36:34] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'E2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:34] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'E2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:34] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:34] 🗺️ Tile E2 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:36:34] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:34] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:35] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [23:36:35] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:36:35] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:35] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:36:35] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:35] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:35] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:37] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:37] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 6, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:37] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 6, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:36:37] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:37] [bot-0] Selecting best tile for collection {totalKnownTiles: 6, collectibleTiles: 1, tileStates: Array(6)}
fsmLogger.js:277 💎 RESOURCES [23:36:37] [bot-0] Selected tile E2 for collection: {"food":42,"debris":693,"special":0}, position: {"x":0.5860372441408792,"y":0.5852343045054923,"z":-1.056878463282085}
fsmLogger.js:270 🔵 INFO [23:36:37] [bot-0] Preparing ship movement to collection target: E2 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:37] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:37] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:37] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:37] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:36:37] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.46', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:37] 🚢 [bot-0] Ship movement started - distance: 2.46
fsmLogger.js:270 🔵 INFO [23:36:37] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:37] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:37] 🚢 [bot-0] Ship movement started - distance: 1.47
fsmLogger.js:277 📜 HISTORY [23:36:37] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:37] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:37] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:38] 🚢 [bot-0] Ship movement started - distance: 0.98
fsmLogger.js:270 🔵 INFO [23:36:38] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:38] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:38] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:38] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:39] 🚢 [bot-0] Ship movement started - distance: 0.66
fsmLogger.js:277 📜 HISTORY [23:36:39] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:39] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:39] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:39] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.59', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:39] 🚢 [bot-0] Ship movement started - distance: 0.46
fsmLogger.js:270 🔵 INFO [23:36:39] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:39] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:39] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:39] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:40] 🚢 [bot-0] Ship movement started - distance: 0.42
fsmLogger.js:277 📜 HISTORY [23:36:40] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:40] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:40] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:40] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:270 🔵 INFO [23:36:40] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:40] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:40] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:40] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:41] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [23:36:41] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'E2', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:41] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'E2', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:41] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'E2', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 7}
fsmLogger.js:277 💎 RESOURCES [23:36:41] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:41] [bot-0] Attempting collection from tile E2 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:41] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:36:41] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:36:41] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:36:41] [bot-0] Collection successful: +{"food":42,"debris":693,"special":0} -> Vehicle resources: {"food":42,"debris":693,"special":0} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:41] [bot-0] Tile E2 marked as collected in FSM memory {collected: true, collectedAt: 1750628201133, totalCollected: 735}
fsmLogger.js:270 💎 RESOURCES [23:36:41] 🔍 DEBUG: deductTileResources called {coord: 'E2', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:41] 🔍 DEBUG: Resource percentage calculated {coord: 'E2', originalResources: {…}, remainingResources: {…}, totalOriginal: 735, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:36:41] 🔍 DEBUG: TileStore updated successfully {coord: 'E2', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:41] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'E2', deductedResources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:41] [bot-0] Collection successful: +{"food":42,"debris":693,"special":0} -> Vehicle resources: {"food":161,"debris":1273,"special":2} (Score transfer will happen at base)
fsmLogger.js:277 📜 HISTORY [23:36:41] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:36:41] 🔍 DEBUG: Tile E2 resource percentage update {coord: 'E2', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 📜 HISTORY [23:36:41] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:41] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:41] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:41] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:36:43] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:43] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 6, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:43] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 6, required: 5, hasEnoughExplored: true, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:36:43] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:43] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:43] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:43] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:43] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:43] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:43] 🚀 [bot-0] explorer drone deployed - distance: 3.02
fsmLogger.js:277 📜 HISTORY [23:36:43] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:43] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [23:36:43] ✅ [bot-0] Tile explored by explorer: "E4"
fsmLogger.js:277 💎 RESOURCES [23:36:43] 💎 [bot-0] explorer discovered resources from tile: {"food":83,"debris":45,"special":2}
fsmLogger.js:270 🔵 INFO [23:36:43] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'E4', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:43] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'E4', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:43] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:43] 🗺️ Tile E4 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:36:43] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:43] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:44] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [23:36:44] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:36:44] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:44] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:36:44] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:44] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:36:44] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:46] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:46] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 7, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:46] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 7, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:36:46] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:46] [bot-0] Selecting best tile for collection {totalKnownTiles: 7, collectibleTiles: 1, tileStates: Array(7)}
fsmLogger.js:277 💎 RESOURCES [23:36:46] [bot-0] Selected tile E4 for collection: {"food":83,"debris":45,"special":2}, position: {"x":2.2570515254636114,"y":0.5385999354406525,"z":1.1772219421421688}
fsmLogger.js:270 🔵 INFO [23:36:46] [bot-0] Preparing ship movement to collection target: E4 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:46] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:46] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:46] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:36:46] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.77', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:46] 🚢 [bot-0] Ship movement started - distance: 2.77
fsmLogger.js:270 🔵 INFO [23:36:46] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:46] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:46] 🚢 [bot-0] Ship movement started - distance: 1.57
fsmLogger.js:277 📜 HISTORY [23:36:46] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:46] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:46] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:47] 🚢 [bot-0] Ship movement started - distance: 1.07
fsmLogger.js:270 🔵 INFO [23:36:47] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:47] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:47] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:47] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:48] 🚢 [bot-0] Ship movement started - distance: 0.77
fsmLogger.js:277 📜 HISTORY [23:36:48] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:48] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:48] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:48] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.69', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:48] 🚢 [bot-0] Ship movement started - distance: 0.55
fsmLogger.js:270 🔵 INFO [23:36:48] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:48] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:48] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:48] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:49] 🚢 [bot-0] Ship movement started - distance: 0.44
fsmLogger.js:277 📜 HISTORY [23:36:49] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:49] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:49] 🚢 [bot-0] Ship movement started - distance: 0.46
fsmLogger.js:270 🔵 INFO [23:36:49] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:49] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:49] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:49] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:50] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [23:36:50] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'E4', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:50] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'E4', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:50] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'E4', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 8}
fsmLogger.js:277 💎 RESOURCES [23:36:50] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:50] [bot-0] Attempting collection from tile E4 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:36:50] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:36:50] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:36:50] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:36:50] [bot-0] Collection successful: +{"food":83,"debris":45,"special":2} -> Vehicle resources: {"food":125,"debris":738,"special":2} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:36:50] [bot-0] Tile E4 marked as collected in FSM memory {collected: true, collectedAt: 1750628210217, totalCollected: 130}
fsmLogger.js:270 💎 RESOURCES [23:36:50] 🔍 DEBUG: deductTileResources called {coord: 'E4', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:50] 🔍 DEBUG: Resource percentage calculated {coord: 'E4', originalResources: {…}, remainingResources: {…}, totalOriginal: 130, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:36:50] 🔍 DEBUG: TileStore updated successfully {coord: 'E4', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:50] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'E4', deductedResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:36:50] [bot-0] Ship should return to base: {"food":161,"debris":1273,"special":2} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 1436, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:36:50] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'E4', botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:36:50] [bot-0] Collection successful: +{"food":83,"debris":45,"special":2} -> Vehicle resources: {"food":244,"debris":1318,"special":4} (Score transfer will happen at base)
fsmLogger.js:270 🔵 INFO [23:36:50] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:50] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:36:50] 🔍 DEBUG: Tile E4 resource percentage update {coord: 'E4', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 📜 HISTORY [23:36:50] State transition detected: collecting_moving_to_target → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:50] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:50] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:36:50] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:36:52] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:52] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 8, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:52] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 8, required: 5, hasEnoughExplored: true, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:36:52] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:52] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:52] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:52] 🚀 [bot-0] explorer drone deployed - distance: 4.06
fsmLogger.js:277 📜 HISTORY [23:36:52] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:52] 🔍 [bot-0] explorer target reached - distance: 0.60
fsmLogger.js:277 🚀 MOUVEMENT [23:36:52] ✅ [bot-0] Tile explored by explorer: "B3"
fsmLogger.js:277 💎 RESOURCES [23:36:52] 💎 [bot-0] explorer discovered resources from tile: {"food":55,"debris":209,"special":2}
fsmLogger.js:270 🔵 INFO [23:36:52] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'B3', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:52] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'B3', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:52] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:52] 🗺️ Tile B3 is now marked as explored
fsmLogger.js:277 🚀 MOUVEMENT [23:36:53] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [23:36:53] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:36:53] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:36:53] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:36:55] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:36:55] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 9, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:55] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 9, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:36:55] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:55] [bot-0] Selecting best tile for collection {totalKnownTiles: 9, collectibleTiles: 1, tileStates: Array(9)}
fsmLogger.js:277 💎 RESOURCES [23:36:55] [bot-0] Selected tile B3 for collection: {"food":55,"debris":209,"special":2}, position: {"x":-3.0025475729967313,"y":0.5292586066916493,"z":0.03920749201891236}
fsmLogger.js:270 🔵 INFO [23:36:55] [bot-0] Preparing ship movement to collection target: B3 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:55] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:55] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '5.34', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:55] 🚢 [bot-0] Ship movement started - distance: 5.34
fsmLogger.js:270 🔵 INFO [23:36:55] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:55] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:55] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:55] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:36:55] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 📜 HISTORY [23:36:55] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:55] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:55] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:55] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:55] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:55] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:55] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:56] 🚢 [bot-0] Ship movement started - distance: 2.59
fsmLogger.js:277 📜 HISTORY [23:36:56] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:56] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:56] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:56] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:56] 🚢 [bot-0] Ship movement started - distance: 1.52
fsmLogger.js:270 🔵 INFO [23:36:56] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:56] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:56] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:56] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:56] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:56] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:56] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:57] 🚢 [bot-0] Ship movement started - distance: 1.02
fsmLogger.js:277 📜 HISTORY [23:36:57] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:57] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:57] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:57] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.92', targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:36:57] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:57] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:57] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:57] 🚢 [bot-0] Ship movement started - distance: 0.70
fsmLogger.js:270 🔵 INFO [23:36:57] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:57] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:57] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:57] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:57] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:58] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:58] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:58] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:58] 🚢 [bot-0] Ship movement started - distance: 0.51
fsmLogger.js:277 📜 HISTORY [23:36:58] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:58] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:58] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:58] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:58] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:58] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:59] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:270 🔵 INFO [23:36:59] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:36:59] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:36:59] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:59] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:36:59] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:59] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:36:59] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.49', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:36:59] 🚢 [bot-0] Ship movement started - distance: 0.53
fsmLogger.js:277 📜 HISTORY [23:36:59] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:36:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:36:59] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:36:59] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [23:36:59] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'B3', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:36:59] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'B3', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:36:59] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'B3', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 9}
fsmLogger.js:277 💎 RESOURCES [23:36:59] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:36:59] [bot-0] Attempting collection from tile B3 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:37:00] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:37:00] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:37:00] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:37:00] [bot-0] Collection successful: +{"food":55,"debris":209,"special":2} -> Vehicle resources: {"food":180,"debris":947,"special":4} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:37:00] [bot-0] Tile B3 marked as collected in FSM memory {collected: true, collectedAt: 1750628220000, totalCollected: 266}
fsmLogger.js:270 💎 RESOURCES [23:37:00] 🔍 DEBUG: deductTileResources called {coord: 'B3', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:37:00] 🔍 DEBUG: Resource percentage calculated {coord: 'B3', originalResources: {…}, remainingResources: {…}, totalOriginal: 266, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:37:00] 🔍 DEBUG: TileStore updated successfully {coord: 'B3', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:37:00] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'B3', deductedResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:37:00] [bot-0] Ship should return to base: {"food":244,"debris":1318,"special":4} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 1566, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:37:00] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'B3', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:37:00] [bot-0] Deposit successful: +{"food":244,"debris":1318,"special":4} -> Total Score: {"food":421,"debris":2421,"special":9}
fsmLogger.js:277 📜 HISTORY [23:37:00] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:37:00] 🔍 DEBUG: Tile B3 resource percentage update {coord: 'B3', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 🔵 INFO [23:37:00] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:37:00] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:37:00] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:37:02] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:37:02] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 7, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:02] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 7, required: 5, hasEnoughExplored: true, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:37:02] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:02] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:02] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:02] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:37:02] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:02] 🚀 [bot-0] explorer drone deployed - distance: 3.17
fsmLogger.js:277 📜 HISTORY [23:37:02] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:02] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [23:37:02] ✅ [bot-0] Tile explored by explorer: "D1"
fsmLogger.js:277 💎 RESOURCES [23:37:02] 💎 [bot-0] explorer discovered resources from tile: {"food":37,"debris":758,"special":2}
fsmLogger.js:270 🔵 INFO [23:37:02] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'D1', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:02] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'D1', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:02] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:37:02] 🗺️ Tile D1 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:37:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:37:02] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:03] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [23:37:03] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:37:03] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:37:03] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:37:03] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:37:03] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:37:05] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:37:05] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 8, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:05] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 8, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:37:05] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:37:05] [bot-0] Selecting best tile for collection {totalKnownTiles: 8, collectibleTiles: 1, tileStates: Array(8)}
fsmLogger.js:277 💎 RESOURCES [23:37:05] [bot-0] Selected tile D1 for collection: {"food":37,"debris":758,"special":2}, position: {"x":-1.587582138453613,"y":0.5368430581562439,"z":-2.5736904678731087}
fsmLogger.js:270 🔵 INFO [23:37:05] [bot-0] Preparing ship movement to collection target: D1 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:37:05] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:05] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:37:05] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:37:05] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.94', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:05] 🚢 [bot-0] Ship movement started - distance: 2.94
fsmLogger.js:270 🔵 INFO [23:37:05] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:05] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:05] 🚢 [bot-0] Ship movement started - distance: 1.64
fsmLogger.js:277 📜 HISTORY [23:37:05] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:05] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:06] 🚢 [bot-0] Ship movement started - distance: 1.10
fsmLogger.js:270 🔵 INFO [23:37:06] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:06] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:06] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:06] 🚢 [bot-0] Ship movement started - distance: 0.78
fsmLogger.js:277 📜 HISTORY [23:37:06] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:06] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:37:07] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.70', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:07] 🚢 [bot-0] Ship movement started - distance: 0.55
fsmLogger.js:270 🔵 INFO [23:37:07] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:07] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:07] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:07] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:08] 🚢 [bot-0] Ship movement started - distance: 0.44
fsmLogger.js:277 📜 HISTORY [23:37:08] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:08] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:08] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:270 🔵 INFO [23:37:08] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:08] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:08] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:37:09] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.52', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:09] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] Ship should return to base: {"food":180,"debris":947,"special":4} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 1131, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:37:09] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'D1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'D1', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'D1', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 10}
fsmLogger.js:277 💎 RESOURCES [23:37:09] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] Attempting collection from tile D1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [23:37:09] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [23:37:09] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [23:37:09] [bot-0] Collection successful: +{"food":37,"debris":758,"special":2} -> Vehicle resources: {"food":217,"debris":1705,"special":6} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] Tile D1 marked as collected in FSM memory {collected: true, collectedAt: 1750628229199, totalCollected: 797}
fsmLogger.js:270 💎 RESOURCES [23:37:09] 🔍 DEBUG: deductTileResources called {coord: 'D1', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:37:09] 🔍 DEBUG: Resource percentage calculated {coord: 'D1', originalResources: {…}, remainingResources: {…}, totalOriginal: 797, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [23:37:09] 🔍 DEBUG: TileStore updated successfully {coord: 'D1', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'D1', deductedResources: {…}}
fsmLogger.js:270 🔵 INFO [23:37:09] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:09] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'D1', botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:37:09] [bot-0] Collection successful: +{"food":37,"debris":758,"special":2} -> Vehicle resources: {"food":37,"debris":758,"special":2} (Score transfer will happen at base)
fsmLogger.js:270 💎 RESOURCES [23:37:09] [bot-0] Ship should return to base: {"food":217,"debris":1705,"special":6} (Infinity% full) {currentResources: {…}, maxCapacity: 10, capacityChecks: {…}, totalResources: 1928, totalMaxCapacity: 0}
fsmLogger.js:270 🔵 INFO [23:37:09] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'D1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [23:37:09] [bot-0] Deposit successful: +{"food":217,"debris":1705,"special":6} -> Total Score: {"food":602,"debris":3550,"special":14}
fsmLogger.js:277 📜 HISTORY [23:37:09] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [23:37:09] 🔍 DEBUG: Tile D1 resource percentage update {coord: 'D1', resourcePercentage: 0, isPartiallyCollected: false, isCompletelyCollected: true, shouldShowPercentage: true, …}
fsmLogger.js:277 📜 HISTORY [23:37:09] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:09] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:37:09] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:37:09] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [23:37:11] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:37:11] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 8, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:11] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 8, required: 5, hasEnoughExplored: true, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [23:37:11] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:11] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:11] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:11] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:11] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:37:11] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:11] 🚀 [bot-0] explorer drone deployed - distance: 3.92
fsmLogger.js:277 📜 HISTORY [23:37:11] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:11] 🔍 [bot-0] explorer target reached - distance: 0.60
fsmLogger.js:277 🚀 MOUVEMENT [23:37:11] ✅ [bot-0] Tile explored by explorer: "D5"
fsmLogger.js:277 💎 RESOURCES [23:37:11] 💎 [bot-0] explorer discovered resources from tile: {"food":27,"debris":171,"special":1}
fsmLogger.js:270 🔵 INFO [23:37:11] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'D5', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:11] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'D5', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:11] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [23:37:11] 🗺️ Tile D5 is now marked as explored
fsmLogger.js:270 📜 HISTORY [23:37:11] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:37:11] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:12] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [23:37:12] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [23:37:12] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [23:37:12] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [23:37:12] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:12] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [23:37:12] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [23:37:14] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [23:37:14] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 9, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [23:37:14] 🧠 [Evaluating] Smart collection evaluation {hasBestTile: true, hasEnoughExplored: true, totalExploredCount: 9, minTilesForCollection: 3, isShipNotFull: true, …}
fsmLogger.js:270 🔵 INFO [23:37:14] 🧠 [Evaluating] Smart collection - ship not full, collecting after exploration phase {shipResources: {…}, shipCapacity: 10, botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [23:37:14] [bot-0] Selecting best tile for collection {totalKnownTiles: 9, collectibleTiles: 1, tileStates: Array(9)}
fsmLogger.js:277 💎 RESOURCES [23:37:14] [bot-0] Selected tile D5 for collection: {"food":27,"debris":171,"special":1}, position: {"x":1.499707498777525,"y":0.528417932154357,"z":2.6025179276429493}
fsmLogger.js:270 🔵 INFO [23:37:14] [bot-0] Preparing ship movement to collection target: D5 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:37:14] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:14] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [23:37:14] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [23:37:14] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '5.91', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [23:37:14] 🚢 [bot-0] Ship movement started - distance: 5.91
fsmLogger.js:270 🔵 INFO [23:37:14] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:14] NO context change detected for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:14] NO context change detected for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:14] NO context change detected for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:14] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:14] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:15] 🚢 [bot-0] Ship movement started - distance: 2.79
fsmLogger.js:277 📜 HISTORY [23:37:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:15] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:15] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:15] 🚢 [bot-0] Ship movement started - distance: 1.60
fsmLogger.js:270 🔵 INFO [23:37:15] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:15] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:15] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:16] 🚢 [bot-0] Ship movement started - distance: 1.06
fsmLogger.js:277 📜 HISTORY [23:37:16] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:16] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:16] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:37:16] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.96', targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:37:16] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:16] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:16] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:16] 🚢 [bot-0] Ship movement started - distance: 0.71
fsmLogger.js:270 🔵 INFO [23:37:16] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:16] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:16] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:16] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:17] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:17] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:17] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:17] 🚢 [bot-0] Ship movement started - distance: 0.52
fsmLogger.js:277 📜 HISTORY [23:37:17] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:17] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:17] NO context change detected for bot bot-0
fsmLogger.js:277 📜 HISTORY [23:37:17] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:17] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:17] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:18] 🚢 [bot-0] Ship movement started - distance: 0.49
fsmLogger.js:270 🔵 INFO [23:37:18] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [23:37:18] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:18] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:18] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [23:37:18] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.52', targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [23:37:18] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:18] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:18] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [23:37:18] 🚢 [bot-0] Ship movement started - distance: 0.55
fsmLogger.js:277 📜 HISTORY [23:37:18] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [23:37:18] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [23:37:18] NO context change detected for bot bot-0
