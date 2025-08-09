VM5014:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [18:33:40] Tiles initialized
fsmLogger.ts:207 🎮 GAME [18:33:40] [XFSMStore] Creation bot-0 - Status: active, State: evaluating, StateType: string
fsmLogger.ts:207 🎮 GAME [18:33:40] Bots initialized
fsmLogger.ts:207 🎮 GAME [18:33:40] Players initialized
fsmLogger.ts:207 🎮 GAME [18:33:40] [TileGeneration] Tuile de départ assignée à bot-0:2,4
fsmLogger.ts:207 🎮 GAME [18:33:40] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [18:33:40] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:207 🔧 CONTEXT [18:33:40] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [18:33:40] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [18:33:40] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0, z: 0}
fsmLogger.ts:199 🐛 DEBUG [18:33:40] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [18:33:40] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [18:33:40] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [18:33:40] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🟠 ACTION [18:33:40] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [18:33:40] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [18:33:40] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: undefined, droneType: 'explorer'}
fsmLogger.ts:199 🔧 CONTEXT [18:33:40] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:207 🎮 GAME [18:33:40] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating, StateType: string
fsmLogger.ts:199 🚀 MOUVEMENT [18:33:40] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'docked', isMoving: false}
fsmLogger.ts:207 🔵 INFO [18:33:40] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [18:33:40] [GUARD] __explorationGuardsPlaceholder: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [18:33:40] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [18:33:40] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [18:33:40] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:207 🔵 INFO [18:33:40] 🚁 [bot-0] Deploying drone for exploration
fsmLogger.ts:199 🐛 DEBUG [18:33:40] [selectTargetTileInRadiusForDrone] Selected target tile {shipPosition: {…}, targetPosition: {…}, range: 3, tilesInRange: 12, selectedTile: '4,3'}
fsmLogger.ts:199 🔵 INFO [18:33:40] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [18:33:40] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [18:33:40] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🐛 DEBUG [18:33:40] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [18:33:40] 🛸 [bot-0] explorer deploying - distance: 1.71 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [18:33:41] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.593456973340406, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [18:33:41] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [18:33:41] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [18:33:41] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [18:33:41] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🟠 ACTION [18:33:41] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [18:33:41] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [18:33:43] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [18:33:43] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [18:33:43] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:207 🔵 INFO [18:33:43] 🔙 [bot-0] Updating drone state to returning
fsmLogger.ts:207 🟠 ACTION [18:33:43] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [18:33:43] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [18:33:43] 🛸 [bot-0] explorer returning - distance: 1.72 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:44] 🛸 [bot-0] explorer returning - distance: 1.79 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:45] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:46] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:47] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:48] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:49] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:50] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:51] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🐛 DEBUG [18:33:52] 🛸 [bot-0] explorer returning - distance: 1.80 {position: {…}, drone: 'returning'}
