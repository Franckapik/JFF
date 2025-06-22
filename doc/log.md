fsmLogger.js:277 🎮 GAME [22:06:59] Game store initialized
fsmLogger.js:277 🔴 ERROR [22:06:59] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 🔵 INFO [22:06:59] [MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine
fsmLogger.js:277 🔵 INFO [22:06:59] Système FSM: DÉMARRÉ
fsmLogger.js:277 🔴 ERROR [22:06:59] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:06:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:06:59] NO context change detected for bot bot-0
fsmLogger.js:277 🔴 ERROR [22:06:59] [useBotMachine] No starting tile found for bot null
fsmLogger.js:270 📜 HISTORY [22:06:59] Context effect triggered for bot null: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:06:59] NO context change detected for bot null
fsmLogger.js:277 🔵 INFO [22:06:59] [Scene] Initializing tiles...
fsmLogger.js:270 🎮 GAME [22:06:59] Tiles initialized {component: 'tiles'}
fsmLogger.js:270 🎮 GAME [22:06:59] [TileStore] Synchronized starting tiles with FSM bots: {totalBots: 1, activeBots: 1, departTiles: 1}
fsmLogger.js:270 🔵 INFO [22:06:59] [Scene] Synchronized starting tiles with FSM bots {activeBots: 1, botIds: Array(1)}
fsmLogger.js:277 🔴 ERROR [22:06:59] [useBotMachine] No starting tile found for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:06:59] Received sync event: ENTITY_POSITION_UPDATE for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:06:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:06:59] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🚀 MOUVEMENT [22:06:59] 🛸 [explorer] Transmitting initial drone position to FSM tracker: {x: 2.3, y: 0.8, z: -2.617691453623979}
fsmLogger.js:270 🚀 MOUVEMENT [22:06:59] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 1.8, y: 0.5, z: -3.117691453623979}
fsmLogger.js:270 🔧 CONTEXT [22:06:59] 🏠 [bot-0] Setting initial ship position via FSM event {position: {…}, hasVehicle: true, currentPosition: null}
fsmLogger.js:277 📜 HISTORY [22:06:59] Received sync event: SHIP_UPDATE_POSITION for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:06:59] ✅ [bot-0] Initial ship position sent via FSM event {tileCoord: 'F1', worldPosition: {…}, eventType: 'SHIP_UPDATE_POSITION'}
fsmLogger.js:277 🔵 INFO [22:07:01] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:01] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 0, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:01] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 0, required: 2, hasEnoughExplored: false, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [22:07:01] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:01] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:01] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:01] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:01] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:01] 🚀 [bot-0] explorer drone deployed - distance: 2.20
fsmLogger.js:277 📜 HISTORY [22:07:01] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:02] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [22:07:02] ✅ [bot-0] Tile explored by explorer: "E1"
fsmLogger.js:277 💎 RESOURCES [22:07:02] 💎 [bot-0] explorer discovered resources from tile: {"food":31,"debris":149,"special":1}
fsmLogger.js:270 🔵 INFO [22:07:02] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'E1', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:02] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'E1', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:02] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:02] 🗺️ Tile E1 is now marked as explored
fsmLogger.js:270 📜 HISTORY [22:07:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:02] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:02] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [22:07:02] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [22:07:02] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:02] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:02] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:02] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:02] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:04] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:04] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 1, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:04] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 1, required: 2, hasEnoughExplored: false, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:04] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: false, hasBestTile: true, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:04] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:04] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:04] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:04] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:04] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:04] 🚀 [bot-0] explorer drone deployed - distance: 1.59
fsmLogger.js:277 📜 HISTORY [22:07:04] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:04] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [22:07:04] ✅ [bot-0] Tile explored by explorer: "F0"
fsmLogger.js:277 💎 RESOURCES [22:07:04] 💎 [bot-0] explorer discovered resources from tile: {"food":78,"debris":720,"special":0}
fsmLogger.js:270 🔵 INFO [22:07:04] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'F0', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:04] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'F0', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:04] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:04] 🗺️ Tile F0 is now marked as explored
fsmLogger.js:270 📜 HISTORY [22:07:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:05] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:05] 🏠 [bot-0] explorer drone reached ship - distance: 0.59
fsmLogger.js:270 🔵 INFO [22:07:05] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [22:07:05] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:05] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:05] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:05] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:07] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:07] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 2, collectibleDetails: Array(2), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:07] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 2, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:07] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:07] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:07] [bot-0] Selecting best tile for collection {totalKnownTiles: 2, collectibleTiles: 2, tileStates: Array(2)}
fsmLogger.js:277 💎 RESOURCES [22:07:07] [bot-0] Selected tile F0 for collection: {"food":78,"debris":720,"special":0}, position: {"x":1.0099420817681284,"y":0.6008368335960018,"z":-4.102760048442194}
fsmLogger.js:270 🔵 INFO [22:07:07] [bot-0] Preparing ship movement to collection target: F0 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:07] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:07] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:07] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:07] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:07] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '1.32', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:07] 🚢 [bot-0] Ship movement started - distance: 1.32
fsmLogger.js:270 🔵 INFO [22:07:07] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:07] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:07] 🚢 [bot-0] Ship movement started - distance: 0.85
fsmLogger.js:277 📜 HISTORY [22:07:07] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:07] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:07] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:08] 🚢 [bot-0] Ship movement started - distance: 0.57
fsmLogger.js:270 🔵 INFO [22:07:08] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:08] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:08] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:08] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:09] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:277 📜 HISTORY [22:07:09] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:09] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:09] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:09] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.47', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:09] 🚢 [bot-0] Ship movement started - distance: 0.49
fsmLogger.js:270 🔵 INFO [22:07:09] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:09] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:09] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:09] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:10] 🚢 [bot-0] Ship movement started - distance: 0.48
fsmLogger.js:277 📜 HISTORY [22:07:10] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:10] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:10] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:10] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [22:07:10] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'F0', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'F0', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'F0', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 2}
fsmLogger.js:277 💎 RESOURCES [22:07:10] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] Attempting collection from tile F0 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:10] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:10] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:10] [bot-0] Collection successful: +{"food":39,"debris":360,"special":0} -> Score: {"food":39,"debris":360,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 798, totalCollectedNow: 399, totalPreviouslyCollected: 0, totalCollectedSoFar: 399, isCompletelyCollected: false}
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] Tile F0 marked as collected in FSM memory {collected: false, collectedAt: 1750622830425, totalCollected: 399}
fsmLogger.js:270 💎 RESOURCES [22:07:10] 🔍 DEBUG: deductTileResources called {coord: 'F0', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:10] 🔍 DEBUG: Resource percentage calculated {coord: 'F0', originalResources: {…}, remainingResources: {…}, totalOriginal: 798, totalRemaining: 399, …}
fsmLogger.js:270 💎 RESOURCES [22:07:10] 🔍 DEBUG: TileStore updated successfully {coord: 'F0', newPercentage: 50, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:10] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'F0', deductedResources: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:10] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [22:07:10] 🔍 DEBUG: Tile F0 resource percentage update {coord: 'F0', resourcePercentage: 0, isPartiallyCollected: false, willShowPercentage: false, tileExists: true, …}
fsmLogger.js:277 🔵 INFO [22:07:10] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:10] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:10] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:10] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:12] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:12] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:12] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:12] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:12] State transition detected: evaluating → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:12] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:12] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:12] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.35', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:12] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.35
fsmLogger.js:270 🔵 INFO [22:07:12] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:12] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:13] 🏠 [bot-0] Ship started returning to base after collection - distance: 0.87
fsmLogger.js:277 📜 HISTORY [22:07:13] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:13] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:13] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:13] 🎯 [bot-0] Ship reached base after collection - distance: 0.80
fsmLogger.js:277 💎 RESOURCES [22:07:13] [bot-0] Ship should return to base: 399/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:13] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'F1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:13] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:13] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:13] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:13] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:13] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:15] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:15] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 2, collectibleDetails: Array(2), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:15] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 2, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:15] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:15] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:15] [bot-0] Selecting best tile for collection {totalKnownTiles: 2, collectibleTiles: 2, tileStates: Array(2)}
fsmLogger.js:277 💎 RESOURCES [22:07:15] [bot-0] Selected tile F0 for collection: {"food":78,"debris":720,"special":0}, position: {"x":1.0099420817681284,"y":0.6008368335960018,"z":-4.102760048442194}
fsmLogger.js:270 🔵 INFO [22:07:15] [bot-0] Preparing ship movement to collection target: F0 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:15] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:15] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:15] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:15] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.81', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:15] 🚢 [bot-0] Ship movement started - distance: 0.81
fsmLogger.js:270 🔵 INFO [22:07:15] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:15] 🚢 [bot-0] Ship movement started - distance: 0.60
fsmLogger.js:277 📜 HISTORY [22:07:15] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:15] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:15] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:16] 🚢 [bot-0] Ship movement started - distance: 0.54
fsmLogger.js:270 🔵 INFO [22:07:16] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:16] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:16] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:16] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:17] 🚢 [bot-0] Ship movement started - distance: 0.44
fsmLogger.js:277 📜 HISTORY [22:07:17] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:17] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:17] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:17] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.40', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:17] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:07:17] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'F0', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'F0', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'F0', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 2}
fsmLogger.js:277 💎 RESOURCES [22:07:17] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] Attempting collection from tile F0 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:17] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:17] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:17] [bot-0] Collection successful: +{"food":39,"debris":360,"special":0} -> Score: {"food":78,"debris":720,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 798, totalCollectedNow: 399, totalPreviouslyCollected: 399, totalCollectedSoFar: 798, isCompletelyCollected: true}
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] Tile F0 marked as collected in FSM memory {collected: true, collectedAt: 1750622837272, totalCollected: 798}
fsmLogger.js:270 💎 RESOURCES [22:07:17] 🔍 DEBUG: deductTileResources called {coord: 'F0', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:17] 🔍 DEBUG: Resource percentage calculated {coord: 'F0', originalResources: {…}, remainingResources: {…}, totalOriginal: 798, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [22:07:17] 🔍 DEBUG: TileStore updated successfully {coord: 'F0', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:17] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'F0', deductedResources: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:17] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:17] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:17] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:17] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:17] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:19] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:19] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:19] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:19] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:19] State transition detected: evaluating → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:19] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:19] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:19] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.21', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:19] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.21
fsmLogger.js:270 🔵 INFO [22:07:19] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:19] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:19] 🎯 [bot-0] Ship reached base after collection - distance: 0.80
fsmLogger.js:277 💎 RESOURCES [22:07:19] [bot-0] Ship should return to base: 399/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:19] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'F1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:19] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:19] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:19] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:19] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:19] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:21] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:21] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:21] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:21] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:21] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:21] [bot-0] Selecting best tile for collection {totalKnownTiles: 2, collectibleTiles: 1, tileStates: Array(2)}
fsmLogger.js:277 💎 RESOURCES [22:07:21] [bot-0] Selected tile E1 for collection: {"food":31,"debris":149,"special":1}, position: {"x":0.5700945111612195,"y":0.5532028573970114,"z":-2.9937578642411053}
fsmLogger.js:270 🔵 INFO [22:07:21] [bot-0] Preparing ship movement to collection target: E1 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:21] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:21] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:21] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:21] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:21] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '1.09', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:21] 🚢 [bot-0] Ship movement started - distance: 1.09
fsmLogger.js:270 🔵 INFO [22:07:21] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:21] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:22] 🚢 [bot-0] Ship movement started - distance: 0.81
fsmLogger.js:277 📜 HISTORY [22:07:22] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:22] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:22] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:23] 🚢 [bot-0] Ship movement started - distance: 0.63
fsmLogger.js:270 🔵 INFO [22:07:23] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:23] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:23] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:23] 🚢 [bot-0] Ship movement started - distance: 0.47
fsmLogger.js:277 📜 HISTORY [22:07:23] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:23] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:23] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:23] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.44', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:24] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:07:24] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'E1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'E1', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'E1', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 2}
fsmLogger.js:277 💎 RESOURCES [22:07:24] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] Attempting collection from tile E1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:24] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:24] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:24] [bot-0] Collection successful: +{"food":15,"debris":74,"special":0} -> Score: {"food":93,"debris":794,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 181, totalCollectedNow: 89, totalPreviouslyCollected: 0, totalCollectedSoFar: 89, isCompletelyCollected: false}
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] Tile E1 marked as collected in FSM memory {collected: false, collectedAt: 1750622844124, totalCollected: 89}
fsmLogger.js:270 💎 RESOURCES [22:07:24] 🔍 DEBUG: deductTileResources called {coord: 'E1', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:24] 🔍 DEBUG: Resource percentage calculated {coord: 'E1', originalResources: {…}, remainingResources: {…}, totalOriginal: 181, totalRemaining: 92, …}
fsmLogger.js:270 💎 RESOURCES [22:07:24] 🔍 DEBUG: TileStore updated successfully {coord: 'E1', newPercentage: 51, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:24] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'E1', deductedResources: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:24] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [22:07:24] 🔍 DEBUG: Tile E1 resource percentage update {coord: 'E1', resourcePercentage: 1, isPartiallyCollected: true, willShowPercentage: true, tileExists: true, …}
fsmLogger.js:277 📜 HISTORY [22:07:24] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:24] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:24] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:24] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [22:07:26] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:26] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:26] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:26] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:26] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] Selecting best tile for collection {totalKnownTiles: 2, collectibleTiles: 1, tileStates: Array(2)}
fsmLogger.js:277 💎 RESOURCES [22:07:26] [bot-0] Selected tile E1 for collection: {"food":31,"debris":149,"special":1}, position: {"x":0.5700945111612195,"y":0.5532028573970114,"z":-2.9937578642411053}
fsmLogger.js:270 🔵 INFO [22:07:26] [bot-0] Preparing ship movement to collection target: E1 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:26] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:26] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:26] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:26] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:26] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.40', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:26] 🚢 [bot-0] Ship movement started - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:07:26] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:26] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:26] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:277 💎 RESOURCES [22:07:26] [bot-0] Ship should return to base: 89/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:26] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'E1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'E1', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'E1', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 2}
fsmLogger.js:277 💎 RESOURCES [22:07:26] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] Attempting collection from tile E1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:26] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:26] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:26] [bot-0] Collection successful: +{"food":15,"debris":74,"special":0} -> Score: {"food":108,"debris":868,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 181, totalCollectedNow: 89, totalPreviouslyCollected: 89, totalCollectedSoFar: 178, isCompletelyCollected: false}
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] Tile E1 marked as collected in FSM memory {collected: false, collectedAt: 1750622846757, totalCollected: 178}
fsmLogger.js:270 💎 RESOURCES [22:07:26] 🔍 DEBUG: deductTileResources called {coord: 'E1', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:26] 🔍 DEBUG: Resource percentage calculated {coord: 'E1', originalResources: {…}, remainingResources: {…}, totalOriginal: 181, totalRemaining: 1, …}
fsmLogger.js:270 💎 RESOURCES [22:07:26] 🔍 DEBUG: TileStore updated successfully {coord: 'E1', newPercentage: 1, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:26] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'E1', deductedResources: {…}}
fsmLogger.js:270 🔵 INFO [22:07:26] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [22:07:26] [bot-0] Ship should return to base: 178/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:26] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'E1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:26] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:26] State transition detected: collecting_moving_to_target → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:26] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:26] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:28] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:28] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:28] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:28] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:28] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] Selecting best tile for collection {totalKnownTiles: 2, collectibleTiles: 1, tileStates: Array(2)}
fsmLogger.js:277 💎 RESOURCES [22:07:28] [bot-0] Selected tile E1 for collection: {"food":31,"debris":149,"special":1}, position: {"x":0.5700945111612195,"y":0.5532028573970114,"z":-2.9937578642411053}
fsmLogger.js:270 🔵 INFO [22:07:28] [bot-0] Preparing ship movement to collection target: E1 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:28] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:28] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.00', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:28] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [22:07:28] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'E1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'E1', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'E1', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 2}
fsmLogger.js:277 💎 RESOURCES [22:07:28] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] Attempting collection from tile E1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:28] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:28] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:28] [bot-0] Collection successful: +{"food":15,"debris":74,"special":0} -> Score: {"food":123,"debris":942,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 181, totalCollectedNow: 89, totalPreviouslyCollected: 178, totalCollectedSoFar: 267, isCompletelyCollected: true}
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] Tile E1 marked as collected in FSM memory {collected: true, collectedAt: 1750622848780, totalCollected: 267}
fsmLogger.js:270 💎 RESOURCES [22:07:28] 🔍 DEBUG: deductTileResources called {coord: 'E1', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:28] 🔍 DEBUG: Resource percentage calculated {coord: 'E1', originalResources: {…}, remainingResources: {…}, totalOriginal: 181, totalRemaining: 1, …}
fsmLogger.js:270 💎 RESOURCES [22:07:28] 🔍 DEBUG: TileStore updated successfully {coord: 'E1', newPercentage: 1, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:28] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'E1', deductedResources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:28] [bot-0] Ship should return to base: 178/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:28] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'E1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:28] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:28] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:28] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:28] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:28] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:30] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:30] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:30] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:30] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:30] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:30] [bot-0] Selecting best tile for collection {totalKnownTiles: 2, collectibleTiles: 1, tileStates: Array(2)}
fsmLogger.js:277 💎 RESOURCES [22:07:30] [bot-0] Selected tile E1 for collection: {"food":31,"debris":149,"special":1}, position: {"x":0.5700945111612195,"y":0.5532028573970114,"z":-2.9937578642411053}
fsmLogger.js:270 🔵 INFO [22:07:30] [bot-0] Preparing ship movement to collection target: E1 {targetPosition: {…}}
fsmLogger.js:270 🔵 INFO [22:07:30] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:30] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:30] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:30] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:30] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:30] 🚀 [bot-0] explorer drone deployed - distance: 2.25
fsmLogger.js:277 📜 HISTORY [22:07:30] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:31] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [22:07:31] ✅ [bot-0] Tile explored by explorer: "F2"
fsmLogger.js:277 💎 RESOURCES [22:07:31] 💎 [bot-0] explorer discovered resources from tile: {"food":32,"debris":499,"special":0}
fsmLogger.js:270 🔵 INFO [22:07:31] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'F2', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:31] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'F2', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:31] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:31] 🗺️ Tile F2 is now marked as explored
fsmLogger.js:277 🚀 MOUVEMENT [22:07:31] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [22:07:31] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [22:07:31] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:33] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:33] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:33] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:33] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:33] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:33] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 1, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [22:07:33] [bot-0] Selected tile F2 for collection: {"food":32,"debris":499,"special":0}, position: {"x":2.384852044063871,"y":0.5540157137149543,"z":-2.060264633069891}
fsmLogger.js:270 🔵 INFO [22:07:33] [bot-0] Preparing ship movement to collection target: F2 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:33] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:33] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '2.08', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:33] 🚢 [bot-0] Ship movement started - distance: 2.08
fsmLogger.js:270 🔵 INFO [22:07:33] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:33] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:33] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:33] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:34] 🚢 [bot-0] Ship movement started - distance: 1.29
fsmLogger.js:277 📜 HISTORY [22:07:34] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:34] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:34] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:34] 🚢 [bot-0] Ship movement started - distance: 0.90
fsmLogger.js:270 🔵 INFO [22:07:34] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:34] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:34] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:34] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:35] 🚢 [bot-0] Ship movement started - distance: 0.70
fsmLogger.js:277 📜 HISTORY [22:07:35] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:35] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:35] NO context change detected for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:35] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.65', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:35] 🚢 [bot-0] Ship movement started - distance: 0.54
fsmLogger.js:270 🔵 INFO [22:07:35] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:35] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:35] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:35] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:36] 🚢 [bot-0] Ship movement started - distance: 0.41
fsmLogger.js:277 📜 HISTORY [22:07:36] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:36] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:36] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:36] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:277 💎 RESOURCES [22:07:36] [bot-0] Ship should return to base: 89/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:36] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'F2', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'F2', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'F2', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 3}
fsmLogger.js:277 💎 RESOURCES [22:07:36] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] Attempting collection from tile F2 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:36] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:36] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:36] [bot-0] Collection successful: +{"food":16,"debris":249,"special":0} -> Score: {"food":139,"debris":1191,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 531, totalCollectedNow: 265, totalPreviouslyCollected: 0, totalCollectedSoFar: 265, isCompletelyCollected: false}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] Tile F2 marked as collected in FSM memory {collected: false, collectedAt: 1750622856645, totalCollected: 265}
fsmLogger.js:270 💎 RESOURCES [22:07:36] 🔍 DEBUG: deductTileResources called {coord: 'F2', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:36] 🔍 DEBUG: Resource percentage calculated {coord: 'F2', originalResources: {…}, remainingResources: {…}, totalOriginal: 531, totalRemaining: 266, …}
fsmLogger.js:270 💎 RESOURCES [22:07:36] 🔍 DEBUG: TileStore updated successfully {coord: 'F2', newPercentage: 50, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'F2', deductedResources: {…}}
fsmLogger.js:270 🔵 INFO [22:07:36] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:36] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'E1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] Attempting collection from tile E1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:36] [bot-0] Collection successful: +{"food":15,"debris":74,"special":0} -> Score: {"food":123,"debris":942,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:36] [bot-0] Tile E1 marked as collected in FSM memory {collected: true, collectedAt: 1750622856647, totalCollected: 267}
fsmLogger.js:277 💎 RESOURCES [22:07:36] [bot-0] Ship should return to base: 354/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:36] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'F2', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:36] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [22:07:36] 🔍 DEBUG: Tile F2 resource percentage update {coord: 'F2', resourcePercentage: 50, isPartiallyCollected: true, willShowPercentage: true, tileExists: true, …}
fsmLogger.js:277 📜 HISTORY [22:07:36] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:36] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:36] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:36] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [22:07:38] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:38] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 2, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:38] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 2, required: 2, hasEnoughExplored: true, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [22:07:38] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:38] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:38] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:38] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 1, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [22:07:38] [bot-0] Selected tile F2 for collection: {"food":32,"debris":499,"special":0}, position: {"x":2.384852044063871,"y":0.5540157137149543,"z":-2.060264633069891}
fsmLogger.js:270 🔵 INFO [22:07:38] [bot-0] Preparing ship movement to collection target: F2 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:38] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:38] State transition detected: evaluating → exploring_deploying for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:38] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'deploying', lastDroneState: 'docked', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:38] Context change detected for bot bot-0: {droneStateChange: 'docked → deploying', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:38] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.40', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:38] 🚢 [bot-0] Ship movement started - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:07:38] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:38] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:39] 🎯 [bot-0] Ship reached target - distance: 0.00
fsmLogger.js:270 🔵 INFO [22:07:39] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'F2', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'F2', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'F2', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 3}
fsmLogger.js:277 💎 RESOURCES [22:07:39] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] Attempting collection from tile F2 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:39] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:39] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:39] [bot-0] Collection successful: +{"food":16,"debris":249,"special":0} -> Score: {"food":155,"debris":1440,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 531, totalCollectedNow: 265, totalPreviouslyCollected: 265, totalCollectedSoFar: 530, isCompletelyCollected: false}
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] Tile F2 marked as collected in FSM memory {collected: false, collectedAt: 1750622859272, totalCollected: 530}
fsmLogger.js:270 💎 RESOURCES [22:07:39] 🔍 DEBUG: deductTileResources called {coord: 'F2', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:39] 🔍 DEBUG: Resource percentage calculated {coord: 'F2', originalResources: {…}, remainingResources: {…}, totalOriginal: 531, totalRemaining: 1, …}
fsmLogger.js:270 💎 RESOURCES [22:07:39] 🔍 DEBUG: TileStore updated successfully {coord: 'F2', newPercentage: 0, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:39] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'F2', deductedResources: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:39] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [22:07:39] 🔍 DEBUG: Tile F2 resource percentage update {coord: 'F2', resourcePercentage: 0, isPartiallyCollected: false, willShowPercentage: false, tileExists: true, …}
fsmLogger.js:277 🔵 INFO [22:07:41] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:41] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:41] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:41] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:41] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.29', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:41] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.29
fsmLogger.js:270 🔵 INFO [22:07:41] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:41] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:41] 🏠 [bot-0] Ship started returning to base after collection - distance: 0.83
fsmLogger.js:277 📜 HISTORY [22:07:41] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:41] 🎯 [bot-0] Ship reached base after collection - distance: 0.80
fsmLogger.js:277 💎 RESOURCES [22:07:41] [bot-0] Ship should return to base: 265/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:41] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'F1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:41] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:41] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [22:07:43] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:43] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:43] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:43] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:43] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:43] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 1, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [22:07:43] [bot-0] Selected tile F2 for collection: {"food":32,"debris":499,"special":0}, position: {"x":2.384852044063871,"y":0.5540157137149543,"z":-2.060264633069891}
fsmLogger.js:270 🔵 INFO [22:07:43] [bot-0] Preparing ship movement to collection target: F2 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:43] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:43] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.76', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:43] 🚢 [bot-0] Ship movement started - distance: 0.76
fsmLogger.js:270 🔵 INFO [22:07:43] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:43] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:44] 🚢 [bot-0] Ship movement started - distance: 0.64
fsmLogger.js:277 📜 HISTORY [22:07:44] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:45] 🚢 [bot-0] Ship movement started - distance: 0.53
fsmLogger.js:270 🔵 INFO [22:07:45] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:45] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:45] 🚢 [bot-0] Ship movement started - distance: 0.41
fsmLogger.js:277 📜 HISTORY [22:07:45] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:45] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:07:45] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'F2', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'F2', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'F2', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 3}
fsmLogger.js:277 💎 RESOURCES [22:07:45] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] Attempting collection from tile F2 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:45] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:45] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:45] [bot-0] Collection successful: +{"food":16,"debris":249,"special":0} -> Score: {"food":171,"debris":1689,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 531, totalCollectedNow: 265, totalPreviouslyCollected: 530, totalCollectedSoFar: 795, isCompletelyCollected: true}
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] Tile F2 marked as collected in FSM memory {collected: true, collectedAt: 1750622865897, totalCollected: 795}
fsmLogger.js:270 💎 RESOURCES [22:07:45] 🔍 DEBUG: deductTileResources called {coord: 'F2', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:45] 🔍 DEBUG: Resource percentage calculated {coord: 'F2', originalResources: {…}, remainingResources: {…}, totalOriginal: 531, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [22:07:45] 🔍 DEBUG: TileStore updated successfully {coord: 'F2', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:45] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'F2', deductedResources: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:45] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:45] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [22:07:47] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:47] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:47] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:47] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:47] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.15', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:47] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.15
fsmLogger.js:270 🔵 INFO [22:07:47] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:47] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:48] 🎯 [bot-0] Ship reached base after collection - distance: 0.80
fsmLogger.js:277 💎 RESOURCES [22:07:48] [bot-0] Ship should return to base: 265/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:48] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'F1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:48] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:48] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 🔵 INFO [22:07:50] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:50] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 0, collectibleDetails: Array(0), result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:50] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 2, hasEnoughExplored: true, collectibleTiles: 0, hasCollectibles: false, …}
fsmLogger.js:270 🔵 INFO [22:07:50] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: false, shouldTransition: false, result: false, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:50] 🚁 [Evaluating] Starting exploration - deploying drone {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:50] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:50] 🚀 [bot-0] explorer drone deployed - distance: 1.60
fsmLogger.js:277 📜 HISTORY [22:07:50] Received sync event: DRONE_DEPLOYED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:50] 🔍 [bot-0] explorer target reached - distance: 0.59
fsmLogger.js:277 🚀 MOUVEMENT [22:07:50] ✅ [bot-0] Tile explored by explorer: "G1"
fsmLogger.js:277 💎 RESOURCES [22:07:50] 💎 [bot-0] explorer discovered resources from tile: {"food":22,"debris":361,"special":0}
fsmLogger.js:270 🔵 INFO [22:07:50] 🎯 [Exploring] Tile explored, updating unified memory {coord: 'G1', hasResources: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:50] 🔄 [Exploring] Drone recalled to ship after exploration {coord: 'G1', droneType: 'explorer', botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:50] Received sync event: TILE_EXPLORED for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:50] 🗺️ Tile G1 is now marked as explored
fsmLogger.js:270 📜 HISTORY [22:07:50] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'returning', lastDroneState: 'deploying', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:50] Context change detected for bot bot-0: {droneStateChange: 'deploying → returning', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:51] 🏠 [bot-0] explorer drone reached ship - distance: 0.60
fsmLogger.js:270 🔵 INFO [22:07:51] 🏠 [Exploring] Drone reached ship, docking complete {botId: 'bot-0', droneType: 'explorer'}
fsmLogger.js:277 📜 HISTORY [22:07:51] Received sync event: DRONE_REACHED_SHIP for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:51] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:51] State transition detected: exploring_deploying → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:51] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'returning', droneStateChanged: true, …}
fsmLogger.js:270 📜 HISTORY [22:07:51] Context change detected for bot bot-0: {droneStateChange: 'returning → docked', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:53] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:53] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:53] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:53] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:53] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:53] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 1, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [22:07:53] [bot-0] Selected tile G1 for collection: {"food":22,"debris":361,"special":0}, position: {"x":3.0511165388956787,"y":0.6291635396089045,"z":-2.929490621502581}
fsmLogger.js:270 🔵 INFO [22:07:53] [bot-0] Preparing ship movement to collection target: G1 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:53] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:53] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:53] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:53] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:53] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '1.06', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:53] 🚢 [bot-0] Ship movement started - distance: 1.06
fsmLogger.js:270 🔵 INFO [22:07:53] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:53] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:53] 🚢 [bot-0] Ship movement started - distance: 0.75
fsmLogger.js:277 📜 HISTORY [22:07:53] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:53] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:53] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:54] 🚢 [bot-0] Ship movement started - distance: 0.58
fsmLogger.js:270 🔵 INFO [22:07:54] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:54] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:54] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:54] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:54] 🚢 [bot-0] Ship movement started - distance: 0.44
fsmLogger.js:277 📜 HISTORY [22:07:54] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:54] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:07:54] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:07:55] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:07:55] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'G1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'G1', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'G1', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 4}
fsmLogger.js:277 💎 RESOURCES [22:07:55] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] Attempting collection from tile G1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:55] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:07:55] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:07:55] [bot-0] Collection successful: +{"food":11,"debris":180,"special":0} -> Score: {"food":182,"debris":1869,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 383, totalCollectedNow: 191, totalPreviouslyCollected: 0, totalCollectedSoFar: 191, isCompletelyCollected: false}
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] Tile G1 marked as collected in FSM memory {collected: false, collectedAt: 1750622875012, totalCollected: 191}
fsmLogger.js:270 💎 RESOURCES [22:07:55] 🔍 DEBUG: deductTileResources called {coord: 'G1', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:55] 🔍 DEBUG: Resource percentage calculated {coord: 'G1', originalResources: {…}, remainingResources: {…}, totalOriginal: 383, totalRemaining: 192, …}
fsmLogger.js:270 💎 RESOURCES [22:07:55] 🔍 DEBUG: TileStore updated successfully {coord: 'G1', newPercentage: 50, isCompletelyCollected: false, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:07:55] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'G1', deductedResources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:07:55] [bot-0] Ship should return to base: 89/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:55] 🚢 [Collecting] Ship arrived at target tile, collecting and returning to base {coord: 'G1', botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [22:07:55] [bot-0] Collection successful: +{"food":11,"debris":180,"special":0} -> Score: {"food":134,"debris":1122,"special":0}
fsmLogger.js:270 🔵 INFO [22:07:55] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:55] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:270 💎 RESOURCES [22:07:55] 🔍 DEBUG: Tile G1 resource percentage update {coord: 'G1', resourcePercentage: 0, isPartiallyCollected: false, willShowPercentage: false, tileExists: true, …}
fsmLogger.js:277 📜 HISTORY [22:07:55] State transition detected: collecting_moving_to_target → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:55] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:55] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:57] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:57] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:57] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:57] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:270 🔧 CONTEXT [22:07:57] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.18', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:57] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.18
fsmLogger.js:270 🔵 INFO [22:07:57] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:57] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:57] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:57] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:57] 🎯 [bot-0] Ship reached base after collection - distance: 0.80
fsmLogger.js:277 💎 RESOURCES [22:07:57] [bot-0] Ship should return to base: 191/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:07:57] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'F1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 💎 RESOURCES [22:07:57] [bot-0] Ship should return to base: 280/10 resources (threshold: 8)
fsmLogger.js:277 📜 HISTORY [22:07:57] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:07:57] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:07:57] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:57] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:57] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:07:59] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:07:59] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:59] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:07:59] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:07:59] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:07:59] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 1, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [22:07:59] [bot-0] Selected tile G1 for collection: {"food":22,"debris":361,"special":0}, position: {"x":3.0511165388956787,"y":0.6291635396089045,"z":-2.929490621502581}
fsmLogger.js:270 🔵 INFO [22:07:59] [bot-0] Preparing ship movement to collection target: G1 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:07:59] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:07:59] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:07:59] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:07:59] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:07:59] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.67', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:07:59] 🚢 [bot-0] Ship movement started - distance: 0.67
fsmLogger.js:270 🔵 INFO [22:07:59] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:07:59] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:00] 🚢 [bot-0] Ship movement started - distance: 0.58
fsmLogger.js:277 📜 HISTORY [22:08:00] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:08:00] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:00] 🚢 [bot-0] Ship movement started - distance: 0.48
fsmLogger.js:270 🔵 INFO [22:08:00] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:08:00] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:00] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:08:00] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:01] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:08:01] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'G1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'G1', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'G1', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 4}
fsmLogger.js:277 💎 RESOURCES [22:08:01] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] Attempting collection from tile G1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:08:01] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:08:01] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:08:01] [bot-0] Collection successful: +{"food":11,"debris":180,"special":0} -> Score: {"food":193,"debris":2049,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 383, totalCollectedNow: 191, totalPreviouslyCollected: 191, totalCollectedSoFar: 382, isCompletelyCollected: false}
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] Tile G1 marked as collected in FSM memory {collected: false, collectedAt: 1750622881154, totalCollected: 382}
fsmLogger.js:270 💎 RESOURCES [22:08:01] 🔍 DEBUG: deductTileResources called {coord: 'G1', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:08:01] 🔍 DEBUG: Resource percentage calculated {coord: 'G1', originalResources: {…}, remainingResources: {…}, totalOriginal: 383, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [22:08:01] 🔍 DEBUG: TileStore updated successfully {coord: 'G1', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:08:01] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'G1', deductedResources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:08:01] [bot-0] Collection successful: +{"food":11,"debris":180,"special":0} -> Score: {"food":145,"debris":1302,"special":0}
fsmLogger.js:277 📜 HISTORY [22:08:01] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:08:01] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:08:01] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:01] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:08:01] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:08:03] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:08:03] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:08:03] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:08:03] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:08:03] State transition detected: evaluating → collecting_returning_to_base for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:08:03] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:08:03] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.18', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:08:03] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.18
fsmLogger.js:270 🔵 INFO [22:08:03] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:08:03] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:03] 🏠 [bot-0] Ship started returning to base after collection - distance: 0.81
fsmLogger.js:277 📜 HISTORY [22:08:03] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:03] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:08:03] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:03] 🎯 [bot-0] Ship reached base after collection - distance: 0.80
fsmLogger.js:277 💎 RESOURCES [22:08:03] [bot-0] Ship should return to base: 191/10 resources (threshold: 8)
fsmLogger.js:270 🔵 INFO [22:08:03] 🏠 [ReturningToBase] Ship arrived at base, depositing resources {position: {…}, tileCoord: 'F1', carriedResources: {…}, botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:08:03] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:08:03] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:08:03] State transition detected: collecting_returning_to_base → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:03] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:08:05] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:08:05] 🎯 [hasBestTileForCollection] Guard check {totalKnownTiles: 3, collectibleTiles: 1, collectibleDetails: Array(1), result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:08:05] 🔄 [shouldTransitionToCollection] Guard check {exploredCount: 3, required: 2, hasEnoughExplored: true, collectibleTiles: 1, hasCollectibles: true, …}
fsmLogger.js:270 🔵 INFO [22:08:05] 🔍 [Evaluating] Collection transition evaluation {hasEnoughExplored: true, hasBestTile: true, shouldTransition: true, result: true, botId: 'bot-0'}
fsmLogger.js:270 🔵 INFO [22:08:05] 🎯 [Evaluating] Starting collection phase - selecting best tile {botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:08:05] [bot-0] Selecting best tile for collection {totalKnownTiles: 3, collectibleTiles: 1, tileStates: Array(3)}
fsmLogger.js:277 💎 RESOURCES [22:08:05] [bot-0] Selected tile G1 for collection: {"food":22,"debris":361,"special":0}, position: {"x":3.0511165388956787,"y":0.6291635396089045,"z":-2.929490621502581}
fsmLogger.js:270 🔵 INFO [22:08:05] [bot-0] Preparing ship movement to collection target: G1 {targetPosition: {…}}
fsmLogger.js:277 📜 HISTORY [22:08:05] Received sync event: EVALUATION_COMPLETE for bot bot-0
fsmLogger.js:277 📜 HISTORY [22:08:05] State transition detected: evaluating → collecting_moving_to_target for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:05] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:08:05] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:270 🔧 CONTEXT [22:08:05] 🔍 [bot-0] Ship action tracking {currentAction: 'moving_to_target', handlerCategory: 'moving_to_tile', distance: '0.81', targetPosition: {…}}
fsmLogger.js:277 🚀 MOUVEMENT [22:08:05] 🚢 [bot-0] Ship movement started - distance: 0.81
fsmLogger.js:270 🔵 INFO [22:08:05] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:08:05] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:06] 🚢 [bot-0] Ship movement started - distance: 0.61
fsmLogger.js:277 📜 HISTORY [22:08:06] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:06] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:08:06] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:07] 🚢 [bot-0] Ship movement started - distance: 0.49
fsmLogger.js:270 🔵 INFO [22:08:07] 🚢 [Collecting] Ship movement started toward target tile {botId: 'bot-0'}
fsmLogger.js:277 📜 HISTORY [22:08:07] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:07] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:277 📜 HISTORY [22:08:07] NO context change detected for bot bot-0
fsmLogger.js:277 🚀 MOUVEMENT [22:08:07] 🎯 [bot-0] Ship reached target - distance: 0.40
fsmLogger.js:270 🔵 INFO [22:08:07] 🚢 [Collecting] Ship arrived at target tile, collecting and continuing exploration {coord: 'G1', botId: 'bot-0'}
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] 🔍 START shipCollectsFromTile with event: {coord: 'G1', resourceType: 'all'}
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] 🔍 DEBUG: Collection attempt started {entityId: 'bot-0', eventCoord: 'G1', eventResourceType: 'all', contextMemoryExists: true, knownTilesCount: 4}
fsmLogger.js:277 💎 RESOURCES [22:08:07] [bot-0] ✅ Basic validation passed, checking memory...
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] Attempting collection from tile G1 {tileExists: true, explored: true, alreadyCollected: false, hasResources: true, resources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:08:07] [bot-0] ✅ Tile validation passed, calculating collection...
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] 🔍 DEBUG: Partial collection (50%) {originalResources: {…}, resourcesToCollect: {…}, collectionPercentage: 0.5}
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] 📊 Collection calculation {resourcesToCollect: {…}, currentResources: {…}, maxCapacity: {…}, vehicleType: 'main_ship', originalMaxCapacity: 10, …}
fsmLogger.js:277 💎 RESOURCES [22:08:07] [bot-0] ✅ Capacity check passed, updating resources...
fsmLogger.js:277 💎 RESOURCES [22:08:07] [bot-0] Collection successful: +{"food":11,"debris":180,"special":0} -> Score: {"food":204,"debris":2229,"special":0}
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] 🔍 DEBUG: Collection completion check {totalOriginalResources: 383, totalCollectedNow: 191, totalPreviouslyCollected: 382, totalCollectedSoFar: 573, isCompletelyCollected: true}
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] Tile G1 marked as collected in FSM memory {collected: true, collectedAt: 1750622887497, totalCollected: 573}
fsmLogger.js:270 💎 RESOURCES [22:08:07] 🔍 DEBUG: deductTileResources called {coord: 'G1', collectedResources: {…}, tileExists: true, tileHasResources: true, currentResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:08:07] 🔍 DEBUG: Resource percentage calculated {coord: 'G1', originalResources: {…}, remainingResources: {…}, totalOriginal: 383, totalRemaining: 0, …}
fsmLogger.js:270 💎 RESOURCES [22:08:07] 🔍 DEBUG: TileStore updated successfully {coord: 'G1', newPercentage: 0, isCompletelyCollected: true, finalResources: {…}}
fsmLogger.js:270 💎 RESOURCES [22:08:07] [bot-0] ✅ TileStore synchronized - partial collection enabled {coord: 'G1', deductedResources: {…}}
fsmLogger.js:277 💎 RESOURCES [22:08:07] [bot-0] Collection successful: +{"food":11,"debris":180,"special":0} -> Score: {"food":156,"debris":1482,"special":0}
fsmLogger.js:277 📜 HISTORY [22:08:07] Received sync event: SHIP_ARRIVED_AT_TILE for bot bot-0
fsmLogger.js:277 🔵 INFO [22:08:07] 🔄 [useBotMachine] Resetting evaluation flag for new cycle - bot-0
fsmLogger.js:277 📜 HISTORY [22:08:07] State transition detected: collecting_moving_to_target → evaluating for bot bot-0
fsmLogger.js:270 📜 HISTORY [22:08:07] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
fsmLogger.js:270 📜 HISTORY [22:08:07] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
fsmLogger.js:277 🔵 INFO [22:08:09] 🎯 [useBotMachine] Sending EVALUATION_COMPLETE for bot-0
fsmLogger.js:270 🔵 INFO [22:08:09] 🚢 [Evaluating] Ship returning to base for safety {reason: 'full_capacity', botId: 'bot-0'}
 🔵 INFO [22:08:09] 🏠 [prepareReturningToBase] Using base position from context {basePosition: {…}, botId: 'bot-0'}
 📜 HISTORY [22:08:09] Received sync event: EVALUATION_COMPLETE for bot bot-0
 📜 HISTORY [22:08:09] State transition detected: evaluating → collecting_returning_to_base for bot bot-0
 📜 HISTORY [22:08:09] Context effect triggered for bot bot-0: {hasContext: true, hasLastContext: true, currentDroneState: 'docked', lastDroneState: 'docked', droneStateChanged: false, …}
 📜 HISTORY [22:08:09] Context change detected for bot bot-0: {droneStateChange: 'none', reason: 'significant change detected'}
 🔧 CONTEXT [22:08:09] 🔍 [bot-0] Ship action tracking {currentAction: 'returning_to_base', handlerCategory: 'collecting_returning_to_base', distance: '1.17', targetPosition: {…}}
 🚀 MOUVEMENT [22:08:09] 🏠 [bot-0] Ship started returning to base after collection - distance: 1.17
 🔵 INFO [22:08:09] 🚢 [Collecting] Ship movement started toward base {botId: 'bot-0'}
 📜 HISTORY [22:08:09] Received sync event: SHIP_MOVEMENT_STARTED for bot bot-0
