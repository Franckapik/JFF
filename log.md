VM19879:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.ts:207 🎮 GAME [20:11:06] Tiles initialized
fsmLogger.ts:207 🎮 GAME [20:11:06] [XFSMStore] Creation bot-0 - Status: active, State: evaluating, StateType: string
fsmLogger.ts:207 🎮 GAME [20:11:06] Bots initialized
fsmLogger.ts:207 🎮 GAME [20:11:06] Players initialized
fsmLogger.ts:207 🎮 GAME [20:11:06] [TileGeneration] Tuile de départ assignée à bot-0:2,3
fsmLogger.ts:207 🎮 GAME [20:11:06] Starting tiles assigned
fsmLogger.ts:199 🎮 GAME [20:11:06] Game fully initialized {players: true, bots: true, tiles: true, startingTiles: true}
fsmLogger.ts:207 🔧 CONTEXT [20:11:06] 🛸 [bot-0] Processing explorer drone initialization
fsmLogger.ts:199 ⚡ EVENT [20:11:06] DRONE_INITIALIZE_REQUEST {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:06] 🏠 [Ship] Transmitting initial position to FSM tracker: {x: 0, y: 0, z: 0}
fsmLogger.ts:199 🐛 DEBUG [20:11:06] 🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event: {position: {…}, shipType: 'ship', botId: 'bot-0'}
fsmLogger.ts:199 🔧 CONTEXT [20:11:06] 🚢 [bot-0] Setting initial ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:199 ⚡ EVENT [20:11:06] SHIP_POSITION_UPDATE {event: {…}, botId: 'bot-0', currentState: 'uninitialized'}
fsmLogger.ts:207 🐛 DEBUG [20:11:06] 🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully
fsmLogger.ts:207 🟠 ACTION [20:11:06] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:11:06] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:199 🔧 CONTEXT [20:11:06] 🛸 [bot-0] Processing explorer drone init request {shipPosition: {…}, initialPosition: undefined, droneType: 'explorer'}
fsmLogger.ts:199 🔧 CONTEXT [20:11:06] 🚢 [bot-0] Setting ship position {position: {…}, shipType: 'ship'}
fsmLogger.ts:207 🎮 GAME [20:11:06] [XFSMStore] Demarrage bot-0 - New Status: active, State: evaluating, StateType: string
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:06] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'docked', isMoving: false}
fsmLogger.ts:207 🔵 INFO [20:11:06] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [20:11:06] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:06] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [20:11:06] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [20:11:06] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [20:11:06] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [20:11:06] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:06] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:11:06] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🐛 DEBUG [20:11:06] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:11:06] 🛸 [bot-0] explorer deploying - distance: 1.72 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:06] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5964966317706317, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [20:11:06] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:06] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [20:11:06] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [20:11:06] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [20:11:06] 📊 [bot-0] Incrémentation exploration: 0 → 1
fsmLogger.ts:207 🟠 ACTION [20:11:06] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:06] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [20:11:08] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [20:11:08] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [20:11:08] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [20:11:08] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [20:11:08] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:08] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:11:08] 🛸 [bot-0] explorer returning - distance: 1.69 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:09] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5952344996359332}
fsmLogger.ts:199 ⚡ EVENT [20:11:09] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:09] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [20:11:09] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:11:09] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:11:09] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [20:11:09] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [20:11:09] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:09] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [20:11:09] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [20:11:09] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [20:11:09] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [20:11:09] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:09] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:11:09] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:09] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:11:09] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:11:09] 🛸 [bot-0] explorer deploying - distance: 3.01 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:11:10] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:11:10] 🛸 [bot-0] explorer deploying - distance: 0.67 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:10] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.596847250055799, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [20:11:10] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:10] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [20:11:10] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [20:11:10] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [20:11:10] 📊 [bot-0] Incrémentation exploration: 1 → 2
fsmLogger.ts:207 🟠 ACTION [20:11:10] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:10] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [20:11:12] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [20:11:12] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [20:11:12] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [20:11:12] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [20:11:12] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:12] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:11:12] 🛸 [bot-0] explorer returning - distance: 2.88 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:13] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.594989638440104}
fsmLogger.ts:199 ⚡ EVENT [20:11:13] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:13] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [20:11:13] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:11:13] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:11:13] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [20:11:13] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:199 🟣 CONDITION [20:11:13] [GUARD] shouldExplore: true {context: {…}, event: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:13] onEvaluatingExit
fsmLogger.ts:199 🔵 INFO [20:11:13] 🔄 [bot-0] assignDroneDeployingContext called with: {hasContext: true, hasEvent: true, eventType: 'NEED_EXPLORING', contextKeys: Array(16)}
fsmLogger.ts:207 🔵 INFO [20:11:13] 🔄 [bot-0] Updating context for drone deployment: NEED_EXPLORING
fsmLogger.ts:199 🔵 INFO [20:11:13] 🚁 [bot-0] Deploying drone for exploration to target: {targetPosition: {…}, shipPosition: {…}, range: 3}
fsmLogger.ts:199 🔵 INFO [20:11:13] ✅ [bot-0] Drone deployment result: {hasDroneFleet: true, explorer: {…}, targetPosition: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:13] 🔍 [bot-0] Entrée dans l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:11:13] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:13] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'deploying', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:11:13] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:11:13] 🛸 [bot-0] explorer deploying - distance: 3.45 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:11:14] 🎯 [bot-0] explorer tracker received position update: {position: {…}, droneState: 'deploying'}
fsmLogger.ts:199 🐛 DEBUG [20:11:14] 🛸 [bot-0] explorer deploying - distance: 0.76 {position: {…}, drone: 'deploying'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:14] Drone reached target (threshold: 0.6) {position: {…}, distance: 0.5989823656803478, TILE_DETECTION_THRESHOLD: 0.6}
fsmLogger.ts:199 ⚡ EVENT [20:11:14] DRONE_REACHES_TILE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:14] 🚁 [bot-0] Sortie de l'état DRONE_DEPLOYING
fsmLogger.ts:199 🔵 INFO [20:11:14] 🔄 [bot-0] assignDroneScanningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_REACHES_TILE', currentDroneState: 'deploying'}
fsmLogger.ts:207 🔵 INFO [20:11:14] 📡 [bot-0] Updating drone state to scanning
fsmLogger.ts:207 🔵 INFO [20:11:14] 📊 [bot-0] Incrémentation exploration: 2 → 3
fsmLogger.ts:207 🟠 ACTION [20:11:14] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:14] 🛸 [explorer] Animation enabled: {targetChanged: false, needsAnimation: true, droneState: 'scanning', isMoving: true}
fsmLogger.ts:207 🟠 ACTION [20:11:16] 📡 [bot-0] Scan terminé, envoi de DRONE_HAS_SCANNED
fsmLogger.ts:207 🟠 ACTION [20:11:16] 📡 [bot-0] Sortie de l'état DRONE_SCANNING
fsmLogger.ts:199 🔵 INFO [20:11:16] 🔄 [bot-0] assignDroneReturningContext called with: {hasContext: true, hasEvent: true, eventType: 'DRONE_HAS_SCANNED', currentDroneState: 'scanning'}
fsmLogger.ts:199 🔵 INFO [20:11:16] 🔙 [bot-0] Updating drone state to returning with target: {shipPosition: {…}, currentDronePosition: undefined}
fsmLogger.ts:207 🟠 ACTION [20:11:16] 🔙 [bot-0] Entrée dans l'état DRONE_RETURNING
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:16] 🛸 [explorer] Animation enabled: {targetChanged: true, needsAnimation: true, droneState: 'returning', isMoving: true}
fsmLogger.ts:199 🐛 DEBUG [20:11:16] 🛸 [bot-0] explorer returning - distance: 2.87 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:17] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.5927000793560289}
fsmLogger.ts:199 ⚡ EVENT [20:11:17] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: {…}}
fsmLogger.ts:207 🟠 ACTION [20:11:17] 🔙 [bot-0] Sortie de l'état DRONE_RETURNING
fsmLogger.ts:207 🟠 ACTION [20:11:17] 🔍 [bot-0] Sortie de l'état EXPLORING
fsmLogger.ts:207 🟠 ACTION [20:11:17] onEvaluatingEntry
fsmLogger.ts:199 🔵 INFO [20:11:17] [Evaluating] Conditions {fuel: 100, damage: 0, needsMaintenance: false, hasCollectibleTiles: false, isShipNotFull: true, …}
fsmLogger.ts:207 🔵 INFO [20:11:17] [Evaluating] → NEED_EXPLORING (need more exploration)
fsmLogger.ts:207 🔵 INFO [20:11:17] [bot-0] shouldExplore: false - déjà 3 explorations dans ce cycle (limite: 2)
fsmLogger.ts:199 🟣 CONDITION [20:11:17] [GUARD] shouldExplore: false {context: {…}, event: {…}}
fsmLogger.ts:199 🐛 DEBUG [20:11:17] 🛸 [bot-0] explorer returning - distance: 0.38 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:18] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.21732585446348435}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:18] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.07951005263681958}
fsmLogger.ts:199 ⚡ EVENT [20:11:18] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:18] 🛸 [bot-0] explorer returning - distance: 0.05 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:19] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.02918086971246477}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:19] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.010519712908980095}
fsmLogger.ts:199 ⚡ EVENT [20:11:19] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:19] 🛸 [bot-0] explorer returning - distance: 0.01 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:20] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.003853018638965549}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:20] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0014107901825634501}
fsmLogger.ts:199 ⚡ EVENT [20:11:20] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:20] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:21] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0005164829296950518}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:21] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00018583092855491756}
fsmLogger.ts:199 ⚡ EVENT [20:11:21] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:21] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:22] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00006813967430388865}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:22] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.000024984738745215096}
fsmLogger.ts:199 ⚡ EVENT [20:11:22] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:22] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:23] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.00000916090167256477}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:23] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0000033595026990293013}
fsmLogger.ts:199 ⚡ EVENT [20:11:23] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:23] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:24] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 0.0000012304248831889407}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:24] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.5089901259731626e-7}
fsmLogger.ts:199 ⚡ EVENT [20:11:24] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:24] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:25] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.6575982909285753e-7}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:25] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.963455058541814e-8}
fsmLogger.ts:199 ⚡ EVENT [20:11:25] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:25] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:26] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.1875321036435065e-8}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:26] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.04164773505385e-9}
fsmLogger.ts:199 ⚡ EVENT [20:11:26] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:26] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:27] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.9490525065187203e-9}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:27] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0801752431400742e-9}
fsmLogger.ts:199 ⚡ EVENT [20:11:27] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:27] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.9697210006973993e-10}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:28] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4588330093027178e-10}
fsmLogger.ts:199 ⚡ EVENT [20:11:28] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:28] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:29] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.3521785219224953e-11}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:29] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.9636500073845704e-11}
fsmLogger.ts:199 ⚡ EVENT [20:11:29] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:29] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.175098815615361e-12}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:30] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.587777194476762e-12}
fsmLogger.ts:199 ⚡ EVENT [20:11:30] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:30] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:31] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.487928986179467e-13}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:31] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.4704273309796916e-13}
fsmLogger.ts:199 ⚡ EVENT [20:11:31] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:31] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:32] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.2383946222555968e-13}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:32] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.454657809318805e-14}
fsmLogger.ts:199 ⚡ EVENT [20:11:32] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:32] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:33] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.6235233346496432e-14}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:33] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.938516891009517e-15}
fsmLogger.ts:199 ⚡ EVENT [20:11:33] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:33] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:34] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.1805477093738735e-15}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:34] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.012839024585396e-16}
fsmLogger.ts:199 ⚡ EVENT [20:11:34] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:34] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:35] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.9409346220018974e-16}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:35] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.0792589634317995e-16}
fsmLogger.ts:199 ⚡ EVENT [20:11:35] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:35] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:36] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.9527874328774044e-17}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:36] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.4492467382730396e-17}
fsmLogger.ts:199 ⚡ EVENT [20:11:36] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:36] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:37] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.311763776088207e-18}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:37] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.948213518901177e-18}
fsmLogger.ts:199 ⚡ EVENT [20:11:37] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:37] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:38] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.141848688435726e-19}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:38] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.623153238787485e-19}
fsmLogger.ts:199 ⚡ EVENT [20:11:38] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:38] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:39] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.610452971812563e-20}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:39] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.4760838454164765e-20}
fsmLogger.ts:199 ⚡ EVENT [20:11:39] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:39] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:40] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.2755486333150116e-20}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:40] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.681510340960682e-21}
fsmLogger.ts:199 ⚡ EVENT [20:11:40] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:40] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:41] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.720133004111409e-21}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:41] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.327378995167336e-22}
fsmLogger.ts:199 ⚡ EVENT [20:11:41] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:41] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:42] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.2856331342584716e-22}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:42] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 8.378801340443721e-23}
fsmLogger.ts:199 ⚡ EVENT [20:11:42] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:42] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:43] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.0760015031857316e-23}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:43] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.1102465593617028e-23}
fsmLogger.ts:199 ⚡ EVENT [20:11:43] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:43] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:44] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.081620414171394e-24}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:44] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.496460153827586e-24}
fsmLogger.ts:199 ⚡ EVENT [20:11:44] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:44] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:45] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 5.488504550337897e-25}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:45] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.0095134216960078e-25}
fsmLogger.ts:199 ⚡ EVENT [20:11:45] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:45] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:46] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 7.370050691882025e-26}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:46] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.706990750531998e-26}
fsmLogger.ts:199 ⚡ EVENT [20:11:46] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:46] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:47] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 9.921349117836367e-27}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:47] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 3.634262154530196e-27}
fsmLogger.ts:199 ⚡ EVENT [20:11:47] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:47] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:48] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.3110024895909658e-27}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:48] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 4.7987386552257e-28}
fsmLogger.ts:199 ⚡ EVENT [20:11:48] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:48] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:49] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 1.764686311073476e-28}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:49] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 6.472653004812834e-29}
fsmLogger.ts:199 ⚡ EVENT [20:11:49] DRONE_REACHES_BASE {event: {…}, botId: 'bot-0', currentState: 'evaluating'}
fsmLogger.ts:199 🐛 DEBUG [20:11:49] 🛸 [bot-0] explorer returning - distance: 0.00 {position: {…}, drone: 'returning'}
fsmLogger.ts:199 🚀 MOUVEMENT [20:11:50] 🏠 [bot-0] explorer reached base - docking complete {position: {…}, distance: 2.3730814768553346e-29}
