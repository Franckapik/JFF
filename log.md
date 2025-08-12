VM1634:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [22:20:17] Tiles initialized
fsmLogger.ts:207 🎮 GAME [22:20:17] [XFSMStore] Creation bot-0 - Status: active, State: evaluating, StateType: string
fsmLogger.ts:207 🎮 GAME [22:20:17] Bots initialized
fsmLogger.ts:207 🎮 GAME [22:20:17] Players initialized
fsmLogger.ts:207 🎮 GAME [22:20:17] [TileGeneration] Tuile de départ assignée à bot-0:1,5
fsmLogger.ts:207 🎮 GAME [22:20:17] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [22:20:17] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'evaluating', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:17] 🚢 [bot-0] Ship initialized at base {basePosition: {…}, shipType: 'main-ship', botId: 'bot-0'}
fsmLogger.ts:199 ⚡ EVENT [22:20:17] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🔵 INFO [22:20:17] 🚢 [bot-0] SHIP_POSITION_UPDATE sent for initialization {shipType: 'main-ship', position: {…}}
fsmLogger.ts:207 🐛 DEBUG [22:20:17] 🚢 [main-ship] No path calculation: selectedTile=false, basePosition=true
fsmLogger.ts:207 🔧 CONTEXT [22:20:17] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [22:20:17] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🟠 ACTION [22:20:17] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:20:17] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [22:20:17] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'main-ship'}
fsmLogger.ts:199 🔧 CONTEXT [22:20:17] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: undefined, droneType: 'explorer'}
fsmLogger.ts:207 🎮 GAME [22:20:17] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating, StateType: string
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'evaluating', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:17] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'docked', isMoving: false}
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'evaluating', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:207 🔵 INFO [22:20:17] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:199 🟣 CONDITION [22:20:17] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:17] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:20:17] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:20:17] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [22:20:17] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 2}
fsmLogger.ts:199 🔵 INFO [22:20:17] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:17] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [22:20:17] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_deploying', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:207 🔵 INFO [22:20:17] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:18] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5998448986530717, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [22:20:18] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:18] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [22:20:18] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [22:20:18] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [22:20:18] 📊 [bot-0] Incrémentation exploration: 0 → 1
fsmLogger.ts:207 🟠 ACTION [22:20:18] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_scanning', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:18] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_scanning', selectedTileForCollection: null, vehicle: {…}}
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_scanning', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:20] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [22:20:20] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [22:20:20] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [22:20:20] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [22:20:20] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_returning', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:20] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:21] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5986848812368081}
fsmLogger.ts:199 ⚡ EVENT [22:20:21] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:21] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [22:20:21] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:199 🔵 INFO [22:20:21] 🔄 [bot-0] assignDroneDockedContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_BASE', currentDroneState: 'returning'}
fsmLogger.ts:207 🔵 INFO [22:20:21] 🏠 [bot-0] Updating drone state to docked and context to evaluating
fsmLogger.ts:207 🟠 ACTION [22:20:21] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:20:21] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'evaluating', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:207 🔵 INFO [22:20:21] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:199 🟣 CONDITION [22:20:21] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:21] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:20:21] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:20:21] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [22:20:21] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 2}
fsmLogger.ts:199 🔵 INFO [22:20:21] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:21] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [22:20:21] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_deploying', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:21] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:207 🔵 INFO [22:20:21] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:22] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5991504309108521, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [22:20:22] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:22] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [22:20:22] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [22:20:22] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [22:20:22] 📊 [bot-0] Incrémentation exploration: 1 → 2
fsmLogger.ts:207 🟠 ACTION [22:20:22] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_scanning', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:22] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [22:20:24] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [22:20:24] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [22:20:24] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [22:20:24] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [22:20:24] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_returning', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:24] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:25] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5949427513249412}
fsmLogger.ts:199 ⚡ EVENT [22:20:25] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:25] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [22:20:25] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:199 🔵 INFO [22:20:25] 🔄 [bot-0] assignDroneDockedContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_BASE', currentDroneState: 'returning'}
fsmLogger.ts:207 🔵 INFO [22:20:25] 🏠 [bot-0] Updating drone state to docked and context to evaluating
fsmLogger.ts:207 🟠 ACTION [22:20:25] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:20:25] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'evaluating', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:207 🔵 INFO [22:20:25] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:199 🟣 CONDITION [22:20:25] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:25] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:20:25] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:20:25] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [22:20:25] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 2}
fsmLogger.ts:199 🔵 INFO [22:20:25] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:25] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [22:20:25] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_deploying', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:25] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:207 🔵 INFO [22:20:25] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:26] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5968966792715034, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [22:20:26] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:26] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [22:20:26] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [22:20:26] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [22:20:26] 📊 [bot-0] Incrémentation exploration: 2 → 3
fsmLogger.ts:207 🟠 ACTION [22:20:26] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_scanning', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:28] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [22:20:28] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [22:20:28] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [22:20:28] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [22:20:28] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'exploring_returning', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:28] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5959504223437775}
fsmLogger.ts:199 ⚡ EVENT [22:20:28] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:28] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [22:20:28] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:199 🔵 INFO [22:20:28] 🔄 [bot-0] assignDroneDockedContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_BASE', currentDroneState: 'returning'}
fsmLogger.ts:207 🔵 INFO [22:20:28] 🏠 [bot-0] Updating drone state to docked and context to evaluating
fsmLogger.ts:207 🟠 ACTION [22:20:28] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [22:20:28] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'evaluating', selectedTileForCollection: null, vehicle: {…}}
fsmLogger.ts:207 🔵 INFO [22:20:28] [Evaluating] → Testing NEED_EXPLORING
fsmLogger.ts:207 🔵 INFO [22:20:28] [bot-0] shouldExplore: false - déjà 3 explorations dans ce cycle (limite: 2)
fsmLogger.ts:199 🟣 CONDITION [22:20:28] [GUARD] shouldExplore: false {context: {…}, event: {…}}
fsmLogger.ts:207 🔵 INFO [22:20:28] [Evaluating] → Testing NEED_COLLECTING (exploration may be complete)
fsmLogger.ts:207 🔵 INFO [22:20:28] [bot-0] shouldCollect: true - Vaisseau prend le relais après 3 explorations par drone
fsmLogger.ts:199 🟣 CONDITION [22:20:28] [GUARD] shouldCollect: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:28] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [22:20:28] 🔄 [bot-0] assignShipMovingToTileContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_COLLECTING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [22:20:28] 🔄 [bot-0] Updating context for ship movement: NEED_COLLECTING
fsmLogger.ts:199 🔵 INFO [22:20:28] 🚢 [bot-0] Setting ship target for collection: {targetPosition: {…}, targetCoord: {…}, currentPosition: {…}}
fsmLogger.ts:199 🔵 INFO [22:20:28] ✅ [bot-0] Ship movement setup result: {hasVehicle: true, targetTile: {…}, isMoving: true, selectedTile: {…}}
fsmLogger.ts:207 🟠 ACTION [22:20:28] 📦 [bot-0] Entrée dans l'état COLLECTING
fsmLogger.ts:207 🟠 ACTION [22:20:28] 🚢 [bot-0] Entrée dans l'état SHIP_MOVING_TO_TILE
Fleet.tsx:85 [Fleet] useShipAnimation context {botId: 'bot-0', currentState: 'collecting_ship_moving_to_tile', selectedTileForCollection: {…}, vehicle: {…}}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:28] 🚢 [main-ship] Animation ENABLED {shipState: 'collecting_ship_moving_to_tile', isMoving: true, isActive: true, needsAnimation: true}
fsmLogger.ts:199 🔵 INFO [22:20:28] 🚢 calculateShipPath: No valid path found {startGridCoord: undefined, targetCoord: '0,0'}
fsmLogger.ts:199 🚀 MOUVEMENT [22:20:28] 🚢 [main-ship] New path calculated {from: {…}, to: '0,0', pathLength: 1, path: Array(1)}
