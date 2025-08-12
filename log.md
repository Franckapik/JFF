VM284:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [22:24:19] Tiles initialized
fsmLogger.ts:207 🎮 GAME [22:24:19] [XFSMStore] Creation bot-0 - Status: active, State: evaluating, StateType: string
fsmLogger.ts:207 🎮 GAME [22:24:19] Bots initialized
fsmLogger.ts:207 🎮 GAME [22:24:19] Players initialized
fsmLogger.ts:207 🎮 GAME [22:24:19] [TileGeneration] Tuile de départ assignée à bot-0:1,2
fsmLogger.ts:207 🎮 GAME [22:24:19] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [22:24:19] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:19] 🚢 [bot-0] Initializing ship with context base position {basePosition: {…}, shipType: 'main-ship'}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:19] 🚢 [bot-0] Ship initialized at base {basePosition: {…}, shipType: 'main-ship', botId: 'bot-0'}
fsmLogger.ts:199 ⚡ EVENT [22:24:19] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🔵 INFO [22:24:19] 🚢 [bot-0] SHIP_POSITION_UPDATE sent for initialization {shipType: 'main-ship', position: {…}}
fsmLogger.ts:199 🔵 INFO [22:24:19] 🚢 calculateShipPath: Tile verification {startGridCoord: '0,0', targetCoord: '0,0', startTileExists: false, targetTileExists: false, startTileWalkable: undefined, …}
fsmLogger.ts:199 🔵 INFO [22:24:19] 🚢 calculateShipPath: Tile not found for coord {coord: '0,0'}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:19] 🚢 calculateShipPath: Path calculated successfully {startGridCoord: '0,0', targetCoord: '0,0', pathLength: 1, worldPath: Array(1)}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:19] 🚢 [main-ship] New path calculated {from: {…}, to: {…}, pathLength: 1, isReturning: false, path: Array(1)}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:19] 🚢 [bot-0] Initializing ship with fleet position {fleetPosition: {…}, shipType: 'main-ship'}
fsmLogger.ts:207 🔧 CONTEXT [22:24:19] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [22:24:19] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:19] 🚢 [main-ship] Transmitting initial fleet position to FSM tracker: {x: -4.330127018922193, y: 0.5, z: -1.5}
fsmLogger.ts:207 🟠 ACTION [22:24:19] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:24:19] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [22:24:19] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'main-ship'}
fsmLogger.ts:207 🔧 CONTEXT [22:24:19] 🚢 [bot-0] First ship position update - setting as base position
fsmLogger.ts:199 🔧 CONTEXT [22:24:19] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: undefined, droneType: 'explorer'}
fsmLogger.ts:207 🎮 GAME [22:24:19] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating, StateType: string
fsmLogger.ts:199 🔵 INFO [22:24:19] 🚢 calculateShipPath: No valid path found, creating direct path {startGridCoord: '-4,-1', targetCoord: '0,0'}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:19] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'docked', isMoving: false}
fsmLogger.ts:207 🔵 INFO [22:24:19] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:199 🟣 CONDITION [22:24:19] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:19] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:24:19] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:24:19] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [22:24:19] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 2}
fsmLogger.ts:199 🔵 INFO [22:24:19] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:19] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [22:24:19] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:207 🔵 INFO [22:24:20] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:21] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.597752254695532, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [22:24:21] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:21] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [22:24:21] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [22:24:21] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [22:24:21] 📊 [bot-0] Incrémentation exploration: 0 → 1
fsmLogger.ts:207 🟠 ACTION [22:24:21] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:21] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [22:24:23] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [22:24:23] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [22:24:23] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [22:24:23] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [22:24:23] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:23] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:23] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.1709632490454378, threshold: 1.2}
fsmLogger.ts:199 ⚡ EVENT [22:24:23] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:23] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [22:24:23] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:199 🔵 INFO [22:24:23] 🔄 [bot-0] assignDroneDockedContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_BASE', currentDroneState: 'returning'}
fsmLogger.ts:207 🔵 INFO [22:24:23] 🏠 [bot-0] Updating drone state to docked and context to evaluating
fsmLogger.ts:207 🟠 ACTION [22:24:23] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:24:23] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [22:24:23] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:199 🟣 CONDITION [22:24:23] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:23] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:24:23] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:24:23] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [22:24:23] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 2}
fsmLogger.ts:199 🔵 INFO [22:24:23] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:23] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [22:24:23] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:23] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:207 🔵 INFO [22:24:23] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:24] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5939452262019043, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [22:24:24] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:24] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [22:24:24] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [22:24:24] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [22:24:24] 📊 [bot-0] Incrémentation exploration: 1 → 2
fsmLogger.ts:207 🟠 ACTION [22:24:24] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:24] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [22:24:26] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [22:24:26] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [22:24:26] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [22:24:26] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [22:24:26] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:26] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:26] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.190517627004026, threshold: 1.2}
fsmLogger.ts:199 ⚡ EVENT [22:24:26] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:26] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [22:24:26] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:199 🔵 INFO [22:24:26] 🔄 [bot-0] assignDroneDockedContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_BASE', currentDroneState: 'returning'}
fsmLogger.ts:207 🔵 INFO [22:24:26] 🏠 [bot-0] Updating drone state to docked and context to evaluating
fsmLogger.ts:207 🟠 ACTION [22:24:26] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:24:26] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [22:24:26] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:199 🟣 CONDITION [22:24:26] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:26] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:24:26] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:24:26] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [22:24:26] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 2}
fsmLogger.ts:199 🔵 INFO [22:24:26] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:26] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [22:24:26] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:207 🔵 INFO [22:24:26] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:28] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5999948889862552, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [22:24:28] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:28] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [22:24:28] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [22:24:28] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [22:24:28] 📊 [bot-0] Incrémentation exploration: 2 → 3
fsmLogger.ts:207 🟠 ACTION [22:24:28] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:28] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [22:24:30] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [22:24:30] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [22:24:30] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [22:24:30] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [22:24:30] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:30] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.1839952785455938, threshold: 1.2}
fsmLogger.ts:199 ⚡ EVENT [22:24:30] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:30] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [22:24:30] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:199 🔵 INFO [22:24:30] 🔄 [bot-0] assignDroneDockedContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_BASE', currentDroneState: 'returning'}
fsmLogger.ts:207 🔵 INFO [22:24:30] 🏠 [bot-0] Updating drone state to docked and context to evaluating
fsmLogger.ts:207 🟠 ACTION [22:24:30] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:24:30] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [22:24:30] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:207 🔵 INFO [22:24:30] [bot-0] shouldExplore: false - déjà 3 explorations dans ce cycle (limite: 2)
fsmLogger.ts:199 🟣 CONDITION [22:24:30] [GUARD] shouldExplore: false {context: {…}, event: {…}}
fsmLogger.ts:207 🔵 INFO [22:24:30] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:207 🔵 INFO [22:24:30] [bot-0] shouldCollect: true - Vaisseau prend le relais après 3 explorations par drone
fsmLogger.ts:199 🟣 CONDITION [22:24:30] [GUARD] shouldCollect: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:30] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:24:30] 🔄 [bot-0] assignShipMovingToTileContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_COLLECTING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:24:30] 🔄 [bot-0] Updating context for ship movement: NEED_COLLECTING
fsmLogger.ts:199 🔵 INFO [22:24:30] 🚢 [bot-0] Setting ship target for collection: {targetPosition: {…}, targetGridCoord: '-1,-4', currentPosition: {…}}
fsmLogger.ts:199 🔵 INFO [22:24:30] ✅ [bot-0] Ship movement setup result: {hasVehicle: true, targetTile: '-1,-4', isMoving: true, selectedTile: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:30] 📦 [bot-0] Entrée dans l'état COLLECTING
fsmLogger.ts:207 🟠 ACTION [22:24:30] 🚢 [bot-0] Entrée dans l'état SHIP_MOVING_TO_TILE
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:30] 🚢 [main-ship] Animation ENABLED {shipState: 'collecting_ship_moving_to_tile', isMoving: true, isActive: true, needsAnimation: true}
fsmLogger.ts:199 🔵 INFO [22:24:30] 🚢 calculateShipPath: Tile verification {startGridCoord: '-4,-1', targetCoord: '-1,-4', startTileExists: false, targetTileExists: false, startTileWalkable: undefined, …}
fsmLogger.ts:199 🔵 INFO [22:24:30] 🚢 calculateShipPath: No valid path found, creating direct path {startGridCoord: '-4,-1', targetCoord: '-1,-4'}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:30] 🚢 [main-ship] New path calculated {from: {…}, to: '-1,-4', pathLength: 2, isReturning: false, path: Array(2)}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:32] 🚢 [bot-0] Ship reached target tile (threshold: 0.6) {position: {…}, distance: 0.5992435274392213, TILE_DETECTION_THRESHOLD: 0.6, shipType: 'main-ship'}
fsmLogger.ts:199 ⚡ EVENT [22:24:32] SHIP_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:199 🔵 INFO [22:24:32] 🔍 [canCollectTile] Vehicle collection status: {totalResources: 0, maxCapacity: 2003, hasCapacity: true, fuel: 100, hasEnoughFuel: true, …}
fsmLogger.ts:199 🟣 CONDITION [22:24:32] [GUARD] canCollectTile: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:32] 🚢 [bot-0] Sortie de l'état SHIP_MOVING_TO_TILE
fsmLogger.ts:199 🔵 INFO [22:24:32] 🔄 [bot-0] assignShipCollectingContext called with: {hasContext: true, hasEvent: true, eventType: 'SHIP_REACHES_TILE', currentVehicleState: true}
fsmLogger.ts:207 🔵 INFO [22:24:32] 📦 [bot-0] Updating vehicle state to collecting
fsmLogger.ts:207 🟠 ACTION [22:24:32] 📦 [bot-0] Entrée dans l'état SHIP_COLLECTING
fsmLogger.ts:199 ⚡ EVENT [22:24:32] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:199 🔧 CONTEXT [22:24:32] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'main-ship'}
fsmLogger.ts:199 🟠 ACTION [22:24:32] 📦 [bot-0] Ship collecting tracker called {position: {…}, vehicle: true, shipType: 'main-ship'}
fsmLogger.ts:199 🟠 ACTION [22:24:32] 📦 [bot-0] CollectingHandler.process called {collectionStarted: false, position: {…}, shipType: 'main-ship'}
fsmLogger.ts:199 🟠 ACTION [22:24:32] 📦 [bot-0] Starting resource collection {position: {…}, shipType: 'main-ship'}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:32] 🚢 isPathCompleted: Ship reached final destination {currentPosition: {…}, finalTarget: {…}, distance: 0.5954844868183891, threshold: 0.6, pathIndex: 0, …}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:32] 🚢 [main-ship] Path completed {finalPosition: {…}, pathLength: 2}
fsmLogger.ts:207 🟠 ACTION [22:24:35] 📦 [bot-0] Collection completed, sending SHIP_LOAD_RESOURCES
fsmLogger.ts:199 ⚡ EVENT [22:24:35] SHIP_LOAD_RESOURCES {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:199 🔵 INFO [22:24:35] 🎒 [isVehicleOverloaded] Vehicle load status: {totalResources: 0, maxCapacity: 2003, threshold: 1602.4, isOverloaded: false}
fsmLogger.ts:199 🟣 CONDITION [22:24:35] [GUARD] isVehicleOverloaded: false {context: {…}, event: {…}}
fsmLogger.ts:199 🔵 INFO [22:24:35] 🔍 [hasMoreCollectibleTiles] Collectible tiles status: {shipPosition: {…}, collectibleTilesCount: 0, maxDistance: 5, hasMore: false, totalKnownTiles: 0}
fsmLogger.ts:199 🟣 CONDITION [22:24:35] [GUARD] hasMoreCollectibleTiles: false {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:35] 📦 [bot-0] Sortie de l'état SHIP_COLLECTING
fsmLogger.ts:199 🟠 ACTION [22:24:35] 🔄 [bot-0] assignShipLoadResourcesContext called with: {hasContext: true, hasEvent: true, eventType: 'SHIP_LOAD_RESOURCES'}
fsmLogger.ts:199 🟠 ACTION [22:24:35] 📦 [bot-0] Resources loaded onto ship: {collected: {…}, previous: {…}, new: {…}, total: 4}
fsmLogger.ts:199 🔵 INFO [22:24:35] 🔄 [bot-0] assignShipReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'SHIP_LOAD_RESOURCES', currentVehicleState: false}
fsmLogger.ts:199 🔵 INFO [22:24:35] 🔙 [bot-0] Updating vehicle state to returning with target: {basePosition: {…}, baseCoord: {…}, currentPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:35] 🔙 [bot-0] Entrée dans l'état SHIP_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:35] 🚢 [main-ship] Targeting base for return {basePosition: {…}, hasTargetTile: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:35] 🚢 [main-ship] Direct path to base created {newPath: Array(2)}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:35] 🚢 [main-ship] New path calculated {from: {…}, to: {…}, pathLength: 2, isReturning: true, path: Array(2)}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:35] 🚢 [main-ship] Animation ENABLED {shipState: 'collecting_ship_returning', isMoving: true, isActive: true, needsAnimation: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:37] 🏠 [bot-0] Ship reached base (threshold: 0.6) {position: {…}, distance: 0.5927844754414372, TILE_DETECTION_THRESHOLD: 0.6, shipType: 'main-ship'}
fsmLogger.ts:199 ⚡ EVENT [22:24:37] SHIP_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:24:37] 🔙 [bot-0] Sortie de l'état SHIP_RETURNING
fsmLogger.ts:207 🟠 ACTION [22:24:37] 📦 [bot-0] Sortie de l'état COLLECTING
fsmLogger.ts:199 🟠 ACTION [22:24:37] 🔄 [bot-0] assignShipReachedBaseContext called with: {hasContext: true, hasEvent: true, eventType: 'SHIP_REACHES_BASE', currentVehicleState: true}
fsmLogger.ts:207 🟠 ACTION [22:24:37] 🏠 [bot-0] Ship reached base - depositing resources and resetting
fsmLogger.ts:207 🟠 ACTION [22:24:37] 🎭 [bot-0] Maintenance effects placeholder
fsmLogger.ts:199 🚀 MOUVEMENT [22:24:37] 🚢 [main-ship] Animation DISABLED {shipState: 'evaluating', isMoving: false, isActive: true, needsAnimation: false}
fsmLogger.ts:207 🐛 DEBUG [22:24:37] 🚢 [main-ship] No valid target: targetTile=false, returning=false
